const EnvoyBillboard = artifacts.require("EnvoyBillboard"); 

module.exports = function(deployer) {
	deployer.deploy(EnvoyBillboard, "EnvoyBillboard", "EB");
};