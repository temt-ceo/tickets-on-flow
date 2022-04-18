export default {
  requestDispenser: `
import Tv11 from 0xT
transaction(domain: String, email: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv11.DispenserVault>(<- Tv11.createDispenserVault(addr: signer.address, domain: domain, email: email, paid: paid), to: /storage/Tv11DispenserVault)
        // public path
        signer.link<&Tv11.DispenserVault{Tv11.IDispenserPublic}>(Tv11.DispenserVaultPublicPath, target: /storage/Tv11DispenserVault)
        // private path
        signer.link<&Tv11.DispenserVault>(Tv11.DispenserVaultPrivatePath, target: /storage/Tv11DispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import Tv11 from 0x01
transaction(addr: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&Tv11.Admin>(from: /storage/Tv11Admin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(addr)
        let dispenserVault = account.getCapability<&Tv11.DispenserVault{Tv11.IDispenserPublic}>(Tv11.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- admin.mintDispenser(addr: addr))
    }

    execute {
        log("dispenser is dispensed.")
    }
}  `,
  addTicketInfo: `
import Tv11 from 0xT
transaction(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv11.DispenserVault>(from: /storage/Tv11DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfos(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, quantity: quantity)
    }

    execute {
        log("ticket info is registered.")
    }
}  `,
  requestTicket: `
import Tv11 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv11.TicketVault>(<- Tv11.createTicketVault(dispenser_id: dispenser_id, address: signer.address), to: /storage/Tv11TicketVault)
        // public path
        signer.link<&Tv11.TicketVault{Tv11.ITicketPublic}>(Tv11.TicketVaultPublicPath, target: /storage/Tv11TicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}  `,
  requestMoreTicket: `
import Tv11 from 0xT
transaction(dispenser_id: UInt32, user_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&Tv11.TicketVault>(from: /storage/Tv11TicketVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        ticketVault.addTicketRequester(dispenser_id: dispenser_id, user_id: user_id, address: signer.address)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  dispenseTicket: `
import T from 0xT
transaction(ticket_name: String, quantity: UInt8, addrList: [Address]) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&T.DispenserVault>(from: /storage/TicketDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        for addr in addrList {
            let account = getAccount(addr)
            let ticketVault = account.getCapability<&T.TicketVault{T.ITicketPublic}>(T.TicketVaultPublicPath).borrow()
                ?? panic("Could not borrow TicketVault capability.")
            ticketVault.deposit(token: dispenserVault.mintTicket(ticket_name: ticket_name, quantity: quantity)!)
            dispenserVault.addTicketReceiver(addr: addr)
        }
    }

    execute {
        log("ticket is dispensed.")
    }
}
  `,
  useTicket: `
import T from 0xT
transaction(dispenser_id: UInt32, user_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&T.TicketVault>(from: /storage/TicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.useTicket(dispenser_id: dispenser_id, user_id: user_id, address: signer.address)
    }

    execute {
        log("ticket is used.")
    }
}
  `
}
