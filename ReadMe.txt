------------------------
//    SMART CONTRACT   
------------------------

Using "Openzeppelin" to make sure the ERC721 standard is respected.
https://openzeppelin.com/



------------------------
//    WEBSITE   
------------------------


------------------------
//    LOCAL SETUP   
------------------------

Truffle & Ganache
- https://www.trufflesuite.com/
- https://www.trufflesuite.com/ganache

- Ganache to set up local Ethereum blockchain
- Truffle to test and deploy contracts (local, testnet, mainnet)

Useful commands:
- truffle test
- truffle migrate --network development
- truffle migrate --reset

Start local webserver:
php -S 127.0.0.1:8000

------------------------
//    TESTNET   
------------------------

- Ropsten testnet
- Address
- Faucet
- Infura

------------------------
//    MAINNET   
------------------------

- Need ETH node access (infura.io)
- Contract address: xxxx
- Owner address: xxxx
- Minter address: xxxx

------------------------
//    OPEN QUESTIONS   
------------------------

- NFT name + symbol
- Is "slot" needed? Every NFT has a unique index by default
- Is "delegate" needed? Every NFT has "ownerOf" by default
- Do we want to prevent minting over 1000 tokens?

External partner:
- The contract owner can now set an address which is able to mint. Ok?
