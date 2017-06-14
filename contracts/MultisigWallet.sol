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

  function MultisigWallet() {
    creator = msg.sender;
    authorizedAddrs[msg.sender] = true;
    authorizedAddrsLength = 1;
  }

  modifier isAuthorized { require(authorizedAddrs[msg.sender]); _; }
  modifier onlyOwner { require(msg.sender == creator); _; }
  // hasn't already signed modifier

  function authorizeAddress(address addr) onlyOwner {
    authorizedAddrs[addr] = true;
    authorizedAddrsLength += 1;
  }

  function proposeTransaction(uint _value, address _to, string _description) isAuthorized {
    pendingTransactions.push(Transaction({
      value: _value,
      to: _to,
      signers: new address[](0),
      completed: false,
      description: _description
    }));

    pendingTransactions[pendingTransactions.length - 1].signers.push(msg.sender);
  }

  function test() returns(uint) {
    return pendingTransactions[0].signers.length;
  }

  function signTransaction(uint transactionID) isAuthorized {
    Transaction transaction = pendingTransactions[transactionID];

    transaction.signers.push(msg.sender);

    if (transaction.signers.length == authorizedAddrsLength) {
      transaction.to.transfer(transaction.value);
      transaction.completed = true;
    }
  }

  function getDebugData() returns(string) {
  }
}
