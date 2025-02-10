import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

let socket: Socket | null = null;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001', {
      auth: { userId },
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  return socket;
};

export const useSocket = () => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (session?.user?.id && !socketRef.current) {
      socketRef.current = initializeSocket(session.user.id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        socket = null;
      }
    };
  }, [session]);

  return socketRef.current;
};

export const emitEvent = (event: string, data: any) => {
  if (socket) {
    socket.emit(event, data);
  }
};

export const subscribeToEvent = (event: string, callback: (data: any) => void) => {
  if (socket) {
    socket.on(event, callback);
  }
};

export const unsubscribeFromEvent = (event: string, callback: (data: any) => void) => {
  if (socket) {
    socket.off(event, callback);
  }
};
