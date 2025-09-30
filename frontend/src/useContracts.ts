import { ethers } from 'ethers';
import { useWeb3 } from './Web3Context';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from './contractConfig';

export const useContracts = () => {
  const { signer, provider } = useWeb3();

  const getContract = (contractName: keyof typeof CONTRACT_ADDRESSES) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }
    
    const address = CONTRACT_ADDRESSES[contractName];
    const abi = CONTRACT_ABIS[contractName];
    
    if (!address) {
      throw new Error(`Contract address not found for ${contractName}`);
    }
    
    return new ethers.Contract(address, abi, signer);
  };

  // Identity Contract Methods
  const registerIdentity = async (name: string, documentHash: string) => {
    try {
      const contract = getContract('IDENTITY');
      const tx = await contract.registerIdentity(name, documentHash);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const verifyIdentity = async (address: string) => {
    try {
      const contract = getContract('IDENTITY');
      const isVerified = await contract.verifyIdentity(address);
      return { success: true, isVerified };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getIdentity = async (address: string) => {
    try {
      const contract = getContract('IDENTITY');
      const identity = await contract.getIdentity(address);
      return { 
        success: true, 
        identity: {
          name: identity[0],
          documentHash: identity[1],
          isVerified: identity[2]
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Certificate Contract Methods
  const issueCertificate = async (
    recipient: string,
    certificateType: string,
    documentHash: string
  ) => {
    try {
      const contract = getContract('CERTIFICATES');
      if (!contract) {
      throw new Error("Contract not initialized or wallet not connected");
    }
      const tx = await contract.issueCertificate(recipient, certificateType, documentHash);
      const receipt = await tx.wait();
      
      // Extract certificate ID from event
      const event = receipt.logs.find((log: any) => 
        log.topics[0] === contract.interface.getEvent('CertificateIssued')
      );
      
      return { success: true, txHash: tx.hash, receipt };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const verifyCertificate = async (certificateId: number) => {
    try {
      const contract = getContract('CERTIFICATES');
      const isValid = await contract.verifyCertificate(certificateId);
      return { success: true, isValid };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getCertificate = async (certificateId: number) => {
    try {
      const contract = getContract('CERTIFICATES');
      const cert = await contract.getCertificate(certificateId);
      return {
        success: true,
        certificate: {
          recipient: cert[0],
          certificateType: cert[1],
          documentHash: cert[2],
          timestamp: Number(cert[3]),
          isValid: cert[4]
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Voting Contract Methods
  const createVote = async (
    title: string,
    description: string,
    options: string[],
    durationInDays: number
  ) => {
    try {
      const contract = getContract('VOTING');
      const duration = durationInDays * 24 * 60 * 60; // Convert to seconds
      const tx = await contract.createVote(title, description, options, duration);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const castVote = async (voteId: number, optionIndex: number) => {
    try {
      const contract = getContract('VOTING');
      const tx = await contract.castVote(voteId, optionIndex);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getVoteResults = async (voteId: number) => {
    try {
      const contract = getContract('VOTING');
      const results = await contract.getVoteResults(voteId);
      return { success: true, results: results.map(Number) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const hasVoted = async (voteId: number, voterAddress: string) => {
    try {
      const contract = getContract('VOTING');
      const voted = await contract.hasVoted(voteId, voterAddress);
      return { success: true, hasVoted: voted };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Service Request Contract Methods
  const submitServiceRequest = async (requestType: string, description: string) => {
    try {
      const contract = getContract('SERVICE_REQUESTS');
      const tx = await contract.submitRequest(requestType, description);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const approveServiceRequest = async (requestId: number) => {
    try {
      const contract = getContract('SERVICE_REQUESTS');
      const tx = await contract.approveRequest(requestId);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getServiceRequest = async (requestId: number) => {
    try {
      const contract = getContract('SERVICE_REQUESTS');
      const request = await contract.getRequest(requestId);
      return {
        success: true,
        request: {
          requester: request[0],
          requestType: request[1],
          description: request[2],
          status: request[3],
          timestamp: Number(request[4])
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    // Identity methods
    registerIdentity,
    verifyIdentity,
    getIdentity,
    
    // Certificate methods
    issueCertificate,
    verifyCertificate,
    getCertificate,
    
    // Voting methods
    createVote,
    castVote,
    getVoteResults,
    hasVoted,
    
    // Service request methods
    submitServiceRequest,
    approveServiceRequest,
    getServiceRequest
  };
};