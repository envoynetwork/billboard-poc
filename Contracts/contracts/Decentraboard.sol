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

  struct TokenIdInfo {
    uint256 boardId;
    string slot;
    bool locked;
  }

  //
  // ******************* VARIABLES *******************
  //

  // Deploy time
  uint256 private _deployTime = block.timestamp;

  // MetaData map
  mapping(uint256 => mapping(string => MetaData)) public _tokenData;

  // Token ID to board+slot info (for token URI)
  mapping(uint256 => TokenIdInfo) public _tokenIdInfo;

  // Token URI
  string private _tokenURIPrefix = "";
  string private _tokenURISuffix = "";

  // Contract URI
  string private _contractURI = "";

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

    // Update token ID info
    _tokenIdInfo[tokenId].boardId = boardId;
    _tokenIdInfo[tokenId].slot = slot;
    _tokenIdInfo[tokenId].locked = false;
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

    uint256 boardId = _tokenIdInfo[tokenId].boardId;
    string memory slot = _tokenIdInfo[tokenId].slot;

    return string(abi.encodePacked(_tokenURIPrefix, boardId.toString(), "-", slot, _tokenURISuffix));
  }

  //
  // ******************* TOKEN URI *******************
  //

  function setTokenURI(string memory prefix, string memory suffix) public {
    require(_msgSender() == _contractOwner, "Only owner can update URI");

    _tokenURIPrefix = prefix;
    _tokenURISuffix = suffix;
  }

  //
  // ******************* CONTRACT URI *******************
  //

  function contractURI() public view returns (string memory) {
    return _contractURI;
  }

  function setContractURI(string memory contractUri) public {
    require(_msgSender() == _contractOwner, "Only owner can update contract URI");

    _contractURI = contractUri;
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

  //
  // ******************* TRANSFER LOCK *******************
  //
  
  function setLock(uint256 boardId, string memory slot, bool locked) public {
    uint256 tokenId = _tokenData[boardId][slot].tokenId;

    require(_exists(tokenId), "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update token lock");

    _tokenIdInfo[tokenId].locked = locked;
  }

  function isTokenLocked(uint256 tokenId) public view returns (bool) {
    if (_tokenIdInfo[tokenId].locked == false) {
      return false;
    }

    // 86400 seconds in 1 day
    uint256 daysPassed = (block.timestamp - _deployTime).div(86400);

    // 6 months * 30.5 days = 183 days
    return daysPassed < uint256(183);
  }

  function transferFrom(address from, address to, uint256 tokenId) public virtual override {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    require(isTokenLocked(tokenId) == false, "Token still locked");

    _transfer(from, to, tokenId);
  }

  function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    require(isTokenLocked(tokenId) == false, "Token still locked");

    _safeTransfer(from, to, tokenId, _data);
  }

}
