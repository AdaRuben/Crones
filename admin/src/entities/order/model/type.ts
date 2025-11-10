import type z from "zod";
import type { ordernewSchema, orderSchema } from "../model/schema";


export type Order = z.infer<typeof orderSchema>;

export type newOrder = z.infer<typeof ordernewSchema>;