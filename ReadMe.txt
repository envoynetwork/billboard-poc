------------------------
//    SMART CONTRACT   
------------------------

Using "Openzeppelin" to make sure the ERC721 standard is respected.
https://openzeppelin.com/

Access rights:
- Contract owner will be able to update contract and minter addresses
- Minter address will be able to mint new tokens and becomes token owner

------------------------
//    WEBSITE   
------------------------

- Using "web3" library.
- Network and contract address can be set up in "settings.js"
- In the example code slot numbers are 0-999, but it can be any string

Start local webserver:
- $ php -S 127.0.0.1:8000


------------------------
//    LOCAL   
------------------------

Truffle & Ganache
- https://www.trufflesuite.com/
- https://www.trufflesuite.com/ganache
- Ganache to set up local Ethereum blockchain
- Truffle to test and deploy contracts (local, testnet, mainnet)

Install HDWallet-Provider to be able to deploy to testnet and mainnet:
- npm install @truffle/hdwallet-provider

Excluded files:
- .secret = private key for deployer wallet
- .infuraKey = Infura API key

Useful commands:
- $ truffle test
- $ truffle migrate --network development
- $ truffle migrate --reset


------------------------
//    TESTNET   
------------------------

- Goerli testnet (is already included in MetaMask)
- Get ETH on testnet: https://app.mycrypto.com/faucet
- Use Infura (infura.io) to connect to an Ethereum node

------------------------
//    MAINNET   
------------------------

- Use Infura (infura.io) to connect to an Ethereum node

