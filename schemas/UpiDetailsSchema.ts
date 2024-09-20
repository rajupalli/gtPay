// This Zod schema is used in the `route.ts` file to validate the data before saving it to the database.
import { z } from 'zod';

// Define Zod schema
const upiSchema = z.object({
  beneficiaryName: z.string().nonempty("Beneficiary name is required"),
  upiId: z.string().nonempty("UPI ID is required"),
  qrCode: z.string().nonempty("QR Code is required"),
  dailyLimit: z.string().nonempty("Daily limit must be a positive number"),
  activeDays: z.array(z.string()),
  activeMonths: z.array(z.string()),
  isActive: z.boolean().default(true),
});

export type UpiDetailsType = z.infer<typeof upiSchema>;

// Export Zod schema
export { upiSchema };
