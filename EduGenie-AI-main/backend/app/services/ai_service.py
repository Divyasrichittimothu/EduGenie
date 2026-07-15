import os
import json
import re

import google.generativeai as genai

from dotenv import load_dotenv

# ==========================================
#        LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file.")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

# ==========================================
#          COMMON GEMINI FUNCTION
# ==========================================

def generate_response(prompt: str) -> str:

    try:

        response = model.generate_content(prompt)

        if response.text:
            return response.text.strip()

        return "No response generated."

    except Exception as e:

        return f"Error: {str(e)}"


# ==========================================
#                ASK AI
# ==========================================

def ask_ai(question: str) -> str:

    prompt = f"""
You are EduGenie, an intelligent educational assistant.

Instructions:
- Answer accurately.
- Use simple English.
- Explain step-by-step when necessary.
- Use bullet points whenever appropriate.
- Keep the answer educational and student-friendly.

Student Question:

{question}
"""

    return generate_response(prompt)


# ==========================================
#             TEXT SUMMARIZER
# ==========================================

def summarize_text(text: str) -> str:

    prompt = f"""
You are EduGenie.

Summarize the following educational content.

Return the response in this format:

Summary

Key Points

Important Terms

Conclusion

Text:

{text}
"""

    return generate_response(prompt)


# ==========================================
#          LEARNING ROADMAP
# ==========================================

def generate_roadmap(topic: str) -> str:

    prompt = f"""
You are EduGenie.

Generate a complete learning roadmap.

Topic:

{topic}

Include these sections:

1. Beginner

2. Intermediate

3. Advanced

4. Recommended Projects

5. Recommended Books

6. YouTube Channels

7. Websites

8. Interview Preparation

9. Career Opportunities

10. Tips for Success

Return the roadmap in clean markdown.
"""

    return generate_response(prompt)


# ==========================================
#            QUIZ GENERATOR
# ==========================================

def generate_quiz(
    topic: str,
    difficulty: str,
    questions: int
):

    prompt = f"""
You are EduGenie.

Generate exactly {questions} Multiple Choice Questions.

Topic:
{topic}

Difficulty:
{difficulty}

IMPORTANT:

Return ONLY valid JSON.

Do NOT write markdown.

Do NOT write explanations.

Return this format only.

[
    {{
        "question":"Question",

        "options":[
            "Option A",
            "Option B",
            "Option C",
            "Option D"
        ],

        "answer":"Correct Option"
    }}
]
"""

    response = generate_response(prompt)

    try:

        cleaned = response.strip()

        cleaned = re.sub(
            r"^```json",
            "",
            cleaned,
            flags=re.IGNORECASE
        )

        cleaned = re.sub(
            r"^```",
            "",
            cleaned
        )

        cleaned = cleaned.replace(
            "```",
            ""
        )

        cleaned = cleaned.strip()

        quiz = json.loads(cleaned)

        return quiz

    except Exception:

        return [
            {
                "question": "Unable to generate quiz.",

                "options": [
                    "",
                    "",
                    "",
                    ""
                ],

                "answer": ""
            }
        ]


# ==========================================
#          GENERATE NOTES
# ==========================================

def generate_notes(topic: str) -> str:

    prompt = f"""
Prepare detailed study notes.

Topic:

{topic}

Include

Introduction

Definition

Explanation

Examples

Advantages

Disadvantages

Applications

Interview Questions

Summary
"""

    return generate_response(prompt)


# ==========================================
#       EXPLAIN CODE
# ==========================================

def explain_code(code: str) -> str:

    prompt = f"""
Explain the following code.

Explain every important line.

Mention

Purpose

Logic

Output

Best Practices

Code:

{code}
"""

    return generate_response(prompt)


# ==========================================
#        GENERATE FLASHCARDS
# ==========================================

def generate_flashcards(topic: str) -> str:

    prompt = f"""
Create study flashcards.

Topic:

{topic}

Each flashcard should contain

Question

Answer

Generate at least 10 flashcards.
"""

    return generate_response(prompt)