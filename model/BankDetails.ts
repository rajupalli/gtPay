import mongoose from 'mongoose';

const BankDetailsSchema = new mongoose.Schema({
  upiId: { type: String, required: true },
  upiIdConfirm: { type: String, required: true },
  beneficiaryName: { type: String, required: true },
  accountNo: { type: String, required: true },
  accountNoConfirm: { type: String, required: true },
  ifscCode: { type: String, required: true },
  bankName: { type: String, required: true },
  qrCode: { type: String, default: '' },
  dailyLimit: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  paymentType: { type: String, enum: ['QR/UPI Pay', 'Bank Transfer'], required: true }
});

export default mongoose.models.BankDetails || mongoose.model('BankDetails', BankDetailsSchema);
