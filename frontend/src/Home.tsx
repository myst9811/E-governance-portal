import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { User, FileText, ClipboardList, Shield, Vote, Bell, Wallet, Search, ChevronRight } from "lucide-react";

const Home = () => {
  const [connectedWallet, setConnectedWallet] = useState<string | null> (null);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const handleWalletConnect = () => {
    // Simulate wallet connection
    setConnectedWallet("0x1234...5678");
    alert("Wallet connected successfully!");
  };

  const handleSearch = () => {
    
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const services = [
    {
      icon: <User className="w-8 h-8 text-blue-600" />,
      title: "Digital Identity",
      desc: "Manage decentralized identity & KYC verification securely.",
      link: "/identity"
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-blue-600" />,
      title: "Service Requests",
      desc: "Submit and track public service requests with transparency.",
      link: "/services"
    },
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Certificates",
      desc: "Access tamper-proof digital certificates & documents.",
      link: "/certificates"
    },
    {
      icon: <Vote className="w-8 h-8 text-blue-600" />,
      title: "E-Voting",
      desc: "Participate in secure, transparent blockchain-based voting.",
      link: "/voting"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Smart Contracts",
      desc: "View and interact with government smart contracts.",
      link: "/contracts"
    },
    {
      icon: <Wallet className="w-8 h-8 text-blue-600" />,
      title: "Transactions",
      desc: "Track all your blockchain transactions and history.",
      link: "/transactions"
    }
  ];

  const recentUpdates = [
    { title: "New voting session opened", time: "2 hours ago", type: "vote" },
    { title: "Certificate issued: Birth Certificate", time: "1 day ago", type: "document" },
    { title: "Service request approved", time: "3 days ago", type: "service" }
  ];

  const stats = [
    { label: "Total Users", value: "50,000+", icon: <User className="w-6 h-6" /> },
    { label: "Active Votes", value: "12", icon: <Vote className="w-6 h-6" /> },
    { label: "Certificates Issued", value: "125,000+", icon: <FileText className="w-6 h-6" /> },
    { label: "Smart Contracts", value: "45", icon: <Shield className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">eGov Portal</h1>
            
            <nav className="hidden md:flex space-x-6 font-medium">
              <a href="#" className="hover:text-blue-200 transition">Home</a>
              <a href="#services" className="hover:text-blue-200 transition">Services</a>
              <a href="#" className="hover:text-blue-200 transition">Contact</a>
              <a href="#" className="hover:text-blue-200 transition">Voting</a>
            </nav>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-blue-700 rounded-full transition">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              {connectedWallet ? (
                <div className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-lg">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">{connectedWallet}</span>
                </div>
              ) : (
                <Button 
                  onClick={handleWalletConnect}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-gradient-to-br from-blue-50 to-white py-20 px-6">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              Welcome to the eGov Portal
            </h2>

            <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
              A blockchain-powered governance system ensuring{" "}
              <span className="font-semibold text-blue-600">transparency</span>,{" "}
              <span className="font-semibold text-blue-600">accountability</span>, and{" "}
              <span className="font-semibold text-blue-600">accessibility</span> for all citizens.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search services, certificates, or transactions..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="px-6">
                  Search
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <Card key={idx} className="border-none shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-2 text-blue-600">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Our Services
            </h3>
            <p className="text-gray-600 text-center mb-10">
              Explore our blockchain-powered government services
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, idx) => (
                <Card 
                  key={idx}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500"
                >
                  <CardContent className="p-6">
                    <div className="mb-4">{service.icon}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h4>
                    <p className="text-gray-600 mb-4">{service.desc}</p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                      Learn more <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Recent Updates */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Recent Updates
                </h3>
                <div className="space-y-4">
                  {recentUpdates.map((update, idx) => (
                    <Card key={idx} className="hover:shadow-md transition">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {update.type === "vote" && <Vote className="w-5 h-5 text-blue-600" />}
                          {update.type === "document" && <FileText className="w-5 h-5 text-blue-600" />}
                          {update.type === "service" && <ClipboardList className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{update.title}</p>
                          <p className="text-sm text-gray-500">{update.time}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start text-left h-auto py-4" variant="outline">
                    <Vote className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-semibold">Cast Your Vote</div>
                      <div className="text-xs text-gray-500">Active elections available</div>
                    </div>
                  </Button>
                  <Button className="w-full justify-start text-left h-auto py-4" variant="outline">
                    <FileText className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-semibold">Request Certificate</div>
                      <div className="text-xs text-gray-500">Get verified documents</div>
                    </div>
                  </Button>
                  <Button className="w-full justify-start text-left h-auto py-4" variant="outline">
                    <ClipboardList className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-semibold">Submit Service Request</div>
                      <div className="text-xs text-gray-500">Track your requests</div>
                    </div>
                  </Button>
                  <Button className="w-full justify-start text-left h-auto py-4" variant="outline">
                    <Shield className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-semibold">Verify Document</div>
                      <div className="text-xs text-gray-500">Check authenticity</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">eGov Portal</h4>
              <p className="text-sm">
                Blockchain-powered governance for a transparent future.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Digital Identity</a></li>
                <li><a href="#" className="hover:text-white transition">E-Voting</a></li>
                <li><a href="#" className="hover:text-white transition">Certificates</a></li>
                <li><a href="#" className="hover:text-white transition">Smart Contracts</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} eGov Portal. All rights reserved. Powered by Blockchain Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;