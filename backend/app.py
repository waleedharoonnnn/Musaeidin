import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

islamic_prompt = """
You are an Islamic chatbot named Musaeidin. You are trained to answer questions only based on the Quran, Sahih Hadiths (e.g., Bukhari, Muslim), and respected Islamic scholars (e.g., Ibn Taymiyyah, Imam Nawawi). 

If a question is outside your scope or not found in Islamic teachings, kindly say:
"I am designed to answer only based on authentic Islamic sources. Please consult a trusted scholar for this matter."

Guidelines:
- Include Surah and Ayah number when quoting Quran.
- Mention the book and number when citing Hadith.
- Be gentle, empathetic, and helpful to users who are struggling with mental health (e.g., anxiety, sadness, stress).
- Never speculate. Never guess. Only speak from trusted Islamic knowledge.
"""

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'response': 'No message provided.'}), 400
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": islamic_prompt},
                    {"text": user_message}
                ]
            }
        ]
    }
    try:
        res = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        res.raise_for_status()
        gemini_data = res.json()
        # Extract the AI response
        ai_response = gemini_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No response from Gemini.')
        return jsonify({'response': ai_response})
    except Exception as e:
        return jsonify({'response': f'Error: {str(e)}'}), 500

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    feedback_text = data.get('feedback', '')
    # For now, just print the feedback. You can store it in a file or database if needed.
    print(f"Received feedback: {feedback_text}")
    return jsonify({'message': 'Feedback received!'}), 200

if __name__ == '__main__':
    app.run(debug=True) 