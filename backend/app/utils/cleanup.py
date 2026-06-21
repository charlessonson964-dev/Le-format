from apscheduler.schedulers.background import BackgroundScheduler
from app.core.config import get_settings
from app.utils.file_handler import cleanup_directory

def start_cleanup_scheduler():
    settings = get_settings()
    scheduler = BackgroundScheduler()

    scheduler.add_job(
        func=lambda: cleanup_directory(str(settings.UPLOAD_DIR)),
        trigger="interval",
        minutes=settings.CLEANUP_INTERVAL_MINUTES,
    )
    scheduler.add_job(
        func=lambda: cleanup_directory(str(settings.OUTPUT_DIR)),
        trigger="interval",
        minutes=settings.CLEANUP_INTERVAL_MINUTES,
    )
    scheduler.start()
    return scheduler
