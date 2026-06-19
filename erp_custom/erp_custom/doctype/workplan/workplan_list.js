frappe.listview_settings["Workplan"] = {
    onload(listview) {
        let btn = listview.page.add_inner_button(
            `<svg xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                style="margin-right:6px;">

                <path d="M5.884 6.68L4.538 4.5H3l1.96 3L3 10.5h1.538l1.346-2.18L7.23 10.5h1.538L6.808 7.5l1.96-3H7.23z"/>
                <path d="M14 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h7.5L14 4.5zm-3.5-2v2h2z"/>
            </svg>

            Download Excel`,

            function () {
                frappe.prompt([
                        {
                            label: "From Date",
                            fieldname: "from_date",
                            fieldtype: "Date",
                            reqd: 1
                        },
                        {
                            label: "To Date",
                            fieldname: "to_date",
                            fieldtype: "Date",
                            reqd: 1
                        }
                    ],

            function(values) {
                window.open(`/api/method/erp_custom.erp_custom.doctype.workplan.workplan.download_workplan_excel?from_date=${values.from_date}&to_date=${values.to_date}`);
                }, "Download Workplan Excel", "Download");
            }
        );

        // Green button
        $(btn)
            .removeClass("btn-default")
            .addClass("btn-success");
    }
};