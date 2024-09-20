import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number 
}

const connection: ConnectionObject = {}

export async function connectToDatabase(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }
    try {
        // console.log("hello");
        const db = await mongoose.connect(process.env.MONGODB_URI || '' , {})
        // console.log(db);
        
        connection.isConnected = db.connections[0].readyState

        // console.log("hi");
        // console.log(connection.isConnected);
        
        console.log("DB Connected Successfully!");
        
    } catch (error) {
        
        console.log("Database connection failed", error);
        
        process.exit(1)
    }
}

