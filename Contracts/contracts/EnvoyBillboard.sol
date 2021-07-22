pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract EnvoyBillboard is ERC721, Ownable {

  using SafeMath for uint256;

  //
  // ******************* METADATA STRUCT *******************
  //

  struct MetaData {
    string image;
    string city;
    string redirectUrl;
    string adImage;
    bool status;
    string ownerName;
  }

  //
  // ******************* VARIABLES *******************
  //

  // MetaData map
  mapping(uint256 => MetaData) public _tokenData;

  // Contract owner
  address private _contractOwner = address(0);

  // Contract minter
  address private _contractMinter = address(0);

  //
  // ******************* SETUP *******************
  //

  // Constructor
  constructor (string memory name, string memory symbol) public ERC721(name, symbol) {

    // Initially the deployer is the owner
    _contractOwner = _msgSender();
    _contractMinter = _msgSender();
  }

  //
  // ******************* OWNERSHIP *******************
  //

  function updateContractOwner(address owner) public {
    require(_msgSender() == _contractOwner, "Only owner can transfer ownership");

    _contractOwner = owner; 
  }

  function updateContractMinter(address minter) public {
    require(_msgSender() == _contractOwner, "Only owner can update contract minter");

    _contractMinter = minter;
  }

  //
  // ******************* MINT *******************
  //

  function mintToken(
      uint256 tokenId, 
      string memory image, 
      string memory city
    ) public {
      
    require(!_exists(tokenId), "Token already exists");
    require(_msgSender() == _contractMinter, "Only minter address can mint");

    // Minted token will be send to minter address
    _safeMint(_contractMinter, tokenId);

    // Update hardcoded metadata
    _tokenData[tokenId].image = image;
    _tokenData[tokenId].city = city;
  }

  function mintTokenWithData(
      uint256 tokenId, 
      string memory image, 
      string memory city, 
      string memory adImage, 
      string memory redirectUrl, 
      bool status,
      string memory ownerName
    ) public {

    mintToken(tokenId, image, city);
      
    // Update editable metadata
    setMetaData(tokenId, adImage, redirectUrl, status, ownerName);
  }

  //
  // ******************* ERC721 *******************
  //

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "Token does not exist");

    return _tokenData[tokenId].adImage;
  }


  //
  // ******************* SETTERS *******************
  //

  function setMetaData(
      uint256 tokenId, 
      string memory adImage, 
      string memory redirectUrl, 
      bool status,
      string memory ownerName
    ) public {

    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[tokenId].adImage = adImage;
    _tokenData[tokenId].redirectUrl = redirectUrl;
    _tokenData[tokenId].status = status;
    _tokenData[tokenId].ownerName = ownerName;
  }

  function setAdImage(uint256 tokenId, string memory adImage) public {
    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[tokenId].adImage = adImage;
  }

  function setRedirectUrl(uint256 tokenId, string memory redirectUrl) public {
    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[tokenId].redirectUrl = redirectUrl;
  }

  function setStatus(uint256 tokenId, bool status) public {
    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[tokenId].status = status;
  }

  function setOwnerName(uint256 tokenId, string memory ownerName) public {
    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[tokenId].ownerName = ownerName;
  }

}
