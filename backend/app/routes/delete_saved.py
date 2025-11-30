from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase

router = APIRouter(
    prefix="/delete-idea",
    tags=["saved-ideas"]  # Changed from "saved ideas" to "saved-ideas"
)

@router.delete("/{idea_id}")
async def delete_idea(idea_id: str):
    try:
        response = supabase.table("saved_ideas").delete().eq("id", idea_id).execute()

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Idea not found or already deleted"
            )

        return {"status": "success", "message": "Idea deleted successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete idea: {str(e)}"
        )