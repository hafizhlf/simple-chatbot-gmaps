import os
from google import genai
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env.local')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
client = genai.Client(api_key=GEMINI_API_KEY)

def create_chat(history):
    chat = client.chats.create(model="gemini-2.0-flash", history=history)
    return chat
