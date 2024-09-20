import mongoose, { Document, Schema } from 'mongoose';
import { UpiDetailsType } from '@/schemas/UpiDetailsSchema';



interface upiSchemaType extends Document, UpiDetailsType {}

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
});


// Create the model
const UpiModel = mongoose.models.UpiModel || mongoose.model<upiSchemaType>('UpiModel', UpiSchema);

export default UpiModel;