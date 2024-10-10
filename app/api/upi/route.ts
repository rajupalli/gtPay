import { NextRequest, NextResponse } from 'next/server';
import UpiModel from '@/model/UpiDetails'; // Import UpiModel
import ClientModel from '@/model/client';
import UserModel from '@/model/userDetails';  // Import the ClientModel
import { connectToDatabase } from '@/lib/dbConnect';
import { upiSchema, UpiDetailsType } from '../../../schemas/UpiDetailsSchema';  // Import schema and types
import mongoose from 'mongoose';

export interface RequestBody {
    clientId: string;  // Add clientId to the request body
    beneficiaryName: string;
    upiId: string;
    qrCode: string;
    dailyLimit: string;
    activeDays: string[];
    activeMonths: string[];
    isActive: boolean;
    rangeFrom: number;
    rangeTo: number;
}

// GET /api/upi
export async function GET(req: NextRequest, res: NextResponse) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get('clientId'); // Retrieve clientId if passed as query param
        
        // Fetch UPI details for a specific client if clientId is passed, otherwise fetch all
        if (clientId) {
            const client = await ClientModel.findOne({ clientId }).populate('UPIModels');
            if (!client) {
                return NextResponse.json({ message: 'Client not found' }, { status: 404 });
            }
            return NextResponse.json({ data: client.UPIModels, message: 'UPI details fetched' }, { status: 200 });
        }

        // If no clientId, fetch all UPI records
        const upis = await UpiModel.find();
        return NextResponse.json({ data: upis, message: 'UPI details fetched' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

 
// POST /api/upi
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connectToDatabase();

    // Extract the raw request body (including clientId)
    const parsedBody = await req.json();

    // Extract clientId from the request body
    const { clientId, ...upiData } = parsedBody;

    // Check if clientId is provided
    if (!clientId) {
      return NextResponse.json({ message: 'Client ID is required' }, { status: 400 });
    }
    console.log(clientId);
    // Fetch the user (client) using clientId from the users collection
    const client = await mongoose.connection.collection('users').findOne({ clientId });
    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }
    console.log(client);
    const clientName = client.userName || '';  // Extract clientName or set to empty string if not found

    // Validate UPI data using the UPI schema (excluding clientId)
    const result = upiSchema.safeParse(upiData);  // Use Zod's safeParse to validate
    if (!result.success) {
     console.log(result.error.errors);
      return NextResponse.json({ message: 'Validation error', errors: result.error.errors }, { status: 400 });
    }

    const validatedUpiData = result.data as UpiDetailsType;  // 
    const upi = {
      ...validatedUpiData,  // Spread the validated UPI data
      clientName   
    };

    // Update the user's UPIModels array by adding the validated UPI data
    const updatedClient = await ClientModel.findOneAndUpdate(
      { clientId: clientId },  // Find the user by clientId
      { $push: { UPIModels: upi } },  // Add validated UPI details to the UPIModels array
      { new: true }  // Return the updated document
    );

    if (!updatedClient) {
      return NextResponse.json({ message: 'Client not found or UPI not associated' }, { status: 404 });
    }

    return NextResponse.json({ data: updatedClient, message: 'UPI details saved and associated with client' }, { status: 201 });

  } catch (error) {
    console.error("Error saving UPI or associating with client:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT api/upi -- Update UPI using the upiId
// PUT api/upi -- Update UPI using the upiId and clientId
export async function PUT(req: NextRequest, res: NextResponse) {
  try {
      await connectToDatabase();

      // Destructure the relevant fields from the request body
      const {
          clientId,        // We will use clientId to find the correct client document
          upiId,           // upiId is required to update the specific UPI in the array
          activeDays,
          activeMonths,
          beneficiaryName,
          dailyLimit,
          isActive,
          qrCode,
          rangeFrom,
          rangeTo
      } = await req.json() as RequestBody;
      console.log(`deleteing upi ${clientId}`);
      // Find the client by clientId and update the specific UPI in the UPIModels array
      const updatedClient = await ClientModel.findOneAndUpdate(
          { clientId: clientId, "UPIModels.upiId": upiId },  // Find the client and the specific UPI in the array
          { 
              $set: {
                  "UPIModels.$.activeDays": activeDays,  // Update fields within the matching UPI entry
                  "UPIModels.$.activeMonths": activeMonths,
                  "UPIModels.$.beneficiaryName": beneficiaryName,
                  "UPIModels.$.dailyLimit": dailyLimit,
                  "UPIModels.$.isActive": isActive,
                  "UPIModels.$.qrCode": qrCode,
                  "UPIModels.$.rangeFrom": rangeFrom,
                  "UPIModels.$.rangeTo": rangeTo
              }
          },
          { new: true }  // Return the updated client document
      );

      // Check if the update was successful
      if (!updatedClient) {
          return NextResponse.json({ message: 'Client or UPI not found' }, { status: 404 });
      }

      // Respond with the updated client details
      return NextResponse.json({ data: updatedClient, message: 'UPI details updated successfully' }, { status: 200 });
  } catch (error) {
      console.error("Error updating UPI:", error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
      await connectToDatabase();

      const { clientId, upiId } = await req.json(); // Destructure clientId and upiId from request body

      // Validate inputs
      if (!clientId || !upiId) {
          return NextResponse.json({ message: 'Invalid clientId or upiId' }, { status: 400 });
      }

      // Find the client by clientId and remove the UPI model with the specified upiId
      const updatedClient = await ClientModel.findOneAndUpdate(
          { clientId },
          { $pull: { UPIModels: { _id: upiId } } },  // Pull the UPI model by its _id
          { new: true }  // Return the updated document
      );
 
      if (!updatedClient) {
          return NextResponse.json({ message: 'Client or UPI not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'UPI deleted successfully from client', data: updatedClient }, { status: 200 });
  } catch (error) {
      console.error("Error deleting UPI:", error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}