exports.tokens = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), "ether"));
};

exports.INVALID_TOKEN = "0x0000000000000000000000000000000000000000";