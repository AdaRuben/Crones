import z from "zod";

export const customerSchema = z.object({
    name: z.string(),
    phoneNumber: z.string(),
});

export const driverSchema = z.object({
    name: z.string(),
    phoneNumber: z.string(),
});

export const orderSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    driverId: z.number().nullable().optional(),
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
    Customer: customerSchema.nullable().optional(),
    Driver: driverSchema.nullable().optional(),
});


export const ordernewSchema = orderSchema.omit({id: true, Customer: true, Driver: true});

export const editOrderSchema = z.object({
    status: z.string(),
})