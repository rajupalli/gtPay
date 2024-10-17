// import { NextResponse, NextRequest } from 'next/server';
// import { connectToDatabase } from '@/lib/dbConnect';
// import PaymentHistoryModel from '@/model/paymentHistory';
// import { paymentHistorySchema } from '@/schemas/paymentHistorySchema';


 
// import mongoose from 'mongoose';
 
// import { z } from 'zod'; // Assuming you are using Zod for validation
 

// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await connectToDatabase(); // Ensure the database is connected

//     const { id: paymentId } = params; // Extract dynamic paymentId from the route

//     if (!paymentId) {
//       return NextResponse.json({ message: 'Payment ID is required' }, { status: 400 });
//     }

//     const isValidObjectId = mongoose.Types.ObjectId.isValid(paymentId);
//     if (!isValidObjectId) {
//       return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
//     }

//     const updateData = await request.json();

//     const validatedData = paymentHistorySchema.partial().parse(updateData);

//     const updatedPaymentHistory = await PaymentHistoryModel.findByIdAndUpdate(
//       paymentId,
//       validatedData,
//       { new: true }
//     );

//     if (!updatedPaymentHistory) {
//       return NextResponse.json({ message: 'Payment history not found' }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'Payment history updated', data: updatedPaymentHistory }, { status: 200 });
//   } catch (error: any) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ message: 'Validation error', error: error.errors }, { status: 400 });
//     }

//     return NextResponse.json({ message: 'Error updating payment history', error: error.message }, { status: 500 });
//   }
// }


import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import { paymentHistorySchema } from '@/schemas/paymentHistorySchema';
import mongoose from 'mongoose';
import { z } from 'zod'; // Assuming you are using Zod for validation

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ensure the database is connected
    await connectToDatabase();

    // Extract paymentId and clientId from the query parameters
    const { id: paymentId } = params;
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId'); // Extract clientId from query

    // Validate if paymentId and clientId are provided
    if (!paymentId || !clientId) {
      return NextResponse.json({ message: 'Payment ID and Client ID are required' }, { status: 400 });
    }
    console.log(clientId);
    console.log(paymentId);
    

    // Parse and validate the request data
    const updateData = await request.json();
    const validatedData = paymentHistorySchema.partial().parse(updateData);
    console.log(updateData);
    // Extract the status to be updated
    const { status } = validatedData;
console.log(status);
    // Access the "clients" collection
    const clientCollection = mongoose.connection.collection('clients');
  
    // Find and update the specific payment history entry for the given clientId and paymentId
    const updatedClient = await clientCollection.findOneAndUpdate(
      { 
        clientId: clientId, // Filter by clientId
        'PaymentHistory.utrNo': paymentId // Find the payment by its ID inside PaymentHistory array
      },
      { $set: { 'PaymentHistory.$.status': status } }, // Use the positional operator `$` to update the matched payment entry
      { returnDocument: 'after' } // Return the updated document after the update
    );

     
    // Check if the payment history was found and updated
    if (!updatedClient) { // Updated client will be null if not found
      return NextResponse.json({ message: 'Payment history not found' }, { status: 404 });
    }
    

    // Return the updated client document with the updated payment history
    return NextResponse.json({ message: 'Payment history updated', data: updatedClient?.value }, { status: 200 });
  } catch (error: any) {
    // Handle validation errors from Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', error: error.errors }, { status: 400 });
    }
    console.log(error.message);
    // Handle other errors
    return NextResponse.json({ message: 'Error updating payment history', error: error.message }, { status: 500 });
  }
}
