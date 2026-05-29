import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def load_system_prompt() -> str:
    prompt_path = os.path.join(os.path.dirname(__file__), "..", "system_prompt.txt")
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()

SYSTEM_PROMPT = load_system_prompt()

def build_model(konteks_hukum: str = ""):
    """Buat Gemini model instance, dengan konteks RAG jika ada."""
    system = SYSTEM_PROMPT
    if konteks_hukum:
        system += f"\n\n{konteks_hukum}"

    return genai.GenerativeModel(
        model_name="models/gemini-2.5-flash",
        system_instruction=system,
        generation_config=genai.GenerationConfig(
            temperature=0.3,
            max_output_tokens=2048,
        )
    )

def stream_chat(message: str, history: list, konteks_hukum: str = ""):
    """
    Generator untuk streaming response dari Gemini.
    history format: [{"role": "user"|"model", "parts": ["teks"]}]
    """
    model = build_model(konteks_hukum)
    chat_session = model.start_chat(history=history)
    response = chat_session.send_message(message, stream=True)
    for chunk in response:
        if chunk.text:
            yield chunk.text

def chat_once(message: str, history: list, konteks_hukum: str = "") -> str:
    """Non-streaming, untuk generate dokumen JSON."""
    model = build_model(konteks_hukum)
    chat_session = model.start_chat(history=history)
    response = chat_session.send_message(message)
    return response.text
