// Copyright (c) 2026, maze and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Weekly PO Report", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on("Weekly PO Report", {
    refresh(frm) {
        if (!frm.is_new()) {
            frm.add_custom_button(__("📧 Send Mail"), () => {

                frappe.call({
                    doc: frm.doc,
                    method: "send_weekly_po_mail",
                    freeze: true,
                    freeze_message: __("Sending Mail...")
                }).then((r) => {

                    if (!r.exc) {
                        frappe.msgprint({
                            title: __("Success"),
                            message: __("Mail sent successfully"),
                            indicator: "green"
                        });
                    }

                });

            });
        }
    }
});