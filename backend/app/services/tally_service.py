from datetime import datetime
import xml.etree.ElementTree as ET

class TallyXmlEngine:

    @classmethod
    def generate_ledger_master(cls, ledger_name: str, group_name: str) -> str:
        envelope = ET.Element("ENVELOPE")
        header = ET.SubElement(envelope, "HEADER")
        tally_request = ET.SubElement(header, "TALLYREQUEST")
        tally_request.text = "Import Data"
        body = ET.SubElement(envelope, "BODY")
        desc = ET.SubElement(body, "DESC")
        static_vars = ET.SubElement(desc, "STATICVARIABLES")
        current_company = ET.SubElement(static_vars, "SVCURRENTCOMPANY")
        current_company.text = "Orbit Client"
        data = ET.SubElement(body, "DATA")
        tally_msg = ET.SubElement(data, "TALLYMESSAGE", {"xmlns:UDF": "TallyUDF"})
        ledger = ET.SubElement(tally_msg, "LEDGER", {"NAME": ledger_name, "ACTION": "Create"})
        name_node = ET.SubElement(ledger, "NAME")
        name_node.text = ledger_name
        parent_node = ET.SubElement(ledger, "PARENT")
        parent_node.text = group_name
        return ET.tostring(envelope, encoding="utf-8").decode("utf-8")

    @classmethod
    def generate_receipt_voucher(cls, idempotency_key: str, party_name: str, debit_ledger: str, amount: float, date_val: datetime) -> str:
        amt_str = f"{amount:.2f}"
        date_str = date_val.strftime("%Y%m%d")
        envelope = ET.Element("ENVELOPE")
        header = ET.SubElement(envelope, "HEADER")
        req = ET.SubElement(header, "TALLYREQUEST")
        req.text = "Import Data"
        body = ET.SubElement(envelope, "BODY")
        desc = ET.SubElement(body, "DESC")
        static_vars = ET.SubElement(desc, "STATICVARIABLES")
        comp = ET.SubElement(static_vars, "SVCURRENTCOMPANY")
        comp.text = "Orbit Client"
        data = ET.SubElement(body, "DATA")
        tally_msg = ET.SubElement(data, "TALLYMESSAGE", {"xmlns:UDF": "TallyUDF"})
        voucher = ET.SubElement(tally_msg, "VOUCHER", {
            "ACTION": "Create",
            "VCHTYPE": "Receipt",
            "GUID": idempotency_key
        })
        date_node = ET.SubElement(voucher, "DATE")
        date_node.text = date_str
        v_type = ET.SubElement(voucher, "VOUCHERTYPENAME")
        v_type.text = "Receipt"
        debit_entry = ET.SubElement(voucher, "ALLLEDGERENTRIES.LIST")
        ledger_debit = ET.SubElement(debit_entry, "LEDGERNAME")
        ledger_debit.text = debit_ledger
        is_debit = ET.SubElement(debit_entry, "ISDEEMEDPOSITIVE")
        is_debit.text = "Yes"
        amount_debit = ET.SubElement(debit_entry, "AMOUNT")
        amount_debit.text = f"-{amt_str}"
        credit_entry = ET.SubElement(voucher, "ALLLEDGERENTRIES.LIST")
        ledger_credit = ET.SubElement(credit_entry, "LEDGERNAME")
        ledger_credit.text = party_name
        is_credit = ET.SubElement(credit_entry, "ISDEEMEDPOSITIVE")
        is_credit.text = "No"
        amount_credit = ET.SubElement(credit_entry, "AMOUNT")
        amount_credit.text = amt_str
        return ET.tostring(envelope, encoding="utf-8").decode("utf-8")
