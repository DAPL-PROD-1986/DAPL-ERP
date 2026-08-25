// Copyright (c) 2026, maze and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Material Price Master", {
// 	refresh(frm) {

// 	},
// });



// frappe.ui.form.on("Material Plate Price", {
//     category(frm, cdt, cdn) {
//         fetch_purchase_order(frm, cdt, cdn);
//     },

//     supplier(frm, cdt, cdn) {
//         fetch_purchase_order(frm, cdt, cdn);
//     },

//     rate(frm, cdt, cdn) {
//         fetch_purchase_order(frm, cdt, cdn);
//     }
// });


// function fetch_purchase_order(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];

//     // Wait silently until all 3 fields are completed
//     if (!row.category || !row.supplier ||
//         row.rate === undefined || row.rate === null || row.rate === "") {
//         return;
//     }

//     frappe.call({
//         method: "erp_custom.erp_custom.doctype.material_price_master.material_price_master.find_matching_purchase_order",

//         args: {
//             category: row.category,
//             supplier: row.supplier,
//             rate: row.rate
//         },

//         callback(r) {
//             const purchase_order = r.message || "";
//             frappe.model.set_value(cdt, cdn, "purchase_order_no", purchase_order);
//         }
//     });
// }



// ============================================================
// CHILD TABLE: Material Plate Price
// OLD purchase_order_no LOGIC IS PRESERVED
// ============================================================

// frappe.ui.form.on("Material Plate Price", {
//     category(frm, cdt, cdn) {
//         fetch_purchase_order(frm, cdt, cdn);
//         fetch_reference_purchase_orders(frm);
//     },

//     supplier(frm, cdt, cdn) {
//         fetch_purchase_order(frm, cdt, cdn);
//     },

//     rate(frm, cdt, cdn) {
//         fetch_purchase_order(frm, cdt, cdn);
//     }
// });


// // =================== Category + Supplier + Rate → purchase_order_no ================================
// function fetch_purchase_order(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];

//     // Wait silently until all 3 fields are completed
//     if (!row.category || !row.supplier ||
//         row.rate === undefined || row.rate === null || row.rate === "") {
//         return;
//     }

//     frappe.call({

//         method: "erp_custom.erp_custom.doctype.material_price_master.material_price_master.find_matching_purchase_order",
//         args: {
//             category: row.category,
//             supplier: row.supplier,
//             rate: row.rate
//         },

//         callback(r) {
//             const purchase_order = r.message || "";
//             frappe.model.set_value(cdt, cdn, "purchase_order_no", purchase_order);
//         }
//     });
// }

// // ============================================================
// // PARENT DOCTYPE: Material Price Master
// // NEW Reference Purchase Order HTML
// // ============================================================

// frappe.ui.form.on("Material Price Master", {

//     refresh(frm) {
//         fetch_reference_purchase_orders(frm);
//     },

//     plate_price_list_add(frm, cdt, cdn) {
//         fetch_reference_purchase_orders(frm);
//     },

//     plate_price_list_remove(frm, cdt, cdn) {
//         fetch_reference_purchase_orders(frm);
//     }
// });


// // ================== Child Category → Purchase Order Item Group → plate_reference_po HTML =====================

// function fetch_reference_purchase_orders(frm) {
//     const child_table = frm.doc.plate_price_list || [];

//     // ---------------------- No child rows ----------------------------------
//     if (!child_table.length) {
//         set_reference_po_html(frm, "");
//         return;
//     }

//     // ----------------------- Get categories from child table ------------------------------------
//     const categories = [...new Set(child_table.map(row => row.category).filter(Boolean))];

//     // ------------------------ No category selected ----------------------------------
//     if (!categories.length) {
//         set_reference_po_html(frm, "");
//         return;
//     }

//     // ----------------------- Fetch Purchase Orders ---------------------------------------
//     frappe.call({
//         method:
//             "erp_custom.erp_custom.doctype.material_price_master.material_price_master.find_matching_purchase_orders",
//         args: {
//             categories: JSON.stringify(categories)
//         },

//         callback(r) {
//             const purchase_orders = r.message || [];
//             render_reference_purchase_orders(frm, purchase_orders);
//         }
//     });
// }

// // ======================= Render Reference PO HTML ===================================
// function render_reference_purchase_orders(frm, purchase_orders) {
//     const groups = {};

//     purchase_orders.forEach(po => {
//         const key = po.item_group || "Uncategorized";
//         if (!groups[key]) groups[key] = [];
//         groups[key].push(po);
//     });

//     const category_names = Object.keys(groups);

//     let html = `
//         <style>
//             .rpo-wrap {
//                 border: 1px solid #e2e8f0;
//                 border-radius: 12px;
//                 overflow: hidden;
//                 margin-top: 10px;
//                 box-shadow: 0 1px 3px rgba(0,0,0,0.06);
//                 font-family: inherit;
//             }
//             .rpo-header {
//                 background: linear-gradient(135deg, #4f46e5, #6366f1);
//                 color: #fff;
//                 padding: 12px 16px;
//                 font-weight: 600;
//                 font-size: 14px;
//                 display: flex;
//                 align-items: center;
//                 gap: 8px;
//             }
//             .rpo-header .rpo-count {
//                 background: rgba(255,255,255,0.2);
//                 padding: 2px 9px;
//                 border-radius: 999px;
//                 font-size: 12px;
//                 font-weight: 500;
//             }
//             .rpo-scroll {
//                 overflow-x: auto;
//                 max-height: 420px;
//             }
//             .rpo-table {
//                 width: 100%;
//                 min-width: 1250px;
//                 border-collapse: collapse;
//                 font-size: 12.5px;
//             }
//             .rpo-table thead th {
//                 position: sticky;
//                 top: 0;
//                 background: #f8fafc;
//                 color: #475569;
//                 text-transform: uppercase;
//                 font-size: 11px;
//                 letter-spacing: 0.03em;
//                 padding: 9px 10px;
//                 border-bottom: 2px solid #e2e8f0;
//                 z-index: 1;
//             }
//             .rpo-table thead tr.rpo-subhead th {
//                 top: 34px;
//                 background: #fbfcfe;
//                 font-size: 10.5px;
//                 text-transform: none;
//                 color: #64748b;
//                 border-bottom: 1px solid #e2e8f0;
//             }
//             .rpo-group-row td {
//                 background: #eef2ff;
//                 color: #3730a3;
//                 font-weight: 600;
//                 padding: 7px 10px;
//                 border-top: 1px solid #e2e8f0;
//                 border-bottom: 1px solid #e2e8f0;
//                 font-size: 12px;
//             }
//             .rpo-table tbody tr.rpo-data:nth-child(even) {
//                 background: #f9fafb;
//             }
//             .rpo-table tbody tr.rpo-data:hover {
//                 background: #eef2ff;
//             }
//             .rpo-table td {
//                 padding: 8px 10px;
//                 border-bottom: 1px solid #f1f5f9;
//                 white-space: nowrap;
//             }
//             .rpo-po-link {
//                 color: #4f46e5;
//                 font-weight: 600;
//                 text-decoration: none;
//             }
//             .rpo-po-link:hover { text-decoration: underline; }
//             .rpo-num { text-align: right;font-variant-numeric: tabular-nums;}
//             .rpo-green { color: #16a34a !important; font-weight: 600; }

//             .rpo-badge-rate {
//                 display: inline-block;
//                 background: #dcfce7;
//                 color: #166534;
//                 font-weight: 600;
//                 padding: 2px 8px;
//                 border-radius: 999px;
//                 font-size: 12px;
//             }
//             .rpo-empty {
//                 padding: 24px;
//                 text-align: center;
//                 color: #94a3b8;
//                 font-size: 13px;
//             }
//         </style>

//         <div class="rpo-wrap">
//             <div class="rpo-header"> 📦 Reference Purchase Orders
//                 <span class="rpo-count">${purchase_orders.length}</span>
//             </div>

//             <div class="rpo-scroll">
//                 <table class="rpo-table">
//                     <thead>
//                         <tr>
//                             <th rowspan="2">Purchase Order</th>
//                             <th rowspan="2">Supplier</th>
//                             <th rowspan="2">Qty</th>
//                             <th rowspan="2">Description</th>
//                             <th colspan="4" style="text-align:center;">Dimensions</th>
//                             <th colspan="2" style="text-align:center;">Weights</th>
//                             <th colspan="2" style="text-align:center;">Rate</th>
//                         </tr>
//                         <tr class="rpo-subhead">
//                             <th>Length</th>
//                             <th>Width</th>
//                             <th>Thickness</th>
//                             <th>Density</th>
//                             <th>Kgs/Unit</th>
//                             <th>Total Wt</th>
//                             <th>Per Kg</th>
//                             <th>Rate</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//     `;

//     if (!purchase_orders.length) {

//         html += `
//             <tr>
//                 <td colspan="12" class="rpo-empty"> No matching Purchase Orders found. </td>
//             </tr>
//         `;

//     } else {
//         category_names.forEach(category => {
//             html += `
//                 <tr class="rpo-group-row">
//                     <td colspan="12">${frappe.utils.escape_html(category)} 
//                         <span style="font-weight:400; color:#6366f1;"> (${groups[category].length}) </span>
//                     </td>
//                 </tr>
//             `;

//             groups[category].forEach(po => {
//                 html += `
//                     <tr class="rpo-data">
//                         <td><a class="rpo-po-link" href="/app/purchase-order/${encodeURIComponent(po.name)}"
//                                target="_blank"> ${po.name || ""} </a> </td>
//                         <td>${po.supplier || ""}</td>
//                         <td class="rpo-num">${po.qty ?? ""}</td>
//                         <td>${po.description || ""}</td>
//                         <td class="rpo-num">${po.custom_length ?? ""}</td>
//                         <td class="rpo-num">${po.custom_width ?? ""}</td>
//                         <td class="rpo-num">${po.custom_thickness ?? ""}</td>
//                         <td class="rpo-num">${po.custom_density ?? ""}</td>
//                         <td class="rpo-num rpo-green">${po.custom_kilogramskgs ?? ""}</td>
//                         <td class="rpo-num">${po.custom_total_weights ?? ""}</td>
//                         <td class="rpo-num rpo-green">${po.custom_rate_per_kg ?? ""}</td>
//                         <td class="rpo-num"> <span class="rpo-badge-rate">${po.rate ?? ""}</span> </td>
//                     </tr>
//                 `;
//             });
//         });
//     }

//     html += `
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     `;
//     set_reference_po_html(frm, html);
// }

// // ======================= Set HTML Field ===============================
// function set_reference_po_html(frm, html) {
//     frm.set_df_property("plate_reference_po", "options", html);
//     frm.refresh_field("plate_reference_po");
// }





// ============================================================
// MATERIAL PRICE MASTER
// ============================================================
// Child Tables:
//
// Plate  -> plate_price_list  -> plate_reference_po
// Pipe   -> pipe_price_list   -> pipe_reference_po
// Tube   -> tube_price_list   -> tube_reference_po
// Rod    -> rod_price_list    -> rod_reference_po
// Flange -> flange_price_list -> flange_reference_po
//
// purchase_order_no is automatically fetched for every table.
// ============================================================


// ============================================================
// CHILD TABLE CONFIGURATION
// ============================================================

const MATERIAL_PRICE_CONFIG = {

    plate: {
        child_doctype: "Material Plate Price",
        table_field: "plate_price_list",
        html_field: "plate_reference_po",
        dimensions: [
            ["custom_length", "Length"],
            ["custom_width", "Width"],
            ["custom_thickness", "Thickness"],
            ["custom_density", "Density"]
        ]
    },

    pipe: {
        child_doctype: "Material Pipe Price",
        table_field: "pipe_price_list",
        html_field: "pipe_reference_po",
        dimensions: [
            ["custom_length", "Length"],
            ["custom_outer_diameter", "Outer Diameter"],
            ["custom_thickness", "Thickness"],
            ["custom_density", "Density"]
        ]
    },

    tube: {
        child_doctype: "Material Tube Price",
        table_field: "tube_price_list",
        html_field: "tube_reference_po",
        dimensions: [
            ["custom_length", "Length"],
            ["custom_outer_diameter", "Outer Diameter"],
            ["custom_thickness", "Thickness"],
            ["custom_density", "Density"]
        ]
    },

    rod: {
        child_doctype: "Material Rod Price",
        table_field: "rod_price_list",
        html_field: "rod_reference_po",
        dimensions: [
            ["custom_length", "Length"],
            ["custom_outer_diameter", "Outer Diameter"],
            ["custom_density", "Density"]
        ]
    },

    flange: {
        child_doctype: "Material Flange Price",
        table_field: "flange_price_list",
        html_field: "flange_reference_po",
        dimensions: [
            ["description", "Description"]
        ]
    }
};


// ============================================================
// GENERIC PURCHASE ORDER FETCH
// ============================================================

function fetch_material_purchase_order(frm, cdt, cdn) {

    const row = locals[cdt][cdn];

    // Wait until required fields are available
    if (
        !row.category ||
        !row.supplier ||
        row.rate === undefined ||
        row.rate === null ||
        row.rate === ""
    ) {
        return;
    }

    frappe.call({

        method:
            "erp_custom.erp_custom.doctype.material_price_master.material_price_master.find_matching_purchase_order",

        args: {
            category: row.category,
            supplier: row.supplier,
            rate: row.rate
        },

        callback(r) {

            const purchase_order = r.message || "";

            frappe.model.set_value(
                cdt,
                cdn,
                "purchase_order_no",
                purchase_order
            );
        }
    });
}


// ============================================================
// PLATE CHILD TABLE
// ============================================================

frappe.ui.form.on("Material Plate Price", {

    category(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
        fetch_all_reference_purchase_orders(frm);
    },

    supplier(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    },

    rate(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    }
});


// ============================================================
// PIPE CHILD TABLE
// ============================================================

frappe.ui.form.on("Material Pipe Price", {

    category(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
        fetch_all_reference_purchase_orders(frm);
    },

    supplier(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    },

    rate(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    }
});


// ============================================================
// TUBE CHILD TABLE
// ============================================================

frappe.ui.form.on("Material Tube Price", {

    category(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
        fetch_all_reference_purchase_orders(frm);
    },

    supplier(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    },

    rate(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    }
});


// ============================================================
// ROD CHILD TABLE
// ============================================================

frappe.ui.form.on("Material Rod Price", {

    category(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
        fetch_all_reference_purchase_orders(frm);
    },

    supplier(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    },

    rate(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    }
});


// ============================================================
// FLANGE CHILD TABLE
// ============================================================

frappe.ui.form.on("Material Flange Price", {

    category(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
        fetch_all_reference_purchase_orders(frm);
    },

    supplier(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    },

    rate(frm, cdt, cdn) {
        fetch_material_purchase_order(frm, cdt, cdn);
    }
});


// ============================================================
// PARENT DOCTYPE
// ============================================================

frappe.ui.form.on("Material Price Master", {

    refresh(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    // ---------------- PLATE ----------------
    plate_price_list_add(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    plate_price_list_remove(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    // ---------------- PIPE ----------------
    pipe_price_list_add(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    pipe_price_list_remove(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    // ---------------- TUBE ----------------
    tube_price_list_add(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    tube_price_list_remove(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    // ---------------- ROD ----------------
    rod_price_list_add(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    rod_price_list_remove(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    // ---------------- FLANGE ----------------
    flange_price_list_add(frm) {
        fetch_all_reference_purchase_orders(frm);
    },

    flange_price_list_remove(frm) {
        fetch_all_reference_purchase_orders(frm);
    }
});


// ============================================================
// FETCH ALL 5 REFERENCE PO TABLES
// ============================================================

function fetch_all_reference_purchase_orders(frm) {

    Object.keys(MATERIAL_PRICE_CONFIG).forEach(material => {

        fetch_reference_purchase_orders(
            frm,
            material
        );

    });
}


// ============================================================
// FETCH REFERENCE PURCHASE ORDERS
// ============================================================

function fetch_reference_purchase_orders(frm, material) {

    const config = MATERIAL_PRICE_CONFIG[material];

    const child_table = frm.doc[config.table_field] || [];

    // No child rows
    if (!child_table.length) {

        set_reference_po_html(
            frm,
            config.html_field,
            ""
        );

        return;
    }


    // Get categories
    const categories = [
        ...new Set(
            child_table
                .map(row => row.category)
                .filter(Boolean)
        )
    ];


    // No category
    if (!categories.length) {

        set_reference_po_html(
            frm,
            config.html_field,
            ""
        );

        return;
    }


    // Fetch Purchase Orders
    frappe.call({

        method:
            "erp_custom.erp_custom.doctype.material_price_master.material_price_master.find_matching_purchase_orders",

        args: {
            categories: JSON.stringify(categories)
        },

        callback(r) {

            const purchase_orders = r.message || [];

            render_reference_purchase_orders(
                frm,
                material,
                purchase_orders
            );
        }
    });
}


// ============================================================
// RENDER REFERENCE PO TABLE
// ============================================================

function render_reference_purchase_orders(
    frm,
    material,
    purchase_orders
) {

    const config = MATERIAL_PRICE_CONFIG[material];

    const groups = {};


    // Group by Item Group
    purchase_orders.forEach(po => {

        const key = po.item_group || "Uncategorized";

        if (!groups[key]) {
            groups[key] = [];
        }

        groups[key].push(po);
    });


    const category_names = Object.keys(groups);


    // ========================================================
    // TABLE HEADER
    // ========================================================

    let dimension_headers = "";

    config.dimensions.forEach(dimension => {

        dimension_headers += `
            <th>${dimension[1]}</th>
        `;
    });


    let dimension_colspan = config.dimensions.length;


    let html = `

        <style>

            .rpo-wrap {
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                overflow: hidden;
                margin-top: 10px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                font-family: inherit;
            }

            .rpo-header {
                background: linear-gradient(
                    135deg,
                    #4f46e5,
                    #6366f1
                );

                color: #fff;

                padding: 12px 16px;

                font-weight: 600;

                font-size: 14px;

                display: flex;

                align-items: center;

                gap: 8px;
            }

            .rpo-header .rpo-count {
                background: rgba(255,255,255,0.2);

                padding: 2px 9px;

                border-radius: 999px;

                font-size: 12px;

                font-weight: 500;
            }

            .rpo-scroll {
                overflow-x: auto;

                max-height: 420px;
            }

            .rpo-table {
                width: 100%;

                min-width: 1100px;

                border-collapse: collapse;

                font-size: 12.5px;
            }

            .rpo-table thead th {

                position: sticky;

                top: 0;

                background: #f8fafc;

                color: #475569;

                text-transform: uppercase;

                font-size: 11px;

                letter-spacing: 0.03em;

                padding: 9px 10px;

                border-bottom: 2px solid #e2e8f0;

                z-index: 1;
            }

            .rpo-table tbody tr.rpo-data:nth-child(even) {
                background: #f9fafb;
            }

            .rpo-table tbody tr.rpo-data:hover {
                background: #eef2ff;
            }

            .rpo-table td {

                padding: 8px 10px;

                border-bottom: 1px solid #f1f5f9;

                white-space: nowrap;
            }

            .rpo-group-row td {

                background: #eef2ff;

                color: #3730a3;

                font-weight: 600;

                padding: 7px 10px;

                border-top: 1px solid #e2e8f0;

                border-bottom: 1px solid #e2e8f0;

                font-size: 12px;
            }

            .rpo-po-link {

                color: #4f46e5;

                font-weight: 600;

                text-decoration: none;
            }

            .rpo-po-link:hover {
                text-decoration: underline;
            }

            .rpo-num {

                text-align: right;

                font-variant-numeric: tabular-nums;
            }

            .rpo-green {

                color: #16a34a !important;

                font-weight: 600;
            }

            .rpo-badge-rate {

                display: inline-block;

                background: #dcfce7;

                color: #166534;

                font-weight: 600;

                padding: 2px 8px;

                border-radius: 999px;

                font-size: 12px;
            }

            .rpo-empty {

                padding: 24px;

                text-align: center;

                color: #94a3b8;

                font-size: 13px;
            }

        </style>


        <div class="rpo-wrap">

            <div class="rpo-header">

                📦 Reference Purchase Orders

                <span class="rpo-count">
                    ${purchase_orders.length}
                </span>

            </div>


            <div class="rpo-scroll">

                <table class="rpo-table">

                    <thead>

                        <tr>

                            <th rowspan="2">
                                Purchase Order
                            </th>

                            <th rowspan="2">
                                Supplier
                            </th>

                            <th rowspan="2">
                                Qty
                            </th>

                            <th rowspan="2">
                                Description
                            </th>

                            <th colspan="${dimension_colspan}"
                                style="text-align:center;">
                                Dimensions
                            </th>

                            <th colspan="2"
                                style="text-align:center;">
                                Weights
                            </th>

                            <th colspan="2"
                                style="text-align:center;">
                                Rate
                            </th>

                        </tr>


                        <tr class="rpo-subhead">

                            ${dimension_headers}

                            <th>
                                Kgs/Unit
                            </th>

                            <th>
                                Total Wt
                            </th>

                            <th>
                                Per Kg
                            </th>

                            <th>
                                Rate
                            </th>

                        </tr>

                    </thead>


                    <tbody>
    `;


    // ========================================================
    // NO PO
    // ========================================================

    if (!purchase_orders.length) {

        html += `

            <tr>

                <td
                    colspan="${4 + dimension_colspan + 4}"
                    class="rpo-empty">

                    No matching Purchase Orders found.

                </td>

            </tr>

        `;

    }

    // ========================================================
    // PO DATA
    // ========================================================

    else {

        category_names.forEach(category => {

            html += `

                <tr class="rpo-group-row">

                    <td colspan="${4 + dimension_colspan + 4}">

                        ${frappe.utils.escape_html(category)}

                        <span
                            style="
                                font-weight:400;
                                color:#6366f1;
                            "
                        >
                            (${groups[category].length})
                        </span>

                    </td>

                </tr>

            `;


            groups[category].forEach(po => {

                html += `

                    <tr class="rpo-data">

                        <td>

                            <a
                                class="rpo-po-link"
                                href="/app/purchase-order/${encodeURIComponent(po.name)}"
                                target="_blank"
                            >
                                ${frappe.utils.escape_html(
                                    po.name || ""
                                )}
                            </a>

                        </td>


                        <td>
                            ${frappe.utils.escape_html(
                                po.supplier || ""
                            )}
                        </td>


                        <td class="rpo-num">
                            ${po.qty ?? ""}
                        </td>


                        <td>
                            ${frappe.utils.escape_html(po.description || "")}
                        </td>
                `;


                // ====================================================
                // DYNAMIC DIMENSIONS
                // ====================================================

                config.dimensions.forEach(dimension => {

                    const fieldname = dimension[0];

                    const value = po[fieldname] ?? "";

                    html += `

                        <td class="rpo-num">

                            ${value}

                        </td>

                    `;
                });


                html += `

                        <td class="rpo-num rpo-green">
                            ${po.custom_kilogramskgs ?? ""}
                        </td>

                        <td class="rpo-num">
                            ${po.custom_total_weights ?? ""}
                        </td>

                        <td class="rpo-num rpo-green">
                            ${po.custom_rate_per_kg ?? ""}
                        </td>

                        <td class="rpo-num">

                            <span class="rpo-badge-rate">

                                ${po.rate ?? ""}

                            </span>

                        </td>

                    </tr>

                `;
            });
        });
    }


    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    set_reference_po_html(
        frm,
        config.html_field,
        html
    );
}


// ============================================================
// SET HTML FIELD
// ============================================================

function set_reference_po_html(
    frm,
    fieldname,
    html
) {

    frm.set_df_property(
        fieldname,
        "options",
        html
    );

    frm.refresh_field(fieldname);
}