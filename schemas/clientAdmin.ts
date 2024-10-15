import { z } from 'zod';

// Zod schema for Client Admin validation
const clientAdminSchema = z.object({
  type: z.enum(['Admin', 'Banking Manager'], {
    required_error: 'Type is required',
  }),
  name: z.string().nonempty('Name is required'),
  userName: z.string().nonempty('userName is required'), // Use userName here
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
  clientId: z.string().nonempty('Client ID is required'),
  mobile: z.string().optional(),
});

export type ClientAdminSchemaType = z.infer<typeof clientAdminSchema>;
export { clientAdminSchema };
