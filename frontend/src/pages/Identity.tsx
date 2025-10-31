import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWeb3 } from '../Web3Context';
import { useContracts } from '../useContracts';
import Header from '../../components/Header';

const Identity = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const { registerCitizen, getCitizen, isRegistered } = useContracts();

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    nationalId: ''
  });

  const [citizenInfo, setCitizenInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [checkAddress, setCheckAddress] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    if (!formData.name || !formData.dob || !formData.nationalId) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Submitting registration to blockchain...' });

    try {
      const result = await registerCitizen(formData.name, formData.dob, formData.nationalId);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Registration successful! Transaction: ${result.txHash}`
        });
        setFormData({ name: '', dob: '', nationalId: '' });
      } else {
        setMessage({ type: 'error', text: `Registration failed: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckCitizen = async () => {
    const addressToCheck = checkAddress || account;

    if (!addressToCheck) {
      setMessage({ type: 'error', text: 'Please provide an address to check' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Fetching citizen information...' });

    try {
      const registeredResult = await isRegistered(addressToCheck);

      if (!registeredResult.success || !registeredResult.registered) {
        setMessage({ type: 'info', text: 'This address is not registered' });
        setCitizenInfo(null);
        setIsLoading(false);
        return;
      }

      const result = await getCitizen(addressToCheck);

      if (result.success) {
        setCitizenInfo(result.citizen);
        setMessage({ type: 'success', text: 'Citizen information retrieved successfully' });
      } else {
        setMessage({ type: 'error', text: `Failed to retrieve information: ${result.error}` });
        setCitizenInfo(null);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      setCitizenInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="identity" />

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Register as Citizen
              </CardTitle>
              <CardDescription>
                Create your decentralized identity on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National ID (Aadhaar/SSN/Passport)
                  </label>
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="AADHAAR123456789"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!account || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Register Identity'
                  )}
                </Button>

                {!account && (
                  <p className="text-sm text-red-600 text-center">
                    Please connect your wallet to register
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Check Citizen Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Check Citizen Information
              </CardTitle>
              <CardDescription>
                Verify identity registration and verification status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address (leave empty to check your own)
                </label>
                <input
                  type="text"
                  value={checkAddress}
                  onChange={(e) => setCheckAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                />
              </div>

              <Button
                onClick={handleCheckCitizen}
                className="w-full"
                disabled={!account || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Status'
                )}
              </Button>

              {citizenInfo && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-2">Citizen Information</h3>

                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{citizenInfo.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{citizenInfo.dob}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">National ID</p>
                    <p className="font-medium">{citizenInfo.nationalId}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Verification Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {citizenInfo.verified ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <span className="font-medium text-yellow-600">Pending Verification</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Digital Identity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Decentralized</h3>
                <p className="text-sm text-gray-600">
                  Your identity is stored on the blockchain, giving you full control over your data
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                <p className="text-sm text-gray-600">
                  Cryptographically secured and immutable once verified by authorities
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparent</h3>
                <p className="text-sm text-gray-600">
                  Anyone can verify your identity status, ensuring trust and accountability
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Identity;
