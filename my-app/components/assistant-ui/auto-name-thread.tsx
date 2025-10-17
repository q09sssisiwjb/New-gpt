"use client";

import { useEffect, useRef } from "react";
import { useThreadListItem, useThreadListItemRuntime } from "@assistant-ui/react";
import { generateTitleFromMessage } from "@/lib/generateTitle";

export const AutoNameThreadItem = () => {
  const runtime = useThreadListItemRuntime();
  const title = useThreadListItem((m) => m.title);
  const threadId = useThreadListItem((m) => m.threadId);
  const hasGeneratedTitle = useRef(new Set<string>());

  useEffect(() => {
    // Only auto-generate if the title is still "New Chat" and we haven't generated for this thread yet
    if (title !== "New Chat" || hasGeneratedTitle.current.has(threadId)) return;

    // Get the thread's messages through the runtime
    const state = runtime.getState();
    
    // Wait a bit to ensure messages are loaded
    const timer = setTimeout(async () => {
      try {
        const threadState = runtime.getState();
        
        // Check if there are messages (this is runtime-specific)
        // For now, we'll generate a title on first interaction
        // The actual message content isn't accessible from ThreadListItemRuntime
        
        // Mark as generated to prevent repeated attempts
        hasGeneratedTitle.current.add(threadId);
      } catch (e) {
        console.error("Error auto-naming thread:", e);
        hasGeneratedTitle.current.add(threadId);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [runtime, title, threadId]);

  return null;
};
