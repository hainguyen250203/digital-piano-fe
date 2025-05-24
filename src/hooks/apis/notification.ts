import { QueryKey } from "@/models/QueryKey"
import { getNotificationsUser, markAllNotificationsAsRead, markNotificationAsRead } from "@/services/apis/notification"
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
