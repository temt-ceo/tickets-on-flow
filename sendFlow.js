/* 注意: ES moduleでは動かないので、フォルダから取り出して実行して下さい。 "type": "module"の影響の及ばないところで実行できます。 */
const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { SHA3 } = require("sha3");
var EC = require("elliptic").ec;
var ec = new EC("p256");
require("dotenv").config();

fcl
  .config()
  .put("flow.network", "mainnet")
  .put("accessNode.api", "https://rest-mainnet.onflow.org");

// CHANGE THESE THINGS FOR YOU
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ADDRESS = process.env.ADDRESS;
const KEY_ID = parseInt(process.env.KEY_ID);

const hash = (message) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(message, "hex"));
  return sha.digest();
};

const sign = (message) => {
  const key = ec.keyFromPrivate(Buffer.from(PRIVATE_KEY, "hex"));
  const sig = key.sign(hash(message)); // hashMsgHex -> hash
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

async function authorizationFunction(account) {
  return {
    ...account,
    tempId: `${ADDRESS}-${KEY_ID}`,
    addr: fcl.sansPrefix(ADDRESS),
    keyId: Number(KEY_ID),
    signingFunction: async (signable) => {
      return {
        addr: fcl.withPrefix(ADDRESS),
        keyId: Number(KEY_ID),
        signature: sign(signable.message),
      };
    },
  };
}

async function sendTx() {
  const addr = process.env.RECIPIENT_ADDRESS;
  const transactionId = await fcl.mutate({
    cadence: `
      import FungibleToken from 0xf233dcee88fe0abe
      import FlowToken from 0x1654653399040a61

      transaction(amount: UFix64, to: Address) {
        let vault: @FlowToken.Vault

        prepare(signer: auth(BorrowValue) &Account) {
          self.vault <- signer.storage
            .borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
            .withdraw(amount: amount) as! @FlowToken.Vault
        }
        execute {
          getAccount(to)
            .capabilities
            .get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            .borrow()!
            .deposit(from: <-self.vault)
        }
      }
    `,
    args: (arg, t) => [arg(5.0, t.UFix64), arg(addr, t.Address)],
    payer: authorizationFunction,
    proposer: authorizationFunction,
    authorizations: [authorizationFunction],
    limit: 999,
  });

  console.log({ transactionId });
  fcl.tx(transactionId).subscribe((res) => {
    console.log(res);
  });
}

sendTx();
