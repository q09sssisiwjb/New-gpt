"use client";

import { useEffect, useRef } from "react";
import { useThread, useThreadRuntime } from "@assistant-ui/react";
import { generateTitleFromMessage } from "@/lib/generateTitle";
import { titleStorage } from "@/lib/titleStorage";

export const AutoTitleGenerator = () => {
  const thread = useThread();
  const runtime = useThreadRuntime();
  const hasGeneratedTitle = useRef(false);
  const lastMessageCount = useRef(0);
  const currentThreadId = useRef(thread.threadId);

  useEffect(() => {
    if (currentThreadId.current !== thread.threadId) {
      hasGeneratedTitle.current = false;
      lastMessageCount.current = 0;
      currentThreadId.current = thread.threadId;
    }
  }, [thread.threadId]);

  useEffect(() => {
    const messages = thread.messages;
    
    if (messages.length === lastMessageCount.current) {
      return;
    }
    
    lastMessageCount.current = messages.length;

    if (hasGeneratedTitle.current || messages.length === 0) {
      return;
    }

    const firstUserMessage = messages.find(msg => msg.role === 'user');
    
    if (!firstUserMessage || !firstUserMessage.content || firstUserMessage.content.length === 0) {
      return;
    }

    const textContent = firstUserMessage.content
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join(' ');

    if (!textContent.trim()) {
      return;
    }

    setTimeout(async () => {
      try {
        const generatedTitle = await generateTitleFromMessage(textContent);
        
        if (generatedTitle && generatedTitle !== 'New Chat') {
          const threadId = thread.threadId;
          titleStorage.saveTitle(threadId, generatedTitle);
          hasGeneratedTitle.current = true;
        }
      } catch (error) {
        console.error("Error generating title:", error);
      }
    }, 500);
  }, [thread.messages, thread.threadId, runtime]);

  return null;
};
