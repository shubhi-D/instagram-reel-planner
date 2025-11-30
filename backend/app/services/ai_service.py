import os
import json
import re
from dotenv import load_dotenv

load_dotenv()
from google import genai


def configure_gemini():
    return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


async def generate_reel_ideas_gemini(niche: str):
    client = configure_gemini()

    model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    prompt = f"""
    You are an AI generating Instagram Reel ideas.

    Create EXACTLY 5 ideas for niche: "{niche}".

    Return ONLY a JSON array like:
    [
      {{
        "idea": "Idea text",
        "hooks": ["Hook 1", "Hook 2", "Hook 3"],
        "caption_short": "Short caption",
        "caption_long": "Detailed caption",
        "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
      }}
    ]

    Rules:
    - ONLY return JSON
    - No markdown, no ``` fences
    - No explanation
    - Exactly 5 items
    """

    try:
        # FIXED → correct API usage for newest google-genai
        response = client.models.generate_content(
            model=model_name,
            contents=prompt   # <------ THIS is the correct argument
        )

        raw = response.text.strip()
        cleaned = re.sub(r"```json|```", "", raw).strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            raise ValueError(f"Gemini returned invalid JSON:\n{cleaned}")

    except Exception as e:
        raise ValueError(f"Gemini API Error: {str(e)}")
