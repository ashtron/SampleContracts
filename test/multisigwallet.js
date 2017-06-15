var MultisigWallet = artifacts.require("./MultisigWallet.sol");

contract('MultisigWallet', function(accounts) {
  var contract;

  beforeEach(function() {
     return MultisigWallet.new()
     .then(function(instance) {
        contract = instance;
     });
  });

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
      return instance.authorizedAddrs.call(web3.eth.accounts[1]);
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

  it("should allow authorized addresses to propose new transactions", function() {
    return MultisigWallet.deployed().then(function(instance) {
      assert.equal(instance.pendingTransactionsLength.call(), 0);

      instance.proposeTransaction(1000, web3.eth.accounts[9], "Description", { from: web3.eth.accounts[0] });

      return instance;
    }).then(function(instance) {
      return instance.pendingTransactionsLength.call();
    }).then(function(length) {
      assert.equal(length, 1);
    });
  });

  it("should automatically execute transaction when approved", function() {
    return MultisigWallet.deployed().then(function(instance) {
      var initialBalance = web3.eth.getBalance(web3.eth.accounts[3]);
      initialBalance = parseInt(web3.fromWei(initialBalance));

      instance.authorizeAddress(web3.eth.accounts[1], { from: web3.eth.accounts[0] });
      instance.authorizeAddress(web3.eth.accounts[2], { from: web3.eth.accounts[0] });

      instance.proposeTransaction(web3.toWei(1, 'ether'), web3.eth.accounts[3], "Description", { from: web3.eth.accounts[0] });

      instance.signTransaction(0, { from: web3.eth.accounts[1] });
      instance.signTransaction(0, { from: web3.eth.accounts[2] });

      return initialBalance;
    }).then(function(initialBalance) {
      var newBalance = web3.eth.getBalance(web3.eth.accounts[3]);
      newBalance = parseInt(web3.fromWei(newBalance));

      assert.equal(newBalance, initialBalance + 1);
    });
  });
});
