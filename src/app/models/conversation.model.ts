export interface Conversation {
  recipientId: string;
  username: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  profilePicture: string;
  unreadCount: number;
}