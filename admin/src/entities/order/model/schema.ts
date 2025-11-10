import z from "zod";

export const orderSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    from: z.string(),
    to: z.string(),
    totalCost: z.string(),
    status: z.string(),
    isPaid: z.boolean(),    
    vehicle: z.string(),
    adminComment: z.string().nullable(),
    customerComment: z.string().nullable(),
    finishedAt: z.string().nullable(),
    createdAt: z.string(),
});




export const ordernewSchema = orderSchema.omit({id: true});

