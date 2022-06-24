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
import TicketsV20 from 0xT
pub fun main(address: Address): &TicketsV20.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&TicketsV20.AdminPublic>(TicketsV20.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import TicketsV20 from 0xT
pub fun main(address: Address): &TicketsV20.DispenserVault{TicketsV20.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&TicketsV20.DispenserVault{TicketsV20.IDispenserPublic}>(TicketsV20.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import TicketsV20 from 0xT
pub fun main(address: Address): [TicketsV20.DispenserStruct] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&TicketsV20.AdminPublic>(TicketsV20.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserRequesters()
}
  `,
  getAllDispensers: `
import TicketsV20 from 0xT
pub fun main(address: Address): [TicketsV20.DispenserStruct] {
  let account = getAccount(address)
  let adminVault = account.getCapability<&TicketsV20.AdminPublic>(TicketsV20.AdminPublicPath).borrow()
      ?? panic("Could not borrow Administrator capability.")
  return adminVault.getAllDispensers()
}
  `,
  getDispenserDomains: `
import TicketsV20 from 0xT
pub fun main(): [String] {
  return TicketsV20.getDispenserDomains()
}
  `,
  hasDispenser: `
import TicketsV20 from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&TicketsV20.DispenserVault{TicketsV20.IDispenserPublic}>(TicketsV20.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserInfo: `
import TicketsV20 from 0xT
pub fun main(address: Address): {UInt32: String}? {
    return TicketsV20.getDispenserInfo(address: address)
}
  `,
  getTickets: `
import TicketsV20 from 0xT
pub fun main(): [TicketsV20.TicketStruct] {
    return TicketsV20.getTickets()
}
  `,
  getTicketRequestStatus: `
import TicketsV20 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): TicketsV20.RequestStruct? {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&TicketsV20.TicketVault{TicketsV20.ITicketPublic}>(TicketsV20.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return TicketsV20.getTicketRequestStatus(dispenser_id: dispenser_id, user_id: user_id)
}
  `,
  getLatestMintedTokenId: `
import TicketsV20 from 0xT
pub fun main(addr: Address): UInt64? {
  let account = getAccount(addr)
  let dispenserVault = account.getCapability<&TicketsV20.DispenserVault{TicketsV20.IDispenserPublic}>(TicketsV20.DispenserVaultPublicPath).borrow()
      ?? panic("Could not borrow DispenserVault capability.")
  return dispenserVault.getLatestMintedTokenId()
}
  `,
  getTicketRequesters: `
import TicketsV20 from 0xT
pub fun main(addr: Address): {UInt32: TicketsV20.RequestStruct}? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&TicketsV20.DispenserVault{TicketsV20.IDispenserPublic}>(TicketsV20.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketRequesters()
}
  `,
  hasTicketResource: `
import TicketsV20 from 0xT
pub fun main(addr: Address): &TicketsV20.TicketVault{TicketsV20.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&TicketsV20.TicketVault{TicketsV20.ITicketPublic}>(TicketsV20.TicketVaultPublicPath).borrow()
}
  `,
  getTicketUsedTime: `
import TicketsV20 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: UFix64??}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsV20.TicketVault{TicketsV20.ITicketPublic}>(TicketsV20.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getUsedTime(dispenser_id: dispenser_id)
}
  `,
  getTicketCreatedTime: `
import TicketsV20 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: UFix64}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsV20.TicketVault{TicketsV20.ITicketPublic}>(TicketsV20.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCreatedTime(dispenser_id: dispenser_id)
}
  `,
  getTicketCode: `
import TicketsV20 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: String}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsV20.TicketVault{TicketsV20.ITicketPublic}>(TicketsV20.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCode(dispenser_id: dispenser_id)
}
  `,
  examinTicketRequesters: `
import TicketsV20 from 0xT
pub fun main(address: Address, idList: [UInt32]): {UInt32: {UInt32: TicketsV20.RequestStruct}?} {
  let account = getAccount(address)
  let adminVault = account.getCapability<&TicketsV20.AdminPublic>(TicketsV20.AdminPublicPath).borrow()
      ?? panic("Could not borrow Administrator capability.")
  let ticketRequester: {UInt32: {UInt32: TicketsV20.RequestStruct}?} = {}
  for dispenser_id in idList {
    let obj: {UInt32: TicketsV20.RequestStruct}? = adminVault.getTicketRequesters(dispenser_id: dispenser_id)
    ticketRequester[dispenser_id] = obj
  }
  return ticketRequester
}
  `,
  hasStatsVault: `
import TicketStatsV12 from 0xT
pub fun main(address: Address): &TicketStatsV12.StatsPublic? {
    let account = getAccount(address)
    return account.getCapability<&TicketStatsV12.StatsPublic>(TicketStatsV12.StatsVaultPublicPath).borrow()
}
  `,
  getStats: `
import TicketStatsV12 from 0xT
pub fun main(): {Address: [TicketStatsV12.StatsStruct]} {
    return TicketStatsV12.stats
}
  `,
  isSetRefundVault: `
import TicketsV20 from 0xT
pub fun main(addr: Address, user_id: UInt32): Bool {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&TicketsV20.TicketVault{TicketsV20.ITicketPublic}>(TicketsV20.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return TicketsV20.isSetRefundVault(user_id: user_id)
}
  `
}
