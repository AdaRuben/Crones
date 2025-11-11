import type z from 'zod';

import type { orderSchema, newOrderSchema } from './schema';

export type Order = z.infer<typeof orderSchema>;
export type NewOrder = z.infer<typeof newOrderSchema>;
