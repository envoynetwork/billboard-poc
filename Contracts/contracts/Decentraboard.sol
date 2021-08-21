pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Decentraboard is ERC721, Ownable {

  using SafeMath for uint256;
  using SafeMath for uint128;
  using Strings for uint256;
  using Strings for uint128;

  //
  // ******************* METADATA STRUCT *******************
  //

  struct MetaData {
    uint256 tokenId;
    uint128 tier;
    bool status;
    string redirectUrl;
    string adImage;
    string ownerName;
  }

  struct TokenIdInfo {
    uint128 boardId;
    uint128 slot;
    uint256 unlockTime;
  }

  //
  // ******************* VARIABLES *******************
  //

  // Deploy time
  uint256 private _deployTime = block.timestamp;

  // MetaData map
  mapping(uint128 => mapping(uint128 => MetaData)) public _tokenData;

  // Token ID to board+slot info (for token URI)
  mapping(uint256 => TokenIdInfo) public _tokenIdInfo;

  // Token ID to board+slot info (for token URI)
  mapping(uint128 => uint256) public _tierPrice;

  // Slot image
  string private _slotImagePrefix;
  string private _slotImageSuffix;

  // Token URI
  string private _tokenURIPrefix;
  string private _tokenURISuffix;

  // Contract URI
  string private _contractURI;

  // Total tokens
  uint256 private _totalSupply;

  // Total boards
  uint256 private _totalBoards = 1;

  // Contract owner
  address private _contractOwner;

  // Contract owner
  address private _wallet;

  //
  // ******************* MODIFIERS *******************
  //

  modifier onlyTokenOwner(uint128 boardId, uint128 slot) {
    uint256 tokenId = _tokenData[boardId][slot].tokenId;
    require(_tokenData[boardId][slot].tier != 0, "Token does not exist");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update metadata");
    _;
  }

  //
  // ******************* SETUP *******************
  //

  // Constructor
  constructor (string memory name, string memory symbol) public ERC721(name, symbol) {

    // Initially the deployer is the owner
    _contractOwner = _msgSender();
  }

  //
  // ******************* OWNERSHIP *******************
  //

  function updateContractOwner(address owner) public {
    require(_msgSender() == _contractOwner, "Only contract owner can transfer ownership");

    _contractOwner = owner; 
  }

  function updateWallet(address wallet) public {
    require(_msgSender() == _contractOwner, "Only contract owner can update wallet");

    _wallet = wallet; 
  }

  //
  // ******************* ERC721 *******************
  //

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "Token does not exist");

    uint128 boardId = _tokenIdInfo[tokenId].boardId;
    uint128 slot = _tokenIdInfo[tokenId].slot;

    return string(abi.encodePacked(_tokenURIPrefix, boardId.toString(), "-", slot.toString(), _tokenURISuffix));
  }

  //
  // ******************* TOKEN URI *******************
  //

  function setTokenURI(string memory prefix, string memory suffix) public {
    require(_msgSender() == _contractOwner, "Only contract owner can update URI");

    _tokenURIPrefix = prefix;
    _tokenURISuffix = suffix;
  }

  //
  // ******************* IMAGE URI *******************
  //

  function setSlotImageURI(string memory prefix, string memory suffix) public {
    require(_msgSender() == _contractOwner, "Only contract owner can update slot image URI");

    _slotImagePrefix = prefix;
    _slotImageSuffix = suffix;
  }

  function slotImageURI(uint128 boardId, uint128 slot) public view returns (string memory) {
    return string(abi.encodePacked(_slotImagePrefix, boardId.toString(), "-", slot.toString(), _slotImageSuffix));
  }

  //
  // ******************* CONTRACT URI *******************
  //

  function contractURI() public view returns (string memory) {
    return _contractURI;
  }

  function setContractURI(string memory contractUri) public {
    require(_msgSender() == _contractOwner, "Only contract owner can update contract URI");

    _contractURI = contractUri;
  }

  //
  // ******************* MINT *******************
  //

  function setTotalBoards(uint256 totalBoards) public {
    require(_msgSender() == _contractOwner, "Only contract owner can set total amount of boards");

    _totalBoards = totalBoards;
  }

  function setTierPrice(uint128 tier, uint256 price) public {
    require(_msgSender() == _contractOwner, "Only contract owner can update tier price");

    _tierPrice[tier] = price;
  }

  function tierForSlot(uint128 slot) public view returns (uint128) {
    if (slot < 10) {
      return 1; 
    } else if (slot < 14) {
      return 2; 
    } else if (slot < 54) {
      return 3; 
    } else if (slot < 62) {
      return 4; 
    } else if (slot < 122) {
      return 5; 
    } else if (slot < 442) {
      return 6;
    }
    return 0;
  }

  function mintSlot(
      uint128 boardId,
      uint128 slot
    ) public payable {

    // Get tier and check if slot is valid
    uint128 tier = tierForSlot(slot);
    require(tier != 0, "Invalid slot");

    // Check if slot can be minted
    require(_tokenData[boardId][slot].tier == 0, "Slot already minted");

    // Check if board exists
    require(boardId < _totalBoards, "Board does not exist");

    // Get tier price
    uint256 tierPrice = _tierPrice[tier];

    // Check if send ETH is equal to tier price
    uint256 weiAmount = msg.value;
    require(weiAmount == tierPrice, "Invalid ETH paid");

    // Send ETH to wallet
    payable(_wallet).transfer(weiAmount);

    // Mint token
    uint256 tokenId = _totalSupply;
    _safeMint(_msgSender(), tokenId);
    _totalSupply += 1;

    // Set token data
    _tokenData[boardId][slot].tokenId = tokenId;
    _tokenData[boardId][slot].tier = tier;

    // Update token ID info
    _tokenIdInfo[tokenId].boardId = boardId;
    _tokenIdInfo[tokenId].slot = slot;
  }

  function mintSlotWithData(
      uint128 boardId,
      uint128 slot,
      string memory adImage, 
      string memory redirectUrl, 
      bool status,
      string memory ownerName
    ) public payable {

    // Mint token
    mintSlot(boardId, slot);
      
    // Update editable metadata
    setMetaData(boardId, slot, adImage, redirectUrl, status, ownerName);
  }

  //
  // ******************* SETTERS *******************
  //

  function setMetaData(
      uint128 boardId,
      uint128 slot, 
      string memory adImage, 
      string memory redirectUrl, 
      bool status,
      string memory ownerName
    ) public onlyTokenOwner(boardId, slot) {

    _tokenData[boardId][slot].adImage = adImage;
    _tokenData[boardId][slot].redirectUrl = redirectUrl;
    _tokenData[boardId][slot].status = status;
    _tokenData[boardId][slot].ownerName = ownerName;
  }

  function setAdImage(uint128 boardId, uint128 slot, string memory adImage) public onlyTokenOwner(boardId, slot) {
    _tokenData[boardId][slot].adImage = adImage;
  }

  function setRedirectUrl(uint128 boardId, uint128 slot, string memory redirectUrl) public onlyTokenOwner(boardId, slot) {
    _tokenData[boardId][slot].redirectUrl = redirectUrl;
  }

  function setStatus(uint128 boardId, uint128 slot, bool status) public onlyTokenOwner(boardId, slot) {
    _tokenData[boardId][slot].status = status;
  }

  function setOwnerName(uint128 boardId, uint128 slot, string memory ownerName) public onlyTokenOwner(boardId, slot) {
    _tokenData[boardId][slot].ownerName = ownerName;
  }

  //
  // ******************* TRANSFER LOCK *******************
  //
  
  function setLock(uint128 boardId, uint128 slot, uint256 unlockTime) public {
    require(_msgSender() == _contractOwner, "Only owner can update token lock");

    uint256 tokenId = _tokenData[boardId][slot].tokenId;
    _tokenIdInfo[tokenId].unlockTime = unlockTime;
  }

  function isTokenLocked(uint256 tokenId) public view returns (bool) {
    return _tokenIdInfo[tokenId].unlockTime > block.timestamp;
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
