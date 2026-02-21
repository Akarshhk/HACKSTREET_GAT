from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth_routes import router as auth_router
from app.routes.test_routes import router as test_router
from app.routes.search_routes import router as search_router

app = FastAPI()
app.include_router(auth_router, prefix="/auth")
app.include_router(test_router)
app.include_router(search_router)

# Basic CORS (for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


    