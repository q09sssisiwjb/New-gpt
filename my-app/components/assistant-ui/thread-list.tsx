import type { FC } from "react";
import { useState, useEffect, useRef } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
  useAssistantState,
  useThreadListItem,
  useThreadListItemRuntime,
} from "@assistant-ui/react";
import { Trash2Icon, PlusIcon, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { AutoNameThreadItem } from "@/components/assistant-ui/auto-name-thread";

export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="aui-root aui-thread-list-root flex flex-col items-stretch gap-1.5">
      <ThreadListNew />
      <ThreadListItems />
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <Button
        className="aui-thread-list-new flex items-center justify-start gap-1 rounded-lg px-2.5 py-2 text-start hover:bg-muted data-active:bg-muted"
        variant="ghost"
      >
        <PlusIcon />
        New Thread
      </Button>
    </ThreadListPrimitive.New>
  );
};

const ThreadListItems: FC = () => {
  const isLoading = useAssistantState(({ threads }) => threads.isLoading);

  if (isLoading) {
    return <ThreadListSkeleton />;
  }

  return <ThreadListPrimitive.Items components={{ ThreadListItem }} />;
};

const ThreadListSkeleton: FC = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          role="status"
          aria-label="Loading threads"
          aria-live="polite"
          className="aui-thread-list-skeleton-wrapper flex items-center gap-2 rounded-md px-3 py-2"
        >
          <Skeleton className="aui-thread-list-skeleton h-[22px] flex-grow" />
        </div>
      ))}
    </>
  );
};

const ThreadListItem: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <ThreadListItemPrimitive.Root className="aui-thread-list-item flex items-center gap-2 rounded-lg transition-all hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-active:bg-muted">
      <AutoNameThreadItem />
      <ThreadListItemPrimitive.Trigger className="aui-thread-list-item-trigger flex-grow px-3 py-2 text-start">
        <ThreadListItemTitle isEditing={isEditing} setIsEditing={setIsEditing} />
      </ThreadListItemPrimitive.Trigger>
      {!isEditing && (
        <>
          <ThreadListItemRename onEdit={() => setIsEditing(true)} />
          <ThreadListItemDelete />
        </>
      )}
    </ThreadListItemPrimitive.Root>
  );
};

const ThreadListItemTitle: FC<{
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}> = ({ isEditing, setIsEditing }) => {
  const runtime = useThreadListItemRuntime();
  const title = useThreadListItem((m) => m.title);
  const [editValue, setEditValue] = useState(title || "New Chat");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue.trim() && editValue !== title) {
      await runtime.rename(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(title || "New Chat");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 text-sm"
      />
    );
  }

  return (
    <span className="aui-thread-list-item-title text-sm">
      <ThreadListItemPrimitive.Title fallback="New Chat" />
    </span>
  );
};

const ThreadListItemRename: FC<{ onEdit: () => void }> = ({ onEdit }) => {
  return (
    <TooltipIconButton
      onClick={(e) => {
        e.stopPropagation();
        onEdit();
      }}
      className="aui-thread-list-item-rename size-4 p-0 text-foreground hover:text-primary"
      variant="ghost"
      tooltip="Rename chat"
    >
      <PencilIcon />
    </TooltipIconButton>
  );
};

const ThreadListItemDelete: FC = () => {
  return (
    <ThreadListItemPrimitive.Delete asChild>
      <TooltipIconButton
        className="aui-thread-list-item-delete mr-3 ml-auto size-4 p-0 text-foreground hover:text-destructive"
        variant="ghost"
        tooltip="Delete chat"
      >
        <Trash2Icon />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Delete>
  );
};
