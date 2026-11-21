from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel


class Category(BaseModel):
    id: int
    name: str
    servicesCount: int


categories = {
    1: Category(id=1, name="Стрижки и укладки", servicesCount=5),
    2: Category(id=2, name="Маникюр и педикюр", servicesCount=5),
    3: Category(id=3, name="Брови и ресницы", servicesCount=4),
    4: Category(id=4, name="Спа-процедуры", servicesCount=4),
}

router = APIRouter(prefix="/categories", tags=["Категории"])


@router.get("", response_model=list[Category])
def get_categories() -> list[Category]:
    return list(categories.values())


@router.get(
    "/{category_id}",
    response_model=Category,
    responses={
        404: {
            "description": "Category not found",
            "content": {"text/plain": {"schema": {"type": "string"}}},
        },
    },
)
def get_category(category_id: int) -> Category | PlainTextResponse:
    category = categories.get(category_id)
    if category is None:
        return PlainTextResponse("Category not found", status_code=404)
    return category
