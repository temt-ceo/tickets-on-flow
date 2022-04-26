export default {
  requestDispenser: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import Tv16 from 0xT
transaction(domain: String, email: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: paid) as! @FlowToken.Vault
        signer.save<@Tv16.DispenserVault>(<- Tv16.createDispenserVault(address: signer.address, domain: domain, email: email, payment: <- payment), to: /storage/Tv16DispenserVault)
        // public path
        signer.link<&Tv16.DispenserVault{Tv16.IDispenserPublic}>(Tv16.DispenserVaultPublicPath, target: /storage/Tv16DispenserVault)
        // private path
        signer.link<&Tv16.DispenserVault>(Tv16.DispenserVaultPrivatePath, target: /storage/Tv16DispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import Tv16 from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&Tv16.Admin>(from: /storage/Tv16Admin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&Tv16.DispenserVault{Tv16.IDispenserPublic}>(Tv16.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- admin.mintDispenser(dispenser_id: dispenserVault.getId(), address: address))
    }

    execute {
        log("dispenser is dispensed.")
    }
}
  `,
  addTicketInfo: `
import Tv16 from 0xT
transaction(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv16.DispenserVault>(from: /storage/Tv16DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfo(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  updateTicketInfo: `
import Tv16 from 0xT
transaction(index: UInt32, dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv16.DispenserVault>(from: /storage/Tv16DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.updateTicketInfo(index: index, dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    execute {
        log("ticket info is updated.")
    }
}
  `,
  requestTicket: `
import Tv16 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv16.TicketVault>(<- Tv16.createTicketVault(dispenser_id: dispenser_id, address: signer.address), to: /storage/Tv16TicketVault)
        // public path
        signer.link<&Tv16.TicketVault{Tv16.ITicketPublic}>(Tv16.TicketVaultPublicPath, target: /storage/Tv16TicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}
  `,
  requestMoreTicket: `
import Tv16 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&Tv16.TicketVault>(from: /storage/Tv16TicketVault)
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
transaction(secret_code: String, dispenser_id: UInt32, addrList: [AnyStruct]) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&T.DispenserVault>(from: /storage/TicketDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        for obj in addrList {
            let account = getAccount(obj.address)
            let ticketVault = account.getCapability<&T.TicketVault{T.ITicketPublic}>(T.TicketVaultPublicPath).borrow()
                ?? panic("Could not borrow TicketVault capability.")
            ticketVault.deposit(token: dispenserVault.mintTicket(secret_code: secret_code, dispenser_id: dispenser_id, user_id: obj.user_id)!)
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
