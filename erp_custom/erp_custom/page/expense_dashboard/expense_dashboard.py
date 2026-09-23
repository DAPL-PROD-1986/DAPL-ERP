

# import frappe
# from frappe.utils import cint, flt

# MULTI_KEYS = ("employee", "department", "employee_type", "workflow_state")


# # ----------------------------- HELPERS -----------------------------
# def _as_list(value):
#     if value is None or value == "":
#         return []
#     if isinstance(value, (list, tuple)):
#         return [v for v in value if v]
#     return [value]


# def _normalize_filters(filters):
#     if not filters:
#         filters = {}
#     elif isinstance(filters, str):
#         filters = frappe.parse_json(filters)

#     f = {}
#     for key in MULTI_KEYS:
#         values = _as_list(filters.get(key))
#         if values:
#             f[key] = tuple(values)

#     f["limit"] = cint(filters.get("limit") or 20)
#     f["offset"] = cint(filters.get("offset") or 0)
#     return f


# def _build_conditions(f, with_workflow_state=True):
#     c = []
#     if f.get("employee"):
#         c.append("ec.employee IN %(employee)s")
#     if f.get("department"):
#         c.append("ec.department IN %(department)s")
#     if f.get("employee_type"):
#         c.append("emp.employee_type IN %(employee_type)s")
#     if with_workflow_state and f.get("workflow_state"):
#         c.append("IFNULL(ec.workflow_state, 'Draft') IN %(workflow_state)s")
#     return c


# def _where(conditions):
#     return "WHERE " + " AND ".join(conditions) if conditions else ""


# # ----------------------------- DASHBOARD DATA -----------------------------
# @frappe.whitelist()
# def get_dashboard_data(filters=None):
#     f = _normalize_filters(filters)

#     # totals + table respect ALL filters (including workflow_state)
#     where_all = _where(_build_conditions(f, with_workflow_state=True))
#     # status breakdown ignores workflow_state so all 3 counts always show
#     where_no_status = _where(_build_conditions(f, with_workflow_state=False))

#     # ----------------------------- TOTALS -----------------------------
#     totals = frappe.db.sql(f"""
#         SELECT
#             COUNT(DISTINCT ec.name) AS total_claims,
#             IFNULL(SUM(ec.grand_total), 0) AS total_amount
#         FROM `tabExpense Claim` ec
#         LEFT JOIN `tabEmployee` emp ON emp.name = ec.employee
#         {where_all}
#     """, f, as_dict=True)[0]

#     # ----------------------------- STATUS BREAKDOWN -----------------------------
#     status_rows = frappe.db.sql(f"""
#         SELECT IFNULL(ec.workflow_state, 'Draft') AS workflow_state, COUNT(DISTINCT ec.name) AS count
#         FROM `tabExpense Claim` ec
#         LEFT JOIN `tabEmployee` emp ON emp.name = ec.employee
#         {where_no_status}
#         GROUP BY ec.workflow_state
#     """, f, as_dict=True)

#     status_counts = {"Draft": 0, "Finance Review": 0, "Approved": 0}
#     for row in status_rows:
#         if row.workflow_state in status_counts:
#             status_counts[row.workflow_state] = row.count

#     # ----------------------------- TABLE ROWS (paginated) -----------------------------
#     rows = frappe.db.sql(f"""
#         SELECT
#             ec.name AS name,
#             ec.employee_name AS employee_name,
#             IFNULL(ec.workflow_state, 'Draft') AS workflow_state,
#             IFNULL(ec.grand_total, 0) AS grand_total
#         FROM `tabExpense Claim` ec
#         LEFT JOIN `tabEmployee` emp ON emp.name = ec.employee
#         {where_all}
#         ORDER BY ec.creation DESC
#         LIMIT %(limit)s OFFSET %(offset)s
#     """, f, as_dict=True)

#     for row in rows:
#         row["grand_total"] = flt(row.get("grand_total"))

#     return {
#         "total_claims": int(totals.get("total_claims") or 0),
#         "total_amount": flt(totals.get("total_amount")),
#         "status_counts": status_counts,
#         "rows": rows,
#     }



import frappe
from frappe.utils import cint, flt

MULTI_KEYS = ("employee", "department", "expense_type", "approval_status")


# ----------------------------- HELPERS -----------------------------
def _as_list(value):
    if value is None or value == "":
        return []
    if isinstance(value, (list, tuple)):
        return [v for v in value if v]
    return [value]


def _normalize_filters(filters):
    if not filters:
        filters = {}
    elif isinstance(filters, str):
        filters = frappe.parse_json(filters)

    f = {}
    for key in MULTI_KEYS:
        values = _as_list(filters.get(key))
        if values:
            f[key] = tuple(values)

    f["limit"] = cint(filters.get("limit") or 20)
    f["offset"] = cint(filters.get("offset") or 0)
    return f


def _build_conditions(f, with_status=True):
    c = []
    if f.get("employee"):
        c.append("ec.employee IN %(employee)s")
    if f.get("department"):
        c.append("ec.department IN %(department)s")
    if f.get("expense_type"):
        # child table filter via EXISTS so parent rows are never duplicated
        c.append("""EXISTS (
            SELECT 1 FROM `tabExpense Claim Detail` ced
            WHERE ced.parent = ec.name
            AND ced.parentfield = 'expenses'
            AND ced.expense_type IN %(expense_type)s
        )""")
    if with_status and f.get("approval_status"):
        c.append("IFNULL(ec.approval_status, 'Draft') IN %(approval_status)s")
    return c


def _where(conditions):
    return "WHERE " + " AND ".join(conditions) if conditions else ""


# ----------------------------- DASHBOARD DATA -----------------------------
@frappe.whitelist()
def get_dashboard_data(filters=None):
    f = _normalize_filters(filters)

    # totals + table respect ALL filters (including approval_status)
    where_all = _where(_build_conditions(f, with_status=True))
    # status breakdown ignores approval_status so all 3 counts always show
    where_no_status = _where(_build_conditions(f, with_status=False))

    # ----------------------------- TOTALS -----------------------------
    totals = frappe.db.sql(f"""
        SELECT
            COUNT(DISTINCT ec.name) AS total_claims,
            IFNULL(SUM(ec.grand_total), 0) AS total_amount
        FROM `tabExpense Claim` ec
        {where_all}
    """, f, as_dict=True)[0]

    # ----------------------------- STATUS BREAKDOWN -----------------------------
    status_rows = frappe.db.sql(f"""
        SELECT IFNULL(ec.approval_status, 'Draft') AS approval_status, COUNT(DISTINCT ec.name) AS count
        FROM `tabExpense Claim` ec
        {where_no_status}
        GROUP BY ec.approval_status
    """, f, as_dict=True)

    status_counts = {"Draft": 0, "Finance Review": 0, "Approved": 0}
    for row in status_rows:
        if row.approval_status in status_counts:
            status_counts[row.approval_status] = row.count

    # ----------------------------- TABLE ROWS (paginated) -----------------------------
    rows = frappe.db.sql(f"""
        SELECT
            ec.name AS name,
            ec.employee_name AS employee_name,
            IFNULL(ec.approval_status, 'Draft') AS approval_status,
            IFNULL(ec.grand_total, 0) AS grand_total
        FROM `tabExpense Claim` ec
        {where_all}
        ORDER BY ec.creation DESC
        LIMIT %(limit)s OFFSET %(offset)s
    """, f, as_dict=True)

    for row in rows:
        row["grand_total"] = flt(row.get("grand_total"))

    return {
        "total_claims": int(totals.get("total_claims") or 0),
        "total_amount": flt(totals.get("total_amount")),
        "status_counts": status_counts,
        "rows": rows,
    }


# ----------------------------- SINGLE CLAIM PREVIEW -----------------------------
from frappe.utils import cint, flt, strip_html

@frappe.whitelist()
def get_claim_preview(name):
    ec = frappe.db.get_value(
        "Expense Claim",
        name,
        ["name", "employee", "employee_name", "custom_date", "department", "approval_status", "grand_total"],
        as_dict=True,
    )
    if not ec:
        frappe.throw("Expense Claim not found")

    expenses = frappe.db.sql("""
        SELECT
            expense_date,
            expense_type AS expense_type,
            description,
            project,
            IFNULL(amount, 0) AS amount,
            IFNULL(sanctioned_amount, 0) AS sanctioned_amount
        FROM `tabExpense Claim Detail`
        WHERE parent = %(name)s AND parentfield = 'expenses'
        ORDER BY idx ASC
    """, {"name": name}, as_dict=True)

    for row in expenses:
        row["amount"] = flt(row.get("amount"))
        row["sanctioned_amount"] = flt(row.get("sanctioned_amount"))
        # strip Quill/HTML wrapper so only plain text reaches the browser
        row["description"] = strip_html(row.get("description") or "").strip()

    ec["grand_total"] = flt(ec.get("grand_total"))
    ec["expenses"] = expenses
    return ec