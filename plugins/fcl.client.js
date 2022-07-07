import * as fcl from '@onflow/fcl'
import * as types from '@onflow/types'

fcl.config({
  'accessNode.api': 'https://rest-mainnet.onflow.org', // Mainnet: "https://rest.onflow.org"
  'discovery.wallet': 'https://fcl-discovery.onflow.org/authn', // Mainnet: "https://fcl-discovery.onflow.org/authn"
  'app.detail.title': 'Chain Work', // Shows user what dapp is trying to connect
  'app.detail.icon': 'https://chain-work.com/chainwork-top.png', // shows image to the user to display your dapp brand
  '0xT': '0x24466f7fc36e3388' // The account address where the smart contract lives
})

export default ({ app }, inject) => {
  inject('fcl', fcl)
  inject('fclArgType', types)
}
