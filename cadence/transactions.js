export default {
  addCapabilityReceiverDebug: `
import Tickets from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let capabilityReceiver: Capability<&Tickets.Admin> = signer.getCapability<&Tickets.Admin>(Tickets.AdminPrivatePath)

        let account = getAccount(address)
        let capReceiverVault = account.getCapability<&Tickets.CapabilityReceiverVault{Tickets.IProxyCapabilityReceiverPublic}>(Tickets.CapabilityReceiverVaultPublicPath).borrow()
            ?? panic("Could not borrow CapabilityReceiverVault Capability.")
        capReceiverVault.deposit(cap: capabilityReceiver)
    }
}
  `,
  createCapabilityReceiver: `
import Tickets from 0xT
transaction() {
    prepare(signer: AuthAccount) {
        signer.save<@Tickets.CapabilityReceiverVault>(<- Tickets.createCapabilityReceiverVault(), to: /storage/TicketsCapabilityReceiverVault)
        // public path
        signer.link<&Tickets.CapabilityReceiverVault{Tickets.IProxyCapabilityReceiverPublic}>(Tickets.CapabilityReceiverVaultPublicPath, target: /storage/TicketsCapabilityReceiverVault)
    }

    execute {
        log("CapabilityReceiverVault is created.")
    }
}
  `,
  requestDispenser: `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
import Tickets from 0xT
transaction(domain: String, description: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: paid) as! @FlowToken.Vault
        signer.save<@Tickets.DispenserVault>(<- Tickets.createDispenserVault(address: signer.address, domain: domain, description: description, payment: <- payment), to: /storage/TicketsDispenserVault)
        // public path
        signer.link<&Tickets.DispenserVault{Tickets.IDispenserPublic}>(Tickets.DispenserVaultPublicPath, target: /storage/TicketsDispenserVault)
        // private path
        signer.link<&Tickets.DispenserVault>(Tickets.DispenserVaultPrivatePath, target: /storage/TicketsDispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import Tickets from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&Tickets.Admin>(from: /storage/TicketsAdmin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&Tickets.DispenserVault{Tickets.IDispenserPublic}>(Tickets.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- admin.mintDispenser(dispenser_id: dispenserVault.getId(), address: address))
    }

    execute {
        log("dispenser is dispensed.")
    }
}
  `,
  dispenseDispenserOverProxy: `
import Tickets from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let capabilityReceiverVault = signer.borrow<&Tickets.CapabilityReceiverVault>(from: /storage/TicketsCapabilityReceiverVault)
            ?? panic("Could not borrow reference to the Administrator Capability Resource.")
        let adminRef = capabilityReceiverVault.proxyCapabilityReceiver!.borrow()

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&Tickets.DispenserVault{Tickets.IDispenserPublic}>(Tickets.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- adminRef!.mintDispenser(dispenser_id: dispenserVault.getId(), address: address))
    }

    execute {
        log("dispenser is dispensed.")
    }
}
  `,
  addTicketInfo: `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
import Tickets from 0xT
transaction(type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let dispenserVault = signer.borrow<&Tickets.DispenserVault>(from: /storage/TicketsDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfo(type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price, flow_vault_receiver: FlowTokenReceiver)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  updateTicketInfo: `
import Tickets from 0xT
transaction(index: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tickets.DispenserVault>(from: /storage/TicketsDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.updateTicketInfo(index: index, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    execute {
        log("ticket info is updated.")
    }
}
  `,
  requestTicket: `
import Tickets from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@Tickets.TicketVault>(<- Tickets.createTicketVault(dispenser_id: dispenser_id, address: signer.address, crowdfunding: false), to: /storage/TicketsTicketVault)
        // public path
        signer.link<&Tickets.TicketVault{Tickets.ITicketPublic}>(Tickets.TicketVaultPublicPath, target: /storage/TicketsTicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}
  `,
  requestMoreTicket: `
import Tickets from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&Tickets.TicketVault>(from: /storage/TicketsTicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.requestTicket(dispenser_id: dispenser_id, address: signer.address)
    }

    execute {
        log("ticket is requested.")
    }
}
  `,
  dispenseTicket: `
import Tickets from 0xT
transaction(addrList: {UInt32: Address}, secret_code: String) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tickets.DispenserVault>(from: /storage/TicketsDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        for user_id in addrList.keys {
            let account = getAccount(addrList[user_id]!)
            let ticketVault = account.getCapability<&Tickets.TicketVault{Tickets.ITicketPublic}>(Tickets.TicketVaultPublicPath).borrow()
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
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
import Tickets from 0xT
transaction(dispenser_id: UInt32, token_id: UInt64, price: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price * 0.975) as! @FlowToken.Vault
        let charge_fee = price - payment.balance
        let commission <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: charge_fee) as! @FlowToken.Vault
        let ticketVault = signer.borrow<&Tickets.TicketVault>(from: /storage/TicketsTicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.useTicket(dispenser_id: dispenser_id, token_id: token_id, address: signer.address, payment: <- payment, fee: <- commission)
    }

    execute {
        log("ticket is used.")
    }
}
  `,
  crowdfunding: `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
import Tickets from 0xT
transaction(dispenser_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        signer.save<@Tickets.TicketVault>(<- Tickets.createTicketVault(dispenser_id: dispenser_id, address: signer.address, crowdfunding: true), to: /storage/TicketsTicketVault)
        // public path
        signer.link<&Tickets.TicketVault{Tickets.ITicketPublic}>(Tickets.TicketVaultPublicPath, target: /storage/TicketsTicketVault)

        let ticketVault = signer.borrow<&Tickets.TicketVault>(from: /storage/TicketsTicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")

        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: fund * 0.975) as! @FlowToken.Vault
        let charge_fee = fund - payment.balance
        let commission <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: charge_fee) as! @FlowToken.Vault
        ticketVault.crowdfunding(dispenser_id: dispenser_id, address: signer.address, payment: <- payment, fee: <- commission)
    }

    execute {
        log("crowdfunding is executed.")
    }
}
  `,
  moreCrowdfunding: `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
import Tickets from 0xT
transaction(dispenser_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&Tickets.TicketVault>(from: /storage/TicketsTicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.prepareCrowdfund(dispenser_id: dispenser_id, address: signer.address)

        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: fund * 0.975) as! @FlowToken.Vault
        let charge_fee = fund - payment.balance
        let commission <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: charge_fee) as! @FlowToken.Vault
        ticketVault.crowdfunding(dispenser_id: dispenser_id, address: signer.address, payment: <- payment, fee: <- commission)
    }

    execute {
        log("crowdfunding is executed.")
    }
}
  `,
  setRefundVault: `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
import Tickets from 0xT
transaction() {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let ticketVault = signer.borrow<&Tickets.TicketVault>(from: /storage/TicketsTicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.setRefundVault(flow_vault_receiver: FlowTokenReceiver)
    }

    execute {
        log("Vault for refund has been set.")
    }
}
  `,
  refund: `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
import Tickets from 0xT
transaction(addr: Address, user_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&Tickets.DispenserVault>(from: /storage/TicketsDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")

        let repayment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: fund) as! @FlowToken.Vault
        dispenserVault.refund(dispenser_id: dispenserVault.getId(), address: addr, user_id: user_id, repayment: <- repayment)
  }

  execute {
      log("crowdfunding is executed.")
  }
}
  `,
  createStat: `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
import StatsString from 0xT
transaction(addr: Address, nickname: String, title: String, answer1: String, answer2: String, answer3: String, answer4: String, answer5: String, answer6: String, value1: String, value2: String, value3: String, value4: String, value5: String, value6: String) {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        signer.save<@StatsString.StatsVault>(<- StatsString.createStatsVault(addr: addr, nickname: nickname, title: title, answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4, answer5: answer5, answer6: answer6, value1: value1, value2: value2, value3: value3, value4: value4, value5: value5, value6: value6, flow_vault_receiver: FlowTokenReceiver), to: /storage/StatsStringVault)
        signer.save<@StatsString.StatsPublic>(<- StatsString.createStatsPublic(), to: /storage/StatsStringVaultPublic)
        signer.link<&StatsString.StatsPublic>(StatsString.StatsVaultPublicPath, target:/storage/StatsStringVaultPublic)
    }

    execute {
        log("Setting up stats vault is complete.")
    }
}
  `,
  addStat: `
import StatsString from 0xT
transaction(addr: Address, nickname: String, title: String, answer1: String, answer2: String, answer3: String, answer4: String, answer5: String, answer6: String, value1: String, value2: String, value3: String, value4: String, value5: String, value6: String) {
    prepare(signer: AuthAccount) {
        let statsVault = signer.borrow<&StatsString.StatsVault>(from: /storage/StatsStringVault)
            ?? panic("Could not borrow reference to the Owner's StatsStringVault.")
        statsVault.addStats(addr: addr, nickname: nickname, title: title, answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4, answer5: answer5, answer6: answer6, value1: value1, value2: value2, value3: value3, value4: value4, value5: value5, value6: value6)
    }

    execute {
        log("stats is added.")
    }
}
  `,
  updateStat: `
import StatsString from 0xT
transaction(addr: Address, index: UInt32, nickname: String, title: String, answer1: String, answer2: String, answer3: String, answer4: String, answer5: String, answer6: String, value1: String, value2: String, value3: String, value4: String, value5: String, value6: String) {
  prepare(signer: AuthAccount) {
      let statsVault = signer.borrow<&StatsString.StatsVault>(from: /storage/StatsStringVault)
          ?? panic("Could not borrow reference to the Owner's StatsStringVault.")
          statsVault.updateStats(addr: addr, index: index, nickname: nickname, title: title, answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4, answer5: answer5, answer6: answer6, value1: value1, value2: value2, value3: value3, value4: value4, value5: value5, value6: value6)
  }

  execute {
      log("stats is updated.")
  }
}
  `,
  createMessage: `
import Messages from 0xT
transaction(addr: Address, ticket_addr: Address, comment: String, is_comment: Bool) {
    prepare(signer: AuthAccount) {
        signer.save<@Messages.MessagesVault>(<- Messages.createMessagesVault(addr: addr, ticket_addr: ticket_addr, comment: comment, is_comment:is_comment), to: /storage/MessagesStringVault)
        signer.save<@Messages.MessagesPublic>(<- Messages.createMessagesPublic(), to: /storage/TicketsCommentVault)
        signer.link<&Messages.MessagesPublic>(Messages.TicketsCommentVaultPublicPath, target:/storage/TicketsCommentVault)
    }

    execute {
        log("Setting up messages vault is complete.")
    }
}
  `,
  addMessage: `
import Messages from 0xT
transaction(addr: Address, ticket_addr: Address, comment: String, is_comment: Bool) {
    prepare(signer: AuthAccount) {
        let messageVault = signer.borrow<&Messages.MessagesVault>(from: /storage/MessagesStringVault)
            ?? panic("Could not borrow reference to the Owner's MessagesStringVault.")
        messageVault.addMessages(addr: signer.address, ticket_addr: ticket_addr, comment: comment, is_comment: is_comment)
    }

    execute {
        log("message is added.")
    }
}
  `,
  updateMessage: `
import Messages from 0xT
transaction(addr: Address, ticket_addr: Address, index: UInt32, comment: String, is_comment: Bool) {
    prepare(signer: AuthAccount) {
        let messageVault = signer.borrow<&Messages.MessagesVault>(from: /storage/MessagesStringVault)
            ?? panic("Could not borrow reference to the Owner's MessagesStringVault.")
        messageVault.updateMessages(addr: signer.address, ticket_addr: ticket_addr, index: index, comment: comment, is_comment: is_comment)
    }

    execute {
        log("message is updated.")
    }
  }
  `
}
