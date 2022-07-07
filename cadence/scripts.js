export default {
  getBalance: `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    let vaultRef = account.getCapability(/public/flowTokenBalance).borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
  `,
  isAdmin: `
import TicketsBeta from 0xT
pub fun main(address: Address): &TicketsBeta.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&TicketsBeta.AdminPublic>(TicketsBeta.AdminPublicPath).borrow()
}
  `,
  isAdminProxy: `
import TicketsBeta from 0xT
pub fun main(address: Address): &TicketsBeta.CapabilityReceiverVault{TicketsBeta.IProxyCapabilityReceiverPublic}? {
    let account = getAccount(address)
    let capReceiverVault = account.getCapability<&TicketsBeta.CapabilityReceiverVault{TicketsBeta.IProxyCapabilityReceiverPublic}>(TicketsBeta.CapabilityReceiverVaultPublicPath).borrow()
      ?? panic("Could not borrow CapabilityReceiverVault Capability.")
    return capReceiverVault
}
  `,
  hasDispenserVault: `
import TicketsBeta from 0xT
pub fun main(address: Address): &TicketsBeta.DispenserVault{TicketsBeta.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&TicketsBeta.DispenserVault{TicketsBeta.IDispenserPublic}>(TicketsBeta.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import TicketsBeta from 0xT
pub fun main(address: Address): [TicketsBeta.DispenserStruct] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&TicketsBeta.AdminPublic>(TicketsBeta.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserRequesters()
}
  `,
  getAllDispensers: `
import TicketsBeta from 0xT
pub fun main(address: Address): [TicketsBeta.DispenserStruct] {
  let account = getAccount(address)
  let adminVault = account.getCapability<&TicketsBeta.AdminPublic>(TicketsBeta.AdminPublicPath).borrow()
      ?? panic("Could not borrow Administrator capability.")
  return adminVault.getAllDispensers()
}
  `,
  getDispenserDomains: `
import TicketsBeta from 0xT
pub fun main(): [String] {
  return TicketsBeta.getDispenserDomains()
}
  `,
  hasDispenser: `
import TicketsBeta from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&TicketsBeta.DispenserVault{TicketsBeta.IDispenserPublic}>(TicketsBeta.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserInfo: `
import TicketsBeta from 0xT
pub fun main(address: Address): {UInt32: String}? {
    return TicketsBeta.getDispenserInfo(address: address)
}
  `,
  getTickets: `
import TicketsBeta from 0xT
pub fun main(): [TicketsBeta.TicketStruct] {
    return TicketsBeta.getTickets()
}
  `,
  getTicketRequestStatus: `
import TicketsBeta from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): TicketsBeta.RequestStruct? {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}>(TicketsBeta.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return TicketsBeta.getTicketRequestStatus(dispenser_id: dispenser_id, user_id: user_id)
}
  `,
  getLatestMintedTokenId: `
import TicketsBeta from 0xT
pub fun main(addr: Address): UInt64? {
  let account = getAccount(addr)
  let dispenserVault = account.getCapability<&TicketsBeta.DispenserVault{TicketsBeta.IDispenserPublic}>(TicketsBeta.DispenserVaultPublicPath).borrow()
      ?? panic("Could not borrow DispenserVault capability.")
  return dispenserVault.getLatestMintedTokenId()
}
  `,
  getTicketRequesters: `
import TicketsBeta from 0xT
pub fun main(addr: Address): {UInt32: TicketsBeta.RequestStruct}? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&TicketsBeta.DispenserVault{TicketsBeta.IDispenserPublic}>(TicketsBeta.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketRequesters()
}
  `,
  hasTicketResource: `
import TicketsBeta from 0xT
pub fun main(addr: Address): &TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}>(TicketsBeta.TicketVaultPublicPath).borrow()
}
  `,
  getTicketUsedTime: `
import TicketsBeta from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: UFix64??}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}>(TicketsBeta.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getUsedTime(dispenser_id: dispenser_id)
}
  `,
  getTicketCreatedTime: `
import TicketsBeta from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: UFix64?}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}>(TicketsBeta.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCreatedTime(dispenser_id: dispenser_id)
}
  `,
  getTicketCode: `
import TicketsBeta from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: String}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}>(TicketsBeta.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCode(dispenser_id: dispenser_id)
}
  `,
  examinTicketRequesters: `
import TicketsBeta from 0xT
pub fun main(address: Address, idList: [UInt32]): {UInt32: {UInt32: TicketsBeta.RequestStruct}?} {
  let account = getAccount(address)
  let adminVault = account.getCapability<&TicketsBeta.AdminPublic>(TicketsBeta.AdminPublicPath).borrow()
      ?? panic("Could not borrow Administrator capability.")
  let ticketRequester: {UInt32: {UInt32: TicketsBeta.RequestStruct}?} = {}
  for dispenser_id in idList {
    let obj: {UInt32: TicketsBeta.RequestStruct}? = adminVault.getTicketRequesters(dispenser_id: dispenser_id)
    ticketRequester[dispenser_id] = obj
  }
  return ticketRequester
}
  `,
  hasStatsVault: `
import TicketStatsV13 from 0xT
pub fun main(address: Address): &TicketStatsV13.StatsPublic? {
    let account = getAccount(address)
    return account.getCapability<&TicketStatsV13.StatsPublic>(TicketStatsV13.StatsVaultPublicPath).borrow()
}
  `,
  getStats: `
import TicketStatsV13 from 0xT
pub fun main(): {Address: [TicketStatsV13.StatsStruct]} {
    return TicketStatsV13.stats
}
  `,
  isSetRefundVault: `
import TicketsBeta from 0xT
pub fun main(addr: Address): Bool {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}>(TicketsBeta.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return TicketsBeta.isSetRefundVault(user_id: user_id)
}
  `,
  isThisUserSetRefundVault: `
import TicketsBeta from 0xT
pub fun main(user_id: UInt32): Bool {
    return TicketsBeta.isSetRefundVault(user_id: user_id)
}
  `
}
