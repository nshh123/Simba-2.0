'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '@clerk/nextjs';
import { useStore } from '@/store/useStore';
import { Bell, CheckCheck, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded } = useUser();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-[#121212] flex justify-center">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const safeNotifications = (notifications || []).filter(n => !n.userId || n.userId === user?.id);
  const unreadCount = safeNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-[#121212]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t('backToHome', { defaultValue: 'Back to Home' })}
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {t('notifications', { defaultValue: 'Notifications' })}
              </h1>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {unreadCount > 0 
                ? t('unreadCount', { defaultValue: `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`, count: unreadCount })
                : t('allCaughtUp', { defaultValue: "You're all caught up!" })
              }
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Button 
              onClick={() => markAllNotificationsAsRead()}
              variant="outline"
              className="bg-white dark:bg-black border-primary/20 text-primary hover:bg-primary/5 transition-colors self-start md:self-auto shadow-sm"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              {t('markAllAsRead', { defaultValue: 'Mark all as read' })}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
            {safeNotifications.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20"
              >
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('noNotificationsTitle', { defaultValue: 'No notifications yet' })}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {t('noNotificationsDesc', { defaultValue: "When you have updates about your orders or account, they'll appear right here." })}
                </p>
                <Link href="/products" className="mt-6">
                  <Button variant="default" className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">
                    {t('startShopping', { defaultValue: 'Start Shopping' })}
                  </Button>
                </Link>
              </div>
            ) : (
              safeNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative overflow-hidden rounded-xl border p-5 transition-all shadow-sm hover:shadow-md ${
                    !notification.read 
                      ? 'bg-white dark:bg-[#1a1a1a] border-primary/30 ring-1 ring-primary/10' 
                      : 'bg-gray-50 dark:bg-black/40 border-gray-200 dark:border-white/5'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    {/* Status Indicator / Icon */}
                    <div className="shrink-0 mt-1">
                      <div className={`h-2.5 w-2.5 rounded-full ${!notification.read ? 'bg-primary animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-base leading-snug ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        {new Date(notification.date).toLocaleString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                      >
                        {t('markRead', { defaultValue: 'Mark read' })}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
}
