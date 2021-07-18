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
  mapping(uint256 => MetaData) private _tokenData;



  // URIs
  mapping(uint256 => string) private _tokenURIs;

  // Images
  mapping(uint256 => string) private _tokenAdImages;




  //
  // ******************* SETUP *******************
  //

  // Constructor
  constructor (string memory name, string memory symbol) public ERC721(name, symbol) {

    // Mint needed tokens (1000 is too much, too high gas fee)
    // Need "mint" method for external partner
    for (uint256 i=0; i < 100; i++) {
      _safeMint(_msgSender(), i);
    }
              
  }

  //
  // ******************* ERC721 *******************
  //

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "URI query for nonexistent token");

    return _tokenData[tokenId].adImage;
  }

  function setTokenURI(uint256 tokenId, string memory _tokenURI) public {
    require(_exists(tokenId), "URI set of nonexistent token");
    require(_msgSender() == ownerOf(tokenId), "Only owner can update URI");

    _tokenURIs[tokenId] = _tokenURI;
  }

  //
  // ******************* METADATA *******************
  //



}


