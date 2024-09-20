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
        const { activeDays, activeMonths, beneficiaryName, dailyLimit, isActive, qrCode, upiId } = await req.json() as RequestBody;
        const upi = await UpiModel.create({ activeDays, activeMonths, beneficiaryName, dailyLimit, isActive, qrCode, upiId });
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
        const { activeDays, activeMonths, beneficiaryName, dailyLimit, isActive, qrCode, upiId } = await req.json() as RequestBody;
        const upi = await UpiModel.findByIdAndUpdate(upiId, { activeDays, activeMonths, beneficiaryName, dailyLimit, isActive, qrCode, upiId }, { new: true });
        if (!upi) {
            return NextResponse.json({ message: 'UPI not found' }, { status: 404 });
        }
        return NextResponse.json({ data: upi, message: 'UPI details updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};

export async function DELETE (req: NextRequest, res: NextResponse) {
    const { upiId } = await req.json() as { upiId: String };
    try {
        const upi = await UpiModel.findByIdAndDelete(upiId);
        if (!upi) {
            return NextResponse.json({ message: 'UPI not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'UPI deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};
