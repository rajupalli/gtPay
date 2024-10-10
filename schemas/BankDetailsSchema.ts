import { z } from 'zod';

// Define Zod schema
const bankSchema = z.object({
  beneficiaryName: z.string().nonempty("Beneficiary name is required"),
  accountNo: z.string().nonempty("Account number is required"), // Assuming account number as string
  IFSCcode: z.string().nonempty("IFSC code is required"), 
  bankName: z.string().nonempty("Bank name is required"),
  dailyLimit: z.string().nonempty("Daily limit must be a positive number"),
  activeDays: z.array(z.string()),
  activeMonths: z.array(z.string()),
  isActive: z.boolean().default(true),
  // Add new fields for rangeFrom and rangeTo with automatic conversion from string to number
  rangeFrom: z.union([z.string(), z.number()]).transform((val) => Number(val)).default(0),
  rangeTo: z.union([z.string(), z.number()]).transform((val) => Number(val)).default(0),
  clientName: z.string().default(''), // New field for client name
});

export type BankDetailsType = z.infer<typeof bankSchema>;

// Export Zod schema
export { bankSchema };
