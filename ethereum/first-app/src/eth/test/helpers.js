exports.tokens = (n) => {
  return new web3.utils.BN(web3.utils.toWei(n.toString(), "ether"));
};

exports.contractRevertError = (error) => {
  let res = "Returned error: VM Exception while processing transaction: revert";
  if (error) res = `${res} ${error} -- Reason given: ${error}.`;
  return res;
};

exports.INVALID_TOKEN = "0x0000000000000000000000000000000000000000";
exports.EXCHANGE_ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";