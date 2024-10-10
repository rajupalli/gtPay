import { z } from 'zod';

// Define PaymentType and Status enums
const PaymentType = z.enum(['Bank Transfer', 'UPI']);
const Status = z.enum(['Pending', 'Rejected', 'Approved']);

// Define the schema for PaymentHistory
const paymentHistorySchema = z.object({
  userName: z.string().nonempty("User name is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  utrNo: z.string().nonempty("UTR number is required"),
  beneficiaryName: z.string().nonempty("Beneficiary name is required"),
  paymentType: PaymentType,
  dateTime: z.date().default(() => new Date()),
  amount: z.number().positive("Amount must be a positive number"),
  screenshot: z.string().nonempty("Screenshot filename is required"),
  status: Status.default('Pending'),
  transactionId: z.string().optional().default(''),
  IDbankorUPI: z.string().nonempty("IDbankorUPI is required"),
  clientId: z.string().nonempty("Client ID is required"),  // New field
  clientName: z.string().nonempty("Client name is required"),  // New field
});

// Infer TypeScript type from schema
export type PaymentHistoryType = z.infer<typeof paymentHistorySchema>;

// Export the schema
export { paymentHistorySchema };
