from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.supabase_client import get_supabase

# Create router
router = APIRouter(
    prefix="/save-idea",
    tags=["save"],
    responses={404: {"description": "Not found"}}
)

# Pydantic model for request body
class SaveIdeaModel(BaseModel):
    idea: str
    hooks: List[str]
    caption_short: str
    caption_long: str
    hashtags: List[str]
    niche: str

async def save_idea_to_supabase(idea_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save an idea to the Supabase saved_ideas table.
    
    Args:
        idea_data: Dictionary containing idea data matching SaveIdeaModel
        
    Returns:
        Dict with success/error message
        
    Raises:
        HTTPException: If there's an error saving to Supabase
    """
    try:
        supabase = get_supabase()
        response = supabase.table("saved_ideas").insert(idea_data).execute()
        
        if not response.data:
            raise ValueError("No data returned from Supabase insert")
            
        return {"message": "Idea saved successfully"}
        
    except Exception as e:
        error_msg = f"Failed to save idea: {str(e)}"
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_msg
        )

@router.post("", status_code=status.HTTP_200_OK)
async def save_idea(idea: SaveIdeaModel) -> Dict[str, str]:
    """
    Save a generated idea to the database.
    
    Args:
        idea: SaveIdeaModel containing the idea data
        
    Returns:
        Success message on successful save
    """
    try:
        # Convert Pydantic model to dict for Supabase
        idea_data = idea.dict()
        
        # Save to Supabase
        return await save_idea_to_supabase(idea_data)
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )