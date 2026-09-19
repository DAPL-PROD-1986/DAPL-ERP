
// frappe.pages['purchase-dashboard'].on_page_load = function (wrapper) {
//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: 'Purchase Dashboard',
//         single_column: true
//     });

//     $(wrapper).find('.layout-main').html(`
//     <style>
//         /* Only the handful of rules Bootstrap utilities genuinely can't cover */

//         /* Comfortable, consistent cell padding inside dashboard tables */
//         .dashboard-table-body table th,
//         .dashboard-table-body table td {
//             padding: 10px 14px;
//         }

//         /* Clip table corners to match the card's own rounded corners
//            (also gives free bottom-radius on the wrapping card-body) */
//         .table-card {
//             overflow: hidden;
//         }

//         /* Keep Link-field autocomplete suggestions above everything else */
//         .awesomplete > ul {
//             z-index: 2000 !important;
//         }

//         /* Overall Purchase Order Table Scroll */
//         .full-po-table-wrapper {
//             max-height: 500px;      /* Vertical scroll height */
//             overflow-x: auto;        /* Horizontal scroll */
//             overflow-y: auto;        /* Vertical scroll */
//             width: 100%;
//             border-radius: 0 0 8px 8px;
//         }

//         .full-po-table-wrapper table {
//             width: max-content;
//             min-width: 100%;
//             white-space: nowrap;
//         }

//         /* Keep header visible while scrolling vertically */
//         .full-po-table-wrapper thead th {
//             position: sticky;
//             top: 0;
//             z-index: 10;
//             background: #f8f9fa;
//         }

//         .dashboard-table-body table{
//             margin-bottom:0;
//         }

//         .dashboard-table-body thead th{
//             background:#f8fafc;
//             font-weight:700;
//             font-size:14px;
//             color:#374151;
//             border-bottom:2px solid #dee2e6;
//             white-space:nowrap;
//         }

//         .dashboard-table-body tbody td{
//             vertical-align:middle;
//             border-color:#f1f5f9;
//             font-size:14px;
//         }

//         .dashboard-table-body tbody tr:hover{
//             background:#f8fafc;
//             transition:.2s;
//         }

//         .dashboard-table-body tfoot{
//             font-weight:700;
//             font-size:14px;
//         }

//         .dashboard-table-body tfoot td{
//             padding:14px;
//             vertical-align:middle;
//         }

//         .table-card{
//             border-radius:15px;
//             overflow:hidden;
//         }

//         .card-header{
//             font-weight:600;
//             letter-spacing:.3px;
//             font-size:16px;
//         }
        
//         #filter_refresh_col {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             gap: 12px;
//         }

//         #filter_row .control-label {
//             font-weight: 500 !important;
//             color: #212529;
//         }

//         #reset_dashboard i{
//             transition:transform .4s ease;
//         }

//         #reset_dashboard.rotating i{
//             transform:rotate(360deg);
//         }

//         /* Supplier & Item tables scroll */
//         .small-table-wrapper {
//             width: 100%;
//             overflow-x: auto;
//             overflow-y: hidden;
//         }

//         .small-table-wrapper table {
//             width: max-content;
//             min-width: 100%;
//             white-space: nowrap;
//         }

//         .small-table-wrapper thead th {
//             position: sticky;
//             top: 0;
//             z-index: 10;
//             background: #f8f9fa;
//         }
//     </style>

//     <div class="w-100 py-4">
//         <div class="container-fluid" style="max-width: 1300px;">

//             <!-- FILTERS PANEL -->
//             <div class="card shadow-sm border-0 mb-4">
//                 <div class="card-header bg-success text-white">
//                     <span class="fw-semibold fst-italic">🔍 Filter Purchase Orders</span>
//                 </div>
//                 <div class="card-body">
//                     <div class="row g-3 align-items-center" id="filter_row">
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_id"></div>
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_order_type"></div>
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_project"></div>
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_supplier"></div>
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_item"></div>
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_item_group"></div>
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_status"></div>
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_transaction_date"></div>
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_schedule_date"></div>
//                         <div class="col-lg-2 col-md-4 col-sm-6" id="filter_fiscal_year"></div>
                        
//                         <div id="filter_refresh_col">
//                             <button class="btn btn-success btn-sm px-3" id="refresh" title="Apply Filters">
//                                 <i class="fa fa-filter"></i>
//                             </button>

//                             <button class="btn btn-secondary btn-sm px-3" id="reset_dashboard" title="Refresh Dashboard">
//                                 <i class="fa fa-refresh"></i>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <!-- KPI SECTION -->
//             <div class="mb-4">
//                 <div class="row g-3 mb-3" id="kpi_cards_row1"></div>
//                 <div class="row g-3" id="kpi_cards_row2"></div>
//             </div>

//             <!-- TABLES GRID -->
//             <div class="row g-4 mb-4">
//                 <!-- TOP PROJECTS -->
//                 <div class="col-lg-12 col-12">
//                     <div class="card shadow-sm border-0 h-100 table-card">
//                         <div class="card-header bg-warning text-dark text-center">
//                             <i class="fa fa-sitemap me-2"></i> Top 10 Projects
//                         </div>
//                         <div class="card-body p-0 table-responsive dashboard-table-body">
//                             <table class="table table-hover text-center align-middle mb-0">
//                                 <thead class="table-light text-muted">
//                                     <tr><th>Project</th> <th>Tag Name</th> <th>Basic Value (SO)</th> <th>GST 18% (SO)</th> <th>PO Count</th> <th>Basic Value (PO)</th> <th>GST 18% (PO)</th></tr>
//                                 </thead>
//                                 <tbody id="project_table"></tbody>
//                                 <tfoot style="background-color: #fef3c7; border-top:2px solid #f59e0b;">
//                                     <tr>
//                                         <td class="text-start ps-3">Overall Total</td>
//                                         <td></td>
//                                         <td id="project_total_so_amount">0.00</td>
//                                         <td id="project_total_so_gst">0.00</td>
//                                         <td id="project_total_count">0</td>
//                                         <td id="project_total_po_basic">0.00</td>
//                                         <td id="project_total_amount">0.00</td>
//                                     </tr>
//                                 </tfoot>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div class="row g-4 mb-4">
//                 <!-- TOP SUPPLIERS -->
//                 <div class="col-lg-6 col-12">
//                     <div class="card shadow-sm border-0 h-100 table-card">
//                         <div class="card-header text-white text-center" style="background-color: #8b5cf6;">
//                             <i class="fa fa-truck me-2"></i> Top 10 Suppliers
//                         </div>
//                         <div class="card-body p-0 dashboard-table-body">
//                         <div class="small-table-wrapper">
//                             <table class="table table-hover align-middle mb-0">
//                                 <thead class="table-light text-muted text-center">
//                                     <tr><th>Supplier</th><th>Order Count</th><th>Basic Value</th><th>GST Value</th></tr>
//                                 </thead>
//                                 <tbody id="supplier_table"></tbody>
//                                 <tfoot style="background-color: #ede9fe; border-top: 2px solid #8b5cf6;">
//                                     <tr>
//                                         <td class="text-start ps-3">Overall Total</td>
//                                         <td id="sup_total_count">0</td>
//                                         <td id="sup_total_amount">0.00</td>
//                                         <td id="sup_total_gst">0.00</td>
//                                     </tr>
//                                 </tfoot>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//                 <!-- TOP ITEM GROUPS -->
//                 <div class="col-lg-6 col-12">
//                     <div class="card shadow-sm border-0 h-100 table-card">
//                         <div class="card-header bg-success text-white text-center">
//                             <i class="fa fa-cube me-2"></i> Top 10 Item Group
//                         </div>
//                         <div class="card-body p-0 dashboard-table-body">
//                             <div class="small-table-wrapper">
//                                 <table class="table table-hover align-middle mb-0">
//                                 <thead class="table-light text-muted text-center">
//                                     <tr> 
//                                         <th> Item </th> <th> Item Group </th> <th> Order Count </th> <th> Basic Value </th> <th> GST Value </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody id="item_table"></tbody>
//                                 <tfoot style="background-color: #dcfce7; border-top: 2px solid #16a34a;">
//                                     <tr>
//                                         <td class="text-start ps-3">Overall Total</td>
//                                         <td></td>
//                                         <td id="item_total_count">0</td>
//                                         <td id="item_total_amount">0.00</td>
//                                         <td id="item_total_gst">0.00</td>
//                                     </tr>
//                                 </tfoot>
//                             </table>
//                         </div>
//                     </div>
//                 </div> 
//             </div>
//         </div>

//             <!-- REQUIRED BY - NEXT 7 DAYS -->
//             <div class="card shadow-sm border-0 table-card mb-4">
//                 <div class="card-header bg-danger text-white text-center">
//                     <i class="fa fa-clock me-2"></i> Required By
//                 </div>
//                 <div class="card-body p-0 dashboard-table-body">
//                     <div class="full-po-table-wrapper">
//                         <table class="table table-hover text-center align-middle mb-0">
//                             <thead class="table-light text-muted">
//                                 <tr>
//                                     <th>PO Name</th>
//                                     <th>Supplier</th>
//                                     <th>Project</th>
//                                     <th>Order Type</th>
//                                     <th>Date</th>
//                                     <th>Required By</th>
//                                     <th>Status</th>
//                                     <th>Grand Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody id="upcoming_po_table"></tbody>
//                             <tfoot style="background-color: #fee2e2; border-top: 2px solid #ef4444;">
//                                 <tr>
//                                     <td class="text-start ps-3" colspan="7">Overall Total</td>
//                                     <td id="upcoming_po_total_amount">0.00</td>
//                                 </tr>
//                             </tfoot>
//                         </table>
//                     </div>
//                 </div>
//             </div>

//             <!-- FULL PURCHASE ORDER DATA (based on current filters) -->
//             <div class="card shadow-sm border-0 table-card mb-4">
//                 <div class="card-header text-white d-flex justify-content-between align-items-center" style="background-color: #22c55e">
//                     <div class="text-center flex-grow-1"> <i class="fa fa-list me-2"></i> Overall Purchase Order </div>

//         <button type="button" id="download_purchase_excel" class="btn btn-light btn-sm d-flex align-items-center gap-2"
//             title="Download Purchase Order Excel" style="font-weight:600; border-radius:7px;">

//                 <svg xmlns="http://www.w3.org/2000/svg"
//                     width="17"
//                     height="17"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     stroke-width="2"
//                     stroke-linecap="round"
//                     stroke-linejoin="round">
//                     <path d="M12 3v12"></path>
//                     <path d="m7 10 5 5 5-5"></path>
//                     <path d="M5 21h14"></path>
//                 </svg> Download Excel
//         </button>
//     </div>
//             <div class="card-body p-0 dashboard-table-body">
//     <div class="full-po-table-wrapper">
//         <table class="table table-hover text-center align-middle mb-0">

//             <thead class="table-light text-muted">
//                 <tr>
//                     <th>PO Name</th>
//                     <th>Supplier</th>
//                     <th>Project</th>
//                     <th>Order Type</th>
//                     <th>Date</th>
//                     <th>Required By</th>
//                     <th>Status</th>
//                     <th>Net Total</th>
//                     <th>Taxes & Charges</th>
//                     <th>Grand Total</th>
//                 </tr>
//             </thead>

//             <tbody id="full_po_table"></tbody>

//             <tfoot style="background-color: #dcfce7; border-top: 2px solid #22c55e;">
//                 <tr>

//                     <td class="text-start ps-3" colspan="7">
//                         <small class="text-muted fst-italic">
//                             <i class="fa fa-info-circle me-1 text-success"></i>
//                             Cancelled orders are displayed in table but INR value not considered.
//                         </small>
//                     </td>

//                     <td class="text-end pe-3">
//                         <strong>Net Total:</strong><br>
//                         <span id="full_po_total_net">0.00</span>
//                     </td>

//                     <td class="text-end pe-3">
//                         <strong>Taxes & Charges:</strong><br>
//                         <span id="full_po_total_taxes">0.00</span>
//                     </td>

//                     <td class="text-end pe-3">
//                         <strong>Grand Total:</strong><br>
//                         <span id="full_po_total_amount">0.00</span>
//                     </td>

//                 </tr>
//             </tfoot>

//         </table>
//     </div>

//     <div class="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-light">
//         <div class="btn-group" role="group" id="page_size_group">
//             <button class="btn btn-outline-success active page-size-btn" data-size="20"> 20 </button>
//             <button class="btn btn-outline-success page-size-btn" data-size="100"> 100 </button>
//             <button class="btn btn-outline-success page-size-btn" data-size="500"> 500 </button>
//             <button class="btn btn-outline-success page-size-btn" data-size="2500"> All </button>
//         </div>

//         <button class="btn btn-success btn-sm" id="load_more"> Load More </button>
//     </div>
// </div>
//             </div>
//         </div>
//     </div>
//     `);

//     $(document).on("click", "#reset_dashboard", function () {
//         let btn = $(this);
//         let icon = btn.find("i");

//         icon.addClass("fa-spin");

//         // Clear all filter values
//         Object.values(filters).forEach(field => {
//             if (field && field.set_value) {
//                 field.set_value("");
//             }
//         });

//         // Force clear input values also
//         $("#filter_row input").val("");

//         // Reset pagination
//         offset = 0;

//         // Wait for frappe controls to update
//         setTimeout(() => {
//             load_data();
//             icon.removeClass("fa-spin");
//         }, 300);
//     });

//     // ----------------------FILTER CONTROLS (Link fields with proper search/autocomplete) ----------------------

//     let filters = {
//         id: frappe.ui.form.make_control({
//             parent: $(wrapper).find("#filter_id"),
//             df: {
//                 fieldtype: "Data",
//                 fieldname: "id",
//                 label: "ID / Order Number",
//                 placeholder: "Enter Order Number..."
//             },
//             render_input: true
//         }),
//         order_type: frappe.ui.form.make_control({
//             parent: $(wrapper).find('#filter_order_type'),
//             df: {
//                 fieldtype: 'Select',
//                 fieldname: 'custom_order_type',
//                 label: 'Order Type',
//                 options: '\nPurchase Order\nWork Order\nTransport Order',
//                 placeholder: 'Select Order Type...'
//             },
//             render_input: true
//         }),
//         supplier: frappe.ui.form.make_control({
//             parent: $(wrapper).find('#filter_supplier'),
//             df: { fieldtype: 'Link', options: 'Supplier', label: 'Supplier', placeholder: 'Search Supplier...' },
//             render_input: true
//         }),
//         project: frappe.ui.form.make_control({
//             parent: $(wrapper).find('#filter_project'),
//             df: { fieldtype: 'Link', options: 'Project', label: 'Project', placeholder: 'Search Project...' },
//             render_input: true
//         }),
//         item: frappe.ui.form.make_control({
//             parent: $(wrapper).find('#filter_item'),
//             df: { fieldtype: 'Link', options: 'Item', label: 'Item', placeholder: 'Search Item...' },
//             render_input: true
//         }),
//         item_group: frappe.ui.form.make_control({
//             parent: $(wrapper).find('#filter_item_group'),
//             df: { fieldtype: 'Link', options: 'Item Group', label: 'Item Group', placeholder: 'Search Item Group...' },
//             render_input: true
//         }),
//         status: frappe.ui.form.make_control({
//             parent: $(wrapper).find('#filter_status'),
//             df: {
//                 fieldtype: 'Select',
//                 fieldname: 'workflow_state',
//                 label: 'Status',
//                 options: '\nDraft\nTechnical Review\nFinance Review\nApproved\nCancelled',
//                 placeholder: 'Select Status...'
//             },
//             render_input: true
//         }),
//         transaction_date: frappe.ui.form.make_control({
//             parent: $(wrapper).find('#filter_transaction_date'),
//             df: {
//                 fieldtype: 'Date',
//                 fieldname: 'transaction_date',
//                 label: 'Date',
//                 placeholder: 'Select Date...'
//             },
//             render_input: true
//         }),
//         schedule_date: frappe.ui.form.make_control({
//             parent: $(wrapper).find('#filter_schedule_date'),
//             df: {
//                 fieldtype: 'Date',
//                 fieldname: 'schedule_date',
//                 label: 'Required By',
//                 placeholder: 'Select Date...'
//             },
//             render_input: true
//         }),
//         fiscal_year: frappe.ui.form.make_control({          // NEW
//             parent: $(wrapper).find('#filter_fiscal_year'),
//             df: {
//                 fieldtype: 'Link',
//                 options: 'Fiscal Year',
//                 label: 'Fiscal Year',
//                 placeholder: 'Select Fiscal Year...'
//             },
//             render_input: true
//         })
//     };

//     let page_size = 20;
//     let offset = 0;
//     function load_data(load_more = false) {
//         frappe.call({
//             method: "erp_custom.erp_custom.page.purchase_dashboard.purchase_dashboard.get_dashboard_data",
//             args: {
//                 filters: {
//                     id: filters.id.get_value(),
//                     supplier: filters.supplier.get_value(),
//                     project: filters.project.get_value(),
//                     item: filters.item.get_value(),
//                     item_group: filters.item_group.get_value(),
//                     order_type: filters.order_type.get_value(),
//                     status: filters.status.get_value(),
//                     transaction_date: filters.transaction_date.get_value(),
//                     schedule_date: filters.schedule_date.get_value(),
//                     fiscal_year: filters.fiscal_year.get_value(), 
//                     limit: page_size,
//                     offset: offset
//                 }
//             },
//             callback: function (r) {
//                 let data = r.message || {};
//                 render_kpis(data);
//                 render_table(data.top_suppliers || []);
//                 render_items(data.top_items || []);
//                 render_projects(data.top_projects || []);
//                 // render_item_groups(data.top_item_groups || []);
//                 render_full_po_table(data.full_po_list || [], load_more);
//                 render_upcoming_table(data.upcoming_required_by || []);
//                 setTimeout(() => {
//                     render_chart(data.order_types || []);
//                 }, 300);
//             }
//         });
//     }

//     // ---------------------- KPI CARDS  --------------------
//     function render_kpis(data) {
//         let status_map = {
//             "Draft": 0,
//             "Technical Review": 0,
//             "Finance Review": 0,
//             "Approved": 0,
//             "Cancelled": 0
//         };

//         (data.status_counts || []).forEach(r => {
//             let key = r.workflow_state || "Draft";
//             if (key in status_map) {
//                 status_map[key] = Number(r.count || 0);
//             }
//         });

//         let total_po = Object.values(status_map).reduce((a, b) => a + b, 0);

//         let order_type_map = {
//             "Purchase Order": { count: 0, amount: 0 },
//             "Work Order": { count: 0, amount: 0 },
//             "Transport Order": { count: 0, amount: 0 },
//             "Others": { count: 0, amount: 0 }
//         };

//         // Fill counts & amounts first
//         (data.order_types || []).forEach(r => {
//             let key = order_type_map[r.custom_order_type] ? r.custom_order_type : "Others";
//             order_type_map[key].count += Number(r.count || 0);
//             order_type_map[key].amount += Number(r.total_amount || 0);
//         });

//         // Calculate total AFTER the loop
//         let total_amount = order_type_map["Purchase Order"].amount + order_type_map["Work Order"].amount + order_type_map["Transport Order"].amount;

//         $("#kpi_cards_row1").html(`
//             ${kpiCardTwoStat("Total (PO+WO+TO)", total_po, total_amount, "#4F46E5", "#E0E7FF", "🧾", "col-lg-2 col-md-4 col-sm-6")}
//             ${kpiCardTwoStat("Purchase Order", order_type_map["Purchase Order"].count, order_type_map["Purchase Order"].amount, "#2563EB", "#DBEAFE", "📦", "col-lg-2 col-md-4 col-sm-6", "Purchase Order")}
//             ${kpiCardTwoStat("Work Order", order_type_map["Work Order"].count, order_type_map["Work Order"].amount, "#16A34A", "#DCFCE7", "🏭", "col-lg-2 col-md-4 col-sm-6", "Work Order")}
//             ${kpiCardTwoStat("Transport Order", order_type_map["Transport Order"].count, order_type_map["Transport Order"].amount, "#EA580C", "#FFEDD5", "🚚", "col-lg-2 col-md-4 col-sm-6", "Transport Order")}
//             ${kpiCardTwoStat("Others", order_type_map["Others"].count, order_type_map["Others"].amount, "#64748B", "#F1F5F9", "📁", "col-lg-2 col-md-4 col-sm-6")}
//         `);

//         $("#kpi_cards_row2").html(`
//             ${kpiCard("Draft", status_map["Draft"], "#F59E0B", "#FEF3C7", "📝", "col-lg-2 col-md-4 col-sm-6", "Draft")}
//             ${kpiCard("Technical Review", status_map["Technical Review"], "#3B82F6", "#DBEAFE", "🛠️", "col-lg-2 col-md-4 col-sm-6", "Technical Review")}
//             ${kpiCard("Finance Review", status_map["Finance Review"], "#8B5CF6", "#EDE9FE", "💰", "col-lg-2 col-md-4 col-sm-6", "Finance Review")}
//             ${kpiCard("Approved", status_map["Approved"], "#22C55E", "#DCFCE7", "✅", "col-lg-2 col-md-4 col-sm-6", "Approved")}
//             ${kpiCard("Cancelled", status_map["Cancelled"], "#EF4444", "#FEE2E2", "❌", "col-lg-2 col-md-4 col-sm-6", "Cancelled")}
//             ${kpiCard("RFQ Raised", data.rfq_count || 0, "#0EA5E9", "#E0F2FE", "📨", "col-lg-2 col-md-4 col-sm-6", "RFQ")}
//         `);
//     }

//     function kpiCardTwoStat(title, count, amount, accentColor, bgColor, icon, colClass, orderType) {
//         let accent = accentColor || "var(--bs-dark)";
//         let cardBg = bgColor || "var(--bs-secondary-bg, #f1f3f5)";

//         return `
//             <div class="${colClass}">
//                 <div class="card border-0 h-100" style="border-radius:14px;background-color:${cardBg};cursor:pointer;"
//                     onclick="open_purchase_order_list('${orderType}')">

//                     <div class="card-body">
//                         <div class="d-flex justify-content-between align-items-start">
//                             <div class="small fw-semibold text-dark">${title}</div>
//                             <div class="d-flex align-items-center justify-content-center flex-shrink-0"
//                                 style="width:44px;height:44px;border-radius:9px;background-color:${accent};font-size:20px;margin:-20px -20px 0 0">
//                                 ${icon}
//                             </div>
//                         </div>

//                         <div class="d-flex justify-content-between align-items-center mt-3">
//                             <div class="small text-secondary">Count</div>
//                             <div class="fw-bold text-dark">${count || 0}</div>
//                         </div>

//                         <div class="d-flex justify-content-between align-items-center mt-2">
//                             <div></div>
//                             <div class="fw-bold text-nowrap" style="color:${accent};">
//                                 ${frappe.format(amount || 0,{fieldtype:"Currency"})}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }

//     function kpiCard(title, value, accentColor, bgColor, icon, colClass, status) {
//         let accent = accentColor || "var(--bs-dark)";
//         let cardBg = bgColor || "var(--bs-secondary-bg, #f1f3f5)";

//         return `
//             <div class="${colClass}">
//                 <div class="card border-0 h-100"
//                     style="border-radius:14px;background-color:${cardBg};cursor:pointer;"
//                     onclick="open_status_list('${status}')">

//                     <div class="card-body">
//                         <div class="d-flex justify-content-between align-items-start">
//                             <div class="small fw-semibold text-dark">${title}</div>

//                             <div class="d-flex align-items-center justify-content-center flex-shrink-0"
//                                 style="width:44px;height:44px;border-radius:9px;background-color:${accent};font-size:20px;margin:-20px -20px 0 0">
//                                 ${icon}
//                             </div>
//                         </div>

//                         <div class="h4 fw-bold mt-3 mb-0" style="color:${accent};">
//                             ${value || 0}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }

//     window.open_status_list = function(status) {
//         if (status === "RFQ") {
//             frappe.set_route("List", "Request for Quotation");
//             return;
//         }

//         frappe.route_options = { workflow_state: status };
//         frappe.set_route("List", "Purchase Order");
//     };

//     window.open_purchase_order_list = function(order_type) {
//         frappe.route_options = { custom_order_type: order_type };
//         frappe.set_route("List", "Purchase Order");
//     };

//     // ------------------------- RENDER FUNCTIONS -------------------------
//     function render_table(rows) {
//         let html = "";
//         let total_count = 0;
//         let total_amount = 0;
//         let total_gst = 0;

//         (rows || []).forEach(r => {
//             let count = Number(r.count || 0);
//             let amount = Number(r.total_amount || 0);
//             let gst = Number(r.total_taxes_and_charges || 0);

//             total_count += count;
//             total_amount += amount;
//             total_gst += gst;

//             html += `
//                 <tr>
//                     <td class="text-start">${r.supplier || "-"}</td>
//                     <td>${count}</td>
//                     <td>${frappe.format(amount,{fieldtype:"Currency"})}</td>
//                     <td>${frappe.format(gst,{fieldtype:"Currency"})}</td>
//                 </tr>
//             `;
//         });

//         for(let i = rows.length; i < 10; i++){
//             html += `
//             <tr>
//                 <td>&nbsp;</td>
//                 <td></td>
//                 <td></td>
//                 <td></td>
//             </tr>`;
//         }

//         $("#supplier_table").html(html);

//         $("#sup_total_count").text(total_count);
//         $("#sup_total_amount").html(frappe.format(total_amount,{fieldtype:"Currency"}));
//         $("#sup_total_gst").html(frappe.format(total_gst,{fieldtype:"Currency"}));
//     }

//     function render_items(rows) {
//         let html = "";
//         let total_order_count = 0;
//         let total_basic = 0;
//         let total_gst = 0;

//         (rows || []).forEach(r => {
//             let order_count = Number(r.order_count || 0);
//             let basic = Number(r.basic_value || 0);
//             let gst = Number(r.gst_value || 0);

//             total_order_count += order_count;
//             total_basic += basic;
//             total_gst += gst;

//             html += `
//                 <tr>
//                     <td class="text-start">${r.item || "-"}</td>
//                     <td class="text-start">${r.item_group || "-"}</td>
//                     <td>${order_count}</td>
//                     <td>${frappe.format(basic,{fieldtype:"Currency"})}</td>
//                     <td>${frappe.format(gst,{fieldtype:"Currency"})}</td>
//                 </tr>
//             `;
//         });

//         for(let i = rows.length; i < 10; i++){
//             html += `
//             <tr>
//                 <td>&nbsp;</td>
//                 <td></td>
//                 <td></td>
//                 <td></td>
//                 <td></td>
//             </tr>`;
//         }

//         $("#item_table").html(html);
//         $("#item_total_count").text(total_order_count);
//         $("#item_total_amount").html(frappe.format(total_basic,{fieldtype:"Currency"}));
//         $("#item_total_gst").html(frappe.format(total_gst,{fieldtype:"Currency"}));
//     }

//     function render_projects(rows) {
//         let html = "";
//         let total_count = 0;
//         let total_so_basic = 0;
//         let total_so_gst = 0;
//         let total_po_basic = 0;
//         let total_spend = 0;

//         (rows || []).forEach(r => {
//             let count = Number(r.count || 0);
//             let so_basic = Number(r.so_basic_value || 0);
//             let so_gst = Number(r.so_gst_value || 0);
//             let po_basic = Number(r.po_basic_value || 0);
//             let spend = Number(r.total_amount || 0);

//             total_count += count;
//             total_so_basic += so_basic;
//             total_so_gst += so_gst;
//             total_po_basic += po_basic;
//             total_spend += spend;

//             html += `
//                 <tr>
//                     <td> ${ r.project ? `<a href="/app/project/${encodeURIComponent(r.project)}" target="_blank"> ${frappe.utils.escape_html(r.project)} </a>` : "-" } </td>
//                     <td>${r.tag_name || "-"}</td>
//                     <td>${frappe.format(so_basic,{fieldtype:"Currency"})}</td>
//                     <td>${frappe.format(so_gst,{fieldtype:"Currency"})}</td>
//                     <td>${count}</td>
//                     <td>${frappe.format(po_basic,{fieldtype:"Currency"})}</td>
//                     <td>${frappe.format(spend,{fieldtype:"Currency"})}</td>
//                 </tr>
//             `;
//         });

//         for (let i = rows.length; i < 10; i++) {
//             html += `
//                 <tr>
//                     <td>&nbsp;</td>
//                     <td></td>
//                     <td></td>
//                     <td></td>
//                     <td></td>
//                     <td></td>
//                     <td></td>
//                 </tr>
//             `;
//         }

//         $("#project_table").html(html);
//         $("#project_total_count").text(total_count);
//         $("#project_total_so_amount").html(frappe.format(total_so_basic,{fieldtype:"Currency"}));
//         $("#project_total_amount").html(frappe.format(total_spend,{fieldtype:"Currency"}));
//         $("#project_total_so_gst").html(frappe.format(total_so_gst,{fieldtype:"Currency"}));
//         $("#project_total_po_basic").html(frappe.format(total_po_basic,{fieldtype:"Currency"}));
//     }

//     let full_po_names = [];

//     function render_full_po_table(rows, append = false) {
//         let html = "";

//         let total_net = 0;
//         let total_taxes = 0;
//         let total_grand = 0;

//         full_po_names = (rows || []).map(r => r.name);
//         if (!rows || !rows.length) {
//             $("#full_po_table").html(`
//                 <tr>
//                     <td colspan="10" class="text-muted py-3"> No Purchase Orders found for the selected filters. </td>
//                 </tr>
//             `);

//             $("#full_po_total_net").html(frappe.format(0, { fieldtype: "Currency" }));
//             $("#full_po_total_taxes").html(frappe.format(0, { fieldtype: "Currency" }));
//             $("#full_po_total_amount").html(frappe.format(0, { fieldtype: "Currency" }));
//             return;
//         }

//         rows.forEach(r => {
//             let net_total = Number(r.net_total || 0);
//             let taxes = Number(r.total_taxes_and_charges || 0);
//             let grand_total = Number(r.grand_total || 0);

//             // Same existing logic: Cancelled PO values are NOT included in overall totals
//             if (r.workflow_state !== "Cancelled") {
//                 total_net += net_total;
//                 total_taxes += taxes;
//                 total_grand += grand_total;
//             }

//             html += `
//                 <tr>
//                     <td>
//                         <span class="quick-preview-btn me-2" data-name="${r.name}" title="Quick Preview"
//                             style="cursor:pointer;"> ${frappe.utils.icon("eye", "sm")} </span>
//                         <a href="/app/purchase-order/${r.name}" target="_blank"> ${r.name} </a>
//                     </td>

//                     <td> ${r.supplier || "-"} </td>
//                     <td> ${r.project || "-"} </td>
//                     <td> ${r.custom_order_type || "Purchase Order"} </td>
//                     <td> ${frappe.datetime.str_to_user(r.transaction_date) || "-"} </td>
//                     <td> ${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"} </td>
//                     <td> ${r.workflow_state || "Draft"} </td>
//                     <td> ${frappe.format(net_total, {
//                             fieldtype: "Currency"
//                         })} </td>
                        
//                     <td> ${frappe.format(taxes, {
//                             fieldtype: "Currency"
//                         })} </td>

//                     <td> ${frappe.format(grand_total, {
//                             fieldtype: "Currency"
//                         })} </td>
//                 </tr>
//             `;
//         });

//         if (append) {
//             $("#full_po_table").append(html);
//         } else {
//             $("#full_po_table").html(html);
//         }

//         // Overall totals
//         $("#full_po_total_net").html(
//             frappe.format(total_net, {
//                 fieldtype: "Currency"
//             })
//         );

//         $("#full_po_total_taxes").html(
//             frappe.format(total_taxes, {
//                 fieldtype: "Currency"
//             })
//         );

//         $("#full_po_total_amount").html(
//             frappe.format(total_grand, {
//                 fieldtype: "Currency"
//             })
//         );
//     }

//     // click handler — add once, near your other $(document).on(...) bindings
//     $(document).on("click", ".quick-preview-btn", function (e) {
//         e.stopPropagation();
//         e.preventDefault();
//         const name = $(this).data("name");
//         window.show_purchase_order_preview(name, full_po_names);
//     });

//     function render_upcoming_table(rows) {
//         let html = "";
//         let total_amount = 0;

//         if (!rows || !rows.length) {
//             $("#upcoming_po_table").html(`<tr><td colspan="8" class="text-muted py-3">No Purchase Orders required in the next 7 days.</td></tr>`);
//             $("#upcoming_po_total_amount").html(frappe.format(0, { fieldtype: "Currency" }));
//             return;
//         }

//         rows.forEach(r => {
//             let amount = Number(r.grand_total || 0);
//             total_amount += amount;
//             html += `
//                 <tr>
//                     <td><a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a></td>
//                     <td>${r.supplier || "-"}</td>
//                     <td>${r.project || "-"}</td>
//                     <td>${r.custom_order_type || "Purchase Order"}</td>
//                     <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
//                     <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
//                     <td>${r.workflow_state || "Draft"}</td>
//                     <td>${frappe.format(amount, { fieldtype: "Currency" })}</td>
//                 </tr>`;
//         });

//         $("#upcoming_po_table").html(html);
//         $("#upcoming_po_total_amount").html(frappe.format(total_amount, { fieldtype: "Currency" }));
//     }

//     // ------------------------ FILTER EVENTS -------------------------
//     $(document).on("click", "#refresh", function () {
//         let btnIcon = $(this).find('i');
//         btnIcon.addClass('fa-spin');

//         load_data();
//         $(document).on("click", ".page-size-btn", function () {

//     $(".page-size-btn") .removeClass("active btn-success") .addClass("btn-outline-success");
//     $(this) .removeClass("btn-outline-success") .addClass("btn-success active");
//     page_size = parseInt($(this).data("size"));
//     offset = 0;
//     load_data();
//     });

//     $(document).on("click", "#load_more", function () {
//     offset += page_size;
//     load_data(true);
//     });

//         setTimeout(() => { btnIcon.removeClass('fa-spin'); }, 500);
//     });

//     load_data();

// // ======================== DOWNLOAD PURCHASE ORDER EXCEL ==============================

// $(document).on("click", "#download_purchase_excel", function () {
//     const btn = $(this);

//     // Prevent multiple clicks
//     if (btn.data("downloading")) {
//         return;
//     }

//     btn.data("downloading", true);
//     const original_html = btn.html();

//     // Loading state
//     btn.html(`
//         <svg xmlns="http://www.w3.org/2000/svg"
//              width="17"
//              height="17"
//              viewBox="0 0 24 24"
//              fill="none"
//              stroke="currentColor"
//              stroke-width="2"
//              stroke-linecap="round"
//              stroke-linejoin="round"
//              style="animation: spin 1s linear infinite;">
//             <circle cx="12" cy="12" r="9" stroke-dasharray="45" stroke-dashoffset="10"> </circle>
//         </svg> Preparing... `);

//     // Current dashboard filters
//     const dashboard_filters = {
//         id: filters.id.get_value(),
//         supplier: filters.supplier.get_value(),
//         project: filters.project.get_value(),
//         item: filters.item.get_value(),
//         item_group: filters.item_group.get_value(),
//         order_type: filters.order_type.get_value(),
//         status: filters.status.get_value(),
//         transaction_date: filters.transaction_date.get_value(),
//         schedule_date: filters.schedule_date.get_value(),
//         fiscal_year: filters.fiscal_year.get_value()
//     };

//     frappe.call({
//         method: "erp_custom.erp_custom.page.purchase_dashboard.purchase_dashboard.download_purchase_excel",
//         args: {
//             filters: dashboard_filters
//         },

//         callback: function (r) {

//             if (!r.message) {
//                 frappe.msgprint({
//                     title: "Download Failed",
//                     message: "No Excel file was generated.",
//                     indicator: "red"
//                 });
//                 return;
//             }

//             // Open generated file
//             window.open(r.message, "_blank");
//         },

//         error: function () {
//             frappe.msgprint({
//                 title: "Download Failed",
//                 message: "Unable to generate Purchase Order Excel.",
//                 indicator: "red"
//             });
//         },

//         always: function () {
//             btn.html(original_html);
//             btn.data("downloading", false);
//         }
//     });
// });

// };






// frappe.pages['purchase-dashboard'].on_page_load = function (wrapper) {
//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: 'Purchase Dashboard',
//         single_column: true
//     });

//     $(wrapper).find('.layout-main').html(`
//     <style>
//         /* ================= THEME (single colour family) ================= */
//         .pd-wrap {
//             --pd-green: #16a34a;
//             --pd-green-dark: #15803d;
//             --pd-green-soft: #f0fdf4;
//             --pd-green-line: #bbf7d0;
//             --pd-text: #1f2937;
//             --pd-muted: #6b7280;
//             --pd-border: #e5e7eb;
//             --pd-gap: 16px;
//             font-family: inherit;
//             color: var(--pd-text);
//             max-width: 1400px;
//             margin: 0 auto;
//             padding: 16px 12px 32px;
//         }
//         .pd-wrap * { box-sizing: border-box; }
//         .ta-l { text-align: left !important; }

//         /* ================= CARD SHELL ================= */
//         .pd-card {
//             background: #fff;
//             border: 1px solid var(--pd-border);
//             border-radius: 14px;
//             box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
//             margin-bottom: 20px;
//         }
//         .pd-card.clip { overflow: hidden; }

//         /* per-section colours (same palette as the original dashboard) */
//         .theme-projects  { --hdr:#ffc107; --hdr-text:#212529; --line:#f59e0b; --soft:#fef3c7; --link:#b45309; }
//         .theme-suppliers { --hdr:#8b5cf6; --line:#8b5cf6; --soft:#ede9fe; --link:#6d28d9; }
//         .theme-items     { --hdr:#16a34a; --line:#16a34a; --soft:#dcfce7; --link:#15803d; }
//         .theme-required  { --hdr:#dc3545; --line:#ef4444; --soft:#fee2e2; --link:#b91c1c; }
//         .theme-overall   { --hdr:#22c55e; --line:#22c55e; --soft:#dcfce7; --link:#15803d; }
//         .pd-card-header {
//             background: var(--hdr, var(--pd-green));
//             color: var(--hdr-text, #fff);
//             font-size: 15px;
//             font-weight: 600;
//             letter-spacing: .3px;
//             padding: 12px 18px;
//             text-align: center;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             gap: 8px;
//             border-radius: 14px 14px 0 0;
//         }
//         .pd-card-header.split { justify-content: space-between; }
//         .pd-card-body { padding: 18px; }

//         /* ================= FILTER PANEL ================= */
//         .pd-filter-grid {
//             display: grid;
//             grid-template-columns: repeat(4, minmax(0, 1fr));
//             gap: var(--pd-gap);
//             align-items: center;
//         }
//         .pd-filter-cell { position: relative; min-width: 0; }
//         .pd-filter-cell .frappe-control,
//         .pd-filter-cell .form-group { margin: 0 !important; }
//         /* labels removed */
//         .pd-filter-cell .control-label,
//         .pd-filter-cell .clearfix,
//         .pd-filter-cell .help-box { display: none !important; }
//         .pd-filter-cell .form-control,
//         .pd-filter-cell .multiselect-list .form-control {
//             height: 38px;
//             font-size: 13px;
//             border-radius: 8px;
//             border: 1px solid var(--pd-border);
//             background: #fff;
//             display: flex;
//             align-items: center;
//         }
//         .pd-filter-cell input.form-control { display: block; }
//         .pd-filter-cell .form-control:focus,
//         .pd-filter-cell .multiselect-list.open .form-control {
//             border-color: var(--pd-green);
//             box-shadow: 0 0 0 3px rgba(22, 163, 74, .15);
//         }
//         .pd-filter-cell .multiselect-list .dropdown-menu,
//         .awesomplete > ul { z-index: 2000 !important; }

//         /* placeholder overlay for multiselect boxes (labels are hidden) */
//         .pd-ph {
//             position: absolute;
//             left: 12px; top: 0;
//             line-height: 38px;
//             font-size: 13px;
//             color: #9ca3af;
//             pointer-events: none;
//             z-index: 3;
//         }
//         .pd-filter-cell.has-value .pd-ph { display: none; }
//         .pd-filter-cell.ms:not(.has-value) .status-text { visibility: hidden; }

//         .pd-filter-actions {
//             grid-column: 3 / -1;
//             display: flex;
//             justify-content: flex-end;
//             align-items: center;
//             gap: 10px;
//         }
//         .pd-icon-btn {
//             width: 38px; height: 38px;
//             padding: 0;
//             border-radius: 8px;
//             display: inline-flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 15px;
//             cursor: pointer;
//             transition: all .2s ease;
//         }
//         .pd-icon-btn.primary { background: var(--pd-green); border: 1px solid var(--pd-green); color: #fff; }
//         .pd-icon-btn.primary:hover { background: var(--pd-green-dark); }
//         .pd-icon-btn.ghost { background: #fff; border: 1px solid var(--pd-green); color: var(--pd-green); }
//         .pd-icon-btn.ghost:hover { background: var(--pd-green-soft); }

//         /* ================= KPI CARDS ================= */
//         .pd-kpi-grid { display: grid; gap: var(--pd-gap); margin-bottom: var(--pd-gap); }
//         .pd-kpi-grid.cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
//         .pd-kpi-grid.cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }

//         .pd-kpi {
//             position: relative;
//             overflow: hidden;
//             background: var(--k-bg, #fff);
//             border: 1px solid transparent;
//             border-radius: 14px;
//             padding: 16px 16px 14px;
//             box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
//             transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
//             min-height: 108px;
//             display: flex;
//             flex-direction: column;
//             justify-content: space-between;
//         }
//         .pd-kpi.clickable { cursor: pointer; }
//         .pd-kpi.clickable:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 6px 16px rgba(0, 0, 0, .10);
//             border-color: var(--k);
//         }
//         /* icon sits flush on the top-right edge of the card */
//         .pd-kpi-icon {
//             position: absolute;
//             top: 0; right: 0;
//             width: 46px; height: 46px;
//             display: flex; align-items: center; justify-content: center;
//             background: var(--k, var(--pd-green));
//             color: #fff;
//             font-size: 18px;
//             border-radius: 0 14px 0 14px;
//         }
//         .pd-kpi-title {
//             font-size: 13px;
//             font-weight: 600;
//             color: #1f2937;
//             letter-spacing: .2px;
//             padding-right: 50px;
//             line-height: 1.3;
//         }
//         .pd-kpi-value {
//             font-size: 26px;
//             font-weight: 700;
//             color: var(--k, var(--pd-text));
//             line-height: 1.1;
//             margin-top: 12px;
//         }
//         .pd-kpi-row {
//             display: flex; justify-content: space-between; align-items: baseline;
//             margin-top: 10px; font-size: 13px; color: var(--pd-muted);
//         }
//         .pd-kpi-row b { font-size: 18px; color: var(--pd-text); }
//         .pd-kpi-amount {
//             margin-top: 4px;
//             text-align: right;
//             font-size: 15px;
//             font-weight: 700;
//             color: var(--k, var(--pd-green-dark));
//             overflow-wrap: anywhere;
//         }

//         /* ================= TABLES ================= */
//         .pd-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
//         .pd-grid-2 .pd-card { margin-bottom: 0; height: 100%; }
//         .pd-section { margin-bottom: 20px; }

//         .pd-table-wrap { width: 100%; overflow-x: auto; }
//         .pd-table-wrap.tall { max-height: 500px; overflow-y: auto; }
//         .pd-table-wrap table {
//             width: max-content;
//             min-width: 100%;
//             white-space: nowrap;
//             margin-bottom: 0;
//             font-variant-numeric: tabular-nums;
//         }
//         .pd-table-wrap thead th {
//             position: sticky; top: 0; z-index: 10;
//             background: #f8fafc;
//             font-weight: 700;
//             font-size: 13px;
//             color: #374151;
//             text-align: center;
//             border-bottom: 2px solid var(--pd-border);
//             padding: 10px 14px;
//         }
//         .pd-table-wrap tbody td {
//             font-size: 13px;
//             vertical-align: middle;
//             text-align: center;
//             border-color: #f1f5f9;
//             padding: 10px 14px;
//         }
//         .pd-table-wrap tbody tr:hover { background: #f8fafc; }
//         .pd-table-wrap tfoot td {
//             background: var(--soft, var(--pd-green-soft));
//             border-top: 2px solid var(--line, var(--pd-green));
//             font-weight: 700;
//             font-size: 13px;
//             padding: 12px 14px;
//             text-align: center;
//             vertical-align: middle;
//         }
//         .pd-table-wrap a { color: var(--link, var(--pd-green-dark)); font-weight: 500; }

//         .pd-pager {
//             display: flex; justify-content: space-between; align-items: center;
//             flex-wrap: wrap; gap: 10px;
//             padding: 12px 18px;
//             border-top: 1px solid var(--pd-border);
//             background: #f9fafb;
//             border-radius: 0 0 14px 14px;
//         }
//         .pd-size-group { display: inline-flex; }
//         .pd-size-btn {
//             border: 1px solid var(--pd-green);
//             background: #fff; color: var(--pd-green);
//             font-size: 13px; font-weight: 600;
//             padding: 5px 14px; cursor: pointer;
//             margin-left: -1px;
//         }
//         .pd-size-btn:first-child { border-radius: 8px 0 0 8px; margin-left: 0; }
//         .pd-size-btn:last-child { border-radius: 0 8px 8px 0; }
//         .pd-size-btn.active { background: var(--pd-green); color: #fff; }
//         .pd-btn {
//             background: var(--pd-green); color: #fff; border: 1px solid var(--pd-green);
//             border-radius: 8px; font-size: 13px; font-weight: 600;
//             padding: 6px 16px; cursor: pointer;
//         }
//         .pd-btn:hover { background: var(--pd-green-dark); }
//         .pd-btn.light { background: #fff; color: var(--pd-green-dark); border-color: #fff; display: inline-flex; align-items: center; gap: 6px; }

//         @keyframes spin { to { transform: rotate(360deg); } }

//         /* ================= RESPONSIVE ================= */
//         @media (max-width: 1399px) {
//             .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
//         }
//         @media (max-width: 991px) {
//             .pd-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//             .pd-filter-actions { grid-column: 1 / -1; }
//             .pd-grid-2 { grid-template-columns: 1fr; }
//         }
//         @media (max-width: 767px) {
//             .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//             .pd-kpi-value { font-size: 22px; }
//         }
//         @media (max-width: 575px) {
//             .pd-wrap { padding: 12px 8px 24px; }
//             .pd-filter-grid { grid-template-columns: 1fr; }
//             .pd-kpi { padding: 14px 12px; }
//             .pd-kpi-title { font-size: 12px; }
//             .pd-card-header { font-size: 14px; }
//         }
//         @media (max-width: 380px) {
//             .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { grid-template-columns: 1fr; }
//         }
//     </style>

//     <div class="pd-wrap">

//         <!-- FILTERS PANEL -->
//         <div class="pd-card">
//             <div class="pd-card-header" style="justify-content:flex-start;">
//                 <i class="fa fa-search"></i> Filter Purchase Orders
//             </div>
//             <div class="pd-card-body">
//                 <div class="pd-filter-grid" id="pd_filter_grid">
//                     <div class="pd-filter-actions" id="pd_filter_actions">
//                         <button class="pd-icon-btn primary" id="refresh" title="Apply Filters"><i class="fa fa-filter"></i></button>
//                         <button class="pd-icon-btn ghost" id="reset_dashboard" title="Refresh Dashboard"><i class="fa fa-refresh"></i></button>
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <!-- KPI SECTION -->
//         <div class="pd-kpi-grid cols-5" id="kpi_cards_row1"></div>
//         <div class="pd-kpi-grid cols-6" id="kpi_cards_row2"></div>

//         <!-- TOP PROJECTS -->
//         <div class="pd-card clip pd-section theme-projects">
//             <div class="pd-card-header"><i class="fa fa-sitemap"></i> Top 10 Projects</div>
//             <div class="pd-table-wrap">
//                 <table class="table table-hover align-middle">
//                     <thead>
//                         <tr><th>Project</th><th>Tag Name</th><th>Basic Value (SO)</th><th>GST 18% (SO)</th><th>PO Count</th><th>Basic Value (PO)</th><th>GST 18% (PO)</th></tr>
//                     </thead>
//                     <tbody id="project_table"></tbody>
//                     <tfoot>
//                         <tr>
//                             <td class="ta-l">Overall Total</td>
//                             <td></td>
//                             <td id="project_total_so_amount">0.00</td>
//                             <td id="project_total_so_gst">0.00</td>
//                             <td id="project_total_count">0</td>
//                             <td id="project_total_po_basic">0.00</td>
//                             <td id="project_total_amount">0.00</td>
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>
//         </div>

//         <!-- TOP SUPPLIERS + TOP ITEMS -->
//         <div class="pd-grid-2 pd-section">
//             <div class="pd-card clip theme-suppliers">
//                 <div class="pd-card-header"><i class="fa fa-truck"></i> Top 10 Suppliers</div>
//                 <div class="pd-table-wrap">
//                     <table class="table table-hover align-middle">
//                         <thead><tr><th>Supplier</th><th>Order Count</th><th>Basic Value</th><th>GST Value</th></tr></thead>
//                         <tbody id="supplier_table"></tbody>
//                         <tfoot>
//                             <tr>
//                                 <td class="ta-l">Overall Total</td>
//                                 <td id="sup_total_count">0</td>
//                                 <td id="sup_total_amount">0.00</td>
//                                 <td id="sup_total_gst">0.00</td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>
//             </div>

//             <div class="pd-card clip theme-items">
//                 <div class="pd-card-header"><i class="fa fa-cube"></i> Top 10 Items</div>
//                 <div class="pd-table-wrap">
//                     <table class="table table-hover align-middle">
//                         <thead><tr><th>Item</th><th>Item Group</th><th>Order Count</th><th>Basic Value</th><th>GST Value</th></tr></thead>
//                         <tbody id="item_table"></tbody>
//                         <tfoot>
//                             <tr>
//                                 <td class="ta-l">Overall Total</td>
//                                 <td></td>
//                                 <td id="item_total_count">0</td>
//                                 <td id="item_total_amount">0.00</td>
//                                 <td id="item_total_gst">0.00</td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>
//             </div>
//         </div>

//         <!-- REQUIRED BY - NEXT 7 DAYS -->
//         <div class="pd-card clip pd-section theme-required">
//             <div class="pd-card-header"><i class="fa fa-clock-o"></i> Required By</div>
//             <div class="pd-table-wrap tall">
//                 <table class="table table-hover align-middle">
//                     <thead>
//                         <tr>
//                             <th>PO Name</th><th>Supplier</th><th>Project</th><th>Order Type</th>
//                             <th>Date</th><th>Required By</th><th>Status</th><th>Grand Total</th>
//                         </tr>
//                     </thead>
//                     <tbody id="upcoming_po_table"></tbody>
//                     <tfoot>
//                         <tr>
//                             <td class="ta-l" colspan="7">Overall Total</td>
//                             <td id="upcoming_po_total_amount">0.00</td>
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>
//         </div>

//         <!-- FULL PURCHASE ORDER DATA -->
//         <div class="pd-card clip pd-section theme-overall">
//             <div class="pd-card-header split">
//                 <span style="width:150px" class="hidden-xs"></span>
//                 <span><i class="fa fa-list"></i> Overall Purchase Order</span>
//                 <button type="button" id="download_purchase_excel" class="pd-btn light" title="Download Purchase Order Excel">
//                     <i class="fa fa-download"></i> Download Excel
//                 </button>
//             </div>

//             <div class="pd-table-wrap tall">
//                 <table class="table table-hover align-middle">
//                     <thead>
//                         <tr>
//                             <th>PO Name</th><th>Supplier</th><th>Project</th><th>Order Type</th>
//                             <th>Date</th><th>Required By</th><th>Status</th>
//                             <th>Net Total</th><th>Taxes &amp; Charges</th><th>Grand Total</th>
//                         </tr>
//                     </thead>
//                     <tbody id="full_po_table"></tbody>
//                     <tfoot>
//                         <tr>
//                             <td class="ta-l" colspan="7">
//                                 <small style="font-weight:400;color:var(--pd-muted);font-style:italic;">
//                                     <i class="fa fa-info-circle" style="color:var(--pd-green)"></i>
//                                     Cancelled orders are displayed in table but INR value not considered.
//                                 </small>
//                             </td>
//                             <td><strong>Net Total</strong><br><span id="full_po_total_net">0.00</span></td>
//                             <td><strong>Taxes &amp; Charges</strong><br><span id="full_po_total_taxes">0.00</span></td>
//                             <td><strong>Grand Total</strong><br><span id="full_po_total_amount">0.00</span></td>
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>

//             <div class="pd-pager">
//                 <div class="pd-size-group" id="page_size_group">
//                     <button class="pd-size-btn active page-size-btn" data-size="20">20</button>
//                     <button class="pd-size-btn page-size-btn" data-size="100">100</button>
//                     <button class="pd-size-btn page-size-btn" data-size="500">500</button>
//                     <button class="pd-size-btn page-size-btn" data-size="2500">All</button>
//                 </div>
//                 <button class="pd-btn" id="load_more">Load More</button>
//             </div>
//         </div>
//     </div>
//     `);

//     // ---------------------- FILTER CONTROLS (all multiselect; dates use range) ----------------------
//     const link_options = doctype => txt => frappe.db.get_link_options(doctype, txt);
//     const static_options = list => () => list.map(v => ({ value: v, description: "" }));

//     const FILTER_DEFS = [
//         { key: "id",               ph: "Order Number",   type: "ms", get_data: link_options("Purchase Order") },
//         { key: "order_type",       ph: "Order Type",     type: "ms", get_data: static_options(["Purchase Order", "Work Order", "Transport Order"]) },
//         { key: "project",          ph: "Project",        type: "ms", get_data: link_options("Project") },
//         { key: "supplier",         ph: "Supplier",       type: "ms", get_data: link_options("Supplier") },
//         { key: "item",             ph: "Item",           type: "ms", get_data: link_options("Item") },
//         { key: "item_group",       ph: "Item Group",     type: "ms", get_data: link_options("Item Group") },
//         { key: "status",           ph: "Status",         type: "ms", get_data: static_options(["Draft", "Technical Review", "Finance Review", "Approved", "Cancelled"]) },
//         { key: "transaction_date", ph: "Date",           type: "range" },
//         { key: "schedule_date",    ph: "Required By",    type: "range" },
//         { key: "fiscal_year",      ph: "Fiscal Year",    type: "ms", get_data: link_options("Fiscal Year") }
//     ];

//     let filters = {};
//     let cells = {};

//     function sync_cell(key) {
//         const v = filters[key].get_value();
//         const has = Array.isArray(v) ? v.length > 0 : !!v;
//         cells[key].toggleClass("has-value", has);
//     }

//     FILTER_DEFS.forEach(def => {
//         const $cell = $('<div class="pd-filter-cell"></div>').insertBefore($(wrapper).find("#pd_filter_actions"));
//         cells[def.key] = $cell;

//         let df = { fieldname: def.key, label: def.ph, placeholder: def.ph };
//         if (def.type === "ms") {
//             $cell.addClass("ms").append(`<span class="pd-ph">${def.ph}</span>`);
//             Object.assign(df, { fieldtype: "MultiSelectList", get_data: def.get_data });
//         } else {
//             Object.assign(df, { fieldtype: "DateRange" });
//         }

//         filters[def.key] = frappe.ui.form.make_control({ parent: $cell, df: df, render_input: true });
//         $cell.on("click change input focusout", () => setTimeout(() => sync_cell(def.key), 150));
//     });

//     function collect_filters(extra) {
//         let f = {};
//         Object.keys(filters).forEach(k => { f[k] = filters[k].get_value() || []; });
//         return Object.assign(f, extra || {});
//     }

//     // ---------------------- DATA LOADING ----------------------
//     let page_size = 20;
//     let offset = 0;
//     let full_po_names = [];
//     let po_tot = { net: 0, tax: 0, grand: 0 };

//     function load_data(load_more = false) {
//         frappe.call({
//             method: "erp_custom.erp_custom.page.purchase_dashboard.purchase_dashboard.get_dashboard_data",
//             args: { filters: collect_filters({ limit: page_size, offset: offset }) },
//             callback: function (r) {
//                 let data = r.message || {};
//                 render_kpis(data);
//                 render_table(data.top_suppliers || []);
//                 render_items(data.top_items || []);
//                 render_projects(data.top_projects || []);
//                 render_full_po_table(data.full_po_list || [], load_more);
//                 render_upcoming_table(data.upcoming_required_by || []);
//             }
//         });
//     }

//     // ---------------------- KPI CARDS ----------------------
//     function render_kpis(data) {
//         let status_map = { "Draft": 0, "Technical Review": 0, "Finance Review": 0, "Approved": 0, "Cancelled": 0 };

//         (data.status_counts || []).forEach(r => {
//             let key = r.workflow_state || "Draft";
//             if (key in status_map) status_map[key] = Number(r.count || 0);
//         });

//         let total_po = Object.values(status_map).reduce((a, b) => a + b, 0);

//         let order_type_map = {
//             "Purchase Order": { count: 0, amount: 0 },
//             "Work Order": { count: 0, amount: 0 },
//             "Transport Order": { count: 0, amount: 0 },
//             "Others": { count: 0, amount: 0 }
//         };

//         (data.order_types || []).forEach(r => {
//             let key = order_type_map[r.custom_order_type] ? r.custom_order_type : "Others";
//             order_type_map[key].count += Number(r.count || 0);
//             order_type_map[key].amount += Number(r.total_amount || 0);
//         });

//         let total_amount = order_type_map["Purchase Order"].amount
//             + order_type_map["Work Order"].amount
//             + order_type_map["Transport Order"].amount;

//         $("#kpi_cards_row1").html(`
//             ${kpiCardTwoStat("Total (PO+WO+TO)", total_po, total_amount, "fa-file-text-o", "#4F46E5", "#E0E7FF")}
//             ${kpiCardTwoStat("Purchase Order", order_type_map["Purchase Order"].count, order_type_map["Purchase Order"].amount, "fa-shopping-cart", "#2563EB", "#DBEAFE", "Purchase Order")}
//             ${kpiCardTwoStat("Work Order", order_type_map["Work Order"].count, order_type_map["Work Order"].amount, "fa-industry", "#16A34A", "#DCFCE7", "Work Order")}
//             ${kpiCardTwoStat("Transport Order", order_type_map["Transport Order"].count, order_type_map["Transport Order"].amount, "fa-truck", "#EA580C", "#FFEDD5", "Transport Order")}
//             ${kpiCardTwoStat("Others", order_type_map["Others"].count, order_type_map["Others"].amount, "fa-folder-open-o", "#64748B", "#F1F5F9")}
//         `);

//         $("#kpi_cards_row2").html(`
//             ${kpiCard("Draft", status_map["Draft"], "fa-pencil-square-o", "#F59E0B", "#FEF3C7", "Draft")}
//             ${kpiCard("Technical Review", status_map["Technical Review"], "fa-wrench", "#3B82F6", "#DBEAFE", "Technical Review")}
//             ${kpiCard("Finance Review", status_map["Finance Review"], "fa-money", "#8B5CF6", "#EDE9FE", "Finance Review")}
//             ${kpiCard("Approved", status_map["Approved"], "fa-check-circle", "#22C55E", "#DCFCE7", "Approved")}
//             ${kpiCard("Cancelled", status_map["Cancelled"], "fa-ban", "#EF4444", "#FEE2E2", "Cancelled")}
//             ${kpiCard("RFQ Raised", data.rfq_count || 0, "fa-envelope-o", "#0EA5E9", "#E0F2FE", "RFQ")}
//         `);
//     }

//     function kpiCardTwoStat(title, count, amount, icon, accent, bg, orderType) {
//         const click = orderType ? `onclick="open_purchase_order_list('${orderType}')"` : "";
//         return `
//             <div class="pd-kpi ${orderType ? "clickable" : ""}" style="--k:${accent};--k-bg:${bg};" ${click}>
//                 <div class="pd-kpi-icon"><i class="fa ${icon}"></i></div>
//                 <div class="pd-kpi-title">${title}</div>
//                 <div>
//                     <div class="pd-kpi-row"><span>Count</span><b>${count || 0}</b></div>
//                     <div class="pd-kpi-amount">${frappe.format(amount || 0, { fieldtype: "Currency" })}</div>
//                 </div>
//             </div>`;
//     }

//     function kpiCard(title, value, icon, accent, bg, status) {
//         return `
//             <div class="pd-kpi clickable" style="--k:${accent};--k-bg:${bg};" onclick="open_status_list('${status}')">
//                 <div class="pd-kpi-icon"><i class="fa ${icon}"></i></div>
//                 <div class="pd-kpi-title">${title}</div>
//                 <div class="pd-kpi-value">${value || 0}</div>
//             </div>`;
//     }

//     window.open_status_list = function (status) {
//         if (status === "RFQ") {
//             frappe.set_route("List", "Request for Quotation");
//             return;
//         }
//         frappe.route_options = { workflow_state: status };
//         frappe.set_route("List", "Purchase Order");
//     };

//     window.open_purchase_order_list = function (order_type) {
//         frappe.route_options = { custom_order_type: order_type };
//         frappe.set_route("List", "Purchase Order");
//     };

//     // ---------------------- RENDER FUNCTIONS ----------------------
//     const cur = v => frappe.format(v, { fieldtype: "Currency" });

//     function blank_rows(html, from, cols) {
//         for (let i = from; i < 10; i++) {
//             html += `<tr>${'<td>&nbsp;</td>'.repeat(1)}${'<td></td>'.repeat(cols - 1)}</tr>`;
//         }
//         return html;
//     }

//     function render_table(rows) {
//         let html = "", total_count = 0, total_amount = 0, total_gst = 0;

//         (rows || []).forEach(r => {
//             let count = Number(r.count || 0);
//             let amount = Number(r.total_amount || 0);
//             let gst = Number(r.total_taxes_and_charges || 0);
//             total_count += count; total_amount += amount; total_gst += gst;

//             html += `<tr>
//                 <td class="ta-l">${frappe.utils.escape_html(r.supplier || "-")}</td>
//                 <td>${count}</td><td>${cur(amount)}</td><td>${cur(gst)}</td>
//             </tr>`;
//         });

//         html = blank_rows(html, (rows || []).length, 4);
//         $("#supplier_table").html(html);
//         $("#sup_total_count").text(total_count);
//         $("#sup_total_amount").html(cur(total_amount));
//         $("#sup_total_gst").html(cur(total_gst));
//     }

//     function render_items(rows) {
//         let html = "", total_order_count = 0, total_basic = 0, total_gst = 0;

//         (rows || []).forEach(r => {
//             let order_count = Number(r.order_count || 0);
//             let basic = Number(r.basic_value || 0);
//             let gst = Number(r.gst_value || 0);
//             total_order_count += order_count; total_basic += basic; total_gst += gst;

//             html += `<tr>
//                 <td class="ta-l">${frappe.utils.escape_html(r.item || "-")}</td>
//                 <td class="ta-l">${frappe.utils.escape_html(r.item_group || "-")}</td>
//                 <td>${order_count}</td><td>${cur(basic)}</td><td>${cur(gst)}</td>
//             </tr>`;
//         });

//         html = blank_rows(html, (rows || []).length, 5);
//         $("#item_table").html(html);
//         $("#item_total_count").text(total_order_count);
//         $("#item_total_amount").html(cur(total_basic));
//         $("#item_total_gst").html(cur(total_gst));
//     }

//     function render_projects(rows) {
//         let html = "", total_count = 0, total_so_basic = 0, total_so_gst = 0, total_po_basic = 0, total_spend = 0;

//         (rows || []).forEach(r => {
//             let count = Number(r.count || 0);
//             let so_basic = Number(r.so_basic_value || 0);
//             let so_gst = Number(r.so_gst_value || 0);
//             let po_basic = Number(r.po_basic_value || 0);
//             let spend = Number(r.total_amount || 0);

//             total_count += count; total_so_basic += so_basic; total_so_gst += so_gst;
//             total_po_basic += po_basic; total_spend += spend;

//             html += `<tr>
//                 <td>${r.project ? `<a href="/app/project/${encodeURIComponent(r.project)}" target="_blank">${frappe.utils.escape_html(r.project)}</a>` : "-"}</td>
//                 <td>${frappe.utils.escape_html(r.tag_name || "-")}</td>
//                 <td>${cur(so_basic)}</td><td>${cur(so_gst)}</td>
//                 <td>${count}</td>
//                 <td>${cur(po_basic)}</td><td>${cur(spend)}</td>
//             </tr>`;
//         });

//         html = blank_rows(html, (rows || []).length, 7);
//         $("#project_table").html(html);
//         $("#project_total_count").text(total_count);
//         $("#project_total_so_amount").html(cur(total_so_basic));
//         $("#project_total_so_gst").html(cur(total_so_gst));
//         $("#project_total_po_basic").html(cur(total_po_basic));
//         $("#project_total_amount").html(cur(total_spend));
//     }

//     function paint_po_totals() {
//         $("#full_po_total_net").html(cur(po_tot.net));
//         $("#full_po_total_taxes").html(cur(po_tot.tax));
//         $("#full_po_total_amount").html(cur(po_tot.grand));
//     }

//     function render_full_po_table(rows, append = false) {
//         rows = rows || [];
//         $("#load_more").toggle(rows.length >= page_size);

//         if (!append) {
//             full_po_names = [];
//             po_tot = { net: 0, tax: 0, grand: 0 };
//         }

//         if (!rows.length) {
//             if (!append) {
//                 $("#full_po_table").html(`<tr><td colspan="10" style="color:var(--pd-muted);padding:16px;">No Purchase Orders found for the selected filters.</td></tr>`);
//                 paint_po_totals();
//             }
//             return;
//         }

//         let html = "";
//         rows.forEach(r => {
//             let net_total = Number(r.net_total || 0);
//             let taxes = Number(r.total_taxes_and_charges || 0);
//             let grand_total = Number(r.grand_total || 0);
//             full_po_names.push(r.name);

//             // Cancelled PO values are NOT included in overall totals
//             if (r.workflow_state !== "Cancelled") {
//                 po_tot.net += net_total;
//                 po_tot.tax += taxes;
//                 po_tot.grand += grand_total;
//             }

//             html += `<tr>
//                 <td>
//                     <span class="quick-preview-btn" data-name="${r.name}" title="Quick Preview" style="cursor:pointer;margin-right:6px;">${frappe.utils.icon("eye", "sm")}</span>
//                     <a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a>
//                 </td>
//                 <td>${frappe.utils.escape_html(r.supplier || "-")}</td>
//                 <td>${frappe.utils.escape_html(r.project || "-")}</td>
//                 <td>${r.custom_order_type || "Purchase Order"}</td>
//                 <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
//                 <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
//                 <td>${r.workflow_state || "Draft"}</td>
//                 <td>${cur(net_total)}</td>
//                 <td>${cur(taxes)}</td>
//                 <td>${cur(grand_total)}</td>
//             </tr>`;
//         });

//         if (append) $("#full_po_table").append(html);
//         else $("#full_po_table").html(html);

//         paint_po_totals();
//     }

//     function render_upcoming_table(rows) {
//         let html = "", total_amount = 0;

//         if (!rows || !rows.length) {
//             $("#upcoming_po_table").html(`<tr><td colspan="8" style="color:var(--pd-muted);padding:16px;">No Purchase Orders required in the next 7 days.</td></tr>`);
//             $("#upcoming_po_total_amount").html(cur(0));
//             return;
//         }

//         rows.forEach(r => {
//             let amount = Number(r.grand_total || 0);
//             total_amount += amount;
//             html += `<tr>
//                 <td><a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a></td>
//                 <td>${frappe.utils.escape_html(r.supplier || "-")}</td>
//                 <td>${frappe.utils.escape_html(r.project || "-")}</td>
//                 <td>${r.custom_order_type || "Purchase Order"}</td>
//                 <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
//                 <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
//                 <td>${r.workflow_state || "Draft"}</td>
//                 <td>${cur(amount)}</td>
//             </tr>`;
//         });

//         $("#upcoming_po_table").html(html);
//         $("#upcoming_po_total_amount").html(cur(total_amount));
//     }

//     // ---------------------- EVENTS (namespaced so they never stack up) ----------------------
//     const NS = ".purchase_dash";
//     $(document).off(NS);

//     $(document).on("click" + NS, ".quick-preview-btn", function (e) {
//         e.stopPropagation();
//         e.preventDefault();
//         window.show_purchase_order_preview($(this).data("name"), full_po_names);
//     });

//     $(document).on("click" + NS, "#refresh", function () {
//         const icon = $(this).find("i");
//         icon.addClass("fa-spin");
//         offset = 0;
//         load_data();
//         setTimeout(() => icon.removeClass("fa-spin"), 500);
//     });

//     $(document).on("click" + NS, "#reset_dashboard", function () {
//         const icon = $(this).find("i");
//         icon.addClass("fa-spin");

//         FILTER_DEFS.forEach(def => {
//             const ctrl = filters[def.key];
//             ctrl.set_value(def.type === "ms" ? [] : "");
//             cells[def.key].removeClass("has-value");
//         });

//         offset = 0;
//         setTimeout(() => {
//             FILTER_DEFS.forEach(def => sync_cell(def.key));
//             load_data();
//             icon.removeClass("fa-spin");
//         }, 300);
//     });

//     $(document).on("click" + NS, ".page-size-btn", function () {
//         $(".page-size-btn").removeClass("active");
//         $(this).addClass("active");
//         page_size = parseInt($(this).data("size"));
//         offset = 0;
//         load_data();
//     });

//     $(document).on("click" + NS, "#load_more", function () {
//         offset += page_size;
//         load_data(true);
//     });

//     // ---------------------- DOWNLOAD PURCHASE ORDER EXCEL ----------------------
//     $(document).on("click" + NS, "#download_purchase_excel", function () {
//         const btn = $(this);
//         if (btn.data("downloading")) return;

//         btn.data("downloading", true);
//         const original_html = btn.html();
//         btn.html(`<i class="fa fa-spinner" style="animation: spin 1s linear infinite;"></i> Preparing...`);

//         frappe.call({
//             method: "erp_custom.erp_custom.page.purchase_dashboard.purchase_dashboard.download_purchase_excel",
//             args: { filters: collect_filters() },
//             callback: function (r) {
//                 if (!r.message) {
//                     frappe.msgprint({ title: "Download Failed", message: "No Excel file was generated.", indicator: "red" });
//                     return;
//                 }
//                 window.open(r.message, "_blank");
//             },
//             error: function () {
//                 frappe.msgprint({ title: "Download Failed", message: "Unable to generate Purchase Order Excel.", indicator: "red" });
//             },
//             always: function () {
//                 btn.html(original_html);
//                 btn.data("downloading", false);
//             }
//         });
//     });

//     load_data();
// };



// frappe.pages['purchase-dashboard'].on_page_load = function (wrapper) {
//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: 'Purchase Dashboard',
//         single_column: true
//     });

//     $(wrapper).find('.layout-main').html(`
//     <style>
//         /* ================= THEME (single colour family) ================= */
//         .pd-wrap {
//             --pd-green: #16a34a;
//             --pd-green-dark: #15803d;
//             --pd-green-soft: #f0fdf4;
//             --pd-green-line: #bbf7d0;
//             --pd-text: #1f2937;
//             --pd-muted: #6b7280;
//             --pd-border: #e5e7eb;
//             --pd-gap: 16px;
//             font-family: inherit;
//             color: var(--pd-text);
//             max-width: 1400px;
//             width: 100%;
//             flex: 1 1 100%;
//             min-width: 0;
//             margin: 0 auto;
//             padding: 16px 12px 32px;
//             container-type: inline-size;     /* layout follows the real page width, not the screen */
//             container-name: pd;
//         }
//         .pd-wrap * { box-sizing: border-box; }
//         .ta-l { text-align: left !important; }

//         /* ================= CARD SHELL ================= */
//         .pd-card {
//             background: #fff;
//             border: 1px solid var(--pd-border);
//             border-radius: 14px;
//             box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
//             margin-bottom: 20px;
//         }
//         .pd-card.clip { overflow: hidden; }

//         /* per-section colours (same palette as the original dashboard) */
//         .theme-projects  { --hdr:#ffc107; --hdr-text:#212529; --line:#f59e0b; --soft:#fef3c7; --link:#b45309; }
//         .theme-suppliers { --hdr:#8b5cf6; --line:#8b5cf6; --soft:#ede9fe; --link:#6d28d9; }
//         .theme-items     { --hdr:#16a34a; --line:#16a34a; --soft:#dcfce7; --link:#15803d; }
//         .theme-required  { --hdr:#dc3545; --line:#ef4444; --soft:#fee2e2; --link:#b91c1c; }
//         .theme-overall   { --hdr:#22c55e; --line:#22c55e; --soft:#dcfce7; --link:#15803d; }
//         .pd-card-header {
//             background: var(--hdr, var(--pd-green));
//             color: var(--hdr-text, #fff);
//             font-size: 15px;
//             font-weight: 600;
//             letter-spacing: .3px;
//             padding: 12px 18px;
//             text-align: center;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             gap: 8px;
//             border-radius: 14px 14px 0 0;
//         }
//         .pd-card-header.split { display: grid; grid-template-columns: 1fr auto 1fr; gap: 10px; justify-content: stretch; }
//         .pd-card-header.split .hdr-title { text-align: center; }
//         .pd-card-header.split .pd-btn { justify-self: end; }
//         .pd-card-body { padding: 18px; }

//         /* ================= FILTER PANEL ================= */
//         .pd-filter-grid {
//             display: grid;
//             grid-template-columns: minmax(0, 1fr);
//             gap: var(--pd-gap);
//             align-items: center;
//         }
//         .pd-filter-cell { position: relative; min-width: 0; }
//         .pd-filter-cell .frappe-control,
//         .pd-filter-cell .form-group { margin: 0 !important; }
//         /* labels removed */
//         .pd-filter-cell .control-label,
//         .pd-filter-cell .clearfix,
//         .pd-filter-cell .help-box { display: none !important; }
//         .pd-filter-cell .form-control,
//         .pd-filter-cell .multiselect-list .form-control {
//             height: 38px;
//             font-size: 13px;
//             border-radius: 8px;
//             border: 1px solid var(--pd-border);
//             background: #fff;
//             display: flex;
//             align-items: center;
//         }
//         .pd-filter-cell input.form-control { display: block; }
//         .pd-filter-cell .form-control:focus,
//         .pd-filter-cell .multiselect-list.open .form-control {
//             border-color: var(--pd-green);
//             box-shadow: 0 0 0 3px rgba(22, 163, 74, .15);
//         }
//         .pd-filter-cell .multiselect-list .dropdown-menu,
//         .awesomplete > ul { z-index: 2000 !important; }

//         /* placeholder overlay for multiselect boxes (labels are hidden) */
//         .pd-ph {
//             position: absolute;
//             left: 12px; top: 0;
//             line-height: 38px;
//             font-size: 13px;
//             color: #9ca3af;
//             pointer-events: none;
//             z-index: 3;
//         }
//         .pd-filter-cell.has-value .pd-ph { display: none; }
//         .pd-filter-cell.ms:not(.has-value) .status-text { visibility: hidden; }

//         .pd-filter-actions {
//             grid-column: 1 / -1;
//             display: flex;
//             justify-content: flex-end;
//             align-items: center;
//             gap: 10px;
//         }
//         .pd-icon-btn {
//             width: 38px; height: 38px;
//             padding: 0;
//             border-radius: 8px;
//             display: inline-flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 15px;
//             cursor: pointer;
//             transition: all .2s ease;
//         }
//         .pd-icon-btn.primary { background: var(--pd-green); border: 1px solid var(--pd-green); color: #fff; }
//         .pd-icon-btn.primary:hover { background: var(--pd-green-dark); }
//         .pd-icon-btn.ghost { background: #fff; border: 1px solid var(--pd-green); color: var(--pd-green); }
//         .pd-icon-btn.ghost:hover { background: var(--pd-green-soft); }

//         /* ================= KPI CARDS ================= */
//         .pd-kpi-grid { display: grid; gap: var(--pd-gap); margin-bottom: var(--pd-gap); }
//         .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

//         .pd-kpi {
//             position: relative;
//             overflow: hidden;
//             background: var(--k-bg, #fff);
//             border: 1px solid transparent;
//             border-radius: 14px;
//             padding: 16px 16px 14px;
//             box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
//             transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
//             min-height: 108px;
//             display: flex;
//             flex-direction: column;
//             justify-content: space-between;
//         }
//         .pd-kpi.clickable { cursor: pointer; }
//         .pd-kpi.clickable:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 6px 16px rgba(0, 0, 0, .10);
//             border-color: var(--k);
//         }
//         /* icon sits flush on the top-right edge of the card */
//         .pd-kpi-icon {
//             position: absolute;
//             top: 0; right: 0;
//             width: 46px; height: 46px;
//             display: flex; align-items: center; justify-content: center;
//             background: var(--k, var(--pd-green));
//             color: #fff;
//             font-size: 18px;
//             border-radius: 0 14px 0 14px;
//         }
//         .pd-kpi-title {
//             font-size: 13px;
//             font-weight: 600;
//             color: #1f2937;
//             letter-spacing: .2px;
//             padding-right: 50px;
//             line-height: 1.3;
//         }
//         .pd-kpi-value {
//             font-size: 26px;
//             font-weight: 700;
//             color: var(--k, var(--pd-text));
//             line-height: 1.1;
//             margin-top: 12px;
//         }
//         .pd-kpi-row {
//             display: flex; justify-content: space-between; align-items: baseline;
//             margin-top: 10px; font-size: 13px; color: var(--pd-muted);
//         }
//         .pd-kpi-row b { font-size: 18px; color: var(--pd-text); }
//         .pd-kpi-amount {
//             margin-top: 4px;
//             text-align: right;
//             font-size: 15px;
//             font-weight: 700;
//             color: var(--k, var(--pd-green-dark));
//             overflow-wrap: anywhere;
//         }

//         /* ================= TABLES ================= */
//         .pd-grid-2 { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; }
//         .pd-grid-2 .pd-card { margin-bottom: 0; height: 100%; }
//         .pd-section { margin-bottom: 20px; }

//         .pd-table-wrap { width: 100%; overflow-x: auto; }
//         .pd-table-wrap.tall { max-height: 500px; overflow-y: auto; }
//         .pd-table-wrap table {
//             width: max-content;
//             min-width: 100%;
//             white-space: nowrap;
//             margin-bottom: 0;
//             font-variant-numeric: tabular-nums;
//         }
//         .pd-table-wrap thead th {
//             position: sticky; top: 0; z-index: 10;
//             background: #f8fafc;
//             font-weight: 700;
//             font-size: 13px;
//             color: #374151;
//             text-align: center;
//             border-bottom: 2px solid var(--pd-border);
//             padding: 10px 14px;
//         }
//         .pd-table-wrap tbody td {
//             font-size: 13px;
//             vertical-align: middle;
//             text-align: center;
//             border-color: #f1f5f9;
//             padding: 10px 14px;
//         }
//         .pd-table-wrap tbody tr:hover { background: #f8fafc; }
//         .pd-table-wrap tfoot td {
//             background: var(--soft, var(--pd-green-soft));
//             border-top: 2px solid var(--line, var(--pd-green));
//             font-weight: 700;
//             font-size: 13px;
//             padding: 12px 14px;
//             text-align: center;
//             vertical-align: middle;
//         }
//         .pd-table-wrap a { color: var(--link, var(--pd-green-dark)); font-weight: 500; }

//         .pd-pager {
//             display: flex; justify-content: space-between; align-items: center;
//             flex-wrap: wrap; gap: 10px;
//             padding: 12px 18px;
//             border-top: 1px solid var(--pd-border);
//             background: #f9fafb;
//             border-radius: 0 0 14px 14px;
//         }
//         .pd-size-group { display: inline-flex; }
//         .pd-size-btn {
//             border: 1px solid var(--pd-green);
//             background: #fff; color: var(--pd-green);
//             font-size: 13px; font-weight: 600;
//             padding: 5px 14px; cursor: pointer;
//             margin-left: -1px;
//         }
//         .pd-size-btn:first-child { border-radius: 8px 0 0 8px; margin-left: 0; }
//         .pd-size-btn:last-child { border-radius: 0 8px 8px 0; }
//         .pd-size-btn.active { background: var(--pd-green); color: #fff; }
//         .pd-btn {
//             background: var(--pd-green); color: #fff; border: 1px solid var(--pd-green);
//             border-radius: 8px; font-size: 13px; font-weight: 600;
//             padding: 6px 16px; cursor: pointer;
//         }
//         .pd-btn:hover { background: var(--pd-green-dark); }
//         .pd-btn.light { background: #fff; color: var(--pd-green-dark); border-color: #fff; display: inline-flex; align-items: center; gap: 6px; }

//         /* ================= SUPPLIER PIE + ITEM GROUP BARS ================= */
//         .pd-split-card { display: flex; flex-direction: column; container-type: inline-size; container-name: card; }
//         .pd-total-strip {
//             margin-top: auto;
//             display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
//             gap: 6px 18px;
//             background: var(--soft);
//             border-top: 2px solid var(--line);
//             padding: 12px 18px;
//             font-size: 13px; font-weight: 700; color: #1f2937;
//         }
//         .pd-total-strip span b { margin-left: 6px; font-variant-numeric: tabular-nums; }

//         .pd-scroll-list { max-height: 420px; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
//         .pd-scroll-list::-webkit-scrollbar { width: 6px; }
//         .pd-scroll-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
//         .pd-empty { padding: 28px 16px; text-align: center; color: var(--pd-muted); font-size: 13px; }

//         .pd-kv { display: flex; flex-wrap: wrap; gap: 6px; font-size: 12px; color: var(--pd-muted); line-height: 1.6; }
//         .pd-kv b { color: #1f2937; font-weight: 600; font-variant-numeric: tabular-nums; }

//         /* supplier: pie on the left, scrollable list on the right */
//         .pd-sup-body { flex: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 16px; }
//         .pd-pie-col { flex: 0 0 190px; max-width: 100%; margin: 0 auto; }
//         .pd-pie { width: 100%; height: auto; display: block; filter: drop-shadow(0 2px 6px rgba(0, 0, 0, .12)); }
//         .pd-pie path, .pd-pie circle { transition: opacity .15s; cursor: pointer; }
//         .pd-pie path:hover, .pd-pie circle:hover { opacity: .8; }
//         .pd-sup-body .pd-scroll-list { flex: 1 1 260px; min-width: 0; }
//         .pd-sup-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
//         .pd-sup-item:hover { background: var(--soft); }
//         .pd-dot { width: 10px; height: 10px; border-radius: 50%; flex: 0 0 10px; align-self: flex-start; margin-top: 5px; }
//         .pd-sup-main { flex: 1; min-width: 0; }
//         .pd-sup-name { font-size: 13px; font-weight: 700; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
//         .pd-orders { flex: 0 0 auto; min-width: 58px; text-align: center; padding: 6px 10px; border-radius: 10px; background: var(--soft); }
//         .pd-orders b { display: block; font-size: 18px; line-height: 1.1; color: var(--link); }
//         .pd-orders small { display: block; font-size: 10px; color: var(--pd-muted); text-transform: uppercase; letter-spacing: .4px; }

//         /* item group: [Item / Group boxes] [horizontal bar] [Basic / GST] */
//         .pd-item-row {
//             display: grid;
//             grid-template-columns: minmax(110px, 170px) minmax(70px, 1fr) auto;
//             grid-template-areas: "tags bar vals";
//             align-items: center; gap: 12px;
//             padding: 10px 16px; border-bottom: 1px solid #f1f5f9;
//         }
//         .pd-item-row:hover { background: var(--soft); }
//         .pd-item-tags { grid-area: tags; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
//         .pd-tag { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .tag-item  { background: #dbeafe; color: #1e40af; }
//         .tag-group { background: #ffedd5; color: #9a3412; }
//         .pd-bar-col { grid-area: bar; min-width: 0; }
//         .pd-bar-track { height: 14px; border-radius: 7px; background: #f1f5f9; overflow: hidden; }
//         .pd-bar-fill { height: 100%; border-radius: 7px; background: linear-gradient(90deg, #4ade80, #16a34a); transition: width .5s ease; }
//         .pd-bar-cap { font-size: 11px; color: var(--pd-muted); margin-top: 4px; }
//         .pd-item-vals { grid-area: vals; }
//         .pd-item-vals .pd-kv { justify-content: flex-end; flex-wrap: nowrap; white-space: nowrap; }

//         @container card (max-width: 430px) {
//             .pd-item-row { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "tags vals" "bar bar"; }
//             .pd-sup-body { padding: 12px 8px; }
//         }
//         @container card (max-width: 340px) {
//             .pd-item-row { grid-template-columns: minmax(0, 1fr); grid-template-areas: "tags" "bar" "vals"; }
//             .pd-item-vals .pd-kv { justify-content: flex-start; flex-wrap: wrap; }
//         }

//         /* PO name / supplier: clean left-aligned columns */
//         .pd-po-cell { display: inline-flex; align-items: center; gap: 6px; }
//         .pd-po-cell .quick-preview-btn { display: inline-flex; width: 18px; justify-content: center; }

//         /* ================= PROJECTS: bar chart (left) + scrollable data (right) ================= */
//         .pd-proj-body { flex: 1; display: flex; flex-wrap: wrap; gap: 16px; padding: 16px; align-items: flex-start; }
//         .pd-proj-chart { flex: 2 1 320px; min-width: 0; }
//         .pd-proj-list { flex: 3 1 380px; min-width: 0; container-type: inline-size; container-name: plist; }
//         .pd-chart-title { font-size: 13px; font-weight: 700; color: #1f2937; margin-bottom: 6px; }
//         .pd-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12px; color: var(--pd-muted); margin-bottom: 8px; }
//         .pd-legend .sw { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; }
//         .sw.so, .pd-hb-fill.so { background: #f59e0b; }
//         .sw.po, .pd-hb-fill.po { background: #3b82f6; }
//         .pd-hb-row { display: grid; grid-template-columns: 84px minmax(0, 1fr); align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px dashed #eef2f7; }
//         .pd-hb-label { font-size: 12px; font-weight: 600; color: #374151; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .pd-hb-line { display: flex; align-items: center; gap: 8px; height: 12px; margin: 2px 0; }
//         .pd-hb-track { flex: 1; min-width: 0; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
//         .pd-hb-fill { height: 100%; border-radius: 4px; transition: width .5s ease; }
//         .pd-hb-val { flex: 0 0 58px; font-size: 11px; color: var(--pd-muted); text-align: right; font-variant-numeric: tabular-nums; }

//         .pd-proj-item { padding: 12px; border-bottom: 1px solid #f1f5f9; }
//         .pd-proj-item:hover { background: #fffdf5; }
//         .pd-proj-head { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; margin-bottom: 8px; }
//         .pd-proj-name { flex: 1 1 auto; min-width: 0; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .pd-proj-name a { color: var(--link); }
//         .pd-proj-tag { flex: 0 1 auto; max-width: 42%; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 8px; background: #fef3c7; color: #92400e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .pd-proj-orders { flex: 0 0 auto; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: var(--soft); color: var(--link); white-space: nowrap; }
//         .pd-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
//         .pd-pcol { border-radius: 8px; padding: 8px 10px; min-width: 0; }
//         .pd-pcol.so { background: #fffbeb; border-left: 3px solid #f59e0b; }
//         .pd-pcol.po { background: #eff6ff; border-left: 3px solid #3b82f6; }
//         .pd-prow { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0 8px; font-size: 12px; line-height: 1.7; }
//         .pd-prow span { color: var(--pd-muted); }
//         .pd-prow b { color: #1f2937; font-weight: 600; font-variant-numeric: tabular-nums; margin-left: auto; overflow-wrap: anywhere; }
//         @container plist (max-width: 360px) { .pd-pair { grid-template-columns: minmax(0, 1fr); } }

//         @keyframes spin { to { transform: rotate(360deg); } }

//         /* ================= RESPONSIVE (container queries) ================= */
//         @media (max-width: 575px) { .pd-wrap { padding: 12px 8px 24px; } }

//         @container pd (min-width: 520px) {
//             .pd-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//             .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
//         }
//         @container pd (min-width: 820px) {
//             .pd-filter-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
//             .pd-filter-actions { grid-column: 3 / -1; }
//         }
//         @container pd (min-width: 1100px) {
//             .pd-kpi-grid.cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
//             .pd-kpi-grid.cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
//             .pd-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//         }
//         @container pd (max-width: 560px) {
//             .pd-card-header { font-size: 14px; padding: 11px 14px; }
//             .pd-card-header.split { grid-template-columns: 1fr auto; }
//             .pd-card-header.split .hdr-spacer { display: none; }
//             .pd-card-header.split .hdr-title { text-align: left; }
//             .pd-card-body { padding: 14px 12px; }
//             .pd-kpi { padding: 14px 12px; min-height: 96px; }
//             .pd-kpi-title { font-size: 12px; }
//             .pd-kpi-value { font-size: 22px; }
//             .pd-kpi-amount { font-size: 14px; }
//             .pd-table-wrap thead th, .pd-table-wrap tbody td, .pd-table-wrap tfoot td { padding: 8px 10px; font-size: 12px; }
//             .pd-pager { padding: 10px 12px; }
//             .pd-total-strip { padding: 10px 12px; font-size: 12px; }
//         }
//         @container pd (max-width: 400px) {
//             .pd-card-header.split .btn-txt { display: none; }
//             .pd-icon-btn { width: 42px; height: 42px; }
//             .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { gap: 10px; }
//         }
//         @container pd (max-width: 330px) {
//             .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { grid-template-columns: minmax(0, 1fr); }
//         }
//     </style>

//     <div class="pd-wrap">

//         <!-- FILTERS PANEL -->
//         <div class="pd-card">
//             <div class="pd-card-header" style="justify-content:flex-start;">
//                 <i class="fa fa-search"></i> Filter Purchase Orders
//             </div>
//             <div class="pd-card-body">
//                 <div class="pd-filter-grid" id="pd_filter_grid">
//                     <div class="pd-filter-actions" id="pd_filter_actions">
//                         <button class="pd-icon-btn primary" id="refresh" title="Apply Filters"><i class="fa fa-filter"></i></button>
//                         <button class="pd-icon-btn ghost" id="reset_dashboard" title="Refresh Dashboard"><i class="fa fa-refresh"></i></button>
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <!-- KPI SECTION -->
//         <div class="pd-kpi-grid cols-5" id="kpi_cards_row1"></div>
//         <div class="pd-kpi-grid cols-6" id="kpi_cards_row2"></div>

//         <!-- TOP PROJECTS (bar chart + data) -->
//         <div class="pd-card clip pd-section pd-split-card theme-projects">
//             <div class="pd-card-header"><i class="fa fa-sitemap"></i> Top 10 Projects</div>
//             <div class="pd-proj-body">
//                 <div class="pd-proj-chart">
//                     <div class="pd-chart-title">Basic Value : SO vs PO</div>
//                     <div class="pd-legend">
//                         <span><i class="sw so"></i>Sales Order (Basic)</span>
//                         <span><i class="sw po"></i>Purchase Order (Basic)</span>
//                     </div>
//                     <div id="project_chart"></div>
//                 </div>
//                 <div class="pd-scroll-list pd-proj-list" id="project_list"></div>
//             </div>
//             <div class="pd-total-strip">
//                 <span>Overall Total</span>
//                 <span>Orders<b id="project_total_count">0</b></span>
//                 <span>Basic Value (SO)<b id="project_total_so_amount">0.00</b></span>
//                 <span>GST 18% (SO)<b id="project_total_so_gst">0.00</b></span>
//                 <span>Basic Value (PO)<b id="project_total_po_basic">0.00</b></span>
//                 <span>GST 18% (PO)<b id="project_total_amount">0.00</b></span>
//             </div>
//         </div>

//         <!-- TOP SUPPLIERS (pie) + TOP ITEM GROUPS (bars) -->
//         <div class="pd-grid-2 pd-section">
//             <div class="pd-card clip pd-split-card theme-suppliers">
//                 <div class="pd-card-header"><i class="fa fa-truck"></i> Top 10 Suppliers</div>
//                 <div class="pd-sup-body">
//                     <div class="pd-pie-col" id="supplier_pie"></div>
//                     <div class="pd-scroll-list" id="supplier_list"></div>
//                 </div>
//                 <div class="pd-total-strip">
//                     <span>Overall Total</span>
//                     <span>Orders<b id="sup_total_count">0</b></span>
//                     <span>Basic Value<b id="sup_total_amount">0.00</b></span>
//                     <span>GST Value<b id="sup_total_gst">0.00</b></span>
//                 </div>
//             </div>

//             <div class="pd-card clip pd-split-card theme-items">
//                 <div class="pd-card-header"><i class="fa fa-cube"></i> Top 10 Item Group</div>
//                 <div class="pd-scroll-list" id="item_list" style="flex:1"></div>
//                 <div class="pd-total-strip">
//                     <span>Overall Total</span>
//                     <span>Orders<b id="item_total_count">0</b></span>
//                     <span>Basic Value<b id="item_total_amount">0.00</b></span>
//                     <span>GST Value<b id="item_total_gst">0.00</b></span>
//                 </div>
//             </div>
//         </div>

//         <!-- REQUIRED BY - NEXT 7 DAYS -->
//         <div class="pd-card clip pd-section theme-required">
//             <div class="pd-card-header"><i class="fa fa-clock-o"></i> Required By</div>
//             <div class="pd-table-wrap tall">
//                 <table class="table table-hover align-middle">
//                     <thead>
//                         <tr>
//                             <th class="ta-l">PO Name</th><th class="ta-l">Supplier</th><th>Project</th><th>Order Type</th>
//                             <th>Date</th><th>Required By</th><th>Status</th><th>Grand Total</th>
//                         </tr>
//                     </thead>
//                     <tbody id="upcoming_po_table"></tbody>
//                     <tfoot>
//                         <tr>
//                             <td class="ta-l" colspan="7">Overall Orders : <span id="upcoming_po_count">0</span></td>
//                             <td id="upcoming_po_total_amount">0.00</td>
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>
//         </div>

//         <!-- FULL PURCHASE ORDER DATA -->
//         <div class="pd-card clip pd-section theme-overall">
//             <div class="pd-card-header split">
//                 <span class="hdr-spacer"></span>
//                 <span class="hdr-title"><i class="fa fa-list"></i> Overall Purchase Order</span>
//                 <button type="button" id="download_purchase_excel" class="pd-btn light" title="Download Purchase Order Excel">
//                     <i class="fa fa-download"></i> <span class="btn-txt">Download Excel</span>
//                 </button>
//             </div>

//             <div class="pd-table-wrap tall">
//                 <table class="table table-hover align-middle">
//                     <thead>
//                         <tr>
//                             <th class="ta-l">PO Name</th><th class="ta-l">Supplier</th><th>Project</th><th>Order Type</th>
//                             <th>Date</th><th>Required By</th><th>Status</th>
//                             <th>Net Total</th><th>Taxes &amp; Charges</th><th>Grand Total</th>
//                         </tr>
//                     </thead>
//                     <tbody id="full_po_table"></tbody>
//                     <tfoot>
//                         <tr>
//                             <td class="ta-l" colspan="7">
//                                 <div>Overall Orders : <span id="full_po_count">0</span>
//                                     <span style="font-weight:400;color:var(--pd-muted);">&nbsp;(Showing <span id="full_po_shown">0</span>)</span></div>
//                                 <small style="font-weight:400;color:var(--pd-muted);font-style:italic;">
//                                     <i class="fa fa-info-circle" style="color:var(--line)"></i>
//                                     Cancelled orders are displayed in table but INR value not considered.
//                                 </small>
//                             </td>
//                             <td><strong>Net Total</strong><br><span id="full_po_total_net">0.00</span></td>
//                             <td><strong>Taxes &amp; Charges</strong><br><span id="full_po_total_taxes">0.00</span></td>
//                             <td><strong>Grand Total</strong><br><span id="full_po_total_amount">0.00</span></td>
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>

//             <div class="pd-pager">
//                 <div class="pd-size-group" id="page_size_group">
//                     <button class="pd-size-btn active page-size-btn" data-size="20">20</button>
//                     <button class="pd-size-btn page-size-btn" data-size="100">100</button>
//                     <button class="pd-size-btn page-size-btn" data-size="500">500</button>
//                     <button class="pd-size-btn page-size-btn" data-size="2500">All</button>
//                 </div>
//                 <button class="pd-btn" id="load_more">Load More</button>
//             </div>
//         </div>
//     </div>
//     `);

//     // ---------------------- FILTER CONTROLS (all multiselect; dates use range) ----------------------
//     const link_options = doctype => txt => frappe.db.get_link_options(doctype, txt);
//     const static_options = list => () => list.map(v => ({ value: v, description: "" }));

//     const FILTER_DEFS = [
//         { key: "id",               ph: "Order Number",   type: "ms", get_data: link_options("Purchase Order") },
//         { key: "order_type",       ph: "Order Type",     type: "ms", get_data: static_options(["Purchase Order", "Work Order", "Transport Order"]) },
//         { key: "project",          ph: "Project",        type: "ms", get_data: link_options("Project") },
//         { key: "supplier",         ph: "Supplier",       type: "ms", get_data: link_options("Supplier") },
//         { key: "item",             ph: "Item",           type: "ms", get_data: link_options("Item") },
//         { key: "item_group",       ph: "Item Group",     type: "ms", get_data: link_options("Item Group") },
//         { key: "status",           ph: "Status",         type: "ms", get_data: static_options(["Draft", "Technical Review", "Finance Review", "Approved", "Cancelled"]) },
//         { key: "transaction_date", ph: "Date",           type: "range" },
//         { key: "schedule_date",    ph: "Required By",    type: "range" },
//         { key: "fiscal_year",      ph: "Fiscal Year",    type: "ms", get_data: link_options("Fiscal Year") }
//     ];

//     let filters = {};
//     let cells = {};

//     function sync_cell(key) {
//         const v = filters[key].get_value();
//         const has = Array.isArray(v) ? v.length > 0 : !!v;
//         cells[key].toggleClass("has-value", has);
//     }

//     FILTER_DEFS.forEach(def => {
//         const $cell = $('<div class="pd-filter-cell"></div>').insertBefore($(wrapper).find("#pd_filter_actions"));
//         cells[def.key] = $cell;

//         let df = { fieldname: def.key, label: def.ph, placeholder: def.ph };
//         if (def.type === "ms") {
//             $cell.addClass("ms").append(`<span class="pd-ph">${def.ph}</span>`);
//             Object.assign(df, { fieldtype: "MultiSelectList", get_data: def.get_data });
//         } else {
//             Object.assign(df, { fieldtype: "DateRange" });
//         }

//         filters[def.key] = frappe.ui.form.make_control({ parent: $cell, df: df, render_input: true });
//         $cell.on("click change input focusout", () => setTimeout(() => sync_cell(def.key), 150));
//     });

//     function collect_filters(extra) {
//         let f = {};
//         Object.keys(filters).forEach(k => { f[k] = filters[k].get_value() || []; });
//         return Object.assign(f, extra || {});
//     }

//     // ---------------------- DATA LOADING ----------------------
//     let page_size = 20;
//     let offset = 0;
//     let full_po_names = [];
//     let po_tot = { net: 0, tax: 0, grand: 0 };

//     function load_data(load_more = false) {
//         frappe.call({
//             method: "erp_custom.erp_custom.page.purchase_dashboard.purchase_dashboard.get_dashboard_data",
//             args: { filters: collect_filters({ limit: page_size, offset: offset }) },
//             callback: function (r) {
//                 let data = r.message || {};
//                 render_kpis(data);
//                 render_suppliers(data.top_suppliers || []);
//                 render_items(data.top_items || []);
//                 render_projects(data.top_projects || []);
//                 render_full_po_table(data.full_po_list || [], load_more);
//                 render_upcoming_table(data.upcoming_required_by || []);
//                 $("#full_po_count").text(data.full_po_count || 0);
//                 $("#full_po_shown").text(full_po_names.length);
//             }
//         });
//     }

//     // ---------------------- KPI CARDS ----------------------
//     function render_kpis(data) {
//         let status_map = { "Draft": 0, "Technical Review": 0, "Finance Review": 0, "Approved": 0, "Cancelled": 0 };

//         (data.status_counts || []).forEach(r => {
//             let key = r.workflow_state || "Draft";
//             if (key in status_map) status_map[key] = Number(r.count || 0);
//         });

//         let total_po = Object.values(status_map).reduce((a, b) => a + b, 0);

//         let order_type_map = {
//             "Purchase Order": { count: 0, amount: 0 },
//             "Work Order": { count: 0, amount: 0 },
//             "Transport Order": { count: 0, amount: 0 },
//             "Others": { count: 0, amount: 0 }
//         };

//         (data.order_types || []).forEach(r => {
//             let key = order_type_map[r.custom_order_type] ? r.custom_order_type : "Others";
//             order_type_map[key].count += Number(r.count || 0);
//             order_type_map[key].amount += Number(r.total_amount || 0);
//         });

//         let total_amount = order_type_map["Purchase Order"].amount
//             + order_type_map["Work Order"].amount
//             + order_type_map["Transport Order"].amount;

//         $("#kpi_cards_row1").html(`
//             ${kpiCardTwoStat("Total (PO+WO+TO)", total_po, total_amount, "fa-file-text-o", "#4F46E5", "#E0E7FF")}
//             ${kpiCardTwoStat("Purchase Order", order_type_map["Purchase Order"].count, order_type_map["Purchase Order"].amount, "fa-shopping-cart", "#2563EB", "#DBEAFE", "Purchase Order")}
//             ${kpiCardTwoStat("Work Order", order_type_map["Work Order"].count, order_type_map["Work Order"].amount, "fa-industry", "#16A34A", "#DCFCE7", "Work Order")}
//             ${kpiCardTwoStat("Transport Order", order_type_map["Transport Order"].count, order_type_map["Transport Order"].amount, "fa-truck", "#EA580C", "#FFEDD5", "Transport Order")}
//             ${kpiCardTwoStat("Others", order_type_map["Others"].count, order_type_map["Others"].amount, "fa-folder-open-o", "#64748B", "#F1F5F9")}
//         `);

//         $("#kpi_cards_row2").html(`
//             ${kpiCard("Draft", status_map["Draft"], "fa-pencil-square-o", "#F59E0B", "#FEF3C7", "Draft")}
//             ${kpiCard("Technical Review", status_map["Technical Review"], "fa-wrench", "#3B82F6", "#DBEAFE", "Technical Review")}
//             ${kpiCard("Finance Review", status_map["Finance Review"], "fa-money", "#8B5CF6", "#EDE9FE", "Finance Review")}
//             ${kpiCard("Approved", status_map["Approved"], "fa-check-circle", "#22C55E", "#DCFCE7", "Approved")}
//             ${kpiCard("Cancelled", status_map["Cancelled"], "fa-ban", "#EF4444", "#FEE2E2", "Cancelled")}
//             ${kpiCard("RFQ Raised", data.rfq_count || 0, "fa-envelope-o", "#0EA5E9", "#E0F2FE", "RFQ")}
//         `);
//     }

//     function kpiCardTwoStat(title, count, amount, icon, accent, bg, orderType) {
//         const click = orderType ? `onclick="open_purchase_order_list('${orderType}')"` : "";
//         return `
//             <div class="pd-kpi ${orderType ? "clickable" : ""}" style="--k:${accent};--k-bg:${bg};" ${click}>
//                 <div class="pd-kpi-icon"><i class="fa ${icon}"></i></div>
//                 <div class="pd-kpi-title">${title}</div>
//                 <div>
//                     <div class="pd-kpi-row"><span>Count</span><b>${count || 0}</b></div>
//                     <div class="pd-kpi-amount">${frappe.format(amount || 0, { fieldtype: "Currency" })}</div>
//                 </div>
//             </div>`;
//     }

//     function kpiCard(title, value, icon, accent, bg, status) {
//         return `
//             <div class="pd-kpi clickable" style="--k:${accent};--k-bg:${bg};" onclick="open_status_list('${status}')">
//                 <div class="pd-kpi-icon"><i class="fa ${icon}"></i></div>
//                 <div class="pd-kpi-title">${title}</div>
//                 <div class="pd-kpi-value">${value || 0}</div>
//             </div>`;
//     }

//     window.open_status_list = function (status) {
//         if (status === "RFQ") {
//             frappe.set_route("List", "Request for Quotation");
//             return;
//         }
//         frappe.route_options = { workflow_state: status };
//         frappe.set_route("List", "Purchase Order");
//     };

//     window.open_purchase_order_list = function (order_type) {
//         frappe.route_options = { custom_order_type: order_type };
//         frappe.set_route("List", "Purchase Order");
//     };

//     // ---------------------- RENDER FUNCTIONS ----------------------
//     const cur = v => frappe.format(v, { fieldtype: "Currency" });

//     const esc = frappe.utils.escape_html;
//     const cur_text = v => String(frappe.format(v, { fieldtype: "Currency" }, { only_value: true })).replace(/<[^>]*>/g, "");
//     const PIE_COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b", "#f97316", "#ef4444", "#ec4899"];

//     function render_pie(rows) {
//         const slices = (rows || []).map((r, i) => ({
//             label: r.supplier || "-",
//             value: Number(r.total_amount || 0),
//             color: PIE_COLORS[i % PIE_COLORS.length]
//         })).filter(x => x.value > 0);

//         const total = slices.reduce((a, x) => a + x.value, 0);
//         if (!total) {
//             $("#supplier_pie").html('<div class="pd-empty">No chart data</div>');
//             return;
//         }

//         const cx = 100, cy = 100, r = 96;
//         let angle = -Math.PI / 2, paths = "";

//         slices.forEach(x => {
//             const frac = x.value / total;
//             const tip = `${esc(x.label)}: ${cur_text(x.value)} (${(frac * 100).toFixed(1)}%)`;

//             if (frac >= 0.9999) {
//                 paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.color}"><title>${tip}</title></circle>`;
//                 return;
//             }
//             const end = angle + frac * 2 * Math.PI;
//             const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
//             const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
//             paths += `<path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z"
//                         fill="${x.color}" stroke="#fff" stroke-width="2"><title>${tip}</title></path>`;
//             angle = end;
//         });

//         $("#supplier_pie").html(`<svg viewBox="0 0 200 200" class="pd-pie" role="img" aria-label="Supplier share by basic value">${paths}</svg>`);
//     }

//     function render_suppliers(rows) {
//         rows = rows || [];
//         let html = "", total_count = 0, total_amount = 0, total_gst = 0;

//         rows.forEach((r, i) => {
//             const count = Number(r.count || 0);
//             const amount = Number(r.total_amount || 0);
//             const gst = Number(r.total_taxes_and_charges || 0);
//             total_count += count; total_amount += amount; total_gst += gst;
//             const name = r.supplier || "-";

//             html += `
//                 <div class="pd-sup-item">
//                     <span class="pd-dot" style="background:${PIE_COLORS[i % PIE_COLORS.length]}"></span>
//                     <div class="pd-sup-main">
//                         <div class="pd-sup-name" title="${esc(name)}">${esc(name)}</div>
//                         <div class="pd-kv"><span>Basic Value</span><b>${cur_text(amount)}</b></div>
//                         <div class="pd-kv"><span>GST Value</span><b>${cur_text(gst)}</b></div>
//                     </div>
//                     <div class="pd-orders"><b>${count}</b><small>Orders</small></div>
//                 </div>`;
//         });

//         $("#supplier_list").html(html || '<div class="pd-empty">No suppliers found for the selected filters.</div>');
//         render_pie(rows);

//         $("#sup_total_count").text(total_count);
//         $("#sup_total_amount").text(cur_text(total_amount));
//         $("#sup_total_gst").text(cur_text(total_gst));
//     }

//     function render_items(rows) {
//         rows = rows || [];
//         let html = "", total_orders = 0, total_basic = 0, total_gst = 0;
//         const max = Math.max(0, ...rows.map(r => Number(r.basic_value || 0)));

//         rows.forEach(r => {
//             const orders = Number(r.order_count || 0);
//             const basic = Number(r.basic_value || 0);
//             const gst = Number(r.gst_value || 0);
//             total_orders += orders; total_basic += basic; total_gst += gst;

//             const width = max > 0 ? Math.max(3, (basic / max) * 100) : 0;
//             const item = r.item || "-", group = r.item_group || "-";

//             html += `
//                 <div class="pd-item-row">
//                     <div class="pd-item-tags">
//                         <div class="pd-tag tag-item" title="Item: ${esc(item)}">${esc(item)}</div>
//                         <div class="pd-tag tag-group" title="Item Group: ${esc(group)}">${esc(group)}</div>
//                     </div>
//                     <div class="pd-bar-col" title="${cur_text(basic)}">
//                         <div class="pd-bar-track"><div class="pd-bar-fill" style="width:${width.toFixed(1)}%"></div></div>
//                         <div class="pd-bar-cap">${orders} Orders</div>
//                     </div>
//                     <div class="pd-item-vals">
//                         <div class="pd-kv"><span>Basic Value</span><b>${cur_text(basic)}</b></div>
//                         <div class="pd-kv"><span>GST Value</span><b>${cur_text(gst)}</b></div>
//                     </div>
//                 </div>`;
//         });

//         $("#item_list").html(html || '<div class="pd-empty">No items found for the selected filters.</div>');
//         $("#item_total_count").text(total_orders);
//         $("#item_total_amount").text(cur_text(total_basic));
//         $("#item_total_gst").text(cur_text(total_gst));
//     }

//     const compact = v => {
//         v = Number(v || 0);
//         const a = Math.abs(v);
//         if (a >= 1e7) return (v / 1e7).toFixed(2) + " Cr";
//         if (a >= 1e5) return (v / 1e5).toFixed(2) + " L";
//         if (a >= 1e3) return (v / 1e3).toFixed(1) + " K";
//         return v.toFixed(0);
//     };

//     function render_projects(rows) {
//         rows = rows || [];
//         let list = "", bars = "";
//         let t = { count: 0, so_basic: 0, so_gst: 0, po_basic: 0, spend: 0 };
//         const max = Math.max(0, ...rows.map(r => Math.max(Number(r.so_basic_value || 0), Number(r.po_basic_value || 0))));
//         const w = v => (max > 0 && v > 0) ? Math.max(2, (v / max) * 100).toFixed(1) : 0;

//         rows.forEach(r => {
//             const count = Number(r.count || 0);
//             const so_basic = Number(r.so_basic_value || 0);
//             const so_gst = Number(r.so_gst_value || 0);
//             const po_basic = Number(r.po_basic_value || 0);
//             const spend = Number(r.total_amount || 0);
//             t.count += count; t.so_basic += so_basic; t.so_gst += so_gst; t.po_basic += po_basic; t.spend += spend;

//             const name = r.project || "-";
//             const tag = r.tag_name || "";

//             bars += `
//                 <div class="pd-hb-row" title="${esc(name)}&#10;SO: ${cur_text(so_basic)}&#10;PO: ${cur_text(po_basic)}">
//                     <div class="pd-hb-label">${esc(name)}</div>
//                     <div>
//                         <div class="pd-hb-line"><div class="pd-hb-track"><div class="pd-hb-fill so" style="width:${w(so_basic)}%"></div></div><span class="pd-hb-val">${compact(so_basic)}</span></div>
//                         <div class="pd-hb-line"><div class="pd-hb-track"><div class="pd-hb-fill po" style="width:${w(po_basic)}%"></div></div><span class="pd-hb-val">${compact(po_basic)}</span></div>
//                     </div>
//                 </div>`;

//             list += `
//                 <div class="pd-proj-item">
//                     <div class="pd-proj-head">
//                         <div class="pd-proj-name" title="${esc(name)}">${r.project ? `<a href="/app/project/${encodeURIComponent(r.project)}" target="_blank">${esc(name)}</a>` : "-"}</div>
//                         <div class="pd-proj-tag" title="Tag: ${esc(tag || "-")}"><i class="fa fa-tag"></i> ${esc(tag || "-")}</div>
//                         <div class="pd-proj-orders">${count} Orders</div>
//                     </div>
//                     <div class="pd-pair">
//                         <div class="pd-pcol so">
//                             <div class="pd-prow"><span>Basic Value (SO)</span><b>${cur_text(so_basic)}</b></div>
//                             <div class="pd-prow"><span>GST 18% (SO)</span><b>${cur_text(so_gst)}</b></div>
//                         </div>
//                         <div class="pd-pcol po">
//                             <div class="pd-prow"><span>Basic Value (PO)</span><b>${cur_text(po_basic)}</b></div>
//                             <div class="pd-prow"><span>GST 18% (PO)</span><b>${cur_text(spend)}</b></div>
//                         </div>
//                     </div>
//                 </div>`;
//         });

//         $("#project_chart").html(max > 0 ? bars : '<div class="pd-empty">No chart data</div>');
//         $("#project_list").html(list || '<div class="pd-empty">No projects found for the selected filters.</div>');

//         $("#project_total_count").text(t.count);
//         $("#project_total_so_amount").text(cur_text(t.so_basic));
//         $("#project_total_so_gst").text(cur_text(t.so_gst));
//         $("#project_total_po_basic").text(cur_text(t.po_basic));
//         $("#project_total_amount").text(cur_text(t.spend));
//     }

//     function paint_po_totals() {
//         $("#full_po_total_net").html(cur(po_tot.net));
//         $("#full_po_total_taxes").html(cur(po_tot.tax));
//         $("#full_po_total_amount").html(cur(po_tot.grand));
//     }

//     function render_full_po_table(rows, append = false) {
//         rows = rows || [];
//         $("#load_more").toggle(rows.length >= page_size);

//         if (!append) {
//             full_po_names = [];
//             po_tot = { net: 0, tax: 0, grand: 0 };
//         }

//         if (!rows.length) {
//             if (!append) {
//                 $("#full_po_table").html(`<tr><td colspan="10" style="color:var(--pd-muted);padding:16px;">No Purchase Orders found for the selected filters.</td></tr>`);
//                 paint_po_totals();
//             }
//             return;
//         }

//         let html = "";
//         rows.forEach(r => {
//             let net_total = Number(r.net_total || 0);
//             let taxes = Number(r.total_taxes_and_charges || 0);
//             let grand_total = Number(r.grand_total || 0);
//             full_po_names.push(r.name);

//             // Cancelled PO values are NOT included in overall totals
//             if (r.workflow_state !== "Cancelled") {
//                 po_tot.net += net_total;
//                 po_tot.tax += taxes;
//                 po_tot.grand += grand_total;
//             }

//             html += `<tr>
//                 <td class="ta-l">
//                     <span class="pd-po-cell">
//                         <span class="quick-preview-btn" data-name="${r.name}" title="Quick Preview" style="cursor:pointer;">${frappe.utils.icon("eye", "sm")}</span>
//                         <a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a>
//                     </span>
//                 </td>
//                 <td class="ta-l">${frappe.utils.escape_html(r.supplier || "-")}</td>
//                 <td>${frappe.utils.escape_html(r.project || "-")}</td>
//                 <td>${r.custom_order_type || "Purchase Order"}</td>
//                 <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
//                 <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
//                 <td>${r.workflow_state || "Draft"}</td>
//                 <td>${cur(net_total)}</td>
//                 <td>${cur(taxes)}</td>
//                 <td>${cur(grand_total)}</td>
//             </tr>`;
//         });

//         if (append) $("#full_po_table").append(html);
//         else $("#full_po_table").html(html);

//         paint_po_totals();
//     }

//     function render_upcoming_table(rows) {
//         let html = "", total_amount = 0;

//         if (!rows || !rows.length) {
//             $("#upcoming_po_table").html(`<tr><td colspan="8" style="color:var(--pd-muted);padding:16px;">No Purchase Orders required in the next 7 days.</td></tr>`);
//             $("#upcoming_po_total_amount").html(cur(0));
//             $("#upcoming_po_count").text(0);
//             return;
//         }

//         rows.forEach(r => {
//             let amount = Number(r.grand_total || 0);
//             total_amount += amount;
//             html += `<tr>
//                 <td class="ta-l"><a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a></td>
//                 <td class="ta-l">${frappe.utils.escape_html(r.supplier || "-")}</td>
//                 <td>${frappe.utils.escape_html(r.project || "-")}</td>
//                 <td>${r.custom_order_type || "Purchase Order"}</td>
//                 <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
//                 <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
//                 <td>${r.workflow_state || "Draft"}</td>
//                 <td>${cur(amount)}</td>
//             </tr>`;
//         });

//         $("#upcoming_po_table").html(html);
//         $("#upcoming_po_total_amount").html(cur(total_amount));
//         $("#upcoming_po_count").text(rows.length);
//     }

//     // ---------------------- EVENTS (namespaced so they never stack up) ----------------------
//     const NS = ".purchase_dash";
//     $(document).off(NS);

//     $(document).on("click" + NS, ".quick-preview-btn", function (e) {
//         e.stopPropagation();
//         e.preventDefault();
//         window.show_purchase_order_preview($(this).data("name"), full_po_names);
//     });

//     $(document).on("click" + NS, "#refresh", function () {
//         const icon = $(this).find("i");
//         icon.addClass("fa-spin");
//         offset = 0;
//         load_data();
//         setTimeout(() => icon.removeClass("fa-spin"), 500);
//     });

//     $(document).on("click" + NS, "#reset_dashboard", function () {
//         const icon = $(this).find("i");
//         icon.addClass("fa-spin");

//         FILTER_DEFS.forEach(def => {
//             const ctrl = filters[def.key];
//             ctrl.set_value(def.type === "ms" ? [] : "");
//             cells[def.key].removeClass("has-value");
//         });

//         offset = 0;
//         setTimeout(() => {
//             FILTER_DEFS.forEach(def => sync_cell(def.key));
//             load_data();
//             icon.removeClass("fa-spin");
//         }, 300);
//     });

//     $(document).on("click" + NS, ".page-size-btn", function () {
//         $(".page-size-btn").removeClass("active");
//         $(this).addClass("active");
//         page_size = parseInt($(this).data("size"));
//         offset = 0;
//         load_data();
//     });

//     $(document).on("click" + NS, "#load_more", function () {
//         offset += page_size;
//         load_data(true);
//     });

//     // ---------------------- DOWNLOAD PURCHASE ORDER EXCEL ----------------------
//     $(document).on("click" + NS, "#download_purchase_excel", function () {
//         const btn = $(this);
//         if (btn.data("downloading")) return;

//         btn.data("downloading", true);
//         const original_html = btn.html();
//         btn.html(`<i class="fa fa-spinner" style="animation: spin 1s linear infinite;"></i> Preparing...`);

//         frappe.call({
//             method: "erp_custom.erp_custom.page.purchase_dashboard.purchase_dashboard.download_purchase_excel",
//             args: { filters: collect_filters() },
//             callback: function (r) {
//                 if (!r.message) {
//                     frappe.msgprint({ title: "Download Failed", message: "No Excel file was generated.", indicator: "red" });
//                     return;
//                 }
//                 window.open(r.message, "_blank");
//             },
//             error: function () {
//                 frappe.msgprint({ title: "Download Failed", message: "Unable to generate Purchase Order Excel.", indicator: "red" });
//             },
//             always: function () {
//                 btn.html(original_html);
//                 btn.data("downloading", false);
//             }
//         });
//     });

//     load_data();
// };




frappe.pages['purchase-dashboard'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Purchase Dashboard',
        single_column: true
    });

    $(wrapper).find('.layout-main').html(`
    <style>
        /* ================= THEME (single colour family) ================= */
        .pd-wrap {
            --pd-green: #16a34a;
            --pd-green-dark: #15803d;
            --pd-green-soft: #f0fdf4;
            --pd-green-line: #bbf7d0;
            --pd-text: #1f2937;
            --pd-muted: #6b7280;
            --pd-border: #e5e7eb;
            --pd-gap: 16px;
            font-family: inherit;
            color: var(--pd-text);
            max-width: 1400px;
            width: 100%;
            flex: 1 1 100%;
            min-width: 0;
            margin: 0 auto;
            padding: 16px 12px 32px;
            container-type: inline-size;     /* layout follows the real page width, not the screen */
            container-name: pd;
        }
        .pd-wrap * { box-sizing: border-box; }
        .ta-l { text-align: left !important; }

        /* ================= CARD SHELL ================= */
        .pd-card {
            background: #fff;
            border: 1px solid var(--pd-border);
            border-radius: 14px;
            box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
            margin-bottom: 20px;
        }
        .pd-card.clip { overflow: hidden; }

        /* per-section colours (same palette as the original dashboard) */
        .theme-projects  { --hdr:#ffc107; --hdr-text:#212529; --line:#f59e0b; --soft:#fef3c7; --link:#b45309; }
        .theme-suppliers { --hdr:#8b5cf6; --line:#8b5cf6; --soft:#ede9fe; --link:#6d28d9; }
        .theme-items     { --hdr:#16a34a; --line:#16a34a; --soft:#dcfce7; --link:#15803d; }
        .theme-required  { --hdr:#dc3545; --line:#ef4444; --soft:#fee2e2; --link:#b91c1c; --stripe:#fdecec; --hover:#fbd5d5; }
        .theme-overall   { --hdr:#22c55e; --line:#22c55e; --soft:#dcfce7; --link:#15803d; --stripe:#eaf9ef; --hover:#d3f3de; }
        .pd-card-header {
            background: var(--hdr, var(--pd-green));
            color: var(--hdr-text, #fff);
            font-size: 15px;
            font-weight: 600;
            letter-spacing: .3px;
            padding: 12px 18px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border-radius: 14px 14px 0 0;
        }
        .pd-card-header.split { display: grid; grid-template-columns: 1fr auto 1fr; gap: 10px; justify-content: stretch; }
        .pd-card-header.split .hdr-title { text-align: center; }
        .pd-card-header.split .pd-btn { justify-self: end; }
        .pd-card-body { padding: 18px; }

        /* ================= FILTER PANEL ================= */
        .pd-filter-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: var(--pd-gap);
            align-items: center;
        }
        .pd-filter-cell { position: relative; min-width: 0; }
        .pd-filter-cell .frappe-control,
        .pd-filter-cell .form-group { margin: 0 !important; }
        /* labels removed */
        .pd-filter-cell .control-label,
        .pd-filter-cell .clearfix,
        .pd-filter-cell .help-box { display: none !important; }
        .pd-filter-cell .form-control,
        .pd-filter-cell .multiselect-list .form-control {
            height: 38px;
            font-size: 13px;
            border-radius: 8px;
            border: 1px solid var(--pd-border);
            background: #fff;
            display: flex;
            align-items: center;
        }
        .pd-filter-cell input.form-control { display: block; }
        .pd-filter-cell .form-control:focus,
        .pd-filter-cell .multiselect-list.open .form-control {
            border-color: var(--pd-green);
            box-shadow: 0 0 0 3px rgba(22, 163, 74, .15);
        }
        .pd-filter-cell .multiselect-list .dropdown-menu,
        .awesomplete > ul { z-index: 2000 !important; }

        /* placeholder = the control's own text, coloured muted while nothing is selected */
        .pd-filter-cell.is-empty .status-text { color: #9ca3af; }

        .pd-filter-actions {
            grid-column: 1 / -1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
        }
        .pd-icon-btn {
            width: 38px; height: 38px;
            padding: 0;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            cursor: pointer;
            transition: all .2s ease;
        }
        .pd-icon-btn.primary { background: var(--pd-green); border: 1px solid var(--pd-green); color: #fff; }
        .pd-icon-btn.primary:hover { background: var(--pd-green-dark); }
        .pd-icon-btn.ghost { background: #fff; border: 1px solid var(--pd-green); color: var(--pd-green); }
        .pd-icon-btn.ghost:hover { background: var(--pd-green-soft); }

        /* ================= KPI CARDS ================= */
        .pd-kpi-grid { display: grid; gap: var(--pd-gap); margin-bottom: var(--pd-gap); }
        .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

        .pd-kpi {
            position: relative;
            overflow: hidden;
            background: var(--k-bg, #fff);
            border: 1px solid transparent;
            border-radius: 14px;
            padding: 16px 16px 14px;
            box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
            transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
            min-height: 108px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .pd-kpi.clickable { cursor: pointer; }
        .pd-kpi.clickable:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, .10);
            border-color: var(--k);
        }
        /* icon sits flush on the top-right edge of the card */
        .pd-kpi-icon {
            position: absolute;
            top: 0; right: 0;
            width: 46px; height: 46px;
            display: flex; align-items: center; justify-content: center;
            background: var(--k, var(--pd-green));
            color: #fff;
            font-size: 18px;
            border-radius: 0 14px 0 14px;
        }
        .pd-kpi-title {
            font-size: 13px;
            font-weight: 600;
            color: #1f2937;
            letter-spacing: .2px;
            padding-right: 50px;
            line-height: 1.3;
        }
        .pd-kpi-value {
            font-size: 26px;
            font-weight: 700;
            color: var(--k, var(--pd-text));
            line-height: 1.1;
            margin-top: 12px;
        }
        .pd-kpi-row {
            display: flex; justify-content: space-between; align-items: baseline;
            margin-top: 10px; font-size: 13px; color: var(--pd-muted);
        }
        .pd-kpi-row b { font-size: 18px; color: var(--pd-text); }
        .pd-kpi-amount {
            margin-top: 4px;
            text-align: right;
            font-size: 15px;
            font-weight: 700;
            color: var(--k, var(--pd-green-dark));
            overflow-wrap: anywhere;
        }

        /* ================= TABLES ================= */
        .pd-grid-2 { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; }
        .pd-grid-2 .pd-card { margin-bottom: 0; height: 100%; }
        .pd-section { margin-bottom: 20px; }

        .pd-table-wrap { width: 100%; overflow-x: auto; }
        .pd-table-wrap.tall { max-height: 500px; overflow-y: auto; }
        .pd-table-wrap table {
            width: max-content;
            min-width: 100%;
            white-space: nowrap;
            margin-bottom: 0;
            font-variant-numeric: tabular-nums;
        }
        .pd-table-wrap thead th {
            position: sticky; top: 0; z-index: 10;
            background: #f8fafc;
            font-weight: 700;
            font-size: 13px;
            color: #374151;
            text-align: center;
            border-bottom: 2px solid var(--pd-border);
            padding: 10px 14px;
        }
        .pd-table-wrap tbody td {
            font-size: 13px;
            vertical-align: middle;
            text-align: center;
            border-color: #f1f5f9;
            padding: 10px 14px;
        }
        .pd-card .pd-table-wrap tbody tr:nth-child(even) { background: var(--stripe, transparent); }
        .pd-card .pd-table-wrap tbody tr:hover { background: var(--hover, #f8fafc); }
        .pd-table-wrap tfoot td {
            background: var(--soft, var(--pd-green-soft));
            border-top: 2px solid var(--line, var(--pd-green));
            font-weight: 700;
            font-size: 13px;
            padding: 12px 14px;
            text-align: center;
            vertical-align: middle;
        }
        .pd-table-wrap a { color: var(--link, var(--pd-green-dark)); font-weight: 500; }

        .pd-pager {
            display: flex; justify-content: space-between; align-items: center;
            flex-wrap: wrap; gap: 10px;
            padding: 12px 18px;
            border-top: 1px solid var(--pd-border);
            background: #f9fafb;
            border-radius: 0 0 14px 14px;
        }
        .pd-size-group { display: inline-flex; }
        .pd-size-btn {
            border: 1px solid var(--pd-green);
            background: #fff; color: var(--pd-green);
            font-size: 13px; font-weight: 600;
            padding: 5px 14px; cursor: pointer;
            margin-left: -1px;
        }
        .pd-size-btn:first-child { border-radius: 8px 0 0 8px; margin-left: 0; }
        .pd-size-btn:last-child { border-radius: 0 8px 8px 0; }
        .pd-size-btn.active { background: var(--pd-green); color: #fff; }
        .pd-btn {
            background: var(--pd-green); color: #fff; border: 1px solid var(--pd-green);
            border-radius: 8px; font-size: 13px; font-weight: 600;
            padding: 6px 16px; cursor: pointer;
        }
        .pd-btn:hover { background: var(--pd-green-dark); }
        .pd-btn.light { background: #fff; color: var(--pd-green-dark); border-color: #fff; display: inline-flex; align-items: center; gap: 6px; }

        /* ================= SUPPLIER PIE + ITEM GROUP BARS ================= */
        .pd-split-card { display: flex; flex-direction: column; container-type: inline-size; container-name: card; }
        .pd-total-strip {
            margin-top: auto;
            display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
            gap: 6px 18px;
            background: var(--soft);
            border-top: 2px solid var(--line);
            padding: 12px 18px;
            font-size: 13px; font-weight: 700; color: #1f2937;
        }
        .pd-total-strip span b { margin-left: 6px; font-variant-numeric: tabular-nums; }

        .pd-scroll-list { max-height: 420px; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        .pd-scroll-list::-webkit-scrollbar { width: 6px; }
        .pd-scroll-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
        .pd-empty { padding: 28px 16px; text-align: center; color: var(--pd-muted); font-size: 13px; }

        .pd-kv { display: flex; flex-wrap: wrap; gap: 6px; font-size: 12px; color: var(--pd-muted); line-height: 1.6; }
        .pd-kv b { color: #1f2937; font-weight: 600; font-variant-numeric: tabular-nums; }

        /* supplier: pie on the left, scrollable list on the right */
        .pd-sup-body { flex: 1; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 16px; }
        .pd-pie-col { flex: 0 0 190px; max-width: 100%; margin: 0 auto; }
        .pd-pie { width: 100%; height: auto; display: block; filter: drop-shadow(0 2px 6px rgba(0, 0, 0, .12)); }
        .pd-pie path, .pd-pie circle { transition: opacity .15s; cursor: pointer; }
        .pd-pie path:hover, .pd-pie circle:hover { opacity: .8; }
        .pd-sup-body .pd-scroll-list { flex: 1 1 260px; min-width: 0; }
        .pd-sup-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
        .pd-sup-item:hover { background: var(--soft); }
        .pd-dot { width: 10px; height: 10px; border-radius: 50%; flex: 0 0 10px; align-self: flex-start; margin-top: 5px; }
        .pd-sup-main { flex: 1; min-width: 0; }
        .pd-sup-name { font-size: 13px; font-weight: 700; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .pd-orders { flex: 0 0 auto; min-width: 58px; text-align: center; padding: 6px 10px; border-radius: 10px; background: var(--soft); }
        .pd-orders b { display: block; font-size: 18px; line-height: 1.1; color: var(--link); }
        .pd-orders small { display: block; font-size: 10px; color: var(--pd-muted); text-transform: uppercase; letter-spacing: .4px; }

        /* item group: [Item / Group boxes] [horizontal bar] [Basic / GST] */
        .pd-item-row {
            display: grid;
            grid-template-columns: minmax(110px, 170px) minmax(70px, 1fr) auto;
            grid-template-areas: "tags bar vals";
            align-items: center; gap: 12px;
            padding: 10px 16px; border-bottom: 1px solid #f1f5f9;
        }
        .pd-item-row:hover { background: var(--soft); }
        .pd-item-tags { grid-area: tags; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
        .pd-tag { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tag-item  { background: #dbeafe; color: #1e40af; }
        .tag-group { background: #ffedd5; color: #9a3412; }
        .pd-bar-col { grid-area: bar; min-width: 0; }
        .pd-bar-track { height: 14px; border-radius: 7px; background: #f1f5f9; overflow: hidden; }
        .pd-bar-fill { height: 100%; border-radius: 7px; background: linear-gradient(90deg, #4ade80, #16a34a); transition: width .5s ease; }
        .pd-bar-cap { font-size: 11px; color: var(--pd-muted); margin-top: 4px; }
        .pd-item-vals { grid-area: vals; }
        .pd-item-vals .pd-kv { justify-content: flex-end; flex-wrap: nowrap; white-space: nowrap; }

        @container card (max-width: 430px) {
            .pd-item-row { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "tags vals" "bar bar"; }
            .pd-sup-body { padding: 12px 8px; }
        }
        @container card (max-width: 340px) {
            .pd-item-row { grid-template-columns: minmax(0, 1fr); grid-template-areas: "tags" "bar" "vals"; }
            .pd-item-vals .pd-kv { justify-content: flex-start; flex-wrap: wrap; }
        }

        /* PO name / supplier: clean left-aligned columns */
        .pd-po-cell { display: inline-flex; align-items: center; gap: 6px; }
        .pd-po-cell .quick-preview-btn { display: inline-flex; width: 18px; justify-content: center; }

        /* ================= PROJECTS: bar chart (left) + scrollable data (right) ================= */
        .pd-proj-body { flex: 1; display: flex; flex-wrap: wrap; gap: 16px; padding: 16px; align-items: flex-start; }
        .pd-proj-chart { flex: 2 1 320px; min-width: 0; }
        .pd-proj-list { flex: 3 1 380px; min-width: 0; container-type: inline-size; container-name: plist; }
        .pd-chart-title { font-size: 13px; font-weight: 700; color: #1f2937; margin-bottom: 6px; }
        .pd-legend { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 12px; color: var(--pd-muted); margin-bottom: 8px; }
        .pd-legend .sw { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; }
        .sw.so, .pd-hb-fill.so { background: #f59e0b; }
        .sw.po, .pd-hb-fill.po { background: #3b82f6; }
        .pd-hb-row { display: grid; grid-template-columns: 84px minmax(0, 1fr); align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px dashed #eef2f7; }
        .pd-hb-label { font-size: 12px; font-weight: 600; color: #374151; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pd-hb-line { display: flex; align-items: center; gap: 8px; height: 12px; margin: 2px 0; }
        .pd-hb-track { flex: 1; min-width: 0; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
        .pd-hb-fill { height: 100%; border-radius: 4px; transition: width .5s ease; }
        .pd-hb-val { flex: 0 0 58px; font-size: 11px; color: var(--pd-muted); text-align: right; font-variant-numeric: tabular-nums; }

        .pd-proj-item { padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .pd-proj-item:hover { background: #fffdf5; }
        .pd-proj-head { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; margin-bottom: 8px; }
        .pd-proj-name { flex: 1 1 auto; min-width: 0; font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pd-proj-name a { color: var(--link); }
        .pd-proj-tag { flex: 0 1 auto; max-width: 42%; font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 8px; background: #fef3c7; color: #92400e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pd-proj-orders { flex: 0 0 auto; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: var(--soft); color: var(--link); white-space: nowrap; }
        .pd-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        .pd-pcol { border-radius: 8px; padding: 8px 10px; min-width: 0; }
        .pd-pcol.so { background: #fffbeb; border-left: 3px solid #f59e0b; }
        .pd-pcol.po { background: #eff6ff; border-left: 3px solid #3b82f6; }
        .pd-prow { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0 8px; font-size: 12px; line-height: 1.7; }
        .pd-prow span { color: var(--pd-muted); }
        .pd-prow b { color: #1f2937; font-weight: 600; font-variant-numeric: tabular-nums; margin-left: auto; overflow-wrap: anywhere; }
        @container plist (max-width: 360px) { .pd-pair { grid-template-columns: minmax(0, 1fr); } }


        /* badges */
        .pd-badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 8px; border: 1px solid transparent; font-size: 12px; font-weight: 600; line-height: 1.5; white-space: nowrap; }
        .pd-bdot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
        .pd-proj-chip { display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; vertical-align: middle; padding: 3px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none !important; }
        .pd-table-wrap .pd-proj-chip { max-width: 240px; }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ================= RESPONSIVE (container queries) ================= */
        @media (max-width: 575px) { .pd-wrap { padding: 12px 8px 24px; } }

        @container pd (min-width: 520px) {
            .pd-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @container pd (min-width: 820px) {
            .pd-filter-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .pd-filter-actions { grid-column: 3 / -1; }
        }
        @container pd (min-width: 1100px) {
            .pd-kpi-grid.cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
            .pd-kpi-grid.cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
            .pd-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @container pd (max-width: 560px) {
            .pd-card-header { font-size: 14px; padding: 11px 14px; }
            .pd-card-header.split { grid-template-columns: 1fr auto; }
            .pd-card-header.split .hdr-spacer { display: none; }
            .pd-card-header.split .hdr-title { text-align: left; }
            .pd-card-body { padding: 14px 12px; }
            .pd-kpi { padding: 14px 12px; min-height: 96px; }
            .pd-kpi-title { font-size: 12px; }
            .pd-kpi-value { font-size: 22px; }
            .pd-kpi-amount { font-size: 14px; }
            .pd-table-wrap thead th, .pd-table-wrap tbody td, .pd-table-wrap tfoot td { padding: 8px 10px; font-size: 12px; }
            .pd-pager { padding: 10px 12px; }
            .pd-total-strip { padding: 10px 12px; font-size: 12px; }
        }
        @container pd (max-width: 400px) {
            .pd-card-header.split .btn-txt { display: none; }
            .pd-icon-btn { width: 42px; height: 42px; }
            .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { gap: 10px; }
        }
        @container pd (max-width: 330px) {
            .pd-kpi-grid.cols-5, .pd-kpi-grid.cols-6 { grid-template-columns: minmax(0, 1fr); }
        }
    </style>

    <div class="pd-wrap">

        <!-- FILTERS PANEL -->
        <div class="pd-card">
            <div class="pd-card-header" style="justify-content:flex-start;">
                <i class="fa fa-search"></i> Filter Purchase Orders
            </div>
            <div class="pd-card-body">
                <div class="pd-filter-grid" id="pd_filter_grid">
                    <div class="pd-filter-actions" id="pd_filter_actions">
                        <button class="pd-icon-btn primary" id="refresh" title="Apply Filters"><i class="fa fa-filter"></i></button>
                        <button class="pd-icon-btn ghost" id="reset_dashboard" title="Refresh Dashboard"><i class="fa fa-refresh"></i></button>
                    </div>
                </div>
            </div>
        </div>

        <!-- KPI SECTION -->
        <div class="pd-kpi-grid cols-5" id="kpi_cards_row1"></div>
        <div class="pd-kpi-grid cols-6" id="kpi_cards_row2"></div>

        <!-- TOP PROJECTS (bar chart + data) -->
        <div class="pd-card clip pd-section pd-split-card theme-projects">
            <div class="pd-card-header"><i class="fa fa-sitemap"></i> Top 10 Projects</div>
            <div class="pd-proj-body">
                <div class="pd-proj-chart">
                    <div class="pd-chart-title">Basic Value : SO vs PO</div>
                    <div class="pd-legend">
                        <span><i class="sw so"></i>Sales Order (Basic)</span>
                        <span><i class="sw po"></i>Purchase Order (Basic)</span>
                    </div>
                    <div id="project_chart"></div>
                </div>
                <div class="pd-scroll-list pd-proj-list" id="project_list"></div>
            </div>
            <div class="pd-total-strip">
                <span>Overall Total</span>
                <span>Orders<b id="project_total_count">0</b></span>
                <span>Basic Value (SO)<b id="project_total_so_amount">0.00</b></span>
                <span>GST 18% (SO)<b id="project_total_so_gst">0.00</b></span>
                <span>Basic Value (PO)<b id="project_total_po_basic">0.00</b></span>
                <span>GST 18% (PO)<b id="project_total_amount">0.00</b></span>
            </div>
        </div>

        <!-- TOP SUPPLIERS (pie) + TOP ITEM GROUPS (bars) -->
        <div class="pd-grid-2 pd-section">
            <div class="pd-card clip pd-split-card theme-suppliers">
                <div class="pd-card-header"><i class="fa fa-truck"></i> Top 10 Suppliers</div>
                <div class="pd-sup-body">
                    <div class="pd-pie-col" id="supplier_pie"></div>
                    <div class="pd-scroll-list" id="supplier_list"></div>
                </div>
                <div class="pd-total-strip">
                    <span>Overall Total</span>
                    <span>Orders<b id="sup_total_count">0</b></span>
                    <span>Basic Value<b id="sup_total_amount">0.00</b></span>
                    <span>GST Value<b id="sup_total_gst">0.00</b></span>
                </div>
            </div>

            <div class="pd-card clip pd-split-card theme-items">
                <div class="pd-card-header"><i class="fa fa-cube"></i> Top 10 Item Group</div>
                <div class="pd-scroll-list" id="item_list" style="flex:1"></div>
                <div class="pd-total-strip">
                    <span>Overall Total</span>
                    <span>Orders<b id="item_total_count">0</b></span>
                    <span>Basic Value<b id="item_total_amount">0.00</b></span>
                    <span>GST Value<b id="item_total_gst">0.00</b></span>
                </div>
            </div>
        </div>

        <!-- REQUIRED BY - NEXT 7 DAYS -->
        <div class="pd-card clip pd-section theme-required">
            <div class="pd-card-header"><i class="fa fa-clock-o"></i> Required By</div>
            <div class="pd-table-wrap tall">
                <table class="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th class="ta-l">PO Name</th><th class="ta-l">Supplier</th><th>Project</th><th>Order Type</th>
                            <th>Date</th><th>Required By</th><th>Status</th><th>Grand Total</th>
                        </tr>
                    </thead>
                    <tbody id="upcoming_po_table"></tbody>
                    <tfoot>
                        <tr>
                            <td class="ta-l" colspan="7">Overall Orders : <span id="upcoming_po_count">0</span></td>
                            <td id="upcoming_po_total_amount">0.00</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <!-- FULL PURCHASE ORDER DATA -->
        <div class="pd-card clip pd-section theme-overall">
            <div class="pd-card-header split">
                <span class="hdr-spacer"></span>
                <span class="hdr-title"><i class="fa fa-list"></i> Overall Purchase Order</span>
                <button type="button" id="download_purchase_excel" class="pd-btn light" title="Download Purchase Order Excel">
                    <i class="fa fa-download"></i> <span class="btn-txt">Download Excel</span>
                </button>
            </div>

            <div class="pd-table-wrap tall">
                <table class="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th class="ta-l">PO Name</th><th class="ta-l">Supplier</th><th>Project</th><th>Order Type</th>
                            <th>Date</th><th>Required By</th><th>Status</th>
                            <th>Net Total</th><th>Taxes &amp; Charges</th><th>Grand Total</th>
                        </tr>
                    </thead>
                    <tbody id="full_po_table"></tbody>
                    <tfoot>
                        <tr>
                            <td class="ta-l" colspan="7">
                                <div>Overall Orders : <span id="full_po_count">0</span>
                                    <span style="font-weight:400;color:var(--pd-muted);">&nbsp;(Showing <span id="full_po_shown">0</span>)</span></div>
                                <small style="font-weight:400;color:var(--pd-muted);font-style:italic;">
                                    <i class="fa fa-info-circle" style="color:var(--line)"></i>
                                    Cancelled orders are displayed in table but INR value not considered.
                                </small>
                            </td>
                            <td><strong>Net Total</strong><br><span id="full_po_total_net">0.00</span></td>
                            <td><strong>Taxes &amp; Charges</strong><br><span id="full_po_total_taxes">0.00</span></td>
                            <td><strong>Grand Total</strong><br><span id="full_po_total_amount">0.00</span></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="pd-pager">
                <div class="pd-size-group" id="page_size_group">
                    <button class="pd-size-btn active page-size-btn" data-size="20">20</button>
                    <button class="pd-size-btn page-size-btn" data-size="100">100</button>
                    <button class="pd-size-btn page-size-btn" data-size="500">500</button>
                    <button class="pd-size-btn page-size-btn" data-size="2500">All</button>
                </div>
                <button class="pd-btn" id="load_more">Load More</button>
            </div>
        </div>
    </div>
    `);

    // ---------------------- FILTER CONTROLS (all multiselect; dates use range) ----------------------
    const link_options = doctype => txt => frappe.db.get_link_options(doctype, txt);
    const static_options = list => () => list.map(v => ({ value: v, description: "" }));

    const FILTER_DEFS = [
        { key: "id",               ph: "Order Number",   type: "ms", get_data: link_options("Purchase Order") },
        { key: "order_type",       ph: "Order Type",     type: "ms", get_data: static_options(["Purchase Order", "Work Order", "Transport Order"]) },
        { key: "project",          ph: "Project",        type: "ms", get_data: link_options("Project") },
        { key: "supplier",         ph: "Supplier",       type: "ms", get_data: link_options("Supplier") },
        { key: "item",             ph: "Item",           type: "ms", get_data: link_options("Item") },
        { key: "item_group",       ph: "Item Group",     type: "ms", get_data: link_options("Item Group") },
        { key: "status",           ph: "Status",         type: "ms", get_data: static_options(["Draft", "Technical Review", "Finance Review", "Approved", "Cancelled"]) },
        { key: "transaction_date", ph: "Date",           type: "range" },
        { key: "schedule_date",    ph: "Required By",    type: "range" },
        { key: "fiscal_year",      ph: "Fiscal Year",    type: "ms", get_data: link_options("Fiscal Year") }
    ];

    let filters = {};
    let cells = {};

    let painters = {};
    const EMPTY_RE = /^(no values? selected|select\b.*|none|--)$/i;

    FILTER_DEFS.forEach(def => {
        const $cell = $('<div class="pd-filter-cell"></div>').insertBefore($(wrapper).find("#pd_filter_actions"));
        cells[def.key] = $cell;

        let df = { fieldname: def.key, label: def.ph, placeholder: def.ph };
        if (def.type === "ms") {
            $cell.addClass("ms");
            Object.assign(df, { fieldtype: "MultiSelectList", get_data: def.get_data });
        } else {
            Object.assign(df, { fieldtype: "DateRange" });
        }

        filters[def.key] = frappe.ui.form.make_control({ parent: $cell, df: df, render_input: true });

        if (def.type === "ms") {
            // Placeholder is driven purely by what the control itself displays, so a selection is
            // visible immediately (no dependency on get_value() timing).
            let empty_text = null;
            const paint = () => {
                const st = $cell.find(".status-text")[0];
                if (!st) return;
                const t = (st.textContent || "").trim();
                if (empty_text === null && t !== "") empty_text = t;
                if (t === def.ph) { $cell.addClass("is-empty"); return; }
                if (t === "" || t === empty_text || EMPTY_RE.test(t)) {
                    st.textContent = def.ph;
                    $cell.addClass("is-empty");
                } else {
                    $cell.removeClass("is-empty");
                }
            };
            painters[def.key] = paint;
            new MutationObserver(paint).observe($cell[0], { childList: true, subtree: true, characterData: true });
            paint();
        }
    });

    function collect_filters(extra) {
        let f = {};
        Object.keys(filters).forEach(k => { f[k] = filters[k].get_value() || []; });
        return Object.assign(f, extra || {});
    }

    // ---------------------- DATA LOADING ----------------------
    let page_size = 20;
    let offset = 0;
    let full_po_names = [];
    let po_tot = { net: 0, tax: 0, grand: 0 };

    function load_data(load_more = false) {
        frappe.call({
            method: "erp_custom.erp_custom.page.purchase_dashboard.purchase_dashboard.get_dashboard_data",
            args: { filters: collect_filters({ limit: page_size, offset: offset }) },
            callback: function (r) {
                let data = r.message || {};
                render_kpis(data);
                render_suppliers(data.top_suppliers || []);
                render_items(data.top_items || []);
                render_projects(data.top_projects || []);
                render_full_po_table(data.full_po_list || [], load_more);
                render_upcoming_table(data.upcoming_required_by || []);
                $("#full_po_count").text(data.full_po_count || 0);
                $("#full_po_shown").text(full_po_names.length);
            }
        });
    }

    // ---------------------- KPI CARDS ----------------------
    function render_kpis(data) {
        let status_map = { "Draft": 0, "Technical Review": 0, "Finance Review": 0, "Approved": 0, "Cancelled": 0 };

        (data.status_counts || []).forEach(r => {
            let key = r.workflow_state || "Draft";
            if (key in status_map) status_map[key] = Number(r.count || 0);
        });

        let total_po = Object.values(status_map).reduce((a, b) => a + b, 0);

        let order_type_map = {
            "Purchase Order": { count: 0, amount: 0 },
            "Work Order": { count: 0, amount: 0 },
            "Transport Order": { count: 0, amount: 0 },
            "Others": { count: 0, amount: 0 }
        };

        (data.order_types || []).forEach(r => {
            let key = order_type_map[r.custom_order_type] ? r.custom_order_type : "Others";
            order_type_map[key].count += Number(r.count || 0);
            order_type_map[key].amount += Number(r.total_amount || 0);
        });

        let total_amount = order_type_map["Purchase Order"].amount
            + order_type_map["Work Order"].amount
            + order_type_map["Transport Order"].amount;

        $("#kpi_cards_row1").html(`
            ${kpiCardTwoStat("Total (PO+WO+TO)", total_po, total_amount, "fa-file-text-o", "#4F46E5", "#E0E7FF")}
            ${kpiCardTwoStat("Purchase Order", order_type_map["Purchase Order"].count, order_type_map["Purchase Order"].amount, "fa-shopping-cart", "#2563EB", "#DBEAFE", "Purchase Order")}
            ${kpiCardTwoStat("Work Order", order_type_map["Work Order"].count, order_type_map["Work Order"].amount, "fa-industry", "#16A34A", "#DCFCE7", "Work Order")}
            ${kpiCardTwoStat("Transport Order", order_type_map["Transport Order"].count, order_type_map["Transport Order"].amount, "fa-truck", "#EA580C", "#FFEDD5", "Transport Order")}
            ${kpiCardTwoStat("Others", order_type_map["Others"].count, order_type_map["Others"].amount, "fa-folder-open-o", "#64748B", "#F1F5F9")}
        `);

        $("#kpi_cards_row2").html(`
            ${kpiCard("Draft", status_map["Draft"], "fa-pencil-square-o", "#F59E0B", "#FEF3C7", "Draft")}
            ${kpiCard("Technical Review", status_map["Technical Review"], "fa-wrench", "#3B82F6", "#DBEAFE", "Technical Review")}
            ${kpiCard("Finance Review", status_map["Finance Review"], "fa-money", "#8B5CF6", "#EDE9FE", "Finance Review")}
            ${kpiCard("Approved", status_map["Approved"], "fa-check-circle", "#22C55E", "#DCFCE7", "Approved")}
            ${kpiCard("Cancelled", status_map["Cancelled"], "fa-ban", "#EF4444", "#FEE2E2", "Cancelled")}
            ${kpiCard("RFQ Raised", data.rfq_count || 0, "fa-envelope-o", "#0EA5E9", "#E0F2FE", "RFQ")}
        `);
    }

    function kpiCardTwoStat(title, count, amount, icon, accent, bg, orderType) {
        const click = orderType ? `onclick="open_purchase_order_list('${orderType}')"` : "";
        return `
            <div class="pd-kpi ${orderType ? "clickable" : ""}" style="--k:${accent};--k-bg:${bg};" ${click}>
                <div class="pd-kpi-icon"><i class="fa ${icon}"></i></div>
                <div class="pd-kpi-title">${title}</div>
                <div>
                    <div class="pd-kpi-row"><span>Count</span><b>${count || 0}</b></div>
                    <div class="pd-kpi-amount">${frappe.format(amount || 0, { fieldtype: "Currency" })}</div>
                </div>
            </div>`;
    }

    function kpiCard(title, value, icon, accent, bg, status) {
        return `
            <div class="pd-kpi clickable" style="--k:${accent};--k-bg:${bg};" onclick="open_status_list('${status}')">
                <div class="pd-kpi-icon"><i class="fa ${icon}"></i></div>
                <div class="pd-kpi-title">${title}</div>
                <div class="pd-kpi-value">${value || 0}</div>
            </div>`;
    }

    window.open_status_list = function (status) {
        if (status === "RFQ") {
            frappe.set_route("List", "Request for Quotation");
            return;
        }
        frappe.route_options = { workflow_state: status };
        frappe.set_route("List", "Purchase Order");
    };

    window.open_purchase_order_list = function (order_type) {
        frappe.route_options = { custom_order_type: order_type };
        frappe.set_route("List", "Purchase Order");
    };

    // ---------------------- RENDER FUNCTIONS ----------------------
    const cur = v => frappe.format(v, { fieldtype: "Currency" });

    // status colours = the same colours as the top KPI cards  [background, text, border/dot]
    const STATUS_STYLE = {
        "Draft":            ["#FEF3C7", "#B45309", "#F59E0B"],
        "Technical Review": ["#DBEAFE", "#1D4ED8", "#3B82F6"],
        "Finance Review":   ["#EDE9FE", "#6D28D9", "#8B5CF6"],
        "Approved":         ["#DCFCE7", "#15803D", "#22C55E"],
        "Cancelled":        ["#FEE2E2", "#B91C1C", "#EF4444"]
    };
    const TYPE_STYLE = {
        "Purchase Order":  ["#DBEAFE", "#1D4ED8", "#2563EB"],
        "Work Order":      ["#DCFCE7", "#15803D", "#16A34A"],
        "Transport Order": ["#FFEDD5", "#C2410C", "#EA580C"]
    };
    const OTHER_STYLE = ["#F1F5F9", "#475569", "#64748B"];

    function status_badge(st) {
        st = st || "Draft";
        const [bg, fg, bd] = STATUS_STYLE[st] || OTHER_STYLE;
        return `<span class="pd-badge" style="background:${bg};color:${fg};border-color:${bd}66"><i class="pd-bdot" style="background:${bd}"></i>${frappe.utils.escape_html(st)}</span>`;
    }
    function type_badge(t) {
        t = t || "Purchase Order";
        const [bg, fg, bd] = TYPE_STYLE[t] || OTHER_STYLE;
        return `<span class="pd-badge" style="background:${bg};color:${fg};border-color:${bd}66">${frappe.utils.escape_html(t)}</span>`;
    }

    // one colour per project (golden-angle hues => maximally different); same project = same colour everywhere
    const project_hues = new Map();
    function project_chip(name, href) {
        if (!name) return "-";
        if (!project_hues.has(name)) project_hues.set(name, Math.round((project_hues.size * 137.508) % 360));
        const h = project_hues.get(name);
        const style = `background:hsl(${h}, 90%, 95%);border:1px solid hsl(${h}, 65%, 60%);color:hsl(${h}, 60%, 25%)`;
        const label = frappe.utils.escape_html(name);
        return href
            ? `<a class="pd-proj-chip" href="${href}" target="_blank" title="${label}" style="${style}">${label}</a>`
            : `<span class="pd-proj-chip" title="${label}" style="${style}">${label}</span>`;
    }

    const esc = frappe.utils.escape_html;
    const cur_text = v => String(frappe.format(v, { fieldtype: "Currency" }, { only_value: true })).replace(/<[^>]*>/g, "");
    const PIE_COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b", "#f97316", "#ef4444", "#ec4899"];

    function render_pie(rows) {
        const slices = (rows || []).map((r, i) => ({
            label: r.supplier || "-",
            value: Number(r.total_amount || 0),
            color: PIE_COLORS[i % PIE_COLORS.length]
        })).filter(x => x.value > 0);

        const total = slices.reduce((a, x) => a + x.value, 0);
        if (!total) {
            $("#supplier_pie").html('<div class="pd-empty">No chart data</div>');
            return;
        }

        const cx = 100, cy = 100, r = 96;
        let angle = -Math.PI / 2, paths = "";

        slices.forEach(x => {
            const frac = x.value / total;
            const tip = `${esc(x.label)}: ${cur_text(x.value)} (${(frac * 100).toFixed(1)}%)`;

            if (frac >= 0.9999) {
                paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.color}"><title>${tip}</title></circle>`;
                return;
            }
            const end = angle + frac * 2 * Math.PI;
            const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
            const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
            paths += `<path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z"
                        fill="${x.color}" stroke="#fff" stroke-width="2"><title>${tip}</title></path>`;
            angle = end;
        });

        $("#supplier_pie").html(`<svg viewBox="0 0 200 200" class="pd-pie" role="img" aria-label="Supplier share by basic value">${paths}</svg>`);
    }

    function render_suppliers(rows) {
        rows = rows || [];
        let html = "", total_count = 0, total_amount = 0, total_gst = 0;

        rows.forEach((r, i) => {
            const count = Number(r.count || 0);
            const amount = Number(r.total_amount || 0);
            const gst = Number(r.total_taxes_and_charges || 0);
            total_count += count; total_amount += amount; total_gst += gst;
            const name = r.supplier || "-";

            html += `
                <div class="pd-sup-item">
                    <span class="pd-dot" style="background:${PIE_COLORS[i % PIE_COLORS.length]}"></span>
                    <div class="pd-sup-main">
                        <div class="pd-sup-name" title="${esc(name)}">${esc(name)}</div>
                        <div class="pd-kv"><span>Basic Value</span><b>${cur_text(amount)}</b></div>
                        <div class="pd-kv"><span>GST Value</span><b>${cur_text(gst)}</b></div>
                    </div>
                    <div class="pd-orders"><b>${count}</b><small>Orders</small></div>
                </div>`;
        });

        $("#supplier_list").html(html || '<div class="pd-empty">No suppliers found for the selected filters.</div>');
        render_pie(rows);

        $("#sup_total_count").text(total_count);
        $("#sup_total_amount").text(cur_text(total_amount));
        $("#sup_total_gst").text(cur_text(total_gst));
    }

    function render_items(rows) {
        rows = rows || [];
        let html = "", total_orders = 0, total_basic = 0, total_gst = 0;
        const max = Math.max(0, ...rows.map(r => Number(r.basic_value || 0)));

        rows.forEach(r => {
            const orders = Number(r.order_count || 0);
            const basic = Number(r.basic_value || 0);
            const gst = Number(r.gst_value || 0);
            total_orders += orders; total_basic += basic; total_gst += gst;

            const width = max > 0 ? Math.max(3, (basic / max) * 100) : 0;
            const item = r.item || "-", group = r.item_group || "-";

            html += `
                <div class="pd-item-row">
                    <div class="pd-item-tags">
                        <div class="pd-tag tag-item" title="Item: ${esc(item)}">${esc(item)}</div>
                        <div class="pd-tag tag-group" title="Item Group: ${esc(group)}">${esc(group)}</div>
                    </div>
                    <div class="pd-bar-col" title="${cur_text(basic)}">
                        <div class="pd-bar-track"><div class="pd-bar-fill" style="width:${width.toFixed(1)}%"></div></div>
                        <div class="pd-bar-cap">${orders} Orders</div>
                    </div>
                    <div class="pd-item-vals">
                        <div class="pd-kv"><span>Basic Value</span><b>${cur_text(basic)}</b></div>
                        <div class="pd-kv"><span>GST Value</span><b>${cur_text(gst)}</b></div>
                    </div>
                </div>`;
        });

        $("#item_list").html(html || '<div class="pd-empty">No items found for the selected filters.</div>');
        $("#item_total_count").text(total_orders);
        $("#item_total_amount").text(cur_text(total_basic));
        $("#item_total_gst").text(cur_text(total_gst));
    }

    const compact = v => {
        v = Number(v || 0);
        const a = Math.abs(v);
        if (a >= 1e7) return (v / 1e7).toFixed(2) + " Cr";
        if (a >= 1e5) return (v / 1e5).toFixed(2) + " L";
        if (a >= 1e3) return (v / 1e3).toFixed(1) + " K";
        return v.toFixed(0);
    };

    function render_projects(rows) {
        rows = rows || [];
        let list = "", bars = "";
        let t = { count: 0, so_basic: 0, so_gst: 0, po_basic: 0, spend: 0 };
        const max = Math.max(0, ...rows.map(r => Math.max(Number(r.so_basic_value || 0), Number(r.po_basic_value || 0))));
        const w = v => (max > 0 && v > 0) ? Math.max(2, (v / max) * 100).toFixed(1) : 0;

        rows.forEach(r => {
            const count = Number(r.count || 0);
            const so_basic = Number(r.so_basic_value || 0);
            const so_gst = Number(r.so_gst_value || 0);
            const po_basic = Number(r.po_basic_value || 0);
            const spend = Number(r.total_amount || 0);
            t.count += count; t.so_basic += so_basic; t.so_gst += so_gst; t.po_basic += po_basic; t.spend += spend;

            const name = r.project || "-";
            const tag = r.tag_name || "";

            bars += `
                <div class="pd-hb-row" title="${esc(name)}&#10;SO: ${cur_text(so_basic)}&#10;PO: ${cur_text(po_basic)}">
                    <div class="pd-hb-label">${esc(name)}</div>
                    <div>
                        <div class="pd-hb-line"><div class="pd-hb-track"><div class="pd-hb-fill so" style="width:${w(so_basic)}%"></div></div><span class="pd-hb-val">${compact(so_basic)}</span></div>
                        <div class="pd-hb-line"><div class="pd-hb-track"><div class="pd-hb-fill po" style="width:${w(po_basic)}%"></div></div><span class="pd-hb-val">${compact(po_basic)}</span></div>
                    </div>
                </div>`;

            list += `
                <div class="pd-proj-item">
                    <div class="pd-proj-head">
                        <div class="pd-proj-name" title="${esc(name)}">${project_chip(r.project, "/app/project/" + encodeURIComponent(r.project || ""))}</div>
                        <div class="pd-proj-tag" title="Tag: ${esc(tag || "-")}"><i class="fa fa-tag"></i> ${esc(tag || "-")}</div>
                        <div class="pd-proj-orders">${count} Orders</div>
                    </div>
                    <div class="pd-pair">
                        <div class="pd-pcol so">
                            <div class="pd-prow"><span>Basic Value (SO)</span><b>${cur_text(so_basic)}</b></div>
                            <div class="pd-prow"><span>GST 18% (SO)</span><b>${cur_text(so_gst)}</b></div>
                        </div>
                        <div class="pd-pcol po">
                            <div class="pd-prow"><span>Basic Value (PO)</span><b>${cur_text(po_basic)}</b></div>
                            <div class="pd-prow"><span>GST 18% (PO)</span><b>${cur_text(spend)}</b></div>
                        </div>
                    </div>
                </div>`;
        });

        $("#project_chart").html(max > 0 ? bars : '<div class="pd-empty">No chart data</div>');
        $("#project_list").html(list || '<div class="pd-empty">No projects found for the selected filters.</div>');

        $("#project_total_count").text(t.count);
        $("#project_total_so_amount").text(cur_text(t.so_basic));
        $("#project_total_so_gst").text(cur_text(t.so_gst));
        $("#project_total_po_basic").text(cur_text(t.po_basic));
        $("#project_total_amount").text(cur_text(t.spend));
    }

    function paint_po_totals() {
        $("#full_po_total_net").html(cur(po_tot.net));
        $("#full_po_total_taxes").html(cur(po_tot.tax));
        $("#full_po_total_amount").html(cur(po_tot.grand));
    }

    function render_full_po_table(rows, append = false) {
        rows = rows || [];
        $("#load_more").toggle(rows.length >= page_size);

        if (!append) {
            full_po_names = [];
            po_tot = { net: 0, tax: 0, grand: 0 };
        }

        if (!rows.length) {
            if (!append) {
                $("#full_po_table").html(`<tr><td colspan="10" style="color:var(--pd-muted);padding:16px;">No Purchase Orders found for the selected filters.</td></tr>`);
                paint_po_totals();
            }
            return;
        }

        let html = "";
        rows.forEach(r => {
            let net_total = Number(r.net_total || 0);
            let taxes = Number(r.total_taxes_and_charges || 0);
            let grand_total = Number(r.grand_total || 0);
            full_po_names.push(r.name);

            // Cancelled PO values are NOT included in overall totals
            if (r.workflow_state !== "Cancelled") {
                po_tot.net += net_total;
                po_tot.tax += taxes;
                po_tot.grand += grand_total;
            }

            html += `<tr>
                <td class="ta-l">
                    <span class="pd-po-cell">
                        <span class="quick-preview-btn" data-name="${r.name}" title="Quick Preview" style="cursor:pointer;">${frappe.utils.icon("eye", "sm")}</span>
                        <a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a>
                    </span>
                </td>
                <td class="ta-l">${frappe.utils.escape_html(r.supplier || "-")}</td>
                <td>${project_chip(r.project)}</td>
                <td>${type_badge(r.custom_order_type)}</td>
                <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
                <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
                <td>${status_badge(r.workflow_state)}</td>
                <td>${cur(net_total)}</td>
                <td>${cur(taxes)}</td>
                <td>${cur(grand_total)}</td>
            </tr>`;
        });

        if (append) $("#full_po_table").append(html);
        else $("#full_po_table").html(html);

        paint_po_totals();
    }

    function render_upcoming_table(rows) {
        let html = "", total_amount = 0;

        if (!rows || !rows.length) {
            $("#upcoming_po_table").html(`<tr><td colspan="8" style="color:var(--pd-muted);padding:16px;">No Purchase Orders required in the next 7 days.</td></tr>`);
            $("#upcoming_po_total_amount").html(cur(0));
            $("#upcoming_po_count").text(0);
            return;
        }

        rows.forEach(r => {
            let amount = Number(r.grand_total || 0);
            total_amount += amount;
            html += `<tr>
                <td class="ta-l"><a href="/app/purchase-order/${r.name}" target="_blank">${r.name}</a></td>
                <td class="ta-l">${frappe.utils.escape_html(r.supplier || "-")}</td>
                <td>${project_chip(r.project)}</td>
                <td>${type_badge(r.custom_order_type)}</td>
                <td>${frappe.datetime.str_to_user(r.transaction_date) || "-"}</td>
                <td>${r.schedule_date ? frappe.datetime.str_to_user(r.schedule_date) : "-"}</td>
                <td>${status_badge(r.workflow_state)}</td>
                <td>${cur(amount)}</td>
            </tr>`;
        });

        $("#upcoming_po_table").html(html);
        $("#upcoming_po_total_amount").html(cur(total_amount));
        $("#upcoming_po_count").text(rows.length);
    }

    // ---------------------- EVENTS (namespaced so they never stack up) ----------------------
    const NS = ".purchase_dash";
    $(document).off(NS);

    $(document).on("click" + NS, ".quick-preview-btn", function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.show_purchase_order_preview($(this).data("name"), full_po_names);
    });

    $(document).on("click" + NS, "#refresh", function () {
        const icon = $(this).find("i");
        icon.addClass("fa-spin");
        offset = 0;
        load_data();
        setTimeout(() => icon.removeClass("fa-spin"), 500);
    });

    $(document).on("click" + NS, "#reset_dashboard", function () {
        const icon = $(this).find("i");
        icon.addClass("fa-spin");

        FILTER_DEFS.forEach(def => {
            const ctrl = filters[def.key];
            ctrl.set_value(def.type === "ms" ? [] : "");
        });

        offset = 0;
        setTimeout(() => {
            Object.values(painters).forEach(fn => fn());
            load_data();
            icon.removeClass("fa-spin");
        }, 300);
    });

    $(document).on("click" + NS, ".page-size-btn", function () {
        $(".page-size-btn").removeClass("active");
        $(this).addClass("active");
        page_size = parseInt($(this).data("size"));
        offset = 0;
        load_data();
    });

    $(document).on("click" + NS, "#load_more", function () {
        offset += page_size;
        load_data(true);
    });

    // ---------------------- DOWNLOAD PURCHASE ORDER EXCEL ----------------------
    $(document).on("click" + NS, "#download_purchase_excel", function () {
        const btn = $(this);
        if (btn.data("downloading")) return;

        btn.data("downloading", true);
        const original_html = btn.html();
        btn.html(`<i class="fa fa-spinner" style="animation: spin 1s linear infinite;"></i> Preparing...`);

        frappe.call({
            method: "erp_custom.erp_custom.page.purchase_dashboard.purchase_dashboard.download_purchase_excel",
            args: { filters: collect_filters() },
            callback: function (r) {
                if (!r.message) {
                    frappe.msgprint({ title: "Download Failed", message: "No Excel file was generated.", indicator: "red" });
                    return;
                }
                window.open(r.message, "_blank");
            },
            error: function () {
                frappe.msgprint({ title: "Download Failed", message: "Unable to generate Purchase Order Excel.", indicator: "red" });
            },
            always: function () {
                btn.html(original_html);
                btn.data("downloading", false);
            }
        });
    });

    load_data();
};