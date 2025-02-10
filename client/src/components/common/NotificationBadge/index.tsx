import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { useWebSocket } from '@/contexts/WebSocketContext';
import useTranslation from '@/hooks/useTranslation';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  icon?: string;
}

export const NotificationBadge: React.FC = () => {
  const { t } = useTranslation();
  const { connected } = useWebSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial notifications
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
      updateUnreadCount(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error instanceof Error ? error.message : 'Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUnreadCount = (notifs: Notification[]) => {
    setUnreadCount(notifs.filter((n) => !n.read).length);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      updateUnreadCount(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'POST',
      });
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
        {connected && (
          <CircleIcon
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              fontSize: 12,
              color: 'success.main',
            }}
          />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {t('notifications.title')}
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead}>
              {t('notifications.markAllAsRead')}
            </Button>
          )}
        </Box>
        <Divider />

        <List sx={{ p: 0 }}>
          {loading ? (
            <ListItem>
              <ListItemText primary={t('messages.loading')} />
            </ListItem>
          ) : error ? (
            <ListItem>
              <ListItemText primary={error} />
            </ListItem>
          ) : notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary={t('notifications.empty')} />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? 'inherit' : 'action.hover',
                }}
                onClick={() => handleMarkAsRead(notification.id)}
                button
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${notification.type}.light` }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.message}
                  secondary={formatDistanceToNow(new Date(notification.timestamp), {
                    addSuffix: true,
                    locale: ar,
                  })}
                />
              </ListItem>
            ))
          )}
        </List>

        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button
                size="small"
                onClick={() => {
                  handleClose();
                  // Navigate to notifications page
                }}
              >
                {t('notifications.viewAll')}
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBadge;
