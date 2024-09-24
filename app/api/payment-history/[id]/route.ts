import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import PaymentHistoryModel from '@/model/paymentHistory';
import { paymentHistorySchema } from '@/schemas/paymentHistorySchema';


 
import mongoose from 'mongoose';
 
import { z } from 'zod'; // Assuming you are using Zod for validation
 

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase(); // Ensure the database is connected

    const { id: paymentId } = params; // Extract dynamic paymentId from the route

    if (!paymentId) {
      return NextResponse.json({ message: 'Payment ID is required' }, { status: 400 });
    }

    const isValidObjectId = mongoose.Types.ObjectId.isValid(paymentId);
    if (!isValidObjectId) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    const updateData = await request.json();

    const validatedData = paymentHistorySchema.partial().parse(updateData);

    const updatedPaymentHistory = await PaymentHistoryModel.findByIdAndUpdate(
      paymentId,
      validatedData,
      { new: true }
    );

    if (!updatedPaymentHistory) {
      return NextResponse.json({ message: 'Payment history not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Payment history updated', data: updatedPaymentHistory }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ message: 'Error updating payment history', error: error.message }, { status: 500 });
  }
}
