// // frappe.pages['project-dashboard'].on_page_load = function(wrapper) {
// // 	var page = frappe.ui.make_app_page({
// // 		parent: wrapper,
// // 		title: 'Project Dashboard',
// // 		single_column: true
// // 	});
// // }


// frappe.pages["project-dashboard"].on_page_load = function (wrapper) {

//     const page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: __("Project Dashboard"),
//         single_column: true
//     });

//     // =================== CSS ========================
//     $(`
//         <style>
//             /* =============== MAIN ===================== */
//             .project-dashboard {
//                 padding: 0 16px 30px;
//                 max-width: 1600px;
//                 margin: 15px auto 0;
//             }

//             /* ================= FILTER BOX ====================== */
//             .project-filter-box {
//                 background: #ffffff;
//                 border: 1px solid #e5e7eb;
//                 border-radius: 12px;
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
//                 margin-bottom: 18px;
//                 overflow: visible;
//             }

//             .project-filter-header {
//                 display: flex;
//                 align-items: center;
//                 gap: 9px;
//                 background: #2563eb;
//                 color: #ffffff;
//                 padding: 12px 18px;
//                 font-size: 16px;
//                 font-weight: 600;
//                 border-radius: 12px 12px 0 0;
//             }

//             .project-filter-body {
//                 padding: 20px;
//             }

//             .project-filter-grid {
//                 display: grid;
//                 grid-template-columns: repeat(4, minmax(0, 1fr));
//                 gap: 14px 12px;
//                 align-items: center;
//             }

//             .project-filter-field {
//                 min-width: 0;
//             }

//             .project-filter-control {
//                 min-height: 40px;
//             }


//             /* =================== MULTI SELECT ========================== */
//             .project-filter-control .form-control,
//             .project-filter-control .control-input,
//             .project-filter-control input {
//                 border: 1px solid #d9dee7 !important;
//                 border-radius: 8px !important;
//                 min-height: 40px !important;
//                 box-shadow: none !important;
//                 font-size: 13px !important;
//             }

//             .project-filter-control .form-control:focus,
//             .project-filter-control .control-input:focus,
//             .project-filter-control input:focus {
//                 border-color: #2563eb !important;
//                 box-shadow:
//                     0 0 0 2px rgba(37, 99, 235, 0.10)
//                     !important;
//             }

//             .project-filter-control .multiselect-list {
//                 border-radius: 8px;
//             }

//             .project-filter-control .multiselect-list
//             .awesomplete input {
//                 min-height: 40px;
//             }

//             .project-filter-control .control-value {
//                 min-height: 40px;
//                 border-radius: 8px;
//             }


//             /* ==================== FILTER ACTIONS ======================== */
//             .project-filter-actions {
//                 display: flex;
//                 align-items: center;
//                 justify-content: flex-end;
//                 gap: 8px;
//                 margin-top: 18px;
//             }

//             .project-filter-apply {
//                 width: 40px;
//                 height: 40px;
//                 border-radius: 8px;
//                 display: inline-flex;
//                 align-items: center;
//                 justify-content: center;
//                 border: none;
//                 font-size: 14px;
//             }

//             .project-filter-reset {
//                 width: 40px;
//                 height: 40px;
//                 border-radius: 8px;
//                 display: inline-flex;
//                 align-items: center;
//                 justify-content: center;
//                 border: 1px solid #d9dee7;
//                 background: #ffffff;
//                 color: #64748b;
//             }

//             .project-filter-reset:hover {
//                 background: #f8fafc;
//             }

//             /* ==================== CARDS ======================= */
//             .project-card-row {
//                 display: grid;
//                 grid-template-columns:
//                     repeat(2, minmax(0, 1fr));
//                 gap: 18px;
//                 margin-bottom: 20px;
//             }

//             .project-dashboard-card {
//                 min-height: 145px;
//                 border-radius: 14px;
//                 padding: 22px 24px;
//                 position: relative;
//                 overflow: hidden;
//             }

//             .project-card-blue {
//                 background: #eff6ff;
//             }

//             .project-card-green {
//                 background: #f0fdf4;
//             }

//             .project-card-title {
//                 font-size: 16px;
//                 font-weight: 600;
//                 color: #334155;
//                 margin-bottom: 17px;
//             }

//             .project-card-values {
//                 display: flex;
//                 flex-direction: column;
//                 align-items: flex-end;
//                 gap: 4px;
//             }

//             .project-card-count {
//                 font-size: 26px;
//                 font-weight: 700;
//                 color: #1e293b;
//                 line-height: 1.1;
//             }

//             .project-card-overall-value {
//                 font-size: 15px;
//                 font-weight: 600;
//                 color: #475569;
//             }

//             .project-card-icon {
//                 position: absolute;
//                 top: 0;
//                 right: 0;
//                 width: 46px;
//                 height: 46px;
//                 border-radius: 0 14px 0 14px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 color: #ffffff;
//                 font-size: 19px;
//             }

//             .project-icon-blue {
//                 background: #2563eb;
//             }

//             .project-icon-green {
//                 background: #16a34a;
//             }

//             /* ==================== CHARTS SECTION (NEW) ======================= */
//             .project-chart-row {
//                 display: grid;
//                 grid-template-columns:
//                     repeat(2, minmax(0, 1fr));
//                 gap: 18px;
//                 margin-bottom: 20px;
//             }

//             .project-chart-card {
//                 background: #ffffff;
//                 border-radius: 12px;
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
//                 overflow: hidden;
//             }

//             .project-chart-header {
//                 background: #334155;
//                 color: #ffffff;
//                 padding: 12px 18px;
//                 font-size: 15px;
//                 font-weight: 600;
//             }

//             .project-chart-empty {
//                 padding: 45px 20px;
//                 text-align: center;
//                 color: #94a3b8;
//                 font-size: 13px;
//             }

//             /* ---- Customer Wise Split: chart left, scrollable legend right ---- */
//             .project-chart-split-body {
//                 display: flex;
//                 align-items: stretch;
//                 gap: 16px;
//                 padding: 20px;
//             }

//             .project-chart-visual {
//                 flex: 0 0 44%;
//                 max-width: 260px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//             }

//             .project-chart-legend {
//                 flex: 1;
//                 min-width: 0;
//                 max-height: 280px;
//                 overflow-y: auto;
//                 display: flex;
//                 flex-direction: column;
//                 gap: 12px;
//                 padding-right: 4px;
//             }

//             .project-legend-item {
//                 display: flex;
//                 align-items: flex-start;
//                 gap: 10px;
//             }

//             .project-legend-dot {
//                 flex: 0 0 10px;
//                 width: 10px;
//                 height: 10px;
//                 margin-top: 4px;
//                 border-radius: 50%;
//             }

//             .project-legend-text {
//                 display: flex;
//                 flex-direction: column;
//                 gap: 2px;
//                 min-width: 0;
//             }

//             .project-legend-name {
//                 font-size: 13px;
//                 font-weight: 600;
//                 color: #334155;
//                 white-space: nowrap;
//                 overflow: hidden;
//                 text-overflow: ellipsis;
//             }

//             .project-legend-value {
//                 font-size: 12px;
//                 color: #64748b;
//             }

//             /* ---- Product Wise Split: horizontal bars, scrollable ---- */
//             .project-hbar-list {
//                 padding: 20px;
//                 max-height: 320px;
//                 overflow-y: auto;
//                 display: flex;
//                 flex-direction: column;
//                 gap: 14px;
//             }

//             .project-hbar-row {
//                 display: flex;
//                 align-items: center;
//                 gap: 10px;
//             }

//             .project-hbar-label {
//                 flex: 0 0 110px;
//                 max-width: 110px;
//                 font-size: 12px;
//                 font-weight: 600;
//                 color: #334155;
//                 white-space: nowrap;
//                 overflow: hidden;
//                 text-overflow: ellipsis;
//             }

//             .project-hbar-track {
//                 flex: 1;
//                 height: 14px;
//                 border-radius: 7px;
//                 background: #eef2f7;
//                 overflow: hidden;
//             }

//             .project-hbar-fill {
//                 height: 100%;
//                 border-radius: 7px;
//                 background: #2563eb;
//             }

//             .project-hbar-value {
//                 flex: 0 0 auto;
//                 min-width: 70px;
//                 font-size: 12px;
//                 font-weight: 600;
//                 color: #1e293b;
//                 text-align: right;
//             }

//             @media (max-width: 900px) {
//                 .project-chart-row {
//                     grid-template-columns: 1fr;
//                 }

//                 .project-chart-split-body {
//                     flex-direction: column;
//                 }

//                 .project-chart-visual {
//                     max-width: 100%;
//                     flex: none;
//                 }
//             }

//             /* ==================== TABLE SECTION ======================= */
//             .project-dashboard-section {
//                 background: #ffffff;
//                 border-radius: 12px;
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
//                 overflow: hidden;
//             }

//             .project-section-header {
//                 background: #334155;
//                 color: #ffffff;
//                 padding: 12px 18px;
//                 font-size: 16px;
//                 font-weight: 600;
//             }

//             .project-table-wrapper {
//                 overflow-x: auto;
//                 overflow-y: auto;
//                 max-height: 560px;
//             }

//             .project-table {
//                 min-width: 1200px;
//                 margin: 0;
//             }

//             .project-table thead th {
//                 position: sticky;
//                 top: 0;
//                 z-index: 2;
//                 background: #f8fafc;
//                 color: #334155;
//                 font-size: 12px;
//                 font-weight: 600;
//                 border-bottom: 1px solid #e2e8f0;
//                 white-space: nowrap;
//             }

//             .project-table tbody td {
//                 font-size: 13px;
//                 vertical-align: middle;
//                 white-space: nowrap;
//             }

//             .project-table tbody tr:hover {
//                 background: #f8fafc;
//             }


//             /* ================ TAG ====================== */
//             .project-tag {
//                 display: inline-block;
//                 padding: 4px 8px;
//                 margin: 2px 3px 2px 0;
//                 border-radius: 6px;
//                 background: #eef2ff;
//                 color: #4338ca;
//                 font-size: 12px;
//             }

//             /* ================== STATUS ===================== */
//             .project-status {
//                 display: inline-block;
//                 padding: 4px 9px;
//                 border-radius: 20px;
//                 font-size: 12px;
//                 font-weight: 600;
//             }

//             .project-status-open {
//                 background: #dcfce7;
//                 color: #15803d;
//             }

//             .project-status-on-hold {
//                 background: #fef3c7;
//                 color: #a16207;
//             }

//             .project-status-completed {
//                 background: #dbeafe;
//                 color: #1d4ed8;
//             }

//             .project-status-cancelled {
//                 background: #fee2e2;
//                 color: #dc2626;
//             }


//             /* =================== EMPTY ===================== */
//             .project-empty {
//                 padding: 45px 20px;
//                 text-align: center;
//                 color: #94a3b8;
//                 font-size: 13px;
//             }


//             /* =============== TOTAL SUMMARY ======================= */
//             .project-total-summary {
//                 display: grid;
//                 grid-template-columns:
//                     repeat(4, minmax(0, 1fr));
//                 gap: 1px;
//                 background: #e5e7eb;
//                 border-top: 1px solid #e5e7eb;
//             }

//             .project-summary-item {
//                 background: #f8fafc;
//                 padding: 12px 16px;
//             }

//             .project-summary-label {
//                 display: block;
//                 font-size: 11px;
//                 color: #64748b;
//                 margin-bottom: 3px;
//             }

//             .project-summary-value {
//                 font-size: 14px;
//                 font-weight: 600;
//                 color: #1e293b;
//             }


//             /* ================== FOOTER ======================= */
//             .project-table-footer {
//                 display: flex;
//                 align-items: center;
//                 justify-content: space-between;
//                 gap: 15px;
//                 padding: 12px 16px;
//                 border-top: 1px solid #e5e7eb;
//                 background: #ffffff;
//             }

//             .project-footer-left {
//                 display: flex;
//                 align-items: center;
//                 gap: 9px;
//                 color: #64748b;
//                 font-size: 13px;
//             }

//             .project-page-size {
//                 min-width: 80px;
//                 height: 34px;
//                 border: 1px solid #d7dce2;
//                 border-radius: 7px;
//                 padding: 0 8px;
//                 background: #ffffff;
//             }

//             .project-footer-right {
//                 display: flex;
//                 align-items: center;
//             }

//             .project-load-more {
//                 height: 34px;
//                 border-radius: 7px;
//                 font-weight: 600;
//             }

//             #project-chart-customer .graph-stats-container {
//                 display: none !important;
//             }

//             /* =================== RESPONSIVE =========================== */
//             @media (max-width: 1100px) {
//                 .project-filter-grid {
//                     grid-template-columns:
//                         repeat(3, minmax(0, 1fr));
//                     gap: 14px 12px;
//                 }

//                 .project-total-summary {
//                     grid-template-columns:
//                         repeat(2, minmax(0, 1fr));
//                 }
//             }

//             @media (max-width: 900px) {
//                 .project-dashboard {
//                     padding: 0 10px 25px;
//                 }

//                 .project-card-row {
//                     grid-template-columns: 1fr;
//                 }
//             }

//             @media (max-width: 650px) {
//                 .project-filter-grid {
//                     grid-template-columns: repeat(2, minmax(0, 1fr));
//                     gap: 12px;
//                 }

//                 .project-total-summary {
//                     grid-template-columns: 1fr 1fr;
//                 }

//                 .project-table-footer {
//                     align-items: flex-start;
//                     flex-direction: column;
//                 }
//             }

//         </style>
//     `).appendTo("head");

//     // ======================== HTML ============================
//     $(`
//         <div class="project-dashboard">
//             <!-- FILTER -->
//             <div class="project-filter-box">
//                 <div class="project-filter-header">
//                     <i class="fa fa-filter"></i>
//                     <span>${__("Filter Projects")}</span>
//                 </div>

//                 <div class="project-filter-body">
//                     <div class="project-filter-grid">
//                         <div class="project-filter-field">
//                             <div class="project-filter-control" data-field="project_id"> </div>
//                         </div>

//                         <div class="project-filter-field">
//                             <div class="project-filter-control" data-field="customer"> </div>
//                         </div>

//                         <div class="project-filter-field">
//                             <div class="project-filter-control" data-field="status"> </div>
//                         </div>

//                         <div class="project-filter-field">
//                             <div class="project-filter-control" data-field="project_type"> </div>
//                         </div>

//                         <div class="project-filter-field">
//                             <div class="project-filter-control" data-field="priority"> </div>
//                         </div>

//                         <div class="project-filter-field">
//                             <div class="project-filter-control" data-field="tag"> </div>
//                         </div>

//                         <div class="project-filter-field">
//                             <div class="project-filter-control" data-field="fiscal_year"> </div>
//                         </div>
//                     </div>


//                     <div class="project-filter-actions">
//                         <button class="btn btn-primary project-filter-apply" id="project-filter-btn"
//                             title="${__("Apply Filters")}" aria-label="${__("Apply Filters")}">
//                             <i class="fa fa-filter"></i>
//                         </button>

//                         <button class="project-filter-reset" id="project-reset-btn"
//                             title="${__("Reset Filters")}" aria-label="${__("Reset Filters")}">
//                             <i class="fa fa-refresh"></i>
//                         </button>
//                     </div>

//                 </div>
//             </div>


//             <!-- CARDS -->
//             <div class="project-card-row">
//                 <div class="project-dashboard-card project-card-blue">
//                     <div class="project-card-title"> ${__("Total Projects")} </div>
//                     <div class="project-card-values">
//                         <div class="project-card-count" id="project-total-count"> 0 </div>
//                         <div class="project-card-overall-value" id="project-total-overall-value"> ₹0.00 </div>
//                     </div>
//                     <div class="project-card-icon project-icon-blue"> <i class="fa fa-folder-open"></i> </div>
//                 </div>

//                 <div class="project-dashboard-card project-card-green">
//                     <div class="project-card-title"> ${__("Total Customers")} </div>
//                     <div class="project-card-values">
//                         <div class="project-card-count" id="project-customer-count"> 0 </div>
//                     </div>
//                     <div class="project-card-icon project-icon-green"> <i class="fa fa-users"></i> </div>
//                 </div>
//             </div>

//             <!-- CHARTS -->
//             <div class="project-chart-row">
//                 <div class="project-chart-card">
//                     <div class="project-chart-header"> <i class="fa fa-pie-chart"></i> ${__("Customer Wise Split")} </div>
//                     <div class="project-chart-split-body" id="project-customer-split-body">
//                         <div class="project-chart-visual" id="project-chart-customer"> </div>
//                         <div class="project-chart-legend" id="project-chart-customer-legend"> </div>
//                     </div>
//                 </div>

//                 <div class="project-chart-card">
//                     <div class="project-chart-header"> <i class="fa fa-bar-chart"></i> ${__("Product Wise Split")} </div>
//                     <div class="project-hbar-list" id="project-chart-product"> </div>
//                 </div>
//             </div>

//             <!-- TABLE -->
//             <div class="project-dashboard-section">
//                 <div class="project-section-header"> <i class="fa fa-bar-chart"></i> ${__("Projects")} </div>
//                 <div id="project-dashboard-table"> </div>
//             </div>
//         </div>
//     `).appendTo(page.body);


//     // ===================== CONTROLS ==============================
//     const controls = {};
//     function create_multiselect(fieldname, placeholder) {
//         controls[fieldname] = frappe.ui.form.make_control({
//             parent: $(`[data-field="${fieldname}"]`),
//             df: {
//                 fieldtype: "MultiSelectList",
//                 fieldname: fieldname,
//                 placeholder: placeholder,
//                 options: []
//             },
//             render_input: true
//         });
//     }

//     create_multiselect("project_id",__("Select Project"));
//     create_multiselect("customer", __("Select Customer"));
//     create_multiselect("status", __("Select Status"));
//     create_multiselect("project_type", __("Select Project Type"));
//     create_multiselect("priority", __("Select Priority"));
//     create_multiselect("tag", __("Select Item Code"));
//     create_multiselect("fiscal_year", __("Select Fiscal Year"));

//     // ======================== FILTER OPTIONS ================================
//     function load_filter_options() {
//         frappe.call({
//             method: "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_filter_options",
//             callback: function (r) {
//                 if (!r.message) {
//                     return;
//                 }

//                 const options = r.message;
//                 set_multiselect_options(controls.project_id, options.project_ids);
//                 set_multiselect_options(controls.customer, options.customers);
//                 set_multiselect_options(controls.status, options.statuses);
//                 set_multiselect_options(controls.project_type, options.project_types);
//                 set_multiselect_options(controls.priority, options.priorities);
//                 set_multiselect_options(controls.tag, options.tags);
//                 set_multiselect_options(controls.fiscal_year, options.fiscal_years);
//             }
//         });
//     }


//     function set_multiselect_options(control, values) {
//         values = values || [];
//         control.df.options = values;

//         if (control.refresh) {
//             control.refresh();
//         }

//         if (control.set_value) {
//             control.set_value([]);
//         }
//     }


//     // ====================== PAGINATION ==============================
//     let current_limit = 20;
//     let current_offset = 0;
//     let current_filters = {};

//     // =======================GET FILTER VALUES =============================
//     function get_control_values(control) {
//         if (!control) {
//             return [];
//         }

//         const value = control.get_value();
//         if (!value) {
//             return [];
//         }

//         if (Array.isArray(value)) {
//             return value;
//         }

//         return [value];
//     }


//     function get_filters() {
//         return {
//             project_id:
//                 get_control_values(controls.project_id),

//             customer:
//                 get_control_values(controls.customer),

//             status:
//                 get_control_values(controls.status),

//             project_type:
//                 get_control_values(controls.project_type),

//             priority:
//                 get_control_values(controls.priority),

//             tag:
//                 get_control_values(controls.tag),

//             fiscal_year:
//                 get_control_values(controls.fiscal_year)
//         };
//     }

//     // ========================== LOAD DASHBOARD ==============================
//     function load_dashboard(reset = true) {
//         if (reset) {
//             current_offset = 0;
//             current_filters = get_filters();
//             load_charts();
//         }

//         frappe.call({
//             method: "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_dashboard_data",

//             args: {
//                 filters: JSON.stringify(current_filters),
//                 limit: current_limit === "all" ? 0 : current_limit,
//                 offset: current_offset
//             },

//             freeze: true,
//             freeze_message: __("Loading Project Dashboard..."),
//             callback: function (r) {
//                 if (!r.message) {
//                     return;
//                 }

//                 const data = r.message;
//                 // ================= CARDS =================
//                 $("#project-total-count").text(data.total_projects || 0);
//                 $("#project-total-overall-value").text(format_currency(data.total_purchase_value || 0));
//                 $("#project-customer-count").text(data.customer_count || 0);

//                 // ================= TABLE =================
//                 render_project_table(
//                     data.projects || [],
//                     data.total_projects || 0,
//                     data.total_basic_value || 0,
//                     data.total_taxes || 0,
//                     data.total_purchase_value || 0,
//                     reset
//                 );
//             }
//         });
//     }

//     // ========================== LOAD CHARTS (NEW) ==============================
//     function load_charts() {
//         frappe.call({
//             method: "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_chart_data",
//             args: {
//                 filters: JSON.stringify(current_filters)
//             },
//             callback: function (r) {
//                 if (!r.message) {
//                     return;
//                 }

//                 render_customer_pie_chart(r.message.customer_wise || []);
//                 render_product_horizontal_bars(r.message.product_wise || []);
//             }
//         });
//     }

//     // ==================== CHART HELPERS (NEW) ==============================
//     function chart_flt(value) {
//         return parseFloat(value) || 0;
//     }

//     // Groups rows into top N by value, bucketing the remainder into "Others"
//     // so the pie/bar chart stays readable when there are many customers/items.
//     function group_top_n(rows, label_key, value_key, top_n) {
//         top_n = top_n || 8;

//         const sorted = [...rows].sort(
//             (a, b) => chart_flt(b[value_key]) - chart_flt(a[value_key])
//         );

//         const top = sorted.slice(0, top_n);
//         const rest = sorted.slice(top_n);

//         const labels = top.map(row => row[label_key] || __("Not Set"));
//         const values = top.map(row => chart_flt(row[value_key]));

//         if (rest.length) {
//             const others_total = rest.reduce(
//                 (sum, row) => sum + chart_flt(row[value_key]), 0
//             );

//             labels.push(__("Others"));
//             values.push(others_total);
//         }

//         return { labels, values };
//     }

//     // Customer Wise Split: pie chart on the left, a scrollable legend
//     // (name + value, professionally stacked) on the right. The whole
//     // split-body is rebuilt each render so it works cleanly across
//     // repeated filter apply/reset calls.
//     let project_customer_chart = null;

//     function render_customer_pie_chart(rows) {
//         const wrap = $("#project-customer-split-body");

//         if (!rows.length) {
//             wrap.html(`<div class="project-chart-empty"> ${__("No data found.")} </div>`);
//             return;
//         }

//         wrap.html(`
//             <div class="project-chart-visual" id="project-chart-customer"> </div>
//             <div class="project-chart-legend" id="project-chart-customer-legend"> </div>
//         `);

//         const colors = [
//             "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed",
//             "#0891b2", "#db2777", "#f97316", "#94a3b8"
//         ];

//         // Reserve the last color for the "Others" bucket.
//         const { labels, values } = group_top_n(
//             rows,
//             "customer",
//             "purchase_value",
//             colors.length - 1
//         );

//         project_customer_chart = new frappe.Chart("#project-chart-customer", {
//             data: {
//                 labels: labels,
//                 datasets: [{ values: values }]
//             },
//             type: "pie",
//             height: 220,
//             colors: colors,

//             // Hide the bottom legend/values generated by Frappe Chart
//             showLegend: false
//         });

//         const legend = $("#project-chart-customer-legend");

//         labels.forEach((label, index) => {
//             legend.append(`
//                 <div class="project-legend-item">
//                     <span class="project-legend-dot" style="background: ${colors[index % colors.length]};">
//                     </span>

//                     <div class="project-legend-text">
//                         <span class="project-legend-name" title="${frappe.utils.escape_html(label)}">
//                             ${frappe.utils.escape_html(label)}
//                         </span>

//                         <span class="project-legend-value">
//                             ${format_currency(values[index])}
//                         </span>
//                     </div>
//                 </div>
//             `);
//         });
//     }

//     // Product Wise Split: a horizontal bar per item code (label, filled
//     // track scaled to the highest value, and the value on the right),
//     // in a scrollable list so it isn't capped to a handful of items.
//     function render_product_horizontal_bars(rows) {
//         const container = $("#project-chart-product");
//         container.empty();

//         if (!rows.length) {
//             container.html(`<div class="project-chart-empty"> ${__("No data found.")} </div>`);
//             return;
//         }

//         const sorted = [...rows].sort(
//             (a, b) => chart_flt(b.item_value) - chart_flt(a.item_value)
//         );

//         const max_value = chart_flt(sorted[0].item_value) || 1;

//         sorted.forEach(row => {
//             const value = chart_flt(row.item_value);
//             const width_pct = Math.max((value / max_value) * 100, 2);
//             const item_code = row.item_code || "-";

//             container.append(`
//                 <div class="project-hbar-row">
//                     <div class="project-hbar-label" title="${frappe.utils.escape_html(item_code)}">
//                         ${frappe.utils.escape_html(item_code)}
//                     </div>
//                     <div class="project-hbar-track">
//                         <div class="project-hbar-fill" style="width: ${width_pct}%;"></div>
//                     </div>
//                     <div class="project-hbar-value"> ${format_currency(value)} </div>
//                 </div>
//             `);
//         });
//     }


//     // ========================== RENDER TABLE ==============================
//     function render_project_table(
//         projects, total_count, total_basic_value, total_taxes, total_purchase_value, reset) {

//         const container = $("#project-dashboard-table");
//         if (reset) {
//             container.empty();

//             if (!projects.length) {
//                 container.html(`<div class="project-empty"> ${__("No projects found.")} </div>`);
//                 return;
//             }

//             container.html(`
//                 <div class="table-responsive project-table-wrapper">
//                     <table class="table table-hover project-table mb-0">
//                         <thead>
//                             <tr>
//                                 <th> ${__("Project ID")} </th>
//                                 <th> ${__("Customer")} </th>
//                                 <th> ${__("Item Code")} </th>
//                                 <th> ${__("Status")} </th>
//                                 <th> ${__("Project Type")} </th>
//                                 <th> ${__("Priority")} </th>
//                                 <th> ${__("Fiscal Year")} </th>

//                                 <th class="text-right"> ${__("Basic Value")} </th>
//                                 <th class="text-right"> ${__("Taxes")} </th>
//                                 <th class="text-right"> ${__("Overall Value")} </th>
//                             </tr>

//                         </thead>
//                         <tbody id="project-table-body"> </tbody>
//                     </table>
//                 </div>

//                 <!-- TOTALS -->
//                 <div class="project-total-summary">
//                     <div class="project-summary-item">
//                         <span class="project-summary-label"> ${__("Total Projects")} </span>
//                         <span class="project-summary-value"> ${total_count} </span>
//                     </div>

//                     <div class="project-summary-item">
//                         <span class="project-summary-label"> ${__("Basic Value")} </span>
//                         <span class="project-summary-value"> ${format_currency(total_basic_value)} </span>
//                     </div>

//                     <div class="project-summary-item">
//                         <span class="project-summary-label"> ${__("Taxes")} </span>
//                         <span class="project-summary-value"> ${format_currency(total_taxes)} </span>

//                     </div>

//                     <div class="project-summary-item">
//                         <span class="project-summary-label"> ${__("Overall Value")} </span>
//                         <span class="project-summary-value"> ${format_currency(total_purchase_value)} </span>
//                     </div>
//                 </div>

//                 <!-- FOOTER -->
//                 <div class="project-table-footer">
//                     <div class="project-footer-left">
//                         <span> ${__("Show")} </span>

//                         <select id="project-page-size" class="project-page-size">
//                             <option value="20"> 20 </option>
//                             <option value="100"> 100 </option>
//                             <option value="500"> 500 </option>
//                             <option value="all"> ${__("All")} </option>
//                         </select>

//                         <span> ${__("records")} </span>
//                     </div>

//                     <div class="project-footer-right">
//                         <button class="btn btn-outline-primary project-load-more" id="project-load-more">
//                             <i class="fa fa-plus"></i> ${__("Load More")} </button>
//                     </div>
//                 </div>
//             `);

//             $("#project-page-size").val(current_limit === "all" ? "all" : current_limit);
//         }

//         append_project_rows(projects);
//         update_load_more(total_count);
//     }


//     // ====================== APPEND PROJECT ROWS ============================
//     function append_project_rows(projects) {
//         const tbody = $("#project-table-body");

//         projects.forEach(project => {
//             let tags = project.tag || "-";

//             if (tags !== "-") {
//                 tags = tags
//                     .split(",")
//                     .map(item => `<span class="project-tag"> ${frappe.utils.escape_html(item.trim())} </span>`)
//                     .join("");
//             }

//             const status_class = (project.status || "")
//                     .toLowerCase()
//                     .replace(/\s+/g, "-");

//             tbody.append(`
//                 <tr>
//                     <td> <a href="/app/project/${encodeURIComponent(project.name)}"> ${frappe.utils.escape_html(project.name || "")} </a> </td>
//                     <td> ${frappe.utils.escape_html(project.customer || "-")} </td>
//                     <td> ${tags} </td>
//                     <td> ${project.status ? `<span class="project-status project-status-${status_class}">
//                                         ${frappe.utils.escape_html(project.status)} </span>` : "-" } </td>
//                     <td> ${frappe.utils.escape_html(project.project_type || "-")} </td>
//                     <td> ${frappe.utils.escape_html(project.priority || "-")} </td>
//                     <td> ${frappe.utils.escape_html(project.fiscal_year || "-")} </td>
//                     <td class="text-right"> ${format_currency(project.basic_value || 0)} </td>
//                     <td class="text-right"> ${format_currency(project.taxes || 0)} </td>
//                     <td class="text-right"> ${format_currency(project.purchase_value || 0)} </td>
//                 </tr>
//             `);
//         });
//     }

//     // ====================== LOAD MORE ==============================
//     function update_load_more(total_count) {
//         if (current_limit === "all") {
//             $("#project-load-more").hide();
//             return;
//         }

//         const displayed_count = $("#project-table-body tr").length;

//         if (displayed_count >= total_count) {
//             $("#project-load-more").hide();

//         } else {
//             $("#project-load-more").show();
//         }
//     }

//     // ==================== APPLY FILTER =========================
//     $("#project-filter-btn").on("click",
//         function () {
//             current_limit = 20;
//             load_dashboard(true);
//         }
//     );

//     // ===================== RESET FILTER ============================
//     $("#project-reset-btn").on("click",
//         function () {
//             Object.values(controls).forEach(
//                 control => {
//                     if (control.set_value) {
//                         control.set_value([]);
//                     }
//                 }
//             );

//             current_limit = 20;
//             load_dashboard(true);
//         }
//     );

//     // ====================== PAGE SIZE ==============================
//     $(document).on("change", "#project-page-size",
//         function () {
//             const value = $(this).val();

//             current_limit = value === "all" ? "all" : parseInt(value);
//             current_offset = 0;
//             load_dashboard(true);
//         }
//     );

//     // ====================== LOAD MORE ==============================
//     $(document).on("click", "#project-load-more",
//         function () {
//             current_offset += current_limit;

//             frappe.call({
//                 method: "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_dashboard_data",
//                 args: {
//                     filters: JSON.stringify(current_filters),
//                     limit: current_limit,
//                     offset: current_offset
//                 },

//                 callback: function (r) {
//                     if (!r.message) {
//                         return;
//                     }

//                     append_project_rows(r.message.projects || []);
//                     update_load_more(r.message.total_projects || 0);
//                 }
//             });
//         }
//     );

//     // ====================== INITIAL LOAD ===========================
//     load_filter_options();
//     load_dashboard(true);
// };




frappe.pages["project-dashboard"].on_page_load = function (wrapper) {

    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: __("Project Dashboard"),
        single_column: true
    });

    // =================== CSS ========================
    $(`
        <style>
            /* =============== MAIN ===================== */
            .project-dashboard {
                padding: 0 16px 30px;
                max-width: 1600px;
                margin: 15px auto 0;
            }

            /* ================= FILTER BOX ====================== */
            .project-filter-box {
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                margin-bottom: 18px;
                overflow: visible;
            }

            .project-filter-header {
                display: flex;
                align-items: center;
                gap: 9px;
                background: #2563eb;
                color: #ffffff;
                padding: 12px 18px;
                font-size: 16px;
                font-weight: 600;
                border-radius: 12px 12px 0 0;
            }

            .project-filter-body {
                padding: 20px;
            }

            .project-filter-grid {
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 14px 12px;
                align-items: center;
            }

            .project-filter-field {
                min-width: 0;
            }

            .project-filter-control {
                min-height: 40px;
            }


            /* =================== MULTI SELECT ========================== */
            .project-filter-control .form-control,
            .project-filter-control .control-input,
            .project-filter-control input {
                border: 1px solid #d9dee7 !important;
                border-radius: 8px !important;
                min-height: 40px !important;
                box-shadow: none !important;
                font-size: 13px !important;
            }

            .project-filter-control .form-control:focus,
            .project-filter-control .control-input:focus,
            .project-filter-control input:focus {
                border-color: #2563eb !important;
                box-shadow:
                    0 0 0 2px rgba(37, 99, 235, 0.10)
                    !important;
            }

            .project-filter-control .multiselect-list {
                border-radius: 8px;
            }

            .project-filter-control .multiselect-list
            .awesomplete input {
                min-height: 40px;
            }

            .project-filter-control .control-value {
                min-height: 40px;
                border-radius: 8px;
            }


            /* ==================== FILTER ACTIONS ======================== */
            .project-filter-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 18px;
            }

            .project-filter-apply {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: none;
                font-size: 14px;
            }

            .project-filter-reset {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #d9dee7;
                background: #ffffff;
                color: #64748b;
            }

            .project-filter-reset:hover {
                background: #f8fafc;
            }

            /* ==================== CARDS ======================= */
            .project-card-row {
                display: grid;
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
                gap: 18px;
                margin-bottom: 20px;
            }

            .project-dashboard-card {
                min-height: 145px;
                border-radius: 14px;
                padding: 22px 24px;
                position: relative;
                overflow: hidden;
            }

            .project-card-blue {
                background: #eff6ff;
            }

            .project-card-green {
                background: #f0fdf4;
            }

            .project-card-title {
                font-size: 16px;
                font-weight: 600;
                color: #334155;
                margin-bottom: 17px;
            }

            .project-card-values {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 4px;
            }

            .project-card-count {
                font-size: 26px;
                font-weight: 700;
                color: #1e293b;
                line-height: 1.1;
            }

            .project-card-overall-value {
                font-size: 15px;
                font-weight: 600;
                color: #475569;
            }

            .project-card-icon {
                position: absolute;
                top: 0;
                right: 0;
                width: 46px;
                height: 46px;
                border-radius: 0 14px 0 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                font-size: 19px;
            }

            .project-icon-blue {
                background: #2563eb;
            }

            .project-icon-green {
                background: #16a34a;
            }

            /* ==================== CHARTS SECTION ======================= */
            .project-chart-row {
                display: grid;
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
                gap: 18px;
                margin-bottom: 20px;
            }

            .project-chart-card {
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
                overflow: hidden;
            }

            .project-chart-header {
                background: #334155;
                color: #ffffff;
                padding: 12px 18px;
                font-size: 15px;
                font-weight: 600;
            }

            .project-chart-subtitle {
                font-size: 11px;
                font-weight: 400;
                color: #cbd5e1;
                margin-top: 2px;
            }

            .project-chart-empty {
                padding: 45px 20px;
                text-align: center;
                color: #94a3b8;
                font-size: 13px;
            }

            /* ---- Customer Wise Split: chart left, scrollable legend right ---- */
            .project-chart-split-body {
                display: flex;
                align-items: stretch;
                gap: 16px;
                padding: 20px;
            }

            .project-chart-visual {
                flex: 0 0 44%;
                max-width: 260px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .project-chart-legend {
                flex: 1;
                min-width: 0;
                max-height: 280px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding-right: 4px;
            }

            .project-legend-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
            }

            .project-legend-dot {
                flex: 0 0 10px;
                width: 10px;
                height: 10px;
                margin-top: 4px;
                border-radius: 50%;
            }

            .project-legend-text {
                display: flex;
                flex-direction: column;
                gap: 2px;
                min-width: 0;
            }

            .project-legend-name {
                font-size: 13px;
                font-weight: 600;
                color: #334155;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .project-legend-value {
                font-size: 12px;
                color: #64748b;
            }

            /* ---- Portfolio Wise Split: horizontal bars, scrollable ---- */
            .project-hbar-list {
                padding: 20px;
                max-height: 320px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 14px;
            }

            .project-hbar-row {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .project-hbar-label {
                flex: 0 0 110px;
                max-width: 110px;
                font-size: 12px;
                font-weight: 600;
                color: #334155;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .project-hbar-track {
                flex: 1;
                height: 14px;
                border-radius: 7px;
                background: #eef2f7;
                overflow: hidden;
            }

            .project-hbar-fill {
                height: 100%;
                border-radius: 7px;
                background: #2563eb;
            }

            .project-hbar-value {
                flex: 0 0 auto;
                min-width: 70px;
                font-size: 12px;
                font-weight: 600;
                color: #1e293b;
                text-align: right;
            }

            @media (max-width: 900px) {
                .project-chart-row {
                    grid-template-columns: 1fr;
                }

                .project-chart-split-body {
                    flex-direction: column;
                }

                .project-chart-visual {
                    max-width: 100%;
                    flex: none;
                }
            }

            /* ==================== TABLE SECTION ======================= */
            .project-dashboard-section {
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
                overflow: hidden;
            }

            .project-section-header {
                background: #334155;
                color: #ffffff;
                padding: 12px 18px;
                font-size: 16px;
                font-weight: 600;
            }

            .project-table-wrapper {
                overflow-x: auto;
                overflow-y: auto;
                max-height: 560px;
            }

            .project-table {
                min-width: 1400px;
                margin: 0;
            }

            .project-table thead th {
                position: sticky;
                top: 0;
                z-index: 2;
                background: #f8fafc;
                color: #334155;
                font-size: 12px;
                font-weight: 600;
                border-bottom: 1px solid #e2e8f0;
                white-space: nowrap;
            }

            .project-table tbody td {
                font-size: 13px;
                vertical-align: middle;
                white-space: nowrap;
            }

            .project-table tbody tr:hover {
                background: #f8fafc;
            }


            /* ================ TAG ====================== */
            .project-tag {
                display: inline-block;
                padding: 4px 8px;
                margin: 2px 3px 2px 0;
                border-radius: 6px;
                background: #eef2ff;
                color: #4338ca;
                font-size: 12px;
            }

            .project-tag-name {
                background: #ecfdf5;
                color: #047857;
            }

            /* ================== STATUS ===================== */
            .project-status {
                display: inline-block;
                padding: 4px 9px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }

            .project-status-open {
                background: #dcfce7;
                color: #15803d;
            }

            .project-status-on-hold {
                background: #fef3c7;
                color: #a16207;
            }

            .project-status-completed {
                background: #dbeafe;
                color: #1d4ed8;
            }

            .project-status-cancelled {
                background: #fee2e2;
                color: #dc2626;
            }


            /* =================== EMPTY ===================== */
            .project-empty {
                padding: 45px 20px;
                text-align: center;
                color: #94a3b8;
                font-size: 13px;
            }


            /* =============== TOTAL SUMMARY ======================= */
            .project-total-summary {
                display: grid;
                grid-template-columns:
                    repeat(4, minmax(0, 1fr));
                gap: 1px;
                background: #e5e7eb;
                border-top: 1px solid #e5e7eb;
            }

            .project-summary-item {
                background: #f8fafc;
                padding: 12px 16px;
            }

            .project-summary-label {
                display: block;
                font-size: 11px;
                color: #64748b;
                margin-bottom: 3px;
            }

            .project-summary-value {
                font-size: 14px;
                font-weight: 600;
                color: #1e293b;
            }


            /* ================== FOOTER ======================= */
            .project-table-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                padding: 12px 16px;
                border-top: 1px solid #e5e7eb;
                background: #ffffff;
            }

            .project-footer-left {
                display: flex;
                align-items: center;
                gap: 9px;
                color: #64748b;
                font-size: 13px;
            }

            .project-page-size {
                min-width: 80px;
                height: 34px;
                border: 1px solid #d7dce2;
                border-radius: 7px;
                padding: 0 8px;
                background: #ffffff;
            }

            .project-footer-right {
                display: flex;
                align-items: center;
            }

            .project-load-more {
                height: 34px;
                border-radius: 7px;
                font-weight: 600;
            }

            #project-chart-customer .graph-stats-container {
                display: none !important;
            }

            /* =================== RESPONSIVE =========================== */
            @media (max-width: 1100px) {
                .project-filter-grid {
                    grid-template-columns:
                        repeat(3, minmax(0, 1fr));
                    gap: 14px 12px;
                }

                .project-total-summary {
                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
                }
            }

            @media (max-width: 900px) {
                .project-dashboard {
                    padding: 0 10px 25px;
                }

                .project-card-row {
                    grid-template-columns: 1fr;
                }
            }

            @media (max-width: 650px) {
                .project-filter-grid {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 12px;
                }

                .project-total-summary {
                    grid-template-columns: 1fr 1fr;
                }

                .project-table-footer {
                    align-items: flex-start;
                    flex-direction: column;
                }
            }

        </style>
    `).appendTo("head");

    // ======================== HTML ============================
    $(`
        <div class="project-dashboard">
            <!-- FILTER -->
            <div class="project-filter-box">
                <div class="project-filter-header">
                    <i class="fa fa-filter"></i>
                    <span>${__("Filter Projects")}</span>
                </div>

                <div class="project-filter-body">
                    <div class="project-filter-grid">
                        <div class="project-filter-field">
                            <div class="project-filter-control" data-field="project_id"> </div>
                        </div>

                        <div class="project-filter-field">
                            <div class="project-filter-control" data-field="customer"> </div>
                        </div>

                        <div class="project-filter-field">
                            <div class="project-filter-control" data-field="status"> </div>
                        </div>

                        <div class="project-filter-field">
                            <div class="project-filter-control" data-field="project_type"> </div>
                        </div>

                        <div class="project-filter-field">
                            <div class="project-filter-control" data-field="priority"> </div>
                        </div>

                        <div class="project-filter-field">
                            <div class="project-filter-control" data-field="tag"> </div>
                        </div>

                        <div class="project-filter-field">
                            <div class="project-filter-control" data-field="fiscal_year"> </div>
                        </div>

                        <div class="project-filter-field">
                            <div class="project-filter-control" data-field="custom_portfolio"> </div>
                        </div>
                    </div>


                    <div class="project-filter-actions">
                        <button class="btn btn-primary project-filter-apply" id="project-filter-btn"
                            title="${__("Apply Filters")}" aria-label="${__("Apply Filters")}">
                            <i class="fa fa-filter"></i>
                        </button>

                        <button class="project-filter-reset" id="project-reset-btn"
                            title="${__("Reset Filters")}" aria-label="${__("Reset Filters")}">
                            <i class="fa fa-refresh"></i>
                        </button>
                    </div>

                </div>
            </div>


            <!-- CARDS -->
            <div class="project-card-row">
                <div class="project-dashboard-card project-card-blue">
                    <div class="project-card-title"> ${__("Total Projects")} </div>
                    <div class="project-card-values">
                        <div class="project-card-count" id="project-total-count"> 0 </div>
                        <div class="project-card-overall-value" id="project-total-overall-value"> ₹0.00 </div>
                    </div>
                    <div class="project-card-icon project-icon-blue"> <i class="fa fa-folder-open"></i> </div>
                </div>

                <div class="project-dashboard-card project-card-green">
                    <div class="project-card-title"> ${__("Total Customers")} </div>
                    <div class="project-card-values">
                        <div class="project-card-count" id="project-customer-count"> 0 </div>
                    </div>
                    <div class="project-card-icon project-icon-green"> <i class="fa fa-users"></i> </div>
                </div>
            </div>

            <!-- CHARTS -->
            <div class="project-chart-row">
                <div class="project-chart-card">
                    <div class="project-chart-header">
                        <div> <i class="fa fa-pie-chart"></i> ${__("Customer Wise Split")} </div>
                        <div class="project-chart-subtitle"> ${__("Values include GST")} </div>
                    </div>
                    <div class="project-chart-split-body" id="project-customer-split-body">
                        <div class="project-chart-visual" id="project-chart-customer"> </div>
                        <div class="project-chart-legend" id="project-chart-customer-legend"> </div>
                    </div>
                </div>

                <div class="project-chart-card">
                    <div class="project-chart-header">
                        <div> <i class="fa fa-bar-chart"></i> ${__("Portfolio Wise Split")} </div>
                        <div class="project-chart-subtitle"> ${__("Values include GST")} </div>
                    </div>
                    <div class="project-hbar-list" id="project-chart-product"> </div>
                </div>
            </div>

            <!-- TABLE -->
            <div class="project-dashboard-section">
                <div class="project-section-header"> <i class="fa fa-bar-chart"></i> ${__("Projects")} </div>
                <div id="project-dashboard-table"> </div>
            </div>
        </div>
    `).appendTo(page.body);


    // ===================== CONTROLS ==============================
    const controls = {};
    function create_multiselect(fieldname, placeholder) {
        controls[fieldname] = frappe.ui.form.make_control({
            parent: $(`[data-field="${fieldname}"]`),
            df: {
                fieldtype: "MultiSelectList",
                fieldname: fieldname,
                placeholder: placeholder,
                options: []
            },
            render_input: true
        });
    }

    create_multiselect("project_id",__("Select Project"));
    create_multiselect("customer", __("Select Customer"));
    create_multiselect("status", __("Select Status"));
    create_multiselect("project_type", __("Select Project Type"));
    create_multiselect("priority", __("Select Priority"));
    create_multiselect("tag", __("Select Item Code"));
    create_multiselect("fiscal_year", __("Select Fiscal Year"));
    create_multiselect("custom_portfolio", __("Select Portfolio"));

    // ======================== FILTER OPTIONS ================================
    function load_filter_options() {
        frappe.call({
            method: "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_filter_options",
            callback: function (r) {
                if (!r.message) {
                    return;
                }

                const options = r.message;
                set_multiselect_options(controls.project_id, options.project_ids);
                set_multiselect_options(controls.customer, options.customers);
                set_multiselect_options(controls.status, options.statuses);
                set_multiselect_options(controls.project_type, options.project_types);
                set_multiselect_options(controls.priority, options.priorities);
                set_multiselect_options(controls.tag, options.tags);
                set_multiselect_options(controls.fiscal_year, options.fiscal_years);
                set_multiselect_options(controls.custom_portfolio, options.portfolios);
            }
        });
    }


    function set_multiselect_options(control, values) {
        values = values || [];
        control.df.options = values;

        if (control.refresh) {
            control.refresh();
        }

        if (control.set_value) {
            control.set_value([]);
        }
    }


    // ====================== PAGINATION ==============================
    let current_limit = 20;
    let current_offset = 0;
    let current_filters = {};

    // =======================GET FILTER VALUES =============================
    function get_control_values(control) {
        if (!control) {
            return [];
        }

        const value = control.get_value();
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value;
        }

        return [value];
    }


    function get_filters() {
        return {
            project_id:
                get_control_values(controls.project_id),

            customer:
                get_control_values(controls.customer),

            status:
                get_control_values(controls.status),

            project_type:
                get_control_values(controls.project_type),

            priority:
                get_control_values(controls.priority),

            tag:
                get_control_values(controls.tag),

            fiscal_year:
                get_control_values(controls.fiscal_year),

            custom_portfolio:
                get_control_values(controls.custom_portfolio)
        };
    }

    // ========================== LOAD DASHBOARD ==============================
    function load_dashboard(reset = true) {
        if (reset) {
            current_offset = 0;
            current_filters = get_filters();
            load_charts();
        }

        frappe.call({
            method: "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_dashboard_data",

            args: {
                filters: JSON.stringify(current_filters),
                limit: current_limit === "all" ? 0 : current_limit,
                offset: current_offset
            },

            freeze: true,
            freeze_message: __("Loading Project Dashboard..."),
            callback: function (r) {
                if (!r.message) {
                    return;
                }

                const data = r.message;
                // ================= CARDS =================
                $("#project-total-count").text(data.total_projects || 0);
                $("#project-total-overall-value").text(format_currency(data.total_purchase_value || 0));
                $("#project-customer-count").text(data.customer_count || 0);

                // ================= TABLE =================
                render_project_table(
                    data.projects || [],
                    data.total_projects || 0,
                    data.total_basic_value || 0,
                    data.total_taxes || 0,
                    data.total_purchase_value || 0,
                    reset
                );
            }
        });
    }

    // ========================== LOAD CHARTS ==============================
    function load_charts() {
        frappe.call({
            method: "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_chart_data",
            args: {
                filters: JSON.stringify(current_filters)
            },
            callback: function (r) {
                if (!r.message) {
                    return;
                }

                render_customer_pie_chart(r.message.customer_wise || []);
                render_portfolio_horizontal_bars(r.message.portfolio_wise || []);
            }
        });
    }

    // ==================== CHART HELPERS ==============================
    function chart_flt(value) {
        return parseFloat(value) || 0;
    }

    // Groups rows into top N by value, bucketing the remainder into "Others"
    // so the pie/bar chart stays readable when there are many customers/items.
    function group_top_n(rows, label_key, value_key, top_n) {
        top_n = top_n || 8;

        const sorted = [...rows].sort(
            (a, b) => chart_flt(b[value_key]) - chart_flt(a[value_key])
        );

        const top = sorted.slice(0, top_n);
        const rest = sorted.slice(top_n);

        const labels = top.map(row => row[label_key] || __("Not Set"));
        const values = top.map(row => chart_flt(row[value_key]));

        if (rest.length) {
            const others_total = rest.reduce(
                (sum, row) => sum + chart_flt(row[value_key]), 0
            );

            labels.push(__("Others"));
            values.push(others_total);
        }

        return { labels, values };
    }

    // Formats a comma-separated qty list (e.g. from GROUP_CONCAT) into
    // clean, non-decimal-padded numbers: "1.000000000" -> "1".
    function format_qty_list(raw_value) {
        if (!raw_value || raw_value === "-") {
            return "-";
        }

        return raw_value
            .split(",")
            .map(item => {
                const num = parseFloat(item.trim());
                return isNaN(num) ? item.trim() : num.toString();
            })
            .join(", ");
    }

    // Renders a comma-separated raw value as a list of chip spans.
    function render_chip_list(raw_value, chip_class) {
        if (!raw_value || raw_value === "-") {
            return "-";
        }

        return raw_value
            .split(",")
            .map(item => `<span class="project-tag ${chip_class}"> ${frappe.utils.escape_html(item.trim())} </span>`)
            .join("");
    }

    // Customer Wise Split: pie chart on the left, a scrollable legend
    // (name + value, professionally stacked) on the right. The whole
    // split-body is rebuilt each render so it works cleanly across
    // repeated filter apply/reset calls.
    let project_customer_chart = null;

    function render_customer_pie_chart(rows) {
        const wrap = $("#project-customer-split-body");

        if (!rows.length) {
            wrap.html(`<div class="project-chart-empty"> ${__("No data found.")} </div>`);
            return;
        }

        wrap.html(`
            <div class="project-chart-visual" id="project-chart-customer"> </div>
            <div class="project-chart-legend" id="project-chart-customer-legend"> </div>
        `);

        const colors = [
            "#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed",
            "#0891b2", "#db2777", "#f97316", "#94a3b8"
        ];

        // Reserve the last color for the "Others" bucket.
        const { labels, values } = group_top_n(
            rows,
            "customer",
            "purchase_value",
            colors.length - 1
        );

        project_customer_chart = new frappe.Chart("#project-chart-customer", {
            data: {
                labels: labels,
                datasets: [{ values: values }]
            },
            type: "pie",
            height: 220,
            colors: colors,

            // Hide the bottom legend/values generated by Frappe Chart
            showLegend: false
        });

        const legend = $("#project-chart-customer-legend");

        labels.forEach((label, index) => {
            legend.append(`
                <div class="project-legend-item">
                    <span class="project-legend-dot" style="background: ${colors[index % colors.length]};">
                    </span>

                    <div class="project-legend-text">
                        <span class="project-legend-name" title="${frappe.utils.escape_html(label)}">
                            ${frappe.utils.escape_html(label)}
                        </span>

                        <span class="project-legend-value">
                            ${format_currency(values[index])}
                        </span>
                    </div>
                </div>
            `);
        });
    }

    // Portfolio Wise Split: a horizontal bar per portfolio (label, filled
    // track scaled to the highest value, and the value on the right),
    // in a scrollable list so it isn't capped to a handful of portfolios.
    function render_portfolio_horizontal_bars(rows) {
        const container = $("#project-chart-product");
        container.empty();

        if (!rows.length) {
            container.html(`<div class="project-chart-empty"> ${__("No data found.")} </div>`);
            return;
        }

        const sorted = [...rows].sort(
            (a, b) => chart_flt(b.portfolio_value) - chart_flt(a.portfolio_value)
        );

        const max_value = chart_flt(sorted[0].portfolio_value) || 1;

        sorted.forEach(row => {
            const value = chart_flt(row.portfolio_value);
            const width_pct = Math.max((value / max_value) * 100, 2);
            const portfolio = row.portfolio || "-";

            container.append(`
                <div class="project-hbar-row">
                    <div class="project-hbar-label" title="${frappe.utils.escape_html(portfolio)}">
                        ${frappe.utils.escape_html(portfolio)}
                    </div>
                    <div class="project-hbar-track">
                        <div class="project-hbar-fill" style="width: ${width_pct}%;"></div>
                    </div>
                    <div class="project-hbar-value"> ${format_currency(value)} </div>
                </div>
            `);
        });
    }


    // ========================== RENDER TABLE ==============================
    function render_project_table(
        projects, total_count, total_basic_value, total_taxes, total_purchase_value, reset) {

        const container = $("#project-dashboard-table");
        if (reset) {
            container.empty();

            if (!projects.length) {
                container.html(`<div class="project-empty"> ${__("No projects found.")} </div>`);
                return;
            }

            container.html(`
                <div class="table-responsive project-table-wrapper">
                    <table class="table table-hover project-table mb-0">
                        <thead>
                            <tr>
                                <th> ${__("Project ID")} </th>
                                <th> ${__("Customer")} </th>
                                <th> ${__("Item Code")} </th>
                                <th> ${__("Item Name")} </th>
                                <th> ${__("Qty")} </th>
                                <th> ${__("Portfolio")} </th>
                                <th> ${__("Status")} </th>
                                <th> ${__("Project Type")} </th>
                                <th> ${__("Priority")} </th>
                                <th> ${__("Fiscal Year")} </th>

                                <th class="text-right"> ${__("Basic Value")} </th>
                                <th class="text-right"> ${__("Taxes")} </th>
                                <th class="text-right"> ${__("Overall Value")} </th>
                            </tr>

                        </thead>
                        <tbody id="project-table-body"> </tbody>
                    </table>
                </div>

                <!-- TOTALS -->
                <div class="project-total-summary">
                    <div class="project-summary-item">
                        <span class="project-summary-label"> ${__("Total Projects")} </span>
                        <span class="project-summary-value"> ${total_count} </span>
                    </div>

                    <div class="project-summary-item">
                        <span class="project-summary-label"> ${__("Basic Value")} </span>
                        <span class="project-summary-value"> ${format_currency(total_basic_value)} </span>
                    </div>

                    <div class="project-summary-item">
                        <span class="project-summary-label"> ${__("Taxes")} </span>
                        <span class="project-summary-value"> ${format_currency(total_taxes)} </span>

                    </div>

                    <div class="project-summary-item">
                        <span class="project-summary-label"> ${__("Overall Value")} </span>
                        <span class="project-summary-value"> ${format_currency(total_purchase_value)} </span>
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="project-table-footer">
                    <div class="project-footer-left">
                        <span> ${__("Show")} </span>

                        <select id="project-page-size" class="project-page-size">
                            <option value="20"> 20 </option>
                            <option value="100"> 100 </option>
                            <option value="500"> 500 </option>
                            <option value="all"> ${__("All")} </option>
                        </select>

                        <span> ${__("records")} </span>
                    </div>

                    <div class="project-footer-right">
                        <button class="btn btn-outline-primary project-load-more" id="project-load-more">
                            <i class="fa fa-plus"></i> ${__("Load More")} </button>
                    </div>
                </div>
            `);

            $("#project-page-size").val(current_limit === "all" ? "all" : current_limit);
        }

        append_project_rows(projects);
        update_load_more(total_count);
    }


    // ====================== APPEND PROJECT ROWS ============================
    function append_project_rows(projects) {
        const tbody = $("#project-table-body");

        projects.forEach(project => {
            const status_class = (project.status || "")
                    .toLowerCase()
                    .replace(/\s+/g, "-");

            tbody.append(`
                <tr>
                    <td> <a href="/app/project/${encodeURIComponent(project.name)}"> ${frappe.utils.escape_html(project.name || "")} </a> </td>
                    <td> ${frappe.utils.escape_html(project.customer || "-")} </td>
                    <td> ${render_chip_list(project.tag, "")} </td>
                    <td> ${render_chip_list(project.item_name, "project-tag-name")} </td>
                    <td> ${frappe.utils.escape_html(format_qty_list(project.qty))} </td>
                    <td> ${frappe.utils.escape_html(project.portfolio || "-")} </td>
                    <td> ${project.status ? `<span class="project-status project-status-${status_class}">
                                        ${frappe.utils.escape_html(project.status)} </span>` : "-" } </td>
                    <td> ${frappe.utils.escape_html(project.project_type || "-")} </td>
                    <td> ${frappe.utils.escape_html(project.priority || "-")} </td>
                    <td> ${frappe.utils.escape_html(project.fiscal_year || "-")} </td>
                    <td class="text-right"> ${format_currency(project.basic_value || 0)} </td>
                    <td class="text-right"> ${format_currency(project.taxes || 0)} </td>
                    <td class="text-right"> ${format_currency(project.purchase_value || 0)} </td>
                </tr>
            `);
        });
    }

    // ====================== LOAD MORE ==============================
    function update_load_more(total_count) {
        if (current_limit === "all") {
            $("#project-load-more").hide();
            return;
        }

        const displayed_count = $("#project-table-body tr").length;

        if (displayed_count >= total_count) {
            $("#project-load-more").hide();

        } else {
            $("#project-load-more").show();
        }
    }

    // ==================== APPLY FILTER =========================
    $("#project-filter-btn").on("click",
        function () {
            current_limit = 20;
            load_dashboard(true);
        }
    );

    // ===================== RESET FILTER ============================
    $("#project-reset-btn").on("click",
        function () {
            Object.values(controls).forEach(
                control => {
                    if (control.set_value) {
                        control.set_value([]);
                    }
                }
            );

            current_limit = 20;
            load_dashboard(true);
        }
    );

    // ====================== PAGE SIZE ==============================
    $(document).on("change", "#project-page-size",
        function () {
            const value = $(this).val();

            current_limit = value === "all" ? "all" : parseInt(value);
            current_offset = 0;
            load_dashboard(true);
        }
    );

    // ====================== LOAD MORE ==============================
    $(document).on("click", "#project-load-more",
        function () {
            current_offset += current_limit;

            frappe.call({
                method: "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_dashboard_data",
                args: {
                    filters: JSON.stringify(current_filters),
                    limit: current_limit,
                    offset: current_offset
                },

                callback: function (r) {
                    if (!r.message) {
                        return;
                    }

                    append_project_rows(r.message.projects || []);
                    update_load_more(r.message.total_projects || 0);
                }
            });
        }
    );

    // ====================== INITIAL LOAD ===========================
    load_filter_options();
    load_dashboard(true);
};

