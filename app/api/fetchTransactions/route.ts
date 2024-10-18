import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import mongoose from 'mongoose';

// GET API for fetching transaction by transactionId and clientId
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    const clientId = searchParams.get('clientId');

    // Validate that both transactionId and clientId are provided
    if (!transactionId || !clientId) {
      return NextResponse.json(
        { message: 'transactionId and clientId are required' },
        { status: 400 }
      );
    }

    // Access the "clients" collection dynamically
    const clientCollection = mongoose.connection.collection('clients');

    // Search for the transaction in the PaymentHistory array based on clientId and transactionId
    const existingPayment = await clientCollection.findOne({
      clientId: clientId,
      'PaymentHistory.transactionId': transactionId,
    });

    // Check if the transaction exists
    if (!existingPayment) {
      return NextResponse.json(
        { message: 'Transaction not found', data: [] },
        { status: 404 }
      );
    }

    // Find the specific transaction details within the PaymentHistory array
    const transactionDetails = existingPayment.PaymentHistory.find(
      (payment: any) => payment.transactionId === transactionId
    );

    // Return the transaction details if found
    return NextResponse.json({
      message: 'Transaction found',
      data: transactionDetails,
      status: 200,
    });

  } catch (error: any) {
    console.error('Error occurred while fetching transaction:', error.message);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
