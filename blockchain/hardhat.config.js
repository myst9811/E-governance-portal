require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY, POLYGON_RPC_URL, SEPOLIA_RPC_URL, ETHERSCAN_API_KEY, POLYGONSCAN_API_KEY } = process.env;

// Validate private key (must be 64 hex characters for 32 bytes)
const isValidPrivateKey = PRIVATE_KEY && PRIVATE_KEY.length === 64 && /^[0-9a-fA-F]+$/.test(PRIVATE_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {},

    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts: isValidPrivateKey ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },

    polygonMumbai: {
      url: POLYGON_RPC_URL || "",
      accounts: isValidPrivateKey ? [PRIVATE_KEY] : [],
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY || "",
      polygonMumbai: POLYGONSCAN_API_KEY || "",
    },
  },
};
