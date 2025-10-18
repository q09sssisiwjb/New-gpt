"use client";

import { useEffect, useRef, useState } from "react";
import { useThreadListItem, useThreadListItemRuntime } from "@assistant-ui/react";
import { chatHistoryService } from "@/lib/chatHistory";
import { generateTitleFromMessage } from "@/lib/generateTitle";

export const AutoNameThreadItem = () => {
  const runtime = useThreadListItemRuntime();
  const title = useThreadListItem((m) => m.title);
  const threadId = useThreadListItem((m) => m.threadId);
  const hasGeneratedTitle = useRef(new Set<string>());
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setRetryCount(0);
  }, [threadId]);

  useEffect(() => {
    if (title !== "New Chat" || hasGeneratedTitle.current.has(threadId)) return;

    const maxRetries = 10;
    const retryDelay = retryCount === 0 ? 2000 : Math.min(5000, 2000 + retryCount * 1000);

    const timer = setTimeout(async () => {
      try {
        const messages = await chatHistoryService.getMessages(threadId);
        
        const firstUserMessage = messages.find(msg => msg.role === 'user');
        
        if (!firstUserMessage || !firstUserMessage.content) {
          if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
          }
          return;
        }

        const generatedTitle = await generateTitleFromMessage(firstUserMessage.content);
        
        if (generatedTitle && generatedTitle !== 'New Chat') {
          await runtime.rename(generatedTitle);
          hasGeneratedTitle.current.add(threadId);
        } else if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
        }
      } catch (e) {
        console.error("Error auto-naming thread:", e);
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
        }
      }
    }, retryDelay);

    return () => clearTimeout(timer);
  }, [runtime, title, threadId, retryCount]);

  return null;
};
