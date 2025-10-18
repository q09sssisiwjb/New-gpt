"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { customApiKeyStorage } from "@/lib/customApiKey";

interface CustomModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function CustomModelDialog({ isOpen, onClose, onSave }: CustomModelDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [modelId, setModelId] = useState("");
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existingData = customApiKeyStorage.get();
      if (existingData) {
        setApiKey(existingData.apiKey);
        setModelId(existingData.modelId || "");
        setHasExistingKey(true);
      } else {
        setApiKey("");
        setModelId("");
        setHasExistingKey(false);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert("Please enter an API key");
      return;
    }

    customApiKeyStorage.save(apiKey.trim(), modelId.trim() || undefined);
    onSave();
    onClose();
  };

  const handleRemove = () => {
    if (confirm("Are you sure you want to remove your custom API key?")) {
      customApiKeyStorage.remove();
      setApiKey("");
      setModelId("");
      setHasExistingKey(false);
      onSave();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Use Your Own OpenRouter API Key</DialogTitle>
          <DialogDescription>
            Enter your personal OpenRouter API key to use any model without rate limits. Your key is stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              OpenRouter API Key *
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-or-v1-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                openrouter.ai/keys
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="modelId" className="text-sm font-medium">
              Custom Model ID (Optional)
            </label>
            <Input
              id="modelId"
              type="text"
              placeholder="e.g., openai/gpt-4"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use the free models. Find model IDs at{" "}
              <a
                href="https://openrouter.ai/models"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                openrouter.ai/models
              </a>
            </p>
          </div>

          <div className="rounded-lg bg-muted p-3 text-xs space-y-1">
            <p className="font-medium">🔒 Privacy & Security</p>
            <p className="text-muted-foreground">
              Your API key is stored only in your browser's local storage and is never sent to our servers. 
              It's only used to make direct requests to OpenRouter on your behalf.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          {hasExistingKey && (
            <Button
              variant="destructive"
              onClick={handleRemove}
              className="sm:mr-auto"
            >
              Remove Key
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
