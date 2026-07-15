import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def ask_gemini(question: str):
    try:
        response = model.generate_content(question)
        return response.text

    except ResourceExhausted:
        return (
            "⚠️ Gemini API quota exceeded. "
            "Please wait a while or use a new API key."
        )

    except Exception as e:
        return f"Error: {str(e)}"

def generate_quiz(topic: str, number_of_questions: int):

    prompt = f"""
Generate {number_of_questions} multiple-choice questions about {topic}.

Rules:

- Four options (A, B, C, D)
- Mention the correct answer
- Keep explanations short
- Make the quiz suitable for students
"""

    response = model.generate_content(prompt)

    return response.text





def summarize_text(text: str):

    prompt = f"""
You are an educational assistant.

Summarize the following notes.

Requirements:
- Keep the summary short.
- Use bullet points.
- Highlight important concepts.
- Make it easy for students to study.

Text:

{text}
"""

    response = model.generate_content(prompt)

    return response.text




def generate_roadmap(topic: str):

    prompt = f"""
Create a complete learning roadmap for:

{topic}

Requirements:

- Beginner to Advanced
- Weekly plan
- Important topics
- Practice projects
- Learning resources
- Keep it student friendly
"""

    response = model.generate_content(prompt)

    return response.text