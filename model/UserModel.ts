import mongoose, { Schema, Document } from 'mongoose';

// Define the PaymentType enum
enum PaymentType {
  Bank = 'Bank Transfer',
  UPI = 'UPI',
}

// Define the Status enum
enum Status {
  Pending = 'pending',
  Rejected = 'rejected',
  Approved = 'approved',
}

// Define the interface for the UserModel
export interface IUser extends Document {
  bankName?: string;
  beneficiaryName?: string;
  accountNo?: string;
  IFSCcode?: string;
  paymentType?: PaymentType;
  qrCode?: string;
  upiId?: string;
  transactionNumber: string;
  randomTransactionNumber: string;
  amount: number;
  status: Status;
}

// Define the schema for the UserModel
const UserSchema: Schema = new Schema({
  bankName: { type: String, required: false },
  beneficiaryName: { type: String, required: false },
  accountNo: { type: String, required: false },
  IFSCcode: { type: String, required: false },
  paymentType: { type: String, enum: Object.values(PaymentType), required: true },
  screenshot: { type: String, required: false },
  upiId: { type: String, required: false },
  transactionNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  randomTransactionNumber: { type: String, required: true },
  status: { type: String, enum: Object.values(Status), required: true, default: Status.Pending },
});

// Export the model
const UserModel = mongoose.models.UserModel || mongoose.model<IUser>('UserModel', UserSchema);

export default UserModel ;
