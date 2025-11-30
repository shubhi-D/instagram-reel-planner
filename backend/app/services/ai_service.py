import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

import google.generativeai as genai

def configure_gemini():
    """Configure the Gemini API client"""
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def generate_reel_ideas_gemini(niche: str):
    """
    Generate structured Instagram Reel ideas using Google Gemini.
    Ensures clean JSON output.
    """
    configure_gemini()
    
    # Use the model from environment variable or default to gemini-1.5-flash
    model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    try:
        # Initialize the model
        model = genai.GenerativeModel(model_name)
        
        prompt = f"""
        You are an AI generating Instagram Reel ideas.

        Create EXACTLY 5 ideas for niche: "{niche}".

        Return ONLY a JSON array like:
        [
          {{
            "idea": "Idea text here",
            "hooks": ["Hook 1", "Hook 2", "Hook 3"],
            "caption_short": "Short caption",
            "caption_long": "Detailed caption with more information",
            "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
          }}
        ]

        Important:
        - No Markdown formatting
        - No explanations
        - ONLY return the JSON array
        - Ensure all fields are properly escaped
        - Include exactly 5 ideas
        """
        
        # Generate content
        response = model.generate_content(prompt)
        
        if not response.text:
            raise ValueError("Empty response from Gemini API")
            
        # Clean the response
        cleaned = re.sub(r"```(json)?|```", "", response.text).strip()
        
        # Parse JSON
        try:
            ideas = json.loads(cleaned)
            if not isinstance(ideas, list) or len(ideas) == 0:
                raise ValueError("Response is not a valid list of ideas")
            return ideas
        except json.JSONDecodeError as je:
            raise ValueError(f"Failed to parse JSON from response: {je}\nResponse was: {cleaned}")

    except Exception as e:
        raise ValueError(f"Gemini API Error: {str(e)}")