// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Certificates {
    struct Certificate {
        address recipient;
        string certificateType;
        string documentHash; // IPFS hash or document hash
        uint256 timestamp;
        bool isValid;
    }

    mapping(uint256 => Certificate) private certificates;
    uint256 private certificateCounter;

    address public admin;

    event CertificateIssued(
        uint256 indexed certificateId,
        address indexed recipient,
        string certificateType,
        uint256 timestamp
    );

    event CertificateRevoked(
        uint256 indexed certificateId,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        certificateCounter = 0;
    }

    // Issue a new certificate
    function issueCertificate(
        address _recipient,
        string memory _certificateType,
        string memory _documentHash
    ) public onlyAdmin returns (uint256) {
        require(_recipient != address(0), "Invalid recipient address");
        require(bytes(_certificateType).length > 0, "Certificate type required");
        require(bytes(_documentHash).length > 0, "Document hash required");

        certificateCounter++;

        certificates[certificateCounter] = Certificate({
            recipient: _recipient,
            certificateType: _certificateType,
            documentHash: _documentHash,
            timestamp: block.timestamp,
            isValid: true
        });

        emit CertificateIssued(
            certificateCounter,
            _recipient,
            _certificateType,
            block.timestamp
        );

        return certificateCounter;
    }

    // Verify certificate authenticity
    function verifyCertificate(uint256 _certificateId) public view returns (bool) {
        require(_certificateId > 0 && _certificateId <= certificateCounter, "Invalid certificate ID");
        return certificates[_certificateId].isValid;
    }

    // Get certificate details
    function getCertificate(uint256 _certificateId) public view returns (
        address recipient,
        string memory certificateType,
        string memory documentHash,
        uint256 timestamp,
        bool isValid
    ) {
        require(_certificateId > 0 && _certificateId <= certificateCounter, "Invalid certificate ID");

        Certificate memory cert = certificates[_certificateId];
        return (
            cert.recipient,
            cert.certificateType,
            cert.documentHash,
            cert.timestamp,
            cert.isValid
        );
    }

    // Revoke a certificate
    function revokeCertificate(uint256 _certificateId) public onlyAdmin {
        require(_certificateId > 0 && _certificateId <= certificateCounter, "Invalid certificate ID");
        require(certificates[_certificateId].isValid, "Certificate already revoked");

        certificates[_certificateId].isValid = false;
        emit CertificateRevoked(_certificateId, block.timestamp);
    }

    // Get total number of certificates issued
    function getTotalCertificates() public view returns (uint256) {
        return certificateCounter;
    }
}
