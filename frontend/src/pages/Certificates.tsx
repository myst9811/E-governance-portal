import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { FileText, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import { useWeb3 } from '../Web3Context';
import { useContracts } from '../useContracts';
import Header from '../../components/Header';

const Certificates = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const { issueCertificate, verifyCertificate, getCertificate } = useContracts();

  const [issueForm, setIssueForm] = useState({
    recipient: '',
    type: '',
    documentHash: ''
  });

  const [verifyId, setVerifyId] = useState('');
  const [certificateInfo, setCertificateInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const certificateTypes = [
    'Birth Certificate',
    'Education Certificate',
    'Employment Certificate',
    'Residence Certificate',
    'Character Certificate',
    'Income Certificate'
  ];

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    if (!issueForm.recipient || !issueForm.type || !issueForm.documentHash) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Issuing certificate on blockchain...' });

    try {
      const result = await issueCertificate(
        issueForm.recipient,
        issueForm.type,
        issueForm.documentHash
      );

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Certificate issued successfully! Transaction: ${result.txHash}`
        });
        setIssueForm({ recipient: '', type: '', documentHash: '' });
      } else {
        setMessage({ type: 'error', text: `Failed to issue certificate: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCertificate = async () => {
    if (!verifyId) {
      setMessage({ type: 'error', text: 'Please enter a certificate ID' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Verifying certificate...' });

    try {
      const verifyResult = await verifyCertificate(parseInt(verifyId));

      if (!verifyResult.success) {
        setMessage({ type: 'error', text: `Verification failed: ${verifyResult.error}` });
        setCertificateInfo(null);
        setIsLoading(false);
        return;
      }

      if (!verifyResult.isValid) {
        setMessage({ type: 'error', text: 'This certificate is not valid or has been revoked' });
        setCertificateInfo(null);
        setIsLoading(false);
        return;
      }

      const certResult = await getCertificate(parseInt(verifyId));

      if (certResult.success) {
        setCertificateInfo(certResult.certificate);
        setMessage({ type: 'success', text: 'Certificate is valid and verified!' });
      } else {
        setMessage({ type: 'error', text: `Failed to retrieve certificate: ${certResult.error}` });
        setCertificateInfo(null);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      setCertificateInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="certificates" />

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
          {/* Issue Certificate Form (Admin Only) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Issue Certificate
              </CardTitle>
              <CardDescription>
                Create a tamper-proof digital certificate (Admin only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIssueCertificate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={issueForm.recipient}
                    onChange={(e) => setIssueForm({ ...issueForm, recipient: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0x..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificate Type
                  </label>
                  <select
                    value={issueForm.type}
                    onChange={(e) => setIssueForm({ ...issueForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select type...</option>
                    {certificateTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Hash (IPFS or SHA-256)
                  </label>
                  <input
                    type="text"
                    value={issueForm.documentHash}
                    onChange={(e) => setIssueForm({ ...issueForm, documentHash: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="QmHash... or 0x..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload document to IPFS and enter the hash
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
                      Issuing...
                    </>
                  ) : (
                    'Issue Certificate'
                  )}
                </Button>

                {!account && (
                  <p className="text-sm text-red-600 text-center">
                    Please connect your wallet to issue certificates
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Verify Certificate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Verify Certificate
              </CardTitle>
              <CardDescription>
                Check authenticity and validity of any certificate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate ID
                </label>
                <input
                  type="number"
                  value={verifyId}
                  onChange={(e) => setVerifyId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter certificate ID"
                  min="1"
                />
              </div>

              <Button
                onClick={handleVerifyCertificate}
                className="w-full"
                disabled={!account || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Certificate'
                )}
              </Button>

              {certificateInfo && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Certificate Details</h3>
                    {certificateInfo.isValid ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Valid
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Revoked
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Recipient</p>
                    <p className="font-mono text-sm">{certificateInfo.recipient}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{certificateInfo.certificateType}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Document Hash</p>
                    <p className="font-mono text-xs break-all">{certificateInfo.documentHash}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Issued On</p>
                    <p className="font-medium">{formatTimestamp(certificateInfo.timestamp)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About Digital Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tamper-Proof</h3>
                <p className="text-sm text-gray-600">
                  Once issued, certificates cannot be altered or forged, ensuring authenticity
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Verification</h3>
                <p className="text-sm text-gray-600">
                  Anyone can verify a certificate instantly using just the certificate ID
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Permanent Record</h3>
                <p className="text-sm text-gray-600">
                  Certificates are stored permanently on the blockchain with full audit trail
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Certificates;
