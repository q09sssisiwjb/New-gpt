import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText, UIMessage, convertToModelMessages } from "ai";

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model?: string } = await req.json();
  
  const selectedModel = model || "deepseek/deepseek-r1:free";
  
  const result = streamText({
    model: openrouter(selectedModel),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
