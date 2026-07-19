
import frappe
from frappe.utils import cint

@frappe.whitelist()
def get_dashboard_data(filters=None):

	# -----------------------------
	# SAFE FILTER PARSING
	# -----------------------------
	if not filters:
		filters = {}
	elif isinstance(filters, str):
		filters = frappe.parse_json(filters)

	# -----------------------------
	# CONDITION BUILDERS
	# -----------------------------
	# Conditions that only touch `Purchase Order` (po) / `Supplier` (sup).
	# with_item=True also applies item / item_group filters (requires poi join).
	# with_schedule_date=False skips the manual "Required By" exact-date filter,
	# used by the rolling next-7-days query below.
	def build_conditions(with_item=True, with_schedule_date=True):
		conditions = []
		if filters.get("supplier"):
			conditions.append("po.supplier = %(supplier)s")
		if filters.get("project"):
			conditions.append("po.project = %(project)s")
		if filters.get("order_type"):
			conditions.append("IFNULL(po.custom_order_type, 'Purchase Order') = %(order_type)s")
		if filters.get("status"):
			conditions.append("IFNULL(po.workflow_state, 'Draft') = %(status)s")
		if filters.get("transaction_date"):
			conditions.append("po.transaction_date = %(transaction_date)s")
		if with_schedule_date and filters.get("schedule_date"):
			conditions.append("po.schedule_date = %(schedule_date)s")
		if with_item:
			if filters.get("item_group"):
				conditions.append("poi.item_group = %(item_group)s")
			if filters.get("item"):
				conditions.append("poi.item_code = %(item)s")
		return conditions

	def build_where(conditions):
		return "WHERE " + " AND ".join(conditions) if conditions else ""

	where_po_only = build_where(build_conditions(with_item=False))
	where_with_item = build_where(build_conditions(with_item=True))

	# Rolling window: today through today + 7 days (inclusive), regardless of
	# the manual "Required By" filter - this is a fixed "what's due soon" view.
	where_upcoming = build_where(
		build_conditions(with_item=True, with_schedule_date=False)
		+ ["po.schedule_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)", "IFNULL(po.status, '') != 'Closed'"]
	)

	# -----------------------------
	# 1. ORDER TYPE COUNTS  (po only)
	# -----------------------------
	order_types = frappe.db.sql(f"""
		SELECT
			CASE
				WHEN po.custom_order_type IS NULL OR po.custom_order_type = '' THEN 'Others'
				ELSE po.custom_order_type
			END AS custom_order_type,

			COUNT(DISTINCT po.name) AS count,

			IFNULL(SUM(po.grand_total), 0) AS total_amount

		FROM `tabPurchase Order` po

		LEFT JOIN `tabSupplier` sup 
			ON sup.name = po.supplier

		{where_po_only}

		GROUP BY 
			CASE
				WHEN po.custom_order_type IS NULL OR po.custom_order_type = '' THEN 'Others'
				ELSE po.custom_order_type
			END

		ORDER BY
			CASE 
				WHEN custom_order_type = 'Purchase Order' THEN 1
				WHEN custom_order_type = 'Work Order' THEN 2
				WHEN custom_order_type = 'Transport Order' THEN 3
				WHEN custom_order_type = 'Others' THEN 4
				ELSE 5
			END
	""", filters, as_dict=True)

	# -----------------------------
	# 2. TOP Tables
	# -----------------------------
	# Top Suppliers (po only)
	top_suppliers = frappe.db.sql(f"""
    SELECT
        po.supplier AS supplier,
        COUNT(DISTINCT po.name) AS count,
        IFNULL(SUM(po.grand_total), 0) AS total_amount
    FROM `tabPurchase Order` po
    LEFT JOIN `tabSupplier` sup ON sup.name = po.supplier
    {where_po_only}
    GROUP BY po.supplier
    ORDER BY SUM(po.grand_total) DESC
    LIMIT 10
""", filters, as_dict=True)

	# Top Items (joins poi)
	top_items = frappe.db.sql(f"""
		SELECT
			poi.item_code AS item,
			SUM(poi.qty) AS qty,
			SUM(poi.amount) AS total_amount
		FROM `tabPurchase Order Item` poi
		INNER JOIN `tabPurchase Order` po ON po.name = poi.parent
		LEFT JOIN `tabSupplier` sup ON sup.name = po.supplier
		{where_with_item}
		GROUP BY poi.item_code
		ORDER BY SUM(poi.amount) DESC
		LIMIT 10
	""", filters, as_dict=True)

	# Top Projects
	top_projects = frappe.db.sql(f"""
		SELECT
			po.project,

			COUNT(DISTINCT po.name) AS count,

			IFNULL((
				SELECT SUM(so.grand_total)
				FROM `tabSales Order` so
				WHERE so.project = po.project
				AND so.docstatus = 1
			), 0) AS so_grand_total,

			SUM(po.grand_total) AS total_amount

		FROM `tabPurchase Order` po

		LEFT JOIN `tabSupplier` sup
			ON sup.name = po.supplier

		{ where_po_only + (" AND " if where_po_only else "WHERE ") + "IFNULL(po.workflow_state, 'Draft') != 'Cancelled'" }

		GROUP BY po.project

		ORDER BY total_amount DESC

		LIMIT 10
	""", filters, as_dict=True)

	# Top Item Group (joins poi)
	top_item_groups = frappe.db.sql(f"""
		SELECT
			poi.item_group,
			COUNT(DISTINCT po.name) AS count,
			SUM(poi.amount) AS total_amount
		FROM `tabPurchase Order Item` poi
		INNER JOIN `tabPurchase Order` po ON po.name = poi.parent
		LEFT JOIN `tabSupplier` sup ON sup.name = po.supplier
		{where_with_item}
		GROUP BY poi.item_group
		ORDER BY SUM(poi.amount) DESC
		LIMIT 10
	""", filters, as_dict=True)

	# -----------------------------
	# 3. WORKFLOW STATUS COUNTS (po only)
	# -----------------------------
	status_counts = frappe.db.sql(f"""
		SELECT
			IFNULL(po.workflow_state, 'Draft') AS workflow_state,
			COUNT(DISTINCT po.name) AS count
		FROM `tabPurchase Order` po
		LEFT JOIN `tabSupplier` sup ON sup.name = po.supplier
		{where_po_only}
		GROUP BY po.workflow_state
	""", filters, as_dict=True)

	# -----------------------------
	# 4. FULL PURCHASE ORDER LIST (respects all filters, incl. item/item_group/status)
	# -----------------------------
	limit = cint(filters.get("limit") or 20)
	offset = cint(filters.get("offset") or 0)

	full_po_list = frappe.db.sql(f"""
		SELECT
			po.name,
			po.supplier,
			po.project,
			po.transaction_date,
			po.schedule_date,
			IFNULL(po.custom_order_type, 'Purchase Order') AS custom_order_type,
			IFNULL(po.workflow_state, 'Draft') AS workflow_state,
			IFNULL(po.grand_total, 0) AS grand_total
		FROM `tabPurchase Order` po
		LEFT JOIN `tabPurchase Order Item` poi
			ON poi.parent = po.name
		LEFT JOIN `tabSupplier` sup
			ON sup.name = po.supplier
		{where_with_item}
		GROUP BY po.name
		ORDER BY po.transaction_date DESC, po.name DESC
		LIMIT %(limit)s OFFSET %(offset)s
	""", {
		**filters,
		"limit": limit,
		"offset": offset
	}, as_dict=True)

	# -----------------------------
	# 5. REQUIRED BY - NEXT 7 DAYS (rolling window from today)
	# -----------------------------
	upcoming_required_by = frappe.db.sql(f"""
		SELECT
			po.name,
			po.supplier,
			po.project,
			po.transaction_date,
			po.schedule_date,
			IFNULL(po.custom_order_type, 'Purchase Order') AS custom_order_type,
			IFNULL(po.workflow_state, 'Draft') AS workflow_state,
			IFNULL(po.grand_total, 0) AS grand_total
		FROM `tabPurchase Order` po
		LEFT JOIN `tabPurchase Order Item` poi ON poi.parent = po.name
		LEFT JOIN `tabSupplier` sup ON sup.name = po.supplier
		{where_upcoming}
		GROUP BY po.name
		ORDER BY po.schedule_date ASC, po.name ASC
	""", filters, as_dict=True)

	# -----------------------------
	# 6. RFQ COUNT
	# -----------------------------
	rfq_conditions = []

	if filters.get("transaction_date"):
		rfq_conditions.append("transaction_date = %(transaction_date)s")

	where_rfq = "WHERE " + " AND ".join(rfq_conditions) if rfq_conditions else ""


	rfq_result = frappe.db.sql(f"""
		SELECT COUNT(name) AS count FROM `tabRequest for Quotation` {where_rfq} """, filters, as_dict=True)

	rfq_count = rfq_result[0].count if rfq_result else 0
	

	# -----------------------------
	# FINAL SAFE RESPONSE
	# -----------------------------
	return {
		"order_types": order_types or [],
		"top_suppliers": top_suppliers or [],
		"top_items": top_items or [],
		"top_projects": top_projects or [],
		"top_item_groups": top_item_groups or [],
		"status_counts": status_counts or [],
		"full_po_list": full_po_list or [],
		"upcoming_required_by": upcoming_required_by or [],
		"rfq_count": rfq_count
	}