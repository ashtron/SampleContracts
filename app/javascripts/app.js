// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.css"

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import helloworld_artifacts from '../../build/contracts/HelloWorld.json'
import multisigwallet_artifacts from '../../build/contracts/MultisigWallet'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var HelloWorld = contract(helloworld_artifacts);
var MultiSig = contract(multisigwallet_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    HelloWorld.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
    });
  },

  greet: function() {
    var that = this;

    HelloWorld.deployed().then(function(instance) {
      return instance.greet.call();
    }).then(function(greeting) {
      console.log(greeting);
      $(".hello-world-display").innerHTML = greeting;
    });
  }
};

$("document").ready(function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  $(".btn-greet").click(function() {
    App.greet();
  });

  App.start();
});
