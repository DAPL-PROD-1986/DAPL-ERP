import frappe
from erpnext.buying.doctype.supplier_quotation.supplier_quotation import SupplierQuotation


class CustomSupplierQuotation(SupplierQuotation):

    def set_missing_values(self, *args, **kwargs):
        super().set_missing_values(*args, **kwargs)

        if self.items and self.items[0].request_for_quotation:
            rfq = frappe.get_doc(
                "Request for Quotation",
                self.items[0].request_for_quotation
            )

            self.custom_bom_no = rfq.custom_bom_no
            self.custom_cutting_plan_no = rfq.custom_cutting_plan_no