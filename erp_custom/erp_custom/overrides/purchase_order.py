import frappe
from frappe.utils import flt
from erpnext.buying.doctype.purchase_order.purchase_order import PurchaseOrder

class CustomPurchaseOrder(PurchaseOrder):
    
    def validate_fg_item_for_subcontracting(self):
        return
    
    def on_submit(self):
        super().on_submit()

        supplier_quotations = {
            item.supplier_quotation
            for item in self.items
            if item.supplier_quotation
        }

        for sq_name in supplier_quotations:
            sq = frappe.get_doc("Supplier Quotation", sq_name)
            sq.db_set("custom_purchase_order_no", self.name, update_modified=False)

    def on_cancel(self):
        super().on_cancel()

        supplier_quotations = {
            item.supplier_quotation
            for item in self.items
            if item.supplier_quotation
        }

        for sq_name in supplier_quotations:
            sq = frappe.get_doc("Supplier Quotation", sq_name)
            sq.db_set("custom_purchase_order_no", "", update_modified=False)


    def set_missing_values(self, *args, **kwargs):
        super().set_missing_values(*args, **kwargs)

        if self.items and self.items[0].supplier_quotation:
            sq = frappe.get_doc("Supplier Quotation", self.items[0].supplier_quotation)

            self.custom_bom_no = sq.custom_bom_no
            self.custom_cutting_plan_no = sq.custom_cutting_plan_no


@frappe.whitelist()
def validate_item_workflow(item_code=None, supplier=None):

    # -------------------------
    # SUPPLIER VALIDATION 
    # -------------------------
    if supplier:
        supplier_state = frappe.db.get_value("Supplier", supplier, "workflow_state")

        if supplier_state == "Draft":
            return {
                "status": "error",
                "message": f"Supplier Master {supplier} is in Draft state. Not allowed in Purchase Order."
            }

    # -------------------------
    # ITEM VALIDATION
    # -------------------------
    if item_code:
        item_state = frappe.db.get_value("Item", item_code, "workflow_state")

        if item_state == "Draft":
            return {
                "status": "error",
                "message": f"Item Master {item_code} is in Draft state. Not allowed in Purchase Order."
            }

    return {"status": "ok"}


@frappe.whitelist()
def sent_po_supplier(doc):

    if isinstance(doc, str):
        doc = frappe.get_doc("Purchase Order", doc)

    # Get supplier email
    supplier_email = doc.contact_email or frappe.db.get_value("Supplier", doc.supplier, "email_id")
    if not supplier_email:
        frappe.msgprint("⚠️ Supplier email not found.")
        return

    # Print Format
    print_format_name = "PO Format"
    pdf_data = frappe.get_print("Purchase Order", doc.name, print_format=print_format_name, as_pdf=True)
    file_name = f"{doc.name}.pdf"

    if frappe.db.get_value("Supplier", doc.supplier, "is_transporter"):
        order_type = "Transport Order"
    elif doc.is_subcontracted:
        order_type = "Work Order"
    else:
        order_type = "Purchase Order"

    subject = f"{order_type} {doc.name}"
    message = f"""
    <p>Dear {doc.supplier},</p>
    <p>Please find attached the {order_type} <b>{doc.name}</b>.</p>
    <p><a href="{frappe.utils.get_url_to_form('Purchase Order', doc.name)}">View {order_type}</a></p><br>
    <p>Kindly acknowledge receipt of this {order_type} and confirm the delivery schedule at the earliest.</p><br>
    <p><b>Regards,</b><br>Purchase Team</p>
    """

# Official
    frappe.sendmail(
        sender="purchase@dynatherm.co.in",
        reply_to="purchase@dynatherm.co.in", 
        recipients=[supplier_email],
		# cc=["DAPL-team@dynatherm.co.in"],
        # bcc=["DAPL-team@dynatherm.co.in"],
        subject=subject,
        message=message,
        attachments=[{
            "fname": file_name,
            "fcontent": pdf_data
        }]
    )
# Local
    # frappe.sendmail(
    #     sender="karthickarjunan08@gmail.com",
    #     reply_to="karthickarjunan08@gmail.com", 
    #     recipients=[supplier_email],
	# 	# cc=["DAPL-team@dynatherm.co.in"],
    #     # bcc=["DAPL-team@dynatherm.co.in"],
    #     subject=subject,
    #     message=message,
    #     attachments=[{
    #         "fname": file_name,
    #         "fcontent": pdf_data
    #     }]
    # )

    frappe.msgprint(f"✅ {order_type} sent to {supplier_email}")


# # =========================================================
# # WEIGHT BASED AMOUNT (FINAL OVERRIDE)
# # =========================================================
# def apply_weight_amount(doc):
#     conversion_rate = flt(doc.conversion_rate or 1)

#     for item in doc.get("items", []):
#         weight = flt(item.custom_total_weights)
#         rate = flt(item.rate)

#         if not weight or not rate:
#             continue

#         try:
#             new_amount = flt(weight * rate, 2)

#             item.amount = new_amount
#             item.base_amount = flt(new_amount * conversion_rate, 2)

#             item.net_amount = new_amount
#             item.base_net_amount = flt(new_amount * conversion_rate, 2)

#             if hasattr(item, "custom_amount_inr"):
#                 item.custom_amount_inr = new_amount

#         except Exception:
#             frappe.log_error(
#                 frappe.get_traceback(),
#                 "Weight Amount Override Error"
#             )

# def purchase_order_before_save(doc, method=None):
#     apply_weight_amount(doc)
