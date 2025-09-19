import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const handleClick = (): void => {
    const newMessage = "Hello from eGov Portal!";
    setMessage(newMessage);
    alert(newMessage);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">eGov Portal</h1>
          <nav className="space-x-4">
            <a href="#" className="hover:underline">
              Home
            </a>
            <a href="#" className="hover:underline">
              Services
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to the eGov Portal
        </h2>
        <p className="text-gray-600 max-w-xl mb-6">
          A blockchain-based governance system ensuring transparency,
          accountability, and accessibility for all citizens.
        </p>

        <Button onClick={handleClick}>Click Me</Button>

        {message && (
          <Card className="mt-6 max-w-md shadow-lg">
            <CardContent>
              <p className="text-green-700 font-medium">{message}</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-600 py-4 text-center">
        <p>© {new Date().getFullYear()} eGov Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
