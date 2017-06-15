pragma solidity ^0.4.10;

contract MultisigWallet {
  struct Transaction {
    uint value;
    address to;
    address[] signers;
    bool completed;
    string description;
  }

  address creator;

  mapping(address => bool) public authorizedAddrs;
  uint8 public authorizedAddrsLength;

  Transaction[] public pendingTransactions;
  uint8 public pendingTransactionsLength;

  function MultisigWallet() payable {
    creator = msg.sender;
    authorizedAddrs[msg.sender] = true;
    authorizedAddrsLength = 1;
    pendingTransactionsLength = 0;
  }

  modifier isAuthorized { require(authorizedAddrs[msg.sender]); _; }
  modifier onlyOwner { require(msg.sender == creator); _; }
  // hasn't already signed modifier

  function authorizeAddress(address addr) onlyOwner {
    authorizedAddrs[addr] = true;
    authorizedAddrsLength += 1;
  }

  function deposit() payable {

  }

  function proposeTransaction(uint _value, address _to, string _description) isAuthorized {
    pendingTransactions.push(Transaction({
      value: _value,
      to: _to,
      signers: new address[](0),
      completed: false,
      description: _description
    }));

    pendingTransactions[pendingTransactionsLength].signers.push(msg.sender);
    pendingTransactionsLength += 1;
  }

  function getSigners(uint8 transactionID) returns(uint) {
    return pendingTransactions[transactionID].signers.length;
  }

  function getTransactionData(uint8 transactionID) returns(uint value, address to, bool completed, uint length, uint authLength) {
    Transaction transaction = pendingTransactions[transactionID];
    return (transaction.value, transaction.to, transaction.completed, transaction.signers.length, authorizedAddrsLength);
  }

  function signTransaction(uint8 transactionID) isAuthorized {
    Transaction transaction = pendingTransactions[transactionID];

    transaction.signers.push(msg.sender);

    if (transaction.signers.length == authorizedAddrsLength) {
      transaction.to.transfer(transaction.value);
      transaction.completed = true;
    }
  }
}
