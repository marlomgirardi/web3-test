require("chai").use(require("chai-as-promised")).should();

const { tokens, INVALID_TOKEN } = require("./helpers");

const Token = artifacts.require("Token");

contract("Token", function ([deployer, receiver, exchange]) {
  const TOTAL_SUPPLY = 1000000;
  const totalSupplyValue = tokens(TOTAL_SUPPLY).toString();
  let token;

  beforeEach(async () => {
    token = await Token.new();
  });

  describe("deployment", async () => {
    it("tracks the name", async () => {
      const name = await token.name();
      assert.equal(name, "Demo Token");
    });
    it("tracks the name symbol", async () => {
      const symbol = await token.symbol();
      assert.equal(symbol, "DEMO");
    });

    it("tracks the decimals", async () => {
      const decimals = await token.decimals();
      assert.equal(decimals, 18);
    });

    it("tracks the total supply", async () => {
      const totalSupply = await token.totalSupply();
      assert.equal(totalSupply.toString(), totalSupplyValue);
    });

    it("assigns the total supply to the deployer", async () => {
      const totalSupply = await token.totalSupply();
      const balance = await token.balanceOf(deployer);
      assert.equal(balance.toString(), totalSupply.toString());
    });
  });

  describe("transfers", async () => {
    let result, amount;

    beforeEach(async () => {
      amount = tokens(100);
      result = await token.transfer(receiver, amount, { from: deployer });
    });

    describe("success", () => {
      it("transfer token", async () => {
        let balanceOf;

        balanceOf = await token.balanceOf(deployer);
        assert.equal(balanceOf.toString(), tokens(TOTAL_SUPPLY - 100).toString());
        balanceOf = await token.balanceOf(receiver);
        assert.equal(balanceOf.toString(), tokens(100).toString());
      });

      it("emits a Transfer event", async () => {
        const log = result.logs[0];
        assert.equal(result.logs.length, 1);
        assert.equal(log.event, "Transfer");
        assert.equal(log.args.from, deployer);
        assert.equal(log.args.to, receiver);
        assert.equal(log.args.value.toString(), tokens(100).toString());
      });
    });

    describe("failure", () => {
      it("rejects insufficient transfers", async () => {
        await token
          .transfer(receiver, tokens(9999999), { from: deployer })
          .should.be.rejectedWith("Not enough balance");
      });

      it("rejects invalid recipient", async () => {
        await token.transfer(INVALID_TOKEN, tokens(1), { from: deployer }).should.be.rejectedWith("Invalid address");
      });
    });
  });

  describe("approvals", async () => {
    let result, amount;

    beforeEach(async () => {
      amount = tokens(100);
      result = await token.approve(exchange, amount, { from: deployer });
    });

    describe("success", () => {
      it("approves token transfer", async () => {
        const allowance = await token.allowance(deployer, exchange);
        assert.equal(allowance.toString(), amount.toString());
      });

      it("emits an Approval event", async () => {
        const log = result.logs[0];
        assert.equal(result.logs.length, 1);
        assert.equal(log.event, "Approval");
        assert.equal(log.args.owner, deployer);
        assert.equal(log.args.spender, exchange);
        assert.equal(log.args.value.toString(), amount.toString());
      });
    });

    describe("failure", () => {
      it("rejects invalid transfers", async () => {
        await token.approve(INVALID_TOKEN, tokens(1), { from: deployer }).should.be.rejectedWith("Invalid address");
      });
    });
  });

  describe("delegated transfer tokens", async () => {
    let result, amount, balance;

    beforeEach(async () => {
      amount = tokens(100);
      balance = await token.balanceOf(deployer);
      await token.approve(exchange, amount, { from: deployer });
      result = await token.transferFrom(deployer, receiver, amount, { from: exchange });
    });

    describe("success", () => {
      it("transfer token", async () => {
        let balanceOf;

        balanceOf = await token.balanceOf(deployer);
        assert.equal(balanceOf.toString(), tokens(TOTAL_SUPPLY - 100).toString());
        balanceOf = await token.balanceOf(receiver);
        assert.equal(balanceOf.toString(), amount.toString());
      });

      it("reset the allowance", async () => {
        const allowance = await token.allowance(deployer, exchange);
        assert.equal(allowance.toString(), "0");
      });

      it("emits a Transfer event", async () => {
        const log = result.logs[0];
        assert.equal(result.logs.length, 1);
        assert.equal(log.event, "Transfer");
        assert.equal(log.args.from, deployer);
        assert.equal(log.args.to, receiver);
        assert.equal(log.args.value.toString(), amount.toString());
      });
    });

    describe("failure", () => {
      it("rejects insufficient approvals", async () => {
        await token
          .transferFrom(deployer, receiver, tokens(9999999), { from: exchange })
          .should.be.rejectedWith("Not allowed");
      });

      it("rejects invalid balance", async () => {
        await token.approve(exchange, tokens(9999999), { from: deployer });
        await token
          .transferFrom(deployer, receiver, tokens(9999998), { from: exchange })
          .should.be.rejectedWith("Not enough balance");
      });

      it("rejects invalid recipient", async () => {
        await token.approve(exchange, tokens(1), { from: deployer });
        await token
          .transferFrom(deployer, INVALID_TOKEN, tokens(1), { from: exchange })
          .should.be.rejectedWith(
            "Returned error: VM Exception while processing transaction: revert Invalid address -- Reason given: Invalid address."
          );
      });
    });
  });
});
