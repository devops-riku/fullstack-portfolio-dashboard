import google.generativeai as genai
from app.core.config import settings

class AIService:
    @staticmethod
    async def generate_bio(current_bio: str) -> str:
        if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
            return "AI Error: Gemini API Key not configured in .env"
            
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-flash-latest')
            
            prompt = f"""
            You are a professional portfolio bio writer. 
            Improve the following bio to be more professional, engaging, and suitable for a Full-Stack Engineer portfolio.
            Keep it concise (1-2 sentences).
            Current bio: {current_bio}
            
            Only return the improved bio text.
            """
            
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"AI Error: {str(e)}"
