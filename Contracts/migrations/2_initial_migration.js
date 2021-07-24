const EnvoyBillboard = artifacts.require("EnvoyBillboard"); 

module.exports = function(deployer) {
	deployer.deploy(EnvoyBillboard, "Envoy Billboard", "BOARD");
};
