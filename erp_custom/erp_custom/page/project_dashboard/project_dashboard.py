
# import frappe
# import json
# from frappe.utils import flt


# # ====================== FILTER OPTIONS ============================
# @frappe.whitelist()
# def get_project_filter_options():

#     project_ids = frappe.db.sql("""
#         SELECT DISTINCT name
#         FROM `tabProject`
#         WHERE name IS NOT NULL
#         AND name != ''
#         ORDER BY name
#     """, as_dict=False)

#     customers = frappe.db.sql("""
#         SELECT DISTINCT customer
#         FROM `tabProject`
#         WHERE customer IS NOT NULL
#         AND customer != ''
#         ORDER BY customer
#     """, as_dict=False)

#     statuses = frappe.db.sql("""
#         SELECT DISTINCT status
#         FROM `tabProject`
#         WHERE status IS NOT NULL
#         AND status != ''
#         ORDER BY status
#     """, as_dict=False)

#     project_types = frappe.db.sql("""
#         SELECT DISTINCT project_type
#         FROM `tabProject`
#         WHERE project_type IS NOT NULL
#         AND project_type != ''
#         ORDER BY project_type
#     """, as_dict=False)

#     priorities = frappe.db.sql("""
#         SELECT DISTINCT priority
#         FROM `tabProject`
#         WHERE priority IS NOT NULL
#         AND priority != ''
#         ORDER BY priority
#     """, as_dict=False)

#     tags = frappe.db.sql("""
#         SELECT DISTINCT item_code
#         FROM `tabSales Order Item`
#         WHERE item_code IS NOT NULL
#         AND item_code != ''
#         ORDER BY item_code
#     """, as_dict=False)

#     fiscal_years = frappe.db.sql("""
#         SELECT DISTINCT name
#         FROM `tabFiscal Year`
#         WHERE name IS NOT NULL
#         AND name != ''
#         ORDER BY name DESC
#     """, as_dict=False)

#     return {
#         "project_ids": [row[0] for row in project_ids],
#         "customers": [row[0] for row in customers],
#         "statuses": [row[0] for row in statuses],
#         "project_types": [row[0] for row in project_types],
#         "priorities": [row[0] for row in priorities],
#         "tags": [row[0] for row in tags],
#         "fiscal_years": [row[0] for row in fiscal_years]
#     }


# # ====================== HELPER - NORMALIZE MULTI SELECT VALUES ==================================
# def normalize_filter_values(value):

#     if not value:
#         return []

#     if isinstance(value, str):
#         return [value]

#     if isinstance(value, list):
#         return [item for item in value if item]

#     return []

# # ======================= PROJECT DASHBOARD ================================
# @frappe.whitelist()
# def get_project_dashboard_data(filters=None, limit=20, offset=0):

#     # -------------------- FILTER DATA -------------------------------
#     if isinstance(filters, str):
#         filters = json.loads(filters)

#     filters = filters or {}

#     conditions = []
#     values = {}

#     # ==================== PROJECT ID ================================
#     project_ids = normalize_filter_values(filters.get("project_id"))
#     if project_ids:
#         placeholders = []

#         for index, project_id in enumerate(project_ids):
#             key = f"project_id_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = project_id

#         conditions.append(f"p.name IN ({', '.join(placeholders)})")

#     # ==================== CUSTOMER ================================
#     customers = normalize_filter_values(filters.get("customer"))
#     if customers:
#         placeholders = []

#         for index, customer in enumerate(customers):
#             key = f"customer_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = customer

#         conditions.append(f"p.customer IN ({', '.join(placeholders)})")

#     # ================== STATUS =====================
#     statuses = normalize_filter_values(filters.get("status"))

#     if statuses:
#         placeholders = []

#         for index, status in enumerate(statuses):
#             key = f"status_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = status

#         conditions.append(f"p.status IN ({', '.join(placeholders)})")

#     # ================== PROJECT TYPE ===========================
#     project_types = normalize_filter_values(filters.get("project_type"))

#     if project_types:
#         placeholders = []

#         for index, project_type in enumerate(project_types):
#             key = f"project_type_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = project_type

#         conditions.append(f"p.project_type IN ({', '.join(placeholders)})")

#     # ====================== PRIORITY =============================
#     priorities = normalize_filter_values(filters.get("priority"))

#     if priorities:
#         placeholders = []
#         for index, priority in enumerate(priorities):
#             key = f"priority_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = priority

#         conditions.append(f"p.priority IN ({', '.join(placeholders)})")

#     # ==================== TAG / ITEM CODE =============================
#     tags = normalize_filter_values(filters.get("tag"))

#     if tags:
#         placeholders = []

#         for index, tag in enumerate(tags):
#             key = f"tag_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = tag

#         conditions.append("""
#             EXISTS (
#                 SELECT 1
#                 FROM `tabSales Order Item` soi_filter
#                 WHERE soi_filter.project = p.name
#                 AND soi_filter.item_code IN (
#                     %s
#                 )
#             )
#         """ % ", ".join(placeholders))

#     # ====================== FISCAL YEAR ============================
#     fiscal_years = normalize_filter_values(filters.get("fiscal_year"))
#     if fiscal_years:

#         placeholders = []

#         for index, fiscal_year in enumerate(fiscal_years):
#             key = f"fiscal_year_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = fiscal_year

#         conditions.append("""
#             EXISTS (
#                 SELECT 1
#                 FROM `tabSales Order` so_filter
#                 WHERE so_filter.name = p.sales_order
#                 AND so_filter.custom_financial_year IN (
#                     %s
#                 )
#             )
#         """ % ", ".join(placeholders))

#     # ======================= WHERE CLAUSE ======================
#     where_clause = ""

#     if conditions:
#         where_clause = "WHERE " + " AND ".join(conditions)

#     # ========================================================
#     # TOTAL PROJECTS + TOTAL VALUES
#     # Important: This calculates totals for ALL filtered projects, not just the current page.
#     # ========================================================
#     totals = frappe.db.sql(f"""
#         SELECT
#             COUNT(*) AS total_projects,
#             COALESCE(SUM(basic_value), 0) AS total_basic_value,
#             COALESCE(SUM(taxes), 0) AS total_taxes,
#             COALESCE(SUM(purchase_value), 0) AS total_purchase_value

#         FROM (
#             SELECT
#                 p.name,
#                 COALESCE(MAX(so.total), 0) AS basic_value,
#                 COALESCE(MAX(so.total_taxes_and_charges), 0) AS taxes,
#                 COALESCE(MAX(so.grand_total), 0) AS purchase_value
#             FROM `tabProject` p
#             LEFT JOIN `tabSales Order` so
#                 ON so.name = p.sales_order
#             {where_clause}
#             GROUP BY p.name
#         ) AS project_totals
#     """, values, as_dict=True)[0]

#     total_projects = int(totals.get("total_projects") or 0)
#     total_basic_value = flt(totals.get("total_basic_value") or 0)
#     total_taxes = flt(totals.get("total_taxes") or 0)
#     total_purchase_value = flt(totals.get("total_purchase_value") or 0)

#     # ==================== CUSTOMER COUNT =============================
#     customer_data = frappe.db.sql(f"""
#         SELECT
#             COUNT(DISTINCT p.customer) AS customer_count
#         FROM `tabProject` p
#         LEFT JOIN `tabSales Order` so
#             ON so.name = p.sales_order

#         {where_clause}
#     """, values, as_dict=True)[0]

#     customer_count = int(customer_data.get("customer_count") or 0)

#     # ================= PAGINATION =============================
#     limit = int(limit or 20)
#     offset = int(offset or 0)
#     limit_clause = ""

#     if limit > 0:
#         limit_clause = """
#             LIMIT %(limit)s
#             OFFSET %(offset)s
#         """

#         values["limit"] = limit
#         values["offset"] = offset

#     # ======================= PROJECT DATA ==============================
#     projects = frappe.db.sql(f"""
#         SELECT
#             p.name,
#             p.customer,
#             p.status,
#             p.project_type,
#             p.priority,
#             so.custom_financial_year AS fiscal_year,
#             COALESCE(so.total, 0) AS basic_value,
#             COALESCE(so.total_taxes_and_charges, 0) AS taxes,
#             COALESCE(so.grand_total, 0) AS purchase_value,
#             COALESCE(
#                 GROUP_CONCAT(DISTINCT soi.item_code
#                     ORDER BY soi.item_code SEPARATOR ', '), '') AS tag
#         FROM `tabProject` p
#         LEFT JOIN `tabSales Order` so
#             ON so.name = p.sales_order
#         LEFT JOIN `tabSales Order Item` soi
#             ON soi.project = p.name
#         {where_clause}

#         GROUP BY
#             p.name,
#             p.customer,
#             p.status,
#             p.project_type,
#             p.priority,
#             so.custom_financial_year,
#             so.total,
#             so.total_taxes_and_charges,
#             so.grand_total
#         ORDER BY p.creation DESC

#         {limit_clause}
#     """, values, as_dict=True)

#     # ====================== RETURN ===========================
#     return {
#         "total_projects": total_projects,
#         "total_basic_value": total_basic_value,
#         "total_taxes": total_taxes,
#         "total_purchase_value": total_purchase_value,
#         "customer_count": customer_count,
#         "projects": projects
#     }


# # ======================================================================
# # ======================= CHART DATA (NEW - ADDITIVE ONLY) ============
# # This is a brand new whitelisted method. It does NOT modify or call
# # get_project_dashboard_data above - it rebuilds the same filter
# # conditions independently, using distinct SQL param keys ("chart_*")
# # so nothing in the existing method is touched or affected.
# # ======================================================================
# @frappe.whitelist()
# def get_project_chart_data(filters=None):

#     # -------------------- FILTER DATA -------------------------------
#     if isinstance(filters, str):
#         filters = json.loads(filters)

#     filters = filters or {}

#     conditions = []
#     values = {}

#     # ==================== PROJECT ID ================================
#     project_ids = normalize_filter_values(filters.get("project_id"))
#     if project_ids:
#         placeholders = []

#         for index, project_id in enumerate(project_ids):
#             key = f"chart_project_id_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = project_id

#         conditions.append(f"p.name IN ({', '.join(placeholders)})")

#     # ==================== CUSTOMER ================================
#     customers = normalize_filter_values(filters.get("customer"))
#     if customers:
#         placeholders = []

#         for index, customer in enumerate(customers):
#             key = f"chart_customer_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = customer

#         conditions.append(f"p.customer IN ({', '.join(placeholders)})")

#     # ================== STATUS =====================
#     statuses = normalize_filter_values(filters.get("status"))

#     if statuses:
#         placeholders = []

#         for index, status in enumerate(statuses):
#             key = f"chart_status_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = status

#         conditions.append(f"p.status IN ({', '.join(placeholders)})")

#     # ================== PROJECT TYPE ===========================
#     project_types = normalize_filter_values(filters.get("project_type"))

#     if project_types:
#         placeholders = []

#         for index, project_type in enumerate(project_types):
#             key = f"chart_project_type_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = project_type

#         conditions.append(f"p.project_type IN ({', '.join(placeholders)})")

#     # ====================== PRIORITY =============================
#     priorities = normalize_filter_values(filters.get("priority"))

#     if priorities:
#         placeholders = []
#         for index, priority in enumerate(priorities):
#             key = f"chart_priority_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = priority

#         conditions.append(f"p.priority IN ({', '.join(placeholders)})")

#     # ==================== TAG / ITEM CODE =============================
#     tags = normalize_filter_values(filters.get("tag"))

#     if tags:
#         placeholders = []

#         for index, tag in enumerate(tags):
#             key = f"chart_tag_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = tag

#         conditions.append("""
#             EXISTS (
#                 SELECT 1
#                 FROM `tabSales Order Item` soi_filter
#                 WHERE soi_filter.project = p.name
#                 AND soi_filter.item_code IN (
#                     %s
#                 )
#             )
#         """ % ", ".join(placeholders))

#     # ====================== FISCAL YEAR ============================
#     fiscal_years = normalize_filter_values(filters.get("fiscal_year"))
#     if fiscal_years:

#         placeholders = []

#         for index, fiscal_year in enumerate(fiscal_years):
#             key = f"chart_fiscal_year_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = fiscal_year

#         conditions.append("""
#             EXISTS (
#                 SELECT 1
#                 FROM `tabSales Order` so_filter
#                 WHERE so_filter.name = p.sales_order
#                 AND so_filter.custom_financial_year IN (
#                     %s
#                 )
#             )
#         """ % ", ".join(placeholders))

#     # ======================= WHERE CLAUSE (base) ======================
#     where_clause = ""

#     if conditions:
#         where_clause = "WHERE " + " AND ".join(conditions)

#     # ==================== CUSTOMER WISE SPLIT =========================
#     # One row per customer: number of projects + total purchase value (grand_total).
#     customer_values = dict(values)
#     customer_values["chart_not_set_label"] = frappe._("Not Set")

#     customer_wise = frappe.db.sql(f"""
#         SELECT
#             COALESCE(p.customer, %(chart_not_set_label)s) AS customer,
#             COUNT(DISTINCT p.name) AS project_count,
#             COALESCE(SUM(so.grand_total), 0) AS purchase_value
#         FROM `tabProject` p
#         LEFT JOIN `tabSales Order` so
#             ON so.name = p.sales_order
#         {where_clause}
#         GROUP BY p.customer
#         ORDER BY purchase_value DESC
#     """, customer_values, as_dict=True)

#     # ==================== PRODUCT (ITEM CODE) WISE SPLIT ===============
#     # Build a separate condition list for this query since it needs an
#     # extra "item_code IS NOT NULL" condition - kept isolated so the
#     # customer query and get_project_dashboard_data remain unaffected.
#     product_conditions = list(conditions)
#     product_conditions.append("soi.item_code IS NOT NULL")
#     product_conditions.append("soi.item_code != ''")

#     product_where_clause = "WHERE " + " AND ".join(product_conditions)

#     product_wise = frappe.db.sql(f"""
#         SELECT
#             soi.item_code AS item_code,
#             COUNT(DISTINCT p.name) AS project_count,
#             COALESCE(SUM(soi.amount), 0) AS item_value
#         FROM `tabProject` p
#         INNER JOIN `tabSales Order Item` soi
#             ON soi.project = p.name
#         {product_where_clause}
#         GROUP BY soi.item_code
#         ORDER BY item_value DESC
#     """, values, as_dict=True)

#     # ====================== RETURN ===========================
#     return {
#         "customer_wise": customer_wise,
#         "product_wise": product_wise
#     }



# SEP 09
# import frappe
# import json
# from frappe import _
# from frappe.utils import flt


# # ====================== FILTER OPTIONS ============================
# @frappe.whitelist()
# def get_project_filter_options():

#     project_ids = frappe.db.sql("""
#         SELECT DISTINCT name
#         FROM `tabProject`
#         WHERE name IS NOT NULL
#         AND name != ''
#         ORDER BY name
#     """, as_dict=False)

#     customers = frappe.db.sql("""
#         SELECT DISTINCT customer
#         FROM `tabProject`
#         WHERE customer IS NOT NULL
#         AND customer != ''
#         ORDER BY customer
#     """, as_dict=False)

#     statuses = frappe.db.sql("""
#         SELECT DISTINCT status
#         FROM `tabProject`
#         WHERE status IS NOT NULL
#         AND status != ''
#         ORDER BY status
#     """, as_dict=False)

#     project_types = frappe.db.sql("""
#         SELECT DISTINCT project_type
#         FROM `tabProject`
#         WHERE project_type IS NOT NULL
#         AND project_type != ''
#         ORDER BY project_type
#     """, as_dict=False)

#     priorities = frappe.db.sql("""
#         SELECT DISTINCT priority
#         FROM `tabProject`
#         WHERE priority IS NOT NULL
#         AND priority != ''
#         ORDER BY priority
#     """, as_dict=False)

#     tags = frappe.db.sql("""
#         SELECT DISTINCT item_code
#         FROM `tabSales Order Item`
#         WHERE item_code IS NOT NULL
#         AND item_code != ''
#         ORDER BY item_code
#     """, as_dict=False)

#     fiscal_years = frappe.db.sql("""
#         SELECT DISTINCT name
#         FROM `tabFiscal Year`
#         WHERE name IS NOT NULL
#         AND name != ''
#         ORDER BY name DESC
#     """, as_dict=False)

#     # ==================== PORTFOLIO ============================
#     portfolios = frappe.db.sql("""
#         SELECT DISTINCT custom_portfolio
#         FROM `tabProject`
#         WHERE custom_portfolio IS NOT NULL
#         AND custom_portfolio != ''
#         ORDER BY custom_portfolio
#     """, as_dict=False)

#     return {
#         "project_ids": [row[0] for row in project_ids],
#         "customers": [row[0] for row in customers],
#         "statuses": [row[0] for row in statuses],
#         "project_types": [row[0] for row in project_types],
#         "priorities": [row[0] for row in priorities],
#         "tags": [row[0] for row in tags],
#         "fiscal_years": [row[0] for row in fiscal_years],
#         "portfolios": [row[0] for row in portfolios]
#     }


# # ====================== HELPER - NORMALIZE MULTI SELECT VALUES ==================================
# def normalize_filter_values(value):

#     if not value:
#         return []

#     if isinstance(value, str):
#         return [value]

#     if isinstance(value, list):
#         return [item for item in value if item]

#     return []


# # ====================== HELPER - BUILD SHARED CONDITIONS ==================================
# # Builds the exact same set of conditions used by both get_project_dashboard_data
# # and get_project_chart_data, keyed by a prefix so SQL param names never collide
# # between the two callers.
# def build_project_conditions(filters, prefix):

#     conditions = []
#     values = {}

#     # ==================== PROJECT ID ================================
#     project_ids = normalize_filter_values(filters.get("project_id"))
#     if project_ids:
#         placeholders = []

#         for index, project_id in enumerate(project_ids):
#             key = f"{prefix}project_id_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = project_id

#         conditions.append(f"p.name IN ({', '.join(placeholders)})")

#     # ==================== CUSTOMER ================================
#     customers = normalize_filter_values(filters.get("customer"))
#     if customers:
#         placeholders = []

#         for index, customer in enumerate(customers):
#             key = f"{prefix}customer_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = customer

#         conditions.append(f"p.customer IN ({', '.join(placeholders)})")

#     # ================== STATUS =====================
#     statuses = normalize_filter_values(filters.get("status"))

#     if statuses:
#         placeholders = []

#         for index, status in enumerate(statuses):
#             key = f"{prefix}status_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = status

#         conditions.append(f"p.status IN ({', '.join(placeholders)})")

#     # ================== PROJECT TYPE ===========================
#     project_types = normalize_filter_values(filters.get("project_type"))

#     if project_types:
#         placeholders = []

#         for index, project_type in enumerate(project_types):
#             key = f"{prefix}project_type_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = project_type

#         conditions.append(f"p.project_type IN ({', '.join(placeholders)})")

#     # ====================== PRIORITY =============================
#     priorities = normalize_filter_values(filters.get("priority"))

#     if priorities:
#         placeholders = []
#         for index, priority in enumerate(priorities):
#             key = f"{prefix}priority_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = priority

#         conditions.append(f"p.priority IN ({', '.join(placeholders)})")

#     # ==================== PORTFOLIO =============================
#     portfolios = normalize_filter_values(filters.get("custom_portfolio"))

#     if portfolios:
#         placeholders = []
#         for index, portfolio in enumerate(portfolios):
#             key = f"{prefix}portfolio_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = portfolio

#         conditions.append(f"p.custom_portfolio IN ({', '.join(placeholders)})")

#     # ==================== TAG / ITEM CODE =============================
#     tags = normalize_filter_values(filters.get("tag"))

#     if tags:
#         placeholders = []

#         for index, tag in enumerate(tags):
#             key = f"{prefix}tag_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = tag

#         conditions.append("""
#             EXISTS (
#                 SELECT 1
#                 FROM `tabSales Order Item` soi_filter
#                 WHERE soi_filter.project = p.name
#                 AND soi_filter.item_code IN (
#                     %s
#                 )
#             )
#         """ % ", ".join(placeholders))

#     # ====================== FISCAL YEAR ============================
#     fiscal_years = normalize_filter_values(filters.get("fiscal_year"))
#     if fiscal_years:

#         placeholders = []

#         for index, fiscal_year in enumerate(fiscal_years):
#             key = f"{prefix}fiscal_year_{index}"
#             placeholders.append(f"%({key})s")
#             values[key] = fiscal_year

#         conditions.append("""
#             EXISTS (
#                 SELECT 1
#                 FROM `tabSales Order` so_filter
#                 WHERE so_filter.name = p.sales_order
#                 AND so_filter.custom_financial_year IN (
#                     %s
#                 )
#             )
#         """ % ", ".join(placeholders))

#     return conditions, values


# # ======================= PROJECT DASHBOARD ================================
# @frappe.whitelist()
# def get_project_dashboard_data(filters=None, limit=20, offset=0):

#     # -------------------- FILTER DATA -------------------------------
#     if isinstance(filters, str):
#         filters = json.loads(filters)

#     filters = filters or {}

#     conditions, values = build_project_conditions(filters, prefix="")

#     # ======================= WHERE CLAUSE ======================
#     where_clause = ""

#     if conditions:
#         where_clause = "WHERE " + " AND ".join(conditions)

#     # ========================================================
#     # TOTAL PROJECTS + TOTAL VALUES
#     # Basic Value / Taxes / Grand Total are derived from the
#     # Sales Order Item child table (amount, igst_amount, cgst_amount,
#     # sgst_amount), summed per project - NOT from the Sales Order header.
#     # Important: This calculates totals for ALL filtered projects, not just the current page.
#     # ========================================================
#     totals = frappe.db.sql(f"""
#         SELECT
#             COUNT(*) AS total_projects,
#             COALESCE(SUM(basic_value), 0) AS total_basic_value,
#             COALESCE(SUM(taxes), 0) AS total_taxes,
#             COALESCE(SUM(purchase_value), 0) AS total_purchase_value

#         FROM (
#             SELECT
#                 p.name,
#                 COALESCE(SUM(COALESCE(soi.amount, 0)), 0) AS basic_value,
#                 COALESCE(
#                     SUM(COALESCE(soi.igst_amount, 0) + COALESCE(soi.cgst_amount, 0) + COALESCE(soi.sgst_amount, 0)), 0) AS taxes,
#                 COALESCE(
#                     SUM(COALESCE(soi.amount, 0) + COALESCE(soi.igst_amount, 0) + COALESCE(soi.cgst_amount, 0) + COALESCE(soi.sgst_amount, 0)), 0) AS purchase_value
#             FROM `tabProject` p
#             LEFT JOIN `tabSales Order Item` soi
#                 ON soi.project = p.name
#             {where_clause}
#             GROUP BY p.name
#         ) AS project_totals
#     """, values, as_dict=True)[0]

#     total_projects = int(totals.get("total_projects") or 0)
#     total_basic_value = flt(totals.get("total_basic_value") or 0)
#     total_taxes = flt(totals.get("total_taxes") or 0)
#     total_purchase_value = flt(totals.get("total_purchase_value") or 0)

#     # ==================== CUSTOMER COUNT =============================
#     customer_data = frappe.db.sql(f"""
#         SELECT
#             COUNT(DISTINCT p.customer) AS customer_count
#         FROM `tabProject` p
#         {where_clause}
#     """, values, as_dict=True)[0]

#     customer_count = int(customer_data.get("customer_count") or 0)

#     # ================= PAGINATION =============================
#     limit = int(limit or 20)
#     offset = int(offset or 0)
#     limit_clause = ""

#     if limit > 0:
#         limit_clause = """
#             LIMIT %(limit)s
#             OFFSET %(offset)s
#         """

#         values["limit"] = limit
#         values["offset"] = offset

#     # ======================= PROJECT DATA ==============================
#     # item_code / item_name / qty are GROUP_CONCAT'd in the same order
#     # (soi.idx) so the three lists line up position-by-position for a
#     # given project row. DISTINCT is intentionally NOT used here (on any
#     # of the three) so a repeated item_code with a different qty doesn't
#     # break that alignment.
#     projects = frappe.db.sql(f"""
#         SELECT
#             p.name,
#             p.customer,
#             p.status,
#             p.project_type,
#             p.priority,
#             p.custom_portfolio AS portfolio,
#             so.custom_financial_year AS fiscal_year,
#             COALESCE(SUM(COALESCE(soi.amount, 0)), 0) AS basic_value,
#             COALESCE(
#                 SUM(COALESCE(soi.igst_amount, 0) + COALESCE(soi.cgst_amount, 0) + COALESCE(soi.sgst_amount, 0)), 0) AS taxes,

#             COALESCE(
#                 SUM(COALESCE(soi.amount, 0) + COALESCE(soi.igst_amount, 0) + COALESCE(soi.cgst_amount, 0) + COALESCE(soi.sgst_amount, 0)), 0) AS purchase_value,
#             COALESCE(
#                 GROUP_CONCAT(soi.item_code
#                     ORDER BY soi.idx SEPARATOR ', '), '') AS tag,
#             COALESCE(
#                 GROUP_CONCAT(soi.item_name
#                     ORDER BY soi.idx SEPARATOR ', '), '') AS item_name,
#             COALESCE(
#                 GROUP_CONCAT(soi.qty
#                     ORDER BY soi.idx SEPARATOR ', '), '') AS qty
#         FROM `tabProject` p
#         LEFT JOIN `tabSales Order` so
#             ON so.name = p.sales_order
#         LEFT JOIN `tabSales Order Item` soi
#             ON soi.project = p.name
#         {where_clause}

#         GROUP BY
#             p.name,
#             p.customer,
#             p.status,
#             p.project_type,
#             p.priority,
#             p.custom_portfolio,
#             so.custom_financial_year
#         ORDER BY p.creation DESC

#         {limit_clause}
#     """, values, as_dict=True)

#     # ====================== RETURN ===========================
#     return {
#         "total_projects": total_projects,
#         "total_basic_value": total_basic_value,
#         "total_taxes": total_taxes,
#         "total_purchase_value": total_purchase_value,
#         "customer_count": customer_count,
#         "projects": projects
#     }


# # ======================================================================
# # ======================= CHART DATA (ADDITIVE ONLY) ============
# # Rebuilds the same filter conditions independently (via the shared
# # build_project_conditions helper, using its own "chart_" prefix) so
# # nothing in get_project_dashboard_data is touched or affected.
# # ======================================================================
# @frappe.whitelist()
# def get_project_chart_data(filters=None):

#     # -------------------- FILTER DATA -------------------------------
#     if isinstance(filters, str):
#         filters = json.loads(filters)

#     filters = filters or {}

#     conditions, values = build_project_conditions(filters, prefix="chart_")

#     # ======================= WHERE CLAUSE (base) ======================
#     where_clause = ""

#     if conditions:
#         where_clause = "WHERE " + " AND ".join(conditions)

#     # ==================== CUSTOMER WISE SPLIT =========================
#     # Purchase value = amount + GST (igst + cgst + sgst), summed per
#     # customer, from Sales Order Item.
#     customer_values = dict(values)
#     customer_values["chart_not_set_label"] = _("Not Set")

#     customer_wise = frappe.db.sql(f"""
#         SELECT
#             COALESCE(p.customer, %(chart_not_set_label)s) AS customer,
#             COUNT(DISTINCT p.name) AS project_count,
#             COALESCE(SUM(COALESCE(soi.amount, 0) + COALESCE(soi.igst_amount, 0) + COALESCE(soi.cgst_amount, 0) + COALESCE(soi.sgst_amount, 0)), 0) AS purchase_value
#         FROM `tabProject` p
#         LEFT JOIN `tabSales Order Item` soi
#             ON soi.project = p.name
#         {where_clause}
#         GROUP BY p.customer
#         ORDER BY purchase_value DESC
#     """, customer_values, as_dict=True)

#     # ==================== PORTFOLIO WISE SPLIT ===============
#     # Same value definition (amount + GST), grouped by Project's
#     # custom_portfolio instead of item code.
#     portfolio_wise = frappe.db.sql(f"""
#         SELECT
#             COALESCE(p.custom_portfolio, %(chart_not_set_label)s) AS portfolio,
#             COUNT(DISTINCT p.name) AS project_count,
#             COALESCE(SUM(COALESCE(soi.amount, 0) + COALESCE(soi.igst_amount, 0) + COALESCE(soi.cgst_amount, 0) + COALESCE(soi.sgst_amount, 0)), 0) AS portfolio_value
#         FROM `tabProject` p
#         LEFT JOIN `tabSales Order Item` soi
#             ON soi.project = p.name
#         {where_clause}
#         GROUP BY p.custom_portfolio
#         ORDER BY portfolio_value DESC
#     """, customer_values, as_dict=True)

#     # ====================== RETURN ===========================
#     return {
#         "customer_wise": customer_wise,
#         "portfolio_wise": portfolio_wise
#     }





import frappe
import json
from frappe import _
from frappe.utils import flt


# ================================================================
# FILTER OPTIONS
# ================================================================

@frappe.whitelist()
def get_project_filter_options():

    project_ids = frappe.db.sql("""
        SELECT DISTINCT name
        FROM `tabProject`
        WHERE name IS NOT NULL
        AND name != ''
        ORDER BY name
    """, as_dict=False)

    customers = frappe.db.sql("""
        SELECT DISTINCT customer
        FROM `tabProject`
        WHERE customer IS NOT NULL
        AND customer != ''
        ORDER BY customer
    """, as_dict=False)

    statuses = frappe.db.sql("""
        SELECT DISTINCT status
        FROM `tabProject`
        WHERE status IS NOT NULL
        AND status != ''
        ORDER BY status
    """, as_dict=False)

    project_types = frappe.db.sql("""
        SELECT DISTINCT project_type
        FROM `tabProject`
        WHERE project_type IS NOT NULL
        AND project_type != ''
        ORDER BY project_type
    """, as_dict=False)

    priorities = frappe.db.sql("""
        SELECT DISTINCT priority
        FROM `tabProject`
        WHERE priority IS NOT NULL
        AND priority != ''
        ORDER BY priority
    """, as_dict=False)

    tags = frappe.db.sql("""
        SELECT DISTINCT item_code
        FROM `tabSales Order Item`
        WHERE item_code IS NOT NULL
        AND item_code != ''
        ORDER BY item_code
    """, as_dict=False)

    fiscal_years = frappe.db.sql("""
        SELECT DISTINCT custom_financial_year
        FROM `tabSales Order`
        WHERE custom_financial_year IS NOT NULL
        AND custom_financial_year != ''
        ORDER BY custom_financial_year DESC
    """, as_dict=False)

    # ============================================================
    # PORTFOLIO
    # ============================================================

    portfolios = frappe.db.sql("""
        SELECT DISTINCT custom_portfolio
        FROM `tabProject`
        WHERE custom_portfolio IS NOT NULL
        AND custom_portfolio != ''
        ORDER BY custom_portfolio
    """, as_dict=False)

    return {
        "project_ids": [row[0] for row in project_ids],
        "customers": [row[0] for row in customers],
        "statuses": [row[0] for row in statuses],
        "project_types": [row[0] for row in project_types],
        "priorities": [row[0] for row in priorities],
        "tags": [row[0] for row in tags],
        "fiscal_years": [row[0] for row in fiscal_years],
        "portfolios": [row[0] for row in portfolios]
    }


# ================================================================
# HELPER - NORMALIZE MULTI SELECT VALUES
# ================================================================

def normalize_filter_values(value):

    if not value:
        return []

    if isinstance(value, str):
        return [value]

    if isinstance(value, list):
        return [item for item in value if item]

    return []


# ================================================================
# HELPER - BUILD PROJECT CONDITIONS
# ================================================================

def build_project_conditions(filters, prefix):

    conditions = []
    values = {}

    # ============================================================
    # PROJECT ID
    # ============================================================

    project_ids = normalize_filter_values(
        filters.get("project_id")
    )

    if project_ids:

        placeholders = []

        for index, project_id in enumerate(project_ids):

            key = f"{prefix}project_id_{index}"

            placeholders.append(f"%({key})s")
            values[key] = project_id

        conditions.append(
            f"p.name IN ({', '.join(placeholders)})"
        )

    # ============================================================
    # CUSTOMER
    # ============================================================

    customers = normalize_filter_values(
        filters.get("customer")
    )

    if customers:

        placeholders = []

        for index, customer in enumerate(customers):

            key = f"{prefix}customer_{index}"

            placeholders.append(f"%({key})s")
            values[key] = customer

        conditions.append(
            f"p.customer IN ({', '.join(placeholders)})"
        )

    # ============================================================
    # STATUS
    # ============================================================

    statuses = normalize_filter_values(
        filters.get("status")
    )

    if statuses:

        placeholders = []

        for index, status in enumerate(statuses):

            key = f"{prefix}status_{index}"

            placeholders.append(f"%({key})s")
            values[key] = status

        conditions.append(
            f"p.status IN ({', '.join(placeholders)})"
        )

    # ============================================================
    # PROJECT TYPE
    # ============================================================

    project_types = normalize_filter_values(
        filters.get("project_type")
    )

    if project_types:

        placeholders = []

        for index, project_type in enumerate(project_types):

            key = f"{prefix}project_type_{index}"

            placeholders.append(f"%({key})s")
            values[key] = project_type

        conditions.append(
            f"p.project_type IN ({', '.join(placeholders)})"
        )

    # ============================================================
    # PRIORITY
    # ============================================================

    priorities = normalize_filter_values(
        filters.get("priority")
    )

    if priorities:

        placeholders = []

        for index, priority in enumerate(priorities):

            key = f"{prefix}priority_{index}"

            placeholders.append(f"%({key})s")
            values[key] = priority

        conditions.append(
            f"p.priority IN ({', '.join(placeholders)})"
        )

    # ============================================================
    # PORTFOLIO
    # ============================================================

    portfolios = normalize_filter_values(
        filters.get("custom_portfolio")
    )

    if portfolios:

        placeholders = []

        for index, portfolio in enumerate(portfolios):

            key = f"{prefix}portfolio_{index}"

            placeholders.append(f"%({key})s")
            values[key] = portfolio

        conditions.append(
            f"p.custom_portfolio IN ({', '.join(placeholders)})"
        )

    # ============================================================
    # TAG / ITEM CODE
    # ============================================================

    tags = normalize_filter_values(
        filters.get("tag")
    )

    if tags:

        placeholders = []

        for index, tag in enumerate(tags):

            key = f"{prefix}tag_{index}"

            placeholders.append(f"%({key})s")
            values[key] = tag

        conditions.append(f"""
            EXISTS (
                SELECT 1
                FROM `tabSales Order Item` soi_filter
                WHERE soi_filter.project = p.name
                AND soi_filter.item_code IN (
                    {", ".join(placeholders)}
                )
            )
        """)

    # ============================================================
    # FISCAL YEAR
    # ============================================================

    fiscal_years = normalize_filter_values(
        filters.get("fiscal_year")
    )

    if fiscal_years:

        placeholders = []

        for index, fiscal_year in enumerate(fiscal_years):

            key = f"{prefix}fiscal_year_{index}"

            placeholders.append(f"%({key})s")
            values[key] = fiscal_year

        conditions.append(f"""
            EXISTS (
                SELECT 1
                FROM `tabSales Order` so_filter
                WHERE so_filter.name = p.sales_order
                AND so_filter.custom_financial_year IN (
                    {", ".join(placeholders)}
                )
            )
        """)

    return conditions, values


# ================================================================
# PROJECT DASHBOARD DATA
# ================================================================

@frappe.whitelist()
def get_project_dashboard_data(
    filters=None,
    limit=20,
    offset=0
):

    # ============================================================
    # FILTER DATA
    # ============================================================

    if isinstance(filters, str):
        filters = json.loads(filters)

    filters = filters or {}

    conditions, values = build_project_conditions(
        filters,
        prefix=""
    )

    where_clause = ""

    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    # ============================================================
    # TOTAL PROJECTS + TOTAL VALUES
    # ============================================================

    totals = frappe.db.sql(f"""

        SELECT

            COUNT(*) AS total_projects,

            COALESCE(
                SUM(basic_value),
                0
            ) AS total_basic_value,

            COALESCE(
                SUM(taxes),
                0
            ) AS total_taxes,

            COALESCE(
                SUM(purchase_value),
                0
            ) AS total_purchase_value

        FROM (

            SELECT

                p.name,

                COALESCE(
                    SUM(COALESCE(soi.amount, 0)),
                    0
                ) AS basic_value,

                COALESCE(
                    SUM(
                        COALESCE(soi.igst_amount, 0)
                        +
                        COALESCE(soi.cgst_amount, 0)
                        +
                        COALESCE(soi.sgst_amount, 0)
                    ),
                    0
                ) AS taxes,

                COALESCE(
                    SUM(
                        COALESCE(soi.amount, 0)
                        +
                        COALESCE(soi.igst_amount, 0)
                        +
                        COALESCE(soi.cgst_amount, 0)
                        +
                        COALESCE(soi.sgst_amount, 0)
                    ),
                    0
                ) AS purchase_value

            FROM `tabProject` p

            LEFT JOIN `tabSales Order Item` soi
                ON soi.project = p.name

            {where_clause}

            GROUP BY p.name

        ) AS project_totals

    """, values, as_dict=True)[0]

    total_projects = int(
        totals.get("total_projects") or 0
    )

    total_basic_value = flt(
        totals.get("total_basic_value") or 0
    )

    total_taxes = flt(
        totals.get("total_taxes") or 0
    )

    total_purchase_value = flt(
        totals.get("total_purchase_value") or 0
    )

    # ============================================================
    # CUSTOMER COUNT
    # ============================================================

    customer_data = frappe.db.sql(f"""

        SELECT
            COUNT(DISTINCT p.customer) AS customer_count

        FROM `tabProject` p

        {where_clause}

    """, values, as_dict=True)[0]

    customer_count = int(
        customer_data.get("customer_count") or 0
    )

    # ============================================================
    # PAGINATION
    # ============================================================

    limit = int(limit or 20)
    offset = int(offset or 0)

    limit_clause = ""

    if limit > 0:

        limit_clause = """
            LIMIT %(limit)s
            OFFSET %(offset)s
        """

        values["limit"] = limit
        values["offset"] = offset

    # ============================================================
    # PROJECT DATA
    # ============================================================

    projects = frappe.db.sql(f"""

        SELECT

            p.name,

            p.customer,

            p.status,

            p.project_type,

            p.priority,

            p.custom_portfolio AS portfolio,

            so.custom_financial_year AS fiscal_year,

            COALESCE(
                SUM(COALESCE(soi.amount, 0)),
                0
            ) AS basic_value,

            COALESCE(
                SUM(
                    COALESCE(soi.igst_amount, 0)
                    +
                    COALESCE(soi.cgst_amount, 0)
                    +
                    COALESCE(soi.sgst_amount, 0)
                ),
                0
            ) AS taxes,

            COALESCE(
                SUM(
                    COALESCE(soi.amount, 0)
                    +
                    COALESCE(soi.igst_amount, 0)
                    +
                    COALESCE(soi.cgst_amount, 0)
                    +
                    COALESCE(soi.sgst_amount, 0)
                ),
                0
            ) AS purchase_value,

            COALESCE(
                GROUP_CONCAT(
                    soi.item_code
                    ORDER BY soi.idx
                    SEPARATOR ', '
                ),
                ''
            ) AS tag,

            COALESCE(
                GROUP_CONCAT(
                    soi.item_name
                    ORDER BY soi.idx
                    SEPARATOR ', '
                ),
                ''
            ) AS item_name,

            COALESCE(
                GROUP_CONCAT(
                    soi.qty
                    ORDER BY soi.idx
                    SEPARATOR ', '
                ),
                ''
            ) AS qty

        FROM `tabProject` p

        LEFT JOIN `tabSales Order` so
            ON so.name = p.sales_order

        LEFT JOIN `tabSales Order Item` soi
            ON soi.project = p.name

        {where_clause}

        GROUP BY

            p.name,
            p.customer,
            p.status,
            p.project_type,
            p.priority,
            p.custom_portfolio,
            so.custom_financial_year

        ORDER BY p.creation DESC

        {limit_clause}

    """, values, as_dict=True)

    # ============================================================
    # RETURN
    # ============================================================

    return {

        "total_projects": total_projects,

        "total_basic_value": total_basic_value,

        "total_taxes": total_taxes,

        "total_purchase_value": total_purchase_value,

        "customer_count": customer_count,

        "projects": projects
    }


# ================================================================
# PROJECT CHART DATA
# ================================================================

@frappe.whitelist()
def get_project_chart_data(filters=None):

    # ============================================================
    # FILTER DATA
    # ============================================================

    if isinstance(filters, str):
        filters = json.loads(filters)

    filters = filters or {}

    conditions, values = build_project_conditions(
        filters,
        prefix="chart_"
    )

    where_clause = ""

    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    # ============================================================
    # CUSTOMER WISE
    # ============================================================

    customer_values = dict(values)

    customer_values["chart_not_set_label"] = _("Not Set")

    customer_wise = frappe.db.sql(f"""

        SELECT

            COALESCE(
                p.customer,
                %(chart_not_set_label)s
            ) AS customer,

            COUNT(DISTINCT p.name) AS project_count,

            COALESCE(
                SUM(
                    COALESCE(soi.amount, 0)
                    +
                    COALESCE(soi.igst_amount, 0)
                    +
                    COALESCE(soi.cgst_amount, 0)
                    +
                    COALESCE(soi.sgst_amount, 0)
                ),
                0
            ) AS purchase_value

        FROM `tabProject` p

        LEFT JOIN `tabSales Order Item` soi
            ON soi.project = p.name

        {where_clause}

        GROUP BY p.customer

        ORDER BY purchase_value DESC

    """, customer_values, as_dict=True)

    # ============================================================
    # PORTFOLIO WISE
    # ============================================================

    portfolio_wise = frappe.db.sql(f"""

        SELECT

            COALESCE(
                p.custom_portfolio,
                %(chart_not_set_label)s
            ) AS portfolio,

            COUNT(DISTINCT p.name) AS project_count,

            COALESCE(
                SUM(
                    COALESCE(soi.amount, 0)
                    +
                    COALESCE(soi.igst_amount, 0)
                    +
                    COALESCE(soi.cgst_amount, 0)
                    +
                    COALESCE(soi.sgst_amount, 0)
                ),
                0
            ) AS portfolio_value

        FROM `tabProject` p

        LEFT JOIN `tabSales Order Item` soi
            ON soi.project = p.name

        {where_clause}

        GROUP BY p.custom_portfolio

        ORDER BY portfolio_value DESC

    """, customer_values, as_dict=True)

    # ============================================================
    # RETURN
    # ============================================================

    return {
        "customer_wise": customer_wise,
        "portfolio_wise": portfolio_wise
    }