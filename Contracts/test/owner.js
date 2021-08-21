const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const Decentraboard = artifacts.require("Decentraboard");

contract("Contract owner actions", function(accounts) {

  it("Should be possible for owner to update token URI", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Set Token URI as owner
    await BillboardInstance.setTokenURI("https://www.decentraboard.com/slots/", ".json", {from: ownerAddress});
    
    // Mint token
    await BillboardInstance.mintSlot(0, 0, {from: ownerAddress, value: 0});

    // Check result
    let result = await BillboardInstance.tokenURI(0);
    assert.equal(result, "https://www.decentraboard.com/slots/0-0.json", "Token URI should be set");
  });

  it("Should be possible for owner to update contract URI", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Set contract URI as owner
    await BillboardInstance.setContractURI("https://www.decentraboard.com/contract.json", {from: ownerAddress});

    // Check result
    let result = await BillboardInstance.contractURI();
    assert.equal(result, "https://www.decentraboard.com/contract.json", "Contract URI should be set");
  });

  it("Should be possible for owner to update tier price", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Set tier price as owner
    await BillboardInstance.setTierPrice(1, "120000000000000000", {from: ownerAddress});

    // Check result
    let result = await BillboardInstance._tierPrice(1);
    assert.equal(result, "120000000000000000", "Tier price should be set");
  });
  
  it("Should be possible for owner to set amount of active boards", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Update owner
    let resultSetOwner = await BillboardInstance.setTotalBoards(10, {from: ownerAddress});
    assert.equal(resultSetOwner.receipt.status, true, "Transaction should succeed");
  });

  it("Should be possible for owner to update slot image URI", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Set slot image URI as owner
    await BillboardInstance.setSlotImageURI("https://www.decentraboard.com/slotimage/", ".png", {from: ownerAddress});
    
    // Mint token
    await BillboardInstance.mintSlot(0, 20, {from: ownerAddress, value: 0});

    // Check result
    let result = await BillboardInstance.slotImageURI(0, 8);
    assert.equal(result, "https://www.decentraboard.com/slotimage/0-8.png", "Image URI should be set");
  });

  it("Should be possible for owner to set token lock", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Set wallet to receive funds on
    let resultLock = await BillboardInstance.setLock(0, 1, 123, {from: ownerAddress});
    assert.equal(resultLock.receipt.status, true, "Transaction should succeed");
  });

  it("Should be possible for owner to update wallet", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Set wallet to receive funds on
    await BillboardInstance.updateWallet(userAddress, {from: ownerAddress});
  
  });

  it("Should be possible for owner to update owner", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Update owner
    let resultSetOwner = await BillboardInstance.updateContractOwner(userAddress, {from: ownerAddress});
    assert.equal(resultSetOwner.receipt.status, true, "Transaction should succeed");
  });

});

contract("Contract access", function(accounts) {

  it("Should only be possible for the contract owner to set the token URI", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Update base URI
    await truffleAssert.reverts(
      BillboardInstance.setTokenURI(
        "https://fakesite.com/",
        ".json",
        {from: userAddress}
      ),
      "Only contract owner can update URI"
    );
  });

  it("Should only be possible for the contract owner to set the slot image URI", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Update base URI
    await truffleAssert.reverts(
      BillboardInstance.setSlotImageURI(
        "https://fakesite.com/",
        ".png",
        {from: userAddress}
      ),
      "Only contract owner can update slot image URI"
    );
  });

  it("Should only be possible for the contract owner to set the contract URI", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Update base URI
    await truffleAssert.reverts(
      BillboardInstance.setContractURI(
        "https://www.fakesite.com/contract.json",
        {from: userAddress}
      ),
      "Only contract owner can update contract URI"
    );
  });

  it("Should only be possible for the contract owner to set a tier price", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Update base URI
    await truffleAssert.reverts(
      BillboardInstance.setTierPrice(
        1,
        "10000000000000000000",
        {from: userAddress}
      ),
      "Only contract owner can update tier price"
    );
  });

  it("Should only be possible for the contract owner to transfer ownership", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Update owner
    await truffleAssert.reverts(
      BillboardInstance.updateContractOwner(userAddress, {from: userAddress}),
      "Only contract owner can transfer ownership"
    );
  });

  it("Should only be possible for the contract owner to set number of active boards", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Update owner
    await truffleAssert.reverts(
      BillboardInstance.setTotalBoards(10, {from: userAddress}),
      "Only contract owner can set total amount of boards"
    );
  });

  it("Should only be possible for the contract owner to set wallet", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Update owner
    await truffleAssert.reverts(
      BillboardInstance.updateWallet(userAddress, {from: userAddress}),
      "Only contract owner can update wallet"
    );
  });

  it("Should only be possible for the contract owner to set token lock", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();

    // Update owner
    await truffleAssert.reverts(
      BillboardInstance.setLock(0, 1, 123, {from: userAddress}),
      "Only owner can update token lock"
    );
  });

});
