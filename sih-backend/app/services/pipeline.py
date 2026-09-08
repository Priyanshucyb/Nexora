from uuid import uuid4

from app.services.ocr_service import extract_text
from app.services.extraction_service import extract_declarations
from app.services.rule_service import validate_declarations
from app.services.store import save_scan


def run_pipeline(
    filename: str,
    content_type: str,
    file_bytes: bytes,
) -> dict:

    scan_id = str(uuid4())

    # Step 1: OCR
    text = extract_text(
        file_bytes=file_bytes,
        content_type=content_type,
    )

    # Step 2: AI / declaration extraction
    declarations = extract_declarations(text)

    # Step 3: Legal rule validation
    compliance = validate_declarations(declarations)

    result = {
        "scan_id": scan_id,
        "filename": filename,
        **compliance,
    }

    save_scan(scan_id, result)

    return result