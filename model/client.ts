import mongoose, { Document, Schema } from 'mongoose';
import { IPaymentHistory } from './paymentHistory'; 
import { UpiSchema, upiSchemaType } from './UpiDetails';
import { BankSchema, bankSchemaType } from './BankDetails';

// Define the TypeScript interface for Client
export interface IClient extends Document {
  clientId: string;
  Messages: string[];
  PaymentHistory: IPaymentHistory[];  // Array of payment history objects
  Users: string[];
  BankModels: bankSchemaType[];
  UPIModels: upiSchemaType[];  // Array of embedded UPI models
}

// Define the Mongoose schema for the Client
const ClientSchema: Schema<IClient> = new Schema<IClient>({
  clientId: { type: String, required: true },
  Messages: { type: [String], default: [] },
  PaymentHistory: { type: [Object], default: [] },  // Array of plain objects for payment history
  Users: { type: [String], default: [] },
  BankModels: { type: [BankSchema], default: [] }, 
  UPIModels: { type: [UpiSchema], default: [] },  // Embed the UPI model directly
}, { versionKey: false });

// Check if the model already exists before compiling
const ClientModel = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default ClientModel;
