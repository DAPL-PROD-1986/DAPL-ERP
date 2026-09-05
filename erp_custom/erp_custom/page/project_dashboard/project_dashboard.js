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

//     // ==================== CSS ===========================

//     $(`
//         <style>

//             .project-dashboard {
//                 padding: 0 16px 30px;
//                 max-width: 1600px;
//                 margin-top: 15px;
//             }

//             /* FILTER */

//             .project-filter-box {
//                 background: #fff;
//                 border-radius: 12px;
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, .07);
//                 margin-bottom: 18px;
//                 overflow: visible;
//             }

//             .project-filter-header {
//                 background: #2563eb;
//                 color: #fff;
//                 padding: 12px 18px;
//                 font-size: 17px;
//                 font-weight: 600;
//                 border-radius: 12px 12px 0 0;
//             }

//             .project-filter-body {
//                 padding: 20px 22px 16px;
//             }

//             .project-filter-label {
//                 font-size: 13px;
//                 font-weight: 600;
//                 color: #334155;
//                 margin-bottom: 7px;
//             }

//             .project-filter-control .form-control,
//             .project-filter-control .control-input {
//                 min-height: 38px;
//                 border: 1px solid #d7dce2;
//                 border-radius: 8px;
//                 box-shadow: none;
//             }

//             .project-filter-control .form-control:focus,
//             .project-filter-control .control-input:focus {
//                 border-color: #2563eb;
//                 box-shadow: 0 0 0 2px rgba(37, 99, 235, .10);
//             }

//             .project-filter-actions {
//                 display: flex;
//                 align-items: center;
//                 gap: 8px;
//                 margin-top: 22px;
//             }

//             .project-filter-btn {
//                 height: 38px;
//                 border-radius: 8px;
//                 font-weight: 600;
//             }

//             .project-reset-btn {
//                 width: 38px;
//                 height: 38px;
//                 border-radius: 8px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//             }

//             /* CARDS */

//             .project-card-row {
//                 display: grid;
//                 grid-template-columns: repeat(2, minmax(0, 1fr));
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

//             .project-card-label {
//                 font-size: 13px;
//                 color: #64748b;
//             }

//             .project-card-count {
//                 font-size: 27px;
//                 font-weight: 600;
//                 color: #1e293b;
//                 margin-top: 2px;
//             }

//             .project-card-value {
//                 font-size: 17px;
//                 font-weight: 600;
//                 color: #2563eb;
//                 margin-top: 6px;
//             }

//             .project-card-icon {
//                 position: absolute;
//                 top: 20px;
//                 right: 22px;
//                 width: 50px;
//                 height: 50px;
//                 border-radius: 12px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 color: #fff;
//                 font-size: 21px;
//             }

//             .project-icon-blue {
//                 background: #2563eb;
//             }

//             .project-icon-green {
//                 background: #16a34a;
//             }

//             /* TABLE */

//             .project-dashboard-section {
//                 background: #fff;
//                 border-radius: 12px;
//                 box-shadow: 0 2px 8px rgba(0, 0, 0, .07);
//                 overflow: hidden;
//             }

//             .project-section-header {
//                 background: #334155;
//                 color: #fff;
//                 padding: 12px 18px;
//                 font-size: 17px;
//                 font-weight: 600;
//             }

//             .project-table-wrapper {
//                 overflow-x: auto;
//                 overflow-y: auto;
//                 max-height: 560px;
//             }

//             .project-table {
//                 min-width: 1050px;
//                 margin: 0;
//             }

//             .project-table thead th {
//                 position: sticky;
//                 top: 0;
//                 z-index: 2;
//                 background: #f8fafc;
//                 color: #334155;
//                 font-size: 13px;
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

//             .project-tag {
//                 display: inline-block;
//                 padding: 4px 8px;
//                 margin: 2px 3px 2px 0;
//                 border-radius: 6px;
//                 background: #eef2ff;
//                 color: #4338ca;
//                 font-size: 12px;
//             }

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

//             .project-empty {
//                 padding: 40px;
//                 text-align: center;
//                 color: #94a3b8;
//             }

//             /* FOOTER */

//             .project-table-footer {
//                 display: flex;
//                 align-items: center;
//                 justify-content: space-between;
//                 gap: 15px;
//                 padding: 12px 16px;
//                 border-top: 1px solid #e5e7eb;
//                 background: #fff;
//             }

//             .project-footer-left {
//                 display: flex;
//                 align-items: center;
//                 gap: 10px;
//                 color: #64748b;
//                 font-size: 13px;
//             }

//             .project-page-size {
//                 min-width: 85px;
//                 height: 34px;
//                 border: 1px solid #d7dce2;
//                 border-radius: 7px;
//                 padding: 0 8px;
//                 background: #fff;
//             }

//             .project-footer-right {
//                 display: flex;
//                 align-items: center;
//                 gap: 10px;
//             }

//             .project-load-more {
//                 height: 34px;
//                 border-radius: 7px;
//                 font-weight: 600;
//             }

//             .project-total-summary {
//                 padding: 11px 16px;
//                 background: #f8fafc;
//                 border-top: 1px solid #e5e7eb;
//                 display: flex;
//                 justify-content: flex-end;
//                 gap: 35px;
//                 font-size: 13px;
//             }

//             .project-summary-value {
//                 font-weight: 600;
//                 color: #1e293b;
//             }

//             @media (max-width: 900px) {

//                 .project-card-row {
//                     grid-template-columns: 1fr;
//                 }

//                 .project-dashboard {
//                     padding: 0 10px 25px;
//                 }

//                 .project-filter-body {
//                     padding: 16px;
//                 }

//             }

//         </style>
//     `).appendTo("head");


//     // =========================================================
//     // HTML
//     // =========================================================

//     $(`
//         <div class="project-dashboard">

//             <div class="project-filter-box">

//                 <div class="project-filter-header">
//                     <i class="fa fa-filter"></i>
//                     ${__("Filter Projects")}
//                 </div>

//                 <div class="project-filter-body">

//                     <div class="row">

//                         <div class="col-md-3 mb-3">
//                             <div class="project-filter-label">
//                                 ${__("Project ID")}
//                             </div>
//                             <div class="project-filter-control"
//                                  data-field="project_id"></div>
//                         </div>

//                         <div class="col-md-3 mb-3">
//                             <div class="project-filter-label">
//                                 ${__("Status")}
//                             </div>
//                             <div class="project-filter-control"
//                                  data-field="status"></div>
//                         </div>

//                         <div class="col-md-3 mb-3">
//                             <div class="project-filter-label">
//                                 ${__("Project Type")}
//                             </div>
//                             <div class="project-filter-control"
//                                  data-field="project_type"></div>
//                         </div>

//                         <div class="col-md-3 mb-3">
//                             <div class="project-filter-label">
//                                 ${__("Priority")}
//                             </div>
//                             <div class="project-filter-control"
//                                  data-field="priority"></div>
//                         </div>

//                     </div>

//                     <div class="row">

//                         <div class="col-md-3 mb-2">
//                             <div class="project-filter-label">
//                                 ${__("Tag")}
//                             </div>
//                             <div class="project-filter-control"
//                                  data-field="tag"></div>
//                         </div>

//                         <div class="col-md-3 mb-2">
//                             <div class="project-filter-label">
//                                 ${__("Fiscal Year")}
//                             </div>
//                             <div class="project-filter-control"
//                                  data-field="fiscal_year"></div>
//                         </div>

//                         <div class="col-md-3 mb-2">

//                             <div class="project-filter-actions">

//                                 <button
//                                     class="btn btn-primary project-filter-btn"
//                                     id="project-filter-btn">

//                                     <i class="fa fa-filter"></i>
//                                     ${__("Apply")}

//                                 </button>

//                                 <button
//                                     class="btn btn-light project-reset-btn"
//                                     id="project-reset-btn"
//                                     title="${__("Reset Filters")}">

//                                     <i class="fa fa-refresh"></i>

//                                 </button>

//                             </div>

//                         </div>

//                     </div>

//                 </div>

//             </div>


//             <!-- CARDS -->

//             <div class="project-card-row">

//                 <div class="project-dashboard-card project-card-blue">

//                     <div class="project-card-title">
//                         ${__("Total Projects")}
//                     </div>

//                     <div class="project-card-label">
//                         ${__("Count")}
//                     </div>

//                     <div class="project-card-count"
//                          id="project-total-count">
//                         0
//                     </div>

//                     <div class="project-card-value"
//                          id="project-total-value">
//                         ₹ 0.00
//                     </div>

//                     <div class="project-card-icon project-icon-blue">
//                         <i class="fa fa-folder-open"></i>
//                     </div>

//                 </div>


//                 <div class="project-dashboard-card project-card-green">

//                     <div class="project-card-title">
//                         ${__("Customers")}
//                     </div>

//                     <div class="project-card-label">
//                         ${__("Unique Customers")}
//                     </div>

//                     <div class="project-card-count"
//                          id="project-customer-count">
//                         0
//                     </div>

//                     <div class="project-card-icon project-icon-green">
//                         <i class="fa fa-users"></i>
//                     </div>

//                 </div>

//             </div>


//             <!-- TABLE -->

//             <div class="project-dashboard-section">

//                 <div class="project-section-header">
//                     <i class="fa fa-bar-chart"></i>
//                     ${__("Projects")}
//                 </div>

//                 <div id="project-dashboard-table"></div>

//             </div>

//         </div>
//     `).appendTo(page.body);


//     // =========================================================
//     // CONTROLS
//     // =========================================================

//     const controls = {};

//     function create_select(fieldname, placeholder) {

//         controls[fieldname] = frappe.ui.form.make_control({
//             parent: $(`[data-field="${fieldname}"]`),
//             df: {
//                 fieldtype: "Select",
//                 fieldname: fieldname,
//                 options: "",
//                 placeholder: placeholder
//             },
//             render_input: false
//         });

//         controls[fieldname].make_input();
//     }


//     create_select("project_id", __("Select Project"));
//     create_select("status", __("Select Status"));
//     create_select("project_type", __("Select Project Type"));
//     create_select("priority", __("Select Priority"));
//     create_select("tag", __("Select Item Code"));
//     create_select("fiscal_year", __("Select Fiscal Year"));


//     // =========================================================
//     // LOAD FILTER OPTIONS
//     // =========================================================

//     function load_filter_options() {

//         frappe.call({
//             method:
//                 "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_filter_options",

//             callback: function (r) {

//                 if (!r.message) {
//                     return;
//                 }

//                 const options = r.message;

//                 set_select_options(
//                     controls.project_id,
//                     options.project_ids,
//                     __("Select Project")
//                 );

//                 set_select_options(
//                     controls.status,
//                     options.statuses,
//                     __("Select Status")
//                 );

//                 set_select_options(
//                     controls.project_type,
//                     options.project_types,
//                     __("Select Project Type")
//                 );

//                 set_select_options(
//                     controls.priority,
//                     options.priorities,
//                     __("Select Priority")
//                 );

//                 set_select_options(
//                     controls.tag,
//                     options.tags,
//                     __("Select Item Code")
//                 );

//                 set_select_options(
//                     controls.fiscal_year,
//                     options.fiscal_years,
//                     __("Select Fiscal Year")
//                 );
//             }
//         });
//     }


//     function set_select_options(control, values, placeholder) {
//         values = values || [];
//         const options = ["", ...values];
//         control.df.options = options.join("\n");
//         control.refresh();
//         control.set_value("");
//     }

//     // ====================== PAGINATION ================================

//     let current_limit = 20;
//     let current_offset = 0;
//     let current_filters = {};

//     // ===================== GET FILTER VALUES =================================

//     function get_filters() {
//         return {
//             project_id: controls.project_id.get_value() || "",
//             status: controls.status.get_value() || "",
//             project_type: controls.project_type.get_value() || "",
//             priority: controls.priority.get_value() || "",
//             tag: controls.tag.get_value() || "",
//             fiscal_year: controls.fiscal_year.get_value() || ""
//         };
//     }


//     // ====================== LOAD DASHBOARD ==================================

//     function load_dashboard(reset = true) {
//         if (reset) {
//             current_offset = 0;
//             current_filters = get_filters();
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

//                 $("#project-total-count").text(data.total_projects || 0);
//                 $("#total-basic-value").text(format_currency(data.total_basic_value || 0));
//                 $("#total-taxes").text(format_currency(data.total_taxes || 0));
//                 $("#total-purchase-value").text(format_currency(data.total_purchase_value || 0));
//                 $("#project-customer-count").text(data.customer_count || 0);

//                 render_project_table(data.projects || [], data.total_projects || 0, data.total_basic_value || 0, 
//                     data.total_taxes || 0, data.total_purchase_value || 0, reset);
//             }
//         });
//     }


//     // =========================================================
//     // RENDER TABLE
//     // =========================================================

//     function render_project_table(
//     projects,
//     total_count,
//     total_basic_value,
//     total_taxes,
//     total_purchase_value,
//     reset) {

//         const container = $("#project-dashboard-table");

//         if (reset) {
//             container.empty();
//             if (!projects.length) {
//                 container.html(`
//                     <div class="project-empty"> ${__("No projects found.")} </div>
//                 `);

//                 return;
//             }

//             container.html(`
//                 <div class="table-responsive project-table-wrapper">
//                     <table class="table table-hover project-table mb-0">
//                         <thead>
//                             <tr>
//                                 <th>${__("Project ID")}</th>
//                                 <th>${__("Customer")}</th>
//                                 <th>${__("Tag")}</th>
//                                 <th>${__("Status")}</th>
//                                 <th>${__("Project Type")}</th>
//                                 <th>${__("Priority")}</th>
//                                 <th>${__("Fiscal Year")}</th>
//                                 <th class="text-right"> ${__("Basic Value")} </th>
//                                 <th class="text-right"> ${__("Taxes Value")} </th>
//                                 <th class="text-right"> ${__("Project Value")} </th>
//                             </tr>
//                         </thead>
//                         <tbody id="project-table-body"></tbody>
//                     </table>
//                 </div>

//                 <div class="project-total-summary">

//                 <div>
//                     ${__("Total Projects")}:
//                     <span class="project-summary-value">
//                         ${total_count}
//                     </span>
//                 </div>

//                 <div>
//                     ${__("Basic Value")}:
//                     <span class="project-summary-value">
//                         ${format_currency(total_basic_value)}
//                     </span>
//                 </div>

//                 <div>
//                     ${__("Taxes")}:
//                     <span class="project-summary-value">
//                         ${format_currency(total_taxes)}
//                     </span>
//                 </div>

//                 <div>
//                     ${__("Purchase Value")}:
//                     <span class="project-summary-value">
//                         ${format_currency(total_purchase_value)}
//                     </span>
//                 </div>

//             </div>


//                 <div class="project-table-footer">
//                     <div class="project-footer-left">
//                         <span>${__("Show")}</span>

//                         <select id="project-page-size" class="project-page-size">
//                             <option value="20">20</option>
//                             <option value="100">100</option>
//                             <option value="500">500</option>
//                             <option value="all">All</option>
//                         </select>

//                         <span>${__("records")}</span>
//                     </div>


//                     <div class="project-footer-right">

//                         <button class="btn btn-outline-primary project-load-more" id="project-load-more">
//                             <i class="fa fa-plus"></i>
//                             ${__("Load More")}
//                         </button>
//                     </div>
//                 </div>
//             `);

//             $("#project-page-size").val(current_limit === "all" ? "all" : current_limit);
//         }

//         append_project_rows(projects);
//         update_load_more(total_count);
//     }


//     // ====================== APPEND ROWS ================================
//     function append_project_rows(projects) {
//         const tbody = $("#project-table-body");
//         projects.forEach(project => {
//             let tags = project.tag || "-";

//             if (tags !== "-") {

//                 tags = tags
//                     .split(",")
//                     .map(item => `
//                         <span class="project-tag">
//                             ${frappe.utils.escape_html(
//                                 item.trim()
//                             )}
//                         </span>
//                     `).join("");
//             }

//             const status_class =
//                 (project.status || "")
//                     .toLowerCase()
//                     .replace(/\s+/g, "-");


//             tbody.append(`
//                 <tr>
//                     <td>
//                         <a href="/app/project/${encodeURIComponent(project.name)}">
//                             ${frappe.utils.escape_html(project.name || "")} </a>
//                     </td>

//                     <td> ${frappe.utils.escape_html(project.customer || "-" )} </td>
//                     <td> ${tags} </td>
//                     <td> ${project.status ? `<span class="project-status project-status-${status_class}">
//                                         ${frappe.utils.escape_html(project.status)} </span>` : "-"} </td>
//                     <td> ${frappe.utils.escape_html(project.project_type || "-")} </td>
//                     <td> ${frappe.utils.escape_html(project.priority || "-")} </td>
//                     <td> ${frappe.utils.escape_html(project.fiscal_year || "-")} </td>
//                     <td class="text-right"> ${format_currency(project.project_value || 0)} </td>
//                 </tr>
//             `);
//         });
//     }

//     // ======================= LOAD MORE ===============================
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


//     // ======================= APPLY FILTER ====================================
//     $("#project-filter-btn").on("click", function () {
//         current_limit = 20;
//         load_dashboard(true);
//     });

//     // ======================== RESET ================================
//     $("#project-reset-btn").on("click", function () {
//         Object.values(controls).forEach(control => {
//             control.set_value("");
//         });

//         current_limit = 20;
//         load_dashboard(true);
//     });


//     // ========================== PAGE SIZE ==============================

//     $(document).on("change", "#project-page-size",
//         function () {
//             const value = $(this).val();
//             current_limit = value === "all" ? "all" : parseInt(value);
//             current_offset = 0;
//             load_dashboard(true);
//         }
//     );


//     // ========================= LOAD MORE ==============================
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


//     // ======================= INITIAL LOAD =================================
//     load_filter_options();
//     load_dashboard(true);
// };





frappe.pages["project-dashboard"].on_page_load = function (wrapper) {

    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: __("Project Dashboard"),
        single_column: true
    });


    // =========================================================
    // CSS
    // =========================================================

    $(`
        <style>

            /* =====================================================
               MAIN
            ===================================================== */

            .project-dashboard {
                padding: 0 16px 30px;
                max-width: 1600px;
                margin: 15px auto 0;
            }


            /* =====================================================
               FILTER BOX
            ===================================================== */

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
                grid-template-columns:
                    repeat(3, minmax(0, 1fr));
                gap: 18px 16px;
                align-items: end;
            }

            .project-filter-field {
                min-width: 0;
            }

            .project-filter-label {
                display: block;
                font-size: 12px;
                font-weight: 600;
                color: #475569;
                margin-bottom: 7px;
            }

            .project-filter-control {
                min-height: 40px;
            }


            /* =====================================================
               MULTI SELECT
            ===================================================== */

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


            /* =====================================================
               FILTER ACTIONS
            ===================================================== */

            .project-filter-actions {
                display: flex;
                align-items: center;
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


            /* =====================================================
               CARDS
            ===================================================== */

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

            .project-card-label {
                font-size: 13px;
                color: #64748b;
            }

            .project-card-count {
                font-size: 27px;
                font-weight: 600;
                color: #1e293b;
                margin-top: 2px;
            }

            .project-card-icon {
                position: absolute;
                top: 20px;
                right: 22px;
                width: 50px;
                height: 50px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                font-size: 21px;
            }

            .project-icon-blue {
                background: #2563eb;
            }

            .project-icon-green {
                background: #16a34a;
            }


            /* =====================================================
               TABLE SECTION
            ===================================================== */

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
                min-width: 1200px;
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


            /* =====================================================
               TAG
            ===================================================== */

            .project-tag {
                display: inline-block;
                padding: 4px 8px;
                margin: 2px 3px 2px 0;
                border-radius: 6px;
                background: #eef2ff;
                color: #4338ca;
                font-size: 12px;
            }


            /* =====================================================
               STATUS
            ===================================================== */

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


            /* =====================================================
               EMPTY
            ===================================================== */

            .project-empty {
                padding: 45px 20px;
                text-align: center;
                color: #94a3b8;
                font-size: 13px;
            }


            /* =====================================================
               TOTAL SUMMARY
            ===================================================== */

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


            /* =====================================================
               FOOTER
            ===================================================== */

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


            /* =====================================================
               RESPONSIVE
            ===================================================== */

            @media (max-width: 1100px) {

                .project-filter-grid {
                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
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
                    grid-template-columns: 1fr;
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


    // =========================================================
    // HTML
    // =========================================================

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
                            <label class="project-filter-label">
                                ${__("Project ID")}
                            </label>

                            <div
                                class="project-filter-control"
                                data-field="project_id">
                            </div>
                        </div>


                        <div class="project-filter-field">
                            <label class="project-filter-label">
                                ${__("Status")}
                            </label>

                            <div
                                class="project-filter-control"
                                data-field="status">
                            </div>
                        </div>


                        <div class="project-filter-field">
                            <label class="project-filter-label">
                                ${__("Project Type")}
                            </label>

                            <div
                                class="project-filter-control"
                                data-field="project_type">
                            </div>
                        </div>


                        <div class="project-filter-field">
                            <label class="project-filter-label">
                                ${__("Priority")}
                            </label>

                            <div
                                class="project-filter-control"
                                data-field="priority">
                            </div>
                        </div>


                        <div class="project-filter-field">
                            <label class="project-filter-label">
                                ${__("Item Code")}
                            </label>

                            <div
                                class="project-filter-control"
                                data-field="tag">
                            </div>
                        </div>


                        <div class="project-filter-field">
                            <label class="project-filter-label">
                                ${__("Fiscal Year")}
                            </label>

                            <div
                                class="project-filter-control"
                                data-field="fiscal_year">
                            </div>
                        </div>

                    </div>


                    <div class="project-filter-actions">

                        <button
                            class="btn btn-primary project-filter-apply"
                            id="project-filter-btn"
                            title="${__("Apply Filters")}"
                            aria-label="${__("Apply Filters")}">

                            <i class="fa fa-filter"></i>

                        </button>


                        <button
                            class="project-filter-reset"
                            id="project-reset-btn"
                            title="${__("Reset Filters")}"
                            aria-label="${__("Reset Filters")}">

                            <i class="fa fa-refresh"></i>

                        </button>

                    </div>

                </div>

            </div>


            <!-- CARDS -->

            <div class="project-card-row">

                <div class="project-dashboard-card project-card-blue">

                    <div class="project-card-title">
                        ${__("Total Projects")}
                    </div>

                    <div class="project-card-label">
                        ${__("Count")}
                    </div>

                    <div
                        class="project-card-count"
                        id="project-total-count">
                        0
                    </div>

                    <div class="project-card-label project-overall-label">
                        ${__("Overall Value")}
                    </div>

                    <div
                        class="project-card-overall-value"
                        id="project-total-overall-value">
                        ₹0.00
                    </div>

                    <div class="project-card-icon project-icon-blue">
                        <i class="fa fa-folder-open"></i>
                    </div>

                </div>


                <div class="project-dashboard-card project-card-green">

                    <div class="project-card-title">
                        ${__("Customers")}
                    </div>

                    <div class="project-card-label">
                        ${__("Unique Customers")}
                    </div>

                    <div
                        class="project-card-count"
                        id="project-customer-count">
                        0
                    </div>

                    <div class="project-card-icon project-icon-green">
                        <i class="fa fa-users"></i>
                    </div>

                </div>

            </div>


            <!-- TABLE -->

            <div class="project-dashboard-section">

                <div class="project-section-header">
                    <i class="fa fa-bar-chart"></i>
                    ${__("Projects")}
                </div>

                <div id="project-dashboard-table"></div>

            </div>

        </div>
    `).appendTo(page.body);


    // =========================================================
    // CONTROLS
    // =========================================================

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


    create_multiselect(
        "project_id",
        __("Select Project")
    );

    create_multiselect(
        "status",
        __("Select Status")
    );

    create_multiselect(
        "project_type",
        __("Select Project Type")
    );

    create_multiselect(
        "priority",
        __("Select Priority")
    );

    create_multiselect(
        "tag",
        __("Select Item Code")
    );

    create_multiselect(
        "fiscal_year",
        __("Select Fiscal Year")
    );


    // =========================================================
    // FILTER OPTIONS
    // =========================================================

    function load_filter_options() {

        frappe.call({

            method:
                "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_filter_options",

            callback: function (r) {

                if (!r.message) {
                    return;
                }

                const options = r.message;

                set_multiselect_options(
                    controls.project_id,
                    options.project_ids
                );

                set_multiselect_options(
                    controls.status,
                    options.statuses
                );

                set_multiselect_options(
                    controls.project_type,
                    options.project_types
                );

                set_multiselect_options(
                    controls.priority,
                    options.priorities
                );

                set_multiselect_options(
                    controls.tag,
                    options.tags
                );

                set_multiselect_options(
                    controls.fiscal_year,
                    options.fiscal_years
                );
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


    // =========================================================
    // PAGINATION
    // =========================================================

    let current_limit = 20;
    let current_offset = 0;
    let current_filters = {};


    // =========================================================
    // GET FILTER VALUES
    // =========================================================

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
                get_control_values(
                    controls.project_id
                ),

            status:
                get_control_values(
                    controls.status
                ),

            project_type:
                get_control_values(
                    controls.project_type
                ),

            priority:
                get_control_values(
                    controls.priority
                ),

            tag:
                get_control_values(
                    controls.tag
                ),

            fiscal_year:
                get_control_values(
                    controls.fiscal_year
                )
        };
    }


    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    function load_dashboard(reset = true) {
        if (reset) {
            current_offset = 0;
            current_filters = get_filters();
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

                $("#project-total-count").text(
                    data.total_projects || 0
                );

                $("#project-total-overall-value").text(
                    format_currency(data.total_purchase_value || 0)
                );

                $("#project-customer-count").text(
                    data.customer_count || 0
                );

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


    // =========================================================
    // RENDER TABLE
    // =========================================================

    function render_project_table(
        projects,
        total_count,
        total_basic_value,
        total_taxes,
        total_purchase_value,
        reset
    ) {

        const container =
            $("#project-dashboard-table");


        if (reset) {

            container.empty();


            if (!projects.length) {

                container.html(`
                    <div class="project-empty">
                        ${__("No projects found.")}
                    </div>
                `);

                return;
            }


            container.html(`

                <div class="table-responsive project-table-wrapper">

                    <table
                        class="table table-hover project-table mb-0">

                        <thead>

                            <tr>

                                <th>
                                    ${__("Project ID")}
                                </th>

                                <th>
                                    ${__("Customer")}
                                </th>

                                <th>
                                    ${__("Item Code")}
                                </th>

                                <th>
                                    ${__("Status")}
                                </th>

                                <th>
                                    ${__("Project Type")}
                                </th>

                                <th>
                                    ${__("Priority")}
                                </th>

                                <th> ${__("Fiscal Year")}
                                </th>

                                <th class="text-right">
                                    ${__("Basic Value")}
                                </th>

                                <th class="text-right">
                                    ${__("Taxes")}
                                </th>

                                <th class="text-right">
                                    ${__("Overall Value")}
                                </th>

                            </tr>

                        </thead>

                        <tbody id="project-table-body">
                        </tbody>

                    </table>

                </div>


                <!-- TOTALS -->

                <div class="project-total-summary">

                    <div class="project-summary-item">

                        <span class="project-summary-label">
                            ${__("Total Projects")}
                        </span>

                        <span class="project-summary-value">
                            ${total_count}
                        </span>

                    </div>


                    <div class="project-summary-item">

                        <span class="project-summary-label">
                            ${__("Basic Value")}
                        </span>

                        <span class="project-summary-value">
                            ${format_currency(total_basic_value)}
                        </span>

                    </div>


                    <div class="project-summary-item">

                        <span class="project-summary-label">
                            ${__("Taxes")}
                        </span>

                        <span class="project-summary-value">
                            ${format_currency(total_taxes)}
                        </span>

                    </div>


                    <div class="project-summary-item">

                        <span class="project-summary-label">
                            ${__("Overall Value")}
                        </span>

                        <span class="project-summary-value">
                            ${format_currency(
                                total_purchase_value
                            )}
                        </span>

                    </div>

                </div>


                <!-- FOOTER -->

                <div class="project-table-footer">

                    <div class="project-footer-left">

                        <span>
                            ${__("Show")}
                        </span>

                        <select
                            id="project-page-size"
                            class="project-page-size">

                            <option value="20">
                                20
                            </option>

                            <option value="100">
                                100
                            </option>

                            <option value="500">
                                500
                            </option>

                            <option value="all">
                                ${__("All")}
                            </option>

                        </select>

                        <span>
                            ${__("records")}
                        </span>

                    </div>


                    <div class="project-footer-right">

                        <button
                            class="btn btn-outline-primary project-load-more"
                            id="project-load-more">

                            <i class="fa fa-plus"></i>
                            ${__("Load More")}

                        </button>

                    </div>

                </div>
            `);


            $("#project-page-size").val(
                current_limit === "all"
                    ? "all"
                    : current_limit
            );
        }


        append_project_rows(projects);

        update_load_more(total_count);
    }


    // =========================================================
    // APPEND PROJECT ROWS
    // =========================================================

    function append_project_rows(projects) {

        const tbody =
            $("#project-table-body");


        projects.forEach(project => {

            let tags = project.tag || "-";


            if (tags !== "-") {

                tags = tags
                    .split(",")
                    .map(item => `

                        <span class="project-tag">

                            ${frappe.utils.escape_html(
                                item.trim()
                            )}

                        </span>

                    `)
                    .join("");
            }


            const status_class =
                (project.status || "")
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            tbody.append(`

                <tr>

                    <!-- PROJECT -->

                    <td>

                        <a
                            href="/app/project/${encodeURIComponent(
                                project.name
                            )}">

                            ${frappe.utils.escape_html(
                                project.name || ""
                            )}

                        </a>

                    </td>


                    <!-- CUSTOMER -->

                    <td>
                        ${frappe.utils.escape_html(
                            project.customer || "-"
                        )}
                    </td>


                    <!-- ITEM CODE -->

                    <td>
                        ${tags}
                    </td>


                    <!-- STATUS -->

                    <td>

                        ${
                            project.status
                                ? `
                                    <span
                                        class="project-status project-status-${status_class}">

                                        ${frappe.utils.escape_html(
                                            project.status
                                        )}

                                    </span>
                                `
                                : "-"
                        }

                    </td>


                    <!-- PROJECT TYPE -->

                    <td>
                        ${frappe.utils.escape_html(
                            project.project_type || "-"
                        )}
                    </td>


                    <!-- PRIORITY -->

                    <td>
                        ${frappe.utils.escape_html(
                            project.priority || "-"
                        )}
                    </td>


                    <!-- FISCAL YEAR -->

                    <td>
                        ${frappe.utils.escape_html(
                            project.fiscal_year || "-"
                        )}
                    </td>


                    <!-- BASIC VALUE -->

                    <td class="text-right">

                        ${format_currency(
                            project.basic_value || 0
                        )}

                    </td>


                    <!-- TAXES -->

                    <td class="text-right">

                        ${format_currency(
                            project.taxes || 0
                        )}

                    </td>


                    <!-- OVERALL VALUE -->

                    <td class="text-right">

                        ${format_currency(
                            project.purchase_value || 0
                        )}

                    </td>

                </tr>
            `);
        });
    }


    // =========================================================
    // LOAD MORE
    // =========================================================

    function update_load_more(total_count) {

        if (current_limit === "all") {

            $("#project-load-more").hide();

            return;
        }


        const displayed_count =
            $("#project-table-body tr").length;


        if (displayed_count >= total_count) {

            $("#project-load-more").hide();

        } else {

            $("#project-load-more").show();
        }
    }


    // =========================================================
    // APPLY FILTER
    // =========================================================

    $("#project-filter-btn").on(
        "click",
        function () {

            current_limit = 20;

            load_dashboard(true);
        }
    );


    // =========================================================
    // RESET FILTER
    // =========================================================

    $("#project-reset-btn").on(
        "click",
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


    // =========================================================
    // PAGE SIZE
    // =========================================================

    $(document).on(
        "change",
        "#project-page-size",
        function () {

            const value =
                $(this).val();


            current_limit =
                value === "all"
                    ? "all"
                    : parseInt(value);


            current_offset = 0;

            load_dashboard(true);
        }
    );


    // =========================================================
    // LOAD MORE
    // =========================================================

    $(document).on(
        "click",
        "#project-load-more",
        function () {

            current_offset +=
                current_limit;


            frappe.call({

                method:
                    "erp_custom.erp_custom.page.project_dashboard.project_dashboard.get_project_dashboard_data",

                args: {

                    filters:
                        JSON.stringify(
                            current_filters
                        ),

                    limit:
                        current_limit,

                    offset:
                        current_offset
                },

                callback: function (r) {

                    if (!r.message) {
                        return;
                    }


                    append_project_rows(
                        r.message.projects || []
                    );


                    update_load_more(
                        r.message.total_projects || 0
                    );
                }
            });
        }
    );


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    load_filter_options();

    load_dashboard(true);
};