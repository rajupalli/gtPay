import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import UserModel from '@/model/userDetails'; // Model for 'users' collection
import ClientModel from '@/model/client'; // Model for 'clients' collection

// POST API for generating a URL based on user and client information
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse the request body
    const body = await request.json();

    const clientId = body.clientId;
    const mobileNumber = body.mobileNumber;
    const amount = body.amount;
    const userId = body.userId;

    // Validate required fields: clientId and amount
    if (!clientId || !amount) {
      return NextResponse.json(
        { message: 'clientId and amount are required' },
        { status: 400 }
      );
    }

    // Ensure at least one of mobileNumber or userId is provided
    if (!mobileNumber && !userId) {
      return NextResponse.json(
        { message: 'Either mobileNumber or userId is required' },
        { status: 400 }
      );
    }

    // Check if the client exists in the Client model
    const client = await ClientModel.findOne({ clientId });
    if (!client) {
      return NextResponse.json(
        { message: 'Client not found' },
        { status: 404 }
      );
    }
 
    // If the user is found, generate a URL and transactionId
    let identifier = mobileNumber || userId; // Either mobileNumber or userId
    const generatedUrl = `https://main.dt8kei21ehntg.amplifyapp.com/${clientId}/${identifier}/${amount}`;
    const transactionId = Math.random().toString(36).substr(2, 9); // Example transactionId generation

    // Respond with the generated URL and transactionId
    return NextResponse.json({
      message: 'URL Generated',
      data: {
        url: generatedUrl,
        transactionId: transactionId,
      },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error occurred while generating URL:', error.message);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
