export default {
  isAdmin: `
import Tv18 from 0xT
pub fun main(address: Address): &Tv18.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&Tv18.AdminPublic>(Tv18.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import Tv18 from 0xT
pub fun main(address: Address): &Tv18.DispenserVault{Tv18.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&Tv18.DispenserVault{Tv18.IDispenserPublic}>(Tv18.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import Tv18 from 0xT
pub fun main(address: Address): [Tv18.DispenserStruct] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&Tv18.AdminPublic>(Tv18.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserRequesters()
}
  `,
  getDispenserDomains: `
import Tv18 from 0xT
pub fun main(): [String] {
  return Tv18.getDispenserDomains()
}
  `,
  hasDispenser: `
import Tv18 from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tv18.DispenserVault{Tv18.IDispenserPublic}>(Tv18.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserInfo: `
import Tv18 from 0xT
pub fun main(address: Address): {UInt32: String}? {
    return Tv18.getDispenserInfo(address: address)
}
  `,
  getTickets: `
import Tv18 from 0xT
pub fun main(): [Tv18.TicketStruct] {
    return Tv18.getTickets()
}
  `,
  getTicketRequestStatus: `
import Tv18 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): Tv18.RequestStruct? {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&Tv18.TicketVault{Tv18.ITicketPublic}>(Tv18.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return Tv18.getTicketRequestStatus(dispenser_id: dispenser_id, user_id: user_id)
}
  `,
  getLatestMintedTokenId: `
import Tv18 from 0xT
pub fun main(addr: Address): UInt64? {
  let account = getAccount(addr)
  let dispenserVault = account.getCapability<&Tv18.DispenserVault{Tv18.IDispenserPublic}>(Tv18.DispenserVaultPublicPath).borrow()
      ?? panic("Could not borrow DispenserVault capability.")
  return dispenserVault.getLatestMintedTokenId()
}
  `,
  getTicketRequesters: `
import Tv18 from 0xT
pub fun main(addr: Address): {UInt32: Tv18.RequestStruct}? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv18.DispenserVault{Tv18.IDispenserPublic}>(Tv18.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketRequesters()
}
  `,
  hasTicketResource: `
import Tv18 from 0xT
pub fun main(addr: Address): &Tv18.TicketVault{Tv18.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tv18.TicketVault{Tv18.ITicketPublic}>(Tv18.TicketVaultPublicPath).borrow()
}
  `,
  getTicketUsedTime: `
import Tv18 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): UFix64? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&Tv18.TicketVault{Tv18.ITicketPublic}>(Tv18.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getUsedTime(dispenser_id: dispenser_id)
}
`,
  getTicketCode: `
import Tv18 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: String}? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&Tv18.TicketVault{Tv18.ITicketPublic}>(Tv18.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCode(dispenser_id: dispenser_id)
}
  `
}
