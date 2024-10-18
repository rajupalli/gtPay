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
    let clientId = searchParams.get('clientId');
    const userId = searchParams.get('userId');

    if (!clientId || !userId) {
      return NextResponse.json(
        { message: 'Both clientId and userId are required' },
        { status: 400 }
      );
    }

    if(clientId==="superAdmin"){
        clientId=userId;
        const user = await UserModel.findOne({ clientId });
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
    console.log(clientId);

    const user = await UserModel.findOne({ clientId });
     
    
    if(  user._id==userId ){
    if (user) {
      console.log(user.appPassword);
     
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
    }}else{

      const client = await ClientModel.findOne({ clientId: clientId });

if (client && client.ClientAdmin && client.ClientAdmin.length > 0) {
  // Find the specific ClientAdmin with the matching _id (userId)
  const clientAdmin = client.ClientAdmin.find((admin: any) => admin._id.toString() === userId.toString());

  if (clientAdmin) {
    console.log("Found ClientAdmin: ", clientAdmin);
    return NextResponse.json({
      message: 'User found in clients collection (ClientAdmin)',
      data: {
        userName: clientAdmin.userName,
        clientId: clientAdmin.clientId,
        role: clientAdmin.type,
        mobileNumber: clientAdmin.phoneNumber,
        appPassword:"",
        companyName:client.companyName
      },
      status: 200,
    });
  } else {
    console.log("ClientAdmin with the given _id not found.");
  }
} else {
  console.log("Client or ClientAdmin not found.");
}


    // // If not found in 'users', search in the 'clients' collection within 'ClientAdmin'
    // const client = await ClientModel.findOne(
    //   {
    //     clientId: clientId,
    //     'ClientAdmin._id': userId
    //   },
    //   {
    //     'ClientAdmin.$': 1 // This will return only the matching element in the ClientAdmin array
    //   }
    // );
    
    
    // console.log(client); 
    // if (client && client.ClientAdmin && client.ClientAdmin.length > 0) {
    //   const clientAdmin = client.ClientAdmin[0];
    //   // If user is found in 'ClientAdmin', return the response
      // return NextResponse.json({
      //   message: 'User found in clients collection (ClientAdmin)',
      //   data: {
      //     userName: clientAdmin.userName,
      //     clientId: clientId,
      //     role: clientAdmin.role,
      //     mobileNumber: clientAdmin.mobileNumber,
      //   },
      //   status: 200,
      // });
    // }
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
