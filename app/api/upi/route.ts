import { NextRequest, NextResponse } from 'next/server';
import UpiModel from '@/model/UpiDetails'
import { connectToDatabase } from '@/lib/dbConnect';

export interface RequestBody {
    beneficiaryName: string;
    upiId: string;
    qrCode: string;
    dailyLimit: string;
    activeDays: string[];
    activeMonths: string[];
    isActive: boolean;
    rangeFrom: number;  // Ensure this is included
    rangeTo: number; 
}

// GET /api/upi
export async function GET (req: NextRequest, res: NextResponse){
    try {
        await connectToDatabase();
        const upis = await UpiModel.find();
        return NextResponse.json({ data: upis, message: 'UPI details fetched' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};

// POST /api/upi
export async function POST(req: NextRequest, res: NextResponse) {
    try {
        
        await connectToDatabase();
        const { activeDays, activeMonths, beneficiaryName, dailyLimit, isActive, qrCode, upiId,rangeFrom,rangeTo } = await req.json() as RequestBody;

        const upi = await UpiModel.create({ activeDays, activeMonths, beneficiaryName, dailyLimit, isActive, qrCode, upiId,rangeFrom, rangeTo });
        if (!upi) {
            return NextResponse.json({ message: 'UPI not saved' }, { status: 400 });
        }
        return NextResponse.json({ data: upi, message: 'UPI details saved' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};

// PUT api/upi -- frontent body { upiId: data._id }
export async function PUT (req: NextRequest, res: NextResponse) {
    try {
        const { activeDays, activeMonths, beneficiaryName, dailyLimit, isActive, qrCode, upiId ,rangeFrom,rangeTo} = await req.json() as RequestBody;

        const upi = await UpiModel.findByIdAndUpdate(upiId, { activeDays, activeMonths, beneficiaryName, dailyLimit, isActive, qrCode, upiId,rangeFrom, rangeTo}, { new: true });
        if (!upi) {
            return NextResponse.json({ message: 'UPI not found' }, { status: 404 });
        }
        return NextResponse.json({ data: upi, message: 'UPI details updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};

export async function DELETE(req: NextRequest, res: NextResponse) {
    try {
      // Parse the JSON body from the request
      const body = await req.json(); 
      const { upiID } = body; // Get upiID from the request body
  
      // Validate UPI ID
      if (!upiID || typeof upiID !== 'string') {
        return NextResponse.json({ message: 'Invalid UPI ID' }, { status: 400 });
      }
  
      // Perform the deletion
      const upi = await UpiModel.findByIdAndDelete(upiID);
      if (!upi) {
        return NextResponse.json({ message: 'UPI not found' }, { status: 404 });
      }
  
      // Return a success response
      return NextResponse.json({ message: 'UPI deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error("Error deleting UPI: ", error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  