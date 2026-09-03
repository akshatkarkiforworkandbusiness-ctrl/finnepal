import os
import time
import tempfile
import shutil
from unittest.mock import patch, MagicMock
from app.services.watcher import BankStatementHandler
from app.services.reconciliation import AgenticReconciliationPlanner

def test_handler_ignores_non_pdf():
    handler = BankStatementHandler()
    with patch.object(AgenticReconciliationPlanner, "execute_objective") as mock_exec:
        event = MagicMock()
        event.is_directory = False
        event.src_path = "/tmp/test.txt"
        handler.on_created(event)
        mock_exec.assert_not_called()

def test_handler_ignores_directory():
    handler = BankStatementHandler()
    with patch.object(AgenticReconciliationPlanner, "execute_objective") as mock_exec:
        event = MagicMock()
        event.is_directory = True
        event.src_path = "/tmp/test.pdf"
        handler.on_created(event)
        mock_exec.assert_not_called()

def test_handler_triggers_on_pdf():
    handler = BankStatementHandler()
    with patch.object(AgenticReconciliationPlanner, "execute_objective", return_value={"status": "ingested"}) as mock_exec:
        event = MagicMock()
        event.is_directory = False
        event.src_path = "/tmp/sftp_statements/NABIL_2026-09-03.pdf"
        handler.on_created(event)
        mock_exec.assert_called_once()
        goal_arg = mock_exec.call_args[1]["goal"]
        assert "NABIL_2026-09-03.pdf" in goal_arg
        assert "auto-reconcile" in goal_arg

def test_planner_sms_auto_reconcile():
    planner = AgenticReconciliationPlanner()
    result = planner.auto_reconcile_sms({"txn_id": "TXN123", "amount": 5000, "payment_channel": "eSewa"})
    assert result["status"] == "sms_auto_matched"
    assert result["txn_id"] == "TXN123"

def test_planner_execute_objective_with_existing_file():
    planner = AgenticReconciliationPlanner()
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tf:
        tf.write(b"%PDF-1.4 fake")
        tf_path = tf.name
    try:
        result = planner.execute_objective(goal=f"Ingest the file {tf_path}, auto-reconcile all transactions, and prepare Tally sync.")
        assert result["status"] == "ingested"
        assert result["file"] == tf_path
    finally:
        os.unlink(tf_path)

def test_watchdog_integration_creates_handler():
    # Verify start_autonomous_watcher can be instantiated without blocking (mock observer)
    from app.services.watcher import start_autonomous_watcher
    with patch("app.services.watcher.Observer") as MockObserver:
        mock_obs = MagicMock()
        MockObserver.return_value = mock_obs
        # Run in thread with timeout to avoid infinite loop; patch time.sleep to raise KeyboardInterrupt
        with patch("app.services.watcher.time.sleep", side_effect=KeyboardInterrupt):
            start_autonomous_watcher("/tmp/test_watch")
        MockObserver.assert_called_once()
        mock_obs.schedule.assert_called_once()
        mock_obs.start.assert_called_once()
        mock_obs.stop.assert_called_once()
        mock_obs.join.assert_called_once()
