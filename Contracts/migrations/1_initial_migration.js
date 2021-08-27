const Decentraboard = artifacts.require("Decentraboard"); 

module.exports = function(deployer) {
	deployer.deploy(Decentraboard, "Decentraboard", "BOARD");
};
