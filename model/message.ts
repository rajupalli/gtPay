import mongoose, { Document, Schema } from 'mongoose';

// Define the TypeScript interface for the Message
export interface IMessage extends Document {
  amount: number;
  referenceId: string;
  bankName?: string;
  last4DigitBank?: string;
  datetime: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  fullMessage?: string;
}

// Define the Mongoose schema for the Message
const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
  amount: { type: Number, required: true },
  referenceId: { type: String, required: true },
  bankName: { type: String, required: false },
  last4DigitBank: { type: String, required: false, length: 4 },
  datetime: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending',required:false },
  fullMessage: { type: String, required: false },
});

// Specify the collection name explicitly as 'messages'
const MessageModel = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema, 'messages');

export default MessageModel;
