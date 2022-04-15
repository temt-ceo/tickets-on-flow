pub contract Tv10 {
  // Events
  pub event DispenserRequested(dispenser_id: UInt32, address: Address)
  pub event TicketRequested(dispenser_id: UInt32, nft_id: UInt32, address: Address)
  pub event TicketUsed(dispenser_id: UInt32, nft_id: UInt32, token_id: UInt32, quantity: UInt8, address: Address)

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
  priv let ticketRequesters: {UInt32: {UInt32: [TokenIdAndAddress]}}
  priv let ticketInfo: {UInt32: TicketStruct}

  /*
  // [Struct] TokenIdAndAddress (tokenIdとaddressを保持する)
  */
  pub struct TokenIdAndAddress {
    access(contract) let tokenId: UInt32
    priv let address: Address

    init(token_id: UInt32, address: Address) {
      self.tokenId = token_id
      self.address = address
    }
  }

  /*
  // [Struct]DispenserStruct
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
  // [Struct]　TicketStruct
  */
  pub struct TicketStruct {
    priv let dispenser_id: UInt32
    priv let type: UInt8
    priv let name: String
    priv let where_to_use: String
    priv let when_to_use: String
    priv let quantity: UInt8

    init(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8) {
      self.dispenser_id = dispenser_id
      self.type = type
      self.name = name
      self.where_to_use = where_to_use
      self.when_to_use = when_to_use
      self.quantity = quantity
    }
  } 

  /*
  ** [Resource] Admin
  */
  pub resource Admin {
    pub fun mintDispenser(addr: Address): @Dispenser {
      pre {
        Tv10.dispenserOwners[addr] != nil : "Requested address is not in previously requested list."
        Tv10.dispenserReceivers.contains(addr) == false : "Requested address is already minted."
      }
      Tv10.dispenserReceivers.append(addr)
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
      for addr in Tv10.dispenserOwners.keys {
        // if Dispenser resource is not Dispensed then it will be returned
        if (Tv10.dispenserReceivers.contains(addr) == false) {
          if let data = Tv10.dispenserOwners[addr] {
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
  // [リソース] Dispenser (チケットをMintするリソース)
  */
  pub resource Dispenser {
    // state
    access(contract) let ticketReceivers: {UInt32: [Address]}

    pub fun mintNFT(ticketName: String, quantity: UInt8): @Ticket {
      return <- create Ticket(ticketName: ticketName, quantity: quantity)
    }

    pub fun addTicketInfos(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8) {
      let ticket = TicketStruct(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, quantity: quantity)
      Tv10.ticketInfo[dispenser_id] = ticket
    }

    pub fun getTicketRequesters(dispenser_id: UInt32): {UInt32: [TokenIdAndAddress]}? {
      return Tv10.ticketRequesters[dispenser_id]
    }

    pub fun addTicketReceiver(right_nft_id: UInt32, addr: Address) {
      if(self.ticketReceivers.containsKey(right_nft_id)) {
        self.ticketReceivers[right_nft_id]!.append(addr)
      } else {
        self.ticketReceivers[right_nft_id] = [addr]
      }
    }

    pub fun getTicketReceivers(right_nft_id: UInt32): [Address]? {
      return self.ticketReceivers[right_nft_id]
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
    pub fun addTicketInfos(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8)
    pub fun addTicketReceiver(right_nft_id: UInt32, addr: Address)
  }

  /*
  ** [Interface] IDispenserPublic
  */
  pub resource interface IDispenserPublic {
    pub fun deposit(minter: @Dispenser)
    pub fun hasDispenser(): Bool
    pub fun getId(): UInt32
    pub fun getTicketRequesters(dispenser_id: UInt32): {UInt32: [TokenIdAndAddress]}??
    pub fun getTicketReceivers(right_nft_id: UInt32): [Address]??
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
        self.ownedDispenser <-! minter // <-!は、もしリソースがすでにあればエラーになります。その為、== nilの時のみの条件を一つ上でしています。
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
    pub fun getTicketRequesters(dispenser_id: UInt32): {UInt32: [TokenIdAndAddress]}?? {
      return self.ownedDispenser?.getTicketRequesters(dispenser_id: dispenser_id)
    }

    // [public access]
    pub fun getTicketReceivers(right_nft_id: UInt32): [Address]?? {
      return self.ownedDispenser?.getTicketReceivers(right_nft_id: right_nft_id)
    }

    // [private access]
    pub fun addTicketInfos(dispenser_id: UInt32, type: UInt8, name: String, where_to_use: String, when_to_use: String, quantity: UInt8) {
      self.ownedDispenser?.addTicketInfos(dispenser_id: dispenser_id, type: type, name: name, where_to_use: where_to_use, when_to_use: when_to_use, quantity: quantity)
    }

    // [private access]
    pub fun addTicketReceiver(right_nft_id: UInt32, addr: Address) {
      self.ownedDispenser?.addTicketReceiver(right_nft_id: right_nft_id, addr: addr)
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
      self.dispenser_id = Tv10.totalDispenserVaultSupply + 1
      Tv10.totalDispenserVaultSupply = Tv10.totalDispenserVaultSupply + 1

      // Event, Data
      emit DispenserRequested(dispenser_id: self.dispenser_id, address: addr)
      self.ownedDispenser <- nil
      Tv10.dispenserOwners[addr] = DispenserStruct(dispenser_id: self.dispenser_id, domain: domain, email: email, paid: paid)
    }
  }

  /*
  ** [create vault] createDispenserVault
  */
  pub fun createDispenserVault(addr: Address, domain: String, email: String, paid: UFix64): @DispenserVault {
    return <- create DispenserVault(addr, domain, email, paid)
  }

  /*
  // [Resource] Ticket
  */
  pub resource Ticket {
    priv var token_id: UInt64
    priv var ticketName: String
    priv var quantity: UInt8

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
      self.token_id = Tv10.totalTicketSupply + 1
      Tv10.totalTicketSupply = Tv10.totalTicketSupply + 1

      // Event, Data
      self.ticketName = ticketName // チケット名称
      self.quantity = quantity // チケット枚数
    }
  }

  /*
  // [インターフェース] ITicketPrivate (Dispencerリソースのインターフェース)
  */
  pub resource interface ITicketPrivate {
    access(contract) var ownedTicket: @{UInt32: Ticket}
    pub fun useTicket(dispenser_id: UInt32, right_nft_id: UInt32, token_id: UInt32, address: Address)
  }

  /*
  // [インターフェース] ITicketPublic (Dispencerリソースのインターフェース)
  */
  pub resource interface ITicketPublic {
    pub fun deposit(right_nft_id: UInt32, token: @Ticket)
    pub fun hasTicket(right_nft_id: UInt32): Bool
    pub fun getTicketQuantity(right_nft_id: UInt32): UInt8?
  }

  /*
  // [リソース] TicketVault (チケット入れのリソース)
  */
  pub resource TicketVault: ITicketPrivate, ITicketPublic {

    priv var user_id: UInt32
    access(contract) var ownedTicket: @{UInt32: Ticket}

    // [public access]
    pub fun deposit(right_nft_id: UInt32, token: @Ticket) {
      if (self.ownedTicket[right_nft_id] == nil) {
        self.ownedTicket[right_nft_id] <-! token
      } else {
        destroy token
      }
    }

    // [public access]
    pub fun hasTicket(right_nft_id: UInt32): Bool {
      if (self.ownedTicket[right_nft_id] != nil) {
        return true
      } else {
        return false
      }
    }

    // [public access]
    pub fun getTicketQuantity(right_nft_id: UInt32): UInt8? {
      return self.ownedTicket[right_nft_id]?.getQuantity()
    }

    // [private access]
    pub fun addTicketRequester(dispenser_id: UInt32, right_nft_id: UInt32, token_id: UInt32, addr: Address) {
      let taStruct = TokenIdAndAddress(token_id: token_id, address: addr)

      if(Tv10.ticketRequesters.containsKey(dispenser_id)) {
        if(Tv10.ticketRequesters[dispenser_id]!.containsKey(right_nft_id)) {
          Tv10.ticketRequesters[dispenser_id]![right_nft_id]!.append(taStruct)
        } else {
          var dict: {UInt32: [TokenIdAndAddress]} = Tv10.ticketRequesters[dispenser_id]!
          dict[right_nft_id] = [taStruct]
          Tv10.ticketRequesters[dispenser_id] = dict
        }
      } else {
        Tv10.ticketRequesters[dispenser_id] = {right_nft_id: [taStruct]}
      }
    }

    // [private access]
    pub fun useTicket(dispenser_id: UInt32, right_nft_id: UInt32, token_id: UInt32, address: Address) {
      if (self.ownedTicket[right_nft_id] != nil) {
        self.ownedTicket[right_nft_id]?.useTicket()
        let quantity = self.ownedTicket[right_nft_id]?.getQuantity()!
        emit TicketUsed(dispenser_id: dispenser_id, nft_id: right_nft_id, token_id: token_id, quantity: quantity, address: address)
      } else {
        panic("You need to get tickets.")
      }
    }

    destroy() {
      destroy self.ownedTicket
    }

    init(_ dispenser_id: UInt32, _ right_nft_id: UInt32, _ token_id: UInt32, _ addr: Address) {
      // TotalSupply
      self.user_id = Tv10.totalTicketVaultSupply + 1
      Tv10.totalTicketVaultSupply = Tv10.totalTicketVaultSupply + 1

      // Event, Data
      emit TicketRequested(dispenser_id: dispenser_id, nft_id: right_nft_id, address: addr)
      self.ownedTicket <- {}
      self.addTicketRequester(dispenser_id: dispenser_id, right_nft_id: right_nft_id, token_id: token_id, addr: addr)
    }
  }

  /*
  // [create vault] createTicketVault
  */
  pub fun createTicketVault(dispenser_id: UInt32, right_nft_id: UInt32, token_id: UInt32, addr: Address): @TicketVault {
    return <- create TicketVault(dispenser_id, right_nft_id, token_id, addr)
  }

  /*
  ** getDispenserIdWithDomain
  */
  pub fun getDispenserIdWithDomain(domain: String): UInt32? {
    for addr in Tv10.dispenserOwners.keys {
      if let data = Tv10.dispenserOwners[addr] {
        if (data.domain == domain) {
          return data.dispenser_id
        }
      }
    }
    return nil
  }

  /*
  ** getTicketInfos
  */
  pub fun getTicketInfos(dispenser_id: UInt32): TicketStruct? {
    return Tv10.ticketInfo[dispenser_id]
  }

  // [public access]
  pub fun alreadyRequested(dispenser_id: UInt32, right_nft_id: UInt32, token_id: UInt32): Bool {
    if (Tv10.ticketRequesters[dispenser_id] != nil) {
      if (Tv10.ticketRequesters[dispenser_id]![right_nft_id] != nil) {
        let arr = Tv10.ticketRequesters[dispenser_id]![right_nft_id]!     
        for element in arr {
          if (element.tokenId == token_id) {
              return true
          }
        }
      }
    }
    return false
  }

  /*
  // init
  */
  init() {
    // 初期化
    self.AdminPublicPath = /public/Tv10AdminPublic
    self.DispenserVaultPublicPath = /public/Tv10DispenserVault
    self.TicketVaultPublicPath = /public/Tv10Vault
    self.DispenserVaultPrivatePath = /private/Tv10DispenserVault
    self.TicketVaultPrivatePath = /private/Tv10Vault
    self.totalDispenserVaultSupply = 0
    self.totalTicketSupply = 0
    self.totalTicketVaultSupply = 0
    self.dispenserOwners = {}
    self.dispenserReceivers = []
    self.ticketRequesters = {}
    self.ticketInfo = {}

    // コントラクトの持ち主のみが保持する権限を付与する
    self.account.save<@Tv10.Admin>( <- create Admin(), to:/storage/Tv10Admin)
    // ウォレットがAdminかどうかの判定に使う
    self.account.save<@Tv10.AdminPublic>(<- create AdminPublic(), to: /storage/Tv10AdminPublic)
    self.account.link<&Tv10.AdminPublic>(Tv10.AdminPublicPath, target:/storage/Tv10AdminPublic)
  }
}