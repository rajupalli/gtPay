// This Zod schema is used in the `route.ts` file to validate the data before saving it to the database.
import { z } from 'zod';

export const bankSchema = z.object({
  upiId: z.string().nonempty(),
  upiIdConfirm: z.string().nonempty(),
  beneficiaryName: z.string().nonempty(),
  accountNo: z.string().nonempty(),
  accountNoConfirm: z.string().nonempty(),
  ifscCode: z.string().nonempty(),
  bankName: z.string().nonempty(),
  qrCode: z.string().optional(),
  dailyLimit: z.string().nonempty(),
  paymentType: z.enum(['QR/UPI Pay', 'Bank Transfer']),
});
