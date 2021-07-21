const truffleAssert = require('truffle-assertions');

const EnvoyBillboard = artifacts.require("EnvoyBillboard");

//
// ******************* GETTERS/SETTERS *******************
//
contract("Owner can update metadata", function(accounts) {

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

});


//
// ******************* TRANSFERABILITY *******************
//
contract("Owner can transfer token", function(accounts) {

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
// ******************* ACCESS RIGHTS *******************
//
contract("No access if not owner", function(accounts) {

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
  });

});

