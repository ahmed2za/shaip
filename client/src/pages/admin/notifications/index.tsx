import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AdminLayout from '@/components/layouts/AdminLayout';
import { NotificationsActive, Delete, Check } from '@mui/icons-material';
import { supabase } from '@/lib/supabase';

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export default function NotificationsPage() {
  const { t } = useTranslation('common');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('admin.notifications.title')}
        </Typography>
        <Paper sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsActive sx={{ fontSize: 48, color: 'text.secondary' }} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                {t('admin.notifications.noNotifications')}
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        {!notification.read && (
                          <IconButton
                            edge="end"
                            aria-label="mark as read"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check />
                          </IconButton>
                        )}
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <NotificationsActive color={notification.read ? 'disabled' : 'primary'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            {notification.message}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {new Date(notification.created_at).toLocaleString()}
                          </Typography>
                        </>
                      }
                      sx={{
                        '& .MuiTypography-root': {
                          color: notification.read ? 'text.secondary' : 'text.primary',
                        },
                      }}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </AdminLayout>
  );
}

export async function getStaticProps({ locale = 'ar' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
