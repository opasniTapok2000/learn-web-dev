from fastapi import FastAPI

from categories import router


app = FastAPI(title="Категории услуг")
app.include_router(router)
