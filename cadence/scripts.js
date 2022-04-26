export default {
  isAdmin: `
import Tv16 from 0xT
pub fun main(address: Address): &Tv16.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&Tv16.AdminPublic>(Tv16.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import Tv16 from 0xT
pub fun main(address: Address): &Tv16.DispenserVault{Tv16.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&Tv16.DispenserVault{Tv16.IDispenserPublic}>(Tv16.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import Tv16 from 0xT
pub fun main(address: Address): [Tv16.DispenserStruct] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&Tv16.AdminPublic>(Tv16.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserRequesters()
}
  `,
  getDispenserDomains: `
import Tv16 from 0x01
pub fun main(address: Address): [String] {
    let account = getAccount(address)
    let adminVault = account.getCapability<&Tv16.AdminPublic>(Tv16.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return adminVault.getDispenserDomains()
}
  `,
  hasDispenser: `
import Tv16 from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tv16.DispenserVault{Tv16.IDispenserPublic}>(Tv16.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserInfo: `
import Tv16 from 0xT
pub fun main(address: Address): {UInt32: String}? {
    return Tv16.getDispenserInfo(address: address)
}
  `,
  getTickets: `
import Tv16 from 0xT
pub fun main(): [Tv16.TicketStruct] {
    return Tv16.getTickets()
}
  `,
  getTicketRequesters: `
import Tv16 from 0xT
pub fun main(addr: Address): {UInt32: Tv16.RequestStruct}?? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv16.DispenserVault{Tv16.IDispenserPublic}>(Tv16.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    let dispenser_id = dispenserVault.getId()
    return dispenserVault.getTicketRequesters(dispenser_id: dispenser_id)
}
  `,
  hasTicketResource: `
import Tv16 from 0xT
pub fun main(addr: Address): &Tv16.TicketVault{Tv16.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tv16.TicketVault{Tv16.ITicketPublic}>(Tv16.TicketVaultPublicPath).borrow()
}
  `,
  getTicketRequestStatus: `
import Tv16 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): Tv16.RequestStruct? {
  let account = getAccount(addr)
  let ticketVault = account.getCapability<&Tv16.TicketVault{Tv16.ITicketPublic}>(Tv16.TicketVaultPublicPath).borrow()
      ?? panic("Could not borrow TicketVault capability.")
  let user_id = ticketVault.getId()
  return Tv16.getTicketRequestStatus(dispenser_id: dispenser_id, user_id: user_id)

}
  `
}
