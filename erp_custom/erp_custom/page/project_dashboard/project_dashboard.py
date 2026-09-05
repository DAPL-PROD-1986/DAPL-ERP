
# import frappe
# import json

# from frappe.utils import flt

# # ======================= FILTER OPTIONS ==============================
# @frappe.whitelist()
# def get_project_filter_options():

#     project_ids = frappe.db.sql("""
#         SELECT DISTINCT name
#         FROM `tabProject`
#         WHERE name IS NOT NULL
#         ORDER BY name
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
#         ORDER BY name DESC
#     """, as_dict=False)

#     return {
#         "project_ids": [row[0] for row in project_ids],
#         "statuses": [row[0] for row in statuses],
#         "project_types": [row[0] for row in project_types],
#         "priorities": [row[0] for row in priorities],
#         "tags": [row[0] for row in tags],
#         "fiscal_years": [row[0] for row in fiscal_years]
#     }


# # ======================= PROJECT DASHBOARD ================================
# @frappe.whitelist()
# def get_project_dashboard_data(filters=None, limit=20, offset=0):

#     # ======================== FILTER DATA ===============================
#     if isinstance(filters, str):
#         filters = json.loads(filters)

#     filters = filters or {}
#     conditions = []
#     values = {}

#     # ======================= PROJECT ID ==============================
#     if filters.get("project_id"):
#         conditions.append("p.name = %(project_id)s")
#         values["project_id"] = filters["project_id"]


#     # ====================== STATUS ============================
#     if filters.get("status"):
#         conditions.append("p.status = %(status)s")
#         values["status"] = filters["status"]


#     # ======================= PROJECT TYPE ===============================
#     if filters.get("project_type"):
#         conditions.append("p.project_type = %(project_type)s")
#         values["project_type"] = filters["project_type"]

#     # ======================= PRIORITY ===============================
#     if filters.get("priority"):
#         conditions.append("p.priority = %(priority)s")
#         values["priority"] = filters["priority"]

#     # ======================== TAG ==============================
#     if filters.get("tag"):
#         conditions.append("""
#             EXISTS (
#                 SELECT 1
#                 FROM `tabSales Order Item` soi_filter
#                 WHERE soi_filter.project = p.name
#                 AND soi_filter.item_code = %(tag)s
#             )
#         """)
#         values["tag"] = filters["tag"]

#     # ======================== FISCAL YEAR ==============================
#     if filters.get("fiscal_year"):
#         conditions.append("""
#             EXISTS (
#                 SELECT 1
#                 FROM `tabSales Order` so_filter
#                 WHERE so_filter.name = p.sales_order
#                 AND so_filter.custom_financial_year = %(fiscal_year)s
#             )
#         """)

#         values["fiscal_year"] = filters["fiscal_year"]

#     # ====================== WHERE CLAUSE ==============================
#     where_clause = ""
#     if conditions:
#         where_clause = ("WHERE " + " AND ".join(conditions))

#     # ===================== TOTALS ==============================
#     totals = frappe.db.sql(f"""
#         SELECT
#             COALESCE(SUM(basic_value), 0) AS total_basic_value,
#             COALESCE(SUM(taxes), 0) AS total_taxes,
#             COALESCE(SUM(purchase_value), 0) AS total_purchase_value
#         FROM (
#             SELECT
#                 p.name,
#                 COALESCE(so.total, 0) AS basic_value,
#                 COALESCE(so.total_taxes_and_charges, 0) AS taxes,
#                 COALESCE(so.grand_total, 0) AS purchase_value
#             FROM `tabProject` p
#             LEFT JOIN `tabSales Order` so
#                 ON so.name = p.sales_order
#             {where_clause}
#             GROUP BY
#                 p.name,
#                 so.total,
#                 so.total_taxes_and_charges,
#                 so.grand_total
#         ) AS project_totals
#         """,
#         values, as_dict=True)[0]

#     total_basic_value = flt(totals.get("total_basic_value") or 0)
#     total_taxes = flt(totals.get("total_taxes") or 0)
#     total_purchase_value = flt(totals.get("total_purchase_value") or 0)


#     # ====================== CUSTOMER COUNT ============================
#     customer_data = frappe.db.sql(f"""
#         SELECT COUNT(DISTINCT p.customer) AS customer_count
#         FROM `tabProject` p
#         LEFT JOIN `tabSales Order` so
#             ON so.name = p.sales_order

#         {where_clause}
#         """,
#         values, as_dict=True)[0]

#     customer_count = int(customer_data.get("customer_count") or 0)

#     # ===================== PAGINATION ===================================
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


#     # ======================= PROJECT DATA ===============================
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
#                 GROUP_CONCAT(
#                     DISTINCT soi.item_code
#                     ORDER BY soi.item_code
#                     SEPARATOR ', '
#                 ),
#                 ''
#             ) AS tag

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
#         """,
#         values, as_dict=True)


#     # ======================= RETURN ==============================

#     return {
#         "total_projects": total_projects,
#         "total_basic_value": total_basic_value,
#         "total_taxes": total_taxes,
#         "total_purchase_value": total_purchase_value,
#         "customer_count": customer_count,
#         "projects": projects
#     }



import frappe
import json

from frappe.utils import flt


# ============================================================
# FILTER OPTIONS
# ============================================================

@frappe.whitelist()
def get_project_filter_options():

    project_ids = frappe.db.sql("""
        SELECT DISTINCT name
        FROM `tabProject`
        WHERE name IS NOT NULL
        AND name != ''
        ORDER BY name
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
        SELECT DISTINCT name
        FROM `tabFiscal Year`
        WHERE name IS NOT NULL
        AND name != ''
        ORDER BY name DESC
    """, as_dict=False)

    return {
        "project_ids": [row[0] for row in project_ids],
        "statuses": [row[0] for row in statuses],
        "project_types": [row[0] for row in project_types],
        "priorities": [row[0] for row in priorities],
        "tags": [row[0] for row in tags],
        "fiscal_years": [row[0] for row in fiscal_years]
    }


# ============================================================
# HELPER - NORMALIZE MULTI SELECT VALUES
# ============================================================

def normalize_filter_values(value):

    if not value:
        return []

    if isinstance(value, str):
        return [value]

    if isinstance(value, list):
        return [item for item in value if item]

    return []


# ============================================================
# PROJECT DASHBOARD
# ============================================================

@frappe.whitelist()
def get_project_dashboard_data(filters=None, limit=20, offset=0):

    # --------------------------------------------------------
    # FILTER DATA
    # --------------------------------------------------------

    if isinstance(filters, str):
        filters = json.loads(filters)

    filters = filters or {}

    conditions = []
    values = {}

    # ========================================================
    # PROJECT ID
    # ========================================================

    project_ids = normalize_filter_values(
        filters.get("project_id")
    )

    if project_ids:

        placeholders = []

        for index, project_id in enumerate(project_ids):
            key = f"project_id_{index}"
            placeholders.append(f"%({key})s")
            values[key] = project_id

        conditions.append(
            f"p.name IN ({', '.join(placeholders)})"
        )

    # ========================================================
    # STATUS
    # ========================================================

    statuses = normalize_filter_values(
        filters.get("status")
    )

    if statuses:

        placeholders = []

        for index, status in enumerate(statuses):
            key = f"status_{index}"
            placeholders.append(f"%({key})s")
            values[key] = status

        conditions.append(
            f"p.status IN ({', '.join(placeholders)})"
        )

    # ========================================================
    # PROJECT TYPE
    # ========================================================

    project_types = normalize_filter_values(
        filters.get("project_type")
    )

    if project_types:

        placeholders = []

        for index, project_type in enumerate(project_types):
            key = f"project_type_{index}"
            placeholders.append(f"%({key})s")
            values[key] = project_type

        conditions.append(
            f"p.project_type IN ({', '.join(placeholders)})"
        )

    # ========================================================
    # PRIORITY
    # ========================================================

    priorities = normalize_filter_values(
        filters.get("priority")
    )

    if priorities:

        placeholders = []

        for index, priority in enumerate(priorities):
            key = f"priority_{index}"
            placeholders.append(f"%({key})s")
            values[key] = priority

        conditions.append(
            f"p.priority IN ({', '.join(placeholders)})"
        )

    # ========================================================
    # TAG / ITEM CODE
    # ========================================================

    tags = normalize_filter_values(
        filters.get("tag")
    )

    if tags:

        placeholders = []

        for index, tag in enumerate(tags):
            key = f"tag_{index}"
            placeholders.append(f"%({key})s")
            values[key] = tag

        conditions.append("""
            EXISTS (
                SELECT 1
                FROM `tabSales Order Item` soi_filter
                WHERE soi_filter.project = p.name
                AND soi_filter.item_code IN (
                    %s
                )
            )
        """ % ", ".join(placeholders))

    # ========================================================
    # FISCAL YEAR
    # ========================================================

    fiscal_years = normalize_filter_values(
        filters.get("fiscal_year")
    )

    if fiscal_years:

        placeholders = []

        for index, fiscal_year in enumerate(fiscal_years):
            key = f"fiscal_year_{index}"
            placeholders.append(f"%({key})s")
            values[key] = fiscal_year

        conditions.append("""
            EXISTS (
                SELECT 1
                FROM `tabSales Order` so_filter
                WHERE so_filter.name = p.sales_order
                AND so_filter.custom_financial_year IN (
                    %s
                )
            )
        """ % ", ".join(placeholders))

    # ========================================================
    # WHERE CLAUSE
    # ========================================================

    where_clause = ""

    if conditions:
        where_clause = "WHERE " + " AND ".join(conditions)

    # ========================================================
    # TOTAL PROJECTS + TOTAL VALUES
    #
    # Important:
    # This calculates totals for ALL filtered projects,
    # not just the current page.
    # ========================================================

    totals = frappe.db.sql(f"""
        SELECT
            COUNT(*) AS total_projects,
            COALESCE(SUM(basic_value), 0) AS total_basic_value,
            COALESCE(SUM(taxes), 0) AS total_taxes,
            COALESCE(SUM(purchase_value), 0) AS total_purchase_value

        FROM (
            SELECT
                p.name,

                COALESCE(MAX(so.total), 0) AS basic_value,

                COALESCE(
                    MAX(so.total_taxes_and_charges),
                    0
                ) AS taxes,

                COALESCE(
                    MAX(so.grand_total),
                    0
                ) AS purchase_value

            FROM `tabProject` p

            LEFT JOIN `tabSales Order` so
                ON so.name = p.sales_order

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

    # ========================================================
    # CUSTOMER COUNT
    # ========================================================

    customer_data = frappe.db.sql(f"""
        SELECT
            COUNT(DISTINCT p.customer) AS customer_count

        FROM `tabProject` p

        LEFT JOIN `tabSales Order` so
            ON so.name = p.sales_order

        {where_clause}
    """, values, as_dict=True)[0]

    customer_count = int(
        customer_data.get("customer_count") or 0
    )

    # ========================================================
    # PAGINATION
    # ========================================================

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

    # ========================================================
    # PROJECT DATA
    # ========================================================

    projects = frappe.db.sql(f"""
        SELECT

            p.name,
            p.customer,
            p.status,
            p.project_type,
            p.priority,

            so.custom_financial_year AS fiscal_year,

            COALESCE(so.total, 0) AS basic_value,

            COALESCE(
                so.total_taxes_and_charges,
                0
            ) AS taxes,

            COALESCE(
                so.grand_total,
                0
            ) AS purchase_value,

            COALESCE(
                GROUP_CONCAT(
                    DISTINCT soi.item_code
                    ORDER BY soi.item_code
                    SEPARATOR ', '
                ),
                ''
            ) AS tag

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
            so.custom_financial_year,
            so.total,
            so.total_taxes_and_charges,
            so.grand_total

        ORDER BY p.creation DESC

        {limit_clause}
    """, values, as_dict=True)

    # ========================================================
    # RETURN
    # ========================================================

    return {
        "total_projects": total_projects,
        "total_basic_value": total_basic_value,
        "total_taxes": total_taxes,
        "total_purchase_value": total_purchase_value,
        "customer_count": customer_count,
        "projects": projects
    }