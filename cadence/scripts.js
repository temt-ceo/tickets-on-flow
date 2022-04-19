export default {
  isAdmin: `
import Tv12 from 0xT
pub fun main(addr: Address): &Tv12.AdminPublic? {
    let account = getAccount(addr)
    return account.getCapability<&Tv12.AdminPublic>(Tv12.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import Tv12 from 0x39899237382f2a8a
pub fun main(addr: Address): &Tv12.DispenserVault{Tv12.IDispenserPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tv12.DispenserVault{Tv12.IDispenserPublic}>(Tv12.DispenserVaultPublicPath).borrow()
}
  `,
  hasDispenser: `
import Tv12 from 0xT
pub fun main(addr: Address): Bool {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv12.DispenserVault{Tv12.IDispenserPublic}>(Tv12.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getRequestedDispensers: `
import Tv12 from 0xT
pub fun main(addr: Address): [{Address: Tv12.DispenserStruct}] {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv12.AdminPublic>(Tv12.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return dispenserVault.getDispenserRequesters()
}
  `,
  getDispenserId: `
import Tv12 from 0xT
pub fun main(addr: Address): UInt32? {
  return Tv12.getDispenserId(addr: addr)
}
  `,
  getDispenserIdWithDomain: `
import Tv12 from 0xT
pub fun main(domain: String): UInt32? {
    return Tv12.getDispenserIdWithDomain(domain: domain)
}
  `,
  getTicketInfo: `
  import Tv12 from 0xT
  pub fun main(dispenser_id: UInt32): Tv12.TicketStruct? {
      return Tv12.getTicketInfos(dispenser_id: dispenser_id)
  }
  `,
  getTicketRequesters: `
import Tv12 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): [Tv12.RequestStruct]?? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv12.DispenserVault{Tv12.IDispenserPublic}>(Tv12.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketRequesters(dispenser_id: dispenser_id)
}
  `,
  getTicketReceivers: `
import Tv12 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): [Tv12.ReceiverStruct]?? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv12.DispenserVault{Tv12.IDispenserPublic}>(Tv12.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketReceivers(dispenser_id: dispenser_id)
}
  `,
  hasTicketResource: `
import Tv12 from 0xT
pub fun main(addr: Address): &Tv12.TicketVault{Tv12.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tv12.TicketVault{Tv12.ITicketPublic}>(Tv12.TicketVaultPublicPath).borrow()
}
  `,
  getUserTicketQuantity: `
import Tv12 from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): UInt8? {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&Tv12.TicketVault{Tv12.ITicketPublic}>(Tv12.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    return ticketVault.getTicketQuantity(dispenser_id: dispenser_id)
}
  `
}
