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
  uint256 public orderCount = 0;

  mapping(address => mapping(address => uint256)) public tokens;
  mapping(uint256 => _Order) public orders;
  mapping(uint256 => bool) public orderCancelled;

  event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance);
  event Withdraw(address indexed token, address indexed user, uint256 amount, uint256 balance);
  event Order(
    uint256 id,
    address user,
    address tokenGet,
    uint256 amountGet,
    address tokenGive,
    uint256 amountGive,
    uint256 timestamp
  );
  event Cancel (
    uint256 id,
    address user,
    address tokenGet,
    uint256 amountGet,
    address tokenGive,
    uint256 amountGive,
    uint256 timestamp
  );

  struct _Order {
    uint256 id;
    address user;
    address tokenGet;
    uint256 amountGet;
    address tokenGive;
    uint256 amountGive;
    uint256 timestamp;
  }
  
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

  function withdrawEther(uint256 _amount) public {
    require(tokens[ETHER][msg.sender] >= _amount, "Requested withdraw exceeds available amount");
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
    payable(msg.sender).transfer(_amount);
    emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
  }

  function depositToken(address _token, uint256 _amount) public {
    require(_token != ETHER, "Cannot deposit ETHER");
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    tokens[_token][msg.sender] += tokens[_token][msg.sender].add(_amount);
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  function withdrawToken(address _token, uint256 _amount) public {
    require(_token != ETHER, "Cannot withdraw ETHER");
    require(tokens[_token][msg.sender] >= _amount, "Requested withdraw exceeds available amount");
    tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
    require(Token(_token).transfer(msg.sender, _amount));
    emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }

  function balanceOf(address _token, address _user) public view returns (uint256) {
    return tokens[_token][_user];
  }

  function makeOrder(address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
    // require(_amountGet > 0, "Cannot make order for 0 or less tokens");
    // require(_amountGive > 0, "Cannot make order for 0 or less tokens");
    // require(tokens[_tokenGive][msg.sender] >= _amountGive, "Insuficient balance");

    orderCount += 1;

    _Order memory _order = _Order(
      orderCount,
      msg.sender,
      _tokenGet,
      _amountGet,
      _tokenGive,
      _amountGive,
      block.timestamp
    );

    emit Order(
      orderCount,
      msg.sender,
      _tokenGet,
      _amountGet,
      _tokenGive,
      _amountGive,
      block.timestamp
    );

    orders[_order.id] = _order;
  }

  function cancelOrder(uint256 _orderId) public {
    _Order storage _order = orders[_orderId];

    require(_order.id ==_orderId, "Cannot cancel order that does not exist");
    require(_order.user == msg.sender, "Cannot cancel order that is not yours");

    orderCancelled[_orderId] = true;
    emit Cancel(
      _order.id,
      _order.user,
      _order.tokenGet,
      _order.amountGet,
      _order.tokenGive,
      _order.amountGive,
      _order.timestamp
    );
  }
}