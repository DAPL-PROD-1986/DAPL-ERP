# Copyright (c) 2026, maze and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Workplan(Document):

    def on_submit(self):
        frappe.sendmail(
			# recipients=["msk312508@gmail.com"],
            # sender="karthickarjunan08@gmail.com",

			recipients=["DAPL-team@dynatherm.co.in"],
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