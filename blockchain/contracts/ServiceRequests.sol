// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ServiceRequests {
    enum RequestStatus { Pending, Approved, Rejected }

    struct ServiceRequest {
        address requester;
        string requestType;
        string description;
        RequestStatus status;
        uint256 timestamp;
        string responseMessage;
    }

    mapping(uint256 => ServiceRequest) private requests;
    mapping(address => uint256[]) private userRequests;
    uint256 private requestCounter;

    address public admin;

    event RequestSubmitted(
        uint256 indexed requestId,
        address indexed requester,
        string requestType,
        uint256 timestamp
    );

    event RequestApproved(
        uint256 indexed requestId,
        uint256 timestamp,
        string message
    );

    event RequestRejected(
        uint256 indexed requestId,
        uint256 timestamp,
        string message
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        requestCounter = 0;
    }

    // Submit a new service request
    function submitRequest(
        string memory _requestType,
        string memory _description
    ) public returns (uint256) {
        require(bytes(_requestType).length > 0, "Request type required");
        require(bytes(_description).length > 0, "Description required");

        requestCounter++;

        requests[requestCounter] = ServiceRequest({
            requester: msg.sender,
            requestType: _requestType,
            description: _description,
            status: RequestStatus.Pending,
            timestamp: block.timestamp,
            responseMessage: ""
        });

        userRequests[msg.sender].push(requestCounter);

        emit RequestSubmitted(
            requestCounter,
            msg.sender,
            _requestType,
            block.timestamp
        );

        return requestCounter;
    }

    // Approve a service request
    function approveRequest(
        uint256 _requestId,
        string memory _message
    ) public onlyAdmin {
        require(_requestId > 0 && _requestId <= requestCounter, "Invalid request ID");
        require(
            requests[_requestId].status == RequestStatus.Pending,
            "Request already processed"
        );

        requests[_requestId].status = RequestStatus.Approved;
        requests[_requestId].responseMessage = _message;

        emit RequestApproved(_requestId, block.timestamp, _message);
    }

    // Reject a service request
    function rejectRequest(
        uint256 _requestId,
        string memory _message
    ) public onlyAdmin {
        require(_requestId > 0 && _requestId <= requestCounter, "Invalid request ID");
        require(
            requests[_requestId].status == RequestStatus.Pending,
            "Request already processed"
        );

        requests[_requestId].status = RequestStatus.Rejected;
        requests[_requestId].responseMessage = _message;

        emit RequestRejected(_requestId, block.timestamp, _message);
    }

    // Get request details
    function getRequest(uint256 _requestId) public view returns (
        address requester,
        string memory requestType,
        string memory description,
        RequestStatus status,
        uint256 timestamp,
        string memory responseMessage
    ) {
        require(_requestId > 0 && _requestId <= requestCounter, "Invalid request ID");

        ServiceRequest memory req = requests[_requestId];
        return (
            req.requester,
            req.requestType,
            req.description,
            req.status,
            req.timestamp,
            req.responseMessage
        );
    }

    // Get all requests submitted by a user
    function getUserRequests(address _user) public view returns (uint256[] memory) {
        return userRequests[_user];
    }

    // Get total number of requests
    function getTotalRequests() public view returns (uint256) {
        return requestCounter;
    }

    // Get pending requests count (for admin dashboard)
    function getPendingRequestsCount() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 1; i <= requestCounter; i++) {
            if (requests[i].status == RequestStatus.Pending) {
                count++;
            }
        }
        return count;
    }

    // Get all pending request IDs (for admin)
    function getPendingRequestIds() public view returns (uint256[] memory) {
        uint256 pendingCount = getPendingRequestsCount();
        uint256[] memory pendingIds = new uint256[](pendingCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= requestCounter; i++) {
            if (requests[i].status == RequestStatus.Pending) {
                pendingIds[index] = i;
                index++;
            }
        }

        return pendingIds;
    }
}
