export default {
  requestDispenser: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import Tv17 from 0xT
transaction(domain: String, email: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: paid) as! @FlowToken.Vault
        signer.save<@Tv17.DispenserVault>(<- Tv17.createDispenserVault(address: signer.address, domain: domain, email: email, payment: <- payment), to: /storage/Tv17DispenserVault)
        // public path
        signer.link<&Tv17.DispenserVault{Tv17.IDispenserPublic}>(Tv17.DispenserVaultPublicPath, target: /storage/Tv17DispenserVault)
        // private path
        signer.link<&Tv17.DispenserVault>(Tv17.DispenserVaultPrivatePath, target: /storage/Tv17DispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import Tv17 from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&Tv17.Admin>(from: /storage/Tv17Admin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&Tv17.DispenserVault{Tv17.IDispenserPublic}>(Tv17.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- admin.mintDispenser(dispenser_id: dispenserVault.getId(), address: address))
    }

    execute {
        log("dispenser is dispensed.")
    }
}
  `,
  addTicketInfo: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import Tv17 from 0xT
transaction(type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let dispenserVault = signer.borrow<&Tv17.DispenserVault>(from: /storage/Tv17DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfo(type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price, flow_vault_receiver: FlowTokenReceiver)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  updateTicketInfo: `
import Tv17 from 0xT
transaction(index: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv17.DispenserVault>(from: /storage/Tv17DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.updateTicketInfo(index: index, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    execute {
        log("ticket info is updated.")
    }
}
  `,
  requestTicket: `
import Tv17 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@Tv17.TicketVault>(<- Tv17.createTicketVault(dispenser_id: dispenser_id, address: signer.address), to: /storage/Tv17TicketVault)
        // public path
        signer.link<&Tv17.TicketVault{Tv17.ITicketPublic}>(Tv17.TicketVaultPublicPath, target: /storage/Tv17TicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}
  `,
  requestMoreTicket: `
import Tv17 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&Tv17.TicketVault>(from: /storage/Tv17TicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        let user_id = ticketVault.getId()
        ticketVault.requestTicket(dispenser_id: dispenser_id, user_id: user_id, address: signer.address)
    }

    execute {
        log("ticket is requested.")
    }
}
  `,
  dispenseTicket: `
import Tv17 from 0xT
transaction(addrList: {UInt32: Address}, secret_code: String) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tv17.DispenserVault>(from: /storage/Tv17DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        for user_id in addrList.keys {
            let account = getAccount(addrList[user_id]!)
            let ticketVault = account.getCapability<&Tv17.TicketVault{Tv17.ITicketPublic}>(Tv17.TicketVaultPublicPath).borrow()
                ?? panic("Could not borrow TicketVault capability.")
            ticketVault.deposit(token: <- dispenserVault.mintTicket(secret_code: secret_code, user_id: user_id)!)
        }
    }

    execute {
        log("ticket is dispensed.")
    }
}
  `,
  useTicket: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import Tv17 from 0xT
transaction(dispenser_id: UInt32, token_id: UInt64, price: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price * 0.97) as! @FlowToken.Vault
        let charge_fee = price - payment.balance
        let commission <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: charge_fee) as! @FlowToken.Vault
        let ticketVault = signer.borrow<&Tv17.TicketVault>(from: /storage/Tv17TicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.useTicket(dispenser_id: dispenser_id, token_id: token_id, address: signer.address, payment: <- payment, fee: <- commission)
    }

    execute {
        log("ticket is used.")
    }
}
  `
}
