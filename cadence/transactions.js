export default {
  requestDispenser: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import TicketsV19 from 0xT
transaction(domain: String, description: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: paid) as! @FlowToken.Vault
        signer.save<@TicketsV19.DispenserVault>(<- TicketsV19.createDispenserVault(address: signer.address, domain: domain, description: description, payment: <- payment), to: /storage/TicketsV19DispenserVault)
        // public path
        signer.link<&TicketsV19.DispenserVault{TicketsV19.IDispenserPublic}>(TicketsV19.DispenserVaultPublicPath, target: /storage/TicketsV19DispenserVault)
        // private path
        signer.link<&TicketsV19.DispenserVault>(TicketsV19.DispenserVaultPrivatePath, target: /storage/TicketsV19DispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import TicketsV19 from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&TicketsV19.Admin>(from: /storage/TicketsV19Admin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&TicketsV19.DispenserVault{TicketsV19.IDispenserPublic}>(TicketsV19.DispenserVaultPublicPath).borrow()
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
import TicketsV19 from 0xT
transaction(type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let dispenserVault = signer.borrow<&TicketsV19.DispenserVault>(from: /storage/TicketsV19DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfo(type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price, flow_vault_receiver: FlowTokenReceiver)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  updateTicketInfo: `
import TicketsV19 from 0xT
transaction(index: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&TicketsV19.DispenserVault>(from: /storage/TicketsV19DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.updateTicketInfo(index: index, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    execute {
        log("ticket info is updated.")
    }
}
  `,
  requestTicket: `
import TicketsV19 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@TicketsV19.TicketVault>(<- TicketsV19.createTicketVault(dispenser_id: dispenser_id, address: signer.address, crowdfunding: false), to: /storage/TicketsV19TicketVault)
        // public path
        signer.link<&TicketsV19.TicketVault{TicketsV19.ITicketPublic}>(TicketsV19.TicketVaultPublicPath, target: /storage/TicketsV19TicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}
  `,
  requestMoreTicket: `
import TicketsV19 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&TicketsV19.TicketVault>(from: /storage/TicketsV19TicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.requestTicket(dispenser_id: dispenser_id, address: signer.address)
    }

    execute {
        log("ticket is requested.")
    }
}
  `,
  dispenseTicket: `
import TicketsV19 from 0xT
transaction(addrList: {UInt32: Address}, secret_code: String) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&TicketsV19.DispenserVault>(from: /storage/TicketsV19DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        for user_id in addrList.keys {
            let account = getAccount(addrList[user_id]!)
            let ticketVault = account.getCapability<&TicketsV19.TicketVault{TicketsV19.ITicketPublic}>(TicketsV19.TicketVaultPublicPath).borrow()
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
import TicketsV19 from 0xT
transaction(dispenser_id: UInt32, token_id: UInt64, price: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price * 0.97) as! @FlowToken.Vault
        let charge_fee = price - payment.balance
        let commission <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: charge_fee) as! @FlowToken.Vault
        let ticketVault = signer.borrow<&TicketsV19.TicketVault>(from: /storage/TicketsV19TicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.useTicket(dispenser_id: dispenser_id, token_id: token_id, address: signer.address, payment: <- payment, fee: <- commission)
    }

    execute {
        log("ticket is used.")
    }
}
  `,
  crowdfunding: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import TicketsV19 from 0xT
transaction(dispenser_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        signer.save<@TicketsV19.TicketVault>(<- TicketsV19.createTicketVault(dispenser_id: dispenser_id, address: signer.address, crowdfunding: true), to: /storage/TicketsV19TicketVault)
        // public path
        signer.link<&TicketsV19.TicketVault{TicketsV19.ITicketPublic}>(TicketsV19.TicketVaultPublicPath, target: /storage/TicketsV19TicketVault)

        let ticketVault = signer.borrow<&TicketsV19.TicketVault>(from: /storage/TicketsV19TicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        var charge_fee = 0.1
        if (fund >= 10.0) {
            charge_fee = 1.0
        }
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: fund - charge_fee) as! @FlowToken.Vault
        let commission <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: charge_fee) as! @FlowToken.Vault
        ticketVault.crowdfunding(dispenser_id: dispenser_id, address: signer.address, payment: <- payment, fee: <- commission)
        }

    execute {
        log("crowdfunding is executed.")
    }
}
  `
}
