from fastapi import APIRouter, HTTPException
from app.supabase_client import supabase

router = APIRouter(
    prefix="/get-saved-ideas",
    tags=["saved_ideas"]
)

@router.get("")
async def get_saved_ideas():
    """
    Fetch all saved ideas from Supabase in descending order of creation.
    
    Returns:
        List[dict]: List of saved ideas
    """
    try:
        # Execute the query - this will raise an exception if there's an error
        response = supabase.table("saved_ideas").select("*").order("created_at", desc=True).execute()
        return response.data
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch saved ideas: {str(e)}"
        )
