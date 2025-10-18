"use client";

import { useEffect, useState } from "react";
import { useThreadListItem, useThreadListItemRuntime } from "@assistant-ui/react";
import { titleStorage } from "@/lib/titleStorage";

export const AutoNameThreadItem = () => {
  const runtime = useThreadListItemRuntime();
  const title = useThreadListItem((m) => m.title);
  const threadId = useThreadListItem((m) => m.threadId);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const savedTitle = titleStorage.getTitle(threadId);
    if (savedTitle && savedTitle !== 'New Chat' && savedTitle !== title) {
      runtime.rename(savedTitle);
    }

    const handleTitleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ threadId: string; title: string }>;
      if (customEvent.detail.threadId === threadId && customEvent.detail.title !== title) {
        runtime.rename(customEvent.detail.title);
        forceUpdate(prev => prev + 1);
      }
    };

    window.addEventListener('chat-title-updated', handleTitleUpdate);
    return () => window.removeEventListener('chat-title-updated', handleTitleUpdate);
  }, [threadId, runtime, title]);

  return null;
};
