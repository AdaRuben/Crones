import z from "zod";

export const orderSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    from: z.string(),
    to: z.string(),
    totalCost: z.coerce.number().nullable(),
    status: z.string(),
    isPaid: z.boolean().nullable(),
    vehicle: z.string(),
    adminComment: z.string().nullable(),
    customerComment: z.string().nullable(),
    finishedAt: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
});

export const ordernewSchema = orderSchema.omit({id: true});

export const editOrderSchema = z.object({
    status: z.string(),
})