import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/dbConnect';
import UserModel from '../../../model/userDetails'; // Adjust the path based on where your User model is stored

// The POST method should be a named export
export async function POST(req: NextRequest) {
    const { userName, password } = await req.json();

    try {
        // Connect to the database
        await connectToDatabase();

        // Find the user by username
        const user = await UserModel.findOne({ userName });
        if (!user) {
            return NextResponse.json({ message: 'Invalid username or password' }, { status: 400 });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid username or password' }, { status: 400 });
        }

        // Generate JWT token without expiration
        const token = jwt.sign(
            { userId: user._id, userName: user.userName, type: user.type },
            process.env.ACCESS_TOKEN_SECRET as string // Use a secret key from environment variables
        );

        // Respond with the token
        return NextResponse.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
