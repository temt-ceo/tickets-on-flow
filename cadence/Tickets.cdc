pub contract Tv14 {
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
        Tv14.dispenserOwners[dispenser_id] != nil : "Requested address is not in previously requested list."
        Tv14.dispenserOwners[dispenser_id]!.grant == false : "Requested address is already minted."
      }
      if let data = Tv14.dispenserOwners[dispenser_id] {
        data.grant = true
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
      for data in Tv14.dispenserOwners.values {
        if (data.grant == false) {
          dispenserArr.append(data)
        }
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

    pub fun mintNFT(secret_code: String, dispenser_id: UInt32, user_id: UInt32): @Ticket {
      let token <- create Ticket(secret_code: secret_code, dispenser_id: dispenser_id)
      if(Tv14.ticketRequesters.containsKey(dispenser_id)) {
        if let data = Tv14.ticketRequesters[dispenser_id]![user_id] {
          data.latest_token = token.getId()
        }
      }
      return <- token
    }

    pub fun addTicketInfo(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
      let domain = Tv14.dispenserOwners[dispenser_id]!.domain
      let ticket = TicketStruct(dispenser_id: dispenser_id, domain: domain, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
      Tv14.ticketInfo.append(ticket)
    }

    pub fun updateTicketInfo(index: UInt32, dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
      let domain = Tv14.dispenserOwners[dispenser_id]!.domain
      let ticket = TicketStruct(dispenser_id: dispenser_id, domain: domain, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
      let existTicket = Tv14.ticketInfo.remove(at: index)
      if (existTicket.dispenser_id == dispenser_id) {
        Tv14.ticketInfo.insert(at: index, ticket)
      } else {
        panic("Something went wrong.")
      }
    }

    pub fun getTicketRequesters(dispenser_id: UInt32): {UInt32: RequestStruct}? {
      return Tv14.ticketRequesters[dispenser_id]
    }

    init() {
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

    // [private access]
    pub fun addTicketInfo(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
      self.ownedDispenser?.addTicketInfo(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    // [private access]
    pub fun updateTicketInfo(index: UInt32, dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, price: UFix64) {
      self.ownedDispenser?.updateTicketInfo(index: index, dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, price: price)
    }

    // [private access]
    pub fun mintNFT(secret_code: String, dispenser_id: UInt32, user_id: UInt32): @Ticket? {
      return <- self.ownedDispenser?.mintNFT(secret_code: secret_code, dispenser_id: dispenser_id, user_id: user_id)
    }

    destroy() {
      destroy self.ownedDispenser
    }

    init(_ address: Address, _ domain: String, _ email: String, _ paid: UFix64) {
      // TotalSupply
      self.dispenser_id = Tv14.totalDispenserVaultSupply + 1
      Tv14.totalDispenserVaultSupply = Tv14.totalDispenserVaultSupply + 1

      // Event, Data
      emit DispenserRequested(dispenser_id: self.dispenser_id, address: address)
      self.ownedDispenser <- nil
      Tv14.dispenserOwners[self.dispenser_id] = DispenserStruct(dispenser_id: self.dispenser_id, address: address, domain: domain, email: email, paid: paid, grant: false)
    }
  }

  /*
  ** [create vault] createDispenserVault
  */
  pub fun createDispenserVault(address: Address, domain: String, email: String, paid: UFix64): @DispenserVault {
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
      self.token_id = Tv14.totalTicketSupply + 1
      Tv14.totalTicketSupply = Tv14.totalTicketSupply + 1

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
    pub fun hasTicket(token_id: UInt64): Bool
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
    pub fun hasTicket(token_id: UInt64): Bool {
      return self.ownedTicket[token_id] != nil
    }

    // [public access]
    pub fun getId(): UInt32 {
        return self.user_id
    }

    // [private access]
    pub fun requestTicket(dispenser_id: UInt32, user_id: UInt32, address: Address) {
      if(Tv14.ticketRequesters.containsKey(dispenser_id)) {
        if let data = Tv14.ticketRequesters[dispenser_id]![user_id] {
          data.count = data.count + 1
          data.time = getCurrentBlock().timestamp
          emit TicketRequested(dispenser_id: dispenser_id, user_id: self.user_id, address: address)
        }
      }
    }

    // [private access]
    pub fun useTicket(dispenser_id: UInt32, user_id: UInt32, token_id: UInt64, address: Address, price: UFix64) {
      if (self.ownedTicket[token_id] != nil) {
        self.ownedTicket[token_id]?.useTicket()

        if(Tv14.ticketRequesters.containsKey(dispenser_id)) {
          if let data = Tv14.ticketRequesters[dispenser_id]![user_id] {
            data.paid = data.paid + price
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
      self.user_id = Tv14.totalTicketVaultSupply + 1
      Tv14.totalTicketVaultSupply = Tv14.totalTicketVaultSupply + 1

      // Event, Data
      emit TicketRequested(dispenser_id: dispenser_id, user_id: self.user_id, address: address)
      self.ownedTicket <- {}
      let time = getCurrentBlock().timestamp
      let requestStruct = RequestStruct(time: time, user_id: self.user_id, address: address)

      if(Tv14.ticketRequesters.containsKey(dispenser_id)) {
        Tv14.ticketRequesters[dispenser_id] = {self.user_id: requestStruct}
      }
    }
  }

  /*
  // [create vault] createTicketVault
  */
  pub fun createTicketVault(dispenser_id: UInt32, address: Address): @TicketVault {
    return <- create TicketVault(dispenser_id, address)
  }

  /*
  ** [Public Function] getDispenserId
  */
  pub fun getDispenserId(address: Address): UInt32? {
    var dispenserArr: [DispenserStruct] = []
    for data in Tv14.dispenserOwners.values {
      if (data.address == address) {
        return data.dispenser_id
      }
    }
    return nil
  }

  /*
  ** [Public Function] getTickets
  */
  pub fun getTickets(): [TicketStruct] {
    return Tv14.ticketInfo
  }

  /*
  ** init
  */
  init() {
    self.AdminPublicPath = /public/Tv14AdminPublic
    self.DispenserVaultPublicPath = /public/Tv14DispenserVault
    self.TicketVaultPublicPath = /public/Tv14Vault
    self.DispenserVaultPrivatePath = /private/Tv14DispenserVault
    self.TicketVaultPrivatePath = /private/Tv14Vault
    self.totalDispenserVaultSupply = 0
    self.totalTicketSupply = 0
    self.totalTicketVaultSupply = 0
    self.dispenserOwners = {}
    self.ticketRequesters = {}
    self.ticketInfo = []

    // grant admin rights
    self.account.save<@Tv14.Admin>( <- create Admin(), to:/storage/Tv14Admin)
    self.account.save<@Tv14.AdminPublic>(<- create AdminPublic(), to: /storage/Tv14AdminPublic)
    self.account.link<&Tv14.AdminPublic>(Tv14.AdminPublicPath, target:/storage/Tv14AdminPublic)
  }
}