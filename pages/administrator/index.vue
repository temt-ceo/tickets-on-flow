<template>
  <section class="section">
    <div class="hero">
      <div class="hero--overlay">
        <div class="hero--content">
          <h1 class="page-title">
            Ticket Mint Functionality Management
          </h1>
          <hr class="separator">
          <div class="content">
            <p v-if="bloctoWalletUser.addr" class="description">
              (Wallet Address: {{ bloctoWalletUser.addr }})
            </p>
            <h1 class="notice">
              {{ noticeTitle }}
            </h1>
            <p v-if="transactionScanUrl !== ''" class="check-transaction">
              <a :href="transactionScanUrl" target="_blank">{{ $t('operation_text56') }}</a>
            </p>
            <b-button
              v-if="bloctoWalletUser.addr"
              :disabled="!isAdmin"
              type="is-link is-light"
              @click="showConfirmModal = true"
            >
              Check status of requests
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr"
              :disabled="!isAdmin"
              type="is-link is-light"
              @click="showAllDispensersModal = true"
            >
              Confirm all dispensers
            </b-button>
            <b-button
              :disabled="!isAdmin"
              type="is-link is-light"
              @click="dispenseDispenser"
            >
              Grant Ticket Mint functionality
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && isAdmin"
              type="is-link is-light"
              @click="showTestModal1 = true"
            >
              Check Ticket Requesters
            </b-button>
            <b-button
              v-if="!bloctoWalletUser.addr"
              @click="flowWalletLogin"
            >
              Connect Wallet
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr"
              type="is-danger is-light"
              @click="flowWalletLogout"
            >
              Log out from Wallet
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr"
              :disabled="isAdmin"
              @click="getCapabilityReceiverVault"
            >
              Create CapabilityVault
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="showConfirmModal">
      <dispenser-confirm-modal
        :requesters="dispenserRequesters"
        @closeModal="showConfirmModal=false"
      />
    </b-modal>
    <b-modal v-model="showAllDispensersModal">
      <dispenser-confirm-modal
        :requesters="allDispensers"
        @closeModal="showConfirmModal=false"
      />
    </b-modal>
    <b-modal v-model="showTestModal1">
      <test-ticket-requesters-modal
        :address="address"
        @closeModal="showTestModal1=false"
      />
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'
import DispenserConfirmModal from '~/components/common/DispenserConfirmModal'
import TestTicketRequestersModal from '~/components/test/TestTicketRequestersModal'

export default {
  name: 'AdministratorPage',
  components: {
    DispenserConfirmModal,
    TestTicketRequestersModal
  },
  data () {
    return {
      dispenserRequesters: [],
      allDispensers: [],
      address: null,
      showConfirmModal: false,
      showAllDispensersModal: false,
      showTestModal1: false,
      bloctoWalletUser: {},
      isAdmin: false,
      noticeTitle: '',
      transactionScanUrl: '',
      capabilityReceiver: null
    }
  },
  head () {
    return {
      title: 'Chain Work Tickets | 管理者',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Chain Work, Tickets, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
    }
  },
  async mounted () {
    await this.$fcl.currentUser.subscribe(this.setupWalletInfo)
  },
  methods: {
    async flowWalletLogin () {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: this.$t('help_text18'),
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: null,
        queue: false,
        onAction: () => {
        }
      })
      await this.$fcl.authenticate()
    },
    async flowWalletLogout () {
      await this.$fcl.unauthenticate()
    },
    async setupWalletInfo (user) {
      this.bloctoWalletUser = user

      if (this.bloctoWalletUser?.addr) {
        this.isAdmin = await this.isAdminWallet()
        if (!this.isAdmin) {
          this.capabilityReceiver = await this.isAdminProxyWallet()
          if (this.capabilityReceiver && this.capabilityReceiver.address) {
            this.isAdmin = true
          }
        }
        if (this.isAdmin) {
          this.address = this.capabilityReceiver && this.capabilityReceiver.address ? this.capabilityReceiver.address : this.bloctoWalletUser?.addr
          await this.getRequestedDispensers()
          await this.getAllDispensers()
          this.noticeTitle = 'Tap the grant button.'
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
      }
    },
    async isAdminProxyWallet () {
      try {
        const adminProxyVault = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.isAdminProxy),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        if (adminProxyVault && adminProxyVault.proxyCapabilityReceiver) {
          return adminProxyVault.proxyCapabilityReceiver
        } else {
          return null
        }
      } catch (e) {
      }
    },
    dispenseDispenser () {
      this.$buefy.dialog.prompt({
        message: 'Enter the dispenser_id in the text box below',
        inputAttrs: {
          type: 'text',
          placeholder: 'e.g. 100',
          maxlength: 10
        },
        trapFocus: true,
        onConfirm: (dispenserId) => {
          let addr = null
          this.dispenserRequesters.forEach((obj) => {
            if (parseInt(obj.dispenser_id) === parseInt(dispenserId)) {
              addr = obj.address
            }
          })
          if (!addr) {
            this.noticeTitle = 'No information matching the input data was obtained.'
            this.$buefy.dialog.alert('No information matching the input data was obtained.')
            return
          }
          this.$buefy.dialog.confirm({
            message: `Grant ticket mint functionality to #${dispenserId}. Tap Grant button.`,
            confirmText: 'Grant',
            onConfirm: async () => {
              try {
                // loading
                const loadingComponent = this.$buefy.loading.open({
                  container: null
                })
                setTimeout(() => loadingComponent.close(), 3 * 1000)
                let transactionId = null
                if (this.capabilityReceiver) {
                  transactionId = await this.$fcl.send(
                    [
                      this.$fcl.transaction(FlowTransactions.dispenseDispenserOverProxy),
                      this.$fcl.args([
                        this.$fcl.arg(addr, this.$fclArgType.Address)
                      ]),
                      this.$fcl.payer(this.$fcl.authz),
                      this.$fcl.proposer(this.$fcl.authz),
                      this.$fcl.authorizations([this.$fcl.authz]),
                      this.$fcl.limit(9999)
                    ]
                  ).then(this.$fcl.decode)
                } else {
                  transactionId = await this.$fcl.send(
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
                }
                this.transactionScanUrl = `https://flowscan.org/transaction/${transactionId}`
                const toast = this.$buefy.toast.open({
                  indefinite: true,
                  message: `Ticket distribution functionality has been added to ${addr}.`
                })
                setTimeout(() => {
                  toast.close()
                }, 10000)
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
        if (this.capabilityReceiver) {
          const dispenserRequesters = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getRequestedDispensers),
              this.$fcl.args([
                this.$fcl.arg(this.capabilityReceiver.address, this.$fclArgType.Address)
              ])
            ]
          ).then(this.$fcl.decode)
          this.dispenserRequesters = dispenserRequesters
        } else {
          const dispenserRequesters = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getRequestedDispensers),
              this.$fcl.args([
                this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
              ])
            ]
          ).then(this.$fcl.decode)
          this.dispenserRequesters = dispenserRequesters
        }
      } catch (e) {
      }
    },
    async getAllDispensers () {
      try {
        if (this.capabilityReceiver) {
          const dispenserRequesters = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getAllDispensers),
              this.$fcl.args([
                this.$fcl.arg(this.capabilityReceiver.address, this.$fclArgType.Address)
              ])
            ]
          ).then(this.$fcl.decode)
          dispenserRequesters.sort((a, b) => parseInt(b.dispenser_id) - parseInt(a.dispenser_id))
          this.allDispensers = dispenserRequesters
        } else {
          const dispenserRequesters = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getAllDispensers),
              this.$fcl.args([
                this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
              ])
            ]
          ).then(this.$fcl.decode)
          dispenserRequesters.sort((a, b) => parseInt(b.dispenser_id) - parseInt(a.dispenser_id))
          this.allDispensers = dispenserRequesters
        }
      } catch (e) {
      }
    },
    async getCapabilityReceiverVault () {
      try {
        // loading
        const loadingComponent = this.$buefy.loading.open({
          container: null
        })
        setTimeout(() => loadingComponent.close(), 3 * 1000)
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.createCapabilityReceiver),
            this.$fcl.args([
            ]),
            this.$fcl.payer(this.$fcl.authz),
            this.$fcl.proposer(this.$fcl.authz),
            this.$fcl.authorizations([this.$fcl.authz]),
            this.$fcl.limit(9999)
          ]
        ).then(this.$fcl.decode)
        this.transactionScanUrl = `https://flowscan.org/transaction/${transactionId}`
        const toast = this.$buefy.toast.open({
          indefinite: true,
          message: 'Capability Vault has been added to the wallet.'
        })
        setTimeout(() => {
          toast.close()
        }, 10000)
        this.noticeTitle = 'Capability Vault has been added to the wallet.'
        return transactionId
      } catch (e) {
        this.noticeTitle = `Error: ${e}`
      }
    }
    // async addCapabilityReceiverDebug () {
    //   try {
    //     // loading
    //     const loadingComponent = this.$buefy.loading.open({
    //       container: null
    //     })
    //     setTimeout(() => loadingComponent.close(), 3 * 1000)

    //     const addr = '0x02a0b991d9254827'
    //     const transactionId = await this.$fcl.send(
    //       [
    //         this.$fcl.transaction(FlowTransactions.addCapabilityReceiverDebug),
    //         this.$fcl.args([
    //           this.$fcl.arg(addr, this.$fclArgType.Address)
    //         ]),
    //         this.$fcl.payer(this.$fcl.authz),
    //         this.$fcl.proposer(this.$fcl.authz),
    //         this.$fcl.authorizations([this.$fcl.authz]),
    //         this.$fcl.limit(9999)
    //       ]
    //     ).then(this.$fcl.decode)
    //     this.transactionScanUrl = `https://flowscan.org/transaction/${transactionId}`
    //     const toast = this.$buefy.toast.open({
    //       indefinite: true,
    //       message: 'Capability Vault has been added to the wallet.'
    //     })
    //     setTimeout(() => {
    //       toast.close()
    //     }, 10000)
    //     this.noticeTitle = 'Capability Vault has been added to the wallet.'
    //     return transactionId
    //   } catch (e) {
    //     this.noticeTitle = `Error: ${e}`
    //   }
    // }
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
    margin: 10px auto 20px;
    padding: 16px;
    text-align: center;
    max-width: 800px;

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
      font-size: 16px;
      text-decoration: underline;
    }

    .button {
      width: 90%;
      border-radius: 20px;
      margin: 18px 0;
      max-width: 400px;
    }
  }

  .hero--overlay {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-image: radial-gradient(rgb(65,105,225), #1b1c50);
    background-size: cover;
    z-index: 2;
  }

  .hero--content {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    color: #dadff4;
  }

  .hero--bottom {
    width: 100%;
    height: 50vh;
    background-color: #1c1c1c;
    background-image: radial-gradient(rgb(65,105,225), #1b1c50);
  }
}
</style>
