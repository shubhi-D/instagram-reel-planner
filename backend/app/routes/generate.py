from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import random
from typing import List, Optional
from app.services.ai_service import generate_reel_ideas_gemini


# Pydantic models
class InputModel(BaseModel):
    niche: str = Field(..., description="The niche/topic for generating reel ideas")

class OutputModel(BaseModel):
    idea: str = Field(..., description="The main idea for the reel")
    hooks: List[str] = Field(..., description="List of attention-grabbing hooks")
    caption_short: str = Field(..., description="Short caption for the reel")
    caption_long: str = Field(..., description="Detailed caption for the reel")
    hashtags: List[str] = Field(..., description="Relevant hashtags")

# Create router with /api prefix to match frontend expectations
router = APIRouter(
   # prefix="/api",
    tags=["ideas"],
    responses={404: {"description": "Not found"}},
)

def generate_hooks(niche: str, idea_type: str) -> List[str]:
    """Generate 3 unique hooks based on niche and idea type."""
    hooks_templates = [
        f"Struggling with {niche}? Here's what you need to know!",
        f"3 {niche} {idea_type} that changed everything for me",
        f"The {niche} mistakes everyone makes (and how to fix them)",
        f"These {niche} {idea_type} are taking over!",
        f"Up your {niche} game with these {idea_type}",
        f"Don't fall behind on these {niche} {idea_type}",
        f"How I grew my {niche} using these {idea_type}",
        f"Top {random.randint(3,7)} {niche} {idea_type} you need to try",
        f"{niche.capitalize()} {idea_type} that actually work",
        f"Stop doing {niche} wrong - try these {idea_type} instead"
    ]
    return random.sample(hooks_templates, 3)

def generate_hashtags(niche: str, idea_type: str) -> List[str]:
    """Generate 5 relevant hashtags."""
    base_tags = [
        f"#{niche}",
        f"#{niche}{idea_type.replace(' ', '')}",
        f"#{niche}ideas",
        "contentcreation",
        "socialmediamarketing"
    ]
    return [tag.lower().replace(" ", "") for tag in base_tags]

def create_mock_idea(niche: str, index: int) -> OutputModel:
    """
    Create a single mock idea with dynamic content based on niche.
    
    Args:
        niche: The niche/topic for the idea
        index: Index of the idea (0-9) to ensure variety
        
    Returns:
        OutputModel with generated idea content
    """
    idea_types = [
        "tips", "tricks", "hacks", "strategies", "secrets",
        "trends", "ideas", "methods", "techniques", "insights"
    ]
    idea_type = idea_types[index % len(idea_types)]
    
    idea = f"{random.randint(3,7)} {niche} {idea_type} you need to know"
    
    return OutputModel(
        idea=idea,
        hooks=generate_hooks(niche, idea_type),
        caption_short=f"Master {niche} with these {idea_type}!",
        caption_long=(
            f"Here are some amazing {niche} {idea_type} that will help you "
            f"improve your {niche} game. Save this post for later reference! "
            f"#Learn{niche.capitalize().replace(' ', '')} #Best{idea_type.capitalize()}"
        ),
        hashtags=generate_hashtags(niche, idea_type)
    )

async def generate_reel_ideas(niche: str, num_ideas: int = 10) -> List[OutputModel]:
    """
    Generate mock Instagram reel ideas for testing.
    
    Args:
        niche: The niche/topic for generating reel ideas
        num_ideas: Number of ideas to generate (default: 10, max: 10)
        
    Returns:
        List of generated reel ideas as OutputModel objects
    """
    # Ensure we don't generate more than 10 ideas
    num_ideas = min(max(1, num_ideas), 10)
    
    # Generate unique ideas
    return [create_mock_idea(niche, i) for i in range(num_ideas)]

@router.post("/generate-ideas", response_model=List[OutputModel], status_code=status.HTTP_200_OK)
async def generate_ideas(input_data: InputModel):
    """
    Generate Instagram reel ideas using Azure OpenAI GPT-4o-mini.
    """
    try:
        ideas = await generate_reel_ideas_gemini(input_data.niche) # Added 'await' here
        return [OutputModel(**idea) for idea in ideas]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )