const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Identity Contract", function () {
  let Identity;
  let identity;
  let admin;
  let citizen1;
  let citizen2;

  beforeEach(async function () {
    // Get signers
    [admin, citizen1, citizen2] = await ethers.getSigners();

    // Deploy contract
    Identity = await ethers.getContractFactory("Identity");
    identity = await Identity.deploy();
    await identity.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await identity.admin()).to.equal(admin.address);
    });
  });

  describe("Citizen Registration", function () {
    it("Should allow citizen to register", async function () {
      const tx = await identity.connect(citizen1).registerCitizen(
        "John Doe",
        "1990-01-15",
        "AADHAAR123456"
      );

      // Check if registered
      expect(await identity.registered(citizen1.address)).to.be.true;

      // Check if event was emitted
      await expect(tx)
        .to.emit(identity, "CitizenRegistered")
        .withArgs(citizen1.address, "John Doe");
    });

    it("Should store citizen data correctly", async function () {
      await identity.connect(citizen1).registerCitizen(
        "John Doe",
        "1990-01-15",
        "AADHAAR123456"
      );

      const citizen = await identity.getCitizen(citizen1.address);
      expect(citizen[0]).to.equal("John Doe");
      expect(citizen[1]).to.equal("1990-01-15");
      expect(citizen[2]).to.equal("AADHAAR123456");
      expect(citizen[3]).to.be.false; // Not verified yet
    });

    it("Should not allow duplicate registration", async function () {
      await identity.connect(citizen1).registerCitizen(
        "John Doe",
        "1990-01-15",
        "AADHAAR123456"
      );

      await expect(
        identity.connect(citizen1).registerCitizen(
          "John Doe",
          "1990-01-15",
          "AADHAAR123456"
        )
      ).to.be.revertedWith("Already registered");
    });

    it("Should allow multiple different citizens to register", async function () {
      await identity.connect(citizen1).registerCitizen(
        "John Doe",
        "1990-01-15",
        "AADHAAR123456"
      );

      await identity.connect(citizen2).registerCitizen(
        "Jane Smith",
        "1992-05-20",
        "AADHAAR789012"
      );

      expect(await identity.registered(citizen1.address)).to.be.true;
      expect(await identity.registered(citizen2.address)).to.be.true;
    });
  });

  describe("Citizen Verification", function () {
    beforeEach(async function () {
      // Register a citizen before each verification test
      await identity.connect(citizen1).registerCitizen(
        "John Doe",
        "1990-01-15",
        "AADHAAR123456"
      );
    });

    it("Should allow admin to verify citizen", async function () {
      const tx = await identity.connect(admin).verifyCitizen(citizen1.address);

      // Check if verified
      const citizen = await identity.getCitizen(citizen1.address);
      expect(citizen[3]).to.be.true;

      // Check if event was emitted
      await expect(tx)
        .to.emit(identity, "CitizenVerified")
        .withArgs(citizen1.address, true);
    });

    it("Should not allow non-admin to verify citizen", async function () {
      await expect(
        identity.connect(citizen2).verifyCitizen(citizen1.address)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not verify unregistered citizen", async function () {
      await expect(
        identity.connect(admin).verifyCitizen(citizen2.address)
      ).to.be.revertedWith("Citizen not registered");
    });

    it("Should allow admin to verify multiple citizens", async function () {
      await identity.connect(citizen2).registerCitizen(
        "Jane Smith",
        "1992-05-20",
        "AADHAAR789012"
      );

      await identity.connect(admin).verifyCitizen(citizen1.address);
      await identity.connect(admin).verifyCitizen(citizen2.address);

      const citizen1Data = await identity.getCitizen(citizen1.address);
      const citizen2Data = await identity.getCitizen(citizen2.address);

      expect(citizen1Data[3]).to.be.true;
      expect(citizen2Data[3]).to.be.true;
    });
  });

  describe("Get Citizen Data", function () {
    it("Should retrieve correct citizen data", async function () {
      await identity.connect(citizen1).registerCitizen(
        "John Doe",
        "1990-01-15",
        "AADHAAR123456"
      );

      const citizen = await identity.getCitizen(citizen1.address);

      expect(citizen[0]).to.equal("John Doe");
      expect(citizen[1]).to.equal("1990-01-15");
      expect(citizen[2]).to.equal("AADHAAR123456");
      expect(citizen[3]).to.be.false;
    });

    it("Should revert when getting unregistered citizen", async function () {
      await expect(
        identity.getCitizen(citizen1.address)
      ).to.be.revertedWith("Citizen not registered");
    });

    it("Should reflect verification status change", async function () {
      await identity.connect(citizen1).registerCitizen(
        "John Doe",
        "1990-01-15",
        "AADHAAR123456"
      );

      let citizen = await identity.getCitizen(citizen1.address);
      expect(citizen[3]).to.be.false;

      await identity.connect(admin).verifyCitizen(citizen1.address);

      citizen = await identity.getCitizen(citizen1.address);
      expect(citizen[3]).to.be.true;
    });
  });

  describe("Access Control", function () {
    it("Should have correct admin address", async function () {
      expect(await identity.admin()).to.equal(admin.address);
    });

    it("Should maintain registered status correctly", async function () {
      expect(await identity.registered(citizen1.address)).to.be.false;

      await identity.connect(citizen1).registerCitizen(
        "John Doe",
        "1990-01-15",
        "AADHAAR123456"
      );

      expect(await identity.registered(citizen1.address)).to.be.true;
    });
  });
});
