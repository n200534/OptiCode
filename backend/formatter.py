import google.generativeai as genai
import os
import logging
from fastapi import HTTPException
from dotenv import load_dotenv
import os

load_dotenv()  # Load .env file
# Initialize Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set in the environment")
genai.configure(api_key=GOOGLE_API_KEY)

logger = logging.getLogger(__name__)

def format_code(code: str) -> dict:
    """Formats code according to best practices (indentation, spacing, readability)."""
    try:
        model = genai.GenerativeModel(model_name='gemini-1.5-flash')

        prompt = (
            f"Detect the programming language and format the following code according to best practices: "
            f"proper indentation, spacing, and readability. Return only the formatted code without any explanation:\n\n{code}"
        )

        response = model.generate_content([prompt])
        formatted_code = response.text.strip()

        return {"formatted_code": formatted_code}

    except Exception as e:
        logger.error(f"Formatter Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error formatting code: {str(e)}")
