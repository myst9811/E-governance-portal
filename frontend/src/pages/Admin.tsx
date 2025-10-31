import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Shield, CheckCircle, AlertCircle, Loader2, User, FileText, XCircle } from 'lucide-react';
import { useWeb3 } from '../Web3Context';
import { useContracts } from '../useContracts';
import Header from '../../components/Header';

const Admin = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const { verifyCitizen, approveServiceRequest, rejectServiceRequest, getServiceRequest } = useContracts();

  const [verifyCitizenAddress, setVerifyCitizenAddress] = useState('');
  const [requestId, setRequestId] = useState('');
  const [approvalMessage, setApprovalMessage] = useState('');
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [requestDetails, setRequestDetails] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleVerifyCitizen = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    if (!verifyCitizenAddress) {
      setMessage({ type: 'error', text: 'Please enter a citizen address' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Verifying citizen on blockchain...' });

    try {
      const result = await verifyCitizen(verifyCitizenAddress);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Citizen verified successfully! Transaction: ${result.txHash}`
        });
        setVerifyCitizenAddress('');
      } else {
        setMessage({ type: 'error', text: `Verification failed: ${result.error}` });
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
        setRequestDetails(result.request);
        setMessage({ type: 'success', text: 'Request details loaded successfully' });
      } else {
        setMessage({ type: 'error', text: `Failed to load request: ${result.error}` });
        setRequestDetails(null);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      setRequestDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async () => {
    if (!requestId || !approvalMessage) {
      setMessage({ type: 'error', text: 'Please provide request ID and approval message' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Approving request on blockchain...' });

    try {
      const result = await approveServiceRequest(parseInt(requestId), approvalMessage);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Request approved successfully! Transaction: ${result.txHash}`
        });
        setRequestId('');
        setApprovalMessage('');
        setRequestDetails(null);
      } else {
        setMessage({ type: 'error', text: `Approval failed: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!requestId || !rejectionMessage) {
      setMessage({ type: 'error', text: 'Please provide request ID and rejection reason' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Rejecting request on blockchain...' });

    try {
      const result = await rejectServiceRequest(parseInt(requestId), rejectionMessage);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Request rejected successfully! Transaction: ${result.txHash}`
        });
        setRequestId('');
        setRejectionMessage('');
        setRequestDetails(null);
      } else {
        setMessage({ type: 'error', text: `Rejection failed: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="admin" />

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Administrator Access</p>
              <p className="text-sm text-yellow-800">
                Only the contract deployer/admin can perform these actions. Ensure you're connected with the admin wallet.
              </p>
            </div>
          </div>
        </div>

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
          {/* Verify Citizen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Verify Citizen Identity
              </CardTitle>
              <CardDescription>
                Approve a citizen's identity registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyCitizen} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Citizen Wallet Address
                  </label>
                  <input
                    type="text"
                    value={verifyCitizenAddress}
                    onChange={(e) => setVerifyCitizenAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0x..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the wallet address of the citizen to verify
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Citizen
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Manage Service Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Manage Service Requests
              </CardTitle>
              <CardDescription>
                View and process pending service requests
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
                <Button
                  onClick={loadRequestDetails}
                  disabled={!account || isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load'}
                </Button>
              </div>

              {requestDetails && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">Request #{requestId}</h3>
                      {getStatusBadge(requestDetails.status)}
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Requester</p>
                      <p className="font-mono text-xs">{requestDetails.requester}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Request Type</p>
                      <p className="font-medium">{requestDetails.requestType}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-sm">{requestDetails.description}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Submitted On</p>
                      <p className="font-medium text-sm">{formatTimestamp(requestDetails.timestamp)}</p>
                    </div>
                  </div>

                  {requestDetails.status === 0 && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Approval Message
                        </label>
                        <textarea
                          value={approvalMessage}
                          onChange={(e) => setApprovalMessage(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Enter approval message..."
                          rows={2}
                        />
                      </div>

                      <Button
                        onClick={handleApproveRequest}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isLoading || !approvalMessage}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Request
                          </>
                        )}
                      </Button>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason
                        </label>
                        <textarea
                          value={rejectionMessage}
                          onChange={(e) => setRejectionMessage(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Enter reason for rejection..."
                          rows={2}
                        />
                      </div>

                      <Button
                        onClick={handleRejectRequest}
                        variant="destructive"
                        className="w-full"
                        disabled={isLoading || !rejectionMessage}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject Request
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {requestDetails.status !== 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-2">Response:</p>
                      <p className="text-sm text-gray-700">{requestDetails.responseMessage}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Admin Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Admin Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Identity Verification
                </h3>
                <p className="text-sm text-gray-600">
                  Review and verify citizen identity registrations to ensure authenticity and prevent fraud
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Request Management
                </h3>
                <p className="text-sm text-gray-600">
                  Process service requests by approving or rejecting with detailed explanations
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Accountability
                </h3>
                <p className="text-sm text-gray-600">
                  All admin actions are recorded on the blockchain ensuring transparency and accountability
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
