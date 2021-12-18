// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// vs code extension limitation on monorepos, don't care for now as I'm learning solidity
import "../../../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * Testing solidity
 * Ideal solution: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
 * Standard: https://eips.ethereum.org/EIPS/eip-20
 */
contract Token {
  using SafeMath for uint256;

  string public name = "Demo Token";
  string public symbol = "DEMO";
  uint256 public decimals = 18;
  uint256 public totalSupply;

  // Mapping
  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  // Events
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);

  constructor() {
    totalSupply = 1000000 * (10 ** decimals);
    balanceOf[msg.sender] = totalSupply ;
  }

  function _transfer(address _from, address _to, uint256 _value) internal {
    require(_to != address(0), "Invalid address");
    balanceOf[_from] = balanceOf[_from].sub(_value);
    balanceOf[_to] = balanceOf[_to].add(_value);
    emit Transfer(_from, _to, _value);
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(_value <= balanceOf[msg.sender], "Not enough balance");
    _transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    require(allowance[_from][msg.sender] >= _value, "Not allowed");
    require(balanceOf[_from] >= _value, "Not enough balance");
    allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
    _transfer(_from, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    require(_spender != address(0), "Invalid address");
    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }
}