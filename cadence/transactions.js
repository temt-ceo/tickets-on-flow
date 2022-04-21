export default {
  requestDispenser: `
import Tv13 from 0xT
transaction(domain: String, email: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv13.DispenserVault>(<- Tv13.createDispenserVault(address: signer.address, domain: domain, email: email, paid: paid), to: /storage/Tv13DispenserVault)
        // public path
        signer.link<&Tv13.DispenserVault{Tv13.IDispenserPublic}>(Tv13.DispenserVaultPublicPath, target: /storage/Tv13DispenserVault)
        // private path
        signer.link<&Tv13.DispenserVault>(Tv13.DispenserVaultPrivatePath, target: /storage/Tv13DispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import Tv13 from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&Tv13.Admin>(from: /storage/Tv13Admin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&Tv13.DispenserVault{Tv13.IDispenserPublic}>(Tv13.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- admin.mintDispenser(dispenser_id: dispenserVault.getId(), address: address))
    }

    execute {
        log("dispenser is dispensed.")
    }
}
  `,
  addTicketInfo: `
import Tv13 from 0xT
transaction(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv13.DispenserVault>(from: /storage/Tv13DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfo(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, quantity: quantity, price: price)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  updateTicketInfo: `
import Tv13 from 0xT
transaction(index: UInt32, dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv13.DispenserVault>(from: /storage/Tv13DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.updateTicketInfo(index: index, dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, quantity: quantity, price: price)
    }

    execute {
        log("ticket info is updated.")
    }
}
  `,
  requestTicket: `
import Tv13 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv13.TicketVault>(<- Tv13.createTicketVault(dispenser_id: dispenser_id, address: signer.address), to: /storage/Tv13TicketVault)
        // public path
        signer.link<&Tv13.TicketVault{Tv13.ITicketPublic}>(Tv13.TicketVaultPublicPath, target: /storage/Tv13TicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}
  `,
  requestMoreTicket: `
import Tv13 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&Tv13.TicketVault>(from: /storage/Tv13TicketVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        let user_id = ticketVault.getId()
        ticketVault.addTicketRequester(dispenser_id: dispenser_id, user_id: user_id, address: signer.address)
    }

    execute {
        log("ticket is requested.")
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
