pragma solidity ^0.4.10;

contract Voting {
  struct Candidate {
    string name;
    uint votes;
  }

  address creator;
  Candidate[] candidates;
  mapping(address => bool) public voters;

  modifier isAuthorized { require(voters[msg.sender]); _; }
  modifier onlyOwner { require(msg.sender == creator); _; }

  function Voting() payable {
  }

  function addCandidate(string _name) onlyOwner {
    // Check that candidate doesn't already exist here.

    candidates.push(Candidate({
      name: _name,
      votes: 0
    }));
  }

  function vote(string name) {
  }
}
