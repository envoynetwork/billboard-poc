pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Decentraboard is ERC721, Ownable {

  using SafeMath for uint256;
  using Strings for uint256;

  //
  // ******************* METADATA STRUCT *******************
  //

  struct MetaData {
    uint256 tokenId;
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
  mapping(uint256 => mapping(string => MetaData)) public _tokenData;

  // Base URI
  string private _baseTokenURI = "";

  // Total tokens
  uint256 private _totalSupply = 0;

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
      uint256 boardId,
      string memory slot,
      string memory image, 
      string memory city
    ) public {

    require(_msgSender() == _contractMinter, "Only minter address can mint");
    require(bytes(_tokenData[boardId][slot].image).length == 0, "Token already exists");

    // Minted token will be send to minter address
    uint256 tokenId = _totalSupply;
    _safeMint(_contractMinter, tokenId);
    _totalSupply += 1;

    // Set tokenId
    _tokenData[boardId][slot].tokenId = tokenId;

    // Update hardcoded metadata
    _tokenData[boardId][slot].image = image;
    _tokenData[boardId][slot].city = city;
  }

  function mintTokenWithData(
      uint256 boardId,
      string memory slot,
      string memory image, 
      string memory city, 
      string memory adImage, 
      string memory redirectUrl, 
      bool status,
      string memory ownerName
    ) public {

    // Mint token
    mintToken(boardId, slot, image, city);
      
    // Update editable metadata
    setMetaData(boardId, slot, adImage, redirectUrl, status, ownerName);
  }

  //
  // ******************* ERC721 *******************
  //

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "Token does not exist");

    return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
  }

  function setBaseTokenURI(string memory baseTokenURI) public {
    require(_msgSender() == _contractOwner, "Only owner can update base URI");

    _baseTokenURI = baseTokenURI;
  }


  //
  // ******************* SETTERS *******************
  //

  function setMetaData(
      uint256 boardId,
      string memory slot, 
      string memory adImage, 
      string memory redirectUrl, 
      bool status,
      string memory ownerName
    ) public {

    uint256 tokenId = _tokenData[boardId][slot].tokenId;

    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[boardId][slot].adImage = adImage;
    _tokenData[boardId][slot].redirectUrl = redirectUrl;
    _tokenData[boardId][slot].status = status;
    _tokenData[boardId][slot].ownerName = ownerName;
  }

  function setAdImage(uint256 boardId, string memory slot, string memory adImage) public {
    uint256 tokenId = _tokenData[boardId][slot].tokenId;

    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[boardId][slot].adImage = adImage;
  }

  function setRedirectUrl(uint256 boardId, string memory slot, string memory redirectUrl) public {
    uint256 tokenId = _tokenData[boardId][slot].tokenId;

    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[boardId][slot].redirectUrl = redirectUrl;
  }

  function setStatus(uint256 boardId, string memory slot, bool status) public {
    uint256 tokenId = _tokenData[boardId][slot].tokenId;

    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[boardId][slot].status = status;
  }

  function setOwnerName(uint256 boardId, string memory slot, string memory ownerName) public {
    uint256 tokenId = _tokenData[boardId][slot].tokenId;

    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");

    _tokenData[boardId][slot].ownerName = ownerName;
  }

}
