import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useNotification } from '@/hooks/useNotification';
import useTranslation from '@/hooks/useTranslation';

interface WebSocketContextType {
  sendMessage: (type: string, payload: any) => void;
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => {},
  connected: false,
});

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = () => {
    if (!session?.user) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setConnected(true);
      // Send authentication message
      if (ws.current && session.user) {
        ws.current.send(
          JSON.stringify({
            type: 'auth',
            payload: {
              token: session.accessToken,
            },
          })
        );
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
      // Attempt to reconnect after 5 seconds
      reconnectTimeout.current = setTimeout(connect, 5000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'notification':
        showNotification(data.payload.type, data.payload.message);
        break;
      
      case 'user_status_change':
        // Handle user status changes (online/offline)
        break;
      
      case 'new_message':
        // Handle new messages
        showNotification('info', t('notifications.newMessage', {
          sender: data.payload.sender
        }));
        break;
      
      case 'system_alert':
        // Handle system alerts
        showNotification('warning', data.payload.message);
        break;
      
      default:
        console.warn('Unknown WebSocket message type:', data.type);
    }
  };

  const sendMessage = (type: string, payload: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  useEffect(() => {
    if (session?.user) {
      connect();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [session]);

  return (
    <WebSocketContext.Provider value={{ sendMessage, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
