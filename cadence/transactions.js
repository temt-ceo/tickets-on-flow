export default {
  addCapabilityReceiverDebug: `
import TicketsBeta from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let capabilityReceiver: Capability<&TicketsBeta.Admin> = signer.getCapability<&TicketsBeta.Admin>(TicketsBeta.AdminPrivatePath)

        let account = getAccount(address)
        let capReceiverVault = account.getCapability<&TicketsBeta.CapabilityReceiverVault{TicketsBeta.IProxyCapabilityReceiverPublic}>(TicketsBeta.CapabilityReceiverVaultPublicPath).borrow()
            ?? panic("Could not borrow CapabilityReceiverVault Capability.")
        capReceiverVault.deposit(cap: capabilityReceiver)
    }
}
  `,
  createCapabilityReceiver: `
import TicketsBeta from 0xT
transaction() {
    prepare(signer: AuthAccount) {
        signer.save<@TicketsBeta.CapabilityReceiverVault>(<- TicketsBeta.createCapabilityReceiverVault(), to: /storage/TicketsBetaCapabilityReceiverVault)
        // public path
        signer.link<&TicketsBeta.CapabilityReceiverVault{TicketsBeta.IProxyCapabilityReceiverPublic}>(TicketsBeta.CapabilityReceiverVaultPublicPath, target: /storage/TicketsBetaCapabilityReceiverVault)
    }

    execute {
        log("CapabilityReceiverVault is created.")
    }
}
  `,
  requestDispenser: `
import FlowToken from 0x1654653399040a61
import FungibleToken from 0xf233dcee88fe0abe
import TicketsBeta from 0xT
transaction(domain: String, description: String, paid: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: paid) as! @FlowToken.Vault
        signer.save<@TicketsBeta.DispenserVault>(<- TicketsBeta.createDispenserVault(address: signer.address, domain: domain, description: description, payment: <- payment), to: /storage/TicketsBetaDispenserVault)
        // public path
        signer.link<&TicketsBeta.DispenserVault{TicketsBeta.IDispenserPublic}>(TicketsBeta.DispenserVaultPublicPath, target: /storage/TicketsBetaDispenserVault)
        // private path
        signer.link<&TicketsBeta.DispenserVault>(TicketsBeta.DispenserVaultPrivatePath, target: /storage/TicketsBetaDispenserVault)
    }

    execute {
        log("ticket dispenser is requested.")
    }
}
  `,
  dispenseDispenser: `
import TicketsBeta from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let admin = signer.borrow<&TicketsBeta.Admin>(from: /storage/TicketsBetaAdmin)
            ?? panic("Could not borrow reference to the Administrator Resource.")

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&TicketsBeta.DispenserVault{TicketsBeta.IDispenserPublic}>(TicketsBeta.DispenserVaultPublicPath).borrow()
            ?? panic("Could not borrow DispenserVault Capability.")
        dispenserVault.deposit(minter: <- admin.mintDispenser(dispenser_id: dispenserVault.getId(), address: address))
    }

    execute {
        log("dispenser is dispensed.")
    }
}
  `,
  dispenseDispenserOverProxy: `
import TicketsBeta from 0xT
transaction(address: Address) {
    prepare(signer: AuthAccount) {
        let capabilityReceiverVault = signer.borrow<&TicketsBeta.CapabilityReceiverVault>(from: /storage/TicketsBetaCapabilityReceiverVault)
            ?? panic("Could not borrow reference to the Administrator Capability Resource.")
        let adminRef = capabilityReceiverVault.proxyCapabilityReceiver!.borrow()

        let account = getAccount(address)
        let dispenserVault = account.getCapability<&TicketsBeta.DispenserVault{TicketsBeta.IDispenserPublic}>(TicketsBeta.DispenserVaultPublicPath).borrow()
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
import TicketsBeta from 0xT
transaction(type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let dispenserVault = signer.borrow<&TicketsBeta.DispenserVault>(from: /storage/TicketsBetaDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.addTicketInfo(type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price, flow_vault_receiver: FlowTokenReceiver)
    }

    execute {
        log("ticket info is registered.")
    }
}
  `,
  updateTicketInfo: `
import TicketsBeta from 0xT
transaction(index: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&TicketsBeta.DispenserVault>(from: /storage/TicketsBetaDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        dispenserVault.updateTicketInfo(index: index, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    execute {
        log("ticket info is updated.")
    }
}
  `,
  requestTicket: `
import TicketsBeta from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        signer.save<@TicketsBeta.TicketVault>(<- TicketsBeta.createTicketVault(dispenser_id: dispenser_id, address: signer.address, crowdfunding: false), to: /storage/TicketsBetaTicketVault)
        // public path
        signer.link<&TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}>(TicketsBeta.TicketVaultPublicPath, target: /storage/TicketsBetaTicketVault)
    }

    execute {
        log("Setting up user ticket vault is complete.")
    }
}
  `,
  requestMoreTicket: `
import TicketsBeta from 0xT
transaction(dispenser_id: UInt32) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&TicketsBeta.TicketVault>(from: /storage/TicketsBetaTicketVault)
            ?? panic("Could not borrow reference to the Owner's TicketVault.")
        ticketVault.requestTicket(dispenser_id: dispenser_id, address: signer.address)
    }

    execute {
        log("ticket is requested.")
    }
}
  `,
  dispenseTicket: `
import TicketsBeta from 0xT
transaction(addrList: {UInt32: Address}, secret_code: String) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&TicketsBeta.DispenserVault>(from: /storage/TicketsBetaDispenserVault)
            ?? panic("Could not borrow reference to the Owner's DispenserVault.")
        for user_id in addrList.keys {
            let account = getAccount(addrList[user_id]!)
            let ticketVault = account.getCapability<&TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}>(TicketsBeta.TicketVaultPublicPath).borrow()
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
import TicketsBeta from 0xT
transaction(dispenser_id: UInt32, token_id: UInt64, price: UFix64) {
    prepare(signer: AuthAccount) {
        let payment <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price * 0.975) as! @FlowToken.Vault
        let charge_fee = price - payment.balance
        let commission <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: charge_fee) as! @FlowToken.Vault
        let ticketVault = signer.borrow<&TicketsBeta.TicketVault>(from: /storage/TicketsBetaTicketVault)
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
import TicketsBeta from 0xT
transaction(dispenser_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        signer.save<@TicketsBeta.TicketVault>(<- TicketsBeta.createTicketVault(dispenser_id: dispenser_id, address: signer.address, crowdfunding: true), to: /storage/TicketsBetaTicketVault)
        // public path
        signer.link<&TicketsBeta.TicketVault{TicketsBeta.ITicketPublic}>(TicketsBeta.TicketVaultPublicPath, target: /storage/TicketsBetaTicketVault)

        let ticketVault = signer.borrow<&TicketsBeta.TicketVault>(from: /storage/TicketsBetaTicketVault)
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
import TicketsBeta from 0xT
transaction(dispenser_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        let ticketVault = signer.borrow<&TicketsBeta.TicketVault>(from: /storage/TicketsBetaTicketVault)
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
import TicketsBeta from 0xT
transaction() {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        let ticketVault = signer.borrow<&TicketsBeta.TicketVault>(from: /storage/TicketsBetaTicketVault)
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
import TicketsBeta from 0xT
transaction(addr: Address, user_id: UInt32, fund: UFix64) {
    prepare(signer: AuthAccount) {
        let dispenserVault = signer.borrow<&TicketsBeta.DispenserVault>(from: /storage/TicketsBetaDispenserVault)
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
import TicketStatsV13 from 0xT
transaction(addr: Address, nickname: String, title: String, answer1: String, answer2: String, answer3: String, answer4: String, answer5: String, answer6: String, value1: UFix64, value2: UFix64, value3: UFix64, value4: UFix64, value5: UFix64, value6: UFix64) {
    prepare(signer: AuthAccount) {
        let FlowTokenReceiver = signer.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        signer.save<@TicketStatsV13.StatsVault>(<- TicketStatsV13.createStatsVault(addr: addr, nickname: nickname, title: title, answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4, answer5: answer5, answer6: answer6, value1: value1, value2: value2, value3: value3, value4: value4, value5: value5, value6: value6, flow_vault_receiver: FlowTokenReceiver), to: /storage/TicketStatsV13Vault)
        signer.save<@TicketStatsV13.StatsPublic>(<- TicketStatsV13.createStatsPublic(), to: /storage/TicketStatsV13VaultPublic)
        signer.link<&TicketStatsV13.StatsPublic>(TicketStatsV13.StatsVaultPublicPath, target:/storage/TicketStatsV13VaultPublic)
    }

    execute {
        log("Setting up stats vault is complete.")
    }
}
  `,
  addStat: `
import TicketStatsV13 from 0xT
transaction(addr: Address, nickname: String, title: String, answer1: String, answer2: String, answer3: String, answer4: String, answer5: String, answer6: String, value1: UFix64, value2: UFix64, value3: UFix64, value4: UFix64, value5: UFix64, value6: UFix64) {
    prepare(signer: AuthAccount) {
        let statsVault = signer.borrow<&TicketStatsV13.StatsVault>(from: /storage/TicketStatsV13Vault)
            ?? panic("Could not borrow reference to the Owner's StatsVault.")
        statsVault.addStats(addr: addr, nickname: nickname, title: title, answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4, answer5: answer5, answer6: answer6, value1: value1, value2: value2, value3: value3, value4: value4, value5: value5, value6: value6)
    }

    execute {
        log("stats is added.")
    }
}
  `,
  updateStat: `
import TicketStatsV13 from 0xT
transaction(addr: Address, index: UInt32, nickname: String, title: String, answer1: String, answer2: String, answer3: String, answer4: String, answer5: String, answer6: String, value1: UFix64, value2: UFix64, value3: UFix64, value4: UFix64, value5: UFix64, value6: UFix64) {
  prepare(signer: AuthAccount) {
      let statsVault = signer.borrow<&TicketStatsV13.StatsVault>(from: /storage/TicketStatsV13Vault)
          ?? panic("Could not borrow reference to the Owner's StatsVault.")
          statsVault.updateStats(addr: addr, index: index, nickname: nickname, title: title, answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4, answer5: answer5, answer6: answer6, value1: value1, value2: value2, value3: value3, value4: value4, value5: value5, value6: value6)
  }

  execute {
      log("ticket info is updated.")
  }
}
  `
}
