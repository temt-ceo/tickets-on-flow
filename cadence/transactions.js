export default {
  requestDispenser: `
import Tv12 from 0xT
transaction(domain: String, email: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv12.DispenserVault>(<- Tv12.createDispenserVault(addr: signer.address, domain: domain, email: email, paid: paid), to: /storage/Tv12DispenserVault)
        // public path
        signer.link<&Tv12.DispenserVault{Tv12.IDispenserPublic}>(Tv12.DispenserVaultPublicPath, target: /storage/Tv12DispenserVault)
        // private path
        signer.link<&Tv12.DispenserVault>(Tv12.DispenserVaultPrivatePath, target: /storage/Tv12DispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import Tv12 from 0xT
transaction(addr: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&Tv12.Admin>(from: /storage/Tv12Admin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(addr)
        let dispenserVault = account.getCapability<&Tv12.DispenserVault{Tv12.IDispenserPublic}>(Tv12.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- admin.mintDispenser(addr: addr))
    }

    execute {
        log("dispenser is dispensed.")
    }
}  `,
  addTicketInfo: `
import Tv12 from 0xT
transaction(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv12.DispenserVault>(from: /storage/Tv12DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfos(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, quantity: quantity, price: price)
    }

    execute {
        log("ticket info is registered.")
    }
}  `,
  requestTicket: `
import Tv12 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv12.TicketVault>(<- Tv12.createTicketVault(dispenser_id: dispenser_id, address: signer.address), to: /storage/Tv12TicketVault)
        // public path
        signer.link<&Tv12.TicketVault{Tv12.ITicketPublic}>(Tv12.TicketVaultPublicPath, target: /storage/Tv12TicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}  `,
  requestMoreTicket: `
import Tv12 from 0xT
transaction(dispenser_id: UInt32, user_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&Tv12.TicketVault>(from: /storage/Tv12TicketVault)
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
