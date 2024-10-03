import mongoose, { Document, Schema } from 'mongoose';
import { UpiDetailsType } from '@/schemas/UpiDetailsSchema';

interface upiSchemaType extends Document, UpiDetailsType {
  id: string;  // Add 'id' to the interface to include virtual 'id' field
}

// Create the schema
const UpiSchema: Schema = new Schema<upiSchemaType>({
  beneficiaryName: { type: String, required: true },
  upiId: { type: String, required: true },
  qrCode: { type: String, required: true },
  dailyLimit: { type: String, required: true },
  activeDays: {
    type: [String],
    required: true,
  },
  activeMonths: {
    type: [String],
    required: true,
  },
  isActive: { type: Boolean, default: true },
  rangeFrom: { type: Number, default: 0 },
  rangeTo: { type: Number, default: 0 },
});

// Create a virtual 'id' field that maps to '_id'
UpiSchema.virtual('id').get(function (this: { _id: mongoose.Types.ObjectId }) {
  return this._id.toHexString();
});


// Ensure virtual fields are serialized
UpiSchema.set('toJSON', { virtuals: true });

// Create the model
const UpiModel = mongoose.models.UpiModel || mongoose.model<upiSchemaType>('UpiModel', UpiSchema);

export default UpiModel;
