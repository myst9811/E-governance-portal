const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ServiceRequests Contract", function () {
  let ServiceRequests;
  let serviceRequests;
  let admin;
  let user1;
  let user2;

  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();

    ServiceRequests = await ethers.getContractFactory("ServiceRequests");
    serviceRequests = await ServiceRequests.deploy();
    await serviceRequests.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      expect(await serviceRequests.admin()).to.equal(admin.address);
    });

    it("Should initialize request counter to 0", async function () {
      expect(await serviceRequests.getTotalRequests()).to.equal(0);
    });
  });

  describe("Submit Request", function () {
    it("Should allow user to submit request", async function () {
      const tx = await serviceRequests.connect(user1).submitRequest(
        "Document Request",
        "I need a birth certificate copy"
      );

      expect(await serviceRequests.getTotalRequests()).to.equal(1);

      await expect(tx)
        .to.emit(serviceRequests, "RequestSubmitted")
        .withArgs(1, user1.address, "Document Request", await ethers.provider.getBlock('latest').then(b => b.timestamp));
    });

    it("Should store request data correctly", async function () {
      await serviceRequests.connect(user1).submitRequest(
        "Document Request",
        "I need a birth certificate copy"
      );

      const request = await serviceRequests.getRequest(1);
      expect(request[0]).to.equal(user1.address); // requester
      expect(request[1]).to.equal("Document Request"); // requestType
      expect(request[2]).to.equal("I need a birth certificate copy"); // description
      expect(request[3]).to.equal(0); // status (Pending)
      expect(request[5]).to.equal(""); // responseMessage
    });

    it("Should not submit request without type", async function () {
      await expect(
        serviceRequests.connect(user1).submitRequest(
          "",
          "Description"
        )
      ).to.be.revertedWith("Request type required");
    });

    it("Should not submit request without description", async function () {
      await expect(
        serviceRequests.connect(user1).submitRequest(
          "Document Request",
          ""
        )
      ).to.be.revertedWith("Description required");
    });

    it("Should allow multiple users to submit requests", async function () {
      await serviceRequests.connect(user1).submitRequest(
        "Request 1",
        "Description 1"
      );

      await serviceRequests.connect(user2).submitRequest(
        "Request 2",
        "Description 2"
      );

      expect(await serviceRequests.getTotalRequests()).to.equal(2);

      const req1 = await serviceRequests.getRequest(1);
      const req2 = await serviceRequests.getRequest(2);

      expect(req1[0]).to.equal(user1.address);
      expect(req2[0]).to.equal(user2.address);
    });

    it("Should track user requests correctly", async function () {
      await serviceRequests.connect(user1).submitRequest(
        "Request 1",
        "Description 1"
      );

      await serviceRequests.connect(user1).submitRequest(
        "Request 2",
        "Description 2"
      );

      await serviceRequests.connect(user2).submitRequest(
        "Request 3",
        "Description 3"
      );

      const user1Requests = await serviceRequests.getUserRequests(user1.address);
      const user2Requests = await serviceRequests.getUserRequests(user2.address);

      expect(user1Requests.length).to.equal(2);
      expect(user2Requests.length).to.equal(1);

      expect(user1Requests[0]).to.equal(1);
      expect(user1Requests[1]).to.equal(2);
      expect(user2Requests[0]).to.equal(3);
    });
  });

  describe("Approve Request", function () {
    beforeEach(async function () {
      await serviceRequests.connect(user1).submitRequest(
        "Document Request",
        "I need a certificate"
      );
    });

    it("Should allow admin to approve request", async function () {
      const tx = await serviceRequests.connect(admin).approveRequest(
        1,
        "Your request has been approved"
      );

      const request = await serviceRequests.getRequest(1);
      expect(request[3]).to.equal(1); // status (Approved)
      expect(request[5]).to.equal("Your request has been approved"); // responseMessage

      await expect(tx).to.emit(serviceRequests, "RequestApproved");
    });

    it("Should not allow non-admin to approve request", async function () {
      await expect(
        serviceRequests.connect(user2).approveRequest(
          1,
          "Approved"
        )
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not approve invalid request ID", async function () {
      await expect(
        serviceRequests.connect(admin).approveRequest(
          999,
          "Approved"
        )
      ).to.be.revertedWith("Invalid request ID");
    });

    it("Should not approve already processed request", async function () {
      await serviceRequests.connect(admin).approveRequest(
        1,
        "Approved"
      );

      await expect(
        serviceRequests.connect(admin).approveRequest(
          1,
          "Approved again"
        )
      ).to.be.revertedWith("Request already processed");
    });
  });

  describe("Reject Request", function () {
    beforeEach(async function () {
      await serviceRequests.connect(user1).submitRequest(
        "Document Request",
        "I need a certificate"
      );
    });

    it("Should allow admin to reject request", async function () {
      const tx = await serviceRequests.connect(admin).rejectRequest(
        1,
        "Missing required documents"
      );

      const request = await serviceRequests.getRequest(1);
      expect(request[3]).to.equal(2); // status (Rejected)
      expect(request[5]).to.equal("Missing required documents"); // responseMessage

      await expect(tx).to.emit(serviceRequests, "RequestRejected");
    });

    it("Should not allow non-admin to reject request", async function () {
      await expect(
        serviceRequests.connect(user2).rejectRequest(
          1,
          "Rejected"
        )
      ).to.be.revertedWith("Only admin can perform this action");
    });

    it("Should not reject invalid request ID", async function () {
      await expect(
        serviceRequests.connect(admin).rejectRequest(
          999,
          "Rejected"
        )
      ).to.be.revertedWith("Invalid request ID");
    });

    it("Should not reject already processed request", async function () {
      await serviceRequests.connect(admin).rejectRequest(
        1,
        "Rejected"
      );

      await expect(
        serviceRequests.connect(admin).rejectRequest(
          1,
          "Rejected again"
        )
      ).to.be.revertedWith("Request already processed");
    });
  });

  describe("Get Request Data", function () {
    it("Should retrieve correct request data", async function () {
      await serviceRequests.connect(user1).submitRequest(
        "Document Request",
        "I need a certificate"
      );

      const request = await serviceRequests.getRequest(1);

      expect(request[0]).to.equal(user1.address);
      expect(request[1]).to.equal("Document Request");
      expect(request[2]).to.equal("I need a certificate");
      expect(request[3]).to.equal(0); // Pending
      expect(request[4]).to.be.gt(0); // timestamp
      expect(request[5]).to.equal("");
    });

    it("Should revert when getting invalid request ID", async function () {
      await expect(
        serviceRequests.getRequest(999)
      ).to.be.revertedWith("Invalid request ID");
    });
  });

  describe("Get User Requests", function () {
    it("Should return empty array for user with no requests", async function () {
      const requests = await serviceRequests.getUserRequests(user1.address);
      expect(requests.length).to.equal(0);
    });

    it("Should return all user requests", async function () {
      await serviceRequests.connect(user1).submitRequest("Req 1", "Desc 1");
      await serviceRequests.connect(user1).submitRequest("Req 2", "Desc 2");
      await serviceRequests.connect(user1).submitRequest("Req 3", "Desc 3");

      const requests = await serviceRequests.getUserRequests(user1.address);
      expect(requests.length).to.equal(3);
      expect(requests[0]).to.equal(1);
      expect(requests[1]).to.equal(2);
      expect(requests[2]).to.equal(3);
    });
  });

  describe("Pending Requests", function () {
    beforeEach(async function () {
      await serviceRequests.connect(user1).submitRequest("Req 1", "Desc 1");
      await serviceRequests.connect(user1).submitRequest("Req 2", "Desc 2");
      await serviceRequests.connect(user2).submitRequest("Req 3", "Desc 3");
    });

    it("Should return correct pending count", async function () {
      expect(await serviceRequests.getPendingRequestsCount()).to.equal(3);

      await serviceRequests.connect(admin).approveRequest(1, "Approved");
      expect(await serviceRequests.getPendingRequestsCount()).to.equal(2);

      await serviceRequests.connect(admin).rejectRequest(2, "Rejected");
      expect(await serviceRequests.getPendingRequestsCount()).to.equal(1);
    });

    it("Should return pending request IDs", async function () {
      await serviceRequests.connect(admin).approveRequest(1, "Approved");

      const pendingIds = await serviceRequests.getPendingRequestIds();
      expect(pendingIds.length).to.equal(2);
      expect(pendingIds[0]).to.equal(2);
      expect(pendingIds[1]).to.equal(3);
    });

    it("Should return empty array when no pending requests", async function () {
      await serviceRequests.connect(admin).approveRequest(1, "Approved");
      await serviceRequests.connect(admin).approveRequest(2, "Approved");
      await serviceRequests.connect(admin).approveRequest(3, "Approved");

      const pendingIds = await serviceRequests.getPendingRequestIds();
      expect(pendingIds.length).to.equal(0);
    });
  });

  describe("Request Lifecycle", function () {
    it("Should complete full approval lifecycle", async function () {
      // Submit
      await serviceRequests.connect(user1).submitRequest(
        "Document Request",
        "Need certificate"
      );

      let request = await serviceRequests.getRequest(1);
      expect(request[3]).to.equal(0); // Pending

      // Approve
      await serviceRequests.connect(admin).approveRequest(
        1,
        "Approved and ready"
      );

      request = await serviceRequests.getRequest(1);
      expect(request[3]).to.equal(1); // Approved
      expect(request[5]).to.equal("Approved and ready");
    });

    it("Should complete full rejection lifecycle", async function () {
      // Submit
      await serviceRequests.connect(user1).submitRequest(
        "Document Request",
        "Need certificate"
      );

      let request = await serviceRequests.getRequest(1);
      expect(request[3]).to.equal(0); // Pending

      // Reject
      await serviceRequests.connect(admin).rejectRequest(
        1,
        "Insufficient information"
      );

      request = await serviceRequests.getRequest(1);
      expect(request[3]).to.equal(2); // Rejected
      expect(request[5]).to.equal("Insufficient information");
    });
  });
});
