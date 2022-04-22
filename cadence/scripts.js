export default {
  isAdmin: `
import Tv15 from 0xT
pub fun main(address: Address): &Tv15.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&Tv15.AdminPublic>(Tv15.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import Tv15 from 0xT
pub fun main(address: Address): &Tv15.DispenserVault{Tv15.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&Tv15.DispenserVault{Tv15.IDispenserPublic}>(Tv15.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import Tv15 from 0xT
pub fun main(address: Address): [Tv15.DispenserStruct] {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tv15.AdminPublic>(Tv15.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return dispenserVault.getDispenserRequesters()
}
  `,
  hasDispenser: `
import Tv15 from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tv15.DispenserVault{Tv15.IDispenserPublic}>(Tv15.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserId: `
import Tv15 from 0xT
pub fun main(address: Address): UInt32? {
    return Tv15.getDispenserId(address: address)
}
  `,
  getTickets: `
import Tv15 from 0xT
pub fun main(): [Tv15.TicketStruct] {
    return Tv15.getTickets()
}
  `,
  getTicketRequesters: `
import Tv15 from 0xT
pub fun main(addr: Address): {UInt32: Tv15.RequestStruct}?? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv15.DispenserVault{Tv15.IDispenserPublic}>(Tv15.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    let dispenser_id = dispenserVault.getId()
    return dispenserVault.getTicketRequesters(dispenser_id: dispenser_id)
}
  `,
  hasTicketResource: `
import Tv15 from 0xT
pub fun main(addr: Address): &Tv15.TicketVault{Tv15.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tv15.TicketVault{Tv15.ITicketPublic}>(Tv15.TicketVaultPublicPath).borrow()
}
  `
}
