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
      console.log(newPaymentHistory);  
      return NextResponse.json({ message: 'Payment history added', data: newPaymentHistory }, { status: 201 });
    } catch (error: any) {
        console.log(error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ message: 'Validation error', error: error.errors }, { status: 400 });
      }
      return NextResponse.json({ message: 'Error adding payment history', error: error.message }, { status: 500 });
    }
  }
  
  

// Delete payment history by UTR (DELETE /api/payment-history)
export async function DELETE(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract utrNo from the request body
    const { utrNo } = await request.json() as { utrNo: string };

    // Log the UTR number to ensure it's received correctly
    console.log('Received UTR number for deletion:', utrNo);

    // Ensure that utrNo is provided
    if (!utrNo) {
      return NextResponse.json({ message: 'UTR number is required' }, { status: 400 });
    }

    // Find and delete payment history by UTR number
    const deletedPaymentHistory = await PaymentHistoryModel.findOneAndDelete({ utrNo });

    // If no record is found, return a 404
    if (!deletedPaymentHistory) {
      console.log(`Payment history with UTR ${utrNo} not found`);
      return NextResponse.json({ message: 'Payment history not found' }, { status: 404 });
    }

    // Return success response if the record was deleted
    return NextResponse.json({ message: 'Payment history deleted', data: deletedPaymentHistory }, { status: 200 });
  } catch (error) {
    // Error handling: returning error message with 500 status code
    if (error instanceof Error) {
      console.error('Error deleting payment history:', error.message);
      return NextResponse.json({ message: 'Error deleting payment history', error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error occurred:', String(error));
      return NextResponse.json({ message: 'Unknown error occurred', error: String(error) }, { status: 500 });
    }
  }
 }

 
  
// Update payment history by UTR (PUT /api/payment-history)
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase(); // Ensure the database is connected

    const updateData = await request.json(); // Remaining update data (e.g., utrNo, status)

    const { utrNo, status } = updateData;

    // Check if utrNo is provided
    if (!utrNo) {
      return NextResponse.json({ message: 'UTR number is required' }, { status: 400 });
    }

    // Validate status
    if (!['Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }

    // Find and update payment history by UTR number
    const updatedPaymentHistory = await PaymentHistoryModel.findOneAndUpdate(
      { utrNo }, // Query using UTR number
      { status }, // Update status
      { new: true } // Return the updated document
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

