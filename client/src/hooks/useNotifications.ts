import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useWebSocket } from '@/contexts/WebSocketContext';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
}

interface NotificationOptions {
  page?: number;
  limit?: number;
  includeRead?: boolean;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: Error | null;
  pagination: PaginationData;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useNotifications = (options: NotificationOptions = {}): UseNotificationsReturn => {
  const { data: session } = useSession();
  const { connected } = useWebSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: options.page || 1,
    limit: options.limit || 10,
    total: 0,
    totalPages: 0,
  });

  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/notifications?page=${pagination.page}&limit=${
          pagination.limit
        }&includeRead=${options.includeRead ?? true}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications((prev) =>
        pagination.page === 1 ? data.notifications : [...prev, ...data.notifications]
      );
      setPagination(data.pagination);
      
      // Update unread count
      const unreadResponse = await fetch('/api/notifications/unread-count');
      if (unreadResponse.ok) {
        const { count } = await unreadResponse.json();
        setUnreadCount(count);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [session, pagination.page, pagination.limit, options.includeRead]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  };

  const loadMore = async () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const refresh = async () => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
    await fetchNotifications();
  };

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [session, fetchNotifications]);

  useEffect(() => {
    if (connected) {
      // WebSocket is connected, we can receive real-time updates
      refresh();
    }
  }, [connected]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    pagination,
    markAsRead,
    markAllAsRead,
    loadMore,
    refresh,
  };
};
