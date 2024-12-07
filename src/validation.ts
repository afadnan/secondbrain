import {z} from "zod";

export const userZodSchema = z.object({
    email:z.string().email("Invalid email formate").trim(),
    password:z.string()
    .min(7,"atlest more than 7 character")
    .max(30,"not excessed 30 character")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/,"one uppercase,one lowercase,one number,one special character is required")
})