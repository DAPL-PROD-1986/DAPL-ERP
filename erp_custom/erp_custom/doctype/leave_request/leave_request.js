// Copyright (c) 2026, maze and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Leave Request", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on("Leave Request", {

    from_date: function(frm) {
        calculate_total_leave_days(frm);
    },

    to_date: function(frm) {
        calculate_total_leave_days(frm);
    },

    half_day: function(frm) {
        calculate_total_leave_days(frm);
    },

    refresh: function(frm) {
        calculate_total_leave_days(frm);
    }

});


function calculate_total_leave_days(frm) {

    // Clear total if dates are not selected
    if (!frm.doc.from_date || !frm.doc.to_date) {
        frm.set_value("total_leave_days", 0);
        return;
    }

    const from_date = frappe.datetime.str_to_obj(frm.doc.from_date);
    const to_date = frappe.datetime.str_to_obj(frm.doc.to_date);

    // Validate date range
    if (to_date < from_date) {

        frappe.msgprint({
            title: __("Invalid Leave Period"),
            message: __("To Date cannot be earlier than From Date."),
            indicator: "red"
        });

        frm.set_value("total_leave_days", 0);
        return;
    }

    // Calculate inclusive days
    let total_days = frappe.datetime.get_diff(frm.doc.to_date, frm.doc.from_date) + 1;

    // Half Day
    if (frm.doc.half_day) {
        total_days -= 0.5;
    }

    frm.set_value("total_leave_days", total_days);
}