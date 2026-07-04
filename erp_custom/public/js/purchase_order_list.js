

frappe.listview_settings["Purchase Order"] = {
    onload(listview) {
        let po_names = [];

        const btn = listview.page.add_inner_button("Dashboard", () => {
                frappe.set_route("purchase-dashboard");
            });

        $(btn).prepend(`
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                style="margin-right:6px;">
                <path d="M3 3v18h18"/>
                <path d="M7 12l3-3 4 4 5-5"/>
            </svg>
        `);

        $(btn).css({
            background: "#8b5cf6", color: "#fff",
            border: "none", borderRadius: "8px",
            fontWeight: "600", padding: "6px 14px",
            display: "flex", alignItems: "center", gap: "6px" });

        listview.after_render = function () {
            po_names = [];
            listview.$result.find(".list-row").each(function () {
                const title = $(this).find('[title^="ID:"]').attr("title");
                if (title && title.includes("ID:")) {
                    po_names.push(title.replace("ID: ", "").trim());
                }

                const $row = $(this);
                if ($row.find(".quick-preview-btn").length) return;

                const eye = `
                <span class="quick-preview-btn mx-2" title="Quick Preview" style="cursor:pointer; width:11px">
                    ${frappe.utils.icon("eye", "sm")} </span>`;

                $row.find(".list-row-activity").prepend(eye);
            });
        };

        listview.$result.on("click", ".quick-preview-btn", function (e) {
            e.stopPropagation();
            const title = $(this).closest(".list-row").find('[title^="ID:"]').attr("title");
            if (!title) return;
            const name = title.replace("ID: ", "").trim();
            window.show_purchase_order_preview(name, po_names);
        });
    }
};