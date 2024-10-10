import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for PaymentHistory
export interface IPaymentHistory extends Document {
  userName: string;
  mobile: string;
  utrNo: string;
  beneficiaryName: string;
  paymentType: 'Bank Transfer' | 'UPI';
  dateTime: Date;
  amount: number;
  screenshot: string;
  status: 'Pending' | 'Rejected' | 'Approved';
  transactionId: string;
  IDbankorUPI: string;
  clientId: string;       // New field
  clientName: string;     // New field
}

// Define the Mongoose schema for the PaymentHistory
const PaymentHistorySchema: Schema<IPaymentHistory> = new Schema<IPaymentHistory>({
  userName: { type: String, required: true },
  mobile: { type: String, required: true },
  utrNo: { type: String, required: true },
  beneficiaryName: { type: String, required: true },
  paymentType: { type: String, enum: ['Bank Transfer', 'UPI'], required: true },
  dateTime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  screenshot: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Rejected', 'Approved'], default: 'Pending' },
  transactionId: { type: String, default: '' },
  IDbankorUPI: { type: String, required: true },
  clientId: { type: String, required: true },   // New field
  clientName: { type: String, required: true }, // New field
}, { versionKey: false });

PaymentHistorySchema.set('toObject', { virtuals: true });
PaymentHistorySchema.set('toJSON', { virtuals: true });

const PaymentHistoryModel = mongoose.models.PaymentHistory || mongoose.model<IPaymentHistory>('PaymentHistory', PaymentHistorySchema);

export default PaymentHistoryModel;
