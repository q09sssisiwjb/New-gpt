"use client";

import { useEffect, useRef } from "react";
import { useThreadListItem, useThreadListItemRuntime } from "@assistant-ui/react";

export const AutoNameThreadItem = () => {
  const runtime = useThreadListItemRuntime();
  const title = useThreadListItem((m) => m.title);
  const threadId = useThreadListItem((m) => m.threadId);
  const hasGeneratedTitle = useRef(new Set<string>());

  useEffect(() => {
    if (title !== "New Chat" || hasGeneratedTitle.current.has(threadId)) return;

    const timer = setTimeout(async () => {
      try {
        runtime.getState();
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
