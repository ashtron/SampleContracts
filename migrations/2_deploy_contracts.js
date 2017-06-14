var HelloWorld = artifacts.require("./HelloWorld.sol");
var MultisigWallet = artifacts.require("./MultisigWallet.sol");

module.exports = function(deployer) {
  deployer.deploy(HelloWorld, "Hello, world!");
  deployer.deploy(MultisigWallet);
};
