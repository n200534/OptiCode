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

def analyze_code(code: str) -> dict:
    """Analyzes code for errors, improvements, and provides a corrected version."""
    try:
        model = genai.GenerativeModel(model_name='gemini-1.5-flash')

        prompt = (
            f"Analyze the following code, detect its programming language, check for errors, bugs, and improvements. "
            f"Provide a detailed explanation first. Then, return a corrected version in a separate code block:\n\n{code}\n\n"
            "Format your response as follows:\n"
            "### Explanation:\n"
            "[Your explanation here]\n\n"
            "### Corrected Code:\n"
            "```[language]\n"
            "[Your corrected code here]\n"
            "```"
        )

        response = model.generate_content([prompt])
        response_text = response.text.strip()

        # Split response into explanation and corrected code
        explanation, corrected_code = "", ""

        if "### Corrected Code:" in response_text:
            explanation, corrected_code = response_text.split("### Corrected Code:", 1)
        else:
            explanation = response_text  # If no corrected code, return full response as explanation

        return {
            "explanation": explanation.strip(),
            "corrected_code": corrected_code.strip() if corrected_code else ""
        }

    except Exception as e:
        logger.error(f"Code Checker Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing code: {str(e)}")
