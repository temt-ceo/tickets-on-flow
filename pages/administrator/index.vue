<template>
  <section class="section">
    <h1 class="page-title">
      Ticket Mint Function Management
    </h1>
    <hr class="separator">
    <div class="content">
      <p v-if="bloctoWalletUser.addr" class="description">
        (Wallet Address: {{ bloctoWalletUser.addr }})
      </p>
      <h1 class="notice">
        {{ noticeTitle}}
      </h1>
      <p v-if="transactionScanUrl !== ''" class="check-transaction">
        <a :href="transactionScanUrl" target="_blank">Confirm Transaction</a>
      </p>
      <b-button
        v-if="bloctoWalletUser.addr"
        @click="showConfirmModal = true"
        type="is-link is-light"
      >
        Check status of ticket function requests
      </b-button>
      <b-button
        :disabled="!isAdmin"
        @click="dispenseDispenser"
        type="is-link is-light"
      >
        チケットMint機能を付与
      </b-button>
      <b-button
        v-if="!bloctoWalletUser.addr"
        @click="flowWalletLogin"
      >
        Connect to a wallet you manage
      </b-button>
      <b-button
        v-if="bloctoWalletUser.addr"
        @click="flowWalletLogout"
        type="is-danger is-light"
      >
        Log out from Wallet
      </b-button>
    </div>
    <b-modal v-model="showConfirmModal">
      <dispenser-confirm-modal
        :requesters="dispenserRequesters"
        @closeModal="showConfirmModal=false"
      />
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'
import DispenserConfirmModal from '~/components/common/DispenserConfirmModal'

export default {
  name: 'AdministratorPage',
  components: {
    DispenserConfirmModal
  },
  data () {
    return {
      dispenserRequesters: [],
      addressList: [],
      showConfirmModal: false,
      bloctoWalletUser: {},
      isAdmin: false,
      noticeTitle: '',
      transactionScanUrl: ''
    }
  },
  async mounted () {
    await this.$fcl.currentUser.subscribe(this.setupWalletInfo)
  },
  methods: {
    async flowWalletLogin () {
      await this.$fcl.authenticate()
    },
    async flowWalletLogout () {
      await this.$fcl.unauthenticate()
    },
    async setupWalletInfo (user) {
      this.bloctoWalletUser = user

      if (this.bloctoWalletUser?.addr) {
        this.isAdmin = await this.isAdminWallet()
        if (this.isAdmin) {
          await this.getRequestedDispensers()
          this.noticeTitle = 'Please press the grant button.'
        } else {
          this.noticeTitle = 'Wrong address. Please log in with the contract administrator\'s wallet.'
        }
      } else {
        this.noticeTitle = 'Please log in with the contract administrator\'s wallet'
      }
    },
    async isAdminWallet () {
      try {
        const adminPublic = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.isAdmin),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        if (adminPublic !== null) {
          return true
        } else {
          return false
        }
      } catch (e) {
        console.log(e)
      }
    },
    dispenseDispenser () {
      this.$buefy.dialog.prompt({
        message: 'To grant the ticket granting function, enter the dispenser_id of the appropriate person in the text box below',
        inputAttrs: {
          type: 'text',
          placeholder: 'e.g. 100',
          maxlength: 10
        },
        trapFocus: true,
        onConfirm: (dispenserId) => {
          let addr = null
          this.addressList.forEach((obj) => {
            if (obj.dispenser_id === parseInt(dispenserId)) {
              addr = obj.address
            }
          })
          if (!addr) {
            this.noticeTitle = 'No information matching the input data was obtained.'
            this.$buefy.dialog.alert('No information matching the input data was obtained.')
            return
          }
          this.$buefy.dialog.confirm({
            message: `Grant ticket distribution functionality to #${dispenserId}.<br> If you like, please click OK.`,
            onConfirm: async () => {
              try {
                const transactionId = await this.$fcl.send(
                  [
                    this.$fcl.transaction(FlowTransactions.dispenseDispenser),
                    this.$fcl.args([
                      this.$fcl.arg(addr, this.$fclArgType.Address)
                    ]),
                    this.$fcl.payer(this.$fcl.authz),
                    this.$fcl.proposer(this.$fcl.authz),
                    this.$fcl.authorizations([this.$fcl.authz]),
                    this.$fcl.limit(9999)
                  ]
                ).then(this.$fcl.decode)
                this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
                this.$buefy.toast.open(`Ticket distribution functionality has been added to ${addr}.`)
                this.noticeTitle = `Ticket distribution functionality has been added to ${addr}.`
                return transactionId
              } catch (e) {
                this.noticeTitle = `Address: ${addr}, Error: ${e}`
              }
            }
          })
        }
      })
    },
    async getRequestedDispensers () {
      try {
        const dispenserRequesters = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getRequestedDispensers),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        this.dispenserRequesters = dispenserRequesters
        this.dispenserRequesters.forEach((obj) => {
          const addr = Object.keys(obj)[0]
          this.addressList.push({
            dispenser_id: obj[addr].dispenser_id,
            address: addr
          })
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.section {
  padding-bottom: 32px;

  .page-title {
    margin-top: 80px;
    font-size: 24px;
    text-align: center;
  }

  .content {
    margin: 10px 0 20px;
    padding: 16px;
    text-align: center;

    h1 {
      margin: 20px 0 16px;
    }

    .description {
      font-size: 14px;
    }

    .notice {
      font-size: 14px;
      color: rebeccapurple;
    }

    .check-transaction a {
      color: purple;
      font-size: 14px;
      text-decoration: underline;
    }

    .button {
      width: 90%;
      border-radius: 20px;
      margin: 18px 0;
      max-width: 400px;
    }
  }
}
</style>
