import { NextRequest, NextResponse } from 'next/server';
import ClientModel from '@/model/client'; // Assuming ClientModel is the schema for the clients collection
import { connectToDatabase } from '@/lib/dbConnect';

export async function GET(req: NextRequest, { params }: { params: { IDbankorUPI: string } }) {
  const { IDbankorUPI } = params;
  const clientId = req.nextUrl.searchParams.get('clientId'); // Extract clientId from query params

  // Ensure clientId and IDbankorUPI are provided
  if (!clientId || !IDbankorUPI) {
    return NextResponse.json({ message: 'clientId and IDbankorUPI are required' }, { status: 400 });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Query the clients collection to find the payment history for the given clientId
    const client = await ClientModel.findOne({ clientId: clientId });

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    // Filter the PaymentHistory array for approved transactions and matching IDbankorUPI
    const approvedPayments = client.PaymentHistory.filter((payment: any) => {
      return payment.status === 'Approved' && payment.IDbankorUPI === IDbankorUPI;
    });

    // Calculate the total approved amount for this client and specific UPIId or BankId
    const totalApprovedAmount = approvedPayments.reduce((sum: number, payment: any) => {
      return sum + payment.amount;
    }, 0);

    // Send the total approved amount in the response
    return NextResponse.json({ clientId, IDbankorUPI, totalApprovedAmount }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}