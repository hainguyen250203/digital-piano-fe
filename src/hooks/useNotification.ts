import { QueryKey } from '@/models/QueryKey';
import { getNotificationsUser } from '@/services/apis/notification';
import { socketService } from '@/services/socket';
import { BaseResponse } from '@/types/base-response';
import { Notification } from '@/types/notification.type';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

export const useNotification = (token: string | null) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  const handleNewNotification = useCallback((notification: Notification) => {
    try {
      // Play a notification sound if available
      const notificationSound = new Audio('/sounds/notification.mp3');
      notificationSound.volume = 0.5;
      notificationSound.play().catch(() => { });
    } catch {
      // Silent fail if audio can't be played
    }

    // Update the notifications list in React Query cache
    queryClient.setQueryData<BaseResponse<Notification[]>>(
      [QueryKey.GET_NOTIFICATIONS_USER],
      (oldData) => {
        if (!oldData) {
          return { errorCode: 0, message: '', data: [notification] };
        }
        return {
          errorCode: oldData.errorCode,
          message: oldData.message,
          data: oldData.data ? [notification, ...oldData.data] : [notification],
        };
      }
    );

    // Immediately refetch to ensure data consistency
    getNotificationsUser().then((freshData) => {
      queryClient.setQueryData([QueryKey.GET_NOTIFICATIONS_USER], freshData);
    }).catch(() => {
      // Silent fail if refetch fails
    });
  }, [queryClient]);

  useEffect(() => {
    // If no token is available, disconnect and return
    if (!token) {
      socketService.disconnect();
      setIsConnected(false);
      return;
    }

    // Connect the socket
    const socket = socketService.connect(token);

    if (!socket) {
      setIsConnected(false);
      return;
    }

    // Listen for connection status
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Add notification listener
    socket.on('notification', handleNewNotification);

    // Set initial connection state
    setIsConnected(socket.connected);

    return () => {
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('notification', handleNewNotification);
      }
    };
  }, [token, handleNewNotification]);

  return { isConnected };
}; 