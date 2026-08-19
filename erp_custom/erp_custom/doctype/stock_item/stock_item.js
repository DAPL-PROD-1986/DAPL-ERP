// Copyright (c) 2026, maze and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Stock Item", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on("Stock Item", {

    refresh(frm) {

        calculate_weights(frm);

        // set_moc_filter(frm);

        add_download_button(frm);
        add_upload_button(frm);

        // New child table filter
        setTimeout(() => {
            init_stock_child_filters(frm);
        }, 300);

        show_reference_preview(frm);
    },


    onload_post_render(frm) {

        setTimeout(() => {
            init_stock_child_filters(frm);
        }, 300);

    },


    reference_image(frm) {

        show_reference_preview(frm);

    },


    validate(frm) {

        calculate_weights(frm);

    }

});

// function set_moc_filter(frm) {
//     let tables = ["plates", "pipes", "tubes", "flanges", "rods"];
//     tables.forEach(table => {
//         if (frm.fields_dict[table]) {
//             frm.fields_dict[table].grid.get_field("moc").get_query = function(doc, cdt, cdn) {
//                 let row = locals[cdt][cdn];
//                 return {
//                     filters: {
//                         type: row.type
//                     }
//                 };
//             };
//         }
//     });
// }

function add_stock_button_style() {
    if ($("#stock-button-style").length) return;
    $("head").append(`
    <style id="stock-button-style">
    .stock-download-btn,
    .stock-upload-btn {
        border:none !important;
        border-radius:10px !important;
        padding:0 !important;
        overflow:hidden;
        transition:0.3s;
    }

    .stock-btn-content {
        display:flex;
        align-items:center;
        gap:8px;
        padding:8px 18px;
        color:white;
        font-size:13px;
        font-weight:600;
    }

    .stock-btn-content svg {
        width:18px;
        height:18px;
        fill:none;
        stroke:white;
        stroke-width:2;
        stroke-linecap:round;
        stroke-linejoin:round;
    }

    /* Download Button */
    .stock-download-btn {
        background: linear-gradient(135deg, #2563eb, #4f46e5) !important;
    }

    .stock-download-btn:hover {
        transform:translateY(-2px);
        background: linear-gradient(135deg, #1d4ed8, #3730a3) !important;
    }

    /* Upload Button */
    .stock-upload-btn {
        background: linear-gradient(135deg, #059669, #0f766e) !important;
    }

    .stock-upload-btn:hover {
        transform:translateY(-2px);
        background: linear-gradient(135deg, #047857, #115e59) !important;
    }
    
    @media (max-width: 768px) {
    .stock-btn-content{background-color: green;}}
    </style>
    `);
}

function add_download_button(frm) {
    add_stock_button_style();

    let btn = frm.add_custom_button(`
        <span class="stock-btn-content">
            <svg viewBox="0 0 24 24">
                <path d="M12 4v10"/>
                <path d="M7 10l5 5 5-5"/>
                <rect x="5" y="18" width="14" height="2"/>
            </svg> Download </span>`, () => {
        show_download_dialog(frm);
    });
    btn.addClass("stock-download-btn");
}

function add_upload_button(frm) {
    add_stock_button_style();

    let btn = frm.add_custom_button(`
        <span class="stock-btn-content">
            <svg viewBox="0 0 24 24">
                <path d="M12 15V3"/>
                <path d="M7 8l5-5 5 5"/>
                <path d="M5 21h14"/>
            </svg> Upload </span>`, () => {
        show_upload_dialog(frm);
    });

    btn.addClass("stock-upload-btn");
}

frappe.ui.form.on("Stock Plate Details", {
    form_render(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        setTimeout(() => {
            let grid_row = frm.fields_dict.plates.grid.grid_rows_by_docname[cdn];
            if (!grid_row || !grid_row.grid_form) return;

            let field = grid_row.grid_form.fields_dict.reference_preview;
            if (!field) return;

            $(field.wrapper).html(`
                <img src="${row.reference_image}" style="max-width:100%; max-height:300px; border-radius:6px;">`);
        }, 100);
    },
    quantity(frm) { calculate_weights(frm); },
    length(frm) { calculate_weights(frm); },
    width(frm) { calculate_weights(frm); },
    thickness(frm) { calculate_weights(frm); },
    density(frm) { calculate_weights(frm); },
    used_weight(frm) { calculate_weights(frm); },
    rate_per_kg(frm) { calculate_weights(frm); }
});


frappe.ui.form.on("Stock Tube Details", {
    form_render(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        setTimeout(() => {
            let grid_row = frm.fields_dict.tubes.grid.grid_rows_by_docname[cdn];
            if (!grid_row || !grid_row.grid_form) return;

            let field = grid_row.grid_form.fields_dict.reference_preview;
            if (!field) return;

            $(field.wrapper).html(`
                <img src="${row.reference_image}" style="max-width:100%; max-height:300px; border-radius:6px;">`);
        }, 100);
    },
    quantity(frm) { calculate_weights(frm); },
    length(frm) { calculate_weights(frm); },
    outer_diameter(frm) { calculate_weights(frm); },
    thickness(frm) { calculate_weights(frm); },
    density(frm) { calculate_weights(frm); },
    used_weight(frm) { calculate_weights(frm); },
    rate_per_mtr(frm) { calculate_weights(frm); }
});

frappe.ui.form.on("Stock Pipe Details", {
    form_render(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        setTimeout(() => {
            let grid_row = frm.fields_dict.pipes.grid.grid_rows_by_docname[cdn];
            if (!grid_row || !grid_row.grid_form) return;

            let field = grid_row.grid_form.fields_dict.reference_preview;
            if (!field) return;

            $(field.wrapper).html(`
                <img src="${row.reference_image}" style="max-width:100%; max-height:300px; border-radius:6px;">`);
        }, 100);
    },
    quantity(frm) { calculate_weights(frm); },
    length(frm) { calculate_weights(frm); },
    outer_diameter(frm) { calculate_weights(frm); },
    thickness(frm) { calculate_weights(frm); },
    density(frm) { calculate_weights(frm); },
    used_weight(frm) { calculate_weights(frm); },
    rate_per_mtr(frm) { calculate_weights(frm); }
});

frappe.ui.form.on("Stock Rod Details", {
    form_render(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        setTimeout(() => {
            let grid_row = frm.fields_dict.rods.grid.grid_rows_by_docname[cdn];
            if (!grid_row || !grid_row.grid_form) return;

            let field = grid_row.grid_form.fields_dict.reference_preview;
            if (!field) return;

            $(field.wrapper).html(`
                <img src="${row.reference_image}" style="max-width:100%; max-height:300px; border-radius:6px;">`);
        }, 100);
    },
    quantity(frm) { calculate_weights(frm); },
    length(frm) { calculate_weights(frm); },
    outer_diameter(frm) { calculate_weights(frm); },
    density(frm) { calculate_weights(frm); },
    used_weight(frm) { calculate_weights(frm); },
    rate_per_mtr(frm) { calculate_weights(frm); }
});

function calculate_weights(frm) {
    frappe.call({
        method: "erp_custom.erp_custom.doctype.stock_item.stock_item.calculate_stock_weights",
        args: {
            doc: JSON.stringify(frm.doc)
        },
        callback(r) {
            if (r.message) {
                frappe.model.sync(r.message);
                frm.refresh_fields();
            }
        }
    });
}


function show_reference_preview(frm) {
    let wrapper = frm.fields_dict.reference_preview?.$wrapper;
    if (!wrapper) return; // safety
    if (frm.doc.reference_image) {
        let file_url = frm.doc.reference_image;

        wrapper.html(`<iframe src="${file_url}#zoom=100" width="100%" height="600px"
                style="border:1px solid #ccc; border-radius:8px;"> </iframe>`);
    } else {
        wrapper.html(`<p>No File uploaded</p>`);
    }
}

function show_download_dialog(frm) {

    let d = new frappe.ui.Dialog({
        title: "Download Excel Template",
        size: "small",
        fields: [
            {
                fieldtype: "HTML",
                fieldname: "download_html"
            }
        ]
    });

    d.fields_dict.download_html.$wrapper.html(`
    <style>
        .template-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
            padding: 10px;
        }

        .template-card {
            height: 90px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            background: #ffffff;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all .25s ease;
        }

        .template-card:hover {
            transform: translateY(-3px);
            box-shadow: 0px 5px 15px rgba(0,0,0,0.12);
            border-color: #6366f1;
        }

        .template-icon {
            width: 32px;
            height: 32px;
            margin-bottom: 8px;
        }

        .template-name {
            font-size: 13px;
            font-weight: 600;
            color:#374151;
        }

        .overall-workbook {
            background: linear-gradient(135deg, #1e293b, #334155);
            border: none;
        }

        .overall-workbook .template-name {
            color: #fff;
        }

        .overall-workbook:hover {
            border-color: transparent;
        }

        .overall-card {
            grid-column: span 3;
            background:#111827;
            color:white;
        }

        .overall-card .template-name {
            color:white;
        }
    </style>

    <div class="template-grid">
        <div class="template-card btn-download" data-type="plate">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div class="template-name">Plates</div>
        </div>

        <div class="template-card btn-download" data-type="pipe">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2">
                <circle cx="12" cy="12" r="8"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
            <div class="template-name">Pipes</div>
        </div>

        <div class="template-card btn-download" data-type="tube">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="#9333ea" stroke-width="2">
                <path d="M4 12h16"/>
                <path d="M8 7v10"/>
                <path d="M16 7v10"/>
            </svg>
            <div class="template-name">Tubes</div>
        </div>

        <div class="template-card btn-download" data-type="rod">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2">
                <path d="M5 19L19 5"/>
                <circle cx="5" cy="19" r="2"/>
                <circle cx="19" cy="5" r="2"/>
            </svg>
            <div class="template-name">Rods</div>
        </div>

        <div class="template-card btn-download" data-type="flange">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
                <circle cx="12" cy="12" r="8"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
            <div class="template-name">Flanges</div>
        </div>

        <div class="template-card btn-download" data-type="welding">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" stroke-width="2">
                <path d="M7 3l10 10"/>
                <path d="M14 3l7 7"/>
                <path d="M3 21l7-7"/>
            </svg>
            <div class="template-name">Welding</div>
        </div>

        <div class="template-card btn-download" data-type="disc">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="12" cy="12" r="4"/>
            </svg>
            <div class="template-name">Disc</div>
        </div>

        <div class="template-card btn-download" data-type="spares">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2">
                <path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/>
            </svg>
            <div class="template-name">Spares</div>
        </div>

        <div class="template-card overall-workbook btn-download" data-type="overall">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M4 4h16v16H4z"/>
                <line x1="8" y1="8" x2="16" y2="8"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="8" y1="16" x2="16" y2="16"/>
            </svg>
            <div class="template-name">Overall Workbook</div>
        </div>

        <div class="template-card overall-card btn-download-data">
            <svg class="template-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M5 4h14v16H5z"/>
                <path d="M8 8h8"/>
                <path d="M8 12h8"/>
                <path d="M8 16h5"/>
            </svg>
            <div class="template-name"> Download Data </div>
        </div>
    </div>`);
    d.show();

    d.$wrapper.find(".btn-download").on("click", function(){
        let type = $(this).data("type");
        window.location.href = `/api/method/erp_custom.erp_custom.doctype.stock_item.stock_item.download_template?template_type=${type}`;
        d.hide();
    });

    d.$wrapper.find(".btn-download-data").on("click", function () {
        d.hide();
        show_download_data_dialog(frm);
    });
}

function show_upload_dialog(frm) {
        let d = new frappe.ui.Dialog({
            title:"Upload Stock Excel",
            size:"small",
            fields:[
                {
                    fieldtype:"HTML",
                    fieldname:"upload_html"
                }
            ]
        });

        id="3t4w8d"
            setTimeout(() => {
                let upload_btn = d.get_primary_btn();
                upload_btn.addClass("custom-upload-submit");
                upload_btn.html(`
                    <span class="upload-submit-content">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 16V4"/>
                            <path d="M7 9l5-5 5 5"/>
                            <path d="M5 20h14"/>
                        </svg> Upload Excel </span>`);
            }, 100);
        d.fields_dict.upload_html.$wrapper.html(`
        <style>
        .upload-box {
            padding:20px;
        }

        .upload-icon {
            width:70px;
            height:70px;
            background: linear-gradient(135deg, #d1fae5, #ccfbf1);
            border-radius:20px;
            margin:auto;
            display:flex;
            align-items:center;
            justify-content:center;
        }

        .upload-icon svg {
            width:38px;
            height:38px;
            stroke:#059669;
            stroke-width:2;
            fill:none;
        }

        .upload-title {
            text-align:center;
            font-size:18px;
            font-weight:700;
            color:#111827;
            margin-top:15px;
        }

        .upload-sub {
            text-align:center;
            color:#6b7280;
            font-size:13px;
            margin-bottom:25px;
        }

        #excel_file {
            border:2px dashed #10b981;
            padding:12px;
            border-radius:12px;
            background:#f0fdf4;
        }

        #upload_type {
            height:42px;
            border-radius:10px;
            border:1px solid #d1d5db;
        }

        .upload-select {
            margin-top:15px;
        }

        .upload-select label {
            font-weight:600;
        }

        .upload-actions {
            margin-top:20px;
        }
        
        .upload-submit-btn {
            display:flex;
            align-items:center;
            gap:8px;
            font-weight:600;
        }

        .upload-submit-btn svg {
            width:18px;
            height:18px;
            stroke:white;
            fill:none;
            stroke-width:2;
        }

        #excel_file {
            height: 55px;
            padding: 12px;
            border: 2px dashed #10b981;
            border-radius: 12px;
            background: #f0fdf4;
            font-size: 14px;
            cursor: pointer;
        }


        #excel_file::file-selector-button {
            height: 35px;
            padding: 0 15px;
            margin-right: 12px;
            border: none;
            border-radius: 8px;
            background: linear-gradient(135deg, #059669, #0f766e);
            color: white;
            font-weight: 600;
            cursor: pointer;
        }

        #excel_file::file-selector-button:hover {
            background: linear-gradient(135deg, #047857, #115e59);
        }

        id="7d5q7v"
        .custom-upload-submit {
            border:none !important;
            border-radius:10px !important;
            background:linear-gradient(135deg, #059669, #0f766e) !important;
            padding:10px 22px !important;
            box-shadow: 0 5px 15px rgba(5,150,105,0.35);
            transition:.3s;
        }

        .custom-upload-submit:hover {
            transform:translateY(-2px);
            background:linear-gradient(135deg, #047857, #115e59) !important;
        }

        .upload-submit-content {
            display:flex;
            align-items:center;
            justify-content:center;
            gap:8px;
            color:white;
            font-weight:600;
            font-size:14px;
        }

        .upload-submit-content svg {
            width:20px;
            height:20px;
            fill:none;
            stroke:white;
            stroke-width:2;
            stroke-linecap:round;
            stroke-linejoin:round;
        }
        </style>

        <div class="upload-box">
            <div class="upload-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M12 16V4"/>
                    <path d="M7 9l5-5 5 5"/>
                    <path d="M5 20h14"/>
                </svg>
            </div>

        <div class="upload-title"> Upload Excel File </div>
        <div class="upload-sub"> Import stock items from Excel template </div>
            <div class="upload-file">
                <input type="file" class="form-control" id="excel_file" accept=".xlsx" />
            </div>

            <div class="upload-select">
                <label> Upload Type </label>
                <select class="form-control" id="upload_type">
                    <option value="Plates"> Plates </option>
                    <option value="Pipes"> Pipes </option>
                    <option value="Tubes"> Tubes </option>
                    <option value="Rods"> Rods </option>
                    <option value="Flanges"> Flanges </option>
                    <option value="Welding"> Welding </option>
                    <option value="Disc"> Disc </option>
                    <option value="Spare"> Spare </option>
                    <option value="Overall"> Overall </option>
                </select>
            </div>
        </div> `);

    d.set_primary_action("Upload Excel", async function() {
    const file = d.$wrapper.find("#excel_file")[0].files[0];
    const type = d.$wrapper.find("#upload_type").val();

    if (!file) {
        frappe.msgprint("Please select an Excel file.");
        return;
    }

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
        frappe.msgprint("Please select a valid .xlsx Excel file.");
        return;
    }

    if (!type) {
        frappe.msgprint("Please select Upload Type.");
        return;
    }

    try {
        frappe.dom.freeze("Uploading Excel...");

        const form_data = new FormData();
        form_data.append("file", file);
        form_data.append("is_private", "0");

        const upload_response = await fetch("/api/method/upload_file", {
                method: "POST",
                headers: {
                    "X-Frappe-CSRF-Token": frappe.csrf_token
                },
                body: form_data
            }
        );

        const upload_data = await upload_response.json();
        if (!upload_response.ok || !upload_data.message) {
            throw new Error(upload_data?.message?.message || upload_data?.exc || "Excel file upload failed.");
        }

        const file_url = upload_data.message.file_url;
        const process_response = await frappe.call({
            method: "erp_custom.erp_custom.doctype.stock_item.stock_item.upload_stock_excel",
            args: {
                file_url: file_url,
                upload_type: type,
                stock_item: frm.doc.name
            }
        });

        if (process_response.exc) {
            throw new Error("Excel data processing failed.");
        }

        frappe.show_alert({
            message: "Excel uploaded successfully.",
            indicator: "green"
        });

        d.hide();
        await frm.reload_doc();

    } catch (error) {
        console.error("Stock Excel Upload Error:", error);

        frappe.msgprint({
            title: "Excel Upload Failed",
            message: error.message || "Unable to upload Excel file.",
            indicator: "red"
        });

    } finally {
        frappe.dom.unfreeze();
    }
});

d.show();
}


function show_download_data_dialog(frm) {
    let d = new frappe.ui.Dialog({
        title: "Download Stock Data",
        size: "small",
        fields: [
            {
                fieldtype: "HTML",
                fieldname: "download_options",
                options: `
                    <div style="padding: 10px 5px 5px 5px;">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr);
                            gap: 12px 10px; align-items: center;">

                            <label style="cursor:pointer; margin:0;">
                                <input type="checkbox" class="download-type" value="plates">
                                <span style="margin-left:6px;">Plates</span>
                            </label>

                            <label style="cursor:pointer; margin:0;">
                                <input type="checkbox" class="download-type" value="pipes">
                                <span style="margin-left:6px;">Pipes</span>
                            </label>

                            <label style="cursor:pointer; margin:0;">
                                <input type="checkbox" class="download-type" value="tubes">
                                <span style="margin-left:6px;">Tubes</span>
                            </label>

                            <label style="cursor:pointer; margin:0;">
                                <input type="checkbox" class="download-type" value="rods">
                                <span style="margin-left:6px;">Rods</span>
                            </label>

                            <label style="cursor:pointer; margin:0;">
                                <input type="checkbox" class="download-type" value="flanges">
                                <span style="margin-left:6px;">Flanges</span>
                            </label>

                            <label style="cursor:pointer; margin:0;">
                                <input type="checkbox" class="download-type" value="welding">
                                <span style="margin-left:6px;">Welding</span>
                            </label>

                            <label style="cursor:pointer; margin:0;">
                                <input type="checkbox" class="download-type" value="disc">
                                <span style="margin-left:6px;">Disc</span>
                            </label>

                            <label style="cursor:pointer; margin:0;">
                                <input type="checkbox" class="download-type" value="spares">
                                <span style="margin-left:6px;">Spares</span>
                            </label>

                            <label style="cursor:pointer; margin:0;">
                                <input type="checkbox" class="download-type" value="machinery">
                                <span style="margin-left:6px;">Machinery</span>
                            </label>

                            <div></div>

                            <label style="cursor:pointer; margin:0; text-align:center;">
                                <input type="checkbox" class="download-type overall-checkbox" value="overall">
                                <span style="margin-left:6px;">Overall</span>
                            </label>

                            <div></div>

                        </div>
                    </div>
                `
            }
        ],
        primary_action_label: "Download",
        primary_action() {
            let selected_types = [];

            d.$wrapper
                .find(".download-type:checked")
                .each(function () {
                    selected_types.push(this.value);
                });

            if (!selected_types.length) {
                frappe.msgprint("Please select at least one Download Type.");
                return;
            }

            /** If Overall is selected, download all stock types. */
            if (selected_types.includes("overall")) {
                selected_types = ["plates", "pipes", "tubes", "rods", "flanges", "welding", "disc", "spares", "machinery"];
            }

            let types = encodeURIComponent(JSON.stringify(selected_types));

            window.location.href =
                `/api/method/erp_custom.erp_custom.doctype.stock_item.stock_item.download_stock_data` +
                `?stock_item=${encodeURIComponent(frm.doc.name)}` +
                `&download_type=${types}`;

            d.hide();
        }
    });

    d.show();

    /* * Overall checkbox handling */
    d.$wrapper.on("change", ".overall-checkbox",
        function () {
            let checked = $(this).is(":checked");
            d.$wrapper.find(".download-type:not(.overall-checkbox)").prop("checked", checked);
        }
    );

    /*
     * If any individual option is unchecked,
     * automatically uncheck Overall.
     *
     * If all individual options are checked,
     * automatically check Overall.
     */
    d.$wrapper.on("change", ".download-type:not(.overall-checkbox)",
        function () {
            let total = d.$wrapper.find(".download-type:not(.overall-checkbox)").length;
            let checked = d.$wrapper.find(".download-type:not(.overall-checkbox):checked").length;
            let overall = d.$wrapper.find(".overall-checkbox");

            if (checked === total) {
                overall.prop("checked", true);
            } else {
                overall.prop("checked", false);
            }
        }
    );
}


// FILTER

// /* ============================================================
//    STOCK ITEM - CHILD TABLE FIRST ROW FILTER
//    UI ONLY - DOES NOT CREATE CHILD TABLE RECORDS
//    ============================================================ */

// function init_child_table_first_row_filters(frm) {
//     const tables = ["plates", "pipes", "tubes", "flanges", "rods"];
//     tables.forEach(table_name => {
//         const field = frm.fields_dict[table_name];
//         if (!field || !field.grid) {
//             return;
//         }
//         create_first_row_filter(frm, table_name);
//     });
// }

// function create_first_row_filter(frm, table_name) {
//     const field = frm.fields_dict[table_name];
//     if (!field || !field.grid) {
//         return;
//     }

//     const grid = field.grid;
//     const wrapper = $(grid.wrapper);

//     // Prevent duplicate
//     if (wrapper.find(".stock-first-row-filter").length) {
//         return;
//     }

//     const heading = wrapper.find(".grid-heading-row").first();
//     if (!heading.length) {
//         return;
//     }

//     const filter_row = $(`
//         <div class="stock-first-row-filter">
//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="category" placeholder="Filter Category">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="type" placeholder="Filter Type">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="moc" placeholder="Filter MoC">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="vendor" placeholder="Filter Vendor">
//             </div>

//              <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="purchase_order_no" placeholder="Filter PO">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="description" placeholder="Description">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="status" placeholder="Filter Status">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="length" placeholder="Length">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="width" placeholder="Width">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="thickness" placeholder="Thickness">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="outer_diameter" placeholder="Outer Diameter">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="inner_diameter" placeholder="Inner Diameter">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="nps" placeholder="NPS">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="sch" placeholder="SCH">
//             </div>

//             <div class="stock-filter-cell">
//                 <input type="text" class="form-control input-xs" data-field="class" placeholder="Class">
//             </div>

//             <div class="stock-filter-clear">
//                 <button type="button" class="btn btn-xs btn-default" title="Clear Filter">
//                     <i class="fa fa-times"></i>
//                 </button>
//             </div>
//         </div>
//     `);

//     heading.after(filter_row);
//     filter_row.on("input", ".stock-filter-cell input",
//         function () {
//             apply_first_row_filter(frm, table_name, filter_row);
//         }
//     );


//     /* * Clear filter  */
//     filter_row.on("click", ".stock-filter-clear button",
//         function () {
//             filter_row.find("input").val("");
//             show_all_child_rows(frm, table_name);
//         }
//     );
// }


// /* ===================== APPLY FILTER  =================== */

// function apply_first_row_filter(frm, table_name, filter_row) {
//     const field = frm.fields_dict[table_name];
//     if (!field || !field.grid) {
//         return;
//     }

//     const grid = field.grid;
//     const filters = {};
//     filter_row
//         .find("input")
//         .each(function () {

//             const fieldname = $(this).data("field");
//             const value = $(this).val().trim().toLowerCase();

//             if (value) {
//                 filters[fieldname] = value;
//             }
//         });


//     /*
//      * Filter existing rows only
//      */
//     grid.grid_rows.forEach(grid_row => {
//         const row = grid_row.doc;
//         let matched = true;

//         Object.keys(filters).forEach(fieldname => {
//             if (!matched) {
//                 return;
//             }

//             let row_value = row[fieldname];
//             if (
//                 row_value === undefined ||
//                 row_value === null
//             ) {
//                 row_value = "";
//             }

//             row_value = String(row_value).toLowerCase();
//             const filter_value = filters[fieldname];
//             if (!row_value.includes(filter_value)) {
//                 matched = false;
//             }
//         });

//         if (matched) {
//             $(grid_row.row).show();
//         } else {
//             $(grid_row.row).hide();
//         }
//     });
// }


// /* ================= SHOW ALL  ============ */

// function show_all_child_rows(frm, table_name) {
//     const field = frm.fields_dict[table_name];
//     if (!field || !field.grid) {
//         return;
//     }

//     field.grid.grid_rows.forEach(grid_row => {
//         $(grid_row.row).show();
//     });
// }

// function add_stock_first_row_filter_css() {
//     if ($("#stock-first-row-filter-css").length) {
//         return;
//     }

//     $("head").append(`
//         <style id="stock-first-row-filter-css">

//             .stock-first-row-filter {
//                 display: flex;
//                 width: 100%;
//                 padding: 5px 0;
//                 background: #f8fafc;
//                 border-bottom: 1px solid #d1d5db;
//                 box-sizing: border-box;
//                 overflow-x: auto;
//             }

//             .stock-first-row-filter
//             .stock-filter-cell {
//                 flex: 0 0 120px;
//                 width: 120px;
//                 padding: 0 3px;
//                 min-width: 0;
//             }

//             .stock-first-row-filter
//             input {
//                 width: 100% !important;
//                 height: 28px !important;
//                 min-height: 28px !important;
//                 padding: 3px 7px !important;
//                 font-size: 12px !important;
//                 border: 1px solid #d1d5db !important;
//                 border-radius: 4px !important;
//                 background: #ffffff !important;
//                 box-sizing: border-box;
//             }

//             .stock-first-row-filter
//             input:focus {
//                 border-color: #2490ef !important;
//                 box-shadow: 0 0 0 1px rgba(36,144,239,.15) !important;
//             }

//             .stock-first-row-filter
//             input::placeholder {
//                 color: #9ca3af;
//                 font-size: 11px;
//             }

//             .stock-filter-clear {
//                 flex: 0 0 38px;
//                 width: 38px;
//                 padding: 0 3px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//             }

//             .stock-filter-clear button {
//                 height: 28px;
//                 width: 30px;
//                 padding: 0;
//             }

//         </style>
//     `)
// }

// add_stock_first_row_filter_css();



/* ============================================================
   STOCK ITEM - CHILD TABLE ADVANCED FILTER
   ------------------------------------------------------------
   Parent Doctype : Stock Item

   Child Tables:
   - Plates
   - Pipes
   - Tubes
   - Flanges
   - Rods

   FEATURES:
   1. Normal ERPNext child grid remains untouched
   2. Filter + Clear Filter buttons outside/right of grid
   3. Filter dialog reads child DocType fields dynamically
   4. Four filter fields per row
   5. Multiple values can be selected
   6. Existing child-row values are shown as options
   7. UI filtering only - does NOT create child records
   ============================================================ */


/* ============================================================
   CONFIGURATION
   ============================================================ */

const STOCK_FILTER_TABLES = [
    "plates",
    "pipes",
    "tubes",
    "flanges",
    "rods"
];


/* ============================================================
   INITIALIZE
   ============================================================ */

function init_stock_child_filters(frm) {

    STOCK_FILTER_TABLES.forEach(table_name => {

        const table_field = frm.fields_dict[table_name];

        if (!table_field || !table_field.grid) {
            return;
        }

        create_stock_filter_toolbar(frm, table_name);
    });
}


/* ============================================================
   CREATE FILTER TOOLBAR
   ============================================================ */

// function create_stock_filter_toolbar(frm, table_name) {

//     const table_field = frm.fields_dict[table_name];

//     if (!table_field || !table_field.grid) {
//         return;
//     }

//     const grid = table_field.grid;
//     const wrapper = $(grid.wrapper);

//     /*
//      * Prevent duplicate toolbar
//      */
//     if (wrapper.find(".stock-child-filter-toolbar").length) {
//         return;
//     }


//     /* --------------------------------------------------------
//        Toolbar
//        -------------------------------------------------------- */

//     const toolbar = $(`
//         <div class="stock-child-filter-toolbar">

//             <div class="stock-filter-toolbar-right">

//                 <button
//                     type="button"
//                     class="btn btn-sm btn-primary stock-filter-btn">
//                     <i class="fa fa-filter"></i>
//                     <span>Filter</span>
//                 </button>

//                 <button
//                     type="button"
//                     class="btn btn-sm btn-default stock-clear-filter-btn">
//                     <i class="fa fa-times"></i>
//                     <span>Clear Filter</span>
//                 </button>

//             </div>

//         </div>
//     `);


//     /*
//      * Put toolbar BEFORE grid heading
//      */
//     wrapper.find(".grid-heading-row").first().before(toolbar);


//     /* --------------------------------------------------------
//        Filter button
//        -------------------------------------------------------- */

//     toolbar.on(
//         "click",
//         ".stock-filter-btn",
//         function () {

//             open_stock_child_filter_dialog(
//                 frm,
//                 table_name
//             );
//         }
//     );


//     /* --------------------------------------------------------
//        Clear filter button
//        -------------------------------------------------------- */

//     toolbar.on(
//         "click",
//         ".stock-clear-filter-btn",
//         function () {

//             clear_stock_child_filter(
//                 frm,
//                 table_name
//             );
//         }
//     );
// }

function create_stock_filter_toolbar(frm, table_name) {
    const table_field = frm.fields_dict[table_name];
    if (!table_field || !table_field.grid) {
        return;
    }
    const grid = table_field.grid;
    /*
     * IMPORTANT:
     * Use the complete Table field wrapper,
     * NOT grid.wrapper.
     */
    const field_wrapper = $(table_field.wrapper);
    /*
     * Prevent duplicate toolbar
     */
    if (field_wrapper.find(".stock-child-filter-toolbar").length) {
        return;
    }

    /* * Create toolbar OUTSIDE the actual grid */
    const toolbar = $(`
        <div class="stock-child-filter-toolbar">
            <div class="stock-filter-toolbar-right">
                <button type="button" class="btn btn-sm btn-primary stock-filter-btn">
                    <i class="fa fa-filter"></i> <span>Filter</span>
                </button>

                <button type="button" class="btn btn-sm btn-default stock-clear-filter-btn">
                    <i class="fa fa-times"></i> <span>Clear Filter</span>
                </button>
            </div>
        </div>
    `);

    /* * Find the grid container  */
    const grid_wrapper = $(grid.wrapper);

    /*
     * Put toolbar BEFORE grid wrapper
     *
     * This is the important change.
     */
    grid_wrapper.before(toolbar);


    /*
     * Filter button
     */
    toolbar.on("click", ".stock-filter-btn",
        function () {
            open_stock_child_filter_dialog(frm, table_name);
        });

    /*
     * Clear Filter button
     */
    toolbar.on("click", ".stock-clear-filter-btn",
        function () {
            clear_stock_child_filter(frm, table_name);
        }
    );
}
/* ============================================================
   OPEN FILTER DIALOG
   ============================================================ */

function open_stock_child_filter_dialog(frm, table_name) {
    const table_field = frm.fields_dict[table_name];
    if (!table_field || !table_field.grid) {
        return;
    }

    const grid = table_field.grid;
    /* * Get child DocType  */
    const child_doctype = get_stock_child_doctype(frm, table_name);

    if (!child_doctype) {
        frappe.msgprint("Unable to find child DocType for " + table_name);
        return;
    }

    /* * Get child DocType metadata */
    const meta = frappe.get_meta(child_doctype);
    if (!meta || !meta.fields) {
        return;
    }

    /* * Get usable fields */
    const filter_fields = get_stock_filter_fields(meta.fields);
    if (!filter_fields.length) {
        frappe.msgprint("No filterable fields found.");
        return;
    }

    /* * Create Dialog fields */
    const dialog_fields = [];
    /*
     * Heading
     */
    dialog_fields.push({
        fieldtype: "HTML",
        fieldname: "filter_info",
        options: `
            <div class="stock-filter-dialog-info">
                <i class="fa fa-info-circle"></i>
                Select one or more values for any field.
                Different fields are combined together.
            </div>
        `
    });

    /*
     * Create fields dynamically
     *
     * 4 fields per row
     */
    filter_fields.forEach((df, index) => {
        /*
         * Start new row every 4 fields
         */
        if (index % 4 === 0) {
            dialog_fields.push({
                fieldtype: "Section Break",
                fieldname: `stock_filter_section_${index}`
            });
        }

        /*
         * Every field except first in row
         * should use Column Break
         */
        if (index % 4 !== 0) {
            dialog_fields.push({
                fieldtype: "Column Break",
                fieldname: `stock_filter_column_${index}`
            });
        }


        dialog_fields.push({
            fieldtype: "MultiSelectList",
            fieldname: `filter_${df.fieldname}`,
            label: df.label || df.fieldname,
            description: `Select ${df.label || df.fieldname}`,
            get_data: function (txt) {
                return get_stock_filter_options(frm, table_name, df.fieldname, txt);
            }
        });
    });


    /* * Dialog  */
    const dialog = new frappe.ui.Dialog({
        title: "Filter " + (meta.name || child_doctype),
        size: "extra-large",
        fields: dialog_fields,
        primary_action_label: "Apply Filter",
        primary_action: function () {
            const values = dialog.get_values();
            apply_stock_child_filter(frm, table_name, values, filter_fields);
            dialog.hide();
        }
    });


    /* * Show dialog */
    dialog.show();

    /* * Set useful width */
    setTimeout(() => {
        dialog.$wrapper
            .find(".modal-dialog")
            .css({
                "max-width": "1200px",
                "width": "95%"
            });
    }, 100);
}


/* ================  GET CHILD DOCTYPE ======================== */

function get_stock_child_doctype(frm, table_name) {
    const df = frm.fields_dict[table_name].df;
    if (!df) {
        return null;
    }
    return df.options;
}


/* ======================= GET FILTERABLE CHILD FIELDS =================== */

function get_stock_filter_fields(fields) {
    /* * Fields which should NOT appear in filter dialog  */
    const ignored_fieldtypes = [
        "Section Break",
        "Column Break",
        "Tab Break",
        "HTML",
        "Button",
        "Table",
        "Table MultiSelect",
        "Fold"
    ];


    /* * ERPNext internal fields */
    const ignored_fieldnames = [
        "name",
        "owner",
        "creation",
        "modified",
        "modified_by",
        "parent",
        "parentfield",
        "parenttype",
        "idx",
        "docstatus"
    ];


    return fields.filter(df => {
        if (!df.fieldname) {
            return false;
        }

        if (ignored_fieldnames.includes(df.fieldname)) {
            return false;
        }

        if (ignored_fieldtypes.includes(df.fieldtype)) {
            return false;
        }

        /* * Hidden fields don't need filtering */
        if (df.hidden) {
            return false;
        }
        return true;
    });
}


/* ================== GET FILTER OPTIONS ================ */

function get_stock_filter_options(frm, table_name, fieldname, search_text) {
    const table_field = frm.fields_dict[table_name];
    if (!table_field || !table_field.grid) {
        return [];
    }

    const grid = table_field.grid;
    const search = String(search_text || "").trim().toLowerCase();

    /* * Get values from existing child rows */
    const unique_values = new Set();
    grid.grid_rows.forEach(grid_row => {
        const row = grid_row.doc;
        if (!row) {
            return;
        }
        let value = row[fieldname];

        if (value === undefined || value === null || value === "") {
            return;
        }

        /* * Convert value to string  */
        value = String(value).trim();
        if (!value) {
            return;
        }

        /* * Search text */
        if (search && !value.toLowerCase().includes(search)) {
            return;
        }
        unique_values.add(value);
    });


    /* * Convert to Frappe MultiSelectList format */
    return Array.from(unique_values)
        .sort((a, b) =>
            a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: "base"
            })
        )
        .map(value => ({
            value: value,
            description: ""
        }));
}


/* ======================== APPLY FILTER ============================= */

function apply_stock_child_filter(frm, table_name, selected_values, filter_fields) {
    const table_field = frm.fields_dict[table_name];
    if (!table_field || !table_field.grid) {
        return;
    }

    const grid = table_field.grid;
    /* * Build active filters  */
    const active_filters = {};

    filter_fields.forEach(df => {
        const fieldname = `filter_${df.fieldname}`;
        let values = selected_values[fieldname];
        if (!values) {
            return;
        }

        /* * MultiSelectList returns array */
        if (!Array.isArray(values)) {
            values = [values];
        }

        values = values.map(value => String(value).trim().toLowerCase()).filter(Boolean);
        if (values.length) {
            active_filters[df.fieldname] = values;
        }
    });


    /* * Filter every existing row */
    grid.grid_rows.forEach(grid_row => {
        const row = grid_row.doc;
        let matched = true;

        /* * Each field = AND  */
        Object.keys(active_filters).forEach(fieldname => {
                if (!matched) {
                    return;
                }
                let row_value = row[fieldname];

                if (row_value === undefined || row_value === null) {
                    row_value = "";
                }
                row_value = String(row_value).trim().toLowerCase();

                /* * Multiple selected values  * within same field = OR  */
                const field_values = active_filters[fieldname];
                const field_matched = field_values.some(selected_value => row_value === selected_value);

                if (!field_matched) {
                    matched = false;
                }
            });

        /* * Show / hide row */
        if (matched) {
            $(grid_row.row).show();
        } else {
            $(grid_row.row).hide();
        }
    });

    /* * Update filter button  */
    update_stock_filter_button(frm, table_name, Object.keys(active_filters).length);
}


/* ============================================================
   CLEAR FILTER
   ============================================================ */

function clear_stock_child_filter(frm, table_name) {
    const table_field = frm.fields_dict[table_name];
    if (!table_field || !table_field.grid) {
        return;
    }

    const grid = table_field.grid;

    /* * Show every child row  */
    grid.grid_rows.forEach(grid_row => {
        $(grid_row.row).show();
    });

    /* * Reset button */
    update_stock_filter_button(frm, table_name, 0);
}


/* ================== UPDATE FILTER BUTTON ====================== */
function update_stock_filter_button(frm, table_name, filter_count) {
    const table_field = frm.fields_dict[table_name];
    if (!table_field || !table_field.grid) {
        return;
    }

    const wrapper = $(table_field.wrapper);
    const button = wrapper.find(".stock-filter-btn");

    if (!button.length) {
        return;
    }

    if (filter_count > 0) {
        button.html(`<i class="fa fa-filter"></i>Filter (${filter_count})`);
        button.addClass("stock-filter-active");
    } else {
        button.html(`<i class="fa fa-filter"></i>Filter`);
        button.removeClass("stock-filter-active");
    }
}


/* ============= CSS ================== */

function add_stock_child_filter_css() {
    if ($("#stock-child-filter-css").length) {
        return;
    }

    $("head").append(`
        <style id="stock-child-filter-css">
            /* ================== FILTER TOOLBAR ======================= */

            .stock-child-filter-toolbar {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin: 6px 0;
                padding: 0;
                box-sizing: border-box;
            }

            .stock-filter-toolbar-right {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 6px;
            }

            .stock-filter-toolbar-right button {
                height: 30px;
                min-height: 30px;
                padding: 4px 12px;
                font-size: 12px;
                border-radius: 5px;
            }

            .stock-filter-btn {
                font-weight: 500;
            }

            .stock-clear-filter-btn {
                background: #ffffff;
            }


            /* =================== FILTER DIALOG ==================== */
            .stock-filter-dialog-info {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 5px;
                padding: 9px 12px;
                margin-bottom: 12px;
                font-size: 12px;
                color: #475569;
            }

            .stock-filter-dialog-info
            .fa {
                margin-right: 5px;
                color: #2490ef;
            }

            /* * Four columns  */
            .modal-dialog
            .form-section {
                margin-bottom: 12px;
            }

            /* * Column spacing  */
            .modal-dialog
            .form-column {
                padding-left: 6px;
                padding-right: 6px;
            }

            /* * Label  */
            .modal-dialog
            .frappe-control
            .control-label {
                font-size: 11px;
                font-weight: 600;
                color: #475569;
                margin-bottom: 4px;
            }


            /* * MultiSelectList */
            .modal-dialog
            .frappe-control
            .form-control {
                min-height: 34px;
                font-size: 12px;
            }


            /* * Dialog body */
            .stock-filter-dialog-info
            + .form-section {
                padding-top: 4px;
            }


            /*  * Make dialog footer clean */
            .modal-dialog
            .modal-footer {
                padding-top: 10px;
            }


        /* ======================= MOBILE / SMALL SCREEN =================== */
            @media (max-width: 900px) {
                .stock-child-filter-toolbar {
                    justify-content: flex-start;
                }

                .stock-filter-toolbar-right {
                    justify-content: flex-start;
                }
            }
        </style>
    `);
}


/* =================== INITIALIZE CSS =============== */

add_stock_child_filter_css();