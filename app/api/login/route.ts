import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/dbConnect';
import UserModel from '../../../model/userDetails'; // Adjust the path based on where your User model is stored
import mongoose from 'mongoose'; 

// The POST method should be a named export
export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { userName, password } = body;
  
      // Ensure the database connection is established
      await connectToDatabase();
  
      let user = null;
  
      // Step 1: Try finding the user in the 'users' collection first
      user = await UserModel.findOne({ userName });
  
      // Step 2: If not found in the 'users' collection, try the 'clients' collection
      if (!user) {
        const clientsCollection = mongoose.connection.collection('clients');
        const client = await clientsCollection.findOne({
          Users: { $elemMatch: { userName } } // Check in the Users array
        });
  
        if (client) {
          // Find the user object inside the client's Users array
          user = client.Users.find((u: any) => u.userName === userName);
        }
      }
  
      // Step 3: If user is still not found, return error
      if (!user) {
        return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
      }
  
      const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

      // Step 4: Compare the provided password with the hashed password stored
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);
      console.log("Provided password:", password);
      console.log("Stored hashed password:", user.password);
      console.log("Passwords match:", isPasswordValid);

      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Password does not match' }, { status: 401 });
      }
  
      // Step 5: If password matches, return success and user info (excluding password)
      const userResponse = {
        userName: user.userName,
        email: user.email,
        role: user.type || 'Client', // Assume 'type' is the role for users collection
        clientId: user.clientId || null
      };
  
      return NextResponse.json({ message: 'Login successful', user: userResponse }, { status: 200 });
    } catch (error: any) {
      console.error('Error during login:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }