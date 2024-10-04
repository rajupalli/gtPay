import { NextResponse } from 'next/server';
import UserModel from '@/model/userDetails';  // Ensure this path is correct
import { userSchema } from '@/schemas/userSchema';  // Ensure this path is correct
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/dbConnect';



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

    // Check if a user with the same email or username already exists
    const existingUser = await UserModel.findOne({ 
      $or: [{ email: parsedBody.email }, { userName: parsedBody.userName }] 
    });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return NextResponse.json({ error: 'User with this email or username already exists' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedBody.password, salt);

    // Log hashed password
    console.log("Hashed password:", hashedPassword);

    // Create a new user
    const newUser = new UserModel({
      ...parsedBody,
      password: hashedPassword,
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
