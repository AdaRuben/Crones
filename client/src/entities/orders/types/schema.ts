import z from 'zod';

export const orderSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  driverId: z.number().nullable(),
  from: z.string(),
  to: z.string(),
  totalCost: z.number().nullable(),
  status: z.enum(['new', 'in process', 'finished', 'cancelled']),
  isPaid: z.boolean().nullable(),
  vehicle: z.enum(['Кроссовер', 'Седан']),
  customerComment: z.string().optional(),
  adminComment: z.string().optional(),
  finishedAt: z.date().optional(),
});

export const newOrderSchema = orderSchema.omit({ id: true, customerId: true });
