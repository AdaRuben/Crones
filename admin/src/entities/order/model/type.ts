import type z from "zod";
import type { editOrderSchema, ordernewSchema, orderSchema } from "../model/schema";


export type Order = z.infer<typeof orderSchema>;

export type newOrder = z.infer<typeof ordernewSchema>;

export type EditOrder = z.infer<typeof editOrderSchema>;