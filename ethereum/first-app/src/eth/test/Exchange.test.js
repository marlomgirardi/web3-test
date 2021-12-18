require("chai").use(require("chai-as-promised")).should();

const { tokens, INVALID_TOKEN, EXCHANGE_ETHER_ADDRESS, contractRevertError } = require("./helpers");

const Exchange = artifacts.require("Exchange");
const Token = artifacts.require("Token");

contract("Exchange", function ([deployer, feeAccount, user1]) {
  let exchange, token;
  const feePercent = 10;

  beforeEach(async () => {
    token = await Token.new();
    exchange = await Exchange.new(feeAccount, feePercent);
  });

  describe("deployment", async () => {
    it("tracks the fee account", async () => {
      const result = await exchange.feeAccount();
      assert.equal(result, feeAccount);
    });
    it("tracks the fee percent", async () => {
      const result = await exchange.feePercent();
      assert.equal(result, feePercent);
    });
  });

  describe("fallback", async () => {
    it("reverts when Ether is sent", async () => {
      exchange.sendTransaction({ value: 1, from: user1 }).should.be.rejectedWith(contractRevertError());
    });
  });

  describe("depositing ether", () => {
    let result;

    describe("success", () => {
      beforeEach(async () => {
        result = await exchange.depositEther({ from: user1, value: tokens(1) });
      });

      it("tracks the ether deposit", async () => {
        const balance = await exchange.tokens(INVALID_TOKEN, user1);
        assert(balance, tokens(1));
      });

      it("emits a Deposit event", async () => {
        const log = result.logs[0];
        assert.equal(result.logs.length, 1);
        assert.equal(log.event, "Deposit");
        assert.equal(log.args.token, INVALID_TOKEN);
        assert.equal(log.args.user, user1);
        assert.equal(log.args.amount.toString(), tokens(1).toString());
        assert.equal(log.args.balance.toString(), tokens(1).toString());
      });
    });
  });

  describe("withdrawing ether", () => {
    let result;

    beforeEach(async () => {
      await exchange.depositEther({ from: user1, value: tokens(1) });
    });

    describe("success", () => {
      beforeEach(async () => {
        result = await exchange.withdrawEther(tokens(1), { from: user1 });
      });

      it("withdraws the ether", async () => {
        const balance = await exchange.tokens(EXCHANGE_ETHER_ADDRESS, user1);
        assert(balance, 0);
      });

      it("emits a Withdraw event", async () => {
        const log = result.logs[0];
        assert.equal(result.logs.length, 1);
        assert.equal(log.event, "Withdraw");
        assert.equal(log.args.token, EXCHANGE_ETHER_ADDRESS);
        assert.equal(log.args.user, user1);
        assert.equal(log.args.amount.toString(), tokens(1).toString());
        assert.equal(log.args.balance.toString(), 0);
      });
    });

    describe("failure", () => {
      it("rejects Ether withdrawal", async () => {
        await exchange
          .withdrawEther(tokens(100), { from: user1 })
          .should.be.rejectedWith(contractRevertError("Requested withdraw exceeds available amount"));
      });
    });
  });

  describe("depositing tokens", () => {
    let result;

    describe("success", () => {
      beforeEach(async () => {
        await token.approve(exchange.address, tokens(10), { from: user1 });
        await token.transfer(user1, tokens(100), { from: deployer });
        result = await exchange.depositToken(token.address, tokens(10), { from: user1 });
      });

      it("tracks the token deposit", async () => {
        let balance = await token.balanceOf(exchange.address);
        assert(balance, tokens(10));
        balance = await exchange.tokens(token.address, user1);
        assert(balance, tokens(10));
      });

      it("emits a Deposit event", async () => {
        const log = result.logs[0];
        assert.equal(result.logs.length, 1);
        assert.equal(log.event, "Deposit");
        assert.equal(log.args.token, token.address);
        assert.equal(log.args.user, user1);
        assert.equal(log.args.amount.toString(), tokens(10).toString());
        assert.equal(log.args.balance.toString(), tokens(10).toString());
      });
    });

    describe("failure", async () => {
      it("reject Ether deposit", async () => {
        await exchange
          .depositToken(INVALID_TOKEN, tokens(10), { from: user1 })
          .should.be.rejectedWith("Cannot deposit ETHER");
      });

      it("fails when no tokens are approved", async () => {
        await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith("Not allowed");
      });
    });
  });

  describe("withdrawing tokens", () => {
    let result;

    describe("success", () => {
      beforeEach(async () => {
        await token.approve(exchange.address, tokens(10), { from: user1 });
        await token.transfer(user1, tokens(10), { from: deployer });
        await exchange.depositToken(token.address, tokens(10), { from: user1 });

        result = await exchange.withdrawToken(token.address, tokens(10), { from: user1 });
      });

      it("withdraws the tokens", async () => {
        const balance = await token.balanceOf(user1);
        assert(balance, tokens(0));
      });

      it("emits a Withdraw event", async () => {
        const log = result.logs[0];
        assert.equal(result.logs.length, 1);
        assert.equal(log.event, "Withdraw");
        assert.equal(log.args.token, token.address);
        assert.equal(log.args.user, user1);
        assert.equal(log.args.amount.toString(), tokens(10).toString());
        assert.equal(log.args.balance.toString(), tokens(0).toString());
      });
    });

    describe("failure", () => {
      it("rejects Ether withdrawal", async () => {
        await exchange
          .withdrawToken(EXCHANGE_ETHER_ADDRESS, tokens(1), { from: user1 })
          .should.be.rejectedWith(contractRevertError("Cannot withdraw ETHER"));
      });

      it("rejects insufficient balance", async () => {
        await exchange
          .withdrawToken(token.address, tokens(100), { from: user1 })
          .should.be.rejectedWith(contractRevertError("Requested withdraw exceeds available amount"));
      });
    });
  });

  describe("checking balance", () => {
    it("returns the correct balance", async () => {
      await exchange.depositEther({ from: user1, value: tokens(1) });
      const balance = await exchange.balanceOf(EXCHANGE_ETHER_ADDRESS, user1);
      assert(balance, tokens(1));
    });
  });
});
