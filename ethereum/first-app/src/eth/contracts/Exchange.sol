// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// vs code extension limitation on monorepos, don't care for now as I'm learning solidity
import "../../../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Token.sol";

contract Exchange {
  using SafeMath for uint256;

  address public feeAccount;
  uint256 public feePercent;
  address constant ETHER = address(0);

  mapping(address => mapping(address => uint256)) public tokens;

  event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance);
  
  constructor(address _feeAccount, uint256 _feePercent) {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  fallback() external {
    revert();
  }

  function depositEther() payable public {
    tokens[ETHER][msg.sender] += tokens[ETHER][msg.sender].add(msg.value);
    emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }

  function depositToken(address _token, uint _amount) public {
    require(_token != ETHER, "Cannot deposit ETHER");
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    tokens[_token][msg.sender] += tokens[_token][msg.sender].add(_amount);
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }
}