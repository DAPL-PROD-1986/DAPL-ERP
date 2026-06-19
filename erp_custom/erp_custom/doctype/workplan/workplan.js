// Copyright (c) 2026, maze and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Workplan", {
// 	refresh(frm) {

// 	},
// });


// frappe.ui.form.on("Workplan", {
//     onload(frm) {
//         if (frm.is_new() && !frm.doc.date) {
//             frm.set_value("date", frappe.datetime.get_today());
//         }
//     }
// });


frappe.ui.form.on('Workplan', {
    onload: function(frm) {
        // 1. Sets the default print format to WP
        frm.meta.default_print_format = "WP";

        // 2. Sets the default date to today if it's a new document and date is empty
        if (frm.is_new() && !frm.doc.date) {
            frm.set_value("date", frappe.datetime.get_today());
        }
    }
});