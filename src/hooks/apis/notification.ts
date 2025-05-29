import { QueryKey } from "@/models/QueryKey"
import { deleteAllNotifications, deleteOneNotification, getNotificationsUser, markAllNotificationsAsRead, markNotificationAsRead } from "@/services/apis/notification"
import { BaseResponse } from "@/types/base-response"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useFetchGetNotificationsUser = () => {
  return useQuery({ queryKey: [QueryKey.GET_NOTIFICATIONS_USER], queryFn: getNotificationsUser })
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_NOTIFICATIONS_USER] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_NOTIFICATIONS_USER] });
    },
  });
};

export const useDeleteAllNotifications = (options?: {
  onSuccess: (baseResponse: BaseResponse<void>) => void;
  onError: (error: BaseResponse<void>) => void;
}) => {
  return useMutation({
    mutationFn: deleteAllNotifications,
    ...options,
  });
};

export const useDeleteOneNotification = (options?: {
  onSuccess: (baseResponse: BaseResponse<void>) => void;
  onError: (error: BaseResponse<void>) => void;
}) => {
  return useMutation({
    mutationFn: deleteOneNotification,
    ...options,
  });
};
