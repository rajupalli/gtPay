import { z } from 'zod';

// Define the Zod schema for User type
const userSchema = z.object({
  name: z.string().nonempty("Name is required"),
  companyName: z.string().nonempty("Company name is required"),
  userName: z.string().nonempty("Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  alternateNumber: z.string().optional(),  // Optional field
  type: z.enum(['Super Admin', 'Client', 'Admin', 'Banking Manager'], {
    errorMap: () => ({ message: "Invalid user type" }),
  }),
  clientId: z.string().optional().nullable(), // Optional in Zod validation
});

// Infer TypeScript type from schema
export type UserType = z.infer<typeof userSchema>;

// Export the Zod schema
export { userSchema };
