import mongoose, { Document, Schema } from 'mongoose';
import { BankDetailsType } from '@/schemas/BankDetailsSchema';

interface bankSchemaType extends Document, BankDetailsType {
  id: string;  // Add 'id' to the interface to include virtual 'id' field
}

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
  rangeFrom: { type: Number, default: 0 },
  rangeTo: { type: Number, default: 0 },
});

// Create a virtual 'id' field that maps to '_id'
BankSchema.virtual('id').get(function (this: { _id: mongoose.Types.ObjectId }) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
BankSchema.set('toJSON', { virtuals: true });

// Create the model
const BankModel = mongoose.models.BankModel || mongoose.model<bankSchemaType>('BankModel', BankSchema);

export default BankModel;
