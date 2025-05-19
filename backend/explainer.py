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

def explain_code(code: str) -> dict:
    """Explains the given code with comments and step-by-step breakdowns."""
    try:
        model = genai.GenerativeModel(model_name='gemini-1.5-flash')

        prompt = (
            f"Detect the programming language and explain the following code in detail. "
            f"Break it down step by step. Whenever showing a part of the code, format it as follows:\n\n"
            f"```\n[Code snippet here]\n```\n\n"
            f"Here is the code:\n\n{code}"
        )

        response = model.generate_content([prompt])
        explanation = response.text.strip()

        return {"explanation": explanation}

    except Exception as e:
        logger.error(f"Explainer Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error explaining code: {str(e)}")
