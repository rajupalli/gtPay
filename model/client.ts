import mongoose, { Document, Schema, model, models } from 'mongoose';
import { IPaymentHistory } from './paymentHistory'; // Adjust path if needed
import { UpiSchema, upiSchemaType } from './UpiDetails'; // Adjust path if needed
import { BankSchema, bankSchemaType } from './BankDetails'; // Adjust path if needed
import {  ClientAdminType } from './clientAdmin'; // Properly import ClientAdmin

// Interface for Client
export interface IClient extends Document {
  clientId: string;
  Messages: string[];
  PaymentHistory: IPaymentHistory[];
  ClientAdmin: ClientAdminType[];
  BankModels: bankSchemaType[];
  UPIModels: upiSchemaType[];
}

// Client Schema
const ClientSchema: Schema<IClient> = new Schema<IClient>(
  {
    clientId: { type: String, required: true },
    Messages: { type: [String], default: [] },
    PaymentHistory: { type: [Object], default: [] },
    
    ClientAdmin: { type: [Object], default: [] },
    BankModels: { type: [BankSchema], default: [] },
    UPIModels: { type: [UpiSchema], default: [] },
  },
  { versionKey: false }
);

// Register the model or use the existing one
const ClientModel = models.Client || model<IClient>('Client', ClientSchema);

export default ClientModel;
