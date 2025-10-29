// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {
    struct Vote {
        string title;
        string description;
        string[] options;
        uint256 endTime;
        uint256[] voteCounts;
        mapping(address => bool) hasVoted;
        bool closed;
    }

    mapping(uint256 => Vote) private votes;
    uint256 private voteCounter;

    address public admin;

    event VoteCreated(
        uint256 indexed voteId,
        string title,
        uint256 endTime
    );

    event VoteCast(
        uint256 indexed voteId,
        address indexed voter,
        uint256 optionIndex
    );

    event VoteClosed(
        uint256 indexed voteId,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        voteCounter = 0;
    }

    // Create a new vote
    function createVote(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint256 _durationInDays
    ) public onlyAdmin returns (uint256) {
        require(bytes(_title).length > 0, "Title required");
        require(_options.length >= 2, "At least 2 options required");
        require(_durationInDays > 0, "Duration must be positive");

        voteCounter++;
        Vote storage newVote = votes[voteCounter];

        newVote.title = _title;
        newVote.description = _description;
        newVote.options = _options;
        newVote.endTime = block.timestamp + (_durationInDays * 1 days);
        newVote.closed = false;

        // Initialize vote counts array
        for (uint256 i = 0; i < _options.length; i++) {
            newVote.voteCounts.push(0);
        }

        emit VoteCreated(voteCounter, _title, newVote.endTime);

        return voteCounter;
    }

    // Cast a vote
    function castVote(uint256 _voteId, uint256 _optionIndex) public {
        require(_voteId > 0 && _voteId <= voteCounter, "Invalid vote ID");

        Vote storage v = votes[_voteId];

        require(!v.closed, "Vote is closed");
        require(block.timestamp < v.endTime, "Voting period has ended");
        require(!v.hasVoted[msg.sender], "Already voted");
        require(_optionIndex < v.options.length, "Invalid option index");

        v.hasVoted[msg.sender] = true;
        v.voteCounts[_optionIndex]++;

        emit VoteCast(_voteId, msg.sender, _optionIndex);
    }

    // Close vote (can be called by admin or automatically after endTime)
    function closeVote(uint256 _voteId) public onlyAdmin {
        require(_voteId > 0 && _voteId <= voteCounter, "Invalid vote ID");

        Vote storage v = votes[_voteId];
        require(!v.closed, "Vote already closed");

        v.closed = true;
        emit VoteClosed(_voteId, block.timestamp);
    }

    // Get vote results
    function getVoteResults(uint256 _voteId) public view returns (uint256[] memory) {
        require(_voteId > 0 && _voteId <= voteCounter, "Invalid vote ID");
        return votes[_voteId].voteCounts;
    }

    // Get vote details
    function getVote(uint256 _voteId) public view returns (
        string memory title,
        string memory description,
        string[] memory options,
        uint256 endTime,
        bool closed
    ) {
        require(_voteId > 0 && _voteId <= voteCounter, "Invalid vote ID");

        Vote storage v = votes[_voteId];
        return (
            v.title,
            v.description,
            v.options,
            v.endTime,
            v.closed
        );
    }

    // Check if user has voted
    function hasUserVoted(uint256 _voteId, address _voter) public view returns (bool) {
        require(_voteId > 0 && _voteId <= voteCounter, "Invalid vote ID");
        return votes[_voteId].hasVoted[_voter];
    }

    // Get total number of votes created
    function getTotalVotes() public view returns (uint256) {
        return voteCounter;
    }

    // Check if voting is still active
    function isVoteActive(uint256 _voteId) public view returns (bool) {
        require(_voteId > 0 && _voteId <= voteCounter, "Invalid vote ID");

        Vote storage v = votes[_voteId];
        return !v.closed && block.timestamp < v.endTime;
    }
}
