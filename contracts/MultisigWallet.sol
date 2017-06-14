pragma solidity ^0.4.10;

contract MultisigWallet {
  struct Transaction {
    uint value;
    address to;
    address[] signers;
    bool signed;
  }

  mapping(address => bool) authorizedAddrs;
  uint authorizedAddrsLength;
  Transaction[] pendingTransactions;

  function MultisigWallet(address[] _addrs) {
    for (uint i = 0; i < _addrs.length; i++) {
      authorizedAddrs[_addrs[i]] = true;
    }

    authorizedAddrsLength = i;
  }

  modifier isAuthorized {
    require(authorizedAddrs[msg.sender]);

    _;
  }

  function enterTransaction(uint _value, address _to) isAuthorized {
    Transaction emptyTransaction = pendingTransactions[pendingTransactions.length];

    emptyTransaction.value = _value;
    emptyTransaction.to = _to;
    emptyTransaction.signers.push(msg.sender);
    emptyTransaction.signed = false;
  }

  function signTransaction(uint transactionID) isAuthorized {
    Transaction transaction = pendingTransactions[transactionID];

    transaction.signers.push(msg.sender);
  }

  function authorizeTransfer(address authorizer, uint transactionID) isAuthorized {
    Transaction transaction = pendingTransactions[transactionID];

    address _to = transaction.to;
    uint value = transaction.value;

    _to.transfer(value);
  }
}
