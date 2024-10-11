import mongoose, { Document, Schema } from 'mongoose';
import { IPaymentHistory } from './paymentHistory';  // Ensure correct schema import
import { UpiSchema, upiSchemaType } from './UpiDetails';  // Ensure correct schema import
import { BankSchema, bankSchemaType } from './BankDetails';  // Ensure correct schema import
import UserModel, { IUser } from './userDetails';  // Import UserModel for reference

// Define the TypeScript interface for Client
export interface IClient extends Document {
  clientId: string;
  Messages: string[];
  PaymentHistory: IPaymentHistory[];  // Array of payment history objects
  Users: IUser[];  // Array of User model objects
  BankModels: bankSchemaType[];  // Array of embedded bank models
  UPIModels: upiSchemaType[];  // Array of embedded UPI models
}

// Define the Mongoose schema for the Client
const ClientSchema: Schema<IClient> = new Schema<IClient>({
  clientId: { type: String, required: true },
  Messages: { type: [String], default: [] },  // Array of message strings
  PaymentHistory: { type: [Object], default: [] },  // Array of plain objects for payment history
  Users: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],  // Array of references to the User model
  BankModels: { type: [BankSchema], default: [] },  // Embed bank models
  UPIModels: { type: [UpiSchema], default: [] },  // Embed UPI models
}, { versionKey: false });

// Pre-save hook to ensure Users are properly referenced
ClientSchema.pre('save', async function (next) {
  const client = this as IClient;
  
  // Ensure Users array has valid references to User models
  if (client.Users && client.Users.length > 0) {
    for (const userId of client.Users) {
      const user = await UserModel.findById(userId);
      if (!user) {
        return next(new Error(`User with ID ${userId} not found`));
      }
    }
  }

  next();
});

// Check if the model already exists before compiling
const ClientModel = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);

export default ClientModel;
