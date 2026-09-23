// Copyright (c) 2026, maze and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Material Reference Library", {
// 	refresh(frm) {

// 	},
// });



frappe.ui.form.on("Material Reference Library Item", {
    reference_image(frm, cdt, cdn) {
        refresh_material_image_preview(frm, cdt, cdn, "reference_image", "reference_image_preview");
    },

    image(frm, cdt, cdn) {
        refresh_material_image_preview(frm, cdt, cdn, "image", "image_preview");
    },

    form_render(frm, cdt, cdn) {
        refresh_material_image_preview(frm, cdt, cdn, "reference_image", "reference_image_preview");
        refresh_material_image_preview(frm, cdt, cdn, "image", "image_preview");
    }
});


function refresh_material_image_preview(frm, cdt, cdn, attach_field, html_field) {
    const row = locals[cdt][cdn];
    const image_url = row[attach_field];
    const grid = frm.fields_dict.items.grid;
    const grid_row = grid.grid_rows_by_docname[cdn];

    if (!grid_row) {
        return;
    }

    const html_control = grid_row.get_field(html_field);
    if (!html_control) {
        console.warn("HTML field not found:", html_field);
        return;
    }

    const wrapper = html_control.$wrapper;
    if (!image_url) {
        wrapper.html(`<div style="color: #888;"> No image uploaded </div>`);
        return;
    }

    const safe_url = frappe.utils.escape_html(image_url);
    wrapper.html(`<div style="padding: 8px;">
            <img src="${safe_url}" style="max-width: 100%; max-height: 180px; object-fit: contain; border: 1px solid #ddd; border-radius: 8px; padding: 4px;"/>
        </div>`);
}