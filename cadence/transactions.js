export default {
  requestDispenser: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import TicketsV20 from 0xT
transaction(domain: String, description: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: paid) as! @FlowToken.Vault
        signer.save<@TicketsV20.DispenserVault>(<- TicketsV20.createDispenserVault(address: signer.address, domain: domain, description: description, payment: <- payment), to: /storage/TicketsV20DispenserVault)
        // public path
        signer.link<&TicketsV20.DispenserVault{TicketsV20.IDispenserPublic}>(TicketsV20.DispenserVaultPublicPath, target: /storage/TicketsV20DispenserVault)
        // private path
        signer.link<&TicketsV20.DispenserVault>(TicketsV20.DispenserVaultPrivatePath, target: /storage/TicketsV20DispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import TicketsV20 from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&TicketsV20.Admin>(from: /storage/TicketsV20Admin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&TicketsV20.DispenserVault{TicketsV20.IDispenserPublic}>(TicketsV20.DispenserVaultPublicPath).borrow()
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
import TicketsV20 from 0xT
transaction(type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let dispenserVault = signer.borrow<&TicketsV20.DispenserVault>(from: /storage/TicketsV20DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfo(type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price, flow_vault_receiver: FlowTokenReceiver)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  updateTicketInfo: `
import TicketsV20 from 0xT
transaction(index: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&TicketsV20.DispenserVault>(from: /storage/TicketsV20DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.updateTicketInfo(index: index, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    execute {
        log("ticket info is updated.")
    }
}
  `,
  requestTicket: `
import TicketsV20 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@TicketsV20.TicketVault>(<- TicketsV20.createTicketVault(dispenser_id: dispenser_id, address: signer.address, crowdfunding: false), to: /storage/TicketsV20TicketVault)
        // public path
        signer.link<&TicketsV20.TicketVault{TicketsV20.ITicketPublic}>(TicketsV20.TicketVaultPublicPath, target: /storage/TicketsV20TicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}
  `,
  requestMoreTicket: `
import TicketsV20 from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&TicketsV20.TicketVault>(from: /storage/TicketsV20TicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.requestTicket(dispenser_id: dispenser_id, address: signer.address)
    }

    execute {
        log("ticket is requested.")
    }
}
  `,
  dispenseTicket: `
import TicketsV20 from 0xT
transaction(addrList: {UInt32: Address}, secret_code: String) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&TicketsV20.DispenserVault>(from: /storage/TicketsV20DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        for user_id in addrList.keys {
            let account = getAccount(addrList[user_id]!)
            let ticketVault = account.getCapability<&TicketsV20.TicketVault{TicketsV20.ITicketPublic}>(TicketsV20.TicketVaultPublicPath).borrow()
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
import TicketsV20 from 0xT
transaction(dispenser_id: UInt32, token_id: UInt64, price: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price * 0.975) as! @FlowToken.Vault
        let charge_fee = price - payment.balance
        let commission <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: charge_fee) as! @FlowToken.Vault
        let ticketVault = signer.borrow<&TicketsV20.TicketVault>(from: /storage/TicketsV20TicketVault)
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
import TicketsV20 from 0xT
transaction(dispenser_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        signer.save<@TicketsV20.TicketVault>(<- TicketsV20.createTicketVault(dispenser_id: dispenser_id, address: signer.address, crowdfunding: true), to: /storage/TicketsV20TicketVault)
        // public path
        signer.link<&TicketsV20.TicketVault{TicketsV20.ITicketPublic}>(TicketsV20.TicketVaultPublicPath, target: /storage/TicketsV20TicketVault)

        let ticketVault = signer.borrow<&TicketsV20.TicketVault>(from: /storage/TicketsV20TicketVault)
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
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import TicketsV20 from 0xT
transaction(dispenser_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&TicketsV20.TicketVault>(from: /storage/TicketsV20TicketVault)
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
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import TicketsV20 from 0xT
transaction() {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let ticketVault = signer.borrow<&TicketsV20.TicketVault>(from: /storage/TicketsV20TicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.setRefundVault(flow_vault_receiver: FlowTokenReceiver)
    }

    execute {
        log("Vault for refund has been set.")
    }
}
  `,
  refund: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import TicketsV20 from 0xT
transaction(dispenser_id: UInt32, addr: Address, user_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&TicketsV20.DispenserVault>(from: /storage/TicketsV20DispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")

        let repayment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: fund) as! @FlowToken.Vault
        dispenserVault.refund(dispenser_id: dispenser_id, address: addr, user_id: user_id, repayment: <- repayment)
  }

  execute {
      log("crowdfunding is executed.")
  }
}
  `,
  createStat: `
import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
import TicketStatsV12 from 0xT
transaction(addr: Address, nickname: String, title: String, answer1: String, answer2: String, answer3: String, answer4: String, value1: UFix64, value2: UFix64, value3: UFix64, value4: UFix64) {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        signer.save<@TicketStatsV12.StatsVault>(<- TicketStatsV12.createStatsVault(addr: addr, nickname: nickname, title: title, answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4, value1: value1, value2: value2, value3: value3, value4: value4, flow_vault_receiver: FlowTokenReceiver), to: /storage/TicketStatsV12Vault)
        signer.save<@TicketStatsV12.StatsPublic>(<- TicketStatsV12.createStatsPublic(), to: /storage/TicketStatsV12VaultPublic)
        signer.link<&TicketStatsV12.StatsPublic>(TicketStatsV12.StatsVaultPublicPath, target:/storage/TicketStatsV12VaultPublic)
    }

    execute {
        log("Setting up stats vault is complete.")
    }
}
  `,
  addStat: `
import TicketStatsV12 from 0xT
transaction(addr: Address, nickname: String, title: String, answer1: String, answer2: String, answer3: String, answer4: String, value1: UFix64, value2: UFix64, value3: UFix64, value4: UFix64) {
    prepare(signer: AuthAccount) {
        let statsVault = signer.borrow<&TicketStatsV12.StatsVault>(from: /storage/TicketStatsV12Vault)
            ?? panic("Could not borrow reference to the Owner's StatsVault.")
        statsVault.addStats(addr: addr, nickname: nickname, title: title, answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4, value1: value1, value2: value2, value3: value3, value4: value4)
    }

    execute {
        log("stats is added.")
    }
}
  `,
  updateStat: `
import TicketStatsV12 from 0xT
transaction(addr: Address, index: UInt32, nickname: String, title: String, answer1: String, answer2: String, answer3: String, answer4: String, value1: UFix64, value2: UFix64, value3: UFix64, value4: UFix64) {
  prepare(signer: AuthAccount) {
      let statsVault = signer.borrow<&TicketStatsV12.StatsVault>(from: /storage/TicketStatsV12Vault)
          ?? panic("Could not borrow reference to the Owner's StatsVault.")
          statsVault.updateStats(addr: addr, index: index, nickname: nickname, title: title, answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4, value1: value1, value2: value2, value3: value3, value4: value4)
  }

  execute {
      log("ticket info is updated.")
  }
}
  `
}
