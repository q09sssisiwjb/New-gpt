"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModelSelector } from "@/components/assistant-ui/model-selector";
import { useState, useEffect, useMemo } from "react";
import { customApiKeyStorage } from "@/lib/customApiKey";

export const Assistant = () => {
  const [selectedModel, setSelectedModel] = useState("meta-llama/llama-4-maverick:free");
  const [customKeyTimestamp, setCustomKeyTimestamp] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => {
      setCustomKeyTimestamp(Date.now());
    };

    window.addEventListener('storage', handleStorageChange);
    
    const handleCustomEvent = () => {
      setCustomKeyTimestamp(Date.now());
    };
    window.addEventListener('customApiKeyUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customApiKeyUpdated', handleCustomEvent);
    };
  }, []);

  const customApiKeyData = useMemo(() => {
    return customApiKeyStorage.get();
  }, [customKeyTimestamp]);

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
      body: {
        model: selectedModel,
        ...(customApiKeyData && {
          customApiKey: customApiKeyData.apiKey,
          customModelId: customApiKeyData.modelId,
        }),
      },
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5">
          <ThreadListSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="https://openrouter.ai/models/?q=free"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      OpenRouter Free Models
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>AI Assistant</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="ml-auto">
                <ModelSelector 
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
              </div>
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
