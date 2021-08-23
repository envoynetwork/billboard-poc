const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const Decentraboard = artifacts.require("Decentraboard");

contract("Buyer can mint slot", function(accounts) {

  before("Set tier prices", async function () {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();

    // Set tier prices as owner
    await BillboardInstance.setTierPrice(1, "100000000000000000", {from: ownerAddress}); // 0.1 ETH
    await BillboardInstance.setTierPrice(2, "10000000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(3, "1000000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(4, "100000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(5, "10000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(6, "1000000000000", {from: ownerAddress});
  });

  it("Owner should be able to pay for a new slot", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    var resultTier = await BillboardInstance.tierForSlot(50000, {from: userAddress});
    assert.equal(resultTier, 0, "No tier as slot does not exist");
  
    // Tiers and mint
    var resultTier = await BillboardInstance.tierForSlot(5, {from: userAddress});
    assert.equal(resultTier, 1, "Wrong tier for slot");

    var resultMint = await BillboardInstance.mintSlot(0, 5, {from: userAddress, value: "100000000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    var resultOwnerOf = await BillboardInstance.ownerOf(0);
    assert.equal(resultOwnerOf, userAddress, "User is owner of token");


    var resultTier = await BillboardInstance.tierForSlot(13, {from: userAddress});
    assert.equal(resultTier, 2, "Wrong tier for slot");

    var resultMint = await BillboardInstance.mintSlot(0, 13, {from: userAddress, value: "10000000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    var resultOwnerOf = await BillboardInstance.ownerOf(1);
    assert.equal(resultOwnerOf, userAddress, "User is owner of token");


    var resultTier = await BillboardInstance.tierForSlot(50, {from: userAddress});
    assert.equal(resultTier, 3, "Wrong tier for slot");

    var resultMint = await BillboardInstance.mintSlot(0, 50, {from: userAddress, value: "1000000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    var resultOwnerOf = await BillboardInstance.ownerOf(2);
    assert.equal(resultOwnerOf, userAddress, "User is owner of token");


    var resultTier = await BillboardInstance.tierForSlot(60, {from: userAddress});
    assert.equal(resultTier, 4, "Wrong tier for slot");

    var resultMint = await BillboardInstance.mintSlot(0, 60, {from: userAddress, value: "100000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    var resultOwnerOf = await BillboardInstance.ownerOf(3);
    assert.equal(resultOwnerOf, userAddress, "User is owner of token");


    var resultTier = await BillboardInstance.tierForSlot(100, {from: userAddress});
    assert.equal(resultTier, 5, "Wrong tier for slot");

    var resultMint = await BillboardInstance.mintSlot(0, 100, {from: userAddress, value: "10000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    var resultOwnerOf = await BillboardInstance.ownerOf(4);
    assert.equal(resultOwnerOf, userAddress, "User is owner of token");


    var resultTier = await BillboardInstance.tierForSlot(400, {from: userAddress});
    assert.equal(resultTier, 6, "Wrong tier for slot");

    var resultMint = await BillboardInstance.mintSlot(0, 400, {from: userAddress, value: "1000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    var resultOwnerOf = await BillboardInstance.ownerOf(5);
    assert.equal(resultOwnerOf, userAddress, "User is owner of token");

  });

  it("Wallet should receive funds", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const walletAddress = accounts[2];
    const BillboardInstance = await Decentraboard.deployed();

    // Start balance
    var startBalance = await web3.eth.getBalance(walletAddress);

    // Set wallet
    var resultWallet = await BillboardInstance.updateWallet(walletAddress, {from: ownerAddress});
    assert.equal(resultWallet.receipt.status, true, "Transaction should succeed");

    // Mint
    var resultMint = await BillboardInstance.mintSlot(0, 2, {from: userAddress, value: "100000000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    // End balance
    var endBalance = await web3.eth.getBalance(walletAddress);

    // Balance changed
    var balanceDiff = endBalance - startBalance;
    assert.equal(balanceDiff, "100000000000000000", "Wallet should have received funds");

  });

  it("Owner should be able to pay for a new slot and set metadata immediately", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Mint
    var resultMint = await BillboardInstance.mintSlotWithData(
      0, 
      4, 
      "adImageParam1",
      "redirectUrlParam1",
      true,
      "ownerNameParam1",
      {from: userAddress, value: "100000000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    // Get all metadata
    var resultGetData = await BillboardInstance._tokenData(0, 4);
    assert.equal(resultGetData.adImage, "adImageParam1", "Wrong adImage");
    assert.equal(resultGetData.redirectUrl, "redirectUrlParam1", "Wrong redirectUrl");
    assert.equal(resultGetData.forSale, true, "Wrong forSale");
    assert.equal(resultGetData.ownerName, "ownerNameParam1", "Wrong ownerName");
  });

});

contract("Slot minting asserts", function(accounts) {

  before("Set tier prices", async function () {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();

    // Set tier prices as owner
    await BillboardInstance.setTierPrice(1, "100000000000000000", {from: ownerAddress}); // 0.1 ETH
    await BillboardInstance.setTierPrice(2, "10000000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(3, "1000000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(4, "100000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(5, "10000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(6, "1000000000000", {from: ownerAddress});
  });

  it("Should not be possible to mint without sending ETH", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Should not be able to mint slot 5 again
    await truffleAssert.reverts(
      BillboardInstance.mintSlotWithData(
        0, 
        1, 
        "adImageParam1",
        "redirectUrlParam1",
        true,
        "ownerNameParam1",
        {from: userAddress, value: "0"}),
      "Invalid ETH paid"
    );

  });

  it("Should not be possible to mint same slot twice", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Mint slot 5
    var resultMint = await BillboardInstance.mintSlot(0, 5, {from: userAddress, value: "100000000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    // Should not be able to mint slot 5 again
    await truffleAssert.reverts(
      BillboardInstance.mintSlot(0, 5, {from: userAddress, value: "100000000000000000"}),
      "Slot already minted"
    );

  });

  it("Should not be possible to mint slot on non existing board", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Should not be able to mint for board 1
    await truffleAssert.reverts(
      BillboardInstance.mintSlot(1, 5, {from: userAddress, value: "100000000000000000"}),
      "Board does not exist"
    );

  });

  it("Should not be possible to mint if wrong ETH paid", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Should not be able to mint 
    await truffleAssert.reverts(
      BillboardInstance.mintSlot(0, 2, {from: userAddress, value: "123"}),
      "Invalid ETH paid"
    );

    // Should not be able to mint 
    await truffleAssert.reverts(
      BillboardInstance.mintSlot(0, 2, {from: userAddress, value: "3000000000000000000"}),
      "Invalid ETH paid"
    );

  });

  it("Should not be possible to mint if slot invalid", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Should not be able to mint 
    await truffleAssert.reverts(
      BillboardInstance.mintSlot(0, 443, {from: userAddress, value: "123"}),
      "Invalid slot"
    );

  });

});

contract("Create new board and mint", function(accounts) {

  before("Set tier prices", async function () {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();

    // Set tier prices as owner
    await BillboardInstance.setTierPrice(1, "100000000000000000", {from: ownerAddress}); // 0.1 ETH
    await BillboardInstance.setTierPrice(2, "10000000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(3, "1000000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(4, "100000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(5, "10000000000000", {from: ownerAddress});
    await BillboardInstance.setTierPrice(6, "1000000000000", {from: ownerAddress});
  });

  it("Should be possible to mint tokens on new board", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Set total boards
    let resultSetOwner = await BillboardInstance.setTotalBoards(10, {from: ownerAddress});

    // Mint
    var resultMint = await BillboardInstance.mintSlot(9, 2, {from: userAddress, value: "100000000000000000"});
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");
  });

});

