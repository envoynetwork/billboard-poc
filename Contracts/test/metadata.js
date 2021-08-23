const truffleAssert = require('truffle-assertions');
const truffleHelpers = require('openzeppelin-test-helpers');

const Decentraboard = artifacts.require("Decentraboard");

contract("Owner can update metadata", function(accounts) {

  it("Owner should be able to set all metadata at once", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();

    await BillboardInstance.mintSlot(0, 1, {from: ownerAddress, value: 0});
    await BillboardInstance.mintSlot(0, 2, {from: ownerAddress, value: 0});

    // Set metadata
    var resultSetMetaData = await BillboardInstance.setMetaData(
      0,
      1, 
      "adImageParam1",
      "redirectUrlParam1",
      true,
      "ownerNameParam1", 
      {from: ownerAddress}
    );
    assert.equal(resultSetMetaData.receipt.status, true, "Transaction should succeed");

    resultSetMetaData = await BillboardInstance.setMetaData(
      0,
      2, 
      "adImageParam2",
      "redirectUrlParam2",
      true,
      "ownerNameParam2", 
      {from: ownerAddress}
    );
    assert.equal(resultSetMetaData.receipt.status, true, "Transaction should succeed");

    // Get all metadata
    var resultGetData = await BillboardInstance._tokenData(0, "1");
    assert.equal(resultGetData.adImage, "adImageParam1", "Wrong adImage");
    assert.equal(resultGetData.redirectUrl, "redirectUrlParam1", "Wrong redirectUrl");
    assert.equal(resultGetData.forSale, true, "Wrong forSale");
    assert.equal(resultGetData.ownerName, "ownerNameParam1", "Wrong ownerName");

    resultGetData = await BillboardInstance._tokenData(0, "2");
    assert.equal(resultGetData.adImage, "adImageParam2", "Wrong adImage");
    assert.equal(resultGetData.redirectUrl, "redirectUrlParam2", "Wrong redirectUrl");
    assert.equal(resultGetData.forSale, true, "Wrong forSale");
    assert.equal(resultGetData.ownerName, "ownerNameParam2", "Wrong ownerName");
  });

  it("Owner should be able to set all metadata separately", async () => {

    // Const
    const ownerAddress = accounts[0];
    const BillboardInstance = await Decentraboard.deployed();

    await BillboardInstance.mintSlot(0, 5, {from: ownerAddress, value: 0});
  
    // Set metadata
    let resultAdImage = await BillboardInstance.setAdImage(
      0,
      5, 
      "adImageParam",
      {from: ownerAddress}
    );
    assert.equal(resultAdImage.receipt.status, true, "Transaction should succeed");

    let resultRedirectUrl = await BillboardInstance.setRedirectUrl(
      0,
      5, 
      "redirectUrlParam",
      {from: ownerAddress}
    );
    assert.equal(resultRedirectUrl.receipt.status, true, "Transaction should succeed");

    let resultStatus = await BillboardInstance.setForSale(
      0,
      5, 
      true,
      {from: ownerAddress}
    );
    assert.equal(resultStatus.receipt.status, true, "Transaction should succeed");

    let resultOwnerName = await BillboardInstance.setOwnerName(
      0,
      5, 
      "ownerNameParam",
      {from: ownerAddress}
    );
    assert.equal(resultOwnerName.receipt.status, true, "Transaction should succeed");

    // Get all metadata
    let resultGetData = await BillboardInstance._tokenData(0, 5);
    assert.equal(resultGetData.adImage, "adImageParam", "Wrong adImage");
    assert.equal(resultGetData.redirectUrl, "redirectUrlParam", "Wrong redirectUrl");
    assert.equal(resultGetData.forSale, true, "Wrong forSale");
    assert.equal(resultGetData.ownerName, "ownerNameParam", "Wrong ownerName");
  });

  it("Should not be able to set data if not owner", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Set metadata
    await truffleAssert.reverts(
      BillboardInstance.setMetaData(
        0,
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
        0,
        1, 
        "adImageParam",
        {from: userAddress}
      ),
      "Only owner can update metadata"
    );
    
    await truffleAssert.reverts(
      BillboardInstance.setRedirectUrl(
        0,
        1, 
        "redirectUrlParam",
        {from: userAddress}
      ),
      "Only owner can update metadata"
    );

    await truffleAssert.reverts(
      BillboardInstance.setForSale(
        0,
        1, 
        true,
        {from: userAddress}
      ),
      "Only owner can update metadata"
    );

    await truffleAssert.reverts(
      BillboardInstance.setOwnerName(
        0,
        1, 
        "ownerNameParam",
        {from: userAddress}
      ),
      "Only owner can update metadata"
    );
  });

  it("Should not be able to set data if token does not exist", async () => {

    // Const
    const userAddress = accounts[1];
    const BillboardInstance = await Decentraboard.deployed();
  
    // Set metadata
    await truffleAssert.reverts(
      BillboardInstance.setMetaData(
        0,
        100, 
        "adImageParam",
        "redirectUrlParam",
        true,
        "ownerNameParam", 
        {from: userAddress}
      ),
      "Token does not exist"
    );

    await truffleAssert.reverts(
      BillboardInstance.setAdImage(
        0,
        100, 
        "adImageParam",
        {from: userAddress}
      ),
      "Token does not exist"
    );
    
    await truffleAssert.reverts(
      BillboardInstance.setRedirectUrl(
        0,
        100, 
        "redirectUrlParam",
        {from: userAddress}
      ),
      "Token does not exist"
    );

    await truffleAssert.reverts(
      BillboardInstance.setForSale(
        0,
        100, 
        true,
        {from: userAddress}
      ),
      "Token does not exist"
    );

    await truffleAssert.reverts(
      BillboardInstance.setOwnerName(
        0,
        100, 
        "ownerNameParam",
        {from: userAddress}
      ),
      "Token does not exist"
    );
  });

});
