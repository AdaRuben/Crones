import z from "zod";

export const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
});

export const authResponseSchema = z.object({
   accessToken: z.string(),
   admin : userSchema.omit ({ password: true, }),
});

export const usernewSchema = userSchema.omit({ id: true});
export const loginSchema = userSchema.omit({ id: true, name: true});
