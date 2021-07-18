const truffleAssert = require('truffle-assertions');

const EnvoyBillboard = artifacts.require("EnvoyBillboard");


contract("Main", function(accounts) {

  it("Owner should be able to set URL", async () => {

    //
    // Setup contracts
    //

    const BillboardInstance = await EnvoyBillboard.deployed();
  
    let ownerAddress = accounts[0];

    let result1 = await BillboardInstance.setTokenURI(1, "https://www.google.com", {from: ownerAddress});

    let result = await BillboardInstance.tokenURI(1);

    console.log("The result: " + result);

    assert.equal(result, "helloWorld-wrong", "Wrong return string");

  });

});