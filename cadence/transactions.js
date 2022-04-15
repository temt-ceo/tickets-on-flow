export default {
  requestDispenser: `
import Tv10 from 0xT
transaction(domain: String, email: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv10.DispenserVault>(<- Tv10.createDispenserVault(addr: signer.address, domain: domain, email: email, paid: paid), to: /storage/TicketDispenserContainer)
        // public path
        signer.link<&Tv10.DispenserVault{Tv10.IDispenserPublic}>(Tv10.DispenserVaultPublicPath, target: /storage/TicketDispenserContainer)
        // private path
        signer.link<&Tv10.DispenserVault>(Tv10.DispenserVaultPrivatePath, target: /storage/TicketDispenserContainer)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import T from 0xT
transaction(addr: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<@T.Admin>(from: /storage/TicketAdmin)
            ?? panic("Could not borrow reference to the Administrator Resource.")
        let account = getAccount(addr)
        let dispenserVault = account.getCapability<&T.DispenserVault{T.IDispenserPublic}>(T.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- admin.mintDispenser(addr: addr))
    }

    execute {
        log("dispenser is dispensed.")
    }
}
  `,
  addTicketInfo: `
import T from 0xT
transaction(dispenser_id: UInt32, ticket_name: String, where_to_use: String, ticket_quantity: UInt8) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&T.DispenserVault>(from: /storage/TicketDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfos(dispenser_id: dispenser_id, ticket_name: ticket_name, where_to_use: where_to_use, ticket_quantity: ticket_quantity)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  requestUserTicket: `
import T from 0xT
transaction(dispenser_id: UInt32, user_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@T.TicketVault>(<- T.createTicketVault(dispenser_id: dispenser_id, addr: signer.address), to: /storage/TicketPublic)
        // public path
        signer.link<&T.TicketVault{T.ITicketVaultPublic}>(T.TicketVaultPublicPath, target: /storage/TicketPublic)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}
  `,
  requestUserTicket2: `
import T from 0xT
transaction(dispenser_id: UInt32, user_id: UInt32) {
    prepare(signer: AuthAccount) {
        // TODO 買い増し
    }

    execute {
        log("Setting up user ticket vault is complete.")
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