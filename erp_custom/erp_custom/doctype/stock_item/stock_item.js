// Copyright (c) 2026, maze and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Stock Item", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on("Stock Item", {
    refresh(frm) {
        calculate_weights(frm);
        set_moc_filter(frm);

        add_download_button(frm);
        add_upload_button(frm);

        show_reference_preview(frm);

    },

    reference_image(frm) {
        show_reference_preview(frm);
    },
    
    validate(frm) {
        calculate_weights(frm);
    }
});

function set_moc_filter(frm) {
    let tables = ["plates", "pipes", "tubes", "flanges", "rods"];
    tables.forEach(table => {
        if (frm.fields_dict[table]) {
            frm.fields_dict[table].grid.get_field("moc").get_query = function(doc, cdt, cdn) {
                let row = locals[cdt][cdn];
                return {
                    filters: {
                        type: row.type
                    }
                };
            };
        }
    });
}

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

        background:
        linear-gradient(
            135deg,
            #2563eb,
            #4f46e5
        ) !important;

    }


    .stock-download-btn:hover {

        transform:translateY(-2px);

        background:
        linear-gradient(
            135deg,
            #1d4ed8,
            #3730a3
        ) !important;

    }



    /* Upload Button */

    .stock-upload-btn {

        background:
        linear-gradient(
            135deg,
            #059669,
            #0f766e
        ) !important;

    }


    .stock-upload-btn:hover {

        transform:translateY(-2px);

        background:
        linear-gradient(
            135deg,
            #047857,
            #115e59
        ) !important;

    }


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

            </svg>

            Download

        </span>


    `, () => {

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

            </svg>

            Upload

        </span>


    `, () => {

        show_upload_dialog(frm);

    });


    btn.addClass("stock-upload-btn");

}

// function add_download_button(frm) {

//     let btn = frm.add_custom_button(`
//         <span class="stock-action-btn download-action">
//             <svg viewBox="0 0 24 24">
//                 <path d="M12 3v12"/>
//                 <path d="M7 10l5 5 5-5"/>
//                 <path d="M5 21h14"/>
//             </svg>
//             Download
//         </span>
//     `, () => {
//         show_download_dialog(frm);
//     });

//     btn.removeClass("btn-default");
//     btn.addClass("stock-download-btn");
// }

// function add_upload_button(frm) {

//     frm.add_custom_button(`
//         <span style="display:flex;align-items:center;gap:6px;">
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
//                 fill="currentColor" viewBox="0 0 16 16">
//                 <path d="M8 15V6.707L5.854 8.854l-.708-.708L8 5.293l2.854 2.853-.708.708L8 6.707V15z"/>
//                 <path d="M1 2h14V1H1z"/>
//             </svg>
//             Upload
//         </span>
//     `, () => {
//         show_upload_dialog(frm);
//     }).addClass("btn-success");
// }

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
        window.location.href = `/api/method/erp_custom.erp_custom.doctype.stock_item.stock_item.download_${type}_template`;
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
                        </svg> Upload Excel
                    </span>`);
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

        d.set_primary_action("Upload Excel", function(){

    let file = d.$wrapper.find("#excel_file")[0].files[0];
    let type = d.$wrapper.find("#upload_type").val();

    if(!file){
        frappe.msgprint("Please select Excel file");
        return;
    }

    frappe.upload_file(file, {
        is_private: 0,
        callback(upload_response){
            if(upload_response.message){
                frappe.call({
                    method: "erp_custom.erp_custom.doctype.stock_item.stock_item.upload_stock_excel",
                    args:{
                        file_url: upload_response.message.file_url, upload_type:type,
                        stock_item: frm.doc.name
                    },
                    freeze:true,
                    freeze_message: "Uploading Excel...",

                    callback(r){
                        if(!r.exc){
                            frm.reload_doc();
                            frappe.show_alert({
                                message: "Excel uploaded successfully",
                                indicator: "green"
                            });
                            d.hide();
                        }
                    }
                });
            }
        }
    });
});
    d.show();
}


function show_download_data_dialog(frm) {
    let d = new frappe.ui.Dialog({
        title: "Download Stock Data",
        size: "small",
        fields: [
            {
                fieldtype: "Select",
                label: "Download Type",
                fieldname: "download_type",
                options: "Plates\nPipes\nTubes\nRods\nFlanges\nWelding\nDisc\nSpares\nOverall"
            }
        ],

        primary_action_label: "Download",

        primary_action(values) {

            if (!values.download_type) {
                frappe.msgprint("Please select Download Type.");
                return;
            }
            let type = values.download_type.toLowerCase();
            window.location.href = `/api/method/erp_custom.erp_custom.doctype.stock_item.stock_item.download_stock_data?stock_item=${frm.doc.name}&download_type=${type}`;

            d.hide();
        }
    });
    d.show();
}