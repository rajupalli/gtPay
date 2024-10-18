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

 
      // Search in users collection for other user types (like Client)
      existingUser = await UserModel.findOne({
        $or: [
          { email: parsedBody.email },
          { userName: parsedBody.userName },
          { phoneNumber: parsedBody.phoneNumber }
        ]
      });
    

    // Check if an existing user is found
    if (existingUser) {
      let errorMessage = 'User with this email, username, or phone number already exists';

   
        // Existing user in the 'users' collection
        if (existingUser.email === parsedBody.email) {
          errorMessage = 'User with this email already exists';
        } else if (existingUser.userName === parsedBody.userName) {
          errorMessage = 'User with this username already exists';
        } else if (existingUser.phoneNumber === parsedBody.phoneNumber) {
          errorMessage = 'User with this phone number already exists';
        }
      

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

   
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
        ClientAdmin: [],
        BankModels: [],
        UPIModels: []
      };

      const clientsCollection = mongoose.connection.collection('clients');
      await clientsCollection.insertOne(newClient);

      console.log("New client created successfully:", newClient);

      // Now create and save the new user in the users collection
      const newUser = new UserModel({
        ...parsedBody,
        password: parsedBody.password,
        clientId: clientId, // Include clientId for Client users
        appPassword: appPassword, // Set appPassword (8-digit pin) for Client
      });

      await newUser.save(); // Save the user in the users collection
      console.log("Client user saved successfully in users collection:", newUser);

      return NextResponse.json(newUser, { status: 201 });
    }else{

    }

    return NextResponse.json({ message: 'Unknown user type' }, { status: 400 });
  } catch (error: any) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
   
    const body = await request.json();

    const id = body.id;
    console.log(id);
    await connectToDatabase();
    const parsedBody = userSchema.parse(body);
    
    // Find the user by ID
    const existingUser = await UserModel.findById(id);

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for duplicate email, username, or phoneNumber, excluding the current user
    const duplicateUser = await UserModel.findOne({
      $or: [
        { email: parsedBody.email },
        { userName: parsedBody.userName },
        { phoneNumber: parsedBody.phoneNumber }
      ],
      _id: { $ne: id }, // Exclude the current user from the search
    });

    if (duplicateUser) {
      let errorMessage = 'Another user with this email, username, or phone number already exists';

      if (duplicateUser.email === parsedBody.email) {
        errorMessage = 'Another user with this email already exists';
      } else if (duplicateUser.userName === parsedBody.userName) {
        errorMessage = 'Another user with this username already exists';
      } else if (duplicateUser.phoneNumber === parsedBody.phoneNumber) {
        errorMessage = 'Another user with this phone number already exists';
      }

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Hash password if it is being updated
    let updatedPassword = existingUser.password;
    if (parsedBody.password && parsedBody.password !== existingUser.password) {
      updatedPassword = await bcrypt.hash(parsedBody.password, 10);
    }

    // Update user fields
    existingUser.name = parsedBody.name;
    existingUser.companyName = parsedBody.companyName;
    existingUser.userName = parsedBody.userName;
    existingUser.password = updatedPassword;
    existingUser.email = parsedBody.email;
    existingUser.phoneNumber = parsedBody.phoneNumber;
    existingUser.alternateNumber = parsedBody.alternateNumber || existingUser.alternateNumber;
    
    existingUser.clientId = parsedBody.clientId || existingUser.clientId;
    existingUser.appPassword = parsedBody.appPassword;
     

    // Save updated user in the database
    await existingUser.save();

    return NextResponse.json({ message: 'User updated successfully', user: existingUser }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}