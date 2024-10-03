import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for User
export interface IUser extends Document {
  id: string;  // Add 'id' as a virtual field
  name: string;
  companyName: string;
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  alternateNumber?: string;
  type: 'Super Admin' | 'Client' | 'Admin' | 'Banking Manager';
}

// Define the Mongoose schema for the User
const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  alternateNumber: { type: String },  // Optional field
  type: {
    type: String,
    enum: ['Super Admin', 'Client', 'Admin', 'Banking Manager'],  // Enums for allowed types
    required: true,
  },
}, { timestamps: true });

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
