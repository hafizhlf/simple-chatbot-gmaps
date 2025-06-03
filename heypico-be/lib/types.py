from typing import List
from pydantic import BaseModel
from google.genai import types

class ChatInput(BaseModel):
    user_message: str
    messages: List[types.Content]

class DataModel(BaseModel):
    output: str

class ResponseModel(BaseModel):
    status: str
    data: DataModel
