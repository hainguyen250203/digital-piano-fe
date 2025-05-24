export enum NotificationType {
  ORDER = "order",
  PROMOTION = "promotion",
  REVIEW = "review",
  SYSTEM = "system",
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}