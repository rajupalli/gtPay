import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import BankModel from '@/model/BankDetails';
import { bankSchema, BankDetailsType } from '../../../schemas/BankDetailsSchema';  // Import schema and types
import mongoose from 'mongoose';
import ClientModel from '@/model/client';


export interface RequestBody {
  beneficiaryName: string;
  clientId:string,
  accountNo: string;
  IFSCcode: string;
  bankName: string;
  dailyLimit: string;
  activeDays: string[];
  activeMonths: string[];
  isActive: boolean;
  rangeFrom: number;  // Ensure this is included
  rangeTo: number; 
  clientName:string;
}

 

interface updateRequestBody extends RequestBody {
  bankID:string;
}

// POST /api/bank
export async function POST(req: NextRequest, res: NextResponse) {
  try {
      await connectToDatabase();

      const parsedBody = await req.json();
      const { clientId, ...bankData } = parsedBody;
      console.log(clientId);
      console.log(bankData);
      if (!clientId) {
          return NextResponse.json({ message: 'Client ID is required' }, { status: 400 });
      }

      const client = await mongoose.connection.collection('users').findOne({ clientId });
      if (!client) {
          return NextResponse.json({ message: 'Client not found' }, { status: 404 });
      }
      console.log(client);
      const clientName = client.userName || '';  // Extract clientName or set to empty string if not found

      // Validate Bank data using the bank schema (excluding clientId)
      const result = bankSchema.safeParse(bankData);
      if (!result.success) {
          console.log("validation error");
          console.log(result.error.errors );
          return NextResponse.json({ message: 'Validation error', errors: result.error.errors }, { status: 400 });
      }

      const validatedBankData = result.data as BankDetailsType;
      const bank = {
          ...validatedBankData,
          clientName
      };

      const updatedClient = await ClientModel.findOneAndUpdate(
          { clientId },
          { $push: { BankModels: bank } },  // Add validated bank details to the BankModels array
          { new: true }
      );

      if (!updatedClient) {
          return NextResponse.json({ message: 'Client not found or bank not associated' }, { status: 404 });
      }


      return NextResponse.json({ data: updatedClient, message: 'Bank details saved and associated with client' }, { status: 201 });

  } catch (error) {
      console.error("Error saving Bank or associating with client:", error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
// read
export async function GET(req: NextRequest) {
  try {
      // Connect to the database
      await connectToDatabase();

      // Parse the request URL and extract the search parameters
      const { searchParams } = new URL(req.url);
      const clientId = searchParams.get('clientId'); // Get clientId from query parameters
      
      // If clientId is provided, fetch the client and their bank details
      if (clientId) {
          const client = await ClientModel.findOne({ clientId }).populate('BankModels');
          
          // If the client is not found, return a 404 response
          if (!client) {
              return NextResponse.json({ message: 'Client not found' }, { status: 404 });
          }

          // Return the client's bank details with a 200 status
          return NextResponse.json({ data: client.BankModels, message: 'Bank details fetched' }, { status: 200 });
      } else {
          // If no clientId is provided, return a 400 response indicating the query param is missing
          return NextResponse.json({ message: 'clientId query parameter is required' }, { status: 400 });
      }

  } catch (error) {
      console.error('Error fetching client or bank details:', error);

      // Return a 500 response in case of any internal errors
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// update
export async function PUT(request: NextRequest, response: NextResponse) {
  try {
    await connectToDatabase();

    // Destructure the request body to get the necessary fields
    const { bankID,clientId , beneficiaryName, accountNo, IFSCcode, bankName, dailyLimit, activeDays, activeMonths, isActive, rangeFrom, rangeTo } = await request.json() as updateRequestBody;

    // Find the client by clientId and update the bank details within the BankModels array
    const updatedClient = await ClientModel.findOneAndUpdate(
      {
        clientId,
        "BankModels._id": bankID  // Match the specific bank model using bankID within the client's BankModels array
      },
      {
        $set: {
          "BankModels.$.beneficiaryName": beneficiaryName,
          "BankModels.$.accountNo": accountNo,
          "BankModels.$.IFSCcode": IFSCcode,
          "BankModels.$.bankName": bankName,
          "BankModels.$.dailyLimit": dailyLimit,
          "BankModels.$.activeDays": activeDays,
          "BankModels.$.activeMonths": activeMonths,
          "BankModels.$.isActive": isActive,
          "BankModels.$.rangeFrom": rangeFrom,
          "BankModels.$.rangeTo": rangeTo
        }
      },
      { new: true }  // Return the updated document
    );

    // If no client or bank model is found, return an error
    if (!updatedClient) {
      return NextResponse.json({ message: 'Client or Bank details not found' }, { status: 404 });
    }

    // Return a success response with the updated client data
    return NextResponse.json({ message: 'Bank details updated successfully', data: updatedClient }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating bank details:", error);
    return NextResponse.json({ message: 'Error updating bank details', error: error.message }, { status: 500 });
  }
}

// delete
export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
      await connectToDatabase();

      // Extracting clientId and bankId from the request body
      const { clientId, bankId } = await req.json();

      // Validate the incoming request
      if (!clientId || !bankId) {
          return NextResponse.json({ message: 'Invalid clientId or bankId' }, { status: 400 });
      }

      // Find the client and remove the bank model from the BankModels array
      const updatedClient = await ClientModel.findOneAndUpdate(
          { clientId },
          { $pull: { BankModels: { _id: bankId } } },  // Remove the bank entry by its _id
          { new: true }  // Return the updated document
      );

      // Check if the client or bank was not found
      if (!updatedClient) {
          return NextResponse.json({ message: 'Client or Bank not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Bank deleted successfully from client', data: updatedClient }, { status: 200 });
  } catch (error: any) {
      console.error("Error deleting Bank:", error);
      return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

