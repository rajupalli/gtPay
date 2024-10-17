import mongoose, { Document, Schema, model, models } from 'mongoose';

// Interface for Client Admin
export interface ClientAdminType extends Document {
  id: string; // Custom id field
  type: 'Admin' | 'Banking Manager';
  name: string;
  userName: string; // userName field here
  password: string;
  clientId: string;
  mobile?: string;
}

// Client Admin Schema
const ClientAdminSchema: Schema<ClientAdminType> = new Schema<ClientAdminType>({
  id: { type: String, required: true, unique: true }, // Custom id field
  type: {
    type: String,
    enum: ['Admin', 'Banking Manager'],
    required: true,
  },
  name: { type: String, required: true },
  userName: { type: String, required: true }, // Keep userName here
  password: { type: String, required: true },
  clientId: { type: String, required: true },
  mobile: { type: String },
});

// Register the model
const ClientAdminModel =
  models.ClientAdminModel || model<ClientAdminType>('ClientAdminModel', ClientAdminSchema);

export default ClientAdminModel;
