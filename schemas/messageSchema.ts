import { z } from 'zod';

// Define status enum
const Status = z.enum(['Pending', 'Approved', 'Rejected']);

// Define the Zod schema for Message validation
const messageSchema = z.object({
  amount: z.string().nonempty("Amount is required"), // Updated to string
  referenceId: z.string().nonempty("Reference ID is required"), // Reference ID should not be empty

  // Optional fields
  bankName: z.string().optional(), // Make bankName optional
  last4DigitBank: z.string().length(4, "Last 4 digits of bank account must be 4 characters long").optional(), // Optional field
  datetime: z.date().default(() => new Date()), // Automatically defaults to the current date if not provided
  status: Status.default('Pending'), // Enum for status, default is 'Pending'
  fullMessage: z.string().optional(), // Make fullMessage optional
});

// Infer the TypeScript type from the schema
export type MessageType = z.infer<typeof messageSchema>;

// Export the schema and status enum
export { messageSchema, Status };
