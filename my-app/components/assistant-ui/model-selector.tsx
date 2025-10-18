"use client";

import { useState, useEffect } from "react";
import { CustomModelDialog } from "./custom-model-dialog";
import { customApiKeyStorage } from "@/lib/customApiKey";

interface Model {
  id: string;
  name: string;
  context_length: number;
  description: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/models');
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        setModels(data.models || []);
        setError(null);
      } catch (err) {
        setError('Could not load models');
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
    setHasCustomKey(customApiKeyStorage.hasCustomKey());
  }, []);

  const handleCustomKeySaved = () => {
    setHasCustomKey(customApiKeyStorage.hasCustomKey());
  };

  const filteredModels = models.filter(model => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query) ||
      model.id.toLowerCase().includes(query)
    );
  });

  const handleDropdownToggle = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery("");
    }
  };

  const currentModel = models.find(m => m.id === selectedModel) || models[0] || { id: selectedModel, name: selectedModel };

  if (loading) {
    return (
      <div className="px-3 py-2 text-sm bg-secondary rounded-md">
        <span className="text-muted-foreground">Loading models...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2 text-sm bg-destructive/20 text-destructive rounded-md">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => handleDropdownToggle(!isOpen)}
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
            className="fixed inset-0 z-40" 
            onClick={() => handleDropdownToggle(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-popover border rounded-lg shadow-lg z-50 max-h-[500px] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-2 border-b">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="p-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Free OpenRouter Models ({filteredModels.length})
                </div>
                {filteredModels.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                    No models found
                  </div>
                ) : (
                  filteredModels.map((model) => (
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
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {model.description}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-muted-foreground">
                          {model.context_length > 0 ? `${(model.context_length / 1000).toFixed(0)}K` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </button>
                  ))
                )}
              </div>
            </div>
            <div className="border-t p-3 bg-muted/50">
              <p className="text-xs text-muted-foreground">
                💡 All models are free. Rate limit: 50 req/day (1,000 with $10+ credits)
              </p>
            </div>
            <div className="border-t p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsCustomDialogOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-sm"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <div className="flex-1 text-left">
                  <div className="font-medium">
                    Use Custom API Key
                    {hasCustomKey && (
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                        ✓ Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Use your own OpenRouter key for any model
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      <CustomModelDialog
        isOpen={isCustomDialogOpen}
        onClose={() => setIsCustomDialogOpen(false)}
        onSave={handleCustomKeySaved}
      />
    </div>
  );
};
