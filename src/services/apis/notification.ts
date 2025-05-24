import API from "@/services/axios"
import Endpoint from "@/services/endpoint"
import { BaseResponse } from "@/types/base-response"
import { Notification } from "@/types/notification.type"


export const getNotificationsUser = async (): Promise<BaseResponse<Notification[]>> => {
  const response = await API.get(Endpoint().notification.getNotificationsUser)
  return response.data
}

export const markNotificationAsRead = async (notificationId: string): Promise<BaseResponse<Notification>> => {
  const response = await API.patch(Endpoint().notification.markAsRead(notificationId));
  return response.data;
}

export const markAllNotificationsAsRead = async (): Promise<BaseResponse<void>> => {
  const response = await API.patch(Endpoint().notification.markAllAsRead);
  return response.data;
}


