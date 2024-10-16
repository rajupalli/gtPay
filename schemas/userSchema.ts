import mongoose, { Document, Schema, model, models } from 'mongoose';

// Interface for Client Admin
export interface ClientAdminType extends Document {
  type: 'Admin' | 'Banking Manager';
  name: string;
  userName: string;
  password: string;
  confirmPassword?: string;
  clientId: mongoose.Types.ObjectId;
  mobile?: string;
}

// Client Admin Schema
const ClientAdminSchema = new Schema<ClientAdminType>({
  type: {
    type: String,
    enum: ['Admin', 'Banking Manager'],
    required: true,
  },
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  mobile: { type: String },
});

const ClientAdminModel = 
  models.ClientAdminModel || model<ClientAdminType>('ClientAdminModel', ClientAdminSchema);

// Interface for Client
export interface ClientType extends Document {
  name: string;
  companyName: string;
  clientAdmins: mongoose.Types.ObjectId[];
}

// Client Schema
const ClientSchema = new Schema<ClientType>({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  clientAdmins: [{ type: Schema.Types.ObjectId, ref: 'ClientAdminModel' }],
});

const ClientModel = 
  models.Client || model<ClientType>('Client', ClientSchema);

export { ClientModel, ClientAdminModel };
