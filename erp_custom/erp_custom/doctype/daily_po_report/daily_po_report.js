// Copyright (c) 2026, maze and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Daily PO Report", {
// 	refresh(frm) {

// 	},
// });



frappe.ui.form.on("Daily PO Report", {
    after_save(frm) {
        if (frm.doc.name && frm.doc.series !== frm.doc.name) {
            frm.set_value("series", frm.doc.name);
            frm.save();
        }
    }
});