import google.generativeai as genai
import os
import logging
from fastapi import HTTPException
from typing import Dict, Any
from dotenv import load_dotenv
import os

load_dotenv()  # Load .env file
# Initialize Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set in the environment")
genai.configure(api_key=GOOGLE_API_KEY)

logger = logging.getLogger(__name__)

def optimize_code(code: str) -> Dict[str, Any]:
    """Optimizes the given code for efficiency, best practices, and readability."""
    try:
        # Step 1: Optimize the code
        optimized_code = optimize_code_with_gemini(code)

        # Step 2: Profile the code for performance bottlenecks
        profiling_results = profile_code_with_gemini(code)

        return {
            "optimized_code": optimized_code,
            "profiling_results": profiling_results,
        }

    except Exception as e:
        logger.error(f"Optimizer Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error optimizing code: {str(e)}")

def optimize_code_with_gemini(code: str) -> str:
    """Uses Gemini AI to optimize the code."""
    try:
        model = genai.GenerativeModel(model_name='gemini-1.5-flash')

        prompt = (
            f"Detect the programming language and optimize the following code for best practices, "
            f"efficiency, and readability. Provide only the optimized version:\n\n{code}"
        )

        response = model.generate_content([prompt])
        return response.text.strip()

    except Exception as e:
        logger.error(f"Gemini Optimization Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error optimizing code with Gemini: {str(e)}")

def profile_code_with_gemini(code: str) -> Dict[str, Any]:
    """Uses Gemini AI to profile the code and identify performance bottlenecks."""
    try:
        model = genai.GenerativeModel(model_name='gemini-1.5-flash')

        prompt = (
            f"Analyze the following code for performance bottlenecks. "
            f"Identify inefficient operations, memory usage issues, and potential optimizations. "
            f"Provide a detailed explanation and suggest improvements:\n\n{code}"
        )

        response = model.generate_content([prompt])
        profiling_results = response.text.strip()

        return {
            "analysis": profiling_results,
        }

    except Exception as e:
        logger.error(f"Gemini Profiling Error: {str(e)}")
        return {"error": str(e)}