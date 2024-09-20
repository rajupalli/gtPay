import mongoose, { Document, Model, Schema } from 'mongoose';
import { BankDetailsType } from '@/schemas/BankDetailsSchema';
import {bankSchema} from '@/schemas/BankDetailsSchema';


interface bankSchemaType extends Document, BankDetailsType {}

// Create the schema
const BankSchema: Schema = new Schema<bankSchemaType>({
  beneficiaryName: { type: String, required: true },
  accountNo: { type: String, required: true }, // Assuming string type for bank account numbers
  IFSCcode: { type: String, required: true },
  bankName: { type: String, required: true },
  dailyLimit: { type: String, required: true },
  activeDays: {
    type: [String],
    required: true,
  },
  activeMonths: {
    type: [String],
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

// Create the model
const BankModel = mongoose.models.BankModel || mongoose.model<bankSchemaType>('BankModel', BankSchema);

export default BankModel;