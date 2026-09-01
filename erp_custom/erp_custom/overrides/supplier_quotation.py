# import frappe
# from erpnext.buying.doctype.supplier_quotation.supplier_quotation import SupplierQuotation


# class CustomSupplierQuotation(SupplierQuotation):

#     def set_missing_values(self, *args, **kwargs):
#         super().set_missing_values(*args, **kwargs)

#         if self.items and self.items[0].request_for_quotation:
#             rfq = frappe.get_doc(
#                 "Request for Quotation",
#                 self.items[0].request_for_quotation
#             )

#             self.custom_bom_no = rfq.custom_bom_no
#             self.custom_cutting_plan_no = rfq.custom_cutting_plan_no



# Aug 31
import frappe
from erpnext.buying.doctype.supplier_quotation.supplier_quotation import SupplierQuotation


class CustomSupplierQuotation(SupplierQuotation):
    def set_missing_values(self, *args, **kwargs):
        # ------------------------- RUN STANDARD ERPNext LOGIC FIRST ----------------------------------
        super().set_missing_values(*args, **kwargs)

        # ------------------------- EXISTING BOM / CUTTING PLAN LOGIC ---------------------------------
        if self.items and self.items[0].request_for_quotation:
            rfq = frappe.get_doc("Request for Quotation", self.items[0].request_for_quotation)

            self.custom_bom_no = rfq.custom_bom_no
            self.custom_cutting_plan_no = rfq.custom_cutting_plan_no

        # --------------MATERIAL REQUEST ITEM (custom_total_weight) → SUPPLIER QUOTATION ITEM (custom_total_weights)
        # This does NOT affect RFQ mapping. -----------------------
        self.sync_material_request_weights()

    def sync_material_request_weights(self):
        if not self.items:
            return

        for sq_item in self.items:

            # ------------------------ We need Material Request Item reference ------------------------------
            mr_item_name = sq_item.get("material_request_item")

            if not mr_item_name:
                continue

            # ----------------------- Check source row exists ---------------------------------
            if not frappe.db.exists("Material Request Item", mr_item_name):
                continue

            # --------------------------- Get ONLY the required field ------------------------------------
            total_weight = frappe.db.get_value("Material Request Item", mr_item_name, "custom_total_weight")

            # ----------------PASS: MR Item.custom_total_weight
            #                           ↓
            # SQ Item.custom_total_weights ------------------------------------

            sq_item.custom_total_weights = total_weight or 0


# ================================ OPTIONAL DIRECT METHOD ======================================
@frappe.whitelist()
def map_material_request_item_to_supplier_quotation_item(source_name, target_name=None):

    if not source_name:
        frappe.throw("Material Request Item name is required.")

    source = frappe.get_doc("Material Request Item", source_name)

    values = {
        "material_request_item": source.name,
        "custom_total_weights": source.custom_total_weight or 0,
    }

    if target_name:
        target = frappe.get_doc("Supplier Quotation Item", target_name)
        target.db_set("material_request_item", source.name)
        target.db_set("custom_total_weights", source.custom_total_weight or 0)

        return {
            "success": True,
            "source": source.name,
            "target": target.name,
            "custom_total_weights": source.custom_total_weight or 0
        }

    return values


# ============================= DOCUMENT EVENT =======================================
def sync_material_request_item_weights(doc, method=None):

    if not doc.get("items"):
        return

    for sq_item in doc.items:
        mr_item_name = sq_item.get("material_request_item")

        if not mr_item_name:
            continue

        if not frappe.db.exists("Material Request Item", mr_item_name):
            continue

        total_weight = frappe.db.get_value("Material Request Item", mr_item_name, "custom_total_weight")
        sq_item.custom_total_weights = total_weight or 0