import { NextRequest, NextResponse } from 'next/server';
import PaymentHistoryModel from '@/model/paymentHistory';
import { connectToDatabase } from '@/lib/dbConnect';

export async function GET(req: NextRequest, { params }: { params: { IDbankorUPI: string } }) {
  const { IDbankorUPI } = params;

  // Ensure an IDbankorUPI is provided
  if (!IDbankorUPI || typeof IDbankorUPI !== 'string') {
    return NextResponse.json({ message: 'IDbankorUPI is required' }, { status: 400 });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Query the PaymentHistory collection to find approved payments for the given IDbankorUPI
    const approvedPayments = await PaymentHistoryModel.aggregate([
      {
        $match: {
          IDbankorUPI: IDbankorUPI,  // Match the given IDbankorUPI
          status: 'Approved',        // Only match approved transactions
        },
      },
      {
        $group: {
          _id: null,  // Group the results (null means we are not grouping by any specific field)
          totalApprovedAmount: { $sum: '$amount' },  // Sum the "amount" field for the matching records
        },
      },
    ]);

    // If no approved payments found, return 0
    const totalApprovedAmount = approvedPayments.length > 0 ? approvedPayments[0].totalApprovedAmount : 0;

    // Send the total approved amount in response
    return NextResponse.json({ IDbankorUPI, totalApprovedAmount }, { status: 200 });

  } catch (error: unknown) {
    // Handle errors appropriately by checking if error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
    // For cases where error is not an instance of Error
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}
