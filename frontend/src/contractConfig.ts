// Contract addresses - Update these after deploying your contracts

const CONTRACT_ADDRESSES = {
  IDENTITY: import.meta.env.VITE_IDENTITY_CONTRACT || "",
  CERTIFICATES: import.meta.env.VITE_CERTIFICATES_CONTRACT || "",
  VOTING: import.meta.env.VITE_VOTING_CONTRACT || "",
  SERVICE_REQUESTS: import.meta.env.VITE_SERVICE_REQUESTS_CONTRACT || "",
  // Add more contract addresses as needed
};
// Contract ABIs - Import from your compiled contracts
// You'll need to copy these from blockchain/artifacts/contracts/
export const CONTRACT_ABIS = {
  // Example structure - replace with your actual ABIs
  IDENTITY: [
    "function registerIdentity(string memory name, string memory documentHash) external",
    "function verifyIdentity(address user) external view returns (bool)",
    "function getIdentity(address user) external view returns (string memory, string memory, bool)",
    "event IdentityRegistered(address indexed user, string name, uint256 timestamp)"
  ],
  CERTIFICATES: [
    "function issueCertificate(address recipient, string memory certificateType, string memory documentHash) external",
    "function verifyCertificate(uint256 certificateId) external view returns (bool)",
    "function getCertificate(uint256 certificateId) external view returns (address, string memory, string memory, uint256, bool)",
    "event CertificateIssued(uint256 indexed certificateId, address indexed recipient, string certificateType, uint256 timestamp)"
  ],
  VOTING: [
    "function createVote(string memory title, string memory description, string[] memory options, uint256 duration) external",
    "function castVote(uint256 voteId, uint256 optionIndex) external",
    "function getVoteResults(uint256 voteId) external view returns (uint256[] memory)",
    "function hasVoted(uint256 voteId, address voter) external view returns (bool)",
    "event VoteCreated(uint256 indexed voteId, string title, uint256 endTime)",
    "event VoteCast(uint256 indexed voteId, address indexed voter, uint256 optionIndex)"
  ],
  SERVICE_REQUESTS: [
    "function submitRequest(string memory requestType, string memory description) external",
    "function approveRequest(uint256 requestId) external",
    "function getRequest(uint256 requestId) external view returns (address, string memory, string memory, uint8, uint256)",
    "event RequestSubmitted(uint256 indexed requestId, address indexed requester, string requestType, uint256 timestamp)",
    "event RequestApproved(uint256 indexed requestId, uint256 timestamp)"
  ]
};

// Network configuration
export const SUPPORTED_NETWORKS = {
  LOCALHOST: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545'
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
  },
  POLYGON_MUMBAI: {
    chainId: 80001,
    name: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com'
  }
};

export const DEFAULT_NETWORK = SUPPORTED_NETWORKS.LOCALHOST;