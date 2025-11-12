import axiosInstance from '@/shared/axiosInstance';
import { supportChatListSchema, supportMessagesSchema } from '../types/schema';
import type { SupportChatList, SupportMessages } from '../types/types';

export const supportChatService = {
  async getAdminChats(adminId: number): Promise<SupportChatList> {
    const response = await axiosInstance.get(`/support/chat/admin/${String(adminId)}`);
    return supportChatListSchema.parse(response.data);
  },

  async getChatMessages(chatId: number): Promise<SupportMessages> {
    const response = await axiosInstance.get(`/support/chat/${String(chatId)}/messages`);
    return supportMessagesSchema.parse(response.data);
  },
};

export default supportChatService;
