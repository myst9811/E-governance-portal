const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Voting Contract", function () {
  let Voting;
  let voting;
  let admin;
  let voter1;
  let voter2;
  let voter3;

  beforeEach(async function () {
    [admin, voter1, voter2, voter3] = await ethers.getSigners();

    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await voting.admin()).to.equal(admin.address);
    });

    it("Should initialize vote counter to 0", async function () {
      expect(await voting.getTotalVotes()).to.equal(0);
    });
  });

  describe("Vote Creation", function () {
    it("Should allow admin to create vote", async function () {
      const options = ["Option A", "Option B", "Option C"];
      const tx = await voting.connect(admin).createVote(
        "Test Vote",
        "This is a test vote",
        options,
        7 // 7 days duration
      );

      expect(await voting.getTotalVotes()).to.equal(1);

      await expect(tx).to.emit(voting, "VoteCreated");
    });

    it("Should store vote data correctly", async function () {
      const options = ["Option A", "Option B"];
      await voting.connect(admin).createVote(
        "Test Vote",
        "Description",
        options,
        7
      );

      const vote = await voting.getVote(1);
      expect(vote[0]).to.equal("Test Vote"); // title
      expect(vote[1]).to.equal("Description"); // description
      expect(vote[2]).to.deep.equal(options); // options
      expect(vote[4]).to.be.false; // closed
    });

    it("Should not allow non-admin to create vote", async function () {
      await expect(
        voting.connect(voter1).createVote(
          "Test Vote",
          "Description",
          ["Option A", "Option B"],
          7
        )
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not create vote without title", async function () {
      await expect(
        voting.connect(admin).createVote(
          "",
          "Description",
          ["Option A", "Option B"],
          7
        )
      ).to.be.revertedWith("Title required");
    });

    it("Should not create vote with less than 2 options", async function () {
      await expect(
        voting.connect(admin).createVote(
          "Test Vote",
          "Description",
          ["Option A"],
          7
        )
      ).to.be.revertedWith("At least 2 options required");
    });

    it("Should not create vote with 0 duration", async function () {
      await expect(
        voting.connect(admin).createVote(
          "Test Vote",
          "Description",
          ["Option A", "Option B"],
          0
        )
      ).to.be.revertedWith("Duration must be positive");
    });
  });

  describe("Casting Votes", function () {
    beforeEach(async function () {
      await voting.connect(admin).createVote(
        "Test Vote",
        "Description",
        ["Option A", "Option B", "Option C"],
        7
      );
    });

    it("Should allow voter to cast vote", async function () {
      const tx = await voting.connect(voter1).castVote(1, 0);

      await expect(tx)
        .to.emit(voting, "VoteCast")
        .withArgs(1, voter1.address, 0);

      const results = await voting.getVoteResults(1);
      expect(results[0]).to.equal(1);
      expect(results[1]).to.equal(0);
      expect(results[2]).to.equal(0);
    });

    it("Should record that voter has voted", async function () {
      await voting.connect(voter1).castVote(1, 0);

      expect(await voting.hasUserVoted(1, voter1.address)).to.be.true;
      expect(await voting.hasUserVoted(1, voter2.address)).to.be.false;
    });

    it("Should not allow voter to vote twice", async function () {
      await voting.connect(voter1).castVote(1, 0);

      await expect(
        voting.connect(voter1).castVote(1, 1)
      ).to.be.revertedWith("Already voted");
    });

    it("Should not allow voting on invalid vote ID", async function () {
      await expect(
        voting.connect(voter1).castVote(999, 0)
      ).to.be.revertedWith("Invalid vote ID");
    });

    it("Should not allow voting with invalid option index", async function () {
      await expect(
        voting.connect(voter1).castVote(1, 5)
      ).to.be.revertedWith("Invalid option index");
    });

    it("Should allow multiple voters to vote", async function () {
      await voting.connect(voter1).castVote(1, 0);
      await voting.connect(voter2).castVote(1, 1);
      await voting.connect(voter3).castVote(1, 0);

      const results = await voting.getVoteResults(1);
      expect(results[0]).to.equal(2); // Option A: 2 votes
      expect(results[1]).to.equal(1); // Option B: 1 vote
      expect(results[2]).to.equal(0); // Option C: 0 votes
    });

    it("Should not allow voting on closed vote", async function () {
      await voting.connect(admin).closeVote(1);

      await expect(
        voting.connect(voter1).castVote(1, 0)
      ).to.be.revertedWith("Vote is closed");
    });

    it("Should not allow voting after end time", async function () {
      // Increase time by 8 days
      await time.increase(8 * 24 * 60 * 60);

      await expect(
        voting.connect(voter1).castVote(1, 0)
      ).to.be.revertedWith("Voting period has ended");
    });
  });

  describe("Vote Results", function () {
    beforeEach(async function () {
      await voting.connect(admin).createVote(
        "Test Vote",
        "Description",
        ["Option A", "Option B"],
        7
      );
    });

    it("Should return correct vote results", async function () {
      await voting.connect(voter1).castVote(1, 0);
      await voting.connect(voter2).castVote(1, 0);
      await voting.connect(voter3).castVote(1, 1);

      const results = await voting.getVoteResults(1);
      expect(results[0]).to.equal(2);
      expect(results[1]).to.equal(1);
    });

    it("Should return zero results for new vote", async function () {
      const results = await voting.getVoteResults(1);
      expect(results[0]).to.equal(0);
      expect(results[1]).to.equal(0);
    });
  });

  describe("Close Vote", function () {
    beforeEach(async function () {
      await voting.connect(admin).createVote(
        "Test Vote",
        "Description",
        ["Option A", "Option B"],
        7
      );
    });

    it("Should allow admin to close vote", async function () {
      const tx = await voting.connect(admin).closeVote(1);

      await expect(tx).to.emit(voting, "VoteClosed");

      const vote = await voting.getVote(1);
      expect(vote[4]).to.be.true; // closed
    });

    it("Should not allow non-admin to close vote", async function () {
      await expect(
        voting.connect(voter1).closeVote(1)
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not close already closed vote", async function () {
      await voting.connect(admin).closeVote(1);

      await expect(
        voting.connect(admin).closeVote(1)
      ).to.be.revertedWith("Vote already closed");
    });

    it("Should not close invalid vote ID", async function () {
      await expect(
        voting.connect(admin).closeVote(999)
      ).to.be.revertedWith("Invalid vote ID");
    });
  });

  describe("Vote Status", function () {
    beforeEach(async function () {
      await voting.connect(admin).createVote(
        "Test Vote",
        "Description",
        ["Option A", "Option B"],
        7
      );
    });

    it("Should return true for active vote", async function () {
      expect(await voting.isVoteActive(1)).to.be.true;
    });

    it("Should return false for closed vote", async function () {
      await voting.connect(admin).closeVote(1);
      expect(await voting.isVoteActive(1)).to.be.false;
    });

    it("Should return false for expired vote", async function () {
      await time.increase(8 * 24 * 60 * 60);
      expect(await voting.isVoteActive(1)).to.be.false;
    });
  });
});
