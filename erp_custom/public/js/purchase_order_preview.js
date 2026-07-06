// Shared Purchase Order quick-preview dialog
// Exposes: window.show_purchase_order_preview(name, names_list)

(function () {

    let preview_dialog;
    let names_list = [];
    let current_index = 0;

    function get_dialog() {
        if (!preview_dialog) {
            preview_dialog = new frappe.ui.Dialog({
                title: "Purchase Order Preview",
                size: "large",
                fields: [
                    { fieldtype: "HTML", fieldname: "preview_html" }
                ]
            });
        }
        return preview_dialog;
    }

    async function load_preview(name) {

        if (!name) {
            frappe.msgprint("Unable to detect Purchase Order ID");
            return;
        }

        current_index = names_list.indexOf(name);

        const dialog = get_dialog();
        dialog.show();

        const wrapper = dialog.fields_dict.preview_html.$wrapper;
        wrapper.html("<p>Loading...</p>");

        try {

            const doc = await frappe.db.get_doc("Purchase Order", name);

            const card_style = `
                border:1px solid #ddd;
                border-radius:0.5rem;
                box-shadow:0 2px 6px rgba(0,0,0,0.1);
                padding:1rem;
                background:#fff;
            `;

            let status_bg = "gray";
            if (doc.status === "To Receive and Bill") status_bg = "orange";
            else if (doc.status === "Completed") status_bg = "green";
            else if (doc.status === "Draft") status_bg = "blue";
            else if (doc.status === "Cancelled") status_bg = "red";

            const po_summary = `
<div class="d-flex flex-wrap" style="${card_style}; margin-bottom:1rem;">

<div class="flex-fill" style="min-width:250px;">
<h5>Purchase Order Details</h5>
<p><b>PO No:</b> ${doc.name}</p>
<p><b>Supplier:</b> ${doc.supplier}</p>
<p><b>Date:</b> ${doc.transaction_date}</p>
<p><b>Order Type:</b> ${doc.custom_order_type}</p>
<p><b>Status:</b><span style="background:${status_bg};color:white;padding:3px 8px;border-radius:4px;font-weight:bold;"> ${doc.status}</span>
<p><b>Status:</b> ${doc.workflow_state} </p>
<p><b>Project:</b> ${doc.project} </p>
</p>
</div>

<div class="flex-fill" style="min-width:250px;">
<h5>Totals</h5>
<div class="d-flex justify-content-between">
<span>Total</span>
<span>${frappe.format(doc.total, { fieldtype: "Currency" })}</span>
</div>
<div class="d-flex justify-content-between">
<span>Taxes</span>
<span>${frappe.format(doc.total_taxes_and_charges, { fieldtype: "Currency" })}</span>
</div>
<div class="d-flex justify-content-between" style="font-weight:bold;background:#f7f7f7;padding:4px;border-radius:4px;">
<span>Grand Total</span>
<span>${frappe.format(doc.grand_total, { fieldtype: "Currency" })}</span>
</div>
</div>

</div>
`;

            const items_html = (doc.items || []).map(i => `
<tr style="text-align:center;">
<td>${i.item_code}</td>
<td>${i.description}</td>
<td>${i.qty}</td>
<td>${i.uom || "-"}</td>
<td>${i.custom_total_weights}</td>
<td>${frappe.format(i.rate, { fieldtype: "Currency" })}</td>
<td>${frappe.format(i.amount, { fieldtype: "Currency" })}</td>
</tr>
`).join("");

            const items_card = `
                    <div style="${card_style}; margin-bottom:1rem;">
                    <h5>Items</h5>
                    <table class="table table-sm table-bordered table-striped">
                    <thead>
                    <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>UOM</th>
                    <th>Total Weight</th>
                    <th>Rate</th>
                    <th>Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${items_html}
                    </tbody>
                    </table>
                    </div>
                    `;

            wrapper.html(`
                    <div style="position:relative;padding-bottom:60px;">

                    ${po_summary}${items_card}

                    <div class="mt-3">
                    <a href="/app/purchase-order/${doc.name}" class="btn btn-primary btn-sm"> Open Full Purchase Order </a>
                    </div>

                    <div style="position:absolute;bottom:15px;right:15px;display:flex;gap:8px;">
                    <span id="pop-prev-arrow" style="cursor:pointer;background:#007bff;color:white;padding:6px 10px;border-radius:4px;">
                    ${frappe.utils.icon("arrow-left", "sm")} Prev
                    </span>
                    <span id="pop-arrow-badge" style="background:#28a745;color:white;padding:4px 10px;border-radius:4px;font-weight:bold;">
                    ${current_index + 1} / ${names_list.length}
                    </span>
                    <span id="pop-next-arrow" style="cursor:pointer;background:#007bff;color:white;padding:6px 10px;border-radius:4px;">
                    Next ${frappe.utils.icon("arrow-right", "sm")}
                    </span>
                    </div>

                    </div>
                    `);

            const prevArrow = wrapper.find("#pop-prev-arrow");
            const nextArrow = wrapper.find("#pop-next-arrow");
            const badge = wrapper.find("#pop-arrow-badge");

            function update_badge() {
                badge.text(`${current_index + 1} / ${names_list.length}`);
                prevArrow.css("opacity", current_index === 0 ? 0.5 : 1);
                nextArrow.css("opacity", current_index === names_list.length - 1 ? 0.5 : 1);
            }

            prevArrow.off("click").on("click", async () => {
                if (current_index > 0) {
                    current_index--;
                    await load_preview(names_list[current_index]);
                }
            });

            nextArrow.off("click").on("click", async () => {
                if (current_index < names_list.length - 1) {
                    current_index++;
                    await load_preview(names_list[current_index]);
                }
            });

            update_badge();

        } catch (err) {
            frappe.msgprint("Error loading preview: " + err.message);
            console.error(err);
        }
    }

    // Public entry point
    window.show_purchase_order_preview = function (name, names = []) {
        names_list = names.length ? names : [name];
        load_preview(name);
    };

})();