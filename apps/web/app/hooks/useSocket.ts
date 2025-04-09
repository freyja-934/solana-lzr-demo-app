import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

type CustomSocket = Socket & {
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback: (data: any) => void) => void;
  disconnect: () => void;
};

export const useSocket = (
  event: string,
  handler: (data: any) => void,
  showNotification: boolean = true,
) => {
  const socketRef = useRef<CustomSocket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL) as CustomSocket;

    const socket = socketRef.current;
    if (socket) {
      socket.on('connect', () => {
        console.log('🧠 Connected to WebSocket server');
      });

      socket.on(event, (data: any) => {
        // Convert timestamp from seconds to milliseconds if it exists
        if (data.timestamp) {
          data.timestamp = data.timestamp * 1000;
        }

        console.log('🧠 Received event:', data);
        handler(data);

        if (showNotification) {
          toast.success(`New ${event} event received`, {
            duration: 3000,
            position: 'top-right',
          });
        }
      });

      return () => {
        socket.off(event, handler);
        socket.disconnect();
      };
    }
  }, [event, handler, showNotification]);

  return socketRef;
};
