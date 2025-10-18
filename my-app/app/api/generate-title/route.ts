import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { message }: { message: string } = await req.json();
    
    if (!message || message.trim().length === 0) {
      return Response.json({ title: 'New Chat' });
    }

    const result = await generateText({
      model: openrouter("mistral/mistral-small-3.1:free"),
      prompt: `Generate a concise, descriptive title (5-7 words maximum) for a chat conversation that starts with this user message. Only respond with the title, nothing else.

User message: "${message}"

Title:`,
      temperature: 0.7,
    });

    let title = result.text.trim();
    
    title = title.replace(/^["']|["']$/g, '');
    title = title.replace(/^Title:\s*/i, '');
    
    const words = title.split(/\s+/);
    if (words.length > 7) {
      title = words.slice(0, 7).join(' ');
    }
    
    if (title.length > 60) {
      title = title.slice(0, 60).trim();
      if (!title.match(/[.!?]$/)) {
        title += '...';
      }
    }

    return Response.json({ title: title || 'New Chat' });
  } catch (error) {
    console.error('Error generating title:', error);
    return Response.json({ title: 'New Chat' }, { status: 500 });
  }
}
