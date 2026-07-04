
frappe.pages['purchase-dashboard'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Purchase Dashboard',
        single_column: true
    });

    $(wrapper).find('.layout-main').html(`

    <style>
        /* Force KPI card text to stay white no matter what theme/bootstrap rules try to apply */
        .kpi-card, .kpi-card * {
            color: #ffffff !important;
        }

        /* ---------------------------------------
           SECTION SPACING
           Consistent breathing room between every
           major block (title / filters / kpis /
           chart / tables) regardless of Bootstrap
           gutter settings.
        ----------------------------------------*/
        .dashboard-section {
            margin-bottom: 24px;
        }
        .dashboard-section:last-child {
            margin-bottom: 0;
        }

        /* KPI row + filter row + tables row: consistent gutter so cards
           don't feel jammed together on smaller screens */
        #filter_row,
        #kpi_cards,
        .dashboard-tables-row {
            row-gap: 20px;
            column-gap: 0;
        }

        .kpi-card .card-body {
            padding: 18px 16px;
        }

        /* Vertically center the filter button with the link inputs beside it */
        #filter_row {
            align-items: center;
        }
        #filter_refresh_col {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #filter_refresh_col .btn {
            height: 38px;
        }

        /* ---------------------------------------
           TABLE SPACING
           Consistent cell padding + clear separation
           between the last data row and totals footer.
        ----------------------------------------*/
        .dashboard-table-body table th,
        .dashboard-table-body table td {
            padding: 10px 14px;
        }
        .dashboard-table-body {
            padding-bottom: 4px;
        }
        .dashboard-table-body table tfoot td {
            padding-top: 12px;
            padding-bottom: 12px;
            font-weight: 600;
        }

        .card-header {
            padding: 12px 16px;
        }

        /* Rounded corners on every card */
        .card {
            border-radius: 0.5rem;
        }

        /* Only clip overflow on cards that actually contain a table.
           Doing this on .card generally was clipping the Link-field
           autocomplete dropdown inside the filter panel, which is why
           filter suggestions were hiding behind the page instead of
           showing on top. Table cards don't have popups inside them,
           so it's safe to clip just those. */
        .table-card {
            overflow: hidden;
        }
        .dashboard-table-body {
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
        }

        /* Safety net: always keep Link-field autocomplete suggestion
           lists above everything else on the page. */
        .awesomplete > ul {
            z-index: 2000 !important;
        }
        #filter_row {
            position: relative;
            z-index: 10;
        }
        #poChart {
            width: 100% !important;
            height: 100% !important;
        }
    </style>

    <div class="w-100 py-4">
        <div class="container-fluid" style="max-width: 1300px;">

           

            <!-- FILTERS PANEL -->
            <div class="card shadow-sm border-0 dashboard-section">
                <div class="card-header bg-success text-white">
                    <strong>🔍 Filter Purchase Orders</strong>
                </div>
                <div class="card-body">
                    <div class="row g-3" id="filter_row">
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_order_type"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_project"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_supplier"></div>
                        
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_item"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_item_group"></div>

                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_status"></div>

                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_transaction_date"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_schedule_date"></div>
                        <div class="col-lg-1 col-md-2 col-sm-3" id="filter_refresh_col">
                            <button class="btn btn-success w-100" id="refresh" title="Apply Filters">
                                <i class="fa fa-filter"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- KPI SECTION -->
            <div class="dashboard-section">
                <div class="row g-3 mb-3" id="kpi_cards_row1"></div>
                <div class="row g-3" id="kpi_cards_row2"></div>
            </div>

            <!-- CHART AREA -->
            <div class="card shadow-sm border-0 dashboard-section">
                <div class="card-body p-4">
                    <h5 class="fw-bold text-center text-dark mb-4"> 📊 Order Type Analytics</h5>
                    <div style="max-width: 800px; height: 350px; margin: auto;">
                        <canvas id="poChart" style="width:100%; height:100%;"></canvas>
                    </div>
                </div>
            </div>

            <!-- TABLES GRID -->
            <div class="row g-4 dashboard-tables-row dashboard-section">

                <!-- TOP SUPPLIERS -->
                <div class="col-lg-6 col-12">
                    <div class="card shadow-sm border-0 h-100 table-card">
                        <div class="card-header text-white text-center" style="background-color: #8b5cf6;">
                            <i class="fa fa-truck me-2"></i> Top 5 Suppliers
                        </div>
                        <div class="card-body p-0 table-responsive dashboard-table-body">
                            <table class="table table-hover text-center align-middle mb-0">
                                <thead class="table-light text-muted">
                                    <tr><th>Supplier</th><th>Count</th><th>Total Amount</th></tr>
                                </thead>
                                <tbody id="supplier_table"></tbody>
                                <tfoot style="background-color: #ede9fe; border-top: 2px solid #8b5cf6;">
                                    <tr>
                                        <td class="text-start ps-3">Overall Total</td>
                                        <td id="sup_total_count">0</td>
                                        <td id="sup_total_amount">0.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- TOP ITEMS -->
                <div class="col-lg-6 col-12">
                    <div class="card shadow-sm border-0 h-100 table-card">
                        <div class="card-header bg-success text-white text-center">
                            <i class="fa fa-box me-2"></i> Top 5 Items
                        </div>
                        <div class="card-body p-0 table-responsive dashboard-table-body">
                            <table class="table table-hover text-center align-middle mb-0">
                                <thead class="table-light text-muted">
                                    <tr><th>Item</th><th>Qty</th><th>Total Amount</th></tr>
                                </thead>
                                <tbody id="item_table"></tbody>
                                <tfoot class="table-success border-top border-success border-2">
                                    <tr>
                                        <td class="text-start ps-3">Overall Total</td>
                                        <td id="item_total_qty">0</td>
                                        <td id="item_total_amount">0.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- TOP PROJECTS -->
                <div class="col-lg-6 col-12">
                    <div class="card shadow-sm border-0 h-100 table-card">
                        <div class="card-header bg-warning text-dark text-center">
                            <i class="fa fa-project-diagram me-2"></i> Top 5 Projects
                        </div>
                        <div class="card-body p-0 table-responsive dashboard-table-body">
                            <table class="table table-hover text-center align-middle mb-0">
                                <thead class="table-light text-muted">
                                    <tr><th>Project</th><th>Count</th><th>Qty</th><th>Total Amount</th></tr>
                                </thead>
                                <tbody id="project_table"></tbody>
                                <tfoot class="table-warning text-dark border-top border-warning border-2">
                                    <tr>
                                        <td class="text-start ps-3">Overall Total</td>
                                        <td id="project_total_count">0</td>
                                        <td id="project_total_qty">0</td>
                                        <td id="project_total_amount">0.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- TOP ITEM GROUPS -->
                <div class="col-lg-6 col-12">
                    <div class="card shadow-sm border-0 h-100 table-card">
                        <div class="card-header bg-info text-dark text-center">
                            <i class="fa fa-tags me-2"></i> Top 5 Item Groups
                        </div>
                        <div class="card-body p-0 table-responsive dashboard-table-body">
                            <table class="table table-hover text-center align-middle mb-0">
                                <thead class="table-light text-muted">
                                    <tr><th>Item Group</th><th>Count</th><th>Qty</th><th>Total Amount</th></tr>
                                </thead>
                                <tbody id="item_group_table"></tbody>
                                <tfoot class="table-info text-dark border-top border-info border-2">
                                    <tr>
                                        <td class="text-start ps-3">Overall Total</td>
                                        <td id="ig_total_count">0</td>
                                        <td id="ig_total_qty">0</td>
                                        <td id="ig_total_amount">0.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <!-- REQUIRED BY - NEXT 7 DAYS -->
            <div class="card shadow-sm border-0 table-card dashboard-section">
                <div class="card-header bg-danger text-white text-center">
                    <i class="fa fa-clock me-2"></i> Required By - Next 7 Days
                </div>
                <div class="card-body p-0 table-responsive dashboard-table-body">
                    <table class="table table-hover text-center align-middle mb-0">
                        <thead class="table-light text-muted">
                            <tr>
                                <th>PO Name</th>
                                <th>Supplier</th>
                                <th>Project</th>
                                <th>Order Type</th>
                                <th>Date</th>
                                <th>Required By</th>
                                <th>Status</th>
                                <th>Grand Total</th>
                            </tr>
                        </thead>
                        <tbody id="upcoming_po_table"></tbody>
                        <tfoot class="table-danger border-top border-2">
                            <tr>
                                <td class="text-start ps-3" colspan="7">Overall Total</td>
                                <td id="upcoming_po_total_amount">0.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>


            <!-- FULL PURCHASE ORDER DATA (based on current filters) -->
            <div class="card shadow-sm border-0 table-card dashboard-section">
                <div class="card-header text-white text-center" style="background-color: #22c55e">
                    <i class="fa fa-list me-2"></i> Overall Purchase Order
                </div>
                <div class="card-body p-0 table-responsive dashboard-table-body">
                    <table class="table table-hover text-center align-middle mb-0">
                        <thead class="table-light text-muted">
                            <tr>
                                <th>PO Name</th>
                                <th>Supplier</th>
                                <th>Project</th>
                                <th>Order Type</th>
                                <th>Date</th>
                                <th>Required By</th>
                                <th>Status</th>
                                <th>Grand Total</th>
                            </tr>
                        </thead>
                        <tbody id="full_po_table"></tbody>
                        <tfoot class="table-success border-top border-2">
                            <tr>
                                <td class="text-start ps-3" colspan="7">Overall Total</td>
                                <td id="full_po_total_amount">0.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            

        </div>
    </div>
    `);

    // -------------------------
    // FILTER CONTROLS (Link fields with proper search/autocomplete)
    // -------------------------
    let filters = {
        order_type: frappe.ui.form.make_control({
            parent: $(wrapper).find('#filter_order_type'),
            df: {
                fieldtype: 'Select',
                fieldname: 'custom_order_type',
                label: 'Order Type',
                options: '\nPurchase Order\nWork Order\nTransport Order',
                placeholder: 'Select Order Type...'
            },
            render_input: true
        }),
        supplier: frappe.ui.form.make_control({
            parent: $(wrapper).find('#filter_supplier'),
            df: { fieldtype: 'Link', options: 'Supplier', label: 'Supplier', placeholder: 'Search Supplier...' },
            render_input: true
        }),
        project: frappe.ui.form.make_control({
            parent: $(wrapper).find('#filter_project'),
            df: { fieldtype: 'Link', options: 'Project', label: 'Project', placeholder: 'Search Project...' },
            render_input: true
        }),
        item: frappe.ui.form.make_control({
            parent: $(wrapper).find('#filter_item'),
            df: { fieldtype: 'Link', options: 'Item', label: 'Item', placeholder: 'Search Item...' },
            render_input: true
        }),
        item_group: frappe.ui.form.make_control({
            parent: $(wrapper).find('#filter_item_group'),
            df: { fieldtype: 'Link', options: 'Item Group', label: 'Item Group', placeholder: 'Search Item Group...' },
            render_input: true
        }),
        status: frappe.ui.form.make_control({
            parent: $(wrapper).find('#filter_status'),
            df: {
                fieldtype: 'Select',
                fieldname: 'workflow_state',
                label: 'Status',
                options: '\nDraft\nTechnical Review\nFinance Review\nApproved\nCancelled',
                placeholder: 'Select Status...'
            },
            render_input: true
        }),
        transaction_date: frappe.ui.form.make_control({
            parent: $(wrapper).find('#filter_transaction_date'),
            df: {
                fieldtype: 'Date',
                fieldname: 'transaction_date',
                label: 'Date',
                placeholder: 'Select Date...'
            },
            render_input: true
        }),
        schedule_date: frappe.ui.form.make_control({
            parent: $(wrapper).find('#filter_schedule_date'),
            df: {
                fieldtype: 'Date',
                fieldname: 'schedule_date',
                label: 'Required By',
                placeholder: 'Select Date...'
            },
            render_input: true
        })
    };

    function load_data() {
        frappe.call({
            method: "erp_custom.erp_custom.page.purchase_dashboard.purchase_dashboard.get_dashboard_data",
            args: {
                filters: {
                    supplier: filters.supplier.get_value(),
                    project: filters.project.get_value(),
                    item: filters.item.get_value(),
                    item_group: filters.item_group.get_value(),
                    order_type: filters.order_type.get_value(),
                    status: filters.status.get_value(),
                    transaction_date: filters.transaction_date.get_value(),
                    schedule_date: filters.schedule_date.get_value()
                }
            },
            callback: function (r) {
                let data = r.message || {};
                render_kpis(data);
                render_table(data.top_suppliers || []);
                render_items(data.top_items || []);
                render_projects(data.top_projects || []);
                render_item_groups(data.top_item_groups || []);
                render_full_po_table(data.full_po_list || []);
                render_upcoming_table(data.upcoming_required_by || []);
                setTimeout(() => {
                    render_chart(data.order_types || []);
                }, 300);
            }
        });
    }

    // -------------------------
    // KPI CARDS (Bootstrap only, forced white text via .kpi-card so nothing renders black)
    // -------------------------
    function render_kpis(data) {
        let status_map = {
            "Draft": 0, "Technical Review": 0, "Finance Review": 0, "Approved": 0,
            "Cancelled": 0, "Removed": 0
        };

        (data.status_counts || []).forEach(r => {
            let key = r.workflow_state || "Draft";
            if (key in status_map) {
                status_map[key] = r.count || 0;
            }
        });

        let total_po = Object.values(status_map).reduce((a, b) => a + b, 0);

        // Pull Purchase Order / Work Order / Transport Order counts from the
        // same order-type breakdown already used to feed the chart, so no
        // extra server call is needed.
        let order_type_map = { "Purchase Order": 0, "Work Order": 0, "Transport Order": 0 };
        (data.order_types || []).forEach(r => {
            let key = r.custom_order_type || "Purchase Order";
            if (key in order_type_map) {
                order_type_map[key] = r.count || 0;
            }
        });

        // Row 1: Total, Purchase Order, Work Order, Transport Order (4 cards, 3 cols each)
        $("#kpi_cards_row1").html(`
            ${kpiCard("Total", total_po, "#4f46e5", "🧾", "col-lg-3 col-md-6 col-sm-6")}
            ${kpiCard("Purchase Order", order_type_map["Purchase Order"], "#0dcaf0", "📦", "col-lg-3 col-md-6 col-sm-6")}
            ${kpiCard("Work Order", order_type_map["Work Order"], "#f59e0b", "🏭", "col-lg-3 col-md-6 col-sm-6")}
            ${kpiCard("Transport Order", order_type_map["Transport Order"], "#8b5cf6", "🚚", "col-lg-3 col-md-6 col-sm-6")}
        `);

        // Row 2: Draft, Tech Review, Finance Review, Approved, Cancelled, Removed (6 cards, 2 cols each)
        $("#kpi_cards_row2").html(`
            ${kpiCard("Draft", status_map["Draft"], "#6b7280", "📝", "col-lg-2 col-md-4 col-sm-6")}
            ${kpiCard("Tech Review", status_map["Technical Review"], "#14b8a6", "🛠️", "col-lg-2 col-md-4 col-sm-6")}
            ${kpiCard("Finance Review", status_map["Finance Review"], "#eab308", "💰", "col-lg-2 col-md-4 col-sm-6")}
            ${kpiCard("Approved", status_map["Approved"], "#22c55e", "✅", "col-lg-2 col-md-4 col-sm-6")}
            ${kpiCard("Cancelled", status_map["Cancelled"], "#ef4444", "❌", "col-lg-2 col-md-4 col-sm-6")}
            ${kpiCard("Removed", status_map["Removed"], "#64748b", "🗑️", "col-lg-2 col-md-4 col-sm-6")}
        `);
    }

    function kpiCard(title, value, bgColor, icon, colClass) {
        // bgColor may be a Bootstrap class (e.g. "bg-primary") or a hex code (e.g. "#6f42c1")
        let bgClass = bgColor.startsWith("#") ? "" : bgColor;
        let bgStyle = bgColor.startsWith("#") ? `style="background-color:${bgColor};"` : "";
        return `
            <div class="${colClass || 'col-lg-2 col-md-4 col-sm-6'}">
                <div class="card shadow-sm border-0 kpi-card ${bgClass} h-100" ${bgStyle}>
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="small fw-semibold">${title}</div>
                            <div class="fs-4">${icon}</div>
                        </div>
                        <div class="h3 fw-bold mt-2 mb-0">${value || 0}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // -------------------------
    // RENDER FUNCTIONS
    // -------------------------
    function render_table(rows) {
        let html = "";
        let total_count = 0, total_amount = 0;
        rows.forEach(r => {
            let count = Number(r.count || 0);
            let amount = Number(r.total_amount || 0);
            total_count += count; total_amount += amount;
            html += `<tr><td>${r.supplier || "-"}</td><td>${count}</td><td>${frappe.format(amount, { fieldtype: "Currency" })}</td></tr>`;
        });
        $("#supplier_table").html(html);
        $("#sup_total_count").text(total_count);
        $("#sup_total_amount").html(frappe.format(total_amount, { fieldtype: "Currency" }));
    }

    function render_items(rows) {
        let html = "";
        let total_qty = 0, total_amount = 0;
        (rows || []).forEach(r => {
            let qty = Number(r.qty || 0);
            let amount = Number(r.total_amount || 0);
            total_qty += qty; total_amount += amount;
            html += `<tr><td>${r.item || "-"}</td><td>${qty}</td><td>${frappe.format(amount, { fieldtype: "Currency" })}</td></tr>`;
        });
        $("#item_table").html(html);
        $("#item_total_qty").text(total_qty);
        $("#item_total_amount").html(frappe.format(total_amount, { fieldtype: "Currency" }));
    }

    function render_projects(rows) {
        let html = "";
        let total_count = 0, total_qty = 0, total_amount = 0;
        (rows || []).forEach(r => {
            let count = Number(r.count || 0); let qty = Number(r.qty || 0); let amount = Number(r.total_amount || 0);
            total_count += count; total_qty += qty; total_amount += amount;
            html += `<tr><td>${r.project || "-"}</td><td>${count}</td><td>${qty}</td><td>${frappe.format(amount, { fieldtype: "Currency" })}</td></tr>`;
        });
        $("#project_table").html(html);
        $("#project_total_count").text(total_count);
        $("#project_total_qty").text(total_qty);
        $("#project_total_amount").html(frappe.format(total_amount, { fieldtype: "Currency" }));
    }

    function render_item_groups(rows) {
        let html = "";
        let total_count = 0, total_qty = 0, total_amount = 0;
        (rows || []).forEach(r => {
            let count = Number(r.count || 0); let qty = Number(r.qty || 0); let amount = Number(r.total_amount || 0);
            total_count += count; total_qty += qty; total_amount += amount;
            html += `<tr><td>${r.item_group || "-"}</td><td>${count}</td><td>${qty}</td><td>${frappe.format(amount, { fieldtype: "Currency" })}</td></tr>`;
        });
        $("#item_group_table").html(html);
        $("#ig_total_count").text(total_count);
        $("#ig_total_qty").text(total_qty);
        $("#ig_total_amount").html(frappe.format(total_amount, { fieldtype: "Currency" }));
    }

    // function render_full_po_table(rows) {
    //     let html = "";
    //     let total_amount = 0;

    //     if (!rows || !rows.length) {
    //         $("#full_po_table").html(`<tr><td colspan="8" class="text-muted py-3">No Purchase Orders found for the selected filters.</td></tr>`);
    //         $("#full_po_total_amount").html(frappe.format(0, { fieldtype: "Currency" }));
    //         return;
    //     }

    //     rows.forEach(r => {
    //         let amount = Number(r.grand_total || 0);
    //         total_amount += amount;
    //         html += `
    //             <tr>
    //                 <td><a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a></td>
    //                 <td>${r.supplier || "-"}</td>
    //                 <td>${r.project || "-"}</td>
    //                 <td>${r.custom_order_type || "Purchase Order"}</td>
    //                 <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
    //                 <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
    //                 <td>${r.workflow_state || "Draft"}</td>
    //                 <td>${frappe.format(amount, { fieldtype: "Currency" })}</td>
    //             </tr>`;
    //     });

    //     $("#full_po_table").html(html);
    //     $("#full_po_total_amount").html(frappe.format(total_amount, { fieldtype: "Currency" }));
    // }

    let full_po_names = [];

function render_full_po_table(rows) {
    let html = "";
    let total_amount = 0;

    full_po_names = (rows || []).map(r => r.name);

    if (!rows || !rows.length) {
        $("#full_po_table").html(`<tr><td colspan="8" class="text-muted py-3">No Purchase Orders found for the selected filters.</td></tr>`);
        $("#full_po_total_amount").html(frappe.format(0, { fieldtype: "Currency" }));
        return;
    }

    rows.forEach(r => {
        let amount = Number(r.grand_total || 0);
        total_amount += amount;
        html += `
            <tr>
                <td>
                    <span class="quick-preview-btn me-2" data-name="${r.name}" title="Quick Preview" style="cursor:pointer;">
                        ${frappe.utils.icon("eye", "sm")}
                    </span>
                    <a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a>
                </td>
                <td>${r.supplier || "-"}</td>
                <td>${r.project || "-"}</td>
                <td>${r.custom_order_type || "Purchase Order"}</td>
                <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
                <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
                <td>${r.workflow_state || "Draft"}</td>
                <td>${frappe.format(amount, { fieldtype: "Currency" })}</td>
            </tr>`;
    });

    $("#full_po_table").html(html);
    $("#full_po_total_amount").html(frappe.format(total_amount, { fieldtype: "Currency" }));
}

// click handler — add once, near your other $(document).on(...) bindings
$(document).on("click", ".quick-preview-btn", function (e) {
    e.stopPropagation();
    e.preventDefault();
    const name = $(this).data("name");
    window.show_purchase_order_preview(name, full_po_names);
});

    function render_upcoming_table(rows) {
        let html = "";
        let total_amount = 0;

        if (!rows || !rows.length) {
            $("#upcoming_po_table").html(`<tr><td colspan="8" class="text-muted py-3">No Purchase Orders required in the next 7 days.</td></tr>`);
            $("#upcoming_po_total_amount").html(frappe.format(0, { fieldtype: "Currency" }));
            return;
        }

        rows.forEach(r => {
            let amount = Number(r.grand_total || 0);
            total_amount += amount;
            html += `
                <tr>
                    <td><a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a></td>
                    <td>${r.supplier || "-"}</td>
                    <td>${r.project || "-"}</td>
                    <td>${r.custom_order_type || "Purchase Order"}</td>
                    <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
                    <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
                    <td>${r.workflow_state || "Draft"}</td>
                    <td>${frappe.format(amount, { fieldtype: "Currency" })}</td>
                </tr>`;
        });

        $("#upcoming_po_table").html(html);
        $("#upcoming_po_total_amount").html(frappe.format(total_amount, { fieldtype: "Currency" }));
    }

    // -------------------------
    // CHART VIEW
    // -------------------------
    let chart_instance = null;
    function render_chart(rows) {
    let labels = (rows || []).map(r => r.custom_order_type || "Unknown");
    let values = (rows || []).map(r => r.count || 0);

    function draw() {
        let ctx = document.getElementById("poChart");
        if (!ctx) {
            console.error("Chart canvas not found");
            return;
        }

        if (chart_instance) chart_instance.destroy();

        chart_instance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: "Purchase Orders",
                    data: values,
                    backgroundColor: ["#0d6efd", "#198754", "#ffc107"],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    if (typeof Chart === "undefined") {
        let script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
        script.onload = draw;
        document.head.appendChild(script);
    } else {
        draw();
    }
}

    // -------------------------
    // FILTER EVENTS
    // -------------------------
    $(document).on("click", "#refresh", function () {
        let btnIcon = $(this).find('i');
        btnIcon.addClass('fa-spin');

        load_data();

        setTimeout(() => { btnIcon.removeClass('fa-spin'); }, 500);
    });

    load_data();
};