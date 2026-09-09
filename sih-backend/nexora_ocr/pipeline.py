"""
The single integration point for Person 2's backend:

    from nexora_ocr.pipeline import scan_label
    result = scan_label("/path/to/label.jpg")   # -> ScanResult (pydantic model)
    result.model_dump_json()                     # ready to store / return from POST /scan

Keeping this as one function with one input (a file path) and one output
(a ScanResult) is the "integration interface" called for in the Day-1 plan --
the rule engine and the API layer can each be swapped without this module
changing.
"""

from __future__ import annotations

from typing import List, Optional

from .extractor import extract_fields
from .ocr_engine import run_ocr
from .schema import ScanResult


def scan_label(file_path: str, languages: Optional[List[str]] = None) -> ScanResult:
    warnings: List[str] = []

    try:
        ocr_lines = run_ocr(file_path, languages=languages)
    except ValueError as e:
        # Unsupported file type / unreadable file -- surface as a clean
        # error rather than letting an OpenCV/pdf2image exception bubble up.
        raise

    if not ocr_lines:
        warnings.append("OCR returned no text at all -- check image quality/orientation")

    extracted = extract_fields(ocr_lines)

    return ScanResult(
        source_file=file_path,
        ocr_lines=ocr_lines,
        extracted=extracted,
        warnings=warnings,
    )
