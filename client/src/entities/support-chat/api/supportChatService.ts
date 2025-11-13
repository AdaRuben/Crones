import axiosInstance from '@/shared/axiosInstance';
import { supportChatSchema, supportMessagesSchema } from '../types/schema';
import type { SupportChat, SupportMessages } from '../types/types';

export const supportChatService = {
  async getCustomerChat(customerId: number): Promise<SupportChat | null> {
    const response = await axiosInstance.get(`/support/chat/customer/${String(customerId)}`);
    if (!response.data) return null;
    return supportChatSchema.parse(response.data);
  },

  async getChatMessages(chatId: number): Promise<SupportMessages> {
    const response = await axiosInstance.get(`/support/chat/${String(chatId)}/messages`);
    return supportMessagesSchema.parse(response.data);
  },
};

export default supportChatService;
