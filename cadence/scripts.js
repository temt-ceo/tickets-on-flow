export default {
  isAdmin: `
import Tv17 from 0xT
pub fun main(address: Address): &Tv17.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&Tv17.AdminPublic>(Tv17.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import Tv17 from 0xT
pub fun main(address: Address): &Tv17.DispenserVault{Tv17.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&Tv17.DispenserVault{Tv17.IDispenserPublic}>(Tv17.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import Tv17 from 0xT
pub fun main(address: Address): [Tv17.DispenserStruct] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&Tv17.AdminPublic>(Tv17.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserRequesters()
}
  `,
  getDispenserDomains: `
import Tv17 from 0x01
pub fun main(address: Address): [String] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&Tv17.AdminPublic>(Tv17.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserDomains()
}
  `,
  hasDispenser: `
import Tv17 from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tv17.DispenserVault{Tv17.IDispenserPublic}>(Tv17.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserInfo: `
import Tv17 from 0xT
pub fun main(address: Address): {UInt32: String}? {
    return Tv17.getDispenserInfo(address: address)
}
  `,
  getTickets: `
import Tv17 from 0xT
pub fun main(): [Tv17.TicketStruct] {
    return Tv17.getTickets()
}
  `,
  getTicketRequestStatus: `
import Tv17 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): Tv17.RequestStruct? {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&Tv17.TicketVault{Tv17.ITicketPublic}>(Tv17.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    let user_id = ticketVault.getId()
    return Tv17.getTicketRequestStatus(dispenser_id: dispenser_id, user_id: user_id)
}
  `,
  getLatestMintedTokenId: `
import Tv17 from 0xT
pub fun main(addr: Address): UInt64? {
  let account = getAccount(addr)
  let dispenserVault = account.getCapability<&Tv17.DispenserVault{Tv17.IDispenserPublic}>(Tv17.DispenserVaultPublicPath).borrow()
      ?? panic("Could not borrow DispenserVault capability.")
  return dispenserVault.getLatestMintedTokenId()
}
  `,
  getTicketRequesters: `
import Tv17 from 0xT
pub fun main(addr: Address): {UInt32: Tv17.RequestStruct}?? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv17.DispenserVault{Tv17.IDispenserPublic}>(Tv17.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketRequesters()
}
  `,
  hasTicketResource: `
import Tv17 from 0xT
pub fun main(addr: Address): &Tv17.TicketVault{Tv17.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tv17.TicketVault{Tv17.ITicketPublic}>(Tv17.TicketVaultPublicPath).borrow()
}
  `,
  getTicketCode: `
import Tv17 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt64: String} {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&Tv17.TicketVault{Tv17.ITicketPublic}>(Tv17.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  return ticketVault.getCode(dispenser_id: dispenser_id)
}
  `
}
