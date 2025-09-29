import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { User, FileText, ClipboardList } from "lucide-react";

const Home: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const handleClick = (): void => {
    const newMessage = "Hello from eGov Portal!";
    setMessage(newMessage);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">eGov Portal</h1>
          <User></User>
          <nav className="space-x-6 font-medium">
            <a href="#" className="hover:underline">Home</a>
            <br />
            <a href="#" className="hover:underline">Services</a>
           <br />
            <a href="#" className="hover:underline">Contact</a>
            <br />
            <a href="#" className="hover:underline">Voting</a>
            <br />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          className="text-5xl font-extrabold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome to the eGov Portal
        </motion.h2>

        <motion.p
          className="text-gray-700 max-w-xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          A blockchain-powered governance system ensuring <span className="font-semibold">transparency</span>,
          <span className="font-semibold"> accountability</span>, and <span className="font-semibold">accessibility</span> for all citizens.
        </motion.p>

        <Button onClick={handleClick} className="px-6 py-3 text-lg shadow-md">
          Get Started
        </Button>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mt-6 max-w-md shadow-xl border border-green-200">
              <CardContent>
                <p className="text-green-700 font-semibold">{message}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Services Section */}
        <section className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl">
          {[
            { title: "Digital Identity", desc: "Manage decentralized identity & KYC verification securely." },
            { title: "Service Requests", desc: "Submit and track public service requests with transparency." },
            { title: "Certificates", desc: "Access tamper-proof digital certificates & documents." },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-2xl shadow-md border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-blue-700">{service.title}</h3>
              <p className="mt-2 text-gray-600">{service.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-6 text-gray-600 text-center mt-12">
        <p>© {new Date().getFullYear()} eGov Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
