import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import PaymentHistoryModel from '@/model/paymentHistory';
import { paymentHistorySchema } from '@/schemas/paymentHistorySchema';
import { z } from 'zod';
import mongoose, { Document, Schema } from 'mongoose';

// Fetch all payment history (GET /api/payment-history)
export async function GET(request: NextRequest) {
    try {
      await connectToDatabase();
      const paymentHistories = await PaymentHistoryModel.find();
  
      return NextResponse.json({ message: 'Payment history fetched', data: paymentHistories }, { status: 200 });
    } catch (error) {
      // Narrowing down the error type to an object with a message
      if (error instanceof Error) {
        return NextResponse.json({ message: 'Error fetching payment history', error: error.message }, { status: 500 });
      } else {
        // If error is not an instance of Error, return a generic message
        return NextResponse.json({ message: 'Unknown error occurred', error: String(error) }, { status: 500 });
      }
    }
  }
  

  export async function POST(request: NextRequest) {
    try {
      await connectToDatabase();
      const paymentHistoryData = await request.json();
  
      // Convert dateTime back to a Date object if it was sent as a string
      if (typeof paymentHistoryData.dateTime === 'string') {
        paymentHistoryData.dateTime = new Date(paymentHistoryData.dateTime);
      }
  
      // Validate the request data using the Zod schema
      const validatedData = paymentHistorySchema.parse(paymentHistoryData);
  
      // Create new payment history
      const newPaymentHistory = await PaymentHistoryModel.create(validatedData);
  
      return NextResponse.json({ message: 'Payment history added', data: newPaymentHistory }, { status: 201 });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ message: 'Validation error', error: error.errors }, { status: 400 });
      }
      return NextResponse.json({ message: 'Error adding payment history', error: error.message }, { status: 500 });
    }
  }
  
  

// Delete payment history by ID (DELETE /api/payment-history)
export async function DELETE(request: NextRequest) {
    try {
      await connectToDatabase();
      const { paymentId } = await request.json() as { paymentId: string };
  
      // Find and delete payment history by ID
      const deletedPaymentHistory = await PaymentHistoryModel.findByIdAndDelete(paymentId);
  
      if (!deletedPaymentHistory) {
        return NextResponse.json({ message: 'Payment history not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Payment history deleted', data: deletedPaymentHistory }, { status: 200 });
    } catch (error) {
      // Narrowing down the error type to an object with a message
      if (error instanceof Error) {
        return NextResponse.json({ message: 'Error deleting payment history', error: error.message }, { status: 500 });
      } else {
        // If error is not an instance of Error, return a generic message
        return NextResponse.json({ message: 'Unknown error occurred', error: String(error) }, { status: 500 });
      }
    }
  }
  
 
  
  // Update payment history by ID (PUT /api/payment-history)
  export async function PUT(request: NextRequest) {
    try {
      await connectToDatabase(); // Ensure the database is connected
  
      // Extract paymentId from the URL
      const { pathname } = new URL(request.url);
      const paymentId = pathname.split('/').pop(); // Extract the ID from the URL (last part of the path)
  
      // Check if paymentId is undefined
      if (!paymentId) {
        return NextResponse.json({ message: 'Payment ID is required' }, { status: 400 });
      }
  
      // Validate ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(paymentId);
      if (!isValidObjectId) {
        return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
      }
  
      const updateData = await request.json(); // Remaining update data (e.g., status)
  
      // Validate updated data using Zod schema
      const validatedData = paymentHistorySchema.partial().parse(updateData);
  
     // Find and update payment history by ID
const updatedPaymentHistory = await PaymentHistoryModel.findByIdAndUpdate(
  paymentId, 
  validatedData, 
  { new: true } // This option ensures the updated document is returned
);
       console.log(updatedPaymentHistory);
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
  
