import type { z } from 'zod';
import {
  supportChatSchema,
  supportJoinResponseSchema,
  supportMessageSchema,
  supportMessagesSchema,
} from './schema';

export type SupportChat = z.infer<typeof supportChatSchema>;
export type SupportMessage = z.infer<typeof supportMessageSchema>;
export type SupportMessages = z.infer<typeof supportMessagesSchema>;
export type SupportJoinResponse = z.infer<typeof supportJoinResponseSchema>;

