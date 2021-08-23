// The ABI (Application Binary Interface) is the interface of the smart contract
import { abiBillboard } from './abi-billboard.js'

// Settings will be differ
import { webProvider, billboardAddress } from './settings.js'

const web3 = new Web3(window.ethereum);
const contractBillboard = new web3.eth.Contract(abiBillboard, billboardAddress);

const web3ReadOnly = new Web3(webProvider);
const contractBillboardReadOnly = new web3ReadOnly.eth.Contract(abiBillboard, billboardAddress);

const TOTAL_SLOTS = 442;

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

  //
  // CONTRACT OWNER
  //

  // Update owner
  $("#a_set").click(function () {
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

  // Update wallet
  $("#w_set").click(function () {
    var address = document.getElementById("w_wallet").value;


    console.log("new wallet: " + address);

    // Smart contract call
    contractBillboard.methods.updateWallet(address).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("Update result:");
      console.log(result);
    }).catch(function (error) {
      console.log("Update error:");
      console.log(error);
    });
  });

  // Set URI
  $("#tu_set").click(function () {
    var prefix = document.getElementById("tu_prefix").value;
    var suffix = document.getElementById("tu_suffix").value;

    // Smart contract call
    contractBillboard.methods.setTokenURI(prefix, suffix).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("URI result:");
      console.log(result);
    }).catch(function (error) {
      console.log("URI error:");
      console.log(error);
    });
  });

  // Set image URI
  $("#iu_set").click(function () {
    var prefix = document.getElementById("iu_prefix").value;
    var suffix = document.getElementById("iu_suffix").value;

    // Smart contract call
    contractBillboard.methods.setSlotImageURI(prefix, suffix).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("URI result:");
      console.log(result);
    }).catch(function (error) {
      console.log("URI error:");
      console.log(error);
    });
  });

  // Set contract URI
  $("#cu_set").click(function () {
    var uri = document.getElementById("cu_uri").value;

    // Smart contract call
    contractBillboard.methods.setContractURI(uri).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("URI result:");
      console.log(result);
    }).catch(function (error) {
      console.log("URI error:");
      console.log(error);
    });
  });

  // Set token lock
  $("#l_set").click(function () {
    var slot = document.getElementById("l_slot").value;
    var time = document.getElementById("l_time").value;

    // Smart contract call
    contractBillboard.methods.setLock(0, slot, time).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("URI result:");
      console.log(result);
    }).catch(function (error) {
      console.log("URI error:");
      console.log(error);
    });
  });

  // Set tier price
  $("#tp_set").click(function () {
    var tier = document.getElementById("tp_tier").value;
    var price = document.getElementById("tp_price").value;

    // Smart contract call
    contractBillboard.methods.setTierPrice(tier, price).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("URI result:");
      console.log(result);
    }).catch(function (error) {
      console.log("URI error:");
      console.log(error);
    });
  });

  // Set number of boards
  $("#tb_set").click(function () {
    var boards = document.getElementById("tb_boards").value;

    // Smart contract call
    contractBillboard.methods.setTotalBoards(boards).send({ from: connectedWallet, }).then(function (result, error) {
      console.log("URI result:");
      console.log(result);
    }).catch(function (error) {
      console.log("URI error:");
      console.log(error);
    });
  });


  //
  // CONTRACT OWNER
  //

  // Mint button
  $("#fm_mintToken").click(function () {
    var slot = document.getElementById("fm_slot").value;

    contractBillboard.methods.tierForSlot(slot).call().then(function (tier, error) {
      contractBillboard.methods._tierPrice(tier).call().then(function (price, error) {
        contractBillboard.methods.mintSlot(0, slot).send({ from: connectedWallet, value: price }).then(function (result, error) {
          console.log("Mint result:");
          console.log(result);
        }).catch(function (error) {
          console.log("Mint error:");
          console.log(error);
        });
      });
    });

  });

  // Mint with metadata button
  $("#mwm_mintToken").click(function () {
    var slot = document.getElementById("mwm_slot").value;
    var adImage = document.getElementById("mwm_adImage").value;
    var redirectUrl = document.getElementById("mwm_redirectUrl").value;
    var status = document.getElementById("mwm_status").value;
    var ownerName = document.getElementById("mwm_ownerName").value;

    contractBillboard.methods.tierForSlot(slot).call().then(function (tier, error) {
      contractBillboard.methods._tierPrice(tier).call().then(function (price, error) {
        contractBillboard.methods.mintSlotWithData(
          0, 
          slot, 
          adImage,
          redirectUrl,
          status,
          ownerName
        ).send({ from: connectedWallet, value: price }).then(function (result, error) {
          console.log("Mint result:");
          console.log(result);
        }).catch(function (error) {
          console.log("Mint error:");
          console.log(error);
        });
      });
    });
  });





  // Get metadata button
  $("#fg_getInfo").click(function () {
    var slot = document.getElementById("fg_slot").value;

    // Get info from contract
    contractBillboardReadOnly.methods._tokenData(0, slot).call().then(function (result, error) {
      contractBillboardReadOnly.methods.slotImageURI(0, slot).call().then(function (resultImage, error) {

        // Info from result
        var tokenId = result["tokenId"];
        var adImage = result["adImage"];
        var redirectUrl = result["redirectUrl"];
        var forSale = result["forSale"];
        var ownerName = result["ownerName"];

        contractBillboardReadOnly.methods._tokenIdInfo(tokenId).call().then(function (resultInfo, error) {
          contractBillboardReadOnly.methods.isTokenLocked(tokenId).call().then(function (resultLock, error) {
            contractBillboardReadOnly.methods.tokenURI(tokenId).call().then(function (resultUri, error) {
    
              // HTML
              var resultHtml = "<br/>";
              resultHtml += "<b>image:</b> " + resultImage + "<br/>";
              resultHtml += "<b>adImage:</b> " + adImage + "<br/>";
              resultHtml += "<b>redirectUrl:</b> " + redirectUrl + "<br/>";
              resultHtml += "<b>forSale:</b> " + forSale + "<br/>";
              resultHtml += "<b>ownerName:</b> " + ownerName + "<br/>";
              resultHtml += "<b>token ID:</b> " + tokenId + "<br/>";
              resultHtml += "<b>token URI (JSON):</b> " + resultUri + "<br/>";
              resultHtml += "<b>lock end time:</b> " + resultInfo["unlockTime"] + "<br/>";
              resultHtml += "<b>locked:</b> " + resultLock + "<br/>";
              resultHtml += "<br/>";
              $("#fg_showInfo").html(resultHtml);
            });
          });
        });

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

  // Load initial grid
  loadGrid();

  // Load contract info
  loadContractInfo();
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
    } else if (connectedNetwork == "4") {
      $("#i_network_name").html("Rinkeby Testnet");
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
// ********************* CONTRACT INFO *********************
//

function loadContractInfo() {

  contractBillboardReadOnly.methods.contractURI().call().then(function (result, error) {
    $("#i_contracturi").html(result);
  });

  contractBillboardReadOnly.methods._tierPrice(1).call().then(function (result, error) {
    $("#i_tierprice_1").html(result);
  });
  contractBillboardReadOnly.methods._tierPrice(2).call().then(function (result, error) {
    $("#i_tierprice_2").html(result);
  });
  contractBillboardReadOnly.methods._tierPrice(3).call().then(function (result, error) {
    $("#i_tierprice_3").html(result);
  });
  contractBillboardReadOnly.methods._tierPrice(4).call().then(function (result, error) {
    $("#i_tierprice_4").html(result);
  });
  contractBillboardReadOnly.methods._tierPrice(5).call().then(function (result, error) {
    $("#i_tierprice_5").html(result);
  });
  contractBillboardReadOnly.methods._tierPrice(6).call().then(function (result, error) {
    $("#i_tierprice_6").html(result);
  });


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
    loadCell(i);
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
    var slotName = slot;

    // Default data
    if (adImage == "") {
      adImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/1200px-BTC_Logo.svg.png";
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
