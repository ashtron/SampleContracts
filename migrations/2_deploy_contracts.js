var HelloWorld = artifacts.require("./HelloWorld.sol");
var MultisigWallet = artifacts.require("./MultisigWallet.sol");

module.exports = function(deployer) {
  deployer.deploy(HelloWorld, "Hello, world!");
  deployer.deploy(MultisigWallet, { from: web3.eth.accounts[0], value: web3.toWei(5, 'ether') });
  deployer.deploy(Voting, { from: web3.eth.accounts[0], value: web3.toWei(5, 'ether') });
};
