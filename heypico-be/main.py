from fastapi import FastAPI
from google.genai import types
from lib import types as my_types
from lib import env, tools

app = FastAPI()

@app.post("/api/chat")
def chat(chat_input: my_types.ChatInput):
    user_message = chat_input.user_message
    messages = chat_input.messages

    chat = env.create_chat(history=messages)

    gemini_tools = [
        tools.find_place_on_map]

    tool1 = types.FunctionDeclaration.from_callable(callable=tools.find_place_on_map, client=env.client)

    function_handler = {
        "find_place_on_map": tools.find_place_on_map,
    }

    gemini_tools = [
        types.Tool(
            function_declarations=[tool1],
            code_execution=types.ToolCodeExecution)]

    try:
        response = chat.send_message(message=user_message, config=types.GenerateContentConfig(
            tools=gemini_tools))

        function_call = response.candidates[0].content.parts[0].function_call

        function_api_response = False
        while function_call:
            function_name = function_call.name
            params = {key: value for key, value in function_call.args.items()}
            function_api_response = function_handler[function_name](**params)
            response = chat.send_message(
                types.Part.from_function_response(
                    name=function_name,
                    response={"content": function_api_response},
                ),
            )
            function_call = response.candidates[0].content.parts[0].function_call

        response_text = response.text.strip() if response.text else "I'm sorry, I couldn't generate a response."
        if function_api_response:
            response_text = [response_text, function_api_response.data.output]

    except Exception as e:
        response_text = f"An error occurred: {str(e)}"

    return {"response": response_text}