import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import UserModel from '@/model/userDetails'; // Assume there is a User model for 'users' collection
import ClientModel from '@/model/client'; // Model for 'clients' collection

// GET API for searching a user
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract clientId and userId from query parameters
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const userId = searchParams.get('userId');

    if (!clientId || !userId) {
      return NextResponse.json(
        { message: 'Both clientId and userId are required' },
        { status: 400 }
      );
    }

    // First, search in the 'users' collection
    const user = await UserModel.findOne({ clientId });
    console.log(user);
    if (user) {
      console.log(user.appPassword);
      // If user is found in 'users', return the response
      return NextResponse.json({
        message: 'User found in users collection',
        data: {
          userName: user.userName,
          clientId: user.clientId,
          role: user.type,
          mobileNumber: user.phoneNumber,
          appPassword:user.appPassword,
          companyName:user.companyName
        },
        status: 200,
      });
    }

    // If not found in 'users', search in the 'clients' collection within 'ClientAdmin'
    const client = await ClientModel.findOne({ clientId, 'ClientAdmin.userId': userId }, { 'ClientAdmin.$': 1 });

    if (client && client.ClientAdmin && client.ClientAdmin.length > 0) {
      const clientAdmin = client.ClientAdmin[0];
      // If user is found in 'ClientAdmin', return the response
      return NextResponse.json({
        message: 'User found in clients collection (ClientAdmin)',
        data: {
          userName: clientAdmin.userName,
          clientId: clientId,
          role: clientAdmin.role,
          mobileNumber: clientAdmin.mobileNumber,
        },
        status: 200,
      });
    }

    // If user is not found in either collection
    return NextResponse.json(
      { message: 'User not found in both users and ClientAdmin', data: [] },
      { status: 404 }
    );

  } catch (error: any) {
    console.error('Error occurred while fetching user:', error.message);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
