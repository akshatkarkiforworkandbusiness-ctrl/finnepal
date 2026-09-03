from fastapi import APIRouter, Response
from datetime import datetime
from app.services.tally_service import TallyXmlEngine

router = APIRouter(prefix="/tally", tags=["tally"])

@router.get("/ledger-master")
def get_ledger_master(ledger_name: str, group_name: str):
    xml_str = TallyXmlEngine.generate_ledger_master(ledger_name, group_name)
    return Response(content=xml_str, media_type="application/xml")

@router.get("/receipt-voucher")
def get_receipt_voucher(idempotency_key: str, party_name: str, debit_ledger: str, amount: float, date: str = None):
    date_val = datetime.strptime(date, "%Y-%m-%d") if date else datetime.utcnow()
    xml_str = TallyXmlEngine.generate_receipt_voucher(idempotency_key, party_name, debit_ledger, amount, date_val)
    return Response(content=xml_str, media_type="application/xml")
