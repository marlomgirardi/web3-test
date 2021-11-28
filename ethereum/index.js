const Web3 = require("web3");
const rpcURL = "http://127.0.0.1:7545";

const web3 = new Web3(rpcURL);

// Reading a balance and formatting it
// const address = "0x5a5005dfF0F0B31C42AA53A0a3620Bc94D202FaF";
// web3.eth.getBalance(address).then((balance) => {
//   console.log("received", balance);
//   console.log("formatted", web3.utils.fromWei(balance, "ether"));
// });

// Interacting with contract
// https://docs.aave.com/developers/deployed-contracts/matic-polygon-market
// https://polygonscan.com/address/0x0229f777b0fab107f9591a41d5f02e4e98db6f2d#code
// const abi = require("./aave-price-oracle-abi.json");
// const contractAddress = "0x0229f777b0fab107f9591a41d5f02e4e98db6f2d";

// const contract = new web3.eth.Contract(abi, contractAddress);
// const usdtAddress = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";

// contract.methods
//   .getAssetPrice(usdtAddress)
//   .call()
//   .then((balance) => {
//     console.log(web3.utils.fromWei(balance, "ether"));
//   });

// Transfer funds
// const account1 = "0x7F1E856d5A860fCDd4C86a030532aB61510D3238";
// const account2 = "0x20a77f44d6D03ca542489EE0DfA0bC6E29655246";

// web3.eth.sendTransaction({
//   from: account1,
//   to: account2,
//   value: web3.utils.toWei("1", "ether"),
// });
