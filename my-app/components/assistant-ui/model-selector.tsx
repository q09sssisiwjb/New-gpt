"use client";

import { useState, useEffect } from "react";

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
  }, []);

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
                Free OpenRouter Models ({models.length})
              </div>
              {models.length === 0 ? (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No models available
                </div>
              ) : (
                models.map((model) => (
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
            <div className="border-t p-3 bg-muted/50">
              <p className="text-xs text-muted-foreground">
                💡 All models are free. Rate limit: 50 req/day (1,000 with $10+ credits)
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
