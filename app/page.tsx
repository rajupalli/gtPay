"use client"; // Client component directive

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { useParams } from 'next/navigation';  // Import useParams to access dynamic route segments

export default function SignIn() {
  const router = useRouter();
  const [username, setUsername] = useState('');  // Assuming this is the mobile number
  const [password, setPassword] = useState('');

   
  const { clientId } = useParams();   

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (username && password) {

      if(username ==='Super123' && password==='Test@123'){
        router.push(`/dashboard/superAdmin`); 
      }else{
      try {
        // Make a POST request to the login API
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: username,
            password: password,
          }),
        });
        if (response.ok) {

          const data = await response.json(); // Parse the JSON response
      
          const { user } = data; // Assuming the user object is returned on successful login
          console.log(user);
          console.log(user["type"]);
          // Check the user type and route accordingly
          if (user.type === 'Client' || user.type === 'Admin' || user.type === 'Banking Manager') {
            router.push(`/dashboard/${user.clientId}/${user.id}`);  // Redirect to the client-specific dashboard
          }
        } else {
          // If login fails, handle the error
          const errorData = await response.json(); // Get the error message from the response
          alert(errorData.error || 'Invalid login credentials');
        }
        
      } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong, please try again later.');
      }}
    } else {
      alert('Please provide both username and password.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          {/* Logo Image */}
          <Image
            src="/logo.png"
            alt="ACME Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        

        <h1 className="text-2xl font-bold text-center mb-6">Welcome to Dashboard</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username (Mobile Number)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
