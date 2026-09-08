from fastapi import FastAPI

from app.routes.scan import router as scan_router
from app.routes.report import router as report_router


app = FastAPI(
    title="Legal Metrology Compliance Backend",
    version="0.1.0",
)


app.include_router(scan_router)
app.include_router(report_router)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "legal-metrology-backend"
    }