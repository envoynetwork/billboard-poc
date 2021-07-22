const truffleAssert = require('truffle-assertions');

const EnvoyBillboard = artifacts.require("EnvoyBillboard");

//
// ******************* GETTERS/SETTERS *******************
//
contract("Owner can update metadata", function(accounts) {

  before("Mint 10 tokens", async function () {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await EnvoyBillboard.deployed();

    // Loop to create tokens
    for (let index = 0; index < 10; index++) {
      let resultMint = await BillboardInstance.mintToken(
        index, 
        "imageParam",
        "cityParam",
        {from: ownerAddress}
      );
      assert.equal(resultMint.receipt.status, true, "Transaction should succeed");
    }
  });

  it("Owner should be able to set all metadata at once", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await EnvoyBillboard.deployed();
  
    // Set metadata
    let resultSetMetaData = await BillboardInstance.setMetaData(
      1, 
      "adImageParam",
      "redirectUrlParam",
      true,
      "ownerNameParam", 
      {from: ownerAddress}
    );
    assert.equal(resultSetMetaData.receipt.status, true, "Transaction should succeed");

    // Get ERC721 token URI
    let resultGetTokenUri = await BillboardInstance.tokenURI(1);
    assert.equal(resultGetTokenUri, "adImageParam", "Wrong ERC721 token URI");

    // Get all metadata
    let resultGetData = await BillboardInstance._tokenData(1);
    assert.equal(resultGetData.adImage, "adImageParam", "Wrong adImage");
    assert.equal(resultGetData.redirectUrl, "redirectUrlParam", "Wrong redirectUrl");
    assert.equal(resultGetData.status, true, "Wrong status");
    assert.equal(resultGetData.ownerName, "ownerNameParam", "Wrong ownerName");
  });

  it("Owner should be able to set all metadata separately", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await EnvoyBillboard.deployed();
  
    // Set metadata
    let resultAdImage = await BillboardInstance.setAdImage(
      1, 
      "adImageParam",
      {from: ownerAddress}
    );
    assert.equal(resultAdImage.receipt.status, true, "Transaction should succeed");

    let resultRedirectUrl = await BillboardInstance.setRedirectUrl(
      1, 
      "redirectUrlParam",
      {from: ownerAddress}
    );
    assert.equal(resultRedirectUrl.receipt.status, true, "Transaction should succeed");

    let resultStatus = await BillboardInstance.setStatus(
      1, 
      true,
      {from: ownerAddress}
    );
    assert.equal(resultStatus.receipt.status, true, "Transaction should succeed");

    let resultOwnerName = await BillboardInstance.setOwnerName(
      1, 
      "ownerNameParam",
      {from: ownerAddress}
    );
    assert.equal(resultOwnerName.receipt.status, true, "Transaction should succeed");

    // Get ERC721 token URI
    let resultGetTokenUri = await BillboardInstance.tokenURI(1);
    assert.equal(resultGetTokenUri, "adImageParam", "Wrong ERC721 token URI");

    // Get all metadata
    let resultGetData = await BillboardInstance._tokenData(1);
    assert.equal(resultGetData.adImage, "adImageParam", "Wrong adImage");
    assert.equal(resultGetData.redirectUrl, "redirectUrlParam", "Wrong redirectUrl");
    assert.equal(resultGetData.status, true, "Wrong status");
    assert.equal(resultGetData.ownerName, "ownerNameParam", "Wrong ownerName");
  });

  it("Should not be able to set data if not owner", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await EnvoyBillboard.deployed();
  
    // Set metadata
    await truffleAssert.reverts(
      BillboardInstance.setMetaData(
        1, 
        "adImageParam",
        "redirectUrlParam",
        true,
        "ownerNameParam", 
        {from: userAddress}
      ),
      "Only owner can update metadata"
    );

    await truffleAssert.reverts(
      BillboardInstance.setAdImage(
        1, 
        "adImageParam",
        {from: userAddress}
      ),
      "Only owner can update metadata"
    );
    
    await truffleAssert.reverts(
      BillboardInstance.setRedirectUrl(
        1, 
        "redirectUrlParam",
        {from: userAddress}
      ),
      "Only owner can update metadata"
    );

    await truffleAssert.reverts(
      BillboardInstance.setStatus(
        1, 
        true,
        {from: userAddress}
      ),
      "Only owner can update metadata"
    );

    await truffleAssert.reverts(
      BillboardInstance.setOwnerName(
        1, 
        "ownerNameParam",
        {from: userAddress}
      ),
      "Only owner can update metadata"
    );
  });

});


//
// ******************* TRANSFERABILITY *******************
//
contract("Owner can transfer token", function(accounts) {

  before("Mint 10 tokens", async function () {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await EnvoyBillboard.deployed();

    // Loop to create tokens
    for (let index = 0; index < 10; index++) {
      let resultMint = await BillboardInstance.mintToken(
        index, 
        "imageParam",
        "cityParam",
        {from: ownerAddress}
      );
      assert.equal(resultMint.receipt.status, true, "Transaction should succeed");
    }
  });

  it("Owner should be able to transfer token", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await EnvoyBillboard.deployed();
  
    // Transfer
    await BillboardInstance.transferFrom(ownerAddress, userAddress, 1, {from: ownerAddress});

    // Can not transfer again
    await truffleAssert.reverts(
      BillboardInstance.transferFrom(ownerAddress, userAddress, 1, {from: ownerAddress}),
      "ERC721: transfer caller is not owner nor approved"
    );
  });

});


//
// ******************* OWNERSHIP *******************
//
contract("Update contract owner and minter address", function(accounts) {

  it("Should be possible for owner to update minter and owner", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await EnvoyBillboard.deployed();
  
    // Update minter
    let resultSetMinter = await BillboardInstance.updateContractMinter(userAddress, {from: ownerAddress});
    assert.equal(resultSetMinter.receipt.status, true, "Transaction should succeed");

    // Update owner
    let resultSetOwner = await BillboardInstance.updateContractOwner(userAddress, {from: ownerAddress});
    assert.equal(resultSetOwner.receipt.status, true, "Transaction should succeed");
  });

});

contract("Only owner can transfer ownership and upate minter", function(accounts) {

  it("Should not be possible to change owner and minter by user", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await EnvoyBillboard.deployed();
  
    // Update minter
    await truffleAssert.reverts(
      BillboardInstance.updateContractMinter(userAddress, {from: userAddress}),
      "Only owner can update contract minter"
    );

    // Update owner
    await truffleAssert.reverts(
      BillboardInstance.updateContractOwner(userAddress, {from: userAddress}),
      "Only owner can transfer ownership"
    );
  });

});


//
// ******************* MINTING *******************
//
contract("Mint new tokens", function(accounts) {

  it("Minter should be able to mint tokens with and without metadata", async () => {

    // Const
    const ownerAddress = accounts[0];
    const userAddress = accounts[1];
    const BillboardInstance = await EnvoyBillboard.deployed();
  
    // Update minter
    let resultSetMinter = await BillboardInstance.updateContractMinter(userAddress, {from: ownerAddress});
    assert.equal(resultSetMinter.receipt.status, true, "Transaction should succeed");

    // Mint
    let resultMint = await BillboardInstance.mintToken(
      0, 
      "imageParam",
      "cityParam",
      {from: userAddress}
    );
    assert.equal(resultMint.receipt.status, true, "Transaction should succeed");

    // Get metadata
    var resultGetData = await BillboardInstance._tokenData(0);
    assert.equal(resultGetData.image, "imageParam", "Wrong image");
    assert.equal(resultGetData.city, "cityParam", "Wrong city");

    // Mint with all metadata
    let resultMintWithData = await BillboardInstance.mintTokenWithData(
      1, 
      "imageParam",
      "cityParam",
      "adImageParam",
      "redirectUrlParam",
      true,
      "ownerNameParam", 
      {from: userAddress}
    );
    assert.equal(resultMintWithData.receipt.status, true, "Transaction should succeed");

    // Get metadata
    resultGetData = await BillboardInstance._tokenData(1);
    assert.equal(resultGetData.image, "imageParam", "Wrong image");
    assert.equal(resultGetData.city, "cityParam", "Wrong city");
    assert.equal(resultGetData.adImage, "adImageParam", "Wrong adImage");
    assert.equal(resultGetData.redirectUrl, "redirectUrlParam", "Wrong redirectUrl");
    assert.equal(resultGetData.status, true, "Wrong status");
    assert.equal(resultGetData.ownerName, "ownerNameParam", "Wrong ownerName");
  });

  it("Should not be able to mint same token twice", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await EnvoyBillboard.deployed();
  
    // Mint
    await truffleAssert.reverts(
      BillboardInstance.mintToken(
        0, 
        "imageParam",
        "cityParam",
        {from: userAddress}
      ),
      "Token already exists"
    );

    // Mint with all metadata
    await truffleAssert.reverts(
      BillboardInstance.mintTokenWithData(
        0, 
        "imageParam",
        "cityParam",
        "adImageParam",
        "redirectUrlParam",
        true,
        "ownerNameParam", 
        {from: userAddress}
      ),
      "Token already exists"
    );
  });

});

contract("Mint new tokens access right", function(accounts) {

  it("Only minter address can mint", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await EnvoyBillboard.deployed();
  
    // Mint
    await truffleAssert.reverts(
      BillboardInstance.mintToken(
        0, 
        "imageParam",
        "cityParam",
        {from: userAddress}
      ),
      "Only minter address can mint"
    );

    // Mint with all metadata
    await truffleAssert.reverts(
      BillboardInstance.mintTokenWithData(
        1, 
        "imageParam",
        "cityParam",
        "adImageParam",
        "redirectUrlParam",
        true,
        "ownerNameParam", 
        {from: userAddress}
      ),
      "Only minter address can mint"
    );
  });

});
