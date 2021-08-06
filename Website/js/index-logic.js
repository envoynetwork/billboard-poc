// The ABI (Application Binary Interface) is the interface of the smart contract
import { abiBillboard } from './abi-billboard.js'

// Settings will be differ
import { webProvider, billboardAddress } from './settings.js'

const web3 = new Web3(window.ethereum);
const contractBillboard = new web3.eth.Contract(abiBillboard, billboardAddress);

const web3ReadOnly = new Web3(webProvider);
const contractBillboardReadOnly = new web3ReadOnly.eth.Contract(abiBillboard, billboardAddress);

const TOTAL_SLOTS = 1040;

var mySlots = [];
var connectedWallet;

//
// ********************* PAGE SETUP *********************
//

export const loadPage = async () => {
  setupPage();
}

async function setupPage() {

  // Wallet button
  $("#b_connectWallet").click(function () {
    // First we need to check if a Web3 browser extension was found
    if (!window.ethereum) {
      alert("Web3 wallet not found");
    } else {
      connectWallet();
    }
  });

  // Mint button
  $("#fm_mintToken").click(function () {
    var slot = document.getElementById("fm_slot").value;

    // Smart contract call
    contractBillboard.methods.mintToken(0, slot, "imageValue", "cityValue").send({ from: connectedWallet, }).then(function (result, error) {
      console.log("Mint result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Mint error:");
      console.log(error);
    });
  });

  // Mint with metadata button
  $("#mwm_mintToken").click(function () {
    var slot = document.getElementById("mwm_slot").value;
    var adImage = document.getElementById("mwm_adImage").value;
    var redirectUrl = document.getElementById("mwm_redirectUrl").value;
    var status = document.getElementById("mwm_status").value;
    var ownerName = document.getElementById("mwm_ownerName").value;
    // Smart contract call
    contractBillboard.methods.mintTokenWithData(
      0, 
      slot, 
      "imageValue", 
      "cityValue",
      adImage,
      redirectUrl,
      status,
      ownerName
    ).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("Mint result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Mint error:");
      console.log(error);
    });
  });
  
  // Set URI
  $("#tu_setUri").click(function () {
    var baseUri = document.getElementById("tu_uri").value;

    // Smart contract call
    contractBillboard.methods.setBaseTokenURI(baseUri).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("URI result:");
      console.log(result);
    }).catch(function (error) {
      console.log("URI error:");
      console.log(error);
    });
  });

  // Get metadata button
  $("#fg_getInfo").click(function () {
    var slot = document.getElementById("fg_slot").value;

    // Get info from contract
    contractBillboardReadOnly.methods._tokenData(0, slot).call().then(function (result, error) {

      // Info from result
      var tokenId = result["tokenId"];
      var adImage = result["adImage"];
      var redirectUrl = result["redirectUrl"];
      var status = result["status"];
      var ownerName = result["ownerName"];

      contractBillboardReadOnly.methods.tokenURI(tokenId).call().then(function (resultUri, error) {

        // HTML
        var resultHtml = "<br/>";
        resultHtml += "<b>adImage:</b> " + adImage + "<br/>";
        resultHtml += "<b>redirectUrl:</b> " + redirectUrl + "<br/>";
        resultHtml += "<b>status:</b> " + status + "<br/>";
        resultHtml += "<b>ownerName:</b> " + ownerName + "<br/>";
        resultHtml += "<b>token ID:</b> " + tokenId + "<br/>";
        resultHtml += "<b>token URI (JSON):</b> " + resultUri + "<br/>";
        resultHtml += "<br/>";
        $("#fg_showInfo").html(resultHtml);
      });
    });
  });

  // Set metadata button
  $("#f_setInfo").click(function () {
    var slot = document.getElementById("f_slot").value;
    var adImage = document.getElementById("f_adImage").value;
    var redirectUrl = document.getElementById("f_redirectUrl").value;
    var status = document.getElementById("f_status").value;
    var ownerName = document.getElementById("f_ownerName").value;

    // Check if current wallet is owner of NFT
    // This needs to be done using the tokenID as it's part of the NFT standard
    // So first we need to get the tokenID from the metadata
    contractBillboardReadOnly.methods._tokenData(0, slot).call().then(function (result, error) {
      // Now we can check the owner of the tokenID
      contractBillboardReadOnly.methods.ownerOf(result["tokenId"]).call().then(function (result, error) {
        // If the result (= owner wallet address) is the current wallet, we can proceed

        console.log("result: " + result);
        console.log("connectedWallet: " + connectedWallet);

        if (connectedWallet.toLowerCase() == result.toLowerCase()) {
          
          // Smart contract call to update data
          contractBillboard.methods.setMetaData(0, slot, adImage, redirectUrl, status, ownerName)
          .send({ from: connectedWallet, }).then(function (result, error) {
            console.log("Done");
            console.log(result);
          }).catch(function (error) {
            console.log("error:");
            console.log(error);
          });

        } else {
          alert("Only the NFT owner can update metadata");
        }
      });
    });
    
  });

  // Update owner
  $("#a_setOwner").click(function () {
    var address = document.getElementById("a_owner").value;

    // Smart contract call
    contractBillboard.methods.updateContractOwner(address).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("Update result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Update error:");
      console.log(error);
    });
  });

  // Update minter
  $("#a_setMinter").click(function () {
    var address = document.getElementById("a_minter").value;

    // Smart contract call
    contractBillboard.methods.updateContractMinter(address).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("Update result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Update error:");
      console.log(error);
    });
  });

  // Load initial grid
  loadGrid();
}

//
// ********************* SLOTS *********************
//

function getSlotNames() {
  var slotNames = [];
  var rows = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  rows.forEach(function(row) {    
    for(let i=1; i <= 40; i++) {
      var col = String(i).padStart(2, '0');
      slotNames.push(row + col);
    }
  });
  return slotNames;
}

//
// ********************* SETUP WALLET *********************
//

async function connectWallet() {

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    connectedWallet = accounts[0];
    $("#i_wallet_address").html(connectedWallet);

    // Network to which MetaMask is connected
    let connectedNetwork = window.ethereum.networkVersion;
    if (connectedNetwork == "1") {
      $("#i_network_name").html("Ethereum Mainnet");
    } else if (connectedNetwork == "5") {
      $("#i_network_name").html("Goerli Testnet");
    } else {
      $("#i_network_name").html("Unknown");
    }

    // Visual
    var buttonConnect = document.getElementById("b_connectWallet");
    buttonConnect.style.display = "none";

    var blockSetters = document.getElementById("d_connectWallet");
    blockSetters.style.display = "";

    var blockSetters = document.getElementById("d_setters");
    blockSetters.style.display = "";

    // Reload grid to get my slots
    loadGrid();
    
  } catch (error) {
    if (error.code === 4001) {
      // User rejected request
    }
    console.error(error);
  }

}

//
// ********************* GRID *********************
//

function loadGrid() {

  // Create grid HTML
  var gridHtml = ""
  for (var i = 0; i < TOTAL_SLOTS; i++) {
      var elementId = "sq-" + i;
      gridHtml += "<div id='" + elementId + "' ></div>";
  }
  $("#d_gridWrapper").html(gridHtml);

  // Load info for each cell
  for (var i = 0; i < TOTAL_SLOTS; i++) {
    loadCell(i.toString());
  }
}

function loadCell(slot) {

  // Read contract data
  contractBillboardReadOnly.methods._tokenData(0, slot).call().then(function (result, error) {

    // Debug
    // console.log("result: ");
    // console.log(result);
    // console.log("error: ");
    // console.log(error);

    // Data from response
    var owner = result["ownerName"] || 'nobody';
    var adImage = result["adImage"];
    var redirectUrl = result["redirectUrl"];
    var slotName = getSlotNames()[slot];

    // Default data
    if (adImage == "") {
      adImage = "https://www.envoy.art/wp-content/uploads/2021/07/envoylogo-trans.png";
      redirectUrl = "https://www.envoy.art/";
    }

    // Add info to HTML
    var imageHtml = "<a title='Slot " + slotName + " - owned by " + owner + "' href='" + redirectUrl + "' target='_blank'><img width='24' height='24' alt='Slot " + slotName + " - owned by " + owner + "' src='" + adImage + "' style='width:100%;height:100%'/></a>"
    $("#sq-" + slot).html(imageHtml);

    if(connectedWallet) {
      contractBillboardReadOnly.methods._tokenData(0, slot).call().then(function (result, error) {
        contractBillboardReadOnly.methods.ownerOf(result["tokenId"]).call().then(function (result, error) {
          if(connectedWallet.toLowerCase() == result.toLowerCase()) {
            mySlots.push(slot)
            $("#i_myslots").html(mySlots.join());
          }
        });
      });
    }

  });
}
