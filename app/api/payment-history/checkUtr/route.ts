// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/dbConnect';
// import PaymentHistoryModel from '@/model/paymentHistory';

// // Handle GET requests to check if a UTR number exists
// export async function GET(request: Request) {
//   try {
//     await connectToDatabase();

//     // Extract the UTR number from the query parameters
//     const { searchParams } = new URL(request.url);
//     const utrNo = searchParams.get('utrNo');

//     if (!utrNo) {
//       return NextResponse.json({ message: 'UTR number is required' }, { status: 400 });
//     }

//     // Check if the UTR number already exists
//     const existingPayment = await PaymentHistoryModel.findOne({ utrNo });

//     return NextResponse.json({ exists: !!existingPayment }, { status: 200 });
//   } catch (error: any) {
//     return NextResponse.json({ message: 'Error checking UTR', error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import mongoose from 'mongoose';

// Handle GET requests to check if a UTR number exists in the PaymentHistory array for a specific client
export async function GET(request: Request) {
  try {
    // Establish connection to the database
    await connectToDatabase();

    // Extract the UTR number and clientId from the query parameters
    const { searchParams } = new URL(request.url);
    const utrNo = searchParams.get('utrNo');
    const clientId = searchParams.get('clientId');

    // Validate that both UTR number and clientId are provided
    if (!utrNo || !clientId) {
      return NextResponse.json({ message: 'UTR number and Client ID are required' }, { status: 400 });
    }

    // Access the "clients" collection dynamically
    const clientCollection = mongoose.connection.collection('clients');

    // Search for the UTR number within the PaymentHistory array for the specific clientId
    const existingPayment = await clientCollection.findOne({
      clientId: clientId,
      'PaymentHistory.utrNo': utrNo
    });

    // Return whether the UTR number exists or not
    return NextResponse.json({ exists: !!existingPayment }, { status: 200 });
  } catch (error: any) {
    // Handle any errors and return an appropriate response
    return NextResponse.json({ message: 'Error checking UTR', error: error.message }, { status: 500 });
  }
}
