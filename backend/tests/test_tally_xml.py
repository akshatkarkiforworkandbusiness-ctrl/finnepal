import xml.etree.ElementTree as ET
from datetime import datetime
from app.services.tally_service import TallyXmlEngine

def test_ledger_master_xml_structure():
    xml_str = TallyXmlEngine.generate_ledger_master("Cash in Hand", "Cash-in-Hand")
    root = ET.fromstring(xml_str)
    assert root.tag == "ENVELOPE"
    header = root.find("HEADER/TALLYREQUEST")
    assert header is not None and header.text == "Import Data"
    ledger = root.find(".//LEDGER")
    assert ledger is not None
    assert ledger.attrib["NAME"] == "Cash in Hand"
    assert ledger.attrib["ACTION"] == "Create"
    name_node = ledger.find("NAME")
    assert name_node.text == "Cash in Hand"
    parent_node = ledger.find("PARENT")
    assert parent_node.text == "Cash-in-Hand"

def test_receipt_voucher_balanced_double_entry():
    xml_str = TallyXmlEngine.generate_receipt_voucher("TXN-123-GUID", "Ram Customer", "NABIL Bank", 5000.00, datetime(2026, 9, 3))
    root = ET.fromstring(xml_str)
    voucher = root.find(".//VOUCHER")
    assert voucher is not None
    assert voucher.attrib["GUID"] == "TXN-123-GUID"
    assert voucher.attrib["VCHTYPE"] == "Receipt"
    date_node = voucher.find("DATE")
    assert date_node.text == "20260903"
    entries = voucher.findall("ALLLEDGERENTRIES.LIST")
    assert len(entries) == 2
    # Debit entry
    debit_ledger = entries[0].find("LEDGERNAME").text
    debit_amount = entries[0].find("AMOUNT").text
    debit_is_positive = entries[0].find("ISDEEMEDPOSITIVE").text
    assert debit_ledger == "NABIL Bank"
    assert debit_is_positive == "Yes"
    assert debit_amount == "-5000.00"
    # Credit entry
    credit_ledger = entries[1].find("LEDGERNAME").text
    credit_amount = entries[1].find("AMOUNT").text
    credit_is_positive = entries[1].find("ISDEEMEDPOSITIVE").text
    assert credit_ledger == "Ram Customer"
    assert credit_is_positive == "No"
    assert credit_amount == "5000.00"
    # Balance check: absolute values equal
    assert abs(float(debit_amount)) == float(credit_amount)

def test_guid_deduplication():
    xml1 = TallyXmlEngine.generate_receipt_voucher("SAME-GUID-999", "Party A", "Cash", 100.00, datetime(2026, 1, 1))
    xml2 = TallyXmlEngine.generate_receipt_voucher("SAME-GUID-999", "Party A", "Cash", 100.00, datetime(2026, 1, 1))
    root1 = ET.fromstring(xml1)
    root2 = ET.fromstring(xml2)
    guid1 = root1.find(".//VOUCHER").attrib["GUID"]
    guid2 = root2.find(".//VOUCHER").attrib["GUID"]
    assert guid1 == guid2 == "SAME-GUID-999"
    # Different GUID should differ
    xml3 = TallyXmlEngine.generate_receipt_voucher("DIFF-GUID-111", "Party A", "Cash", 100.00, datetime(2026, 1, 1))
    guid3 = ET.fromstring(xml3).find(".//VOUCHER").attrib["GUID"]
    assert guid3 != guid1

def test_amount_formatting():
    xml_str = TallyXmlEngine.generate_receipt_voucher("TXN-FMT", "Party", "Bank", 1234.5, datetime(2026, 9, 3))
    root = ET.fromstring(xml_str)
    entries = root.findall(".//ALLLEDGERENTRIES.LIST")
    amounts = [e.find("AMOUNT").text for e in entries]
    assert "-1234.50" in amounts
    assert "1234.50" in amounts

def test_xml_is_valid_utf8():
    xml_str = TallyXmlEngine.generate_ledger_master("Test Ledger", "Sundry Debtors")
    # Should be parseable and not raise
    ET.fromstring(xml_str)
    xml_str2 = TallyXmlEngine.generate_receipt_voucher("GUID", "Party", "Ledger", 99.99, datetime.utcnow())
    ET.fromstring(xml_str2)
