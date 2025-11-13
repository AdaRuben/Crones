import type { z } from 'zod';
import {
  supportAdminSchema,
  supportChatListSchema,
  supportChatSchema,
  supportCustomerSchema,
  supportJoinResponseSchema,
  supportMessageSchema,
  supportMessagesSchema,
} from './schema';

export type SupportCustomer = z.infer<typeof supportCustomerSchema>;
export type SupportAdmin = z.infer<typeof supportAdminSchema>;
export type SupportChat = z.infer<typeof supportChatSchema>;
export type SupportMessage = z.infer<typeof supportMessageSchema>;
export type SupportMessages = z.infer<typeof supportMessagesSchema>;
export type SupportJoinResponse = z.infer<typeof supportJoinResponseSchema>;
export type SupportChatList = z.infer<typeof supportChatListSchema>;

