// The ABI (Application Binary Interface) is the interface of the smart contract
import { abiBillboard } from './abi-billboard.js'

// Settings will be differ
import { webProvider, billboardAddress } from './settings.js'

const web3 = new Web3(window.ethereum);
const contractBillboard = new web3.eth.Contract(abiBillboard, billboardAddress);

var connectedWallet;

//
// ********************* PAGE SETUP *********************
//

export const loadPage = async () => {

  // First we need to check if a Web3 browser extension was found
  if (window.ethereum) {
    setupPage();
  } else {
    alert("You need to install a Web3 browser extension and connect to the correct network.");
  }

}

async function setupPage() {

  $("#b_connectWallet").click(function () {
    connectWallet();
  });

  $("#s_button").click(function () {
    var index = document.getElementById("s_index").value;
    var uri = document.getElementById("s_uri").value;

    // Smart contract call
    contractBillboard.methods.setTokenURI(index, uri).send({ from: connectedWallet, }).then(function (r, e) {
      console.log("Done");
      console.log(r);
    }).catch(function (error) {
      console.log("error:");
      console.log(error);
    });
  });

  // Load grid
  loadGrid();
}

//
// ********************* SETUP WALLET *********************
//

async function connectWallet() {
  var accounts = await ethereum.request({ method: 'eth_accounts' });
  connectedWallet = accounts[0];
  $("#i_wallet_address").html(connectedWallet);

  // Visual
  var buttonConnect = document.getElementById("b_connectWallet");
  buttonConnect.style.display = "none";

  var blockSetters = document.getElementById("d_connectWallet");
  blockSetters.style.display = "";

  var blockSetters = document.getElementById("d_setters");
  blockSetters.style.display = "";
}

//
// ********************* FORM *********************
//



//
// ********************* GRID *********************
//


function loadGrid() {

  // Create list HTML
  var listHtml = ""
  for (var i = 0; i < 1000; i++) {

      var elementId = "sq-" + i;
      listHtml += "<div id='" + elementId + "' ></div>";
  }
  $("#d_gridWrapper").html(listHtml);

  // Testing placeholders
  for (var i = 0; i < 1000; i++) {
    var imageHtml = "<a href='https://mcdonalds.be/'><img src='https://www.eatthis.com/wp-content/uploads/2019/02/mcdonalds-logo.jpg' style='width:100%;height:100%'/></a>"
    $("#sq-" + i).html(imageHtml);
  }


  // Smart contract read call
  contractBillboard.methods.tokenURI(0).call().then(function (r, e) {

    console.log("result: ");
    console.log(r);

    console.log("error: ");
    console.log(e);

    var imageHtml = "<a href='https://mcdonalds.be/'><img src='https://www.eatthis.com/wp-content/uploads/2019/02/mcdonalds-logo.jpg' style='width:100%;height:100%'/></a>"
    $("#sq-1").html(imageHtml);

  });

}


