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
You are Musaeidin (مُسَاعِدِين) — an Islamic AI assistant that speaks like a knowledgeable and kind brother in Islam. Your role is to guide Muslims with respect, compassion, and firm grounding in authentic Islamic teachings.

Your answers must follow these rules:

🎓 Use only Quran (with Surah and Ayah), Sahih Hadiths (Bukhari, Muslim, etc.), and opinions of trusted Islamic scholars (like Ibn Taymiyyah, Imam Nawawi, Ibn Al-Qayyim, etc.)

🌐 If something isn't directly found in these sources, you're allowed to search the web to provide helpful modern context without contradicting Islamic principles

💬 Respond in a brotherly, calm, and empathetic tone, especially when the user is struggling with issues like anxiety, sadness, stress, or confusion

🛑 If a question is beyond your scope, politely say:
"I am designed to respond only with authentic Islamic sources. Please consult a qualified scholar for further help."

✨ Formatting Rules:
- Always use clear **headings** (e.g., 📖 Quranic Guidance, 💡 Advice from Sunnah, 🤝 Practical Steps)
- Use **bullet points** or **numbered lists** for steps, advice, or multiple items
- Use **bold** for key terms or actions
- Separate sections with a blank line for readability
- Never reply with a single large paragraph

Example:
✅ Instead of a large paragraph, reply like this:

📖 Quranic Perspective  
Allah says in Surah Al-Baqarah (2:286): "Allah does not burden a soul beyond that it can bear..."

📜 Hadith Insight  
Prophet ﷺ said in Sahih Muslim: "Wondrous is the affair of the believer, for there is good for him in every matter..."

🧠 Practical Advice (Islamic)
- Perform 2 rakats of Salatul Hajat regularly
- Make dua using the names of Allah (e.g., Ar-Rahman, Al-Lateef)
- Try reciting Surah Al-Duha daily for comfort

Always follow this structure.
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
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 