import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Mock data storage
const STORAGE_KEY = 'notifications';

interface Notification {
  id: string;
  userId: string;
  type: 'review' | 'like' | 'comment' | 'system';
  message: string;
  read: boolean;
  createdAt: string;
}

const getStoredNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setStoredNotifications = (notifications: Notification[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotifications = async (userId: string) => {
  try {
    const notifications = getStoredNotifications();
    return notifications.filter(n => n.userId === userId);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notifications = getStoredNotifications();
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setStoredNotifications(updatedNotifications);
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
  try {
    const notifications = getStoredNotifications();
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setStoredNotifications([...notifications, newNotification]);
    return newNotification;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

export const fetchUserData = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export default {
  fetchNotifications,
  markNotificationAsRead,
  addNotification,
  fetchUserData,
};
