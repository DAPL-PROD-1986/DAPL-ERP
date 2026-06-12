// Copyright (c) 2026, maze and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Workplan", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on("Workplan", {
    onload(frm) {
        if (frm.is_new() && !frm.doc.date) {
            frm.set_value("date", frappe.datetime.get_today());
        }
    }
});