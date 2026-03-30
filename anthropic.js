// lib/anthropic.js — Server-side Anthropic client (NEVER import in client components)

import Anthropic from "@anthropic-ai/sdk";

let client = null;

export function getClient() {
  if (!client) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      console.error("[Anthropic] No API key configured");
      return null;
    }
    client = new Anthropic({ apiKey: key });
  }
  return client;
}

export const SITE_CONTEXT = `You are V Ramanan's AI assistant on vramanan.org.

ABOUT V RAMANAN:
- Toronto-based children's book author, pen name: Ramanan V
- Published two books: "Nature Rituals: Emotional Recipes for Children" through American Publishers Inc.
- Book concept: World's first cookbook organized by a child's emotional state, not by ingredient
- Maps 15 emotions: Courage, Anxiety, Grief, Anger, Kindness, Loneliness, Self-Worth, Resilience, Empathy, Fear, Gratitude, Jealousy, Patience, Honesty, Love
- Uses nature-based rituals, earth breathing techniques, seasonal activities
- Website: vramanan.org | Email: Champvenk88@gmail.com
- LinkedIn: linkedin.com/in/venkata-ramanan-22419247
- Target audience: Parents with children ages 4-13
- Inspiration: A walk in Stan Wadlow Park, Toronto with his son
- Signature quote: "We do not walk through nature. We walk with it. And when we do, healing becomes inevitable."
- Core values: Honesty, Kindness, Love, Spirituality, Creativity, Courage
- Publisher: American Publishers Inc. (publisher handles book sales)

PERSONALITY: Warm, nature-inspired, emotionally intelligent. Use nature metaphors. Never aggressive or salesy. Always heartfelt and authentic.`;

export async function chat(messages, systemOverride) {
  const anthropic = getClient();
  if (!anthropic) {
    return "I'm currently being set up. Please reach out to Champvenk88@gmail.com directly!";
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemOverride || SITE_CONTEXT + `\n\nYou answer visitor questions warmly and clearly. If asked about purchasing books, direct them to contact V Ramanan at Champvenk88@gmail.com. Guide visitors to the contact form for inquiries.`,
      messages: messages.slice(-10),
    });

    return response.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n");
  } catch (err) {
    console.error("[Anthropic] Error:", err.message);
    return "A brief pause — like a breeze passing through the garden. Please try again, or reach out directly at Champvenk88@gmail.com.";
  }
}
