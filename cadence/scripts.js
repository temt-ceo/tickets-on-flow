export default {
  isAdmin: `
import Tv13 from 0xT
pub fun main(address: Address): &Tv13.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&Tv13.AdminPublic>(Tv13.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import Tv13 from 0xT
pub fun main(address: Address): &Tv13.DispenserVault{Tv13.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&Tv13.DispenserVault{Tv13.IDispenserPublic}>(Tv13.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import Tv13 from 0xT
pub fun main(address: Address): [Tv13.DispenserStruct] {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tv13.AdminPublic>(Tv13.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return dispenserVault.getDispenserRequesters()
}
  `,
  hasDispenser: `
import Tv13 from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tv13.DispenserVault{Tv13.IDispenserPublic}>(Tv13.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserId: `
import Tv13 from 0xT
pub fun main(address: Address): UInt32? {
    return Tv13.getDispenserId(address: address)
}
  `,
  getTickets: `
import Tv13 from 0xT
pub fun main(): [Tv13.TicketStruct] {
    return Tv13.getTickets()
}
  `,
  getTicketRequesters: `
import Tv13 from 0xT
pub fun main(addr: Address): [Tv13.RequestStruct]?? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv13.DispenserVault{Tv13.IDispenserPublic}>(Tv13.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    let dispenser_id = dispenserVault.getId()
    return dispenserVault.getTicketRequesters(dispenser_id: dispenser_id)
}
  `,
  hasTicketResource: `
import Tv13 from 0xT
pub fun main(addr: Address): &Tv13.TicketVault{Tv13.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tv13.TicketVault{Tv13.ITicketPublic}>(Tv13.TicketVaultPublicPath).borrow()
}
  `
}
