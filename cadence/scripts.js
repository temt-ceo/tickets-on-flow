export default {
  isAdmin: `
import Tv10 from 0xT
pub fun main(addr: Address): &Tv10.AdminPublic? {
    let account = getAccount(addr)
    return account.getCapability<&Tv10.AdminPublic>(Tv10.AdminPublicPath).borrow()
}
  `,
  hasDispenserVault: `
import Tv10 from 0xT
pub fun main(addr: Address): &Tv10.DispenserVault{Tv10.IDispenserPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&Tv10.DispenserVault{Tv10.IDispenserPublic}>(Tv10.DispenserVaultPublicPath).borrow()
}
  `,
  hasDispenser: `
import Tv10 from 0xT
pub fun main(addr: Address): Bool {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv10.DispenserVault{Tv10.IDispenserPublic}>(Tv10.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.hasDispenser()
}
  `,
  getRequestedDispensers: `
import Tv10 from 0xT
pub fun main(addr: Address): [{Address: Tv10.DispenserStruct}] {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&Tv10.AdminPublic>(Tv10.AdminPublicPath).borrow()
        ?? panic("Could not borrow Administrator capability.")
    return dispenserVault.getDispenserRequesters()
}
  `,
  getDispenserIdWithDomain: `
import Tv10 from 0xT
pub fun main(domain: String): UInt32? {
    return Tv10.getDispenserIdWithDomain(domain: domain)
}
  `,
  getTicketInfo: `
import T from 0xT
pub fun main(dispenser_id: UInt32): {UInt32: [T.TicketStruct]}? {
    return T.getTicketInfos(dispenser_id: dispenser_id)
}    
  `,
  getTicketRequesters: `
import T from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): {UInt32: [T.UserIdAndAddress]}?? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&T.DispenserVault{T.IDispencerPublic}>(T.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketRequesters(dispenser_id: dispenser_id)
}
  `,
  getTicketReceivers: `
import T from 0xT
pub fun main(addr: Address, user_id: UInt32): [Address]?? {
    let account = getAccount(addr)
    let dispenserVault = account.getCapability<&T.DispenserVault{T.IDispencerPublic}>(T.DispenserVaultPublicPath).borrow()
        ?? panic("Could not borrow DispenserVault capability.")
    return dispenserVault.getTicketReceivers(user_id: user_id)
}
  `,
  hasTicketResource: `
import T from 0xT
pub fun main(addr: Address): &T.TicketVault{T.ITicketPublic}? {
    let account = getAccount(addr)
    return account.getCapability<&T.TicketVault{T.ITicketPublic}>(T.TicketVaultPublicPath).borrow()
}
  `,
  isAlreadyRequested: `
import T from 0xT
pub fun main(dispenser_id: UInt32, user_id: UInt32): Bool {
    return T.alreadyRequested(dispenser_id: dispenser_id, user_id: user_id)
}
  `,
  getUserTicketQuantity: `
import T from 0xT
pub fun main(addr: Address, dispenser_id: UInt32): UInt8? {
    let account = getAccount(addr)
    let ticketVault = account.getCapability<&T.TicketVault{T.ITicketPublic}>(T.TicketVaultPublicPath).borrow()
        ?? panic("Could not borrow TicketVault capability.")
    return ticketVault.getTicketQuantity(dispenser_id: dispenser_id)
}
  `
}
