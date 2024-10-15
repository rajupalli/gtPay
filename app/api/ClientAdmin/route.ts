import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import ClientAdminModel from '@/model/clientAdmin';
import ClientModel from '@/model/client';
import { clientAdminSchema, ClientAdminSchemaType } from '@/schemas/clientAdmin';
import mongoose from 'mongoose';

// Ensure the database is connected before performing operations
async function ensureDatabaseConnection() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to the database.');
  }
}

// POST /api/clientAdmin
export async function POST(req: NextRequest) {
  try {
    await ensureDatabaseConnection();

    const parsedBody = await req.json();
    console.log(parsedBody);
    const result = clientAdminSchema.safeParse(parsedBody);

    if (!result.success) {
      console.error('Validation Error:', result.error);
      return NextResponse.json(
        { message: 'Validation error', errors: result.error.errors },
        { status: 400 }
      );
    }

    const { clientId, ...adminData } = parsedBody as ClientAdminSchemaType;
    const client = await ClientModel.findOne({ clientId });

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    const newAdmin = new ClientAdminModel({ clientId, ...adminData });
    await newAdmin.save();

    // Embed the new admin directly if using embedded schema
    client.ClientAdmins.push(newAdmin);
    await client.save();

    return NextResponse.json(
      { message: 'ClientAdmin created and associated with client', data: newAdmin },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating ClientAdmin:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/clientAdmin?clientId=<clientId>
export async function GET(req: NextRequest) {
  try {
    await ensureDatabaseConnection();

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { message: 'clientId query parameter is required' },
        { status: 400 }
      );
    }
    
    console.log(clientId);
    const client = await ClientModel.findOne({ clientId });

    if (!client) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }
    console.log(client.ClientAdmins);
    return NextResponse.json(
      { data: client.ClientAdmins, message: 'ClientAdmins fetched successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching ClientAdmins:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/clientAdmin
export async function PUT(req: NextRequest) {
  try {
    await ensureDatabaseConnection();

    const { id, ...updateData } = await req.json();
    const result = clientAdminSchema.safeParse(updateData);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Validation error', errors: result.error.errors },
        { status: 400 }
      );
    }

    const updatedAdmin = await ClientAdminModel.findByIdAndUpdate(id, result.data, {
      new: true,
    });

    if (!updatedAdmin) {
      return NextResponse.json({ message: 'ClientAdmin not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'ClientAdmin updated successfully', data: updatedAdmin },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating ClientAdmin:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/clientAdmin
export async function DELETE(req: NextRequest) {
  try {
    await ensureDatabaseConnection();

    const { clientId, adminId } = await req.json();

    if (!clientId || !adminId) {
      return NextResponse.json(
        { message: 'Invalid clientId or adminId' },
        { status: 400 }
      );
    }

    const client = await ClientModel.findOneAndUpdate(
      { clientId },
      { $pull: { ClientAdmins: { _id: adminId } } }, // If using embedded documents
      { new: true }
    );

    if (!client) {
      return NextResponse.json({ message: 'Client or ClientAdmin not found' }, { status: 404 });
    }

    // Delete the admin if using a separate collection
    await ClientAdminModel.findByIdAndDelete(adminId);

    return NextResponse.json(
      { message: 'ClientAdmin deleted successfully', data: client },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting ClientAdmin:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
