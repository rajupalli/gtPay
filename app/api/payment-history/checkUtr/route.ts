import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import PaymentHistoryModel from '@/model/paymentHistory';

// Handle GET requests to check if a UTR number exists
export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Extract the UTR number from the query parameters
    const { searchParams } = new URL(request.url);
    const utrNo = searchParams.get('utrNo');

    if (!utrNo) {
      return NextResponse.json({ message: 'UTR number is required' }, { status: 400 });
    }

    // Check if the UTR number already exists
    const existingPayment = await PaymentHistoryModel.findOne({ utrNo });

    return NextResponse.json({ exists: !!existingPayment }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error checking UTR', error: error.message }, { status: 500 });
  }
}
