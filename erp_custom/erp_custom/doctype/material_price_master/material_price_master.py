# Copyright (c) 2026, maze and contributors
# For license information, please see license.txt

# # import frappe
# from frappe.model.document import Document


# class MaterialPriceMaster(Document):
# 	pass


import frappe
from frappe.model.document import Document


class MaterialPriceMaster(Document):

    def validate(self):
        self.set_purchase_order_numbers()

    # ====================== SET PURCHASE ORDER NUMBER FOR ALL MATERIAL TABLES ===================================

    def set_purchase_order_numbers(self):
        child_tables = ["plate_price_list", "pipe_price_list", "tube_price_list", "rod_price_list", "flange_price_list"]

        for table_field in child_tables:
            rows = getattr(self, table_field, []) or []

            for row in rows:
                if (not row.category or not row.supplier or row.rate is None):
                    row.purchase_order_no = None
                    continue

                row.purchase_order_no = find_matching_purchase_order(row.category, row.supplier, row.rate)


# ====================== FIND ONE MATCHING PURCHASE ORDER ===================================

@frappe.whitelist()
def find_matching_purchase_order(category, supplier, rate):
    purchase_order = frappe.db.sql("""
        SELECT po.name
        FROM `tabPurchase Order` po
        INNER JOIN `tabPurchase Order Item` poi
            ON poi.parent = po.name
        WHERE
            po.docstatus < 2
            AND po.supplier = %(supplier)s
            AND poi.item_group = %(category)s
            AND poi.rate = %(rate)s
        ORDER BY
            po.transaction_date DESC,
            po.creation DESC
        LIMIT 1
    """, {
        "category": category,
        "supplier": supplier,
        "rate": rate
    }, as_dict=True)

    return (purchase_order[0].name
        if purchase_order
        else None)

# ====================== FIND REFERENCE PURCHASE ORDERS ======================
@frappe.whitelist()
def find_matching_purchase_orders(categories):
    categories = frappe.parse_json(categories)

    if not categories:
        return []

    purchase_orders = frappe.db.sql("""
        SELECT DISTINCT
            po.name, po.supplier, po.transaction_date,
            poi.item_group, poi.custom_material_type, poi.description, poi.qty,
            poi.custom_length,
            poi.custom_width,
            poi.custom_outer_diameter,
            poi.custom_thickness,
            poi.custom_density,
            poi.custom_rate_per_kg,
            poi.rate,
            poi.custom_kilogramskgs,
            poi.custom_total_weights

        FROM `tabPurchase Order` po
        INNER JOIN `tabPurchase Order Item` poi ON poi.parent = po.name
        WHERE po.docstatus < 2 AND poi.item_group IN %(categories)s
        ORDER BY po.transaction_date DESC, po.creation DESC

    """, {
        "categories": tuple(categories)
    }, as_dict=True)

    # ----------------------- Clean HTML from description (Text Editor field) ---------------------------------
    for row in purchase_orders:
        row.description = clean_description(row.description)

    return purchase_orders

# =================== STRIP HTML + FLATTEN DESCRIPTION TEXT ==============================
def clean_description(html):
    if not html:
        return ""

    text = frappe.utils.strip_html_tags(html)
    text = " ".join(text.split())
    return text