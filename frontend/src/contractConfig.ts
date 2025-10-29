// Contract addresses - Update these after deploying your contracts
export const CONTRACT_ADDRESSES = {
  IDENTITY: import.meta.env.VITE_IDENTITY_CONTRACT || "",
  CERTIFICATES: import.meta.env.VITE_CERTIFICATES_CONTRACT || "",
  VOTING: import.meta.env.VITE_VOTING_CONTRACT || "",
  SERVICE_REQUESTS: import.meta.env.VITE_SERVICE_REQUESTS_CONTRACT || "",
} as const;

// Contract ABIs - Updated to match deployed contracts
export const CONTRACT_ABIS = {
  IDENTITY: [
    "function registerCitizen(string memory _name, string memory _dob, string memory _nationalId) external",
    "function verifyCitizen(address _citizen) external",
    "function getCitizen(address _citizen) external view returns (string memory, string memory, string memory, bool)",
    "function registered(address) external view returns (bool)",
    "function admin() external view returns (address)",
    "event CitizenRegistered(address indexed user, string name)",
    "event CitizenVerified(address indexed user, bool status)"
  ],
  CERTIFICATES: [
    "function issueCertificate(address _recipient, string memory _certificateType, string memory _documentHash) external returns (uint256)",
    "function verifyCertificate(uint256 _certificateId) external view returns (bool)",
    "function getCertificate(uint256 _certificateId) external view returns (address, string memory, string memory, uint256, bool)",
    "function revokeCertificate(uint256 _certificateId) external",
    "function getTotalCertificates() external view returns (uint256)",
    "function admin() external view returns (address)",
    "event CertificateIssued(uint256 indexed certificateId, address indexed recipient, string certificateType, uint256 timestamp)",
    "event CertificateRevoked(uint256 indexed certificateId, uint256 timestamp)"
  ],
  VOTING: [
    "function createVote(string memory _title, string memory _description, string[] memory _options, uint256 _durationInDays) external returns (uint256)",
    "function castVote(uint256 _voteId, uint256 _optionIndex) external",
    "function closeVote(uint256 _voteId) external",
    "function getVoteResults(uint256 _voteId) external view returns (uint256[] memory)",
    "function getVote(uint256 _voteId) external view returns (string memory, string memory, string[] memory, uint256, bool)",
    "function hasUserVoted(uint256 _voteId, address _voter) external view returns (bool)",
    "function isVoteActive(uint256 _voteId) external view returns (bool)",
    "function getTotalVotes() external view returns (uint256)",
    "function admin() external view returns (address)",
    "event VoteCreated(uint256 indexed voteId, string title, uint256 endTime)",
    "event VoteCast(uint256 indexed voteId, address indexed voter, uint256 optionIndex)",
    "event VoteClosed(uint256 indexed voteId, uint256 timestamp)"
  ],
  SERVICE_REQUESTS: [
    "function submitRequest(string memory _requestType, string memory _description) external returns (uint256)",
    "function approveRequest(uint256 _requestId, string memory _message) external",
    "function rejectRequest(uint256 _requestId, string memory _message) external",
    "function getRequest(uint256 _requestId) external view returns (address, string memory, string memory, uint8, uint256, string memory)",
    "function getUserRequests(address _user) external view returns (uint256[] memory)",
    "function getTotalRequests() external view returns (uint256)",
    "function getPendingRequestsCount() external view returns (uint256)",
    "function getPendingRequestIds() external view returns (uint256[] memory)",
    "function admin() external view returns (address)",
    "event RequestSubmitted(uint256 indexed requestId, address indexed requester, string requestType, uint256 timestamp)",
    "event RequestApproved(uint256 indexed requestId, uint256 timestamp, string message)",
    "event RequestRejected(uint256 indexed requestId, uint256 timestamp, string message)"
  ]
} as const;

// Network configuration
export const SUPPORTED_NETWORKS = {
  LOCALHOST: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: '',
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY || ''}`,
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  POLYGON_MUMBAI: {
    chainId: 80001,
    name: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
  POLYGON_AMOY: {
    chainId: 80002,
    name: 'Polygon Amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    blockExplorer: 'https://amoy.polygonscan.com',
  },
} as const;

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS.LOCALHOST;

// Helper function to get current network
export const getCurrentNetwork = (chainId: number) => {
  return Object.values(SUPPORTED_NETWORKS).find(
    network => network.chainId === chainId
  ) || DEFAULT_NETWORK;
};

// Type exports for TypeScript
export type ContractName = keyof typeof CONTRACT_ADDRESSES;
export type NetworkName = keyof typeof SUPPORTED_NETWORKS;
export type NetworkConfig = typeof SUPPORTED_NETWORKS[NetworkName];