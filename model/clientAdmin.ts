import mongoose, { Document, Schema, model, models } from 'mongoose';

// Interface for Client Admin
export interface ClientAdminType extends Document {
  type: 'Admin' | 'Banking Manager';
  name: string;
  userName: string; // userName field here
  password: string;
  clientId: string;
  phoneNumber?: string; // Use phoneNumber instead of mobile
}

// Client Admin Schema
const ClientAdminSchema: Schema<ClientAdminType> = new Schema<ClientAdminType>({
  type: {
    type: String,
    enum: ['Admin', 'Banking Manager'],
    required: true,
  },
  name: { type: String, required: true },
  userName: { type: String, required: true }, // Keep userName here
  password: { type: String, required: true },
  clientId: { type: String, required: true },
  phoneNumber: { type: String }, // Use phoneNumber field
}, {
  // Options for auto-generating the id
  toObject: { getters: true },
  toJSON: { getters: true },
});

// Register the model with automatic id generation
const ClientAdminModel =
  models.ClientAdminModel || model<ClientAdminType>('ClientAdminModel', ClientAdminSchema);

export default ClientAdminModel;
