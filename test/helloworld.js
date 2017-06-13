var HelloWorld = artifacts.require("./HelloWorld.sol");

contract('HelloWorld', function(accounts) {
  it("should return the right greeting", function() {
    return HelloWorld.deployed().then(function(instance) {
      return instance.greet.call();
    }).then(function(greeting) {
      assert.equal(greeting, "Hello, world!");
    });
  });
});
