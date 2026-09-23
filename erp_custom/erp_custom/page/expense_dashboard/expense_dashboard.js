// frappe.pages['expense-dashboard'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'None',
// 		single_column: true
// 	});
// }





// frappe.pages['expense-dashboard'].on_page_load = function (wrapper) {
//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: 'Expense Claim Dashboard',
//         single_column: true
//     });

//     $(wrapper).find('.layout-main').html(`
//     <style>
//         .ed-wrap {
//             --ed-blue: #2563eb;
//             --ed-blue-dark: #1d4ed8;
//             --ed-blue-soft: #eff6ff;
//             --ed-blue-line: #bfdbfe;
//             --ed-text: #1f2937;
//             --ed-muted: #6b7280;
//             --ed-border: #e5e7eb;
//             --ed-gap: 16px;
//             font-family: inherit;
//             color: var(--ed-text);
//             max-width: 1400px;
//             width: 100%;
//             flex: 1 1 100%;
//             min-width: 0;
//             margin: 0 auto;
//             padding: 16px 12px 32px;
//             container-type: inline-size;
//             container-name: ed;
//         }
//         .ed-wrap * { box-sizing: border-box; }
//         .ta-l { text-align: left !important; }

//         .ed-card {
//             background: #fff;
//             border: 1px solid var(--ed-border);
//             border-radius: 14px;
//             box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
//             margin-bottom: 20px;
//         }
//         .ed-card.clip { overflow: hidden; }

//         .theme-overall { --hdr:#2563eb; --line:#2563eb; --soft:#eff6ff; --link:#1d4ed8; --stripe:#f5f9ff; --hover:#e6f0ff; }

//         .ed-card-header {
//             background: var(--hdr, var(--ed-blue));
//             color: #fff;
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
//         .ed-card-body { padding: 18px; }

//         /* ===== FILTER PANEL ===== */
//         .ed-filter-grid {
//             display: grid;
//             grid-template-columns: minmax(0, 1fr);
//             gap: var(--ed-gap);
//             align-items: center;
//         }
//         .ed-filter-cell { position: relative; min-width: 0; }
//         .ed-filter-cell .frappe-control,
//         .ed-filter-cell .form-group { margin: 0 !important; }
//         .ed-filter-cell .control-label,
//         .ed-filter-cell .clearfix,
//         .ed-filter-cell .help-box { display: none !important; }
//         .ed-filter-cell .form-control,
//         .ed-filter-cell .multiselect-list .form-control {
//             height: 38px;
//             font-size: 13px;
//             border-radius: 8px;
//             border: 1px solid var(--ed-border);
//             background: #fff;
//             display: flex;
//             align-items: center;
//         }
//         .ed-filter-cell input.form-control { display: block; }
//         .ed-filter-cell .form-control:focus,
//         .ed-filter-cell .multiselect-list.open .form-control {
//             border-color: var(--ed-blue);
//             box-shadow: 0 0 0 3px rgba(37, 99, 235, .15);
//         }
//         .ed-filter-cell .multiselect-list .dropdown-menu,
//         .awesomplete > ul { z-index: 2000 !important; }
//         .ed-filter-cell.is-empty .status-text { color: #9ca3af; }

//         .ed-filter-actions {
//             grid-column: 1 / -1;
//             display: flex;
//             justify-content: flex-end;
//             align-items: center;
//             gap: 10px;
//         }
//         .ed-icon-btn {
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
//         .ed-icon-btn.primary { background: var(--ed-blue); border: 1px solid var(--ed-blue); color: #fff; }
//         .ed-icon-btn.primary:hover { background: var(--ed-blue-dark); }
//         .ed-icon-btn.ghost { background: #fff; border: 1px solid var(--ed-blue); color: var(--ed-blue); }
//         .ed-icon-btn.ghost:hover { background: var(--ed-blue-soft); }

//         /* ===== KPI CARDS ===== */
//         .ed-kpi-grid { display: grid; gap: var(--ed-gap); margin-bottom: var(--ed-gap); grid-template-columns: repeat(2, minmax(0, 1fr)); }
//         .ed-kpi {
//             position: relative;
//             overflow: hidden;
//             background: var(--k-bg, #fff);
//             border: 1px solid transparent;
//             border-radius: 14px;
//             padding: 16px 16px 14px;
//             box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
//             transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
//             min-height: 100px;
//             display: flex;
//             flex-direction: column;
//             justify-content: space-between;
//         }
//         .ed-kpi.clickable { cursor: pointer; }
//         .ed-kpi.clickable:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 6px 16px rgba(0, 0, 0, .10);
//             border-color: var(--k);
//         }
//         .ed-kpi-icon {
//             position: absolute;
//             top: 0; right: 0;
//             width: 46px; height: 46px;
//             display: flex; align-items: center; justify-content: center;
//             background: var(--k, var(--ed-blue));
//             color: #fff;
//             font-size: 18px;
//             border-radius: 0 14px 0 14px;
//         }
//         .ed-kpi-title {
//             font-size: 13px;
//             font-weight: 600;
//             color: #1f2937;
//             letter-spacing: .2px;
//             padding-right: 50px;
//             line-height: 1.3;
//         }
//         .ed-kpi-value {
//             font-size: 26px;
//             font-weight: 700;
//             color: var(--k, var(--ed-text));
//             line-height: 1.1;
//             margin-top: 12px;
//         }

//         /* ===== TABLE ===== */
//         .ed-table-wrap { width: 100%; overflow-x: auto; }
//         .ed-table-wrap.tall { max-height: 500px; overflow-y: auto; }
//         .ed-table-wrap table {
//             width: max-content;
//             min-width: 100%;
//             white-space: nowrap;
//             margin-bottom: 0;
//             font-variant-numeric: tabular-nums;
//         }
//         .ed-table-wrap thead th {
//             position: sticky; top: 0; z-index: 10;
//             background: #f8fafc;
//             font-weight: 700;
//             font-size: 13px;
//             color: #374151;
//             text-align: center;
//             border-bottom: 2px solid var(--ed-border);
//             padding: 10px 14px;
//         }
//         .ed-table-wrap tbody td {
//             font-size: 13px;
//             vertical-align: middle;
//             text-align: center;
//             border-color: #f1f5f9;
//             padding: 10px 14px;
//         }
//         .ed-card .ed-table-wrap tbody tr:nth-child(even) { background: var(--stripe, transparent); }
//         .ed-card .ed-table-wrap tbody tr:hover { background: var(--hover, #f8fafc); }
//         .ed-table-wrap tfoot td {
//             background: var(--soft, var(--ed-blue-soft));
//             border-top: 2px solid var(--line, var(--ed-blue));
//             font-weight: 700;
//             font-size: 13px;
//             padding: 12px 14px;
//             text-align: center;
//         }
//         .ed-table-wrap a { color: var(--link, var(--ed-blue-dark)); font-weight: 500; }

//         .ed-pager {
//             display: flex; justify-content: space-between; align-items: center;
//             flex-wrap: wrap; gap: 10px;
//             padding: 12px 18px;
//             border-top: 1px solid var(--ed-border);
//             background: #f9fafb;
//             border-radius: 0 0 14px 14px;
//         }
//         .ed-size-group { display: inline-flex; }
//         .ed-size-btn {
//             border: 1px solid var(--ed-blue);
//             background: #fff; color: var(--ed-blue);
//             font-size: 13px; font-weight: 600;
//             padding: 5px 14px; cursor: pointer;
//             margin-left: -1px;
//         }
//         .ed-size-btn:first-child { border-radius: 8px 0 0 8px; margin-left: 0; }
//         .ed-size-btn:last-child { border-radius: 0 8px 8px 0; }
//         .ed-size-btn.active { background: var(--ed-blue); color: #fff; }
//         .ed-btn {
//             background: var(--ed-blue); color: #fff; border: 1px solid var(--ed-blue);
//             border-radius: 8px; font-size: 13px; font-weight: 600;
//             padding: 6px 16px; cursor: pointer;
//         }
//         .ed-btn:hover { background: var(--ed-blue-dark); }

//         .ed-badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 8px; border: 1px solid transparent; font-size: 12px; font-weight: 600; white-space: nowrap; }
//         .ed-bdot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }

//         @keyframes spin { to { transform: rotate(360deg); } }

//         @media (max-width: 575px) { .ed-wrap { padding: 12px 8px 24px; } }

//         @container ed (min-width: 520px) {
//             .ed-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//             .ed-kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
//         }
//         @container ed (min-width: 820px) {
//             .ed-filter-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
//             .ed-filter-actions { grid-column: 3 / -1; }
//         }
//         @container ed (min-width: 1000px) {
//             .ed-kpi-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
//         }
//         @container ed (max-width: 560px) {
//             .ed-card-header { font-size: 14px; padding: 11px 14px; }
//             .ed-card-body { padding: 14px 12px; }
//             .ed-kpi { padding: 14px 12px; min-height: 92px; }
//             .ed-kpi-title { font-size: 12px; }
//             .ed-kpi-value { font-size: 22px; }
//             .ed-table-wrap thead th, .ed-table-wrap tbody td, .ed-table-wrap tfoot td { padding: 8px 10px; font-size: 12px; }
//             .ed-pager { padding: 10px 12px; }
//         }
//         @container ed (max-width: 330px) {
//             .ed-kpi-grid { grid-template-columns: minmax(0, 1fr); }
//         }
//     </style>

//     <div class="ed-wrap">

//         <!-- FILTERS -->
//         <div class="ed-card">
//             <div class="ed-card-header" style="justify-content:flex-start;">
//                 <i class="fa fa-search"></i> Filter Expense Claims
//             </div>
//             <div class="ed-card-body">
//                 <div class="ed-filter-grid" id="ed_filter_grid">
//                     <div class="ed-filter-actions" id="ed_filter_actions">
//                         <button class="ed-icon-btn primary" id="ed_apply" title="Apply Filters"><i class="fa fa-filter"></i></button>
//                         <button class="ed-icon-btn ghost" id="ed_reset" title="Refresh Dashboard"><i class="fa fa-refresh"></i></button>
//                     </div>
//                 </div>
//             </div>
//         </div>

//         <!-- KPI CARDS -->
//         <div class="ed-kpi-grid" id="ed_kpi_row"></div>

//         <!-- FULL EXPENSE CLAIM TABLE -->
//         <div class="ed-card clip theme-overall">
//             <div class="ed-card-header"><i class="fa fa-list"></i> Overall Expense Claims</div>
//             <div class="ed-table-wrap tall">
//                 <table class="table table-hover align-middle">
//                     <thead>
//                         <tr>
//                             <th class="ta-l">Expense Claim ID</th>
//                             <th class="ta-l">Employee Name</th>
//                             <th>Status</th>
//                             <th>Grand Total</th>
//                         </tr>
//                     </thead>
//                     <tbody id="ed_table_body"></tbody>
//                     <tfoot>
//                         <tr>
//                             <td class="ta-l" colspan="3">
//                                 Overall Claims : <span id="ed_full_count">0</span>
//                                 <span style="font-weight:400;color:var(--ed-muted);">&nbsp;(Showing <span id="ed_full_shown">0</span>)</span>
//                             </td>
//                             <td>Grand Total<br><span id="ed_full_total_amount">0.00</span></td>
//                         </tr>
//                     </tfoot>
//                 </table>
//             </div>
//             <div class="ed-pager">
//                 <div class="ed-size-group" id="ed_page_size_group">
//                     <button class="ed-size-btn active ed-page-size-btn" data-size="20">20</button>
//                     <button class="ed-size-btn ed-page-size-btn" data-size="100">100</button>
//                     <button class="ed-size-btn ed-page-size-btn" data-size="500">500</button>
//                     <button class="ed-size-btn ed-page-size-btn" data-size="2500">All</button>
//                 </div>
//                 <button class="ed-btn" id="ed_load_more">Load More</button>
//             </div>
//         </div>
//     </div>
//     `);

//     // ---------------------- FILTER CONTROLS ----------------------
//     const link_options = doctype => txt => frappe.db.get_link_options(doctype, txt);
//     const static_options = list => () => list.map(v => ({ value: v, description: "" }));

//     const FILTER_DEFS = [
//         { key: "employee",       ph: "Employee ID / Name", get_data: link_options("Employee") },
//         { key: "department",     ph: "Department",         get_data: link_options("Department") },
//         { key: "employee_type",  ph: "Employee Type",      get_data: link_options("Employee Type") },
//         { key: "workflow_state", ph: "Status",             get_data: static_options(["Draft", "Finance Review", "Approved"]) }
//     ];

//     let filters = {};
//     let painters = {};
//     const EMPTY_RE = /^(no values? selected|select\b.*|none|--)$/i;

//     FILTER_DEFS.forEach(def => {
//         const $cell = $('<div class="ed-filter-cell"></div>').insertBefore($(wrapper).find("#ed_filter_actions"));

//         let df = {
//             fieldname: def.key,
//             label: def.ph,
//             placeholder: def.ph,
//             fieldtype: "MultiSelectList",
//             get_data: def.get_data
//         };

//         filters[def.key] = frappe.ui.form.make_control({ parent: $cell, df: df, render_input: true });

//         let empty_text = null;
//         const paint = () => {
//             const st = $cell.find(".status-text")[0];
//             if (!st) return;
//             const t = (st.textContent || "").trim();
//             if (empty_text === null && t !== "") empty_text = t;
//             if (t === def.ph) { $cell.addClass("is-empty"); return; }
//             if (t === "" || t === empty_text || EMPTY_RE.test(t)) {
//                 st.textContent = def.ph;
//                 $cell.addClass("is-empty");
//             } else {
//                 $cell.removeClass("is-empty");
//             }
//         };
//         painters[def.key] = paint;
//         new MutationObserver(paint).observe($cell[0], { childList: true, subtree: true, characterData: true });
//         paint();
//     });

//     function collect_filters(extra) {
//         let f = {};
//         Object.keys(filters).forEach(k => { f[k] = filters[k].get_value() || []; });
//         return Object.assign(f, extra || {});
//     }

//     // ---------------------- DATA LOADING ----------------------
//     let page_size = 20;
//     let offset = 0;
//     let full_names = [];
//     let full_total_amount = 0;

//     function load_data(load_more = false) {
//         frappe.call({
//             method: "erp_custom.erp_custom.page.expense_dashboard.expense_dashboard.get_dashboard_data",
//             args: { filters: collect_filters({ limit: page_size, offset: offset }) },
//             callback: function (r) {
//                 let data = r.message || {};
//                 render_kpis(data);
//                 render_table(data.rows || [], load_more);
//                 $("#ed_full_count").text(data.total_claims || 0);
//                 $("#ed_full_shown").text(full_names.length);
//             }
//         });
//     }

//     // ---------------------- KPI CARDS ----------------------
//     function render_kpis(data) {
//         let status_map = { "Draft": 0, "Finance Review": 0, "Approved": 0 };
//         Object.assign(status_map, data.status_counts || {});

//         $("#ed_kpi_row").html(`
//             ${kpiCard("Total Claims", data.total_claims || 0, "fa-file-text-o", "#4F46E5", "#E0E7FF")}
//             ${kpiAmountCard("Total Amount", data.total_amount || 0, "fa-inr", "#2563EB", "#DBEAFE")}
//             ${kpiCard("Draft", status_map["Draft"], "fa-pencil-square-o", "#F59E0B", "#FEF3C7", "Draft")}
//             ${kpiCard("Finance Review", status_map["Finance Review"], "fa-money", "#8B5CF6", "#EDE9FE", "Finance Review")}
//             ${kpiCard("Approved", status_map["Approved"], "fa-check-circle", "#22C55E", "#DCFCE7", "Approved")}
//         `);
//     }

//     function kpiCard(title, value, icon, accent, bg, status) {
//         const click = status ? `onclick="open_expense_claim_list('${status}')"` : "";
//         return `
//             <div class="ed-kpi ${status ? "clickable" : ""}" style="--k:${accent};--k-bg:${bg};" ${click}>
//                 <div class="ed-kpi-icon"><i class="fa ${icon}"></i></div>
//                 <div class="ed-kpi-title">${title}</div>
//                 <div class="ed-kpi-value">${value || 0}</div>
//             </div>`;
//     }

//     function kpiAmountCard(title, amount, icon, accent, bg) {
//         return `
//             <div class="ed-kpi" style="--k:${accent};--k-bg:${bg};">
//                 <div class="ed-kpi-icon"><i class="fa ${icon}"></i></div>
//                 <div class="ed-kpi-title">${title}</div>
//                 <div class="ed-kpi-value" style="font-size:20px;">${frappe.format(amount || 0, { fieldtype: "Currency" })}</div>
//             </div>`;
//     }

//     window.open_expense_claim_list = function (status) {
//         frappe.route_options = { workflow_state: status };
//         frappe.set_route("List", "Expense Claim");
//     };

//     // ---------------------- TABLE ----------------------
//     const cur = v => frappe.format(v, { fieldtype: "Currency" });
//     const esc = frappe.utils.escape_html;

//     const STATUS_STYLE = {
//         "Draft":           ["#FEF3C7", "#B45309", "#F59E0B"],
//         "Finance Review":  ["#EDE9FE", "#6D28D9", "#8B5CF6"],
//         "Approved":        ["#DCFCE7", "#15803D", "#22C55E"]
//     };
//     function status_badge(st) {
//         st = st || "Draft";
//         const [bg, fg, bd] = STATUS_STYLE[st] || ["#F1F5F9", "#475569", "#64748B"];
//         return `<span class="ed-badge" style="background:${bg};color:${fg};border-color:${bd}66"><i class="ed-bdot" style="background:${bd}"></i>${esc(st)}</span>`;
//     }

//     function render_table(rows, append = false) {
//         rows = rows || [];
//         $("#ed_load_more").toggle(rows.length >= page_size);

//         if (!append) {
//             full_names = [];
//             full_total_amount = 0;
//         }

//         if (!rows.length) {
//             if (!append) {
//                 $("#ed_table_body").html(`<tr><td colspan="4" style="color:var(--ed-muted);padding:16px;">No Expense Claims found for the selected filters.</td></tr>`);
//                 $("#ed_full_total_amount").html(cur(0));
//             }
//             return;
//         }

//         let html = "";
//         rows.forEach(r => {
//             let grand_total = Number(r.grand_total || 0);
//             full_names.push(r.name);
//             full_total_amount += grand_total;

//             html += `<tr>
//                 <td class="ta-l"><a href="/app/expense-claim/${r.name}" target="_blank">${esc(r.name)}</a></td>
//                 <td class="ta-l">${esc(r.employee_name || "-")}</td>
//                 <td>${status_badge(r.workflow_state)}</td>
//                 <td>${cur(grand_total)}</td>
//             </tr>`;
//         });

//         if (append) $("#ed_table_body").append(html);
//         else $("#ed_table_body").html(html);

//         $("#ed_full_total_amount").html(cur(full_total_amount));
//     }

//     // ---------------------- EVENTS ----------------------
//     const NS = ".expense_dash";
//     $(document).off(NS);

//     $(document).on("click" + NS, "#ed_apply", function () {
//         const icon = $(this).find("i");
//         icon.addClass("fa-spin");
//         offset = 0;
//         load_data();
//         setTimeout(() => icon.removeClass("fa-spin"), 500);
//     });

//     $(document).on("click" + NS, "#ed_reset", function () {
//         const icon = $(this).find("i");
//         icon.addClass("fa-spin");
//         FILTER_DEFS.forEach(def => filters[def.key].set_value([]));
//         offset = 0;
//         setTimeout(() => {
//             Object.values(painters).forEach(fn => fn());
//             load_data();
//             icon.removeClass("fa-spin");
//         }, 300);
//     });

//     $(document).on("click" + NS, ".ed-page-size-btn", function () {
//         $(".ed-page-size-btn").removeClass("active");
//         $(this).addClass("active");
//         page_size = parseInt($(this).data("size"));
//         offset = 0;
//         load_data();
//     });

//     $(document).on("click" + NS, "#ed_load_more", function () {
//         offset += page_size;
//         load_data(true);
//     });

//     load_data();
// };



frappe.pages['expense-dashboard'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Expense Claim Dashboard',
        single_column: true
    });

    $(wrapper).find('.layout-main').html(`
    <style>
        .ed-wrap {
            --ed-teal: #0d9488;
            --ed-teal-dark: #0f766e;
            --ed-teal-soft: #f0fdfa;
            --ed-teal-line: #99f6e4;
            --ed-text: #1f2937;
            --ed-muted: #6b7280;
            --ed-border: #e5e7eb;
            --ed-gap: 16px;
            font-family: inherit;
            color: var(--ed-text);
            max-width: 1400px;
            width: 100%;
            flex: 1 1 100%;
            min-width: 0;
            margin: 0 auto;
            padding: 16px 12px 32px;
            container-type: inline-size;
            container-name: ed;
        }
        .ed-wrap * { box-sizing: border-box; }
        .ta-l { text-align: left !important; }

        .ed-card {
            background: #fff;
            border: 1px solid var(--ed-border);
            border-radius: 14px;
            box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
            margin-bottom: 20px;
        }
        .ed-card.clip { overflow: hidden; }

        .theme-overall { --hdr:#0d9488; --line:#0d9488; --soft:#f0fdfa; --link:#0f766e; --stripe:#f2fbfa; --hover:#e3f7f4; }

        .ed-card-header {
            background: var(--hdr, var(--ed-teal));
            color: #fff;
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
        .ed-card-body { padding: 18px; }

        /* ===== FILTER PANEL ===== */
        .ed-filter-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr);
            gap: var(--ed-gap);
            align-items: center;
        }
        .ed-filter-cell { position: relative; min-width: 0; }
        .ed-filter-cell .frappe-control,
        .ed-filter-cell .form-group { margin: 0 !important; }
        .ed-filter-cell .control-label,
        .ed-filter-cell .clearfix,
        .ed-filter-cell .help-box { display: none !important; }
        .ed-filter-cell .form-control,
        .ed-filter-cell .multiselect-list .form-control {
            height: 38px;
            font-size: 13px;
            border-radius: 8px;
            border: 1px solid var(--ed-border);
            background: #fff;
            display: flex;
            align-items: center;
        }
        .ed-filter-cell input.form-control { display: block; }
        .ed-filter-cell .form-control:focus,
        .ed-filter-cell .multiselect-list.open .form-control {
            border-color: var(--ed-teal);
            box-shadow: 0 0 0 3px rgba(13, 148, 136, .15);
        }
        .ed-filter-cell .multiselect-list .dropdown-menu,
        .awesomplete > ul { z-index: 2000 !important; }
        .ed-filter-cell.is-empty .status-text { color: #9ca3af; }

        .ed-filter-actions {
            grid-column: 1 / -1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 10px;
        }
        .ed-icon-btn {
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
        .ed-icon-btn.primary { background: var(--ed-teal); border: 1px solid var(--ed-teal); color: #fff; }
        .ed-icon-btn.primary:hover { background: var(--ed-teal-dark); }
        .ed-icon-btn.ghost { background: #fff; border: 1px solid var(--ed-teal); color: var(--ed-teal); }
        .ed-icon-btn.ghost:hover { background: var(--ed-teal-soft); }

        /* ===== KPI CARDS ===== */
        .ed-kpi-grid { display: grid; gap: var(--ed-gap); margin-bottom: var(--ed-gap); grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .ed-kpi {
            position: relative;
            overflow: hidden;
            background: var(--k-bg, #fff);
            border: 1px solid transparent;
            border-radius: 14px;
            padding: 16px 16px 14px;
            box-shadow: 0 1px 3px rgba(16, 24, 40, .06);
            transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
            min-height: 100px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .ed-kpi.clickable { cursor: pointer; }
        .ed-kpi.clickable:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, .10);
            border-color: var(--k);
        }
        .ed-kpi-icon {
            position: absolute;
            top: 0; right: 0;
            width: 46px; height: 46px;
            display: flex; align-items: center; justify-content: center;
            background: var(--k, var(--ed-teal));
            color: #fff;
            font-size: 18px;
            border-radius: 0 14px 0 14px;
        }
        .ed-kpi-title {
            font-size: 13px;
            font-weight: 600;
            color: #1f2937;
            letter-spacing: .2px;
            padding-right: 50px;
            line-height: 1.3;
        }
        .ed-kpi-value {
            font-size: 26px;
            font-weight: 700;
            color: var(--k, var(--ed-text));
            line-height: 1.1;
            margin-top: 12px;
        }

        /* ===== TABLE ===== */
        .ed-table-wrap { width: 100%; overflow-x: auto; }
        .ed-table-wrap.tall { max-height: 500px; overflow-y: auto; }
        .ed-table-wrap table {
            width: max-content;
            min-width: 100%;
            white-space: nowrap;
            margin-bottom: 0;
            font-variant-numeric: tabular-nums;
        }
        .ed-table-wrap thead th {
            position: sticky; top: 0; z-index: 10;
            background: #f8fafc;
            font-weight: 700;
            font-size: 13px;
            color: #374151;
            text-align: center;
            border-bottom: 2px solid var(--ed-border);
            padding: 10px 14px;
        }
        .ed-table-wrap tbody td {
            font-size: 13px;
            vertical-align: middle;
            text-align: center;
            border-color: #f1f5f9;
            padding: 10px 14px;
        }
        .ed-card .ed-table-wrap tbody tr:nth-child(even) { background: var(--stripe, transparent); }
        .ed-card .ed-table-wrap tbody tr:hover { background: var(--hover, #f8fafc); }
        .ed-table-wrap tfoot td {
            background: var(--soft, var(--ed-teal-soft));
            border-top: 2px solid var(--line, var(--ed-teal));
            font-weight: 700;
            font-size: 13px;
            padding: 12px 14px;
            text-align: center;
        }
        .ed-table-wrap a { color: var(--link, var(--ed-teal-dark)); font-weight: 500; }

        .ed-id-cell { display: inline-flex; align-items: center; gap: 6px; }
        .ed-preview-btn { display: inline-flex; width: 18px; justify-content: center; cursor: pointer; color: var(--ed-teal-dark); }
        .ed-preview-btn:hover { color: var(--ed-teal); }

        .ed-pager {
            display: flex; justify-content: space-between; align-items: center;
            flex-wrap: wrap; gap: 10px;
            padding: 12px 18px;
            border-top: 1px solid var(--ed-border);
            background: #f9fafb;
            border-radius: 0 0 14px 14px;
        }
        .ed-size-group { display: inline-flex; }
        .ed-size-btn {
            border: 1px solid var(--ed-teal);
            background: #fff; color: var(--ed-teal);
            font-size: 13px; font-weight: 600;
            padding: 5px 14px; cursor: pointer;
            margin-left: -1px;
        }
        .ed-size-btn:first-child { border-radius: 8px 0 0 8px; margin-left: 0; }
        .ed-size-btn:last-child { border-radius: 0 8px 8px 0; }
        .ed-size-btn.active { background: var(--ed-teal); color: #fff; }
        .ed-btn {
            background: var(--ed-teal); color: #fff; border: 1px solid var(--ed-teal);
            border-radius: 8px; font-size: 13px; font-weight: 600;
            padding: 6px 16px; cursor: pointer;
        }
        .ed-btn:hover { background: var(--ed-teal-dark); }

        .ed-badge { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 8px; border: 1px solid transparent; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .ed-bdot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }

        /* ===== PREVIEW DIALOG ===== */
        .ed-nav-btns { display: inline-flex; gap: 6px; margin-left: 12px; vertical-align: middle; }
        .ed-nav-btns button { width: 28px; height: 28px; padding: 0; border-radius: 6px; border: 1px solid var(--ed-border); background: #fff; color: var(--ed-teal-dark); cursor: pointer; }
        .ed-nav-btns button:hover:not(:disabled) { background: var(--ed-teal-soft); border-color: var(--ed-teal); }
        .ed-nav-btns button:disabled { opacity: .35; cursor: not-allowed; }

        .ed-preview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px 16px;
            padding: 14px 16px;
            background: var(--ed-teal-soft);
            border: 1px solid var(--ed-teal-line);
            border-radius: 10px;
            margin-bottom: 16px;
        }
        .ed-preview-grid > div { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ed-preview-grid span { font-size: 11px; text-transform: uppercase; letter-spacing: .4px; color: var(--ed-muted); }
        .ed-preview-grid b { font-size: 14px; color: #1f2937; overflow-wrap: anywhere; }
        .ed-preview-table-wrap { width: 100%; overflow-x: auto; }
        .ed-preview-table-wrap table { width: 100%; min-width: 620px; font-size: 12.5px; }
        .ed-preview-table-wrap thead th { background: #f8fafc; text-align: center; padding: 8px 10px; white-space: nowrap; }
        .ed-preview-table-wrap tbody td { padding: 8px 10px; vertical-align: middle; }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 575px) { .ed-wrap { padding: 12px 8px 24px; } }

        @container ed (min-width: 520px) {
            .ed-filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .ed-kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @container ed (min-width: 820px) {
            .ed-filter-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
            .ed-filter-actions { grid-column: 3 / -1; }
        }
        @container ed (min-width: 1000px) {
            .ed-kpi-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        }
        @container ed (max-width: 560px) {
            .ed-card-header { font-size: 14px; padding: 11px 14px; }
            .ed-card-body { padding: 14px 12px; }
            .ed-kpi { padding: 14px 12px; min-height: 92px; }
            .ed-kpi-title { font-size: 12px; }
            .ed-kpi-value { font-size: 22px; }
            .ed-table-wrap thead th, .ed-table-wrap tbody td, .ed-table-wrap tfoot td { padding: 8px 10px; font-size: 12px; }
            .ed-pager { padding: 10px 12px; }
        }
        @container ed (max-width: 330px) {
            .ed-kpi-grid { grid-template-columns: minmax(0, 1fr); }
        }
    </style>

    <div class="ed-wrap">

        <!-- FILTERS -->
        <div class="ed-card">
            <div class="ed-card-header" style="justify-content:flex-start;">
                <i class="fa fa-search"></i> Filter Expense Claims
            </div>
            <div class="ed-card-body">
                <div class="ed-filter-grid" id="ed_filter_grid">
                    <div class="ed-filter-actions" id="ed_filter_actions">
                        <button class="ed-icon-btn primary" id="ed_apply" title="Apply Filters"><i class="fa fa-filter"></i></button>
                        <button class="ed-icon-btn ghost" id="ed_reset" title="Refresh Dashboard"><i class="fa fa-refresh"></i></button>
                    </div>
                </div>
            </div>
        </div>

        <!-- KPI CARDS -->
        <div class="ed-kpi-grid" id="ed_kpi_row"></div>

        <!-- FULL EXPENSE CLAIM TABLE -->
        <div class="ed-card clip theme-overall">
            <div class="ed-card-header"><i class="fa fa-list"></i> Overall Expense Claims</div>
            <div class="ed-table-wrap tall">
                <table class="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th class="ta-l">Expense Claim ID</th>
                            <th class="ta-l">Employee Name</th>
                            <th>Status</th>
                            <th>Grand Total</th>
                        </tr>
                    </thead>
                    <tbody id="ed_table_body"></tbody>
                    <tfoot>
                        <tr>
                            <td class="ta-l" colspan="3">
                                Overall Claims : <span id="ed_full_count">0</span>
                                <span style="font-weight:400;color:var(--ed-muted);">&nbsp;(Showing <span id="ed_full_shown">0</span>)</span>
                            </td>
                            <td>Grand Total<br><span id="ed_full_total_amount">0.00</span></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="ed-pager">
                <div class="ed-size-group" id="ed_page_size_group">
                    <button class="ed-size-btn active ed-page-size-btn" data-size="20">20</button>
                    <button class="ed-size-btn ed-page-size-btn" data-size="100">100</button>
                    <button class="ed-size-btn ed-page-size-btn" data-size="500">500</button>
                    <button class="ed-size-btn ed-page-size-btn" data-size="2500">All</button>
                </div>
                <button class="ed-btn" id="ed_load_more">Load More</button>
            </div>
        </div>
    </div>
    `);

    // ---------------------- FILTER CONTROLS ----------------------
    const link_options = doctype => txt => frappe.db.get_link_options(doctype, txt);
    const static_options = list => () => list.map(v => ({ value: v, description: "" }));

    const FILTER_DEFS = [
        { key: "employee",        ph: "Employee ID / Name", get_data: link_options("Employee") },
        { key: "department",      ph: "Department",         get_data: link_options("Department") },
        { key: "expense_type",    ph: "Expense Type",       get_data: link_options("Expense Claim Type") },
        { key: "approval_status", ph: "Status",              get_data: static_options(["Draft", "Finance Review", "Approved"]) }
    ];

    let filters = {};
    let painters = {};
    const EMPTY_RE = /^(no values? selected|select\b.*|none|--)$/i;

    FILTER_DEFS.forEach(def => {
        const $cell = $('<div class="ed-filter-cell"></div>').insertBefore($(wrapper).find("#ed_filter_actions"));

        let df = {
            fieldname: def.key,
            label: def.ph,
            placeholder: def.ph,
            fieldtype: "MultiSelectList",
            get_data: def.get_data
        };

        filters[def.key] = frappe.ui.form.make_control({ parent: $cell, df: df, render_input: true });

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
    });

    function collect_filters(extra) {
        let f = {};
        Object.keys(filters).forEach(k => { f[k] = filters[k].get_value() || []; });
        return Object.assign(f, extra || {});
    }

    // ---------------------- DATA LOADING ----------------------
    let page_size = 20;
    let offset = 0;
    let full_names = [];
    let full_total_amount = 0;

    function load_data(load_more = false) {
        frappe.call({
            method: "erp_custom.erp_custom.page.expense_dashboard.expense_dashboard.get_dashboard_data",
            args: { filters: collect_filters({ limit: page_size, offset: offset }) },
            callback: function (r) {
                let data = r.message || {};
                render_kpis(data);
                render_table(data.rows || [], load_more);
                $("#ed_full_count").text(data.total_claims || 0);
                $("#ed_full_shown").text(full_names.length);
            }
        });
    }

    // ---------------------- KPI CARDS ----------------------
    function render_kpis(data) {
        let status_map = { "Draft": 0, "Finance Review": 0, "Approved": 0 };
        Object.assign(status_map, data.status_counts || {});

        $("#ed_kpi_row").html(`
            ${kpiCard("Total Claims", data.total_claims || 0, "fa-file-text-o", "#4F46E5", "#E0E7FF")}
            ${kpiAmountCard("Total Amount", data.total_amount || 0, "fa-inr", "#0D9488", "#CCFBF1")}
            ${kpiCard("Draft", status_map["Draft"], "fa-pencil-square-o", "#F59E0B", "#FEF3C7", "Draft")}
            ${kpiCard("Finance Review", status_map["Finance Review"], "fa-money", "#8B5CF6", "#EDE9FE", "Finance Review")}
            ${kpiCard("Approved", status_map["Approved"], "fa-check-circle", "#22C55E", "#DCFCE7", "Approved")}
        `);
    }

    function kpiCard(title, value, icon, accent, bg, status) {
        const click = status ? `onclick="open_expense_claim_list('${status}')"` : "";
        return `
            <div class="ed-kpi ${status ? "clickable" : ""}" style="--k:${accent};--k-bg:${bg};" ${click}>
                <div class="ed-kpi-icon"><i class="fa ${icon}"></i></div>
                <div class="ed-kpi-title">${title}</div>
                <div class="ed-kpi-value">${value || 0}</div>
            </div>`;
    }

    function kpiAmountCard(title, amount, icon, accent, bg) {
        return `
            <div class="ed-kpi" style="--k:${accent};--k-bg:${bg};">
                <div class="ed-kpi-icon"><i class="fa ${icon}"></i></div>
                <div class="ed-kpi-title">${title}</div>
                <div class="ed-kpi-value" style="font-size:20px;">${frappe.format(amount || 0, { fieldtype: "Currency" })}</div>
            </div>`;
    }

    window.open_expense_claim_list = function (status) {
        frappe.route_options = { approval_status: status };
        frappe.set_route("List", "Expense Claim");
    };

    // ---------------------- TABLE ----------------------
    const cur = v => frappe.format(v, { fieldtype: "Currency" });
    const esc = frappe.utils.escape_html;

    const STATUS_STYLE = {
        "Draft":           ["#FEF3C7", "#B45309", "#F59E0B"],
        "Finance Review":  ["#EDE9FE", "#6D28D9", "#8B5CF6"],
        "Approved":        ["#DCFCE7", "#15803D", "#22C55E"]
    };
    function status_badge(st) {
        st = st || "Draft";
        const [bg, fg, bd] = STATUS_STYLE[st] || ["#F1F5F9", "#475569", "#64748B"];
        return `<span class="ed-badge" style="background:${bg};color:${fg};border-color:${bd}66"><i class="ed-bdot" style="background:${bd}"></i>${esc(st)}</span>`;
    }

    function render_table(rows, append = false) {
        rows = rows || [];
        $("#ed_load_more").toggle(rows.length >= page_size);

        if (!append) {
            full_names = [];
            full_total_amount = 0;
        }

        if (!rows.length) {
            if (!append) {
                $("#ed_table_body").html(`<tr><td colspan="4" style="color:var(--ed-muted);padding:16px;">No Expense Claims found for the selected filters.</td></tr>`);
                $("#ed_full_total_amount").html(cur(0));
            }
            return;
        }

        let html = "";
        rows.forEach(r => {
            let grand_total = Number(r.grand_total || 0);
            full_names.push(r.name);
            full_total_amount += grand_total;

            html += `<tr>
                <td class="ta-l">
                    <span class="ed-id-cell">
                        <span class="ed-preview-btn" data-name="${esc(r.name)}" title="Preview">${frappe.utils.icon("eye", "sm")}</span>
                        <a href="/app/expense-claim/${r.name}" target="_blank">${esc(r.name)}</a>
                    </span>
                </td>
                <td class="ta-l">${esc(r.employee_name || "-")}</td>
                <td>${status_badge(r.approval_status)}</td>
                <td>${cur(grand_total)}</td>
            </tr>`;
        });

        if (append) $("#ed_table_body").append(html);
        else $("#ed_table_body").html(html);

        $("#ed_full_total_amount").html(cur(full_total_amount));
    }

    // ---------------------- PREVIEW DIALOG (with Prev/Next) ----------------------
    function show_expense_preview(name) {
        frappe.call({
            method: "erp_custom.erp_custom.page.expense_dashboard.expense_dashboard.get_claim_preview",
            args: { name: name },
            freeze: true,
            callback: function (r) {
                if (!r.message) return;
                render_preview_dialog(r.message);
            }
        });
    }

    function render_preview_dialog(d) {
        const idx = full_names.indexOf(d.name);

        const expense_rows = (d.expenses || []).map(e => `
            <tr>
                <td class="ta-l">${frappe.datetime.str_to_user(e.expense_date) || "-"}</td>
                <td class="ta-l">${esc(e.expense_type || "-")}</td>
                <td class="ta-l">${esc(e.description || "-")}</td>
                <td class="ta-l">${esc(e.project || "-")}</td>
                <td>${cur(e.amount)}</td>
                <td>${cur(e.sanctioned_amount)}</td>
            </tr>`).join("");

        const body = `
            <div class="ed-preview-grid">
                <div><span>Employee</span><b>${esc(d.employee_name || d.employee || "-")}</b></div>
                <div><span>Date</span><b>${frappe.datetime.str_to_user(d.custom_date) || "-"}</b></div>
                <div><span>Department</span><b>${esc(d.department || "-")}</b></div>
                <div><span>Status</span><b>${status_badge(d.approval_status)}</b></div>
                <div><span>Grand Total</span><b>${cur(d.grand_total)}</b></div>
            </div>
            <div class="ed-preview-table-wrap">
                <table class="table table-bordered">
                    <thead>
                        <tr><th>Date</th><th>Expense Type</th><th>Description</th><th>Project</th><th>Amount</th><th>Sanctioned</th></tr>
                    </thead>
                    <tbody>${expense_rows || '<tr><td colspan="6" class="text-muted text-center">No expense rows</td></tr>'}</tbody>
                </table>
            </div>`;

        if (!window.ed_preview_dialog) {
            window.ed_preview_dialog = new frappe.ui.Dialog({
                title: "Expense Claim Preview",
                size: "large",
                fields: [{ fieldtype: "HTML", fieldname: "ed_preview_html" }]
            });
        }
        const dlg = window.ed_preview_dialog;

        dlg.set_title(`<a href="/app/expense-claim/${d.name}" target="_blank">${d.name}</a>`);
        dlg.fields_dict.ed_preview_html.$wrapper.html(body);

        dlg.$wrapper.find(".ed-nav-btns").remove();
        const nav = $(`
            <span class="ed-nav-btns">
                <button class="ed-prev-btn" title="Previous"><i class="fa fa-chevron-left"></i></button>
                <button class="ed-next-btn" title="Next"><i class="fa fa-chevron-right"></i></button>
            </span>`);
        nav.find(".ed-prev-btn").prop("disabled", idx <= 0)
            .on("click", () => { if (idx > 0) show_expense_preview(full_names[idx - 1]); });
        nav.find(".ed-next-btn").prop("disabled", idx < 0 || idx >= full_names.length - 1)
            .on("click", () => { if (idx < full_names.length - 1) show_expense_preview(full_names[idx + 1]); });

        dlg.$wrapper.find(".modal-title").after(nav);
        dlg.show();
    }

    // ---------------------- EVENTS ----------------------
    const NS = ".expense_dash";
    $(document).off(NS);

    $(document).on("click" + NS, ".ed-preview-btn", function (e) {
        e.preventDefault();
        e.stopPropagation();
        show_expense_preview($(this).data("name"));
    });

    $(document).on("click" + NS, "#ed_apply", function () {
        const icon = $(this).find("i");
        icon.addClass("fa-spin");
        offset = 0;
        load_data();
        setTimeout(() => icon.removeClass("fa-spin"), 500);
    });

    $(document).on("click" + NS, "#ed_reset", function () {
        const icon = $(this).find("i");
        icon.addClass("fa-spin");
        FILTER_DEFS.forEach(def => filters[def.key].set_value([]));
        offset = 0;
        setTimeout(() => {
            Object.values(painters).forEach(fn => fn());
            load_data();
            icon.removeClass("fa-spin");
        }, 300);
    });

    $(document).on("click" + NS, ".ed-page-size-btn", function () {
        $(".ed-page-size-btn").removeClass("active");
        $(this).addClass("active");
        page_size = parseInt($(this).data("size"));
        offset = 0;
        load_data();
    });

    $(document).on("click" + NS, "#ed_load_more", function () {
        offset += page_size;
        load_data(true);
    });

    load_data();
};