import mongoose, { Document, Schema, model, models } from 'mongoose';

// Interface for Client Admin
export interface ClientAdminType extends Document {
  type: 'Admin' | 'Banking Manager';
  name: string;
  userName: string; // userName field here
  password: string;
  confirmPassword?: string;
  clientId: string;
  mobile?: string;
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
  confirmPassword: { type: String, required: false },
  clientId: { type: String, required: true },
  mobile: { type: String,},
});



// Virtual field for 'id'
ClientAdminSchema.virtual('id').get(function (this: { _id: mongoose.Types.ObjectId }) {
  return this._id.toHexString();
});

// Register the model
const ClientAdminModel =
  models.ClientAdminModel || model<ClientAdminType>('ClientAdminModel', ClientAdminSchema);

export default ClientAdminModel;
