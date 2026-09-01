# Copyright (c) 2026, maze and contributors
# For license information, please see license.txt

# # import frappe
# from frappe.model.document import Document


# class LeaveRequest(Document):
# 	pass


import frappe
from frappe.model.document import Document
from frappe.utils import escape_html, formatdate


class LeaveRequest(Document):
    def on_update(self):
        """
        Send email only when the workflow state changes.
        Prevents duplicate emails when the document is saved again.
        """

        old_doc = self.get_doc_before_save()
        old_state = old_doc.workflow_state if old_doc else None
        new_state = self.workflow_state

        # Do nothing if workflow state has not changed
        if old_state == new_state:
            return

        if new_state == "Pending Approval":
            send_pending_approval_email(self)

        elif new_state == "Approved":
            send_approved_email(self)

        elif new_state == "Rejected":
            send_rejected_email(self)


def send_pending_approval_email(doc):
    """
    Email sent when Leave Request is submitted for approval.
    """

    recipient = "karthickarjunan08@gmail.com"
    frappe.sendmail(
        recipients=[recipient],
        subject=f"Leave Request - Approval Required - {doc.employee_name}",
        message=get_leave_email_message(doc, "Pending Approval"))

def send_approved_email(doc):
    """
    Email sent when Leave Request is approved.
    """

    recipient = "karthickarjunan08@gmail.com"
    frappe.sendmail(
        recipients=[recipient],
        subject=f"Leave Request Approved - {doc.employee_name}",
        message=get_leave_email_message(doc, "Approved"))


def send_rejected_email(doc):
    """
    Email sent when Leave Request is rejected.
    """

    recipient = "karthickarjunan08@gmail.com"
    frappe.sendmail(
        recipients=[recipient],
        subject=f"Leave Request Rejected - {doc.employee_name}",
        message=get_leave_email_message(doc, "Rejected"))

def get_leave_email_message(doc, status):

    employee_name = escape_html(doc.employee_name or "")
    department = escape_html(doc.department or "")
    company = escape_html(doc.company or "")
    approver_name = escape_html(doc.leave_approver_name or "")
    half_day = "Yes" if doc.half_day else "No"
    work_from_home = "Yes" if doc.work_from_home else "No"

    from_date = (formatdate(doc.from_date) if doc.from_date else "")
    to_date = (formatdate(doc.to_date) if doc.to_date else "")
    total_days = doc.total_leave_days or 0

    # Status design
    if status == "Approved":
        status_text = "Approved"
        status_message = "Your leave request has been approved."
    elif status == "Rejected":
        status_text = "Rejected"
        status_message = "Your leave request has been rejected."
    else:
        status_text = "Pending Approval"
        status_message = "A leave request requires your approval."

    return f"""
    <div style="margin: 0; padding: 30px 15px; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">

            <!-- Header -->
            <div style="padding: 22px 28px; background-color: #1f2937; color: #ffffff;">
                <div style="font-size: 12px; letter-spacing: 1px; text-transform: uppercase; opacity: 0.8; margin-bottom: 6px;"> Leave Management System </div>
                <div style="font-size: 24px; font-weight: bold;"> Leave Request </div>
            </div>

            <!-- Status -->
            <div style="padding: 24px 28px 10px 28px;">
                <div style="font-size: 18px; font-weight: bold; color: #111827; margin-bottom: 8px;"> {status_text} </div>
                <div style="font-size: 14px; color: #6b7280; line-height: 1.6;"> {status_message} </div>
            </div>


            <!-- Employee Information -->
            <div style="padding: 10px 28px 20px 28px;">
                <div style="font-size: 15px; font-weight: bold; color: #111827; margin-bottom: 10px;"> Employee Information </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; width: 40%; color: #6b7280;"> Employee </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #111827;"> {employee_name} </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;"> Department </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;"> {department} </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;"> Company </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;"> {company} </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;"> Leave Approver </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;"> {approver_name} </td>
                    </tr>
                </table>
            </div>

            <!-- Leave Details -->
            <div style="padding: 0 28px 25px 28px;">
                <div style="font-size: 15px; font-weight: bold; color: #111827; margin-bottom: 10px;"> Leave Details </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;"> From Date </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;"> {from_date} </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;"> To Date </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;"> {to_date} </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;"> Half Day </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;"> {half_day} </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;"> Work From Home </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; color: #111827;"> {work_from_home} </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;"> Total Leave Days </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #111827;"> {total_days} Day(s) </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px; background-color: #f9fafb; border: 1px solid #e5e7eb; color: #6b7280;"> Status </td>
                        <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; color: #111827;"> {status_text} </td>
                    </tr>
                </table>
            </div>

            <!-- Footer -->
            <div style="padding: 18px 28px; background-color: #f9fafb;
                border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; line-height: 1.6;">
                This is an automated email from the <strong>Leave Management System</strong>.<br> Please do not reply directly to this email.
            </div>
        </div>
    </div>
    """