
// =====================================================
// SUPPLIER QUOTATION (PARENT)
// =====================================================
frappe.ui.form.on("Supplier Quotation", {
    refresh(frm) {
        if (frm.is_new()) {
            calculate_total(frm);
        }

        if (frm.doc.docstatus === 1) {
            frm.remove_custom_button("Quotation", "Create");
            setTimeout(() => {
                frm.remove_custom_button("Quotation", "Create");
            }, 500);
        }
    },

    validate(frm) {
        calculate_total(frm);
    },

    onload_post_render(frm) {
        (frm.doc.items || []).forEach(row => {
            if (!row.request_for_quotation || !row.item_code) return;

            frappe.db.get_doc("Request for Quotation", row.request_for_quotation)
                .then(rfq => {

                    const rfq_item = rfq.items.find(
                        i => i.name === row.request_for_quotation_item
                    );

                    if (rfq_item && rfq_item.custom_total_weight) {
                        const weight = flt(rfq_item.custom_total_weight);

                        if (flt(row.custom_total_weights) !== weight) {
                            frappe.model.set_value(row.doctype, row.name, "custom_total_weights", weight);
                        }
                    }
                });
        });
    }
});


// =====================================================
// SUPPLIER QUOTATION ITEM (CHILD)
// =====================================================
frappe.ui.form.on("Supplier Quotation Item", {
    custom_rate_per_kg(frm, cdt, cdn) {
        calculate_rate_from_weight(frm, cdt, cdn);
        calculate_custom_amount(frm, cdt, cdn);
    },
    
    amount(frm, cdt, cdn) {
        calculate_total(frm);
    },

    qty(frm, cdt, cdn) {
        // calculate_total(frm);
        calculate_total_weight(frm, cdt, cdn);
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

    custom_length: calculate_kgs,
    custom_width: calculate_kgs,
    custom_thickness: calculate_kgs,
    custom_outer_diameter: calculate_kgs,
    custom_inner_diameter: calculate_kgs,
    custom_wall_thickness: calculate_kgs,
    custom_density: calculate_kgs,

    custom_scrap_margin_percentage: calculate_scrap_and_transport,
    custom_transportation_cost: calculate_scrap_and_transport
});


// =====================================================
// WEIGHT CALCULATION (COMMON)
// =====================================================
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

    // ==========================
    // MANUAL ENTRY MODE
    // ==========================

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
        return;
    }

    if (!density) {
        frappe.model.set_value(cdt, cdn, "custom_kilogramskgs", 0);
        frappe.model.set_value(cdt, cdn, "custom_total_weights", 0);
        return;
    }

    // ==========================
    // PLATES
    // ==========================

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

    // ==========================
    // PIPES / TUBES
    // ==========================

    else if (item_group === "Pipes" || item_group === "Tubes") {
        if (shape === "Hollow" && OD && T && L) {
            const ID_calc = OD - (2 * T);
            if (ID_calc > 0) {
                base_weight = (π * (Math.pow(OD / 2, 2) - Math.pow(ID_calc / 2, 2)) * L * density) / 1000000;
            }
        }
    }

    // ==========================
    // FORGINGS
    // ==========================

    else if (item_group === "Forgings") {
        if (shape === "Hollow" && OD && T && L) {
            const ID_calc = OD - (2 * T);
            base_weight = (π * (Math.pow(OD / 2, 2) - Math.pow(ID_calc / 2, 2)) * L * density) / 1000000;
        }

        else if (shape === "Circle" && OD && T) {
            base_weight = (π * Math.pow(OD / 2, 2) * T * density) / 1000000;
        }
    }

    // ==========================
    // RODS
    // ==========================

    else if (item_group === "Rods") {
        if (shape === "Circle" && OD && L) {
            base_weight = (π * Math.pow(OD / 2, 2) * L * density) / 1000000;
        }
    }

    // ==========================
    // FLANGES / RINGS
    // ==========================

    else if (item_group === "Flanges" || item_group === "Rings") {
        if (OD && ID && T) {
            base_weight = (π * ( Math.pow(OD / 2, 2) - Math.pow(ID / 2, 2)) * T * density) / 1000000;
        }
    }

    frappe.model.set_value(cdt, cdn, "custom_kilogramskgs", flt(base_weight, 4));
    frappe.model.set_value(cdt, cdn, "custom_total_weights", flt(base_weight * qty, 4));
}

// =====================================================
// TOTAL WEIGHT
// =====================================================
function calculate_total_weight(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const total_weight = flt(row.qty) * flt(row.custom_kilogramskgs);

    frappe.model.set_value(cdt, cdn, "custom_total_weights", flt(total_weight, 4));

    // ✅ NEW (ADD THIS LINE)
    calculate_rate_from_weight(frm, cdt, cdn);
    calculate_custom_amount(frm, cdt, cdn);
    calculate_scrap_and_transport(frm, cdt, cdn);
}


// =====================================================
// CUSTOM AMOUNT (SAFE)
// =====================================================

function calculate_custom_amount(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    const amount = flt(row.qty) * flt(row.rate);
    frappe.model.set_value(cdt, cdn, "amount", flt(amount, 2));

    calculate_total(frm);
}

// =====================================================
// SCRAP & TRANSPORT
// =====================================================
function calculate_scrap_and_transport(frm, cdt, cdn) {
    const row = locals[cdt][cdn];

    const total_weight = flt(row.custom_total_weights) || 0;
    const scrap_pct = flt(row.custom_scrap_margin_percentage) || 0;
    const transport_rate = flt(row.custom_transportation_cost) || 0;

    const scrap_kgs = total_weight * (scrap_pct / 100);
    const transport_cost = total_weight * transport_rate;

    frappe.model.set_value(cdt, cdn, "custom_scrap_margin_kg", flt(scrap_kgs, 4));
    frappe.model.set_value(cdt, cdn, "custom_transportation_cost_", flt(transport_cost, 2));
}


// =====================================================
// RATE CALCULATION (NEW)
// =====================================================
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


// ===============================
// CALCULATE PARENT TOTAL
// ===============================
function calculate_total(frm) {
    let total = 0;

    (frm.doc.items || []).forEach(row => {
        total += flt(row.amount);
    });

    total = flt(total, 2);

    // Only update if value changed
    if (flt(frm.doc.total) !== total) {
        frm.set_value("total", total);
    }
}


// function sync_rate_from_sq(frm) {

//     // ✅ Only run if created from Supplier Quotation
//     if (!frm.doc.items || !frm.doc.items.length) return;

//     let has_sq = frm.doc.items.some(row => row.supplier_quotation);
//     if (!has_sq) return;

//     (frm.doc.items || []).forEach(row => {

//         if (row.supplier_quotation && row.supplier_quotation_item) {

//             frappe.db.get_value(
//                 "Supplier Quotation Item",
//                 row.supplier_quotation_item,
//                 "custom_rate_per_kg"
//             ).then(r => {

//                 if (r && r.message) {

//                     frappe.model.set_value(row.doctype, row.name, "custom_rate_per_kg", r.message.custom_rate_per_kg);

//                 }
//             });
//         }

//     });

//     frm.refresh_field("items");
// }