pragma solidity ^0.4.10;

contract HelloWorld {
  string greeting;

  function HelloWorld(string _greeting) {
    greeting = _greeting;
  }

  function greet() returns(string) {
    return greeting;
  }
}
