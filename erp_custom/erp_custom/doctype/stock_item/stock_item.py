# Copyright (c) 2026, maze and contributors
# For license information, please see license.txt

# import frappe
# from frappe.model.document import Document


# class StockItem(Document):
# 	pass


import frappe
import io
import openpyxl
from frappe.model.document import Document
from math import pi
from io import BytesIO

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment
from frappe.utils.file_manager import get_file
from frappe.utils.xlsxutils import make_xlsx


class StockItem(Document):

    def validate(self):
        self.calculate_stock_weights()

    # def calculate_stock_weights(self):
    #     # Plate Totals
    #     self.overall_avail_wgt_plate = 0
    #     self.overall_avail_wgt_amt_plate = 0

    #     # Tube Totals
    #     self.overall_avail_wgt_tube = 0
    #     self.overall_avail_wgt_amt_tube = 0

    #     # Pipe Totals
    #     self.overall_avail_wgt_pipe = 0
    #     self.overall_avail_wgt_amt_pipe = 0

    #     # Rod Totals
    #     self.overall_avail_wgt_rod = 0
    #     self.overall_avail_wgt_amt_rod = 0

    #     # ---------------- Plates ----------------
    #     if hasattr(self, "plates"):
    #         for row in self.plates:
    #             self.calculate_plate(row)

    #             self.overall_avail_wgt_plate += row.available_weight or 0
    #             self.overall_avail_wgt_amt_plate += row.available_weight_amount or 0

    #     # ---------------- Tubes ----------------
    #     if hasattr(self, "tubes"):
    #         for row in self.tubes:
    #             self.calculate_tube(row)

    #             self.overall_avail_wgt_tube += row.available_weight or 0
    #             self.overall_avail_wgt_amt_tube += row.available_weight_amount or 0

    #     # ---------------- Pipes ----------------
    #     if hasattr(self, "pipes"):
    #         for row in self.pipes:
    #             self.calculate_pipe(row)

    #             self.overall_avail_wgt_pipe += row.available_weight or 0
    #             self.overall_avail_wgt_amt_pipe += row.available_weight_amount or 0

    #     # ---------------- Rods ----------------
    #     if hasattr(self, "rods"):
    #         for row in self.rods:
    #             self.calculate_rod(row)

    #             self.overall_avail_wgt_rod += row.available_weight or 0
    #             self.overall_avail_wgt_amt_rod += row.available_weight_amount or 0

    def calculate_stock_weights(self):
        self.overall_avail_wgt_plate = 0
        self.overall_avail_wgt_amt_plate = 0

        self.overall_avail_wgt_tube = 0
        self.overall_avail_wgt_amt_tube = 0

        self.overall_avail_wgt_pipe = 0
        self.overall_avail_wgt_amt_pipe = 0

        self.overall_avail_wgt_rod = 0
        self.overall_avail_wgt_amt_rod = 0

        # Plates
        for row in self.plates or []:
            self.calculate_plate(row)

            self.overall_avail_wgt_plate += row.available_weight or 0
            self.overall_avail_wgt_amt_plate += row.available_weight_amount or 0

        # Tubes
        for row in self.tubes or []:
            self.calculate_tube(row)

            self.overall_avail_wgt_tube += row.available_weight or 0
            self.overall_avail_wgt_amt_tube += row.available_weight_amount or 0

        # Pipes
        for row in self.pipes or []:
            self.calculate_pipe(row)

            self.overall_avail_wgt_pipe += row.available_weight or 0
            self.overall_avail_wgt_amt_pipe += row.available_weight_amount or 0

        # Rods
        for row in self.rods or []:
            self.calculate_rod(row)

            self.overall_avail_wgt_rod += row.available_weight or 0
            self.overall_avail_wgt_amt_rod += row.available_weight_amount or 0

    # def calculate_plate(self, row):
    #     if row.length and row.width and row.thickness and row.density:
    #         row.weight_per_item = (row.length * row.width * row.thickness * row.density) / 1000000
    #     else:
    #         row.weight_per_item = 0

    #     # Actual Weight
    #     row.actual_weight = (row.quantity or 1) * (row.weight_per_item or 0)

    #     # Available Weight
    #     row.available_weight = ((row.actual_weight or 0) - (row.used_weight or 0))

    #     # Amounts
    #     row.actual_weight_amount = ((row.actual_weight or 0) * (row.rate_per_kg or 0))
    #     row.available_weight_amount = ((row.available_weight or 0) * (row.rate_per_kg or 0))
    
    def calculate_plate(self, row):
        length = row.length or 0
        width = row.width or 0
        thickness = row.thickness or 0
        density = row.density or 0
        quantity = row.quantity or 0
        used_weight = row.used_weight or 0
        rate_per_kg = row.rate_per_kg or 0

        row.weight_per_item = (
            length
            * width
            * thickness
            * density
        ) / 1000000

        row.actual_weight = (
            quantity
            * row.weight_per_item
        )

        row.available_weight = (
            row.actual_weight
            - used_weight
        )

        row.actual_weight_amount = (
            row.actual_weight
            * rate_per_kg
        )

        row.available_weight_amount = (
            row.available_weight
            * rate_per_kg
        )


    def calculate_tube(self, row):
        if row.length and row.outer_diameter and row.thickness and row.density:
            od = row.outer_diameter
            inner_diameter = od - (2 * row.thickness)

            if inner_diameter > 0:
                row.weight_per_item = (pi * (((od / 2) ** 2) - ((inner_diameter / 2) ** 2)) * row.length * row.density) / 1000000
            else:
                row.weight_per_item = 0
        else:
            row.weight_per_item = 0
        
        row.balanced_quantity = ((row.quantity or 0) - (row.used_quantity or 0))
        row.actual_weight = (row.quantity or 1) * (row.weight_per_item or 0)
        row.available_weight = (row.actual_weight or 0) - (row.used_weight or 0)
        row.actual_weight_amount = (row.actual_weight or 0) * (row.rate_per_mtr or 0)
        row.available_weight_amount = (row.available_weight or 0) * (row.rate_per_mtr or 0)


    def calculate_pipe(self, row):
        if row.length and row.outer_diameter and row.thickness and row.density:
            od = row.outer_diameter
            inner_diameter = od - (2 * row.thickness)

            if inner_diameter > 0:
                row.weight_per_item = (pi * (((od / 2) ** 2) - ((inner_diameter / 2) ** 2)) * row.length * row.density) / 1000000
            else:
                row.weight_per_item = 0
        else:
            row.weight_per_item = 0

        row.balanced_quantity = ((row.quantity or 0) - (row.used_quantity or 0))
        row.actual_weight = (row.quantity or 1) * (row.weight_per_item or 0)
        row.available_weight = (row.actual_weight or 0) - (row.used_weight or 0)
        row.actual_weight_amount = (row.actual_weight or 0) * (row.rate_per_mtr or 0)
        row.available_weight_amount = (row.available_weight or 0) * (row.rate_per_mtr or 0)


    def calculate_rod(self, row):
        if row.length and row.outer_diameter and row.density:
            row.weight_per_item = (pi * ((row.outer_diameter / 2) ** 2) * row.length * row.density) / 1000000
        else:
            row.weight_per_item = 0

        row.balanced_quantity = ((row.quantity or 0) - (row.used_quantity or 0))
        row.actual_weight = (row.quantity or 1) * (row.weight_per_item or 0)
        row.available_weight = (row.actual_weight or 0) - (row.used_weight or 0)
        row.actual_weight_amount = (row.actual_weight or 0) * (row.rate_per_mtr or 0)
        row.available_weight_amount = (row.available_weight or 0) * (row.rate_per_mtr or 0)


@frappe.whitelist()
def calculate_stock_weights(doc):
    doc = frappe.parse_json(doc)
    stock_item = frappe.get_doc(doc)
    stock_item.calculate_stock_weights()
    return stock_item.as_dict()


def format_header(ws):
    header_fill = PatternFill(fill_type="solid", fgColor="1F4E78")
    header_font = Font(bold=True, color="FFFFFF")
    thin = Side(style="thin")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)

    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.border = border
        cell.alignment = Alignment(horizontal="center", vertical="center")
    ws.freeze_panes = "A2"

def auto_width(ws):
    for column in ws.columns:
        length = 0
        letter = column[0].column_letter
        for cell in column:
            try:
                if cell.value:
                    length = max(length, len(str(cell.value)))
            except Exception:
                pass
        ws.column_dimensions[letter].width = length + 5


def create_template_sheet(workbook, sheet_name, headers):
    ws = workbook.create_sheet(title=sheet_name)
    ws.append(headers)
    format_header(ws)
    auto_width(ws)
    return ws

def download_workbook(workbook, filename):
    output = BytesIO()
    workbook.save(output)
    output.seek(0)
    frappe.local.response.filename = filename
    frappe.local.response.filecontent = output.read()
    frappe.local.response.type = "download"


@frappe.whitelist()
def download_plate_template():
    wb = Workbook()
    # Remove default sheet
    wb.remove(wb.active)
    create_template_sheet(wb, "Plates",
        ["Category", "Type", "Material of Construction (MoC)", "Vendor", "Description", "Purchse Order No", "Status", "Length", "Width", "Thickness", "Density",
        "Quantity", "Rate ₹ (Per Kg)", "Used Weight", "Weight Per Item", "Actual Weight", "Available Weight", "Actual Weight Amount (₹)", "Available Weight Amount (₹)", "Remarks"])

    download_workbook(wb, "Stock_Plate_Template.xlsx")


@frappe.whitelist()
def download_pipe_template():
    wb = Workbook()
    # Remove default sheet
    wb.remove(wb.active)
    create_template_sheet(wb, "Pipes",
        ["Category", "Type", "Material of Construction (MoC)", "Vendor", "Description", "Purchse Order No", "Status", "Length", "Thickness", "Outer Diameter", "Density",
        "Quantity", "Used Quantity", "Rate ₹ (Per Kg)", "Used Weight", "Weight Per Item", "Balanced Quantity", "Actual Weight", "Available Weight", "Actual Weight Amount (₹)", "Available Weight Amount (₹)", "Remarks"])

    download_workbook(wb, "Stock_Pipe_Template.xlsx")


@frappe.whitelist()
def download_tube_template():
    wb = Workbook()
    # Remove default sheet
    wb.remove(wb.active)
    create_template_sheet(wb, "Tubes",
        ["Category", "Type", "Material of Construction (MoC)", "Vendor", "Description", "Purchse Order No", "Status", "Length", "Thickness", "Outer Diameter", "Density",
        "Quantity", "Used Quantity", "Rate ₹ (Per Kg)", "Used Weight", "Weight Per Item", "Balanced Quantity", "Actual Weight", "Available Weight", "Actual Weight Amount (₹)", "Available Weight Amount (₹)", "Remarks"])

    download_workbook(wb, "Stock_Tube_Template.xlsx")

@frappe.whitelist()
def download_rod_template():
    wb = Workbook()
    # Remove default sheet
    wb.remove(wb.active)
    create_template_sheet(wb, "Rods",
        ["Category", "Type", "Material of Construction (MoC)", "Vendor", "Description", "Purchse Order No", "Status", "Length", "Thickness", "Outer Diameter", "Density",
        "Quantity", "Used Quantity", "Rate ₹ (Per Kg)", "Used Weight", "Weight Per Item", "Balanced Quantity", "Actual Weight", "Available Weight", "Actual Weight Amount (₹)", "Available Weight Amount (₹)", "Remarks"])

    download_workbook(wb, "Stock_Rod_Template.xlsx")


@frappe.whitelist()
def download_overall_template():
    wb = Workbook()
    # Remove default sheet
    wb.remove(wb.active)
    # Plates Sheet
    create_template_sheet(wb, "Plates",
        ["Category", "Type", "Material of Construction (MoC)", "Vendor", "Description", "Purchse Order No", "Status", "Length", "Width", "Thickness", "Density",
        "Quantity", "Rate ₹ (Per Kg)", "Used Weight", "Weight Per Item", "Actual Weight", "Available Weight", "Actual Weight Amount (₹)", "Available Weight Amount (₹)", "Remarks"])

    # Pipes Sheet
    create_template_sheet(wb, "Pipes",
        ["Length", "Thickness", "Outer Diameter"])

    # Tubes Sheet
    create_template_sheet(wb, "Tubes",
        ["Length", "Thickness", "Outer Diameter"])

    download_workbook(wb, "Stock_Overall_Template.xlsx")



# @frappe.whitelist()
# def upload_stock_excel(file_url, upload_type, stock_item):
#     try:

#         # Get uploaded file
#         file_doc = get_file(file_url)
#         file_content = file_doc[1]


#         # Load workbook
#         wb = openpyxl.load_workbook(filename=BytesIO(file_content))
#         doc = frappe.get_doc("Stock Item", stock_item)

#         # ---------------- Plates ----------------
#         if upload_type == "Plate":
#             ws = wb.active
#             for row in ws.iter_rows(min_row=2, values_only=True):
#                 if not any(row):
#                     continue

#                 doc.append("plates", {
#                         "category":row[0],
#                         "type":row[1],
#                         "moc": row[2],
#                         "vendor": row[3],
#                         "description": row[4],
#                         "purchase_order_no": row[5],
#                         "status": row[6],
#                         "length": row[7],
#                         "width": row[8],
#                         "thickness": row[9],
#                         "density": row[10],

#                         "Quantity": row[11],
#                         "rate_per_kg": row[12],
#                         "used_weight": row[13],
#                         "weight_per_item": row[14],
#                         "actual_weight": row[15],
#                         "available_weight": row[16],
#                         "actual_weight_amount": row[17],
#                         "available_weight_amount": row[18],
#                         "remarks": row[19],
#                     })


#         # ---------------- Pipes ----------------
#         elif upload_type == "Pipe":
#             ws = wb.active
#             for row in ws.iter_rows(min_row=2, values_only=True):
#                 if not any(row):
#                     continue

#                 doc.append("pipes", {
#                         "length": row[0],
#                         "thickness": row[1],
#                         "outer_diameter": row[2]
#                     })

#         # ---------------- Tubes ----------------
#         elif upload_type == "Tube":
#             ws = wb.active
#             for row in ws.iter_rows(min_row=2, values_only=True):
#                 if not any(row):
#                     continue

#                 doc.append("tubes", {
#                         "length": row[0],
#                         "thickness": row[1],
#                         "outer_diameter": row[2]
#                     })

#         # ---------------- Overall ----------------
#         elif upload_type == "Overall":
#             # -------- Plates Sheet --------

#             if "Plates" in wb.sheetnames:
#                 ws = wb["Plates"]
#                 for row in ws.iter_rows(min_row=2, values_only=True):
#                     if not any(row):
#                         continue

#                     doc.append("plates", {
#                             "length": row[0],
#                             "width": row[1],
#                             "thickness": row[2]
#                         })

#             # -------- Pipes Sheet --------
#             if "Pipes" in wb.sheetnames:
#                 ws = wb["Pipes"]

#                 for row in ws.iter_rows(min_row=2, values_only=True):
#                     if not any(row):
#                         continue

#                     doc.append("pipes", {
#                             "length": row[0],
#                             "thickness": row[1],
#                             "outer_diameter": row[2]
#                         })

#             # -------- Tubes Sheet --------
#             if "Tubes" in wb.sheetnames:
#                 ws = wb["Tubes"]

#                 for row in ws.iter_rows(min_row=2, values_only=True):
#                     if not any(row):
#                         continue

#                     doc.append("tubes", {
#                             "length": row[0],
#                             "thickness": row[1],
#                             "outer_diameter": row[2]
#                         })

#         else:
#             frappe.throw("Invalid Upload Type")

#         # Save document
#         doc.save()
#         frappe.db.commit()
#         return {
#             "status": "success",
#             "message": "Excel data appended successfully"
#         }

#     except Exception as e:
#         frappe.log_error(frappe.get_traceback(), "Stock Item Excel Upload Error")
#         frappe.throw(str(e))


@frappe.whitelist()
def upload_stock_excel(file_url, upload_type, stock_item):
    try:
        file_doc = get_file(file_url)
        file_content = file_doc[1]

        wb = openpyxl.load_workbook(filename=BytesIO(file_content), data_only=True)
        doc = frappe.get_doc("Stock Item", stock_item)

        # ---------------- Plates ----------------
        if upload_type == "Plates":
            ws = wb.active

            for row in ws.iter_rows(min_row=2, values_only=True):
                if not any(row):
                    continue

                doc.append("plates", {
                    "category": row[0],
                    "type": row[1],
                    "moc": row[2],
                    "vendor": row[3],
                    "description": row[4],
                    "purchase_order_no": row[5],
                    "status": row[6],
                    "length": row[7] or 0,
                    "width": row[8] or 0,
                    "thickness": row[9] or 0,
                    "density": row[10] or 0,
                    "quantity": row[11] or 0,
                    "rate_per_kg": row[12] or 0,
                    "used_weight": row[13] or 0,
                    "remarks": row[19]
                })

        # ---------------- Pipes ----------------
        elif upload_type == "Pipes":
            ws = wb.active

            for row in ws.iter_rows(min_row=2, values_only=True):
                if not any(row):
                    continue

                doc.append("pipes", {
                    "category": row[0],
                    "type": row[1],
                    "moc": row[2],
                    "vendor": row[3],
                    "description": row[4],
                    "purchase_order_no": row[5],
                    "status": row[6],
                    "length": row[7] or 0,
                    "outer_diameter": row[8] or 0,
                    "thickness": row[9] or 0,
                    "density": row[10] or 0,
                    "quantity": row[11] or 0,
                    "rate_per_mtr": row[12] or 0,
                    "used_weight": row[13] or 0,
                    "remarks": row[19]
                })

        # ---------------- Tubes ----------------
        elif upload_type == "Tubes":
            ws = wb.active

            for row in ws.iter_rows(min_row=2, values_only=True):
                if not any(row):
                    continue

                doc.append("tubes", {
                    "category": row[0],
                    "type": row[1],
                    "moc": row[2],
                    "vendor": row[3],
                    "description": row[4],
                    "purchase_order_no": row[5],
                    "status": row[6],
                    "length": row[7] or 0,
                    "outer_diameter": row[8] or 0,
                    "thickness": row[9] or 0,
                    "density": row[10] or 0,
                    "quantity": row[11] or 0,
                    "rate_per_mtr": row[12] or 0,
                    "used_weight": row[13] or 0,
                    "remarks": row[19]
                })

        # ---------------- Rods ----------------
        elif upload_type == "Rods":
            ws = wb.active

            for row in ws.iter_rows(min_row=2, values_only=True):
                if not any(row):
                    continue

                doc.append("rods", {
                    "category": row[0],
                    "type": row[1],
                    "moc": row[2],
                    "vendor": row[3],
                    "description": row[4],
                    "purchase_order_no": row[5],
                    "status": row[6],
                    "length": row[7] or 0,
                    "outer_diameter": row[8] or 0,
                    "density": row[9] or 0,
                    "quantity": row[10] or 0,
                    "rate_per_mtr": row[11] or 0,
                    "used_weight": row[12] or 0,
                    "remarks": row[19]
                })

        else:
            frappe.throw(f"Invalid Upload Type: {upload_type}")

        # Recalculate all calculated fields
        doc.calculate_stock_weights()

        # Save
        doc.save()
        frappe.db.commit()
        return {
            "status": "success",
            "message": f"{upload_type} Excel data uploaded successfully"
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Stock Item Excel Upload Error")
        frappe.throw(str(e))

# @frappe.whitelist()
# def upload_stock_excel(file_url, upload_type, stock_item):
#     try:
#         file_doc = get_file(file_url)
#         file_content = file_doc[1]

#         wb = openpyxl.load_workbook(
#             filename=BytesIO(file_content),
#             data_only=True
#         )

#         doc = frappe.get_doc("Stock Item", stock_item)

#         # ---------------- Plates ----------------
#         if upload_type == "Plates":
#             ws = wb.active

#             for row in ws.iter_rows(min_row=2, values_only=True):
#                 if not any(row):
#                     continue

#                 doc.append("plates", {
#                     "category": row[0],
#                     "type": row[1],
#                     "moc": row[2],
#                     "vendor": row[3],
#                     "description": row[4],
#                     "purchase_order_no": row[5],
#                     "status": row[6],
#                     "length": row[7] or 0,
#                     "width": row[8] or 0,
#                     "thickness": row[9] or 0,
#                     "density": row[10] or 0,
#                     "quantity": row[11] or 0,
#                     "rate_per_kg": row[12] or 0,
#                     "used_weight": row[13] or 0,
#                     "remarks": row[19]
#                 })

#         else:
#             frappe.throw(
#                 f"Invalid Upload Type: {upload_type}"
#             )

#         # Recalculate calculated fields
#         doc.calculate_stock_weights()

#         # Save Stock Item
#         doc.save()

#         frappe.db.commit()

#         return {
#             "status": "success",
#             "message": "Excel data appended successfully"
#         }

#     except Exception as e:
#         frappe.log_error(
#             frappe.get_traceback(),
#             "Stock Item Excel Upload Error"
#         )

#         frappe.throw(str(e))

@frappe.whitelist()
def download_stock_data(stock_item, download_type):
    frappe.msgprint(f"{download_type} Download Started")
    return download_excel_with_data(stock_item, download_type)


def download_excel_with_data(stock_item, download_type):
    doc = frappe.get_doc("Stock Item", stock_item)
    wb = Workbook()
    ws = wb.active
    ws.title = download_type.title()

    if download_type == "plates":
        export_plates(ws, doc)

    elif download_type == "pipes":
        export_pipes(ws, doc)

    elif download_type == "tubes":
        export_tubes(ws, doc)

    elif download_type == "rods":
        export_rods(ws, doc)

    elif download_type == "flanges":
        export_flanges(ws, doc)

    elif download_type == "welding":
        export_welding(ws, doc)

    elif download_type == "disc":
        export_disc(ws, doc)

    elif download_type == "spares":
        export_spares(ws, doc)

    elif download_type == "overall":
        export_overall(ws, doc)

    output = io.BytesIO()
    wb.save(output)
    frappe.local.response.filename = f"{stock_item}_{download_type}.xlsx"
    frappe.local.response.filecontent = output.getvalue()
    frappe.local.response.type = "download"


def export_plates(ws, doc):
    ws.append(["Type", "MOC", "Quantity", "Length", "Width", "Thickness", "Density", "Weight"])

    for d in doc.plates:
        ws.append([d.type, d.moc, d.quantity, d.length, d.width, d.thickness, d.density, d.weight])