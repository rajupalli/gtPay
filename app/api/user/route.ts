import { NextResponse } from 'next/server';
import UserModel from '@/model/userDetails';  // Ensure this path is correct
import { userSchema } from '@/schemas/userSchema';  // Ensure this path is correct
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/dbConnect';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
export async function GET() {
  try {
    // Establish connection to MongoDB
    await connectToDatabase();
    
    const users = await UserModel.find();  // Fetch all users from the database
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// Function to generate an 8-digit PIN using timestamp and random number
function generatePin(): string {
  const timestamp = Date.now().toString().slice(-5); // Last 5 digits of the timestamp
  const randomNum = Math.floor(100 + Math.random() * 900); // Generate a 3-digit random number
  return timestamp + randomNum.toString(); // Combine them to get an 8-digit pin
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const parsedBody = userSchema.parse(body);

    let existingUser;

    // Search for existing user logic
    if (parsedBody.type === 'Admin' || parsedBody.type === 'Banking Manager') {
      // Search in clients collection's Users array for Admin or Banking Manager
      const clientsCollection = mongoose.connection.collection('clients');
      existingUser = await clientsCollection.findOne({
        clientId: parsedBody.clientId,
        Users: {
          $elemMatch: {
            $or: [
              { email: parsedBody.email },
              { userName: parsedBody.userName },
              { phoneNumber: parsedBody.phoneNumber }
            ]
          }
        }
      });
    } else {
      // Search in users collection for other user types (like Client)
      existingUser = await UserModel.findOne({
        $or: [
          { email: parsedBody.email },
          { userName: parsedBody.userName },
          { phoneNumber: parsedBody.phoneNumber }
        ]
      });
    }

    // Check if an existing user is found
    if (existingUser) {
      let errorMessage = 'User with this email, username, or phone number already exists';

      if (parsedBody.type === 'Admin' || parsedBody.type === 'Banking Manager') {
        // The existing user found in the 'clients' collection Users array
        const matchingUser = existingUser.Users.find((user: any) => 
          user.email === parsedBody.email || user.userName === parsedBody.userName || user.phoneNumber === parsedBody.phoneNumber
        );
        if (matchingUser) {
          if (matchingUser.email === parsedBody.email) {
            errorMessage = 'User with this email already exists';
          } else if (matchingUser.userName === parsedBody.userName) {
            errorMessage = 'User with this username already exists';
          } else if (matchingUser.phoneNumber === parsedBody.phoneNumber) {
            errorMessage = 'User with this phone number already exists';
          }
        }
      } else {
        // Existing user in the 'users' collection
        if (existingUser.email === parsedBody.email) {
          errorMessage = 'User with this email already exists';
        } else if (existingUser.userName === parsedBody.userName) {
          errorMessage = 'User with this username already exists';
        } else if (existingUser.phoneNumber === parsedBody.phoneNumber) {
          errorMessage = 'User with this phone number already exists';
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedBody.password, salt);

    let clientId = parsedBody.clientId || null;
    console.log(clientId);

    let appPassword = '';

    // If the user is a Client, store them in both 'clients' and 'users' collection
    if (parsedBody.type === 'Client') {
      clientId = uuidv4(); // Generate a unique clientId for Clients
      appPassword = generatePin(); // Generate 8-digit pin for Client users

      // Create a new client entry in the 'clients' collection
      const newClient = {
        clientId: clientId,
        Messages: [],
        PaymentHistory: [],
        Users: [],
        BankModels: [],
        UPIModels: []
      };

      const clientsCollection = mongoose.connection.collection('clients');
      await clientsCollection.insertOne(newClient);

      console.log("New client created successfully:", newClient);

      // Now create and save the new user in the users collection
      const newUser = new UserModel({
        ...parsedBody,
        password: hashedPassword,
        clientId: clientId, // Include clientId for Client users
        appPassword: appPassword, // Set appPassword (8-digit pin) for Client
      });

      await newUser.save(); // Save the user in the users collection
      console.log("Client user saved successfully in users collection:", newUser);

      return NextResponse.json(newUser, { status: 201 });
    }

    // If the user is Admin or Banking Manager, add to 'clients' but NOT to 'users' collection
    if (parsedBody.type === 'Admin' || parsedBody.type === 'Banking Manager') {
      if (!clientId) {
        return NextResponse.json({ error: 'Client ID is required for Admin and Banking Manager' }, { status: 400 });
      }

      appPassword = generatePin();
      const newUser = new UserModel({
        ...parsedBody,
        password: hashedPassword,
        clientId: clientId, // Include clientId for Client users
        appPassword: appPassword, // Set appPassword (8-digit pin) for Client
      });

      const clientsCollection = mongoose.connection.collection('clients');
      const clientUpdateResult = await clientsCollection.updateOne(
        { clientId: clientId }, // Find the client by clientId
        { $push: { Users: newUser } }
      );

      if (clientUpdateResult.modifiedCount === 0) {
        return NextResponse.json({ error: 'Client not found or update failed' }, { status: 400 });
      }

      console.log("Admin or Banking Manager added to client's Users array successfully.");

      return NextResponse.json({ message: 'Admin/Banking Manager added successfully' }, { status: 201 });
    }

    return NextResponse.json({ message: 'Unknown user type' }, { status: 400 });
  } catch (error: any) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
