import { NextResponse } from 'next/server';
import UserModel from '@/model/userDetails';  // Ensure this path is correct
import { userSchema } from '@/schemas/userSchema';  // Ensure this path is correct
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/dbConnect';
import { v4 as uuidv4 } from 'uuid';

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
    // Log incoming request body for debugging
    const body = await request.json();
    console.log("Received request body:", body);
    await connectToDatabase();
    
    // Validate the request body using Zod schema
    const parsedBody = userSchema.parse(body);

    // Log parsed body to ensure it's valid
    console.log("Parsed body:", parsedBody);

    // Check if a user with the same email, username, or phone number already exists
    const existingUser = await UserModel.findOne({
      $or: [
        { email: parsedBody.email },
        { userName: parsedBody.userName },
        { phoneNumber: parsedBody.phoneNumber }
      ]
    });

    // If a user already exists, determine which field caused the conflict
    if (existingUser) {
      let errorMessage = 'User with this email, username, or phone number already exists';
      
      // Check for specific conflicts and set a detailed error message
      if (existingUser.email === parsedBody.email) {
        errorMessage = 'User with this email already exists';
      } else if (existingUser.userName === parsedBody.userName) {
        errorMessage = 'User with this username already exists';
      } else if (existingUser.phoneNumber === parsedBody.phoneNumber) {
        errorMessage = 'User with this phone number already exists';
      }

      console.log("User already exists:", existingUser);
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedBody.password, salt);

    // Determine if the user is a client and assign a clientId if needed
    let clientId = null; // Default to null for non-client users
    let appPassword = ''; // Default empty string for non-client users
    
    if (parsedBody.type === 'Client') {
      clientId = uuidv4(); // Generate a unique clientId for Client users
      appPassword = generatePin(); // Generate 8-digit pin for Client users
    }

    // Create a new user
    const newUser = new UserModel({
      ...parsedBody,
      password: hashedPassword,
      clientId: clientId, // Only include clientId for Client users, otherwise null
      appPassword: appPassword, // Set appPassword (8-digit pin) if the user is a Client
    });

    // Save the new user
    await newUser.save();

    // Log success
    console.log("User saved successfully:", newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    // Log any errors that occur during the request processing
    console.error("Error adding user:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}