import * as fcl from '@onflow/fcl'
import * as types from '@onflow/types'

fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org', // Mainnet: "https://rest.onflow.org"
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn', // Mainnet: "https://fcl-discovery.onflow.org/authn"
  'app.detail.title': 'Chain Work', // Shows user what dapp is trying to connect
  'app.detail.icon': 'https://chain-work.com/chainwork-top.png', // shows image to the user to display your dapp brand
  '0xT': '0x39899237382f2a8a' // The account address where the smart contract lives
})

export default ({ app }, inject) => {
  inject('fcl', fcl)
  inject('fclArgType', types)
}
