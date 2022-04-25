<template>
  <section class="section">
    <div class="hero">
      <div class="hero--overlay">
        <div class="hero--content">
          <b-notification
            v-model="ticketUsedNow"
            type="is-success is-light"
            aria-close-label="Close notification"
            @click="showConfirmPayModal = true"
          >
            {{ ticketUsedMessage }}
          </b-notification>
          <h1 class="page-title">
            Ticket Distribution
          </h1>
          <div class="content">
            <p v-if="bloctoWalletUser.addr" class="description">
              (Wallet Address: {{ bloctoWalletUser.addr }})
            </p>
            <h1 class="notice">
              {{ noticeTitle }}
            </h1>
            <p v-if="transactionScanUrl !== ''" class="check-transaction">
              <a :href="transactionScanUrl" target="_blank">Confirm the transaction</a>
            </p>
            <b-button
              :disabled="!bloctoWalletUser.addr || !hasDispenserVault || !hasDispenser"
              type="is-link is-light"
              @click="showInputModal = true"
            >
              Distribute your original tickets
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && (!hasDispenserVault || !hasDispenser)"
              :disabled="hasDispenserVault || isApplied"
              type="is-link is-light"
              class="request-btn"
              @click="requestDispenser"
            >
              Apply for ticket distribution function
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && hasDispenserVault && hasDispenser"
              type="is-link is-light"
              @click="showConfirmModal = true"
            >
              Check Ticket Request Status
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && hasDispenserVault && hasDispenser"
              type="is-link is-light"
              @click="showConfirmPayModal = true"
            >
              Check Ticket Usage Status
            </b-button>
            <b-button
              v-if="!bloctoWalletUser.addr"
              type="is-success is-light"
              @click="flowWalletLogin"
            >
              Connect to a wallet you manage
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr"
              type="is-danger is-light"
              @click="flowWalletLogout"
            >
              Log out from Wallet
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="showInputModal">
      <ticket-input-modal
        :address="address"
        :dispenser="dispenserId"
        :ticket-page="dispenserTicketPage"
        @closeModal="showInputModal=false"
      />
    </b-modal>
    <b-modal v-model="showConfirmModal">
      <ticket-confirm-modal
        :address="address"
        :dispenser="dispenserId"
        @closeModal="showConfirmModal=false"
      />
    </b-modal>
    <b-modal v-model="showConfirmPayModal">
      <ticket-confirm-pay-modal
        :address="address"
        :dispenser="dispenserId"
        @closeModal="showConfirmPayModal=false"
      />
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'
import TicketInputModal from '~/components/common/TicketInputModal'
import TicketConfirmModal from '~/components/common/TicketConfirmModal'
import TicketConfirmPayModal from '~/components/common/TicketConfirmPayModal'

export default {
  name: 'DispenserMaintenancePage',
  components: {
    TicketInputModal,
    TicketConfirmModal,
    TicketConfirmPayModal
  },
  data () {
    return {
      bloctoWalletUser: {},
      address: null,
      dispenserId: null,
      dispenserTicketPage: '',
      hasDispenserVault: false,
      hasDispenser: false,
      noticeTitle: '',
      transactionScanUrl: '',
      ticketUsedNow: false,
      ticketUsedMessage: '',
      showInputModal: false,
      showConfirmModal: false,
      showConfirmPayModal: false,
      isApplied: false
    }
  },
  computed: {
    ticketUsedTokenList () {
      return this.$store.state.ticketUsedTokenList
    }
  },
  async mounted () {
    await this.$fcl.currentUser.subscribe(this.setupWalletInfo)
    setInterval(() => {
      this.callReiterateEvents()
    }, 4000)
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
        this.address = this.bloctoWalletUser?.addr
        this.hasDispenserVault = await this.hasTicketDispenserVault()

        if (this.hasDispenserVault) {
          await this.getDispenserInfo()
          this.hasDispenser = await this.hasTicketDispenser()

          if (this.hasDispenser) {
            this.noticeTitle = 'Now you can distribute your original tickets!'
          } else {
            this.noticeTitle = 'Currently applying for ticket distribution functionality.'
          }
        } else {
          this.noticeTitle = 'You need to apply for the ticket distribution function. Please press Apply for distribution function.'
        }
      } else {
        this.noticeTitle = 'Please log in to the wallet of the person who will distribute the tickets.'
      }
    },
    async hasTicketDispenserVault () {
      try {
        const dispenserVault = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.hasDispenserVault),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        if (dispenserVault !== null) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    },
    async getDispenserInfo () {
      try {
        const dispenserInfo = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getDispenserInfo),
            this.$fcl.args([
              this.$fcl.arg(this.address, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        if (dispenserInfo) {
          this.dispenserId = parseInt(Object.keys(dispenserInfo)[0])
          this.dispenserTicketPage = 'https://tickets-on-flow.web.app/ti/' + dispenserInfo[this.dispenserId]
        } else {
          this.dispenserTicketPage = ''
        }
      } catch (e) {
        console.log(e)
      }
    },
    async hasTicketDispenser () {
      try {
        const hasDispenser = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.hasDispenser),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        return hasDispenser
      } catch (e) {
        return false
      }
    },
    requestDispenser () {
      let toast1 = null
      let toast2 = null
      try {
        let domain = null
        this.$buefy.dialog.prompt({
          message: 'What name would you like for your page? (https://tickets-on-flow.web.app/ti/XXXXX) (max:30 length)',
          inputAttrs: {
            type: 'text',
            placeholder: 'e.g. hello-ticket',
            maxlength: 30
          },
          confirmText: 'Next',
          trapFocus: true,
          onConfirm: (value) => {
            const re = /^[a-zA-Z0-9-_]*$/
            if (value.replace(re, '') !== '') {
              this.$buefy.dialog.alert('Contains unavailable characters.')
              return
            }

            domain = value
            toast1 = this.$buefy.toast.open({
              indefinite: true,
              message: `Your web site name will look like this: https://tickets-on-flow.web.app/ti/${domain}`
            })
            this.$buefy.dialog.prompt({
              message: 'Enter your email address. (please enter a sub email as it will be stored in the blockchain) This is used to notify you when a page is created.',
              inputAttrs: {
                type: 'text',
                placeholder: 'e.g. yourname@example.com',
                value: '',
                maxlength: 40
              },
              confirmText: 'Next',
              trapFocus: true,
              closeOnConfirm: false,
              onConfirm: (email, { close }) => {
                const bmail = 'elffab' + email.toString().split('').reverse().join('') + '@tickets-on-flow.web.app'
                toast1?.close()
                this.$buefy.dialog.confirm({
                  message: 'This process requires 0.5$FLOW. <br>Please press "Approve" on the pop-up that will appear after this.',
                  confirmText: 'Agree',
                  onConfirm: async () => {
                    close()
                    // loading
                    const loadingComponent = this.$buefy.loading.open({
                      container: null
                    })
                    setTimeout(() => loadingComponent.close(), 3 * 1000)

                    const transactionId = await this.$fcl.send(
                      [
                        this.$fcl.transaction(FlowTransactions.requestDispenser),
                        this.$fcl.args([
                          this.$fcl.arg(domain, this.$fclArgType.String),
                          this.$fcl.arg(bmail, this.$fclArgType.String),
                          this.$fcl.arg(0.5, this.$fclArgType.UFix64)
                        ]),
                        this.$fcl.payer(this.$fcl.authz),
                        this.$fcl.proposer(this.$fcl.authz),
                        this.$fcl.authorizations([this.$fcl.authz]),
                        this.$fcl.limit(9999)
                      ]
                    ).then(this.$fcl.decode)
                    toast2 = this.$buefy.toast.open({
                      indefinite: true,
                      message: 'Success. Your request has been sent and you will receive an email within 24 hours that your request has been processed.'
                    })
                    this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
                    this.noticeTitle = 'Your application for the ticket distribution function has been completed. Please wait until you receive an email that tells the feature has been distributed.'
                    this.isApplied = true
                    close()
                    setTimeout(() => {
                      toast2.close()
                    }, 10000)
                  }
                })
              },
              onCancel: () => {
                toast1?.close()
              }
            })
          }
        })
      } catch (e) {
        this.noticeTitle = `Address: ${this.bloctoWalletUser?.addr}, Error: ${e}`
      }
    },
    async callReiterateEvents () {
      const range = 200
      const contractAddress = '0x43.....'.replace('0x', '')
      const contractName = 'T'
      const eventName = 'TicketUsed'
      const identifier = `A.${contractAddress}.${contractName}.${eventName}`
      const latestBlock = await this.$fcl.send(
        [
          this.$fcl.getBlock(true)
        ]
      ).then(this.$fcl.decode)
      const height = latestBlock.height
      const response = await this.$fcl.send(
        [
          this.$fcl.getEventsAtBlockHeightRange(identifier, height - range, height)
        ]
      ).then(this.$fcl.decode)
      const { events } = response
      if (events && events.length > 0) {
        const data = {}
        const newEvents = []
        let newPayers = ''
        let lastBlockId = 0

        if (this.ticketUsedTokenList.length > 0) {
          lastBlockId = this.ticketUsedTokenList[this.ticketUsedTokenList.length - 1].block_id
        }
        events.forEach((flowEvent) => {
          const blockHeight = parseInt(flowEvent.blockHeight)
          const payload = flowEvent.payload.value.fields
          payload.forEach((obj) => {
            if (obj.value.type === 'Address') {
              data[obj.name] = obj.value.value
            } else {
              data[obj.name] = parseInt(obj.value.value)
            }
          })
          if (parseInt(data.dispenser_id) === this.dispenserId && blockHeight > lastBlockId) {
            newEvents.push({
              dispenser_id: data.dispenser_id,
              token_id: data.token_id,
              address: data.address,
              block_id: blockHeight
            })
            newPayers = newPayers + `#${data.token_id}さん, `
          }
        })
        if (newPayers !== '') {
          this.ticketUsedMessage = `トークン${newPayers}がチケットを使いました。`
          this.ticketUsedNow = true
        }
        const newTicketUsedTokenList = this.ticketUsedTokenList.concat(newEvents)
        this.$store.dispatch('ticketUsedTokenList', newTicketUsedTokenList)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.section {
  padding-bottom: 32px;

  .page-title {
    margin-top: 70px;
    font-size: 24px;
    color: mediumspringgreen;
    text-align: center;
  }

  .content {
    margin-bottom: 25px;
    padding: 16px;
    text-align: center;
    max-width: 800px;

    h1 {
      margin: 20px 0 16px;
    }

    .description {
      font-size: 16px;
    }

    .notice {
      font-size: 16px;
      color: rebeccapurple;
    }

    .check-transaction a {
      color: purple;
      font-size: 16px;
      text-decoration: underline;
    }

    .request-btn {
      font-weight: bold;
    }

    .button {
      width: 90%;
      border-radius: 20px;
      margin: 18px 0;
      max-width: 400px;

      &.to-top {
        margin-top: 34px;
      }
    }
  }

  .hero--overlay {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(180deg, rgba(0,0,0,1), #1b1c50);
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
    background-image: linear-gradient(0deg, rgba(0,0,0,.3), #1b1c50);
  }
}
</style>
