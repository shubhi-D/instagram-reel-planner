from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.health import router as health_router
from app.routes.generate import router as generate_router
from app.routes.save import router as save_router 
from app.routes.get_saved import router as get_saved_router
from app.routes.delete_saved import router as delete_router

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Instagram Reel Planner API",
        description="API for generating Instagram reel ideas",
        version="1.0.0"
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # For development only
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(health_router)
    app.include_router(generate_router, prefix="/api")
    app.include_router(save_router, prefix="/api")
    app.include_router(get_saved_router,prefix="/api")
    app.include_router(delete_router, prefix="/api")


    @app.get("/")
    async def root():
        return {"message": "Instagram Reel Planner API is running"}

    return app

app = create_app()
