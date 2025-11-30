import os
from typing import Optional

from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

def get_supabase() -> Client:
    """Initialize and return a Supabase client.
    
    Returns:
        Client: Initialized Supabase client
        
    Raises:
        ValueError: If required environment variables are missing
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    
    if not url or not key:
        missing = []
        if not url:
            missing.append("SUPABASE_URL")
        if not key:
            missing.append("SUPABASE_ANON_KEY")
        raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
    
    return create_client(url, key)

# Create a single instance of the Supabase client
supabase = get_supabase()