import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/dbConnect';
import UserModel from '../../../model/userDetails'; // Adjust the path as needed
import mongoose from 'mongoose';

const SECRET_KEY = process.env.JWT_SECRET || ''; // Use a secure key from .env

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userName, password } = body;

    // Ensure the database connection is established
    await connectToDatabase();

    let user = await UserModel.findOne({ userName });

    // Check 'clients' collection if not found in 'users' collection
    if (!user) {
      const clientsCollection = mongoose.connection.collection('clients');
      const client = await clientsCollection.findOne({
        Users: { $elemMatch: { userName } }
      });

      if (client) {
        user = client.Users.find((u: any) => u.userName === userName);
      }
    }

    // If user not found, return an error
    if (!user) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Password does not match' }, { status: 401 });
    }

    // Create JWT token (without expiry)
    // const token = jwt.sign(
    //   {
    //     userName: user.userName,
    //     email: user.email,
    //     role: user.type || 'Client',
    //     clientId: user.clientId || null,
    //   },
    //   SECRET_KEY
    // );

    // Set HttpOnly cookie with the JWT token
    const response = NextResponse.json(
      { message: 'Login successful', user: user },
      { status: 200 }
    );

    // response.headers.append(
    //   'Set-Cookie',
    //   `authToken=${token}; HttpOnly; Path=/; SameSite=Strict; ${
    //     process.env.NODE_ENV === 'production' ? 'Secure;' : ''
    //   }`
    // );

    return response;
  } catch (error: any) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
