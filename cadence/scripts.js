export default {
  isAdmin: `
import TicketsV19 from 0xT
pub fun main(address: Address): &TicketsV19.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&TicketsV19.AdminPublic>(TicketsV19.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import TicketsV19 from 0xT
pub fun main(address: Address): &TicketsV19.DispenserVault{TicketsV19.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&TicketsV19.DispenserVault{TicketsV19.IDispenserPublic}>(TicketsV19.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import TicketsV19 from 0xT
pub fun main(address: Address): [TicketsV19.DispenserStruct] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&TicketsV19.AdminPublic>(TicketsV19.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserRequesters()
}
  `,
  getDispenserDomains: `
import TicketsV19 from 0xT
pub fun main(): [String] {
  return TicketsV19.getDispenserDomains()
}
  `,
  hasDispenser: `
import TicketsV19 from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&TicketsV19.DispenserVault{TicketsV19.IDispenserPublic}>(TicketsV19.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserInfo: `
import TicketsV19 from 0xT
pub fun main(address: Address): {UInt32: String}? {
    return TicketsV19.getDispenserInfo(address: address)
}
  `,
  getTickets: `
import TicketsV19 from 0xT
pub fun main(): [TicketsV19.TicketStruct] {
    return TicketsV19.getTickets()
}
  `,
  getTicketRequestStatus: `
import TicketsV19 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): TicketsV19.RequestStruct? {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&TicketsV19.TicketVault{TicketsV19.ITicketPublic}>(TicketsV19.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return TicketsV19.getTicketRequestStatus(dispenser_id: dispenser_id, user_id: user_id)
}
  `,
  getLatestMintedTokenId: `
import TicketsV19 from 0xT
pub fun main(addr: Address): UInt64? {
  let account = getAccount(addr)
  let dispenserVault = account.getCapability<&TicketsV19.DispenserVault{TicketsV19.IDispenserPublic}>(TicketsV19.DispenserVaultPublicPath).borrow()
      ?? panic("Could not borrow DispenserVault capability.")
  return dispenserVault.getLatestMintedTokenId()
}
  `,
  getTicketRequesters: `
import TicketsV19 from 0xT
pub fun main(addr: Address): {UInt32: TicketsV19.RequestStruct}? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&TicketsV19.DispenserVault{TicketsV19.IDispenserPublic}>(TicketsV19.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketRequesters()
}
  `,
  hasTicketResource: `
import TicketsV19 from 0xT
pub fun main(addr: Address): &TicketsV19.TicketVault{TicketsV19.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&TicketsV19.TicketVault{TicketsV19.ITicketPublic}>(TicketsV19.TicketVaultPublicPath).borrow()
}
  `,
  getTicketUsedTime: `
import TicketsV19 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: UFix64??}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsV19.TicketVault{TicketsV19.ITicketPublic}>(TicketsV19.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getUsedTime(dispenser_id: dispenser_id)
}
`,
  getTicketCode: `
import TicketsV19 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: String}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&TicketsV19.TicketVault{TicketsV19.ITicketPublic}>(TicketsV19.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCode(dispenser_id: dispenser_id)
}
  `,
  examinTicketRequesters: `
import TicketsV19 from 0xT
pub fun main(address: Address, idList: [UInt32]): {UInt32: {UInt32: TicketsV19.RequestStruct}?} {
  let account = getAccount(address)
  let adminVault = account.getCapability<&TicketsV19.AdminPublic>(TicketsV19.AdminPublicPath).borrow()
      ?? panic("Could not borrow Administrator capability.")
  let ticketRequester: {UInt32: {UInt32: TicketsV19.RequestStruct}?} = {}
  for dispenser_id in idList {
    let obj: {UInt32: TicketsV19.RequestStruct}? = adminVault.getTicketRequesters(dispenser_id: dispenser_id)
    ticketRequester[dispenser_id] = obj
  }
  return ticketRequester
}
  `
}
