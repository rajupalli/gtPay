import { NextRequest, NextResponse } from 'next/server';
import PaymentHistoryModel from '@/model/paymentHistory'; // Adjust the import path to your project
import { connectToDatabase } from '@/lib/dbConnect'; // Ensure you have a database connection utility

// Named export for GET method
export async function GET(req: NextRequest, { params }: { params: { beneficiaryName: string } }) {
  const { beneficiaryName } = params;

  // Ensure a beneficiaryName is provided
  if (!beneficiaryName || typeof beneficiaryName !== 'string') {
    return NextResponse.json({ message: 'Beneficiary name is required' }, { status: 400 });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Query the PaymentHistory collection to find approved payments for the beneficiary
    const approvedPayments = await PaymentHistoryModel.aggregate([
      {
        $match: {
          beneficiaryName: beneficiaryName, // Match the given beneficiary name
          status: 'Approved', // Only match approved transactions
        },
      },
      {
        $group: {
          _id: null, // Group the results (null means we are not grouping by any specific field)
          totalApprovedAmount: { $sum: '$amount' }, // Sum the "amount" field for the matching records
        },
      },
    ]);

    // If no approved payments found, return 0
    const totalApprovedAmount = approvedPayments.length > 0 ? approvedPayments[0].totalApprovedAmount : 0;

    // Send the total approved amount in response
    return NextResponse.json({ beneficiaryName, totalApprovedAmount }, { status: 200 });
  } catch (error) {
    // Handle errors appropriately
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
