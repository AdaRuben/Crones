import z from 'zod';

export const driverSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
});

export const orderSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  driverId: z.number().nullable(),
  Driver: driverSchema.nullable().optional(),
  from: z.string(),
  to: z.string(),
  totalCost: z.coerce.number().nullable(),
  status: z.enum(['new', 'in process', 'finished', 'cancelled']),
  isPaid: z.boolean().nullable(),
  vehicle: z.enum(['Кроссовер', 'Седан']),
  customerComment: z.string().nullable().optional(),
  adminComment: z.string().nullable().optional(),
  finishedAt: z.coerce.date().nullable().optional(),
});

export const newOrderSchema = orderSchema.omit({ id: true, customerId: true, Driver: true });
