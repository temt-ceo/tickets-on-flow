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
            <hr style="background-color: inherit; margin: 1rem 0;">
            <div class="content">
              <div>
                <b-message v-if="noticeTitle" type="is-success" has-icon>
                  {{ noticeTitle }}
                </b-message>
                <b-skeleton size="is-large" :active="waitTransactionComplete" />
                <b-skeleton size="is-large" :active="waitTransactionComplete" />
                <b-skeleton size="is-large" width="60%" :active="waitTransactionComplete" />
              </div>
              <p v-if="webpagePath" class="check-webpage">
                <a :href="webpagePath">{{ webpagePath }}</a>
              </p>
              <p v-if="transactionScanUrl !== ''" class="check-transaction">
                <a :href="transactionScanUrl" target="_blank">{{ $t('operation_text56') }}</a>
              </p>
              <b-button
                v-if="bloctoWalletUser.addr"
                :disabled="!hasDispenserVault || !hasDispenser"
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
                {{ $t('ticket_text33') }} (Only $1)
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
                @click="nextEvent"
              >
                {{ $t('ticket_text32') }}
              </b-button>
              <p v-if="bloctoWalletUser.addr" class="description">
                (Wallet Address: {{ bloctoWalletUser.addr }})
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
    <b-modal v-model="showInputModal">
      <ticket-input-modal
        :address="address"
        :dispenser="dispenserId"
        :dispenser-page="dispenserPage"
        :demo="isDemo"
        @closeModal="closeInputModal"
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
      dispenserPage: '',
      webpagePath: null,
      hasDispenserVault: null,
      hasDispenser: null,
      noticeTitle: '',
      transactionScanUrl: '',
      ticketUsedNow: false,
      ticketUsedMessage: '',
      showInputModal: false,
      showConfirmPayModal: false,
      isApplied: false,
      waitTransactionComplete: false,
      balance: null,
      isDemo: false
    }
  },
  head () {
    return {
      title: 'Chain Work Tickets | Tickets Setup',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Chain Work, Tickets, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
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
            const ticketInfo = this.tickets.find(obj => parseInt(obj.dispenser_id) === this.dispenserId)
            if (ticketInfo && ticketInfo.name && ticketInfo.name.split('||@')[0]) {
              this.noticeTitle = this.$t('ticket_text57')
              this.webpagePath = this.dispenserPage
            }
          } else {
            this.noticeTitle = this.$t('ticket_text37')
          }
        } else {
          this.noticeTitle = this.$t('ticket_text38') + '\nOnce activated, you can create a dedicated URL tied to your wallet address. You can then sell tickets and crowdfund for free for the rest of your life!'
        }
      } else {
        this.noticeTitle = ''
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
          this.dispenserPage = 'https://chain-work.com/ti/' + dispenserInfo[this.dispenserId]
        } else {
          this.dispenserPage = ''
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
        const description = 'For Tickets'
        let domain = null
        this.$buefy.dialog.prompt({
          message: this.$t('ticket_text39'),
          type: 'is-info',
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
              message: `${this.$t('ticket_text43')} https://chain-work.com/ti/${domain}`
            })
            this.$buefy.dialog.confirm({
              message: this.$t('ticket_text46'),
              type: 'is-dark',
              confirmText: this.$t('ticket_text47'),
              onConfirm: async () => {
                toast1?.close()

                // loading
                const loadingComponent = this.$buefy.loading.open({
                  container: null
                })

                // 残高確認
                await this.getFlowBalance()
                if (!this.balance || this.balance < 0.3) {
                  loadingComponent.close()
                  this.noticeTitle = this.$t('operation_text137') + ' ( Balance: ' + this.balance + 'FLOW )'
                } else {
                  setTimeout(() => loadingComponent.close(), 1000)

                  this.$buefy.snackbar.open({
                    duration: 120000, // 2 minutes
                    message: this.$t('operation_text30') + ` <a href="https://flowscan.org/account/${this.bloctoWalletUser?.addr}" target="_blank">${this.$t('operation_text31')}</a>`,
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
                        this.$fcl.arg(0.3, this.$fclArgType.UFix64)
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
                  this.transactionScanUrl = `https://flowscan.org/transaction/${transactionId}`
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
    },
    nextEvent () {
      this.$buefy.dialog.confirm({
        message: this.$t('operation_text94'),
        type: 'is-dark',
        cancelText: 'No',
        confirmText: 'Yes',
        onConfirm: async () => {
          await this.flowWalletLogin()
          if (this.bloctoWalletUser?.addr) {
            setTimeout(() => {
              if (this.hasDispenserVault && this.hasDispenser) {
                this.showInputModal = true
              }
              if (!this.hasDispenserVault) {
                this.$buefy.toast.open({
                  message: this.$t('operation_text72'),
                  duration: 8000,
                  queue: false
                })
                this.requestDispenser()
              }
            }, 2000)
          }
        },
        onCancel: () => {
          this.isDemo = true
          this.address = ''
          this.dispenserId = 0
          this.showInputModal = true
        }
      })
    },
    async getFlowBalance () {
      try {
        const balance = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getBalance),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        if (balance !== null) {
          this.balance = parseFloat(balance)
        }
      } catch (e) {
      }
    },
    async closeInputModal () {
      this.showInputModal = false
      if (this.isDemo === true) {
        this.isDemo = false
        await this.flowWalletLogin()
        if (this.bloctoWalletUser?.addr) {
          setTimeout(() => {
            if (this.hasDispenserVault && this.hasDispenser) {
              this.showInputModal = true
            }
            if (!this.hasDispenserVault) {
              this.$buefy.toast.open({
                message: this.$t('operation_text72'),
                duration: 8000,
                queue: false
              })
              this.requestDispenser()
            }
          }, 2000)
        }
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
      display: none;
      font-size: 14px;
    }

    .notice {
      font-size: 18px;
      color: white;
    }

    .check-transaction {
      margin: 1em 0 0;

      a {
        font-size: 16px;
        text-decoration: underline;
      }
    }

    .check-webpage {
      margin: 1em 0 0;

      a {
        font-size: 16px;
        color: #ffe08a;
        text-decoration: none;
      }
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
  background-image: radial-gradient(rgb(65,105,225), #1b1c50);
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
  background-image: radial-gradient(rgb(65,105,225), #1b1c50);
}
</style>
