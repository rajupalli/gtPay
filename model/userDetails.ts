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
}, { timestamps: true });

// Hash the password before saving the user document
UserSchema.pre('save', async function (next) {
  const user = this as IUser;

  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Add a method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

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
