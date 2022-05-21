<template>
  <section>
    <div class="hero">
      <video class="hero--video" src="https://static.videezy.com/system/resources/previews/000/012/739/original/Particles_3_60s_2kres_1.mp4" muted autoplay playsinline />
      <div class="hero--overlay">
        <div class="hero--content">

          <section class="section">
            <b-notification
              v-model="ticketUsedNow"
              type="is-success is-light"
              aria-close-label="Close notification"
              @click="showConfirmPayModal = true"
            >
              {{ ticketUsedMessage }}
            </b-notification>
            <h1 class="page-title">
              {{ $t('ticket_text31') }}
            </h1>
            <div class="content">
              <h1 class="notice">
                {{ noticeTitle }}<br>
                <b-skeleton size="is-large" height="70px" :active="waitTransactionComplete"></b-skeleton>
                <b-skeleton size="is-large" width="60%" :active="waitTransactionComplete"></b-skeleton>
              </h1>
              <p v-if="bloctoWalletUser.addr" class="description">
                (Wallet Address: {{ bloctoWalletUser.addr }})
              </p>
              <p v-if="transactionScanUrl !== ''" class="check-transaction">
                <a :href="transactionScanUrl" target="_blank">Confirm the transaction</a>
              </p>
              <b-button
                :disabled="!bloctoWalletUser.addr || !hasDispenserVault || !hasDispenser"
                type="is-link is-light"
                @click="showInputModal = true"
              >
                {{ $t('ticket_text32') }}
              </b-button>
              <b-button
                v-if="bloctoWalletUser.addr && (hasDispenserVault === false || hasDispenser === false)"
                :disabled="hasDispenserVault || isApplied"
                type="is-link is-light"
                @click="requestDispenser"
              >
                {{ $t('ticket_text33') }}
              </b-button>
              <!-- <b-button
                v-if="bloctoWalletUser.addr && hasDispenserVault && hasDispenser"
                type="is-link is-light"
                @click="showConfirmPayModal = true"
              >
                {{ $t('ticket_text35') }}
              </b-button> -->
              <b-button
                v-if="!bloctoWalletUser.addr"
                type="is-success is-light"
                @click="flowWalletLogin"
              >
                Connect Wallet
              </b-button>
            </div>
          </section>
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
import TicketConfirmPayModal from '~/components/common/TicketConfirmPayModal'

export default {
  name: 'DispenserMaintenancePage',
  components: {
    TicketInputModal,
    TicketConfirmPayModal
  },
  data () {
    return {
      bloctoWalletUser: {},
      address: null,
      dispenserId: null,
      dispenserDomains: [],
      dispenserTicketPage: '',
      hasDispenserVault: null,
      hasDispenser: null,
      noticeTitle: '',
      transactionScanUrl: '',
      ticketUsedNow: false,
      ticketUsedMessage: '',
      showInputModal: false,
      showConfirmPayModal: false,
      isApplied: false,
      waitTransactionComplete: false
    }
  },
  computed: {
    ticketUsedTokenList () {
      return this.$store.state.ticketUsedTokenList
    }
  },
  async mounted () {
    await this.$fcl.currentUser.subscribe(this.setupWalletInfo)
    this.getDispenserDomains()
    setInterval(() => {
      this.getDispenserDomains()
      // this.callReiterateEvents()
    }, 4000)
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
        this.address = this.bloctoWalletUser?.addr
        this.hasDispenserVault = await this.hasTicketDispenserVault()

        if (this.hasDispenserVault) {
          await this.getDispenserInfo()
          this.hasDispenser = await this.hasTicketDispenser()

          if (this.hasDispenser) {
            this.noticeTitle = this.$t('ticket_text36')
            await this.getTickets()
            const ticketInfo = this.tickets.find(obj => obj.dispenser_id === this.dispenserId)
            if (ticketInfo && ticketInfo.name && ticketInfo.name.split('||@')[0]) {
              this.noticeTitle = this.$t('ticket_text57')
            }
          } else {
            this.noticeTitle = this.$t('ticket_text37')
          }
        } else {
          this.noticeTitle = this.$t('ticket_text38')
        }
      } else {
        this.noticeTitle = 'Please log in to your wallet.'
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
        let description = null
        let domain = null
        this.$buefy.dialog.prompt({
          message: this.$t('ticket_text44'),
          type: 'is-success',
          inputAttrs: {
            type: 'text',
            placeholder: `${this.$t('ticket_text40')} Online cooking school`,
            value: '',
            maxlength: 40
          },
          confirmText: this.$t('ticket_text45'),
          trapFocus: true,
          onConfirm: (val) => {
            description = val
            this.$buefy.dialog.prompt({
              message: this.$t('ticket_text39'),
              type: 'is-success',
              inputAttrs: {
                type: 'text',
                placeholder: `${this.$t('ticket_text40')} hello-ticket`,
                maxlength: 30
              },
              confirmText: 'Next',
              trapFocus: true,
              onConfirm: (value) => {
                domain = value.trim()
                const re = /^[a-zA-Z0-9-_]*$/
                if (domain.replace(re, '') !== '') {
                  this.$buefy.dialog.alert(this.$t('ticket_text41'))
                  return
                }

                if (this.dispenserDomains.includes(domain)) {
                  this.$buefy.dialog.alert(this.$t('ticket_text42'))
                  return
                }
                toast1 = this.$buefy.toast.open({
                  indefinite: true,
                  message: `${this.$t('ticket_text43')} https://tickets-on-flow.web.app/ti/${domain}`
                })
                this.$buefy.dialog.confirm({
                  message: this.$t('ticket_text46'),
                  type: 'is-success',
                  confirmText: this.$t('ticket_text47'),
                  onConfirm: async () => {
                    toast1?.close()

                    // loading
                    const loadingComponent = this.$buefy.loading.open({
                      container: null
                    })
                    setTimeout(() => loadingComponent.close(), 1000)

                    this.$buefy.snackbar.open({
                      duration: 120000, // 2 minutes
                      message: this.$t('operation_text30') + ` <a href="https://testnet.flowscan.org/account/${this.bloctoWalletUser?.addr}" target="_blank">${this.$t('operation_text31')}</a>`,
                      type: 'is-danger',
                      position: 'is-bottom-left',
                      actionText: null,
                      queue: false,
                      onAction: () => {
                      }
                    })

                    const transactionId = await this.$fcl.send(
                      [
                        this.$fcl.transaction(FlowTransactions.requestDispenser),
                        this.$fcl.args([
                          this.$fcl.arg(domain, this.$fclArgType.String),
                          this.$fcl.arg(description, this.$fclArgType.String),
                          this.$fcl.arg(0.1, this.$fclArgType.UFix64)
                        ]),
                        this.$fcl.payer(this.$fcl.authz),
                        this.$fcl.proposer(this.$fcl.authz),
                        this.$fcl.authorizations([this.$fcl.authz]),
                        this.$fcl.limit(9999)
                      ]
                    ).then(this.$fcl.decode)
                    toast2 = this.$buefy.toast.open({
                      indefinite: true,
                      message: this.$t('operation_text34')
                    })
                    this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
                    this.noticeTitle = this.$t('ticket_text48')
                    this.waitTransactionComplete = true
                    this.isApplied = true

                    const timerID = setInterval(async () => {
                      const done = await this.hasTicketDispenserVault()
                      if (done) {
                        this.noticeTitle = this.$t('ticket_text49')
                        this.waitTransactionComplete = false
                        toast2.close()
                        clearInterval(timerID)
                      }
                    }, 4000)
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
    async getDispenserDomains () {
      try {
        const dispenserDomains = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getDispenserDomains),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        this.dispenserDomains = dispenserDomains
      } catch (e) {
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
    },
    async getTickets () {
      try {
        const tickets = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getTickets),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        this.$store.commit('updateTickets', tickets) // save tickets
        this.tickets = tickets
      } catch (e) {
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.section {
  padding-bottom: 100px;
  padding: 0 1.5rem;

  .page-title {
    font-size: 24px;
    text-align: center;
    padding: 0 5px;
  }

  .content {
    margin-bottom: 80px;
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
      font-size: 16px;
      text-decoration: underline;
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
}

.hero {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 92vh;
}

.hero--video {
  min-width: 1980px;
  z-index: 1;
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
  opacity: 0.87;
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
</style>
