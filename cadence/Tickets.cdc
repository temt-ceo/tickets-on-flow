pub contract Tv12 {
  // Events
  pub event DispenserRequested(dispenser_id: UInt32, address: Address)
  pub event TicketRequested(dispenser_id: UInt32, user_id: UInt32, address: Address)
  pub event TicketUsed(dispenser_id: UInt32, user_id: UInt32, token_id: UInt64, quantity: UInt8, address: Address)

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
  priv let dispenserOwners: {Address: DispenserStruct}
  priv let dispenserReceivers: [Address]
  priv let ticketRequesters: {UInt32: [RequestStruct]}
  priv let ticketInfo: {UInt32: TicketStruct}

  /*
  ** [Struct]DispenserStruct
  */
  pub struct DispenserStruct {
    access(contract) let dispenser_id: UInt32
    access(contract) let domain: String
    priv let email: String
    priv let paid: UFix64

    init(dispenser_id: UInt32, domain: String, email: String, paid: UFix64) {
      self.dispenser_id = dispenser_id
      self.domain = domain
      self.email = email
      self.paid = paid
    }
  }

  /*
  ** [Struct]　TicketStruct
  */
  pub struct TicketStruct {
    priv let dispenser_id: UInt32
    priv let type: UInt8
    priv let name: String
    priv let where_to_use: String
    priv let when_to_use: String
    priv let quantity: UInt8
    priv let price: UFix64

    init(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8, price: UFix64) {
      self.dispenser_id = dispenser_id
      self.type = type
      self.name = name
      self.where_to_use = where_to_use
      self.when_to_use = when_to_use
      self.quantity = quantity
      self.price = price
    }
  } 

  /*
  ** [Struct] RequestStruct
  */
  pub struct RequestStruct {
    access(contract) let time: UFix64 // Time
    access(contract) let user_id: UInt32
    access(contract) let address: Address

    init(time: UFix64, user_id: UInt32, address: Address) {
      self.time = time
      self.user_id = user_id
      self.address = address
    }
  }

  /*
  ** [Struct] ReceiverStruct
  */
  pub struct ReceiverStruct {
    access(contract) let token_id: UInt64
    access(contract) let user_id: UInt32
    access(contract) let address: Address

    init(token_id: UInt64, user_id: UInt32, address: Address) {
      self.token_id = token_id
      self.user_id = user_id
      self.address = address
    }
  }

  /*
  ** [Resource] Admin
  */
  pub resource Admin {
    pub fun mintDispenser(addr: Address): @Dispenser {
      pre {
        Tv12.dispenserOwners[addr] != nil : "Requested address is not in previously requested list."
        Tv12.dispenserReceivers.contains(addr) == false : "Requested address is already minted."
      }
      Tv12.dispenserReceivers.append(addr)
      return <- create Dispenser()
    }

    init() {
    }
  }

  /*
  ** [Resource] AdminPublic
  */
  pub resource AdminPublic {
    pub fun getDispenserRequesters(): [{Address: DispenserStruct}] {
      var dispenserArr: [{Address: DispenserStruct}] = []
      for addr in Tv12.dispenserOwners.keys {
        // if Dispenser resource is not Dispensed then it will be returned
        if (Tv12.dispenserReceivers.contains(addr) == false) {
          if let data = Tv12.dispenserOwners[addr] {
            dispenserArr.append({addr: data})
          }
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
    // state
    access(contract) let ticketReceivers: {UInt32: [ReceiverStruct]}

    pub fun mintNFT(ticketName: String, quantity: UInt8): @Ticket {
      return <- create Ticket(ticketName: ticketName, quantity: quantity)
    }

    pub fun addTicketInfos(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8, price: UFix64) {
      let ticket = TicketStruct(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, quantity: quantity, price: price)
      Tv12.ticketInfo[dispenser_id] = ticket
    }

    pub fun getTicketRequesters(dispenser_id: UInt32): [RequestStruct]? {
      return Tv12.ticketRequesters[dispenser_id]
    }

    pub fun getTicketReceivers(dispenser_id: UInt32): [ReceiverStruct]? {
      return self.ticketReceivers[dispenser_id]
    }

    pub fun addTicketReceiver(dispenser_id: UInt32, user_id: UInt32, address: Address, token_id: UInt64) {
      let requestStruct = ReceiverStruct(token_id: token_id, user_id: user_id, address: address)
      if(self.ticketReceivers.containsKey(dispenser_id)) {
        self.ticketReceivers[dispenser_id]!.append(requestStruct)

      } else {
        self.ticketReceivers[dispenser_id] = [requestStruct]
      }
    }

    init() {
      self.ticketReceivers = {}
    }
  }

  /*
  ** [Interface] IDispenserPrivate
  */
  pub resource interface IDispenserPrivate {
    pub var ownedDispenser: @Dispenser?
    pub var dispenser_id: UInt32
    pub fun addTicketInfos(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8, price: UFix64)
    pub fun addTicketReceiver(dispenser_id: UInt32, user_id: UInt32, address: Address, token_id: UInt64)
  }

  /*
  ** [Interface] IDispenserPublic
  */
  pub resource interface IDispenserPublic {
    pub fun deposit(minter: @Dispenser)
    pub fun hasDispenser(): Bool
    pub fun getId(): UInt32
    pub fun getTicketRequesters(dispenser_id: UInt32): [RequestStruct]??
    pub fun getTicketReceivers(dispenser_id: UInt32): [ReceiverStruct]??
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
    pub fun getTicketRequesters(dispenser_id: UInt32): [RequestStruct]?? {
      return self.ownedDispenser?.getTicketRequesters(dispenser_id: dispenser_id)
    }

    // [public access]
    pub fun getTicketReceivers(dispenser_id: UInt32): [ReceiverStruct]?? {
      return self.ownedDispenser?.getTicketReceivers(dispenser_id: dispenser_id)
    }

    // [private access]
    pub fun addTicketInfos(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8, price: UFix64) {
      self.ownedDispenser?.addTicketInfos(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, quantity: quantity, price: price)
    }

    // [private access]
    pub fun addTicketReceiver(dispenser_id: UInt32, user_id: UInt32, address: Address, token_id: UInt64) {
      self.ownedDispenser?.addTicketReceiver(dispenser_id: dispenser_id, user_id: user_id, address: address, token_id: token_id)
    }

    // [private access]
    pub fun mintNFT(ticketName: String, quantity: UInt8): @Ticket? {
      return <- self.ownedDispenser?.mintNFT(ticketName: ticketName, quantity: quantity)
    }

    destroy() {
      destroy self.ownedDispenser
    }

    init(_ addr: Address, _ domain: String, _ email: String, _ paid: UFix64) {
      // TotalSupply
      self.dispenser_id = Tv12.totalDispenserVaultSupply + 1
      Tv12.totalDispenserVaultSupply = Tv12.totalDispenserVaultSupply + 1

      // Event, Data
      emit DispenserRequested(dispenser_id: self.dispenser_id, address: addr)
      self.ownedDispenser <- nil
      Tv12.dispenserOwners[addr] = DispenserStruct(dispenser_id: self.dispenser_id, domain: domain, email: email, paid: paid)
    }
  }

  /*
  ** [create vault] createDispenserVault
  */
  pub fun createDispenserVault(addr: Address, domain: String, email: String, paid: UFix64): @DispenserVault {
    return <- create DispenserVault(addr, domain, email, paid)
  }

  /*
  ** [Resource] Ticket
  */
  pub resource Ticket {
    priv var token_id: UInt64
    priv var ticketName: String
    priv var quantity: UInt8

    pub fun getId(): UInt64 {
      return self.token_id
    }

    pub fun getQuantity(): UInt8 {
      return self.quantity
    }

    pub fun useTicket() {
      pre {
        self.quantity > 0: "You don't have tickets."
      }
      self.quantity = self.quantity - 1
    }

    init(ticketName: String, quantity: UInt8) {
      // TotalSupply
      self.token_id = Tv12.totalTicketSupply + 1
      Tv12.totalTicketSupply = Tv12.totalTicketSupply + 1

      // Event, Data
      self.ticketName = ticketName // チケット名称
      self.quantity = quantity // チケット枚数
    }
  }

  /*
  ** [Interface] ITicketPrivate
  */
  pub resource interface ITicketPrivate {
    access(contract) var ownedTicket: @{UInt64: Ticket}
    pub fun useTicket(dispenser_id: UInt32, user_id: UInt32, token_id: UInt64, address: Address)
    pub fun addTicketRequester(dispenser_id: UInt32, user_id: UInt32, address: Address)
  }

  /*
  ** [Interface] ITicketPublic
  */
  pub resource interface ITicketPublic {
    pub fun deposit(token: @Ticket)
    pub fun hasTicket(token_id: UInt64): Bool
    pub fun getId(): UInt32
    pub fun getTicketQuantity(token_id: UInt64): UInt8?
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

    // [public access]
    pub fun getTicketQuantity(token_id: UInt64): UInt8? {
      return self.ownedTicket[token_id]?.getQuantity()
    }

    // [private access]
    pub fun addTicketRequester(dispenser_id: UInt32, user_id: UInt32, address: Address) {
      let time = 99999999.99999//getCurrentBlock().timestamp
      let requestStruct = RequestStruct(time: time, user_id: user_id, address: address)

      if(Tv12.ticketRequesters.containsKey(dispenser_id)) {
        Tv12.ticketRequesters[dispenser_id]!.append(requestStruct)
      } else {
        Tv12.ticketRequesters[dispenser_id] = [requestStruct]
      }
    }

    // [private access]
    pub fun useTicket(dispenser_id: UInt32, user_id: UInt32, token_id: UInt64, address: Address) {
      if (self.ownedTicket[token_id] != nil) {
        self.ownedTicket[token_id]?.useTicket()
        let quantity = self.ownedTicket[token_id]?.getQuantity()!
        emit TicketUsed(dispenser_id: dispenser_id, user_id: user_id, token_id: token_id, quantity: quantity, address: address)
      } else {
        panic("You need to get tickets.")
      }
    }

    destroy() {
      destroy self.ownedTicket
    }

    init(_ dispenser_id: UInt32, _ address: Address) {
      // TotalSupply
      self.user_id = Tv12.totalTicketVaultSupply + 1
      Tv12.totalTicketVaultSupply = Tv12.totalTicketVaultSupply + 1

      // Event, Data
      emit TicketRequested(dispenser_id: dispenser_id, user_id: self.user_id, address: address)
      self.ownedTicket <- {}
      self.addTicketRequester(dispenser_id: dispenser_id, user_id: self.user_id, address: address)
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
  pub fun getDispenserId(addr: Address): UInt32? {
    if let data = Tv12.dispenserOwners[addr] {
      return data.dispenser_id
    }
    return nil
  }

  /*
  ** [Public Function] getDispenserIdWithDomain
  */
  pub fun getDispenserIdWithDomain(domain: String): UInt32? {
    for addr in Tv12.dispenserOwners.keys {
      if let data = Tv12.dispenserOwners[addr] {
        if (data.domain == domain) {
          return data.dispenser_id
        }
      }
    }
    return nil
  }

  /*
  ** [Public Function] getTicketInfos
  */
  pub fun getTicketInfos(dispenser_id: UInt32): TicketStruct? {
    return Tv12.ticketInfo[dispenser_id]
  }

  /*
  ** init
  */
  init() {
    self.AdminPublicPath = /public/Tv12AdminPublic
    self.DispenserVaultPublicPath = /public/Tv12DispenserVault
    self.TicketVaultPublicPath = /public/Tv12Vault
    self.DispenserVaultPrivatePath = /private/Tv12DispenserVault
    self.TicketVaultPrivatePath = /private/Tv12Vault
    self.totalDispenserVaultSupply = 0
    self.totalTicketSupply = 0
    self.totalTicketVaultSupply = 0
    self.dispenserOwners = {}
    self.dispenserReceivers = []
    self.ticketRequesters = {}
    self.ticketInfo = {}

    // grant admin rights
    self.account.save<@Tv12.Admin>( <- create Admin(), to:/storage/Tv12Admin)
    self.account.save<@Tv12.AdminPublic>(<- create AdminPublic(), to: /storage/Tv12AdminPublic)
    self.account.link<&Tv12.AdminPublic>(Tv12.AdminPublicPath, target:/storage/Tv12AdminPublic)
  }
}