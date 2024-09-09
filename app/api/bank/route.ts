import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import BankDetails from '@/model/BankDetails';
import { bankSchema } from '@/schemas/BankDetailsSchema';

export async function GET() {
  try {
    await connectToDatabase();
    const bankDetails = await BankDetails.find();
    return NextResponse.json(bankDetails);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching bank details' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsedData = bankSchema.parse(data);

    if (parsedData.upiId !== parsedData.upiIdConfirm) {
      return NextResponse.json({ message: 'UPI IDs do not match' }, { status: 400 });
    }

    if (parsedData.accountNo !== parsedData.accountNoConfirm) {
      return NextResponse.json({ message: 'Account numbers do not match' }, { status: 400 });
    }

    if (!['QR/UPI Pay', 'Bank Transfer'].includes(parsedData.paymentType)) {
      return NextResponse.json({ message: 'Invalid payment type' }, { status: 400 });
    }

    await connectToDatabase();
    const bankDetail = new BankDetails({
      ...parsedData,
      isActive: true,
    });

    await bankDetail.save();

    return NextResponse.json({ message: 'Bank details saved successfully', data: bankDetail });
  } catch (error) {
    return NextResponse.json({ message: 'Error saving bank details' }, { status: 500 });
  }
}
