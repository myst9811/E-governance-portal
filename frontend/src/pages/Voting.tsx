import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Vote, CheckCircle, AlertCircle, Loader2, Plus, X } from 'lucide-react';
import { useWeb3 } from '../Web3Context';
import { useContracts } from '../useContracts';
import Header from '../../components/Header';

const Voting = () => {
  const navigate = useNavigate();
  const { account } = useWeb3();
  const { createVote, castVote, getVote, getVoteResults, hasUserVoted, isVoteActive } = useContracts();

  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    options: ['', ''],
    durationInDays: '7'
  });

  const [voteId, setVoteId] = useState('');
  const [voteInfo, setVoteInfo] = useState<any>(null);
  const [voteResults, setVoteResults] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [hasVoted, setHasVoted] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const addOption = () => {
    setCreateForm({ ...createForm, options: [...createForm.options, ''] });
  };

  const removeOption = (index: number) => {
    if (createForm.options.length > 2) {
      const newOptions = createForm.options.filter((_, i) => i !== index);
      setCreateForm({ ...createForm, options: newOptions });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...createForm.options];
    newOptions[index] = value;
    setCreateForm({ ...createForm, options: newOptions });
  };

  const handleCreateVote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    const validOptions = createForm.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setMessage({ type: 'error', text: 'Please provide at least 2 options' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Creating vote on blockchain...' });

    try {
      const result = await createVote(
        createForm.title,
        createForm.description,
        validOptions,
        parseInt(createForm.durationInDays)
      );

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Vote created successfully! Transaction: ${result.txHash}`
        });
        setCreateForm({ title: '', description: '', options: ['', ''], durationInDays: '7' });
      } else {
        setMessage({ type: 'error', text: `Failed to create vote: ${result.error}` });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const loadVoteDetails = async () => {
    if (!voteId || !account) return;

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Loading vote details...' });

    try {
      const voteResult = await getVote(parseInt(voteId));
      if (!voteResult.success) {
        setMessage({ type: 'error', text: `Failed to load vote: ${voteResult.error}` });
        return;
      }

      const resultsData = await getVoteResults(parseInt(voteId));
      const hasVotedData = await hasUserVoted(parseInt(voteId), account);
      const activeData = await isVoteActive(parseInt(voteId));

      setVoteInfo(voteResult.vote);
      setVoteResults(resultsData.success ? resultsData.results : []);
      setHasVoted(hasVotedData.success ? hasVotedData.hasVoted : false);
      setIsActive(activeData.success ? activeData.isActive : false);
      setMessage({ type: 'success', text: 'Vote details loaded successfully' });
    } catch (error: any) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCastVote = async () => {
    if (!account) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    if (selectedOption === -1) {
      setMessage({ type: 'error', text: 'Please select an option' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Casting your vote...' });

    try {
      const result = await castVote(parseInt(voteId), selectedOption);

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Vote cast successfully! Transaction: ${result.txHash}`
        });
        setSelectedOption(-1);
        // Reload vote details
        await loadVoteDetails();
      } else {
        setMessage({ type: 'error', text: `Failed to cast vote: ${result.error}` });
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

  const getTotalVotes = () => {
    return voteResults.reduce((sum, count) => sum + count, 0);
  };

  const getPercentage = (votes: number) => {
    const total = getTotalVotes();
    return total > 0 ? ((votes / total) * 100).toFixed(1) : '0';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="voting" />

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
          {/* Create Vote Form (Admin Only) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Create New Vote
              </CardTitle>
              <CardDescription>
                Start a new voting session (Admin only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateVote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vote Title
                  </label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., City Budget Allocation 2025"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the purpose of this vote..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {createForm.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${index + 1}`}
                          required
                        />
                        {createForm.options.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeOption(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    value={createForm.durationInDays}
                    onChange={(e) => setCreateForm({ ...createForm, durationInDays: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="365"
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
                      Creating...
                    </>
                  ) : (
                    'Create Vote'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* View & Cast Vote */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="w-6 h-6 text-blue-600" />
                View & Cast Vote
              </CardTitle>
              <CardDescription>
                Participate in ongoing votes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={voteId}
                  onChange={(e) => setVoteId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Vote ID"
                  min="1"
                />
                <Button onClick={loadVoteDetails} disabled={!account || isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load'}
                </Button>
              </div>

              {voteInfo && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{voteInfo.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{voteInfo.description}</p>
                    <p className="text-xs text-gray-500">
                      Ends: {formatTimestamp(voteInfo.endTime)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Total Votes: {getTotalVotes()}
                    </p>
                  </div>

                  {!hasVoted && isActive ? (
                    <div className="space-y-3">
                      <p className="font-medium text-sm">Select your choice:</p>
                      {voteInfo.options.map((option: string, index: number) => (
                        <label
                          key={index}
                          className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                            selectedOption === index
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="vote-option"
                            checked={selectedOption === index}
                            onChange={() => setSelectedOption(index)}
                            className="w-4 h-4"
                          />
                          <span className="flex-1">{option}</span>
                          {voteResults[index] !== undefined && (
                            <span className="text-sm text-gray-600">
                              {voteResults[index]} votes ({getPercentage(voteResults[index])}%)
                            </span>
                          )}
                        </label>
                      ))}
                      <Button
                        onClick={handleCastVote}
                        className="w-full"
                        disabled={isLoading || selectedOption === -1}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Casting Vote...
                          </>
                        ) : (
                          'Cast My Vote'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Results:</p>
                      {voteInfo.options.map((option: string, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{option}</span>
                            <span className="text-sm text-gray-600">
                              {voteResults[index] || 0} votes ({getPercentage(voteResults[index] || 0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${getPercentage(voteResults[index] || 0)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      {hasVoted && (
                        <p className="text-sm text-green-600 font-medium mt-2">
                          ✓ You have already voted in this session
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About E-Voting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparent</h3>
                <p className="text-sm text-gray-600">
                  All votes are recorded on the blockchain, ensuring complete transparency
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                <p className="text-sm text-gray-600">
                  One vote per wallet, cryptographically secured and tamper-proof
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Verifiable</h3>
                <p className="text-sm text-gray-600">
                  Anyone can verify the results independently without trusting intermediaries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Voting;
