export default {
  getBalance: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    let vaultRef = account.getCapability(/public/flowTokenBalance).borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
  `,
  isAdmin: `
import TicketsV22 from 0xT
pub fun main(address: Address): &TicketsV22.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&TicketsV22.AdminPublic>(TicketsV22.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import TicketsV22 from 0xT
pub fun main(address: Address): &TicketsV22.DispenserVault{TicketsV22.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&TicketsV22.DispenserVault{TicketsV22.IDispenserPublic}>(TicketsV22.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import TicketsV22 from 0xT
pub fun main(address: Address): [TicketsV22.DispenserStruct] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&TicketsV22.AdminPublic>(TicketsV22.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserRequesters()
}
  `,
  getAllDispensers: `
import TicketsV22 from 0xT
pub fun main(address: Address): [TicketsV22.DispenserStruct] {
  let account = getAccount(address)
  let adminVault = account.getCapability<&TicketsV22.AdminPublic>(TicketsV22.AdminPublicPath).borrow()
      ?? panic("Could not borrow Administrator capability.")
  return adminVault.getAllDispensers()
}
  `,
  getDispenserDomains: `
import TicketsV22 from 0xT
pub fun main(): [String] {
  return TicketsV22.getDispenserDomains()
}
  `,
  hasDispenser: `
import TicketsV22 from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&TicketsV22.DispenserVault{TicketsV22.IDispenserPublic}>(TicketsV22.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserInfo: `
import TicketsV22 from 0xT
pub fun main(address: Address): {UInt32: String}? {
    return TicketsV22.getDispenserInfo(address: address)
}
  `,
  getTickets: `
import TicketsV22 from 0xT
pub fun main(): [TicketsV22.TicketStruct] {
    return TicketsV22.getTickets()
}
  `,
  getTicketRequestStatus: `
import TicketsV22 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): TicketsV22.RequestStruct? {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&TicketsV22.TicketVault{TicketsV22.ITicketPublic}>(TicketsV22.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return TicketsV22.getTicketRequestStatus(dispenser_id: dispenser_id, user_id: user_id)
}
  `,
  getLatestMintedTokenId: `
import TicketsV22 from 0xT
pub fun main(addr: Address): UInt64? {
  let account = getAccount(addr)
  let dispenserVault = account.getCapability<&TicketsV22.DispenserVault{TicketsV22.IDispenserPublic}>(TicketsV22.DispenserVaultPublicPath).borrow()
      ?? panic("Could not borrow DispenserVault capability.")
  return dispenserVault.getLatestMintedTokenId()
}
  `,
  getTicketRequesters: `
import TicketsV22 from 0xT
pub fun main(addr: Address): {UInt32: TicketsV22.RequestStruct}? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&TicketsV22.DispenserVault{TicketsV22.IDispenserPublic}>(TicketsV22.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketRequesters()
}
  `,
  hasTicketResource: `
import TicketsV22 from 0xT
pub fun main(addr: Address): &TicketsV22.TicketVault{TicketsV22.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&TicketsV22.TicketVault{TicketsV22.ITicketPublic}>(TicketsV22.TicketVaultPublicPath).borrow()
}
  `,
  getTicketUsedTime: `
import TicketsV22 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: UFix64??}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsV22.TicketVault{TicketsV22.ITicketPublic}>(TicketsV22.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getUsedTime(dispenser_id: dispenser_id)
}
  `,
  getTicketCreatedTime: `
import TicketsV22 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: UFix64?}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsV22.TicketVault{TicketsV22.ITicketPublic}>(TicketsV22.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCreatedTime(dispenser_id: dispenser_id)
}
  `,
  getTicketCode: `
import TicketsV22 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: String}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsV22.TicketVault{TicketsV22.ITicketPublic}>(TicketsV22.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCode(dispenser_id: dispenser_id)
}
  `,
  examinTicketRequesters: `
import TicketsV22 from 0xT
pub fun main(address: Address, idList: [UInt32]): {UInt32: {UInt32: TicketsV22.RequestStruct}?} {
  let account = getAccount(address)
  let adminVault = account.getCapability<&TicketsV22.AdminPublic>(TicketsV22.AdminPublicPath).borrow()
      ?? panic("Could not borrow Administrator capability.")
  let ticketRequester: {UInt32: {UInt32: TicketsV22.RequestStruct}?} = {}
  for dispenser_id in idList {
    let obj: {UInt32: TicketsV22.RequestStruct}? = adminVault.getTicketRequesters(dispenser_id: dispenser_id)
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
import TicketsV22 from 0xT
pub fun main(addr: Address): Bool {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&TicketsV22.TicketVault{TicketsV22.ITicketPublic}>(TicketsV22.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return TicketsV22.isSetRefundVault(user_id: user_id)
}
  `,
  isThisUserSetRefundVault: `
import TicketsV22 from 0xT
pub fun main(user_id: UInt32): Bool {
    return TicketsV22.isSetRefundVault(user_id: user_id)
}
  `
}
