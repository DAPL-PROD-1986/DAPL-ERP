frappe.ui.form.on("Expense Claim", {
    refresh(frm) {

         // Set today's date only for new documents
        if (frm.is_new() && !frm.doc.custom_date) {
            frm.set_value("custom_date", frappe.datetime.get_today());
        }

        // Set users name fetch automatically
        if (frm.is_new() && !frm.doc.employee) {

            frappe.db.get_value("Employee",
                { user_id: frappe.session.user },
                ["name", "department", "expense_approver"]
            ).then(r => {

                if (r.message) {
                    frm.set_value("employee", r.message.name);
                    frm.set_value("department", r.message.department);
                    frm.set_value("expense_approver", r.message.expense_approver);
                }

            });
        }
    }
});
