import * as React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { User, FileText, ClipboardList, Shield, Vote, Search, ChevronRight, Wallet, TrendingUp, Check } from "lucide-react";
import { useWeb3 } from "./Web3Context";
import Header from "../components/Header";

const Home = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();

  const [searchQuery, setSearchQuery] = useState("");
  const [stats] = useState({
    totalUsers: "2,500+",
    activeVotes: "12",
    certificatesIssued: "8,450",
    smartContracts: "4"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const services = [
    {
      icon: <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
      title: "Digital Identity",
      desc: "Secure, decentralized identity management with blockchain verification.",
      link: "/identity",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ClipboardList className="w-10 h-10 text-purple-600 dark:text-purple-400" />,
      title: "Service Requests",
      desc: "Track and manage public service requests with full transparency.",
      link: "/services",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FileText className="w-10 h-10 text-green-600 dark:text-green-400" />,
      title: "Certificates",
      desc: "Access tamper-proof digital certificates stored on blockchain.",
      link: "/certificates",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Vote className="w-10 h-10 text-orange-600 dark:text-orange-400" />,
      title: "E-Voting",
      desc: "Participate in transparent, secure blockchain-based elections.",
      link: "/voting",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
      title: "Admin Dashboard",
      desc: "Manage identities, certificates, and service requests efficiently.",
      link: "/admin",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Wallet className="w-10 h-10 text-teal-600 dark:text-teal-400" />,
      title: "My Account",
      desc: "View your registrations, certificates, and activity history.",
      link: "/identity",
      gradient: "from-teal-500 to-cyan-500"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Blockchain Security",
      desc: "Immutable records protected by cryptographic security"
    },
    {
      icon: <Check className="w-6 h-6 text-green-600 dark:text-green-400" />,
      title: "Full Transparency",
      desc: "All transactions are publicly verifiable and auditable"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: "Decentralized",
      desc: "No single point of failure or control"
    }
  ];

  const statsData = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <User className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Active Votes",
      value: stats.activeVotes,
      icon: <Vote className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      label: "Certificates Issued",
      value: stats.certificatesIssued,
      icon: <FileText className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      label: "Smart Contracts",
      value: stats.smartContracts,
      icon: <Shield className="w-8 h-8" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-950 dark:to-gray-900">
      <Header currentPage="home" />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-6">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto max-w-6xl text-center relative z-10">
            <div className="animate-fade-in">
              <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                Welcome to the
                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  eGov Blockchain Portal
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Experience government services powered by blockchain technology, ensuring{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">transparency</span>,{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">security</span>, and{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">accessibility</span>{" "}
                for all citizens.
              </p>

              {/* Connection Alert */}
              {!account && (
                <div className="max-w-2xl mx-auto mb-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl animate-slide-up">
                  <p className="text-sm text-amber-900 dark:text-amber-300">
                    <span className="font-semibold">👉 Connect your wallet</span> to access all features and services.
                  </p>
                </div>
              )}

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 animate-slide-up">
                <div className="flex gap-3">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search services, certificates, or transactions..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Search
                  </Button>
                </div>
              </form>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {statsData.map((stat, idx) => (
                  <Card
                    key={idx}
                    className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in bg-white dark:bg-gray-800"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white mb-3`}>
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white dark:bg-gray-900/50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-950 dark:to-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Services
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Explore our blockchain-powered government services
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, idx) => (
                <Card
                  key={idx}
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 overflow-hidden bg-white dark:bg-gray-800 animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                  onClick={() => {
                    if (!account) {
                      alert('Please connect your wallet to access this service');
                    } else {
                      navigate(service.link);
                    }
                  }}
                >
                  <div className={`h-2 bg-gradient-to-r ${service.gradient}`}></div>
                  <CardContent className="p-6">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">{service.desc}</p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                      <span>Learn more</span>
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🏛️</span>
                eGov Portal
              </h4>
              <p className="text-sm text-gray-400">
                Blockchain-powered governance for a transparent future.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('/identity')} className="hover:text-white transition">Digital Identity</button></li>
                <li><button onClick={() => navigate('/voting')} className="hover:text-white transition">E-Voting</button></li>
                <li><button onClick={() => navigate('/certificates')} className="hover:text-white transition">Certificates</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-white transition">Service Requests</button></li>
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
            <p>© {new Date().getFullYear()} eGov Portal. All rights reserved. Powered by Blockchain Technology. 🔗</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
