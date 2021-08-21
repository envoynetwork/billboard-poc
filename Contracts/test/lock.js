const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const Decentraboard = artifacts.require("Decentraboard");

contract("Owner can transfer token", function(accounts) {

  it("Owner should be able to transfer token if no lock set", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Mint token
    await BillboardInstance.mintSlot(0, 10, {from: ownerAddress});

    // Check owner of token
    var resultOwnerOf = await BillboardInstance.ownerOf(0);
    assert.equal(resultOwnerOf, ownerAddress, "Deployer is owner");
  
    // Transfer
    await BillboardInstance.transferFrom(ownerAddress, userAddress, 0, {from: ownerAddress});
    
    // Check owner of token
    var resultOwnerOf = await BillboardInstance.ownerOf(0);
    assert.equal(resultOwnerOf, userAddress, "User is now owner");

    // Can not transfer again
    await truffleAssert.reverts(
      BillboardInstance.transferFrom(ownerAddress, userAddress, 0, {from: ownerAddress}),
      "ERC721: transfer caller is not owner nor approved"
    );
  });

});

contract("Token lockup", function(accounts) {

  it("Owner should not be able to transfer while lockup active", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    await BillboardInstance.mintSlot(0, 0, {from: ownerAddress});

    // Check lock
    var resultLock = await BillboardInstance.isTokenLocked(0);
    assert.equal(resultLock, false, "Lock should not be set yet");

    // Set lock
    let currentTime = await truffleHelpers.time.latest();
    let unlockTime = parseInt(currentTime) + 15778476; // 6 months to seconds
    let resultOwnerName = await BillboardInstance.setLock(0, 0, unlockTime, {from: ownerAddress});
    assert.equal(resultOwnerName.receipt.status, true, "Transaction should succeed");

    // Check lock
    var resultLock = await BillboardInstance.isTokenLocked(0);
    assert.equal(resultLock, true, "Lock should be set");
 
    // Can not transfer locked token
    await truffleAssert.reverts(
      BillboardInstance.transferFrom(ownerAddress, userAddress, 0, {from: ownerAddress}),
      "Token still locked"
    );
    await truffleAssert.reverts(
      BillboardInstance.safeTransferFrom(ownerAddress, userAddress, 0, {from: ownerAddress}),
      "Token still locked"
    );

    // Advance 182 days (almost 6 months)
    await truffleHelpers.time.increase(truffleHelpers.time.duration.days(182));

    // Check lock
    var resultLock = await BillboardInstance.isTokenLocked(0);
    assert.equal(resultLock, true, "Lock should be set");

    // Advance 1 day so we are at 6 months
    await truffleHelpers.time.increase(truffleHelpers.time.duration.days(1));

    // Check lock
    var resultLock = await BillboardInstance.isTokenLocked(0);
    assert.equal(resultLock, false, "Lock should not be set anymore");

    // Transfer should succeed
    await BillboardInstance.transferFrom(ownerAddress, userAddress, 0, {from: ownerAddress});

    // Check owner of token
    var resultOwnerOf = await BillboardInstance.ownerOf(0);
    assert.equal(resultOwnerOf, userAddress, "User is now owner");
  });

});