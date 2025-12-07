import { z } from "zod";

// Shared Zod validation schema for both client and server
export const  contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200, "Subject is too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
  honey: z.string().max(0, "Invalid form submission"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type FormResult = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  } | null;
};
