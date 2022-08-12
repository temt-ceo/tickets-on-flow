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
import Tickets from 0xT
pub fun main(address: Address): &Tickets.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&Tickets.AdminPublic>(Tickets.AdminPublicPath).borrow()
}
  `,
  isAdminProxy: `
import Tickets from 0xT
pub fun main(address: Address): &Tickets.CapabilityReceiverVault{Tickets.IProxyCapabilityReceiverPublic}? {
    let account = getAccount(address)
    let capReceiverVault = account.getCapability<&Tickets.CapabilityReceiverVault{Tickets.IProxyCapabilityReceiverPublic}>(Tickets.CapabilityReceiverVaultPublicPath).borrow()
      ?? panic("Could not borrow CapabilityReceiverVault Capability.")
    return capReceiverVault
}
  `,
  hasDispenserVault: `
import Tickets from 0xT
pub fun main(address: Address): &Tickets.DispenserVault{Tickets.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&Tickets.DispenserVault{Tickets.IDispenserPublic}>(Tickets.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import Tickets from 0xT
pub fun main(address: Address): [Tickets.DispenserStruct] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&Tickets.AdminPublic>(Tickets.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserRequesters()
}
  `,
  getAllDispensers: `
import Tickets from 0xT
pub fun main(address: Address): [Tickets.DispenserStruct] {
  let account = getAccount(address)
  let adminVault = account.getCapability<&Tickets.AdminPublic>(Tickets.AdminPublicPath).borrow()
      ?? panic("Could not borrow Administrator capability.")
  return adminVault.getAllDispensers()
}
  `,
  getDispenserDomains: `
import Tickets from 0xT
pub fun main(): [String] {
  return Tickets.getDispenserDomains()
}
  `,
  hasDispenser: `
import Tickets from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tickets.DispenserVault{Tickets.IDispenserPublic}>(Tickets.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserInfo: `
import Tickets from 0xT
pub fun main(address: Address): {UInt32: String}? {
    return Tickets.getDispenserInfo(address: address)
}
  `,
  getTickets: `
import Tickets from 0xT
pub fun main(): [Tickets.TicketStruct] {
    return Tickets.getTickets()
}
  `,
  getTicketRequestStatus: `
import Tickets from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): Tickets.RequestStruct? {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&Tickets.TicketVault{Tickets.ITicketPublic}>(Tickets.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return Tickets.getTicketRequestStatus(dispenser_id: dispenser_id, user_id: user_id)
}
  `,
  getLatestMintedTokenId: `
import Tickets from 0xT
pub fun main(addr: Address): UInt64? {
  let account = getAccount(addr)
  let dispenserVault = account.getCapability<&Tickets.DispenserVault{Tickets.IDispenserPublic}>(Tickets.DispenserVaultPublicPath).borrow()
      ?? panic("Could not borrow DispenserVault capability.")
  return dispenserVault.getLatestMintedTokenId()
}
  `,
  getTicketRequesters: `
import Tickets from 0xT
pub fun main(addr: Address): {UInt32: Tickets.RequestStruct}? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tickets.DispenserVault{Tickets.IDispenserPublic}>(Tickets.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketRequesters()
}
  `,
  hasTicketResource: `
import Tickets from 0xT
pub fun main(addr: Address): &Tickets.TicketVault{Tickets.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tickets.TicketVault{Tickets.ITicketPublic}>(Tickets.TicketVaultPublicPath).borrow()
}
  `,
  getTicketUsedTime: `
import Tickets from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: UFix64??}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&Tickets.TicketVault{Tickets.ITicketPublic}>(Tickets.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getUsedTime(dispenser_id: dispenser_id)
}
  `,
  getTicketCreatedTime: `
import Tickets from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: UFix64?}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&Tickets.TicketVault{Tickets.ITicketPublic}>(Tickets.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCreatedTime(dispenser_id: dispenser_id)
}
  `,
  getTicketCode: `
import Tickets from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: String}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&Tickets.TicketVault{Tickets.ITicketPublic}>(Tickets.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCode(dispenser_id: dispenser_id)
}
  `,
  examinTicketRequesters: `
import Tickets from 0xT
pub fun main(address: Address, idList: [UInt32]): {UInt32: {UInt32: Tickets.RequestStruct}?} {
  let account = getAccount(address)
  let adminVault = account.getCapability<&Tickets.AdminPublic>(Tickets.AdminPublicPath).borrow()
      ?? panic("Could not borrow Administrator capability.")
  let ticketRequester: {UInt32: {UInt32: Tickets.RequestStruct}?} = {}
  for dispenser_id in idList {
    let obj: {UInt32: Tickets.RequestStruct}? = adminVault.getTicketRequesters(dispenser_id: dispenser_id)
    ticketRequester[dispenser_id] = obj
  }
  return ticketRequester
}
  `,
  hasStatsVault: `
import StatsString from 0xT
pub fun main(address: Address): &StatsString.StatsPublic? {
    let account = getAccount(address)
    return account.getCapability<&StatsString.StatsPublic>(StatsString.StatsVaultPublicPath).borrow()
}
  `,
  getStats: `
import StatsString from 0xT
pub fun main(): {Address: [StatsString.StatsStruct]} {
    return StatsString.stats
}
  `,
  hasMessagesVault: `
import Messages from 0xT
pub fun main(address: Address): &Messages.MessagesPublic? {
  let account = getAccount(address)
  return account.getCapability<&Messages.MessagesPublic>(Messages.TicketsCommentVaultPublicPath).borrow()
}
  `,
  getMessages: `
import Messages from 0xT
pub fun main(): {Address: Messages.MessagesStruct} {
  return Messages.messages
}
`,
  isSetRefundVault: `
import Tickets from 0xT
pub fun main(addr: Address): Bool {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&Tickets.TicketVault{Tickets.ITicketPublic}>(Tickets.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return Tickets.isSetRefundVault(user_id: user_id)
}
  `,
  isThisUserSetRefundVault: `
import Tickets from 0xT
pub fun main(user_id: UInt32): Bool {
    return Tickets.isSetRefundVault(user_id: user_id)
}
  `
}
