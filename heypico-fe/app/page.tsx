"use client"

import { useChat } from "ai/react"
import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { marked } from "marked"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { input, handleInputChange } = useChat()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      }
      setMessages([...messages, newMessage])
      simulateAIResponse()
      setInputValue("")
    }
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsTyping(true)
  }

  const simulateAIResponse = async () => {
    setIsTyping(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_message: inputValue,
          messages: messages
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const result = await data.message
      if (Array.isArray(result)) {

        result.forEach((item, index) => {
          const aiMessage: Message = {
            id: Date.now() + index,
            text: item.toString(),
            sender: "ai",
            timestamp: new Date(),
          }
          setMessages((prevMessages) => [...prevMessages, aiMessage])
        });
      } else {
        const aiMessage: Message = {
          id: Date.now(),
          text: result.toString(),
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prevMessages) => [...prevMessages, aiMessage])
      }
    } catch (error) {
      console.error('Error fetching chat response:', error);
    }
    setIsTyping(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-center">AI Chatbot</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <p className="mb-2">👋 Welcome to the AI Chatbot!</p>
                <p>Ask me anything to get started.</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-2 max-w-[80%]">
                  {message.sender !== "user" && (
                    <Avatar className="h-8 w-8 bg-primary">
                      <span className="text-xs font-bold">AI</span>
                    </Avatar>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: message.text }} />
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 bg-zinc-800">
                      <span className="text-xs font-bold">You</span>
                    </Avatar>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8 bg-primary">
                  <span className="text-xs font-bold">AI</span>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={inputValue}
              onChange={handleOnChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
