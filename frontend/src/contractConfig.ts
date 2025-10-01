// Contract addresses - Update these after deploying your contracts
export const CONTRACT_ADDRESSES = {
  IDENTITY: import.meta.env.VITE_IDENTITY_CONTRACT || "",
  CERTIFICATES: import.meta.env.VITE_CERTIFICATES_CONTRACT || "",
  VOTING: import.meta.env.VITE_VOTING_CONTRACT || "",
  SERVICE_REQUESTS: import.meta.env.VITE_SERVICE_REQUESTS_CONTRACT || "",
} as const;

// Contract ABIs - Import from your compiled contracts
// You'll need to copy these from blockchain/artifacts/contracts/
export const CONTRACT_ABIS = {
  IDENTITY: [
    "function registerIdentity(string memory name, string memory documentHash) external",
    "function verifyIdentity(address user) external view returns (bool)",
    "function getIdentity(address user) external view returns (string memory, string memory, bool)",
    "event IdentityRegistered(address indexed user, string name, uint256 timestamp)"
  ],
  CERTIFICATES: [
    "function issueCertificate(address recipient, string memory certificateType, string memory documentHash) external returns (uint256)",
    "function verifyCertificate(uint256 certificateId) external view returns (bool)",
    "function getCertificate(uint256 certificateId) external view returns (address, string memory, string memory, uint256, bool)",
    "function revokeCertificate(uint256 certificateId) external",
    "event CertificateIssued(uint256 indexed certificateId, address indexed recipient, string certificateType, uint256 timestamp)",
    "event CertificateRevoked(uint256 indexed certificateId, uint256 timestamp)"
  ],
  VOTING: [
    "function createVote(string memory title, string memory description, string[] memory options, uint256 duration) external returns (uint256)",
    "function castVote(uint256 voteId, uint256 optionIndex) external",
    "function getVoteResults(uint256 voteId) external view returns (uint256[] memory)",
    "function hasVoted(uint256 voteId, address voter) external view returns (bool)",
    "function getVoteDetails(uint256 voteId) external view returns (string memory, string memory, string[] memory, uint256, uint256, bool)",
    "event VoteCreated(uint256 indexed voteId, string title, uint256 endTime)",
    "event VoteCast(uint256 indexed voteId, address indexed voter, uint256 optionIndex)"
  ],
  SERVICE_REQUESTS: [
    "function submitRequest(string memory requestType, string memory description) external returns (uint256)",
    "function approveRequest(uint256 requestId) external",
    "function rejectRequest(uint256 requestId) external",
    "function getRequest(uint256 requestId) external view returns (address, string memory, string memory, uint8, uint256)",
    "function getUserRequests(address user) external view returns (uint256[] memory)",
    "event RequestSubmitted(uint256 indexed requestId, address indexed requester, string requestType, uint256 timestamp)",
    "event RequestApproved(uint256 indexed requestId, uint256 timestamp)",
    "event RequestRejected(uint256 indexed requestId, uint256 timestamp)"
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