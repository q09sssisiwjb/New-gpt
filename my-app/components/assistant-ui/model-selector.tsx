"use client";

import { FREE_MODELS } from "@/lib/free-models";
import { useState } from "react";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = FREE_MODELS.find(m => m.id === selectedModel) || FREE_MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary rounded-md hover:bg-secondary/80 transition-colors"
      >
        <span className="font-medium">{currentModel.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-96 bg-popover border rounded-lg shadow-lg z-20 max-h-[500px] overflow-y-auto">
            <div className="p-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Free OpenRouter Models
              </div>
              {FREE_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${
                    selectedModel === model.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{model.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {model.description}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-muted-foreground">{model.parameters}</div>
                      <div className="text-xs text-muted-foreground">{model.contextLength}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t p-3 bg-muted/50">
              <p className="text-xs text-muted-foreground">
                💡 All models are free to use. Rate limit: 50 requests/day without credits, 1,000/day with $10+ credits.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
