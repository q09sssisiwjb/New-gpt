"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="border-t p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          title="Sign out"
          className="h-8 w-8 flex-shrink-0"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
