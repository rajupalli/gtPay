import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import BankModel from '@/model/BankDetails';
import { BankDetailsType } from '@/schemas/BankDetailsSchema';

export interface RequestBody {
  beneficiaryName: string;
  accountNo: string;
  IFSCcode: string;
  bankName: string;
  dailyLimit: string;
  activeDays: string[];
  activeMonths: string[];
  isActive: boolean;
  rangeFrom: number;  // Ensure this is included
  rangeTo: number; 
}

interface updateRequestBody extends RequestBody {
  bankID:string;
}

// create
export async function POST(request: NextRequest, response: NextResponse) {
  try {

    await connectToDatabase();



    const { beneficiaryName, accountNo, IFSCcode, bankName, dailyLimit, activeDays, activeMonths, isActive, rangeFrom, rangeTo } = await request.json() as BankDetailsType;

    console.log("Request body:", {
      beneficiaryName, accountNo, IFSCcode, bankName, dailyLimit, activeDays, activeMonths, isActive,rangeFrom,rangeTo
    });

    // Create new bank detail
    const newBankDetail = await BankModel.create({
      beneficiaryName,
      accountNo,
      IFSCcode,
      bankName,
      dailyLimit,
      activeDays,
      activeMonths,
      isActive,
      rangeFrom,
      rangeTo
      
    });



    return NextResponse.json({ message: 'Bank details saved', data: newBankDetail }, { status: 200 });

  } catch (error: any) {
    console.error("Error in POST /bank-details:", error);
    return NextResponse.json({ message: 'Error saving bank details', error: error.message }, { status: 500 });
  }
}

// read
export async function GET(request: NextRequest, response: NextResponse) {
  try {
    await connectToDatabase();
    const bankDetails = await BankModel.find();

    return NextResponse.json({ message: 'Bank details fetched', data: bankDetails }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching bank details' }, { status: 500 });
  }
}

// update
export async function PUT(request: NextRequest, response: NextResponse) {
  try {
    await connectToDatabase()
    const { bankID, beneficiaryName, accountNo, IFSCcode, bankName, dailyLimit, activeDays, activeMonths, isActive ,rangeFrom, rangeTo} = await request.json() as updateRequestBody

    const updatedBankDetails = await BankModel.findByIdAndUpdate(bankID, {
      beneficiaryName,
      accountNo,
      IFSCcode,
      bankName,
      dailyLimit,
      activeDays,
      activeMonths,
      rangeFrom,rangeTo,
      isActive
    }, { new: true })

    if (!updatedBankDetails) {
      return NextResponse.json({ message: 'Bank details not updated' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Bank details updated', data: updatedBankDetails }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching bank details' }, { status: 500 });
  }
}

// delete
export async function DELETE(request: NextRequest, response: NextResponse) {
  try {
    await connectToDatabase();
    const { bankID } = await request.json() as { bankID: string };

    const deletedBankDetails = await BankModel.findByIdAndDelete(bankID);

    if (!deletedBankDetails) {
      return NextResponse.json({ message: 'Bank details not deleted' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Bank details deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching bank details' }, { status: 500 });
  }
}




