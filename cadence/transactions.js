export default {
  requestDispenser: `
import Tv14 from 0xT
transaction(domain: String, email: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv14.DispenserVault>(<- Tv14.createDispenserVault(address: signer.address, domain: domain, email: email, paid: paid), to: /storage/Tv14DispenserVault)
        // public path
        signer.link<&Tv14.DispenserVault{Tv14.IDispenserPublic}>(Tv14.DispenserVaultPublicPath, target: /storage/Tv14DispenserVault)
        // private path
        signer.link<&Tv14.DispenserVault>(Tv14.DispenserVaultPrivatePath, target: /storage/Tv14DispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import Tv14 from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&Tv14.Admin>(from: /storage/Tv14Admin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&Tv14.DispenserVault{Tv14.IDispenserPublic}>(Tv14.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- admin.mintDispenser(dispenser_id: dispenserVault.getId(), address: address))
    }

    execute {
        log("dispenser is dispensed.")
    }
}
  `,
  addTicketInfo: `
import Tv14 from 0xT
transaction(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv14.DispenserVault>(from: /storage/Tv14DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfo(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  updateTicketInfo: `
import Tv14 from 0xT
transaction(index: UInt32, dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv14.DispenserVault>(from: /storage/Tv14DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.updateTicketInfo(index: index, dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    execute {
        log("ticket info is updated.")
    }
}
  `,
  requestTicket: `
import Tv14 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv14.TicketVault>(<- Tv14.createTicketVault(dispenser_id: dispenser_id, address: signer.address), to: /storage/Tv14TicketVault)
        // public path
        signer.link<&Tv14.TicketVault{Tv14.ITicketPublic}>(Tv14.TicketVaultPublicPath, target: /storage/Tv14TicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}
  `,
  requestMoreTicket: `
import Tv14 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&Tv14.TicketVault>(from: /storage/Tv14TicketVault)
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
transaction(ticket_name: String, addrList: [Address]) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&T.DispenserVault>(from: /storage/TicketDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        for addr in addrList {
            let account = getAccount(addr)
            let ticketVault = account.getCapability<&T.TicketVault{T.ITicketPublic}>(T.TicketVaultPublicPath).borrow()
                ?? panic("Could not borrow TicketVault capability.")
            ticketVault.deposit(token: dispenserVault.mintTicket(ticket_name: ticket_name)!)
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
