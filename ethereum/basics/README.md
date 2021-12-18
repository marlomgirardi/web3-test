# Ethereum - Web 3 fullstack study

I'm now grouping some base information to start digging deeper into this.

## Key points:
- [ ] The programming language of ethereum is [Solidity](https://docs.soliditylang.org/).
- [ ] Ethereum has a web based IDE called [Remix](https://remix.ethereum.org/).
- [ ] The communication is done with [JSON-RPC](https://www.jsonrpc.org/specification).
- [ ] [Web3.js](https://web3js.readthedocs.io/) is a javascript based API to interact with an ethereum node.

## Main standards
- [ ] [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) is a standard for fungible tokens.
- [ ] [ERC-721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/) is a standard for NFTs.
- [ ] [ERC-1155](https://ethereum.org/en/developers/docs/standards/tokens/erc-1155/) Combines ERC20 + ERC-721 + batch operations.

## Dev Tools
- [ ] [Ganache](https://www.trufflesuite.com/ganache) to easily start.
- [ ] [Truffle](https://www.trufflesuite.com/truffle) for testing.
- [ ] [Infura](https://infura.io/) development suite
- [ ] [WalletConnect](https://walletconnect.com/) an alternative to web3js compatible with multiple blockchains


## Solidity

The first two lines are the license and the solidity version used.

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
```

After that you have a class-like contract:

```js
contract ContractName {
  constructor() public {
    // ...
  }
}
```

### Most used [types](https://docs.soliditylang.org/en/v0.8.10/types.htmls)

- `string` string as we know it
- `uint256` for unassigned integers, which means, only positive numbers.
- `address` to hold the address identifier.

## [Global variables](https://docs.soliditylang.org/en/v0.8.10/units-and-global-variables.html#special-variables-and-functions)

### `msg`

- `msg.sender` - sender of the message (current call).

## Security

One of the libraries that already have proven utilities is `@openzeppelin/contracts`.