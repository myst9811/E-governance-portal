import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ClipboardList, CheckCircle, AlertCircle, Loader2, ArrowLeft, Clock, XCircle } from 'lucide-react';
import { useWeb3 } from '../Web3Context';
import { useContracts } from '../useContracts';

const ServiceRequests = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const { submitServiceRequest, getServiceRequest, getUserRequests } = useContracts();

  const [submitForm, setSubmitForm] = useState({
    type: '',
    description: ''
  });

  const [requestId, setRequestId] = useState('');
  const [requestInfo, setRequestInfo] = useState<any>(null);
  const [userRequests, setUserRequests] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const requestTypes = [
    'Birth Certificate',
    'Death Certificate',
    'Marriage Certificate',
    'Property Tax',
    'Business License',
    'Building Permit',
    'Driving License',
    'Passport',
    'Voter ID',
    'Other'
  ];

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 1:
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Approved</span>;
      case 2:
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 0:
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 1:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 2:
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    if (!submitForm.type || !submitForm.description) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Submitting request to blockchain...' });

    try {
      const result = await submitServiceRequest(submitForm.type, submitForm.description);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Request submitted successfully! Transaction: ${result.txHash}`
        });
        setSubmitForm({ type: '', description: '' });
        // Reload user requests
        loadUserRequests();
      } else {
        setMessage({ type: 'error', text: `Failed to submit request: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequestDetails = async () => {
    if (!requestId) {
      setMessage({ type: 'error', text: 'Please enter a request ID' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Loading request details...' });

    try {
      const result = await getServiceRequest(parseInt(requestId));

      if (result.success) {
        setRequestInfo(result.request);
        setMessage({ type: 'success', text: 'Request details loaded successfully' });
      } else {
        setMessage({ type: 'error', text: `Failed to load request: ${result.error}` });
        setRequestInfo(null);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      setRequestInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserRequests = async () => {
    if (!account) return;

    try {
      const result = await getUserRequests(account);
      if (result.success) {
        setUserRequests(result.requestIds);
      }
    } catch (error: any) {
      console.error('Failed to load user requests:', error);
    }
  };

  useEffect(() => {
    if (account) {
      loadUserRequests();
    }
  }, [account]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-blue-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">Service Requests</h1>
          </div>
        </div>
      </header>

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
          {/* Submit Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-blue-600" />
                Submit New Request
              </CardTitle>
              <CardDescription>
                Request government services on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Type
                  </label>
                  <select
                    value={submitForm.type}
                    onChange={(e) => setSubmitForm({ ...submitForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select request type...</option>
                    {requestTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={submitForm.description}
                    onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide details about your request..."
                    rows={5}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Please include all relevant details and documents needed
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!account || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>

                {!account && (
                  <p className="text-sm text-red-600 text-center">
                    Please connect your wallet to submit requests
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Track Request */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Track Request Status
              </CardTitle>
              <CardDescription>
                Check the status of any service request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Request ID"
                  min="1"
                />
                <Button onClick={loadRequestDetails} disabled={!account || isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Track'}
                </Button>
              </div>

              {requestInfo && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">Request Details</h3>
                    {getStatusBadge(requestInfo.status)}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Requester</p>
                    <p className="font-mono text-sm">{requestInfo.requester}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Request Type</p>
                    <p className="font-medium">{requestInfo.requestType}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm">{requestInfo.description}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Submitted On</p>
                    <p className="font-medium">{formatTimestamp(requestInfo.timestamp)}</p>
                  </div>

                  {requestInfo.responseMessage && (
                    <div>
                      <p className="text-sm text-gray-600">Response</p>
                      <div className={`mt-1 p-3 rounded-lg ${
                        requestInfo.status === 1 ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <p className="text-sm">{requestInfo.responseMessage}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    {getStatusIcon(requestInfo.status)}
                    <span className="text-sm font-medium">
                      {requestInfo.status === 0 && 'Request is being processed'}
                      {requestInfo.status === 1 && 'Request has been approved'}
                      {requestInfo.status === 2 && 'Request has been rejected'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Requests */}
        {account && userRequests.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>My Requests ({userRequests.length})</CardTitle>
              <CardDescription>
                All your submitted service requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userRequests.map((id) => (
                  <div
                    key={id}
                    onClick={() => {
                      setRequestId(id.toString());
                      loadRequestDetails();
                    }}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">Request #{id}</p>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Click to view details</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparent Process</h3>
                <p className="text-sm text-gray-600">
                  Track your request status in real-time with complete transparency
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Permanent Record</h3>
                <p className="text-sm text-gray-600">
                  All requests are permanently stored on the blockchain for audit purposes
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Accountability</h3>
                <p className="text-sm text-gray-600">
                  Officials must provide reasons for approvals or rejections
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ServiceRequests;
