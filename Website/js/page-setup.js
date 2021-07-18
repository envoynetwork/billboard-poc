import { abiBillboard } from './abi-billboard.js'

import { webProvider, billboardAddress } from './settings.js'

// var contractBillboard;

export const loadSetupPage = async () => {

  $("#b_connectWallet").click(function() {
    console.log("connect wallet...");
    connectWallet();
  });

  $("#s_button").click(function() {
    var index = document.getElementById("s_index").value;
    var uri = document.getElementById("s_uri").value;

    console.log("BUTTON CLICK: " + index + " - " + uri);

    const web3 = new Web3(window.ethereum);

    const contractBillboard = new web3.eth.Contract(abiBillboard, billboardAddress);

    contractBillboard.methods.setTokenURI(index, uri).send({ from: window.web3.eth.defaultAccount,}).then(function(r,e) {
        console.log("Done");
        console.log(r);
        
    }).catch (function (error){
        console.log("error:");
        console.log(error);
    });
  });

  loadGrid();

}

//
// ********************* SETUP WALLET *********************
//

async function connectWallet() {

  // Modern dapp browsers...
  if (window.ethereum) {

    window.web3 = new Web3(window.ethereum);
    // window.web3 = new Web3(new Web3.providers.HttpProvider(webProvider));

    try {
      // Request account access if needed
      ethereum.enable();

      // New promise
      return new Promise((resolve, reject) => {

        // Get accounts
        window.web3.eth.getAccounts(function (error, result) {

          // Set default address
          window.web3.eth.defaultAccount = result[0];
          console.log("[Common] - Set default address: " + window.web3.eth.defaultAccount);


          if (result.length == 0) {

            // Reject promise
            reject("No accounts found..");
          } else {

            // Show address in nav bar
            var defaultAddress = window.web3.eth.defaultAccount;
            var firstSix = defaultAddress.substr(0, 6);
            var lastFour = defaultAddress.substr(defaultAddress.length - 4);
            var shortAddress = firstSix + "..." + lastFour
            $("#t_wallet_address").html(shortAddress);

            // Unhide the address block
            var wallet = document.getElementById("t_wallet_block");
            wallet.style.display = "";

            // Resolve promise 
            resolve(defaultAddress);
          }
        });
      });

    } catch (error) {

      // User denied account access...
      console.log('[Common] - User denied access');

      // Show browser alert
      alert("MetaMask access denied. Reload the page to log in.");
    }

  }

  // Legacy dapp browsers...
  // else if (window.web3) {

  //     // window.web3 = new Web3(web3.currentProvider);
  //     window.web3 = new Web3(new Web3.providers.HttpProvider(webProvider));

  // }

  // Non-dapp browsers
  else {
    console.log('[Common] - No Ethereum browser detected');
    window.location.href = "/start";
  }
}





//
// ********************* FEATURES *********************
//


function loadGrid() {

  const web3 = new Web3(window.ethereum);

  const contractBillboard = new web3.eth.Contract(abiBillboard, billboardAddress);

  contractBillboard.methods.tokenURI(0).call().then(function(r,e) {

      // TODO: set default image & link?

      console.log("result: ");
      console.log(r);

      console.log("error: ");
      console.log(e);
  });

}


