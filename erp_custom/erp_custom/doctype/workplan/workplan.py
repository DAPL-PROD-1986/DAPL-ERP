# Copyright (c) 2026, maze and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Workplan(Document):

    def on_submit(self):
        frappe.sendmail(
            # recipients=["msk312508@gmail.com"],
            # sender="karthickarjunan08@gmail.com",

            recipients=["dapl-team@dynatherm.co.in"],
            sender="production@dynatherm.co.in",
            subject=f"Today's {self.doctype} Submitted - {self.name}",
            message=f"""
                <p> Dear Team, </p>
                <p> Today's Workplan <b>{self.name}</b> has been submitted successfully for production activities. </p>
                <p><a href="{frappe.utils.get_url_to_form(self.doctype, self.name)}"
                    style="background-color:#28a745;
                            color:white; padding:10px 16px;
                            text-decoration:none; border-radius:5px;
                            display:inline-block;"> Open Workplan </a>
                </p>
                <p> Regards,<br>
                Production Team </p>"""
        )


from frappe.utils.xlsxutils import make_xlsx

@frappe.whitelist()
def download_workplan_excel(from_date, to_date):
    rows = []
    # Parent Workplans

    workplans = frappe.get_all("Workplan",
        filters={
            "date": ["between", [from_date, to_date]]
        },
        fields=[
            "name",
            "date",
            "prepared_by",
            "factory_manager",
            "shop_floor_supervisor",
            "machine_supervisor"],
        order_by="date asc")

    # ----------------------------------
    # Excel Header
    # ----------------------------------
    rows.append([
        "Workplan No", "Date",
        "Department", "Employee",
        "Job No", "Tag No",
        "Attendance Status",
        "In Time", "Out Time",
        "Work", "Remarks",
        "QC Clearance", "Completion Status",

        "Prepared By",
        "Factory Manager",
        "Shop Floor Supervisor",
        "Machine Supervisor"
    ])

    # ----------------------------------
    # Child Table Data
    # ----------------------------------
    first_record = True
    for wp in workplans:

        if not first_record:
            rows.append([""] * 17)
        
        first_record = False

        items = frappe.get_all("Workplan Item",
            filters={
                "parent": wp.name
            },
            fields=[
                "department", "name1",
                "job_no", "tag_no",
                "attendance_status", "completion_status",
                "in_time", "out_time",
                "qc_clearance", "work", "remarks"])

        # ----------------------------
        # No child rows
        # ----------------------------
        if not items:
            rows.append([
                wp.name, wp.date,
                "", "", "", "", "", "", "", "", "", "",  "",
                wp.prepared_by,
                wp.factory_manager,
                wp.shop_floor_supervisor,
                wp.machine_supervisor])

            continue

        # ----------------------------
        # Child rows
        # ----------------------------
        for d in items:
            rows.append([
                wp.name, wp.date,
                d.department, d.name1,
                d.job_no, d.tag_no,
                d.attendance_status,
                d.in_time, d.out_time,
                d.work, d.remarks,
                d.qc_clearance,
                d.completion_status,

                wp.prepared_by,
                wp.factory_manager,
                wp.shop_floor_supervisor,
                wp.machine_supervisor])

    # ----------------------------------
    # Create Excel
    # ----------------------------------
    xlsx = make_xlsx(rows, "Workplan Report")
    frappe.response["filename"] = (f"Workplan_{from_date}_to_{to_date}.xlsx")
    frappe.response["filecontent"] = xlsx.getvalue()
    frappe.response["type"] = "binary"