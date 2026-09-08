from typing import Any, Literal

from pydantic import BaseModel, Field


class Declaration(BaseModel):
    field: str
    value: Any
    confidence: float | None = Field(
        default=None,
        ge=0,
        le=1
    )


class Violation(BaseModel):
    field: str
    status: Literal["FAIL", "REVIEW"]
    reason: str


class ComplianceResponse(BaseModel):
    scan_id: str
    filename: str

    status: Literal["PASS", "FAIL", "REVIEW"]

    declarations: list[Declaration]
    violations: list[Violation]

    message: str