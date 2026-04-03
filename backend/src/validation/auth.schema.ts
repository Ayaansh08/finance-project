import { z } from "zod";

export const authPayloadSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AuthPayloadInput = z.infer<typeof authPayloadSchema>;
