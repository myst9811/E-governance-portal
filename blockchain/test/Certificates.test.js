const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Certificates Contract", function () {
  let Certificates;
  let certificates;
  let admin;
  let recipient1;
  let recipient2;

  beforeEach(async function () {
    [admin, recipient1, recipient2] = await ethers.getSigners();

    Certificates = await ethers.getContractFactory("Certificates");
    certificates = await Certificates.deploy();
    await certificates.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await certificates.admin()).to.equal(admin.address);
    });

    it("Should initialize certificate counter to 0", async function () {
      expect(await certificates.getTotalCertificates()).to.equal(0);
    });
  });

  describe("Certificate Issuance", function () {
    it("Should allow admin to issue certificate", async function () {
      const tx = await certificates.connect(admin).issueCertificate(
        recipient1.address,
        "Birth Certificate",
        "QmHash123456"
      );

      expect(await certificates.getTotalCertificates()).to.equal(1);

      await expect(tx)
        .to.emit(certificates, "CertificateIssued")
        .withArgs(1, recipient1.address, "Birth Certificate", await ethers.provider.getBlock('latest').then(b => b.timestamp));
    });

    it("Should store certificate data correctly", async function () {
      await certificates.connect(admin).issueCertificate(
        recipient1.address,
        "Birth Certificate",
        "QmHash123456"
      );

      const cert = await certificates.getCertificate(1);
      expect(cert[0]).to.equal(recipient1.address); // recipient
      expect(cert[1]).to.equal("Birth Certificate"); // certificateType
      expect(cert[2]).to.equal("QmHash123456"); // documentHash
      expect(cert[4]).to.be.true; // isValid
    });

    it("Should not allow non-admin to issue certificate", async function () {
      await expect(
        certificates.connect(recipient1).issueCertificate(
          recipient2.address,
          "Birth Certificate",
          "QmHash123456"
        )
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not issue certificate to zero address", async function () {
      await expect(
        certificates.connect(admin).issueCertificate(
          ethers.ZeroAddress,
          "Birth Certificate",
          "QmHash123456"
        )
      ).to.be.revertedWith("Invalid recipient address");
    });

    it("Should not issue certificate without type", async function () {
      await expect(
        certificates.connect(admin).issueCertificate(
          recipient1.address,
          "",
          "QmHash123456"
        )
      ).to.be.revertedWith("Certificate type required");
    });

    it("Should not issue certificate without document hash", async function () {
      await expect(
        certificates.connect(admin).issueCertificate(
          recipient1.address,
          "Birth Certificate",
          ""
        )
      ).to.be.revertedWith("Document hash required");
    });

    it("Should issue multiple certificates with incrementing IDs", async function () {
      await certificates.connect(admin).issueCertificate(
        recipient1.address,
        "Birth Certificate",
        "QmHash1"
      );

      await certificates.connect(admin).issueCertificate(
        recipient2.address,
        "Education Certificate",
        "QmHash2"
      );

      expect(await certificates.getTotalCertificates()).to.equal(2);

      const cert1 = await certificates.getCertificate(1);
      const cert2 = await certificates.getCertificate(2);

      expect(cert1[0]).to.equal(recipient1.address);
      expect(cert2[0]).to.equal(recipient2.address);
    });
  });

  describe("Certificate Verification", function () {
    beforeEach(async function () {
      await certificates.connect(admin).issueCertificate(
        recipient1.address,
        "Birth Certificate",
        "QmHash123456"
      );
    });

    it("Should verify valid certificate", async function () {
      expect(await certificates.verifyCertificate(1)).to.be.true;
    });

    it("Should return false for revoked certificate", async function () {
      await certificates.connect(admin).revokeCertificate(1);
      expect(await certificates.verifyCertificate(1)).to.be.false;
    });

    it("Should revert for invalid certificate ID", async function () {
      await expect(
        certificates.verifyCertificate(999)
      ).to.be.revertedWith("Invalid certificate ID");
    });

    it("Should revert for certificate ID 0", async function () {
      await expect(
        certificates.verifyCertificate(0)
      ).to.be.revertedWith("Invalid certificate ID");
    });
  });

  describe("Certificate Revocation", function () {
    beforeEach(async function () {
      await certificates.connect(admin).issueCertificate(
        recipient1.address,
        "Birth Certificate",
        "QmHash123456"
      );
    });

    it("Should allow admin to revoke certificate", async function () {
      const tx = await certificates.connect(admin).revokeCertificate(1);

      const cert = await certificates.getCertificate(1);
      expect(cert[4]).to.be.false; // isValid

      await expect(tx).to.emit(certificates, "CertificateRevoked");
    });

    it("Should not allow non-admin to revoke certificate", async function () {
      await expect(
        certificates.connect(recipient1).revokeCertificate(1)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not revoke invalid certificate ID", async function () {
      await expect(
        certificates.connect(admin).revokeCertificate(999)
      ).to.be.revertedWith("Invalid certificate ID");
    });

    it("Should not revoke already revoked certificate", async function () {
      await certificates.connect(admin).revokeCertificate(1);

      await expect(
        certificates.connect(admin).revokeCertificate(1)
      ).to.be.revertedWith("Certificate already revoked");
    });
  });

  describe("Get Certificate Data", function () {
    it("Should retrieve correct certificate data", async function () {
      await certificates.connect(admin).issueCertificate(
        recipient1.address,
        "Birth Certificate",
        "QmHash123456"
      );

      const cert = await certificates.getCertificate(1);

      expect(cert[0]).to.equal(recipient1.address);
      expect(cert[1]).to.equal("Birth Certificate");
      expect(cert[2]).to.equal("QmHash123456");
      expect(cert[3]).to.be.gt(0); // timestamp
      expect(cert[4]).to.be.true; // isValid
    });

    it("Should revert when getting invalid certificate ID", async function () {
      await expect(
        certificates.getCertificate(999)
      ).to.be.revertedWith("Invalid certificate ID");
    });
  });

  describe("Certificate Counter", function () {
    it("Should return correct total certificates", async function () {
      expect(await certificates.getTotalCertificates()).to.equal(0);

      await certificates.connect(admin).issueCertificate(
        recipient1.address,
        "Certificate 1",
        "Hash1"
      );
      expect(await certificates.getTotalCertificates()).to.equal(1);

      await certificates.connect(admin).issueCertificate(
        recipient2.address,
        "Certificate 2",
        "Hash2"
      );
      expect(await certificates.getTotalCertificates()).to.equal(2);
    });
  });
});
