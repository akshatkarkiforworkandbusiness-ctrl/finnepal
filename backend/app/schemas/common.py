"""Generic paginated response envelope used by every admin/customer list endpoint."""
from __future__ import annotations

from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    """Generic pagination envelope: `items` for this page plus enough metadata
    for a client to render pager controls without a second round-trip."""

    model_config = ConfigDict(from_attributes=True)

    items: list[T]
    total: int
    page: int
    page_size: int
    pages: int


def make_page(items: list[T], total: int, page: int, page_size: int) -> Page[T]:
    pages = (total + page_size - 1) // page_size if page_size else 0
    return Page[T](items=items, total=total, page=page, page_size=page_size, pages=max(pages, 1) if total else 0)
