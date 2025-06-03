import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const BACKEND_HOST = process.env.BACKEND_HOST

    const { user_message, messages } = await request.json()

    interface Message {
      sender: "ai" | "user"
      text: string
    }

    const transformedMessages = messages.map((msg: Message) => ({
      role: msg.sender === "ai" ? "model" : "user",
      parts: [{ text: msg.text }],
    }))

    const response = await fetch(`http://${BACKEND_HOST}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          user_message: user_message,
          messages: transformedMessages
        }),
      })

    const data = await response.json()

    return NextResponse.json({ message: data.response }, { status: 200 })
}
