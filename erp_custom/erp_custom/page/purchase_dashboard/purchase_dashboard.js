
frappe.pages['purchase-dashboard'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Purchase Dashboard',
        single_column: true
    });

    $(wrapper).find('.layout-main').html(`

    <style>
        /* Only the handful of rules Bootstrap utilities genuinely can't cover */

        /* Comfortable, consistent cell padding inside dashboard tables */
        .dashboard-table-body table th,
        .dashboard-table-body table td {
            padding: 10px 14px;
        }

        /* Clip table corners to match the card's own rounded corners
           (also gives free bottom-radius on the wrapping card-body) */
        .table-card {
            overflow: hidden;
        }

        /* Keep Link-field autocomplete suggestions above everything else */
        .awesomplete > ul {
            z-index: 2000 !important;
        }

        /* Overall Purchase Order Table Scroll */
        .full-po-table-wrapper {
            max-height: 500px;      /* Vertical scroll height */
            overflow-x: auto;        /* Horizontal scroll */
            overflow-y: auto;        /* Vertical scroll */
            width: 100%;
            border-radius: 0 0 8px 8px;
        }

        .full-po-table-wrapper table {
            width: max-content;
            min-width: 100%;
            white-space: nowrap;
        }

        /* Keep header visible while scrolling vertically */
        .full-po-table-wrapper thead th {
            position: sticky;
            top: 0;
            z-index: 10;
            background: #f8f9fa;
        }

        .dashboard-table-body table{
            margin-bottom:0;
        }

        .dashboard-table-body thead th{
            background:#f8fafc;
            font-weight:700;
            font-size:14px;
            color:#374151;
            border-bottom:2px solid #dee2e6;
            white-space:nowrap;
        }

        .dashboard-table-body tbody td{
            vertical-align:middle;
            border-color:#f1f5f9;
            font-size:14px;
        }

        .dashboard-table-body tbody tr:hover{
            background:#f8fafc;
            transition:.2s;
        }

        .dashboard-table-body tfoot{
            font-weight:700;
            font-size:14px;
        }

        .dashboard-table-body tfoot td{
            padding:14px;
            vertical-align:middle;
        }

        .table-card{
            border-radius:15px;
            overflow:hidden;
        }

        .card-header{
            font-weight:600;
            letter-spacing:.3px;
            font-size:16px;
        }
        
        #filter_refresh_col {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
        }

        #filter_row .control-label {
            font-weight: 500 !important;
            color: #212529;
        }

        #reset_dashboard i{
            transition:transform .4s ease;
        }

        #reset_dashboard.rotating i{
            transform:rotate(360deg);
        }

        /* Supplier & Item tables scroll */
        .small-table-wrapper {
            width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
        }

        .small-table-wrapper table {
            width: max-content;
            min-width: 100%;
            white-space: nowrap;
        }

        .small-table-wrapper thead th {
            position: sticky;
            top: 0;
            z-index: 10;
            background: #f8f9fa;
        }
    </style>

    <div class="w-100 py-4">
        <div class="container-fluid" style="max-width: 1300px;">

            <!-- FILTERS PANEL -->
            <div class="card shadow-sm border-0 mb-4">
                <div class="card-header bg-success text-white">
                    <strong>🔍 Filter Purchase Orders</strong>
                </div>
                <div class="card-body">
                    <div class="row g-3 align-items-center" id="filter_row">
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_order_type"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_project"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_supplier"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_item"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_item_group"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_status"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_transaction_date"></div>
                        <div class="col-lg-2 col-md-4 col-sm-6" id="filter_schedule_date"></div>
                        
                        <div id="filter_refresh_col">
                            <button class="btn btn-success btn-sm px-3" id="refresh" title="Apply Filters">
                                <i class="fa fa-filter"></i>
                            </button>

                            <button class="btn btn-secondary btn-sm px-3" id="reset_dashboard" title="Refresh Dashboard">
                                <i class="fa fa-refresh"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- KPI SECTION -->
            <div class="mb-4">
                <div class="row g-3 mb-3" id="kpi_cards_row1"></div>
                <div class="row g-3" id="kpi_cards_row2"></div>
            </div>

            <!-- TABLES GRID -->
            <div class="row g-4 mb-4">
                <!-- TOP PROJECTS -->
                <div class="col-lg-12 col-12">
                    <div class="card shadow-sm border-0 h-100 table-card">
                        <div class="card-header bg-warning text-dark text-center">
                            <i class="fa fa-sitemap me-2"></i> Top 10 Projects
                        </div>
                        <div class="card-body p-0 table-responsive dashboard-table-body">
                            <table class="table table-hover text-center align-middle mb-0">
                                <thead class="table-light text-muted">
                                    <tr><th>Project</th> <th>Tag Name</th> <th>Basic Value (SO)</th> <th>GST 18% (SO)</th> <th>PO Count</th> <th>Basic Value (PO)</th> <th>GST 18% (PO)</th></tr>
                                </thead>
                                <tbody id="project_table"></tbody>
                                <tfoot style="background-color: #fef3c7; border-top:2px solid #f59e0b;">
                                    <tr>
                                        <td class="text-start ps-3">Overall Total</td>
                                        <td></td>
                                        <td id="project_total_so_amount">0.00</td>
                                        <td id="project_total_so_gst">0.00</td>
                                        <td id="project_total_count">0</td>
                                        <td id="project_total_po_basic">0.00</td>
                                        <td id="project_total_amount">0.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-4">
                <!-- TOP SUPPLIERS -->
                <div class="col-lg-6 col-12">
                    <div class="card shadow-sm border-0 h-100 table-card">
                        <div class="card-header text-white text-center" style="background-color: #8b5cf6;">
                            <i class="fa fa-truck me-2"></i> Top 10 Suppliers
                        </div>
                        <div class="card-body p-0 dashboard-table-body">
                        <div class="small-table-wrapper">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light text-muted text-center">
                                    <tr><th>Supplier</th><th>Order Count</th><th>Basic Value</th><th>GST Value</th></tr>
                                </thead>
                                <tbody id="supplier_table"></tbody>
                                <tfoot style="background-color: #ede9fe; border-top: 2px solid #8b5cf6;">
                                    <tr>
                                        <td class="text-start ps-3">Overall Total</td>
                                        <td id="sup_total_count">0</td>
                                        <td id="sup_total_amount">0.00</td>
                                        <td id="sup_total_gst">0.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

                <!-- TOP ITEM GROUPS -->
                <div class="col-lg-6 col-12">
                    <div class="card shadow-sm border-0 h-100 table-card">
                        <div class="card-header bg-success text-white text-center">
                            <i class="fa fa-cube me-2"></i> Top 10 Item Group
                        </div>
                        <div class="card-body p-0 dashboard-table-body">
                            <div class="small-table-wrapper">
                                <table class="table table-hover align-middle mb-0">
                                <thead class="table-light text-muted text-center">
                                    <tr> 
                                        <th> Item </th> <th> Item Group </th> <th> Order Count </th> <th> Basic Value </th> <th> GST Value </th>
                                    </tr>
                                </thead>
                                <tbody id="item_table"></tbody>
                                <tfoot style="background-color: #dcfce7; border-top: 2px solid #16a34a;">
                                    <tr>
                                        <td class="text-start ps-3">Overall Total</td>
                                        <td></td>
                                        <td id="item_total_count">0</td>
                                        <td id="item_total_amount">0.00</td>
                                        <td id="item_total_gst">0.00</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div> 
            </div>
        </div>

            <!-- REQUIRED BY - NEXT 7 DAYS -->
            <div class="card shadow-sm border-0 table-card mb-4">
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
                        <tfoot style="background-color: #fee2e2; border-top: 2px solid #ef4444;">
                            <tr>
                                <td class="text-start ps-3" colspan="7">Overall Total</td>
                                <td id="upcoming_po_total_amount">0.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- FULL PURCHASE ORDER DATA (based on current filters) -->
            <div class="card shadow-sm border-0 table-card mb-4">
                <div class="card-header text-white text-center" style="background-color: #22c55e">
                    <i class="fa fa-list me-2"></i> Overall Purchase Order
                </div>
                <div class="card-body p-0 dashboard-table-body">
                <div class="full-po-table-wrapper">
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
                        <tfoot style="background-color: #dcfce7; border-top: 2px solid #22c55e;">
                            <tr>
                                <td class="text-start ps-3" colspan="7">Overall Total</td>
                                <td id="full_po_total_amount">0.00</td>
                            </tr>
                        </tfoot>
                    </table>
                    </div>
                    <div class="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-light">
                        <div class="btn-group" role="group" id="page_size_group">
                            <button class="btn btn-outline-success active page-size-btn" data-size="20"> 20 </button>
                            <button class="btn btn-outline-success page-size-btn" data-size="100"> 100 </button>
                            <button class="btn btn-outline-success page-size-btn" data-size="500"> 500 </button>
                            <button class="btn btn-outline-success page-size-btn" data-size="2500"> All </button>
                        </div>

                        <button class="btn btn-success btn-sm" id="load_more"> Load More </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `);

    $(document).on("click", "#reset_dashboard", function () {
        let btn = $(this);
        let icon = btn.find("i");

        icon.addClass("fa-spin");

        // Clear all filter values
        Object.values(filters).forEach(field => {
            if (field && field.set_value) {
                field.set_value("");
            }
        });

        // Force clear input values also
        $("#filter_row input").val("");

        // Reset pagination
        offset = 0;

        // Wait for frappe controls to update
        setTimeout(() => {
            load_data();
            icon.removeClass("fa-spin");
        }, 300);
    });
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

    let page_size = 20;
    let offset = 0;
    function load_data(load_more = false) {
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
                    schedule_date: filters.schedule_date.get_value(),
                    limit: page_size,
                    offset: offset
                }
            },
            callback: function (r) {
                let data = r.message || {};
                render_kpis(data);
                render_table(data.top_suppliers || []);
                render_items(data.top_items || []);
                render_projects(data.top_projects || []);
                // render_item_groups(data.top_item_groups || []);
                render_full_po_table(data.full_po_list || [], load_more);
                render_upcoming_table(data.upcoming_required_by || []);
                setTimeout(() => {
                    render_chart(data.order_types || []);
                }, 300);
            }
        });
    }

    // -------------------------
    // KPI CARDS (Bootstrap only — text-white handles contrast, no custom CSS needed)
    // -------------------------
    function render_kpis(data) {
        let status_map = {
            "Draft": 0,
            "Technical Review": 0,
            "Finance Review": 0,
            "Approved": 0,
            "Cancelled": 0
        };

        (data.status_counts || []).forEach(r => {
            let key = r.workflow_state || "Draft";
            if (key in status_map) {
                status_map[key] = Number(r.count || 0);
            }
        });

        let total_po = Object.values(status_map).reduce((a, b) => a + b, 0);

        let order_type_map = {
            "Purchase Order": { count: 0, amount: 0 },
            "Work Order": { count: 0, amount: 0 },
            "Transport Order": { count: 0, amount: 0 },
            "Others": { count: 0, amount: 0 }
        };

        // Fill counts & amounts first
        (data.order_types || []).forEach(r => {
            let key = order_type_map[r.custom_order_type] ? r.custom_order_type : "Others";
            order_type_map[key].count += Number(r.count || 0);
            order_type_map[key].amount += Number(r.total_amount || 0);
        });

        // Calculate total AFTER the loop
        let total_amount = order_type_map["Purchase Order"].amount + order_type_map["Work Order"].amount + order_type_map["Transport Order"].amount;

        $("#kpi_cards_row1").html(`
            ${kpiCardTwoStat("Total (PO+WO+TO)", total_po, total_amount, "#4F46E5", "#E0E7FF", "🧾", "col-lg-2 col-md-4 col-sm-6")}
            ${kpiCardTwoStat("Purchase Order", order_type_map["Purchase Order"].count, order_type_map["Purchase Order"].amount, "#2563EB", "#DBEAFE", "📦", "col-lg-2 col-md-4 col-sm-6", "Purchase Order")}
            ${kpiCardTwoStat("Work Order", order_type_map["Work Order"].count, order_type_map["Work Order"].amount, "#16A34A", "#DCFCE7", "🏭", "col-lg-2 col-md-4 col-sm-6", "Work Order")}
            ${kpiCardTwoStat("Transport Order", order_type_map["Transport Order"].count, order_type_map["Transport Order"].amount, "#EA580C", "#FFEDD5", "🚚", "col-lg-2 col-md-4 col-sm-6", "Transport Order")}
            ${kpiCardTwoStat("Others", order_type_map["Others"].count, order_type_map["Others"].amount, "#64748B", "#F1F5F9", "📁", "col-lg-2 col-md-4 col-sm-6")}
        `);

        $("#kpi_cards_row2").html(`
            ${kpiCard("Draft", status_map["Draft"], "#F59E0B", "#FEF3C7", "📝", "col-lg-2 col-md-4 col-sm-6", "Draft")}
            ${kpiCard("Technical Review", status_map["Technical Review"], "#3B82F6", "#DBEAFE", "🛠️", "col-lg-2 col-md-4 col-sm-6", "Technical Review")}
            ${kpiCard("Finance Review", status_map["Finance Review"], "#8B5CF6", "#EDE9FE", "💰", "col-lg-2 col-md-4 col-sm-6", "Finance Review")}
            ${kpiCard("Approved", status_map["Approved"], "#22C55E", "#DCFCE7", "✅", "col-lg-2 col-md-4 col-sm-6", "Approved")}
            ${kpiCard("Cancelled", status_map["Cancelled"], "#EF4444", "#FEE2E2", "❌", "col-lg-2 col-md-4 col-sm-6", "Cancelled")}
            ${kpiCard("RFQ Raised", data.rfq_count || 0, "#0EA5E9", "#E0F2FE", "📨", "col-lg-2 col-md-4 col-sm-6", "RFQ")}
        `);
    }

    function kpiCardTwoStat(title, count, amount, accentColor, bgColor, icon, colClass, orderType) {
        let accent = accentColor || "var(--bs-dark)";
        let cardBg = bgColor || "var(--bs-secondary-bg, #f1f3f5)";

        return `
            <div class="${colClass}">
                <div class="card border-0 h-100" style="border-radius:14px;background-color:${cardBg};cursor:pointer;"
                    onclick="open_purchase_order_list('${orderType}')">

                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="small fw-semibold text-dark">${title}</div>
                            <div class="d-flex align-items-center justify-content-center flex-shrink-0"
                                style="width:44px;height:44px;border-radius:9px;background-color:${accent};font-size:20px;margin:-20px -20px 0 0">
                                ${icon}
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="small text-secondary">Count</div>
                            <div class="fw-bold text-dark">${count || 0}</div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <div></div>
                            <div class="fw-bold text-nowrap" style="color:${accent};">
                                ${frappe.format(amount || 0,{fieldtype:"Currency"})}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function kpiCard(title, value, accentColor, bgColor, icon, colClass, status) {
        let accent = accentColor || "var(--bs-dark)";
        let cardBg = bgColor || "var(--bs-secondary-bg, #f1f3f5)";

        return `
            <div class="${colClass}">
                <div class="card border-0 h-100"
                    style="border-radius:14px;background-color:${cardBg};cursor:pointer;"
                    onclick="open_status_list('${status}')">

                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="small fw-semibold text-dark">${title}</div>

                            <div class="d-flex align-items-center justify-content-center flex-shrink-0"
                                style="width:44px;height:44px;border-radius:9px;background-color:${accent};font-size:20px;margin:-20px -20px 0 0">
                                ${icon}
                            </div>
                        </div>

                        <div class="h4 fw-bold mt-3 mb-0" style="color:${accent};">
                            ${value || 0}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    window.open_status_list = function(status) {
        if (status === "RFQ") {
            frappe.set_route("List", "Request for Quotation");
            return;
        }

        frappe.route_options = { workflow_state: status };
        frappe.set_route("List", "Purchase Order");
    };

    window.open_purchase_order_list = function(order_type) {
        frappe.route_options = { custom_order_type: order_type };
        frappe.set_route("List", "Purchase Order");
    };

    // -------------------------
    // RENDER FUNCTIONS
    // -------------------------
    function render_table(rows) {
        let html = "";
        let total_count = 0;
        let total_amount = 0;
        let total_gst = 0;

        (rows || []).forEach(r => {
            let count = Number(r.count || 0);
            let amount = Number(r.total_amount || 0);
            let gst = Number(r.total_taxes_and_charges || 0);

            total_count += count;
            total_amount += amount;
            total_gst += gst;

            html += `
                <tr>
                    <td class="text-start">${r.supplier || "-"}</td>
                    <td>${count}</td>
                    <td>${frappe.format(amount,{fieldtype:"Currency"})}</td>
                    <td>${frappe.format(gst,{fieldtype:"Currency"})}</td>
                </tr>
            `;
        });

        for(let i = rows.length; i < 10; i++){
            html += `
            <tr>
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>`;
        }

        $("#supplier_table").html(html);

        $("#sup_total_count").text(total_count);
        $("#sup_total_amount").html(frappe.format(total_amount,{fieldtype:"Currency"}));
        $("#sup_total_gst").html(frappe.format(total_gst,{fieldtype:"Currency"}));
    }

    function render_items(rows) {
        let html = "";
        let total_order_count = 0;
        let total_basic = 0;
        let total_gst = 0;

        (rows || []).forEach(r => {
            let order_count = Number(r.order_count || 0);
            let basic = Number(r.basic_value || 0);
            let gst = Number(r.gst_value || 0);

            total_order_count += order_count;
            total_basic += basic;
            total_gst += gst;

            html += `
                <tr>
                    <td class="text-start">${r.item || "-"}</td>
                    <td class="text-start">${r.item_group || "-"}</td>
                    <td>${order_count}</td>
                    <td>${frappe.format(basic,{fieldtype:"Currency"})}</td>
                    <td>${frappe.format(gst,{fieldtype:"Currency"})}</td>
                </tr>
            `;
        });

        for(let i = rows.length; i < 10; i++){
            html += `
            <tr>
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>`;
        }

        $("#item_table").html(html);
        $("#item_total_count").text(total_order_count);
        $("#item_total_amount").html(frappe.format(total_basic,{fieldtype:"Currency"}));
        $("#item_total_gst").html(frappe.format(total_gst,{fieldtype:"Currency"}));
    }

    function render_projects(rows) {
        let html = "";
        let total_count = 0;
        let total_so_basic = 0;
        let total_so_gst = 0;
        let total_po_basic = 0;
        let total_spend = 0;

        (rows || []).forEach(r => {
            let count = Number(r.count || 0);
            let so_basic = Number(r.so_basic_value || 0);
            let so_gst = Number(r.so_gst_value || 0);
            let po_basic = Number(r.po_basic_value || 0);
            let spend = Number(r.total_amount || 0);

            total_count += count;
            total_so_basic += so_basic;
            total_so_gst += so_gst;
            total_po_basic += po_basic;
            total_spend += spend;

            html += `
                <tr>
                    <td>${r.project || "-"}</td>
                    <td>${r.tag_name || "-"}</td>
                    <td>${frappe.format(so_basic,{fieldtype:"Currency"})}</td>
                    <td>${frappe.format(so_gst,{fieldtype:"Currency"})}</td>
                    <td>${count}</td>
                    <td>${frappe.format(po_basic,{fieldtype:"Currency"})}</td>
                    <td>${frappe.format(spend,{fieldtype:"Currency"})}</td>
                </tr>
            `;
        });

        for (let i = rows.length; i < 10; i++) {
            html += `
                <tr>
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            `;
        }

        $("#project_table").html(html);
        $("#project_total_count").text(total_count);
        $("#project_total_so_amount").html(frappe.format(total_so_basic,{fieldtype:"Currency"}));
        $("#project_total_amount").html(frappe.format(total_spend,{fieldtype:"Currency"}));
        $("#project_total_so_gst").html(frappe.format(total_so_gst,{fieldtype:"Currency"}));
        $("#project_total_po_basic").html(frappe.format(total_po_basic,{fieldtype:"Currency"}));
    }

    let full_po_names = [];

    function render_full_po_table(rows, append = false) {
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
            if (r.workflow_state !== "Cancelled") {
                total_amount += amount;
            }
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

        if (append)
            $("#full_po_table").append(html);
        else
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
    // FILTER EVENTS
    // -------------------------
    $(document).on("click", "#refresh", function () {
        let btnIcon = $(this).find('i');
        btnIcon.addClass('fa-spin');

        load_data();
        $(document).on("click", ".page-size-btn", function () {

    $(".page-size-btn") .removeClass("active btn-success") .addClass("btn-outline-success");
    $(this) .removeClass("btn-outline-success") .addClass("btn-success active");
    page_size = parseInt($(this).data("size"));
    offset = 0;
    load_data();
    });

    $(document).on("click", "#load_more", function () {
    offset += page_size;
    load_data(true);
    });

        setTimeout(() => { btnIcon.removeClass('fa-spin'); }, 500);
    });

    load_data();
};