import { z } from 'zod';

// Zod schema for Client Admin validation
const clientAdminSchema = z.object({
  type: z.enum(['Admin', 'Banking Manager'], {
    required_error: 'Type is required',
  }),
  name: z.string().nonempty('Name is required'),
  userName: z.string().nonempty('Username is required'), // Use userName here
  password: z.string().min(6, 'Password must be at least 6 characters'),
  clientId: z.string().nonempty('Client ID is required'),
  phoneNumber: z.string()
    .optional()
    .refine((val) => {
      // If phoneNumber is provided, check that it matches a specific pattern (e.g., 10-digit)
      return val === undefined || /^[0-9]{10}$/.test(val);
    }, {
      message: 'Phone number must be a valid 10-digit number',
    }),
});

export type ClientAdminSchemaType = z.infer<typeof clientAdminSchema>;
export { clientAdminSchema };
