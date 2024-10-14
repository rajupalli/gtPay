import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import User from '@/model/userDetails'; // Ensure this model is set up correctly

// Handle GET requests
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json(
      { exists: false, message: 'Client ID is missing or invalid.' },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Query the User model to find the client ID
    const user = await User.findOne({ clientId });
   
    if (user) {
      return NextResponse.json({ exists: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { exists: false, message: 'Client ID not found.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { exists: false, message: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}
