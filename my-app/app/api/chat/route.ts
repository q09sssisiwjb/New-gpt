import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export async function POST(req: Request) {
  const { 
    messages, 
    model,
    customApiKey,
    customModelId 
  }: { 
    messages: UIMessage[]; 
    model?: string;
    customApiKey?: string;
    customModelId?: string;
  } = await req.json();
  
  const selectedModel = customModelId || model || "deepseek/deepseek-r1:free";
  
  let provider;
  if (customApiKey) {
    provider = createOpenRouter({
      apiKey: customApiKey
    });
  } else {
    provider = openrouter;
  }
  
  const result = streamText({
    model: provider(selectedModel),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
