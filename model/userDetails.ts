import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the TypeScript interface for User
export interface IUser extends Document {
  id: string;
  name: string;
  companyName: string;
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  alternateNumber?: string;
  type: 'Super Admin' | 'Client' | 'Admin' | 'Banking Manager';
  clientId?: string;  // Optional clientId field, only for 'Client' type
  appPassword: string; // New field
  domain:string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the Mongoose schema for the User
const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  alternateNumber: { type: String },
  type: {
    type: String,
    enum: ['Super Admin', 'Client', 'Admin', 'Banking Manager'],
    required: true,
  },
  clientId: { type: String, default: null },  // Client ID, null by default
  appPassword: { type: String, default: '' }, // New appPassword field with default value
}, { timestamps: true });

 
// Virtual field for 'id'
UserSchema.virtual('id').get(function (this: { _id: mongoose.Types.ObjectId }) {
  return this._id.toHexString();
});

// Ensure virtual fields are included in JSON responses
UserSchema.set('toJSON', {
  virtuals: true,
});

// Create and export the User model
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;




 