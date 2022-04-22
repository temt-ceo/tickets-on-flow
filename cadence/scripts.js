export default {
  isAdmin: `
import Tv14 from 0xT
pub fun main(address: Address): &Tv14.AdminPublic? {
    let account = getAccount(address)
    return account.getCapability<&Tv14.AdminPublic>(Tv14.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import Tv14 from 0xT
pub fun main(address: Address): &Tv14.DispenserVault{Tv14.IDispenserPublic}? {
    let account = getAccount(address)
    return account.getCapability<&Tv14.DispenserVault{Tv14.IDispenserPublic}>(Tv14.DispenserVaultPublicPath).borrow()
}
  `,
  getRequestedDispensers: `
import Tv14 from 0xT
pub fun main(address: Address): [Tv14.DispenserStruct] {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tv14.AdminPublic>(Tv14.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return dispenserVault.getDispenserRequesters()
}
  `,
  hasDispenser: `
import Tv14 from 0xT
pub fun main(address: Address): Bool {
    let account = getAccount(address)
    let dispenserVault = account.getCapability<&Tv14.DispenserVault{Tv14.IDispenserPublic}>(Tv14.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getDispenserId: `
import Tv14 from 0xT
pub fun main(address: Address): UInt32? {
    return Tv14.getDispenserId(address: address)
}
  `,
  getTickets: `
import Tv14 from 0xT
pub fun main(): [Tv14.TicketStruct] {
    return Tv14.getTickets()
}
  `,
  getTicketRequesters: `
import Tv14 from 0xT
pub fun main(addr: Address): {UInt32: Tv14.RequestStruct}?? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv14.DispenserVault{Tv14.IDispenserPublic}>(Tv14.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    let dispenser_id = dispenserVault.getId()
    return dispenserVault.getTicketRequesters(dispenser_id: dispenser_id)
}
  `,
  hasTicketResource: `
import Tv14 from 0xT
pub fun main(addr: Address): &Tv14.TicketVault{Tv14.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tv14.TicketVault{Tv14.ITicketPublic}>(Tv14.TicketVaultPublicPath).borrow()
}
  `
}
