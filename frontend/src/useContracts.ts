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
  const registerCitizen = async (name: string, dob: string, nationalId: string) => {
    try {
      const contract = getContract('IDENTITY');
      const tx = await contract.registerCitizen(name, dob, nationalId);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const verifyCitizen = async (address: string) => {
    try {
      const contract = getContract('IDENTITY');
      const tx = await contract.verifyCitizen(address);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getCitizen = async (address: string) => {
    try {
      const contract = getContract('IDENTITY');
      const citizen = await contract.getCitizen(address);
      return {
        success: true,
        citizen: {
          name: citizen[0],
          dob: citizen[1],
          nationalId: citizen[2],
          verified: citizen[3]
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const isRegistered = async (address: string) => {
    try {
      const contract = getContract('IDENTITY');
      const registered = await contract.registered(address);
      return { success: true, registered };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };


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
      const tx = await contract.createVote(title, description, options, durationInDays);
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

  const hasUserVoted = async (voteId: number, voterAddress: string) => {
    try {
      const contract = getContract('VOTING');
      const voted = await contract.hasUserVoted(voteId, voterAddress);
      return { success: true, hasVoted: voted };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getVote = async (voteId: number) => {
    try {
      const contract = getContract('VOTING');
      const vote = await contract.getVote(voteId);
      return {
        success: true,
        vote: {
          title: vote[0],
          description: vote[1],
          options: vote[2],
          endTime: Number(vote[3]),
          closed: vote[4]
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const isVoteActive = async (voteId: number) => {
    try {
      const contract = getContract('VOTING');
      const isActive = await contract.isVoteActive(voteId);
      return { success: true, isActive };
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

  const approveServiceRequest = async (requestId: number, message: string) => {
    try {
      const contract = getContract('SERVICE_REQUESTS');
      const tx = await contract.approveRequest(requestId, message);
      await tx.wait();
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const rejectServiceRequest = async (requestId: number, message: string) => {
    try {
      const contract = getContract('SERVICE_REQUESTS');
      const tx = await contract.rejectRequest(requestId, message);
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
          timestamp: Number(request[4]),
          responseMessage: request[5]
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getUserRequests = async (userAddress: string) => {
    try {
      const contract = getContract('SERVICE_REQUESTS');
      const requestIds = await contract.getUserRequests(userAddress);
      return { success: true, requestIds: requestIds.map(Number) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    // Identity methods
    registerCitizen,
    verifyCitizen,
    getCitizen,
    isRegistered,

    // Certificate methods
    issueCertificate,
    verifyCertificate,
    getCertificate,

    // Voting methods
    createVote,
    castVote,
    getVoteResults,
    hasUserVoted,
    getVote,
    isVoteActive,

    // Service request methods
    submitServiceRequest,
    approveServiceRequest,
    rejectServiceRequest,
    getServiceRequest,
    getUserRequests
  };
};