
// ========================= PURCHASE ORDER (PARENT) =====================================
frappe.ui.form.on("Purchase Order", {

    refresh(frm) {
        calculate_total(frm);
        // sync_fields_from_sq_to_po(frm);
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button("📧 Send Email for Purchase", function () {
                frappe.call({
                    method: "erp_custom.erp_custom.overrides.purchase_order.sent_po_supplier",
                    args: {
                        doc: frm.doc.name  
                    }
                });
            });
        }
    },

supplier(frm) {
        if (!frm.doc.supplier) return;

        frappe.db.get_value("Supplier", frm.doc.supplier, "is_transporter")
            .then(r => {
                if (r.message.is_transporter) {
                    frm.set_value("custom_order_type", "Transport Order");
                }
                else if (frm.doc.is_subcontracted == 1) {
                    frm.set_value("custom_order_type", "Work Order");
                }
                else {
                    frm.set_value("custom_order_type", "Purchase Order");
                }
            });
    },

    is_subcontracted(frm) {
        frm.trigger("supplier");
    },

    validate(frm) {
        calculate_total(frm);

        return frappe.call({
            method: "erp_custom.erp_custom.overrides.purchase_order.validate_item_workflow",
            args: {
                supplier: frm.doc.supplier
            }
        }).then(r => {

            if (r.message.status === "error") {
                frappe.throw(r.message.message);
            }

            let promises = [];

            (frm.doc.items || []).forEach(row => {
                if (row.item_code) {
                    let p = frappe.call({
                        method: "erp_custom.erp_custom.overrides.purchase_order.validate_item_workflow",
                        args: {
                            item_code: row.item_code
                        }
                    }).then(r => {
                        if (r.message.status === "error") {
                            frappe.throw(r.message.message);
                        }
                    });

                    promises.push(p);
                }
            });

            return Promise.all(promises);
        });
    },
});


// ======================== PURCHASE ORDER ITEM (CHILD) ====================================
frappe.ui.form.on("Purchase Order Item", {
    custom_rate_per_kg(frm, cdt, cdn) {
        calculate_rate_from_weight(frm, cdt, cdn);
        calculate_custom_amount(frm, cdt, cdn);
    },
    amount(frm, cdt, cdn) {
        calculate_total(frm);
    },

    custom_length(frm, cdt, cdn) {
        calculate_kgs(frm, cdt, cdn);
        calculate_meter(frm, cdt, cdn);
    },

    qty(frm, cdt, cdn) {
        calculate_total(frm);
        calculate_total_weight(frm, cdt, cdn);
        calculate_meter(frm, cdt, cdn);
    },

    rate(frm, cdt, cdn) {
        calculate_total(frm);
        calculate_custom_amount(frm, cdt, cdn);
    },
    items_add(frm) {
        calculate_total(frm);
    },

    items_remove(frm) {
        calculate_total(frm);
    },

    item_code(frm, cdt, cdn) {
        const row = locals[cdt][cdn];
        if (!row.item_code) return;

        frappe.db.get_value(
            "Item",
            row.item_code,
            ["item_group", "default_bom", "custom_material_type", "custom_density","custom_thickness"]
        ).then(r => {
            if (!r || !r.message) return;

            const item = r.message;

            frappe.model.set_value(cdt, cdn, "custom_item_group", item.item_group || "");
            frappe.model.set_value(cdt, cdn, "bom_no", item.default_bom || "");
            frappe.model.set_value(cdt, cdn, "custom_material_type", item.custom_material_type || "");
            frappe.model.set_value(cdt, cdn, "custom_density", item.custom_density || 0);
            frappe.model.set_value(cdt, cdn, "custom_thickness", item.custom_thickness || 0);

            calculate_kgs(frm, cdt, cdn);
            toggle_total_field(frm);
        });
    },

    // custom_length: calculate_kgs,
    custom_width: calculate_kgs,
    custom_thickness: calculate_kgs,
    custom_outer_diameter: calculate_kgs,
    custom_inner_diameter: calculate_kgs,
    custom_density: calculate_kgs,

    custom_scrap_margin_percentage: calculate_scrap_and_transport,
    custom_transportation_cost: calculate_scrap_and_transport
});

// ====================== WEIGHT PER UNIT (Kg) ==================================
function calculate_kgs(frm, cdt, cdn) {

    const row = locals[cdt][cdn];
    const density = flt(row.custom_density);
    const qty = flt(row.qty);
    const item_group = row.item_group;
    const shape = row.custom_shape;

    const L = flt(row.custom_length);
    const W = flt(row.custom_width);
    const T = flt(row.custom_thickness);
    const OD = flt(row.custom_outer_diameter);
    const ID = flt(row.custom_inner_diameter);

    const π = Math.PI;
    let base_weight = 0;

    // ================ MANUAL ENTRY MODE =====================
    if (shape === "N/A") {
        let kg = flt(row.custom_kilogramskgs);
        let total = flt(row.custom_total_weights);

        if (kg > 0 && qty > 0) {
            total = kg * qty;
        }
        else if (total > 0 && qty > 0) {
            kg = total / qty;
        }

        frappe.model.set_value(cdt, cdn, "custom_kilogramskgs", flt(kg, 4));
        frappe.model.set_value(cdt, cdn, "custom_total_weights", flt(total, 4));

        calculate_rate_from_weight(frm, cdt, cdn);
        calculate_custom_amount(frm, cdt, cdn);
        calculate_scrap_and_transport(frm, cdt, cdn);
        return;
    }

    if (!density) {
        frappe.model.set_value(cdt, cdn, "custom_kilogramskgs", 0);
        frappe.model.set_value(cdt, cdn, "custom_total_weights", 0);
        return;
    }

    // ================= PLATES =====================
    if (item_group === "Plates") {
        if (shape === "Rectangle" && L && W && T) {
            base_weight = (L * W * T * density) / 1000000;
        }

        else if (shape === "Circle" && OD && T) {
            base_weight = (π * Math.pow(OD / 2, 2) * T * density) / 1000000;
        }

        else if (shape === "Hollow") {
            const OD_calc = OD || (ID + (2 * T));
            base_weight = (π * (Math.pow(OD_calc / 2, 2) - Math.pow(ID / 2, 2)) * L * density) / 1000000;
        }
    }

    // =================== PIPES / TUBES =======================
    else if (item_group === "Pipes" || item_group === "Tubes") {
        if (shape === "Hollow" && OD && T && L) {
            const ID_calc = OD - (2 * T);
            if (ID_calc > 0) {
                base_weight = (π * (Math.pow(OD / 2, 2) - Math.pow(ID_calc / 2, 2)) * L * density) / 1000000;
            }
        }
    }

    // ==================== FORGINGS ========================
    else if (item_group === "Forgings") {
        if (shape === "Hollow" && OD && T && L) {
            const ID_calc = OD - (2 * T);
            base_weight = (π * (Math.pow(OD / 2, 2) - Math.pow(ID_calc / 2, 2)) * L * density) / 1000000;
        }

        else if (shape === "Circle" && OD && T) {
            base_weight = (π * Math.pow(OD / 2, 2) * T * density) / 1000000;
        }
    }

    // ================== RODS ======================
    else if (item_group === "Rods") {
        if (shape === "Circle" && OD && L) {
            base_weight = (π * Math.pow(OD / 2, 2) * L * density) / 1000000;
        }
    }

    // =================== FLANGES / RINGS =====================
    else if (item_group === "Flanges" || item_group === "Rings") {
        if (OD && ID && T) {
            base_weight = (π * ( Math.pow(OD / 2, 2) - Math.pow(ID / 2, 2)) * T * density) / 1000000;
        }
    }

    const kg = flt(base_weight, 4);
    const total = flt(base_weight * qty, 4);

    if (flt(row.custom_kilogramskgs) !== kg) {
        frappe.model.set_value(cdt, cdn, "custom_kilogramskgs", kg);
    }

    if (flt(row.custom_total_weights) !== total) {
        frappe.model.set_value(cdt, cdn, "custom_total_weights", total);
    }
}

// ================================= TOTAL WEIGHT =======================================
function calculate_total_weight(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const total_weight = flt(row.qty) * flt(row.custom_kilogramskgs);

    if (flt(row.custom_total_weights) !== flt(total_weight, 4)) {
    frappe.model.set_value(cdt, cdn, "custom_total_weights", flt(total_weight, 4));
    }

    calculate_rate_from_weight(frm, cdt, cdn);
    calculate_custom_amount(frm, cdt, cdn);
    calculate_scrap_and_transport(frm, cdt, cdn);
}

// ================================= TOTAL METER =======================================
function calculate_meter(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const length = flt(row.custom_length);
    const qty = flt(row.qty);

    const mtr_per_unit = length / 1000;
    const total_mtr = mtr_per_unit * qty;

    if (flt(row.custom_mtr_per_unit) !== flt(mtr_per_unit, 4)) {
        frappe.model.set_value(cdt, cdn, "custom_mtr_per_unit", flt(mtr_per_unit, 4));
    }

    if (flt(row.custom_total_mtr) !== flt(total_mtr, 4)) {
        frappe.model.set_value(cdt, cdn, "custom_total_mtr", flt(total_mtr, 4));
    }
}

// =========================== AMOUNT =================================
function calculate_custom_amount(frm, cdt, cdn) {
    const row = locals[cdt][cdn];

    const qty = flt(row.qty) || 0;
    const rate = flt(row.rate) || 0;
    const amount = qty * rate;

    // ✅ Update standard amount field (IMPORTANT)
    if (flt(row.amount) !== flt(amount, 2)) {
    frappe.model.set_value(cdt, cdn, "amount", flt(amount, 2));
    }

    calculate_total(frm);
}


// ============================ SCRAP & TRANSPORT =====================================
function calculate_scrap_and_transport(frm, cdt, cdn) {
    const row = locals[cdt][cdn];

    const total_weight = flt(row.custom_total_weights) || 0;
    const scrap_pct = flt(row.custom_scrap_margin_percentage) || 0;
    const transport_rate = flt(row.custom_transportation_cost) || 0;

    frappe.model.set_value(cdt, cdn, "custom_scrap_margin_kg", flt(total_weight * (scrap_pct / 100), 4));
    frappe.model.set_value(cdt, cdn, "custom_transportation_cost_", flt(total_weight * transport_rate, 2));
}

// ============================= RATE CALCULATION ==========================================
function calculate_rate_from_weight(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const kg = flt(row.custom_kilogramskgs) || 0;
    const rate_per_kg = flt(row.custom_rate_per_kg) || 0;
    const rate = kg * rate_per_kg;

    frappe.model.set_value(cdt, cdn, "rate", flt(rate, 2));
}

function update_amount(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    row.amount = (flt(row.qty) * flt(row.rate));

    frm.refresh_field('items');
    calculate_total(frm);
}

// ====================== CALCULATE PARENT TOTAL ============================
function calculate_total(frm) {
    let total = 0;

    (frm.doc.items || []).forEach(row => {
        total += flt(row.amount);
    });

    if (flt(frm.doc.total) !== flt(total, 2)) {
    frm.set_value('total', flt(total, 2));
    }
}







// // ========================= PURCHASE ORDER (PARENT) =====================================
// frappe.ui.form.on("Purchase Order", {

//     refresh(frm) {
//         calculate_total(frm);
//         // sync_fields_from_sq_to_po(frm);
//         if (frm.doc.docstatus === 1) {
//             frm.add_custom_button("📧 Send Email for Purchase", function () {
//                 frappe.call({
//                     method: "erp_custom.erp_custom.overrides.purchase_order.sent_po_supplier",
//                     args: {
//                         doc: frm.doc.name  
//                     }
//                 });
//             });
//         }

//         // ---- NEW: custom "MTC" section in the right sidebar ----
//         render_mtc_section(frm);
//     },

// supplier(frm) {
//         if (!frm.doc.supplier) return;

//         frappe.db.get_value("Supplier", frm.doc.supplier, "is_transporter")
//             .then(r => {
//                 if (r.message.is_transporter) {
//                     frm.set_value("custom_order_type", "Transport Order");
//                 }
//                 else if (frm.doc.is_subcontracted == 1) {
//                     frm.set_value("custom_order_type", "Work Order");
//                 }
//                 else {
//                     frm.set_value("custom_order_type", "Purchase Order");
//                 }
//             });
//     },

//     is_subcontracted(frm) {
//         frm.trigger("supplier");
//     },

//     validate(frm) {
//         calculate_total(frm);

//         return frappe.call({
//             method: "erp_custom.erp_custom.overrides.purchase_order.validate_item_workflow",
//             args: {
//                 supplier: frm.doc.supplier
//             }
//         }).then(r => {

//             if (r.message.status === "error") {
//                 frappe.throw(r.message.message);
//             }

//             let promises = [];

//             (frm.doc.items || []).forEach(row => {
//                 if (row.item_code) {
//                     let p = frappe.call({
//                         method: "erp_custom.erp_custom.overrides.purchase_order.validate_item_workflow",
//                         args: {
//                             item_code: row.item_code
//                         }
//                     }).then(r => {
//                         if (r.message.status === "error") {
//                             frappe.throw(r.message.message);
//                         }
//                     });

//                     promises.push(p);
//                 }
//             });

//             return Promise.all(promises);
//         });
//     },
// });


// // ======================== PURCHASE ORDER ITEM (CHILD) ====================================
// frappe.ui.form.on("Purchase Order Item", {
//     custom_rate_per_kg(frm, cdt, cdn) {
//         calculate_rate_from_weight(frm, cdt, cdn);
//         calculate_custom_amount(frm, cdt, cdn);
//     },
//     amount(frm, cdt, cdn) {
//         calculate_total(frm);
//     },

//     custom_length(frm, cdt, cdn) {
//         calculate_kgs(frm, cdt, cdn);
//         calculate_meter(frm, cdt, cdn);
//     },

//     qty(frm, cdt, cdn) {
//         calculate_total(frm);
//         calculate_total_weight(frm, cdt, cdn);
//         calculate_meter(frm, cdt, cdn);
//     },

//     rate(frm, cdt, cdn) {
//         calculate_total(frm);
//         calculate_custom_amount(frm, cdt, cdn);
//     },
//     items_add(frm) {
//         calculate_total(frm);
//     },

//     items_remove(frm) {
//         calculate_total(frm);
//     },

//     item_code(frm, cdt, cdn) {
//         const row = locals[cdt][cdn];
//         if (!row.item_code) return;

//         frappe.db.get_value(
//             "Item",
//             row.item_code,
//             ["item_group", "default_bom", "custom_material_type", "custom_density","custom_thickness"]
//         ).then(r => {
//             if (!r || !r.message) return;

//             const item = r.message;

//             frappe.model.set_value(cdt, cdn, "custom_item_group", item.item_group || "");
//             frappe.model.set_value(cdt, cdn, "bom_no", item.default_bom || "");
//             frappe.model.set_value(cdt, cdn, "custom_material_type", item.custom_material_type || "");
//             frappe.model.set_value(cdt, cdn, "custom_density", item.custom_density || 0);
//             frappe.model.set_value(cdt, cdn, "custom_thickness", item.custom_thickness || 0);

//             calculate_kgs(frm, cdt, cdn);
//             toggle_total_field(frm);
//         });
//     },

//     // custom_length: calculate_kgs,
//     custom_width: calculate_kgs,
//     custom_thickness: calculate_kgs,
//     custom_outer_diameter: calculate_kgs,
//     custom_inner_diameter: calculate_kgs,
//     custom_density: calculate_kgs,

//     custom_scrap_margin_percentage: calculate_scrap_and_transport,
//     custom_transportation_cost: calculate_scrap_and_transport
// });

// // ====================== WEIGHT PER UNIT (Kg) ==================================
// function calculate_kgs(frm, cdt, cdn) {

//     const row = locals[cdt][cdn];
//     const density = flt(row.custom_density);
//     const qty = flt(row.qty);
//     const item_group = row.item_group;
//     const shape = row.custom_shape;

//     const L = flt(row.custom_length);
//     const W = flt(row.custom_width);
//     const T = flt(row.custom_thickness);
//     const OD = flt(row.custom_outer_diameter);
//     const ID = flt(row.custom_inner_diameter);

//     const π = Math.PI;
//     let base_weight = 0;

//     // ================ MANUAL ENTRY MODE =====================
//     if (shape === "N/A") {
//         let kg = flt(row.custom_kilogramskgs);
//         let total = flt(row.custom_total_weights);

//         if (kg > 0 && qty > 0) {
//             total = kg * qty;
//         }
//         else if (total > 0 && qty > 0) {
//             kg = total / qty;
//         }

//         frappe.model.set_value(cdt, cdn, "custom_kilogramskgs", flt(kg, 4));
//         frappe.model.set_value(cdt, cdn, "custom_total_weights", flt(total, 4));

//         calculate_rate_from_weight(frm, cdt, cdn);
//         calculate_custom_amount(frm, cdt, cdn);
//         calculate_scrap_and_transport(frm, cdt, cdn);
//         return;
//     }

//     if (!density) {
//         frappe.model.set_value(cdt, cdn, "custom_kilogramskgs", 0);
//         frappe.model.set_value(cdt, cdn, "custom_total_weights", 0);
//         return;
//     }

//     // ================= PLATES =====================
//     if (item_group === "Plates") {
//         if (shape === "Rectangle" && L && W && T) {
//             base_weight = (L * W * T * density) / 1000000;
//         }

//         else if (shape === "Circle" && OD && T) {
//             base_weight = (π * Math.pow(OD / 2, 2) * T * density) / 1000000;
//         }

//         else if (shape === "Hollow") {
//             const OD_calc = OD || (ID + (2 * T));
//             base_weight = (π * (Math.pow(OD_calc / 2, 2) - Math.pow(ID / 2, 2)) * L * density) / 1000000;
//         }
//     }

//     // =================== PIPES / TUBES =======================
//     else if (item_group === "Pipes" || item_group === "Tubes") {
//         if (shape === "Hollow" && OD && T && L) {
//             const ID_calc = OD - (2 * T);
//             if (ID_calc > 0) {
//                 base_weight = (π * (Math.pow(OD / 2, 2) - Math.pow(ID_calc / 2, 2)) * L * density) / 1000000;
//             }
//         }
//     }

//     // ==================== FORGINGS ========================
//     else if (item_group === "Forgings") {
//         if (shape === "Hollow" && OD && T && L) {
//             const ID_calc = OD - (2 * T);
//             base_weight = (π * (Math.pow(OD / 2, 2) - Math.pow(ID_calc / 2, 2)) * L * density) / 1000000;
//         }

//         else if (shape === "Circle" && OD && T) {
//             base_weight = (π * Math.pow(OD / 2, 2) * T * density) / 1000000;
//         }
//     }

//     // ================== RODS ======================
//     else if (item_group === "Rods") {
//         if (shape === "Circle" && OD && L) {
//             base_weight = (π * Math.pow(OD / 2, 2) * L * density) / 1000000;
//         }
//     }

//     // =================== FLANGES / RINGS =====================
//     else if (item_group === "Flanges" || item_group === "Rings") {
//         if (OD && ID && T) {
//             base_weight = (π * ( Math.pow(OD / 2, 2) - Math.pow(ID / 2, 2)) * T * density) / 1000000;
//         }
//     }

//     const kg = flt(base_weight, 4);
//     const total = flt(base_weight * qty, 4);

//     if (flt(row.custom_kilogramskgs) !== kg) {
//         frappe.model.set_value(cdt, cdn, "custom_kilogramskgs", kg);
//     }

//     if (flt(row.custom_total_weights) !== total) {
//         frappe.model.set_value(cdt, cdn, "custom_total_weights", total);
//     }
// }

// // ================================= TOTAL WEIGHT =======================================
// function calculate_total_weight(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];
//     const total_weight = flt(row.qty) * flt(row.custom_kilogramskgs);

//     if (flt(row.custom_total_weights) !== flt(total_weight, 4)) {
//     frappe.model.set_value(cdt, cdn, "custom_total_weights", flt(total_weight, 4));
//     }

//     calculate_rate_from_weight(frm, cdt, cdn);
//     calculate_custom_amount(frm, cdt, cdn);
//     calculate_scrap_and_transport(frm, cdt, cdn);
// }

// // ================================= TOTAL METER =======================================
// function calculate_meter(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];
//     const length = flt(row.custom_length);
//     const qty = flt(row.qty);

//     const mtr_per_unit = length / 1000;
//     const total_mtr = mtr_per_unit * qty;

//     if (flt(row.custom_mtr_per_unit) !== flt(mtr_per_unit, 4)) {
//         frappe.model.set_value(cdt, cdn, "custom_mtr_per_unit", flt(mtr_per_unit, 4));
//     }

//     if (flt(row.custom_total_mtr) !== flt(total_mtr, 4)) {
//         frappe.model.set_value(cdt, cdn, "custom_total_mtr", flt(total_mtr, 4));
//     }
// }

// // =========================== AMOUNT =================================
// function calculate_custom_amount(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];

//     const qty = flt(row.qty) || 0;
//     const rate = flt(row.rate) || 0;
//     const amount = qty * rate;

//     // ✅ Update standard amount field (IMPORTANT)
//     if (flt(row.amount) !== flt(amount, 2)) {
//     frappe.model.set_value(cdt, cdn, "amount", flt(amount, 2));
//     }

//     calculate_total(frm);
// }


// // ============================ SCRAP & TRANSPORT =====================================
// function calculate_scrap_and_transport(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];

//     const total_weight = flt(row.custom_total_weights) || 0;
//     const scrap_pct = flt(row.custom_scrap_margin_percentage) || 0;
//     const transport_rate = flt(row.custom_transportation_cost) || 0;

//     frappe.model.set_value(cdt, cdn, "custom_scrap_margin_kg", flt(total_weight * (scrap_pct / 100), 4));
//     frappe.model.set_value(cdt, cdn, "custom_transportation_cost_", flt(total_weight * transport_rate, 2));
// }

// // ============================= RATE CALCULATION ==========================================
// function calculate_rate_from_weight(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];
//     const kg = flt(row.custom_kilogramskgs) || 0;
//     const rate_per_kg = flt(row.custom_rate_per_kg) || 0;
//     const rate = kg * rate_per_kg;

//     frappe.model.set_value(cdt, cdn, "rate", flt(rate, 2));
// }

// function update_amount(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];
//     row.amount = (flt(row.qty) * flt(row.rate));

//     frm.refresh_field('items');
//     calculate_total(frm);
// }

// // ====================== CALCULATE PARENT TOTAL ============================
// function calculate_total(frm) {
//     let total = 0;

//     (frm.doc.items || []).forEach(row => {
//         total += flt(row.amount);
//     });

//     if (flt(frm.doc.total) !== flt(total, 2)) {
//     frm.set_value('total', flt(total, 2));
//     }
// }


// // ================================================================================
// // ============================ NEW: MTC SIDEBAR SECTION =========================
// // ================================================================================
// // Requirement: create a HIDDEN field "custom_mtc_attachments" (Type: Long Text)
// // on Purchase Order via Customize Form. It just stores a JSON string list of
// // [{file_name, file_url}, ...] and is never shown as a normal form field.
// //
// // This block only READS/WRITES that field and injects DOM into the sidebar.
// // It does not touch any of the calculation logic above.
// // ================================================================================

// function render_mtc_section(frm) {
//     // Sidebar attachment linking needs the doc to exist on the server
//     if (frm.is_new()) return;
//     if (!frm.sidebar || !frm.sidebar.sidebar) return;

//     // Remove any previously rendered MTC block first, so refresh() never duplicates it
//     frm.sidebar.sidebar.find(".custom-mtc-section").remove();

//     const $section = $(`
//         <div class="custom-mtc-section" style="margin-top:15px; padding:12px 12px 12px 12px; border-top:1px solid var(--border-color, #d1d8dd);">
//             <div class="mtc-header" style="display:flex; align-items:center; justify-content:space-between;">
//                 <div style="display:flex; align-items:center; gap:6px;">
//                     <i class="fa fa-paperclip text-muted"></i>
//                     <span style="font-weight:600; font-size:13px;">MTC</span>
//                 </div>
//                 <div class="mtc-add-btn" title="Add MTC file"
//                      style="cursor:pointer; width:20px; height:20px; display:flex; align-items:center; justify-content:center; border-radius:3px;">
//                     <i class="fa fa-plus text-muted"></i>
//                 </div>
//             </div>
//             <div class="mtc-file-list" style="margin-top:8px;"></div>
//         </div>
//     `);

//     // Place it right after Frappe's own "Attachments" sidebar block so it visually
//     // sits below it, but it is a completely separate list.
//     const $attachmentsBlock = frm.sidebar.sidebar.find(".form-attachments");
//     if ($attachmentsBlock.length) {
//         $attachmentsBlock.after($section);
//     } else {
//         frm.sidebar.sidebar.append($section);
//     }

//     // Plus icon -> upload a file WITHOUT attaching it via the normal doc-attachment
//     // mechanism (no doctype/docname passed to FileUploader), so it will NOT show up
//     // in the standard "Attachments" list/counter above.
//     $section.find(".mtc-add-btn").on("click", function () {
//         new frappe.ui.FileUploader({
//             allow_multiple: false,
//             on_success(file_doc) {
//                 let list = get_mtc_list(frm);
//                 list.push({
//                     file_name: file_doc.file_name,
//                     file_url: file_doc.file_url
//                 });
//                 frm.set_value("custom_mtc_attachments", JSON.stringify(list));
//                 frm.save().then(() => render_mtc_file_list(frm, $section));
//             }
//         });
//     });

//     render_mtc_file_list(frm, $section);
// }

// function get_mtc_list(frm) {
//     try {
//         return JSON.parse(frm.doc.custom_mtc_attachments || "[]");
//     } catch (e) {
//         return [];
//     }
// }

// function render_mtc_file_list(frm, $section) {
//     const $list = $section.find(".mtc-file-list");
//     $list.empty();

//     const files = get_mtc_list(frm);

//     if (!files.length) {
//         $list.append(`<div class="text-muted" style="font-size:12px;">No MTC files added</div>`);
//         return;
//     }

//     files.forEach((f, idx) => {
//         const $row = $(`
//             <div class="mtc-file-row" style="display:flex; align-items:center; justify-content:space-between; padding:3px 0;">
//                 <a href="${f.file_url}" target="_blank"
//                    style="font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:170px;"
//                    title="${f.file_name}">
//                     ${f.file_name}
//                 </a>
//                 <i class="fa fa-times mtc-remove-btn" data-idx="${idx}" title="Remove"
//                    style="cursor:pointer; font-size:11px; color:#c00;"></i>
//             </div>
//         `);
//         $list.append($row);
//     });

//     $list.find(".mtc-remove-btn").on("click", function () {
//         const idx = $(this).data("idx");
//         let list = get_mtc_list(frm);
//         list.splice(idx, 1);
//         frm.set_value("custom_mtc_attachments", JSON.stringify(list));
//         frm.save().then(() => render_mtc_file_list(frm, $section));
//     });
// }