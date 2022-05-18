export default {
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
  `
}
