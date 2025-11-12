import { z } from 'zod';

export const supportAdminSchema = z
  .object({
    id: z.number(),
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const supportChatSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  adminId: z.number().nullable(),
  status: z.enum(['open', 'closed']),
  createdAt: z.string(),
  updatedAt: z.string(),
  admin: supportAdminSchema,
});

export const supportMessageSchema = z.object({
  id: z.number(),
  chatId: z.number(),
  body: z.string().nullable(),
  attachments: z.unknown().nullable(),
  senderId: z.number().nullable(),
  senderRole: z.enum(['customer', 'admin']),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const supportMessagesSchema = supportMessageSchema.array();

export const supportJoinResponseSchema = z.object({
  chat: supportChatSchema,
  chatId: z.number(),
  userId: z.number().nullable(),
  role: z.string(),
  members: z.array(z.string()),
  messages: supportMessagesSchema,
});

