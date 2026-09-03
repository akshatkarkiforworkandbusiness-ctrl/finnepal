import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from app.services.reconciliation import AgenticReconciliationPlanner

class BankStatementHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory or not event.src_path.endswith(".pdf"):
            return
        print(f"Autonomous Ingestion Triggered: New bank statement detected at {event.src_path}")
        # Automatically spawn the agentic goal-oriented reconciliation planner
        planner = AgenticReconciliationPlanner()
        planner.execute_objective(
            goal=f"Ingest the file {event.src_path}, auto-reconcile all transactions, and prepare Tally sync."
        )

def start_autonomous_watcher(path_to_watch: str):
    # Ensure watch directory exists
    os.makedirs(path_to_watch, exist_ok=True)
    event_handler = BankStatementHandler()
    observer = Observer()
    observer.schedule(event_handler, path=path_to_watch, recursive=False)
    observer.start()
    print(f"Autonomous watchdog running on {path_to_watch}. Agent is active.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    import sys
    watch_path = sys.argv[1] if len(sys.argv) > 1 else "./sftp_statements"
    start_autonomous_watcher(watch_path)
