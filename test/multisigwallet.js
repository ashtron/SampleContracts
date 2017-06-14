var MultisigWallet = artifacts.require("./MultisigWallet.sol");

contract('MultisigWallet', function(accounts) {
  it("should authorize the contract creator's address on deployment", function() {
    return MultisigWallet.deployed().then(function(instance) {
      return instance.authorizedAddrs.call(web3.eth.accounts[0]);
    }).then(function(result) {
      assert.isTrue(result);
    });
  });

  it("should allow creator to authorize an address", function() {
    return MultisigWallet.deployed().then(function(instance) {
      instance.authorizeAddress(web3.eth.accounts[1], {from: web3.eth.accounts[0]});
      return instance;
    }).then(function(instance) {
      return instance.authorizedAddrs.call(web3.eth.accounts[0]);
    }).then(function(result) {
      assert.isTrue(result);
    });
  });

  it("should not allow non-creator to authorize a new address", function() {
    return MultisigWallet.deployed().then(function(instance) {
      return instance.authorizeAddress(web3.eth.accounts[2], {from: web3.eth.accounts[1]});
    }).catch(function(err) {
      assert.isNotNull(err);
    });
  });

  it("should allow authorized addresses to propose a new transactions", function() {
    return MultisigWallet.deployed().then(function(instance) {
      instance.proposeTransaction(1000, web3.eth.accounts[9], "Description");
      return instance;
    }).then(function(instance) {
      var transaction = instance.pendingTransactions[0];

      assert.equal(transaction)
    });
  });
});
