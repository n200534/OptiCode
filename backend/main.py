import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import code_checker
import formatter
import optimizer
import explainer
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY is not set in the environment")
# Logging setup
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# FastAPI setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    code: str

# Route handlers to call respective modules
@app.post("/code-checker")
async def check_code(request: CodeRequest):
    """Calls the code checker module."""
    try:
        logger.info(f"Code Checker Request: {request.dict()}")
        return code_checker.analyze_code(request.code)
    except Exception as e:
        logger.error(f"Code Checker Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/formatter")
async def format_code(request: CodeRequest):
    """Calls the code formatter module."""
    try:
        logger.info(f"Formatter Request: {request.dict()}")
        return formatter.format_code(request.code)
    except Exception as e:
        logger.error(f"Formatter Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimizer")
async def optimize_code(request: CodeRequest):
    """Calls the code optimizer module."""
    try:
        logger.info(f"Optimizer Request: {request.dict()}")
        # Call the updated optimizer function
        result = optimizer.optimize_code(request.code)
        return {
            "optimized_code": result["optimized_code"],
            "profiling_results": result["profiling_results"],
        }
    except Exception as e:
        logger.error(f"Optimizer Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/explainer")
async def explain_code(request: CodeRequest):
    """Calls the code explainer module."""
    try:
        logger.info(f"Explainer Request: {request.dict()}")
        return explainer.explain_code(request.code)
    except Exception as e:
        logger.error(f"Explainer Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
