// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Identity {
    struct Citizen {
        string name;
        string dob;         // Date of Birth
        string nationalId;  // e.g., Aadhaar/SSN/Passport
        bool verified;
    }

    mapping(address => Citizen) private citizens;
    mapping(address => bool) public registered;


    address public admin;

    event CitizenRegistered(address indexed user, string name);
    event CitizenVerified(address indexed user, bool status);
    

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Citizen self-registers
    function registerCitizen(string memory _name, string memory _dob, string memory _nationalId) public {
        require(!registered[msg.sender], "Already registered");

        citizens[msg.sender] = Citizen({
            name: _name,
            dob: _dob,
            nationalId: _nationalId,
            verified: false
        });

        registered[msg.sender] = true;
        emit CitizenRegistered(msg.sender, _name);
    }

    // Government verifies the citizen
    function verifyCitizen(address _citizen) public onlyAdmin {
        require(registered[_citizen], "Citizen not registered");
        citizens[_citizen].verified = true;
        emit CitizenVerified(_citizen, true);
    }

    // Fetch details (for frontend)
    function getCitizen(address _citizen) public view returns (string memory, string memory, string memory, bool) {
        require(registered[_citizen], "Citizen not registered");
        Citizen memory c = citizens[_citizen];
        return (c.name, c.dob, c.nationalId, c.verified);
    }

}