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

  // Wallet button
  $("#b_connectWallet").click(function () {
    connectWallet();
  });

  // Mint button
  $("#fm_mintToken").click(function () {
    var index = document.getElementById("fm_index").value;

    // Smart contract call
    contractBillboard.methods.mintToken(index, "imageValue", "cityValue").send({ from: connectedWallet, }).then(function (result, error) {
      console.log("Mint result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Mint error:");
      console.log(error);
    });
  });

  // Get metadata button
  $("#fg_getInfo").click(function () {
    var index = document.getElementById("fg_index").value;

    // Get info from contract
    contractBillboard.methods._tokenData(index).call().then(function (result, error) {

      // Info from result
      var adImage = result["adImage"];
      var redirectUrl = result["redirectUrl"];
      var status = result["status"];
      var ownerName = result["ownerName"];

      // HTML
      var resultHtml = "<br/>";
      resultHtml += "<b>adImage:</b> " + adImage + "<br/>";
      resultHtml += "<b>redirectUrl:</b> " + redirectUrl + "<br/>";
      resultHtml += "<b>status:</b> " + status + "<br/>";
      resultHtml += "<b>ownerName:</b> " + ownerName + "<br/>";
      resultHtml += "<br/>";
      $("#fg_showInfo").html(resultHtml);
    });
  });

  // Set metadata button
  $("#f_setInfo").click(function () {
    var index = document.getElementById("f_index").value;
    var adImage = document.getElementById("f_adImage").value;
    var redirectUrl = document.getElementById("f_redirectUrl").value;
    var status = document.getElementById("f_status").value;
    var ownerName = document.getElementById("f_ownerName").value;

    // Smart contract call
    contractBillboard.methods.setMetaData(index, adImage, redirectUrl, status, ownerName)
    .send({ from: connectedWallet, }).then(function (result, error) {
      console.log("Done");
      console.log(result);
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
// ********************* GRID *********************
//

function loadGrid() {

  // Create grid HTML
  var gridHtml = ""
  for (var i = 0; i < 1000; i++) {
      var elementId = "sq-" + i;
      gridHtml += "<div id='" + elementId + "' ></div>";
  }
  $("#d_gridWrapper").html(gridHtml);

  // Load info for each cell
  for (var i = 0; i < 1000; i++) {
    loadCell(i);
  }

}

function loadCell(index) {

  // Read contract data
  contractBillboard.methods._tokenData(index).call().then(function (result, error) {

    // Debug
    console.log("result: ");
    console.log(result);
    console.log("error: ");
    console.log(error);

    // Data from response
    var adImage = result["adImage"];
    var redirectUrl = result["redirectUrl"];

    // Default data
    if (adImage == "") {
      adImage = "https://www.envoy.art/wp-content/uploads/2021/07/envoylogo-trans.png";
      redirectUrl = "https://www.envoy.art/";
    }

    // Add info to HTML
    var imageHtml = "<a href='" + redirectUrl + "' target='_blank'><img src='" + adImage + "' style='width:100%;height:100%'/></a>"
    $("#sq-" + index).html(imageHtml);

  });

}
