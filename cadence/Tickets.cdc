import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7

pub contract Tv16 {
  // Events
  pub event DispenserRequested(dispenser_id: UInt32, address: Address)
  pub event DispenserGranted(dispenser_id: UInt32, address: Address)
  pub event TicketRequested(dispenser_id: UInt32, user_id: UInt32, address: Address)
  pub event TicketUsed(dispenser_id: UInt32, user_id: UInt32, token_id: UInt64, address: Address)

  // Paths
  pub let AdminPublicPath: PublicPath
  pub let DispenserVaultPublicPath: PublicPath
  pub let DispenserVaultPrivatePath: PrivatePath
  pub let TicketVaultPublicPath: PublicPath
  pub let TicketVaultPrivatePath: PrivatePath

  // Variants
  priv var totalDispenserVaultSupply: UInt32
  priv var totalTicketSupply: UInt64
  priv var totalTicketVaultSupply: UInt32
  pub let FlowTokenVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>

  // Objects
  priv let dispenserOwners: {UInt32: DispenserStruct}
  priv let ticketInfo: [TicketStruct]
  priv let ticketRequesters: {UInt32: {UInt32: RequestStruct}}

  /*
  ** [Struct]DispenserStruct
  */
  pub struct DispenserStruct {
    access(contract) let dispenser_id: UInt32
    access(contract) let address: Address
    access(contract) let domain: String
    priv let email: String
    priv let paid: UFix64
    pub(set) var grant: Bool

    init(dispenser_id: UInt32, address: Address, domain: String, email: String, paid: UFix64, grant: Bool) {
      self.address = address
      self.dispenser_id = dispenser_id
      self.domain = domain
      self.email = email
      self.paid = paid
      self.grant = grant
    }
  }

  /*
  ** [Struct]　TicketStruct
  */
  pub struct TicketStruct {
    access(contract) let dispenser_id: UInt32
    priv let domain: String
    priv let type: UInt8
    priv let name: String
    priv let where_to_use: String
    priv let when_to_use: String
    priv let price: UFix64

    init(dispenser_id: UInt32, domain: String, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
      self.dispenser_id = dispenser_id
      self.domain = domain
      self.type = type
      self.name = name
      self.where_to_use = where_to_use
      self.when_to_use = when_to_use
      self.price = price
    }
  } 

  /*
  ** [Struct] RequestStruct
  */
  pub struct RequestStruct {
    access(contract) let user_id: UInt32
    access(contract) let address: Address
    pub(set) var latest_token: UInt64?
    pub(set) var time: UFix64 // Time
    pub(set) var count: UInt8
    pub(set) var paid: UFix64

    init(time: UFix64, user_id: UInt32, address: Address) {
      self.user_id = user_id
      self.address = address
      self.latest_token = nil
      self.time = time
      self.count = 1
      self.paid = 0.0
    }
  }

  /*
  ** [Resource] Admin
  */
  pub resource Admin {
  
    pub fun mintDispenser(dispenser_id: UInt32, address: Address): @Dispenser {
      pre {
        Tv16.dispenserOwners[dispenser_id] != nil : "Requested address is not in previously requested list."
        Tv16.dispenserOwners[dispenser_id]!.grant == false : "Requested address is already minted."
      }
      if let data = Tv16.dispenserOwners[dispenser_id] {
        data.grant = true
        Tv16.dispenserOwners[dispenser_id] = data
      }
      emit DispenserGranted(dispenser_id: dispenser_id, address: address)
      return <- create Dispenser()
    }

    init() {
    }
  }

  /*
  ** [Resource] AdminPublic
  */
  pub resource AdminPublic {
    pub fun getDispenserRequesters(): [DispenserStruct] {
      var dispenserArr: [DispenserStruct] = []
      for data in Tv16.dispenserOwners.values {
        if (data.grant == false) {
          dispenserArr.append(data)
        }
      }

      return dispenserArr
    }

    pub fun getDispenserDomains(): [String] {
      var dispenserArr: [String] = []
      for data in Tv16.dispenserOwners.values {
        dispenserArr.append(data.domain)
      }
      return dispenserArr
    }

    init() {
    }
  }

  /*
  ** [Resource] Dispenser
  */
  pub resource Dispenser {

    priv var last_token_id: UInt64

    pub fun getLatestMintedTokenId(): UInt64 {
      return self.last_token_id
    }

    pub fun mintTicket(secret_code: String, dispenser_id: UInt32, user_id: UInt32): @Ticket {
      let token <- create Ticket(secret_code: secret_code, dispenser_id: dispenser_id)
      if(Tv16.ticketRequesters.containsKey(dispenser_id)) {
        if let data = Tv16.ticketRequesters[dispenser_id]![user_id] {
          let ref = &Tv16.ticketRequesters[dispenser_id]![user_id]! as &RequestStruct
          ref.latest_token = token.getId()
          self.last_token_id = token.getId()
        }
      }
      return <- token
    }

    pub fun addTicketInfo(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
      let domain = Tv16.dispenserOwners[dispenser_id]!.domain
      let ticket = TicketStruct(dispenser_id: dispenser_id, domain: domain, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
      Tv16.ticketInfo.append(ticket)
    }

    pub fun updateTicketInfo(index: UInt32, dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
      let domain = Tv16.dispenserOwners[dispenser_id]!.domain
      let ticket = TicketStruct(dispenser_id: dispenser_id, domain: domain, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
      let existTicket = Tv16.ticketInfo.remove(at: index)
      if (existTicket.dispenser_id == dispenser_id) {
        Tv16.ticketInfo.insert(at: index, ticket)
      } else {
        panic("Something went wrong.")
      }
    }

    pub fun getTicketRequesters(dispenser_id: UInt32): {UInt32: RequestStruct}? {
      return Tv16.ticketRequesters[dispenser_id]
    }

    init() {
      self.last_token_id = 0
    }
  }

  /*
  ** [Interface] IDispenserPrivate
  */
  pub resource interface IDispenserPrivate {
    pub var ownedDispenser: @Dispenser?
    pub var dispenser_id: UInt32
    pub fun addTicketInfo(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64)
    pub fun updateTicketInfo(index: UInt32, dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64)
  }

  /*
  ** [Interface] IDispenserPublic
  */
  pub resource interface IDispenserPublic {
    pub fun deposit(minter: @Dispenser)
    pub fun hasDispenser(): Bool
    pub fun getId(): UInt32
    pub fun getTicketRequesters(dispenser_id: UInt32): {UInt32: RequestStruct}??
    pub fun getLatestMintedTokenId(): UInt64?
  }

  /*
  ** [Resource] DispenserVault
  */
  pub resource DispenserVault: IDispenserPrivate, IDispenserPublic {

    // [private access]
    pub var ownedDispenser: @Dispenser?

    // [private access]
    pub var dispenser_id: UInt32

    // [public access]
    pub fun deposit(minter: @Dispenser) {
      if (self.ownedDispenser == nil) {
        self.ownedDispenser <-! minter
      } else {
        destroy minter
      }
    }

    // [public access]
    pub fun hasDispenser(): Bool {
      if (self.ownedDispenser != nil) {
        return true
      } else {
        return false
      }
    }

    // [public access]
    pub fun getId(): UInt32 {
        return self.dispenser_id
    }

    // [public access]
    pub fun getTicketRequesters(dispenser_id: UInt32): {UInt32: RequestStruct}?? {
      return self.ownedDispenser?.getTicketRequesters(dispenser_id: dispenser_id)
    }

    // [public access]
    pub fun getLatestMintedTokenId(): UInt64? {
      return self.ownedDispenser?.getLatestMintedTokenId()
    }

    // [private access]
    pub fun addTicketInfo(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
      self.ownedDispenser?.addTicketInfo(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    // [private access]
    pub fun updateTicketInfo(index: UInt32, dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
      self.ownedDispenser?.updateTicketInfo(index: index, dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    // [private access]
    pub fun mintTicket(secret_code: String, dispenser_id: UInt32, user_id: UInt32): @Ticket? {
      return <- self.ownedDispenser?.mintTicket(secret_code: secret_code, dispenser_id: dispenser_id, user_id: user_id)
    }

    destroy() {
      destroy self.ownedDispenser
    }

    init(_ address: Address, _ domain: String, _ email: String, _ paid: UFix64) {
      // TotalSupply
      self.dispenser_id = Tv16.totalDispenserVaultSupply + 1
      Tv16.totalDispenserVaultSupply = Tv16.totalDispenserVaultSupply + 1

      // Event, Data
      emit DispenserRequested(dispenser_id: self.dispenser_id, address: address)
      self.ownedDispenser <- nil
      Tv16.dispenserOwners[self.dispenser_id] = DispenserStruct(dispenser_id: self.dispenser_id, address: address, domain: domain, email: email, paid: paid, grant: false)
    }
  }

  /*
  ** [create vault] createDispenserVault
  */
  pub fun createDispenserVault(address: Address, domain: String, email: String, payment: @FlowToken.Vault): @DispenserVault {
    pre {
      payment.balance >= 0.5: "Payment is not sufficient"
    }
    let paid: UFix64 = payment.balance
    self.FlowTokenVault.borrow()!.deposit(from: <- payment)
    return <- create DispenserVault(address, domain, email, paid)
  }

  /*
  ** [Resource] Ticket
  */
  pub resource Ticket {
    priv let token_id: UInt64
    priv let dispenser_id: UInt32
    priv let secret_code: String
    priv var readable_code: String

    pub fun getId(): UInt64 {
      return self.token_id
    }

    pub fun getCode(): String {
      return self.readable_code
    }

    pub fun useTicket() {
      pre {
        self.readable_code == nil: "Something went wrong."
      }
      self.readable_code = self.secret_code
    }

    init(secret_code: String, dispenser_id: UInt32) {
      // TotalSupply
      self.token_id = Tv16.totalTicketSupply + 1
      Tv16.totalTicketSupply = Tv16.totalTicketSupply + 1

      // Event, Data
      self.dispenser_id = dispenser_id
      self.secret_code = secret_code // チケット名称
      self.readable_code = "" // チケット枚数
    }
  }

  /*
  ** [Interface] ITicketPrivate
  */
  pub resource interface ITicketPrivate {
    access(contract) var ownedTicket: @{UInt64: Ticket}
    pub fun requestTicket(dispenser_id: UInt32, user_id: UInt32, address: Address)
    pub fun useTicket(dispenser_id: UInt32, user_id: UInt32, token_id: UInt64, address: Address, price: UFix64)
  }

  /*
  ** [Interface] ITicketPublic
  */
  pub resource interface ITicketPublic {
    pub fun deposit(token: @Ticket)
    pub fun getId(): UInt32
  }

  /*
  ** [Ticket Vault] TicketVault
  */
  pub resource TicketVault: ITicketPrivate, ITicketPublic {

    priv var user_id: UInt32
    access(contract) var ownedTicket: @{UInt64: Ticket}

    // [public access]
    pub fun deposit(token: @Ticket) {
      pre {
        self.ownedTicket[token.getId()] == nil : "You have same ticket."
      }
      self.ownedTicket[token.getId()] <-! token
    }

    // [public access]
    pub fun getId(): UInt32 {
        return self.user_id
    }

    // [private access]
    pub fun requestTicket(dispenser_id: UInt32, user_id: UInt32, address: Address) {
      let time = getCurrentBlock().timestamp
      if (Tv16.ticketRequesters.containsKey(dispenser_id)) {
        if let data = Tv16.ticketRequesters[dispenser_id]![user_id] {
          let ref = &Tv16.ticketRequesters[dispenser_id]![user_id]! as &RequestStruct
          ref.count = data.count + 1
          ref.time = time

          emit TicketRequested(dispenser_id: dispenser_id, user_id: self.user_id, address: address)
        } else {
          let requestStruct = RequestStruct(time: time, user_id: user_id, address: address)
          if let data = Tv16.ticketRequesters[dispenser_id] {
            data[user_id] = requestStruct
            Tv16.ticketRequesters[dispenser_id] = data
          }
        }
      } else {
        let requestStruct = RequestStruct(time: time, user_id: user_id, address: address)
        Tv16.ticketRequesters[dispenser_id] = {user_id: requestStruct}
      }
    }

    // [private access]
    pub fun useTicket(dispenser_id: UInt32, user_id: UInt32, token_id: UInt64, address: Address, price: UFix64) {
      if (self.ownedTicket[token_id] != nil) {
        self.ownedTicket[token_id]?.useTicket()

        if(Tv16.ticketRequesters.containsKey(dispenser_id)) {
          if let data = Tv16.ticketRequesters[dispenser_id]![user_id] {
            let ref = &Tv16.ticketRequesters[dispenser_id]![user_id]! as &RequestStruct
            ref.paid = data.paid + price
          }
        }
        emit TicketUsed(dispenser_id: dispenser_id, user_id: user_id, token_id: token_id, address: address)
      } else {
        panic("You need to get tickets.")
      }
    }

    pub fun getCode(token_id: UInt64): String {
      return self.ownedTicket[token_id]?.getCode()!
    }

    destroy() {
      destroy self.ownedTicket
    }

    init(_ dispenser_id: UInt32, _ address: Address) {
      // TotalSupply
      self.user_id = Tv16.totalTicketVaultSupply + 1
      Tv16.totalTicketVaultSupply = Tv16.totalTicketVaultSupply + 1

      // Event, Data
      self.ownedTicket <- {}
      let time = getCurrentBlock().timestamp
      let requestStruct = RequestStruct(time: time, user_id: self.user_id, address: address)
      if let data = Tv16.ticketRequesters[dispenser_id] {
        data[self.user_id] = requestStruct
        Tv16.ticketRequesters[dispenser_id] = data
      } else {
        Tv16.ticketRequesters[dispenser_id] = {self.user_id: requestStruct}
      }
      emit TicketRequested(dispenser_id: dispenser_id, user_id: self.user_id, address: address)
    }
  }

  /*
  // [create vault] createTicketVault
  */
  pub fun createTicketVault(dispenser_id: UInt32, address: Address): @TicketVault {
    return <- create TicketVault(dispenser_id, address)
  }

  /*
  ** [Public Function] getDispenserInfo
  */
  pub fun getDispenserInfo(address: Address): {UInt32: String}? {
    var dispenserArr: [DispenserStruct] = []
    for data in Tv16.dispenserOwners.values {
      if (data.address == address) {
        return {data.dispenser_id: data.domain}
      }
    }
    return nil
  }

  /*
  ** [Public Function] getTickets
  */
  pub fun getTickets(): [TicketStruct] {
    return Tv16.ticketInfo
  }

  /*
  ** [Public Function] getTicketRequestStatus
  */
  pub fun getTicketRequestStatus(dispenser_id: UInt32, user_id: UInt32): RequestStruct? {
    return Tv16.ticketRequesters[dispenser_id]![user_id]
  }

  /*
  ** init
  */
  init() {
    self.AdminPublicPath = /public/Tv16AdminPublic
    self.DispenserVaultPublicPath = /public/Tv16DispenserVault
    self.TicketVaultPublicPath = /public/Tv16Vault
    self.DispenserVaultPrivatePath = /private/Tv16DispenserVault
    self.TicketVaultPrivatePath = /private/Tv16Vault
    self.totalDispenserVaultSupply = 0
    self.totalTicketSupply = 0
    self.totalTicketVaultSupply = 0
    self.dispenserOwners = {}
    self.ticketRequesters = {}
    self.ticketInfo = []
    self.FlowTokenVault = self.account.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    // grant admin rights
    self.account.save<@Tv16.Admin>( <- create Admin(), to:/storage/Tv16Admin)
    self.account.save<@Tv16.AdminPublic>(<- create AdminPublic(), to: /storage/Tv16AdminPublic)
    self.account.link<&Tv16.AdminPublic>(Tv16.AdminPublicPath, target:/storage/Tv16AdminPublic)
  }
}