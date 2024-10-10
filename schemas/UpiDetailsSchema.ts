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
  // Add new fields for rangeFrom and rangeTo with automatic conversion from string to number
  rangeFrom: z.union([z.string(), z.number()]).transform((val) => Number(val)).default(0),
  rangeTo: z.union([z.string(), z.number()]).transform((val) => Number(val)).default(0),
  clientName: z.string().default(''),  // New field added here
});

export type UpiDetailsType = z.infer<typeof upiSchema>;

// Export Zod schema
export { upiSchema };
