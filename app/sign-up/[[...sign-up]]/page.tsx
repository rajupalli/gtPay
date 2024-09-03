import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left Section for Video */}
      <div className="relative flex-1 hidden md:block">
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
          <source src="/payment.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right Section for Sign-In Form */}
      <div className="flex-1 flex items-center justify-center bg-custom-gradient p-6  w-full md:w-1/2 h-screen md:h-auto">
        <SignUp />;
      </div>
    </div>
  )
}
