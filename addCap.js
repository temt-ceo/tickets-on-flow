const fcl = require("@onflow/fcl");
const t = require("@onflow/types");
const { SHA3 } = require("sha3");
require('dotenv').config()

console.log(process.env)
var EC = require('elliptic').ec;
var ec = new EC('p256');

fcl.config()
  .put("accessNode.api", "https://rest-mainnet.onflow.org")

// CHANGE THESE THINGS FOR YOU
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ADDRESS = process.env.ADDRESS;
const KEY_ID = parseInt(process.env.KEY_ID);
const CONTRACT_NAME = process.env.CONTRACT_NAME;

const sign = (message) => {
  const key = ec.keyFromPrivate(Buffer.from(PRIVATE_KEY, "hex"))
  const sig = key.sign(hash(message)) // hashMsgHex -> hash
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

const hash = (message) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(message, "hex"));
  return sha.digest();
}

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
        signature: sign(signable.message)
      }
    }
  }
}

async function performTransaction() {
  const addr = process.env.RECIPIENT_ADDRESS
  const transactionId = await fcl.mutate({
    cadence: `
    import Tickets from 0x24466f7fc36e3388
    transaction(address: Address) {
      prepare(signer: AuthAccount) {
        let capabilityReceiver: Capability<&Tickets.Admin> = signer.getCapability<&Tickets.Admin>(Tickets.AdminPrivatePath)
      
        let account = getAccount(address)
        let capReceiverVault = account.getCapability<&Tickets.CapabilityReceiverVault{Tickets.IProxyCapabilityReceiverPublic}>(Tickets.CapabilityReceiverVaultPublicPath).borrow()
            ?? panic("Could not borrow CapabilityReceiverVault Capability.")
        capReceiverVault.deposit(cap: capabilityReceiver)
      }
    }
    `,
    args: (arg, t) => [
      arg(addr, t.Address)
    ],
    payer: authorizationFunction,
    proposer: authorizationFunction,
    authorizations: [authorizationFunction],
    limit: 999
  });

  console.log({transactionId});
  fcl.tx(transactionId).subscribe(res => {
    console.log(res);
  })
}

performTransaction();