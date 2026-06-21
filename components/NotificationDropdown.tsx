'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck } from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

export function NotificationDropdown() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const safeNotifications = (notifications || []).filter(n => !n.userId || n.userId === user?.id);
  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex items-center justify-center rounded-lg border border-white/30 p-2 hover:bg-white/20 transition-colors text-white"
        aria-label="Open notifications"
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -right-2.5 -top-2.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-red-500 text-white ring-2 ring-[#FF8800] text-[10px] font-black shadow-md shadow-black/20">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>{t('notifications', { defaultValue: 'Notifications' })}</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto py-1 px-2 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                markAllNotificationsAsRead();
              }}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              {t('markAllAsRead', { defaultValue: 'Mark all as read' })}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {safeNotifications.length === 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              {t('noNotifications', { defaultValue: 'No new notifications' })}
            </div>
          ) : (
            safeNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault(); // Keep dropdown open to let user read
                  if (!notification.read) markNotificationAsRead(notification.id);
                }}
              >
                <div className="flex justify-between w-full items-start gap-2">
                  <span className={`text-sm ${!notification.read ? 'font-semibold' : 'text-muted-foreground'}`}>
                    {notification.message}
                  </span>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.date).toLocaleString()}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
