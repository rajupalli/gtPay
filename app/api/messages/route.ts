import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import MessageModel from '@/model/message';
import { messageSchema, MessageType } from '@/schemas/messageSchema';
import { z } from 'zod';

// Handle all HTTP methods (GET, POST, PUT, DELETE) in this file

export async function GET(request: NextRequest) {
  await connectToDatabase(); // Ensure the database is connected

  const { searchParams } = new URL(request.url);
  const referenceId = searchParams.get('referenceId');  // Ensure correct field name
  const amount = searchParams.get('amount');  // Get the amount from query

  // Log the query parameters
  console.log("Query Parameters Received:", { referenceId, amount });

  if (referenceId && amount) {
      try {
         
          // Perform the MongoDB query
          const foundMessage = await MessageModel.findOne({
              referenceId: referenceId, 
              amount: Number(amount)
          });

          console.log("Found Message:", foundMessage);

          if (foundMessage) {
              return NextResponse.json({ found: true, message: foundMessage }, { status: 200 });
          } else {
              return NextResponse.json({ found: false, message: 'Message not found' }, { status: 404 });
          }
      } catch (error: any) {
          return NextResponse.json({ message: 'Error checking message', error: error.message }, { status: 500 });
      }
  } else {
      return NextResponse.json({ message: 'referenceId and amount are required.' }, { status: 400 });
  }
}


// POST method: Add a new message
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate the request body using Zod schema
    const validatedData: MessageType = messageSchema.parse(body);

    // Create new message
    const newMessage = await MessageModel.create(validatedData);
    return NextResponse.json({ message: 'Message added successfully', data: newMessage }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error adding message', error: error.message }, { status: 500 });
  }
}

// PUT method: Update a message by ID
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const messageId = request.url.split('/').pop(); // Extract the ID from the URL

    // Validate the body using the Zod schema
    const validatedData: Partial<MessageType> = messageSchema.partial().parse(body);

    // Update the message by ID
    const updatedMessage = await MessageModel.findByIdAndUpdate(messageId, validatedData, { new: true });

    if (!updatedMessage) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Message updated successfully', data: updatedMessage }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Validation error', error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error updating message', error: error.message }, { status: 500 });
  }
}

// DELETE method: Delete a message by ID
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const messageId = request.url.split('/').pop(); // Extract the ID from the URL
    const deletedMessage = await MessageModel.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Message deleted successfully', data: deletedMessage }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting message', error: error.message }, { status: 500 });
  }
}
