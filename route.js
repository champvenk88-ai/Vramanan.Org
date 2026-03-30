// app/api/chat/route.js — Agent 7: Visitor Chatbot
import { chat } from "@/lib/anthropic";
import { addChatMessage, incrementMetric } from "@/lib/db";

export async function POST(request) {
  try {
    const { messages, sessionId } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }

    // Store user message
    const lastMsg = messages[messages.length - 1];
    addChatMessage({ role: lastMsg.role, content: lastMsg.content, sessionId: sessionId || "anonymous" });
    incrementMetric("conversationsHandled");

    // Get AI response
    const reply = await chat(messages);

    // Store assistant reply
    addChatMessage({ role: "assistant", content: reply, sessionId: sessionId || "anonymous" });

    return Response.json({ reply });
  } catch (err) {
    console.error("[Chat API] Error:", err);
    return Response.json(
      { reply: "I'm here — please try again, or contact Champvenk88@gmail.com directly." },
      { status: 200 }
    );
  }
}
