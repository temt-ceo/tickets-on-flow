<template>
  <section>
    <div class="hero">
      <video class="hero--video" src="https://static.videezy.com/system/resources/previews/000/012/739/original/Particles_3_60s_2kres_1.mp4" muted></video>
      <div class="hero--overlay">
        <div class="hero--content">
          <section class="section">
            <div v-if="ticketName && ticketName.length > 0">
              <h1 class="page-title">
                {{ ticketName }}
              </h1>
              <hr class="separator">
              <div class="content">
                <p v-if="bloctoWalletUser.addr" class="description">
                  (Wallet Address: {{ bloctoWalletUser.addr }})
                </p>
                <h1 class="notice">
                  {{ noticeTitle }}
                  <div v-if="ticketWhen" class="next-date">{{ ticketWhen }}</div>
                </h1>
                <h1 v-if="code" class="code">
                  CODE: {{ code }}
                </h1>
                <p v-if="transactionScanUrl !== ''" class="check-transaction">
                  <a :href="transactionScanUrl" target="_blank">Confirm the transaction</a>
                </p>
                <b-button
                  v-if="ticketStatus === 4 && !code"
                  type="is-link"
                  @click="requestCode"
                >
                  {{ $t('ticket_text21') }}
                </b-button>
                <b-button
                  v-if="ticketStatus === 3"
                  @click="useTicket"
                >
                  {{ $t('ticket_text22') }}
                </b-button>
                <b-button
                  v-if="ticketStatus <= 1"
                  :disabled="!bloctoWalletUser.addr"
                  type="is-link is-light"
                  @click="requestTicket"
                >
                  {{ $t('ticket_text23') }}
                </b-button>
                <b-button
                  v-if="bloctoWalletUser.addr && ticketStatus === 2"
                  type="is-link is-light"
                  @click="getRequestStatus"
                >
                  {{ $t('ticket_text24') }}
                </b-button>
                <b-button
                  type="is-link is-light"
                  @click="showConfirmModal = true"
                >
                  {{ $t('ticket_text7') }}
                </b-button>

                <b-button
                  v-if="ticketName !== '' && !bloctoWalletUser.addr"
                  type="is-success is-light"
                  @click="walletLogin"
                >
                  Connect to a wallet
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
            <div v-if="!ticketName">
              <div class="content">
                <div>
                  {{ $t('ticket_text25') }}
                </div>
                <b-button
                  tag="nuxt-link"
                  to="/"
                  type="is-warning is-light"
                  class="to-top"
                >
                  {{ $t('ticket_text26') }}
                </b-button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    <b-modal v-model="showConfirmModal">
      <check-ticket-modal
        :ticket="ticketInfo"
        @closeModal="showConfirmModal=false"
      />
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'
import CheckTicketModal from '~/components/common/CheckTicketModal'

export default {
  name: 'TicketDispenser1',
  components: {
    CheckTicketModal
  },
  data () {
    return {
      bloctoWalletUser: {},
      dispenser: null,
      code: null,
      ticketInfo: null,
      ticketTokenId: null,
      ticketName: '',
      ticketWhen: '',
      price: null,
      ticketStatus: 0, // 0: init, 1: can request a ticket, 2: ticket requested, 3: can use a ticket, 4: can request a code
      latestRequest: null,
      transactionScanUrl: '',
      noticeTitle: '',
      showConfirmModal: false
    }
  },
  computed: {
    tickets: {
      get () {
        return this.$store.state.tickets
      }
    },
    ticketTime: {
      get () {
        return this.$store.state.ticketTime
      }
    }
  },
  async mounted () {
    this.getTicketInfo(location.pathname)
    await this.$fcl.currentUser.subscribe(this.setupUserInitialInfo)
    await this.checkCurrentStatus()
  },
  methods: {
    async getTicketInfo (pathname) {
      let ticketInfo = this.tickets.find(obj => obj.domain === pathname.replace(/\/ti\//, '').replace(/\//g, ''))
      if (!ticketInfo) {
        await this.getTickets()
        ticketInfo = this.tickets.find(obj => obj.domain === pathname.replace(/\/ti\//, '').replace(/\//g, ''))
      }
      this.ticketInfo = ticketInfo
      if (this.ticketInfo) {
        this.dispenser = ticketInfo.dispenser_id
        const ticketName = ticketInfo.name.split('||@')
        this.ticketName = ticketName[0]
        this.price = ticketInfo.price.replace(/\.?0+$/, '')
        const when = ticketInfo.when_to_use.split('||')
        if (when.length >= 2) {
          const unixTime = parseInt((new Date(when[1]).getTime() - new Date().getTime()) / 1000)
          const h = Math.floor(unixTime / 3600)
          const m = Math.floor(unixTime / 60 % 60)
          const day = new Date().getDay()
          const dayEvent = new Date(when[1])
          const dayEventDay = dayEvent.getDay()
          if (unixTime < 0) {
            // すでに過去のイベントの場合、6時間経過ずみで12時間後次のイベントの始まる曜日に変わるのであれば、
            const day2 = new Date(new Date().getTime() + 12 * 60 * 60 * 1000).getDay()
            if (h < -6 && (day !== dayEventDay || day !== day2)) {
              let nextDay = (day !== dayEventDay && h < -12) ? day : day2
              // Mondayを0にしたので合わせる
              nextDay = nextDay - 1 < 0 ? 6 : nextDay - 1
              const weekdays = when[0].split('').sort().join('')
              let match = false
              let nextDate = 0
              while (!match) {
                for (let i = 0; i < weekdays.length; i++) {
                  const registeredDay = parseInt(weekdays.substr(i, 1))
                  if (registeredDay === nextDay) {
                    match = true
                  }
                }
                nextDay = nextDay + 1 > 6 ? 0 : nextDay + 1
                if (nextDate > 6) {
                  match = true // 繰り返しなし
                }
                if (!match) {
                  nextDate++
                }
              }
              if (nextDate <= 6) {
                // console.log(nextDate)
                const nextEventDate = new Date(new Date().getTime() + nextDate * 24 * 60 * 60 * 1000)
                // ↓↓↓ nextEventが次のイベントの開始日
                const nextEvent = new Date(nextEventDate.getFullYear(), nextEventDate.getMonth(), nextEventDate.getDate(), dayEvent.getHours(), dayEvent.getMinutes(), dayEvent.getSeconds())
                const nextEventTime = parseInt(nextEvent.getTime() - new Date().getTime()) / 1000
                const hNext = Math.floor(nextEventTime / 3600)
                const mNext = Math.floor(nextEventTime / 60 % 60)
                // 保存データ
                let previousEventTime = null
                let hPrev = null
                let mPrev = null
                if (this.ticketTime[this.dispenser]) {
                  previousEventTime = parseInt(this.ticketTime[this.dispenser] - new Date().getTime()) / 1000
                  hPrev = Math.floor(previousEventTime / 3600)
                  mPrev = Math.floor(previousEventTime / 60 % 60)
                }
                if (hPrev && hPrev < -4) {
                  switch (hNext) {
                    case 0:
                      this.ticketWhen = `${this.$t('ticket_text12')} ${mNext} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
                      break
                    case 1:
                      this.ticketWhen = `${this.$t('ticket_text12')} ${hNext} ${this.$t('ticket_text8')} ${mNext} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
                      break
                    default:
                      this.ticketWhen = `${this.$t('ticket_text12')} ${hNext} ${this.$t('ticket_text9')} ${mNext} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
                      break
                  }
                  this.ticketTime[this.dispenser] = nextEvent.getTime()
                  this.$store.commit('updateTicketTime', this.ticketTime)
                } else {
                  // 過去として表示
                  switch (h) {
                    case 0:
                      this.ticketWhen = `${this.$t('ticket_text11_2')} ${Math.abs(mPrev)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
                      break
                    case 1:
                      this.ticketWhen = `${this.$t('ticket_text11_2')} ${Math.abs(hPrev)} ${this.$t('ticket_text8')} ${Math.abs(mPrev)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
                      break
                    default:
                      this.ticketWhen = `${this.$t('ticket_text11_2')} ${Math.abs(hPrev)} ${this.$t('ticket_text9')} ${Math.abs(mPrev)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
                      break
                  }
                }
              }
            } else {
              // 過去として表示
              switch (h) {
                case 0:
                  this.ticketWhen = `${this.$t('ticket_text11_2')} ${Math.abs(m)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
                  break
                case 1:
                  this.ticketWhen = `${this.$t('ticket_text11_2')} ${Math.abs(h)} ${this.$t('ticket_text8')} ${Math.abs(m)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
                  break
                default:
                  this.ticketWhen = `${this.$t('ticket_text11_2')} ${Math.abs(h)} ${this.$t('ticket_text9')} ${Math.abs(m)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
                  break
              }
            }
          } else {
            // もうすぐ始まる
            switch (h) {
              case 0:
                this.ticketWhen = `${this.$t('ticket_text12')} ${m} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
                break
              case 1:
                this.ticketWhen = `${this.$t('ticket_text12')} ${h} ${this.$t('ticket_text8')} ${m} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
                break
              default:
                this.ticketWhen = `${this.$t('ticket_text12')} ${h} ${this.$t('ticket_text9')} ${m} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
                break
            }
            this.ticketTime[this.dispenser] = new Date(when[1]).getTime()
            this.$store.commit('updateTicketTime', this.ticketTime)
          }
        }
      }
    },
    async walletLogin () {
      if (!this.bloctoWalletUser.addr) {
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
      }
    },
    callToast () {
      const toast = this.$buefy.toast.open({
        indefinite: true,
        message: this.noticeTitle
      })
      setTimeout(() => {
        toast.close()
      }, 10000)
    },
    async setupUserInitialInfo (user) {
      this.bloctoWalletUser = user
      await this.checkCurrentStatus()
    },
    async checkCurrentStatus () {
      if (this.bloctoWalletUser.addr) {
        const ret = await this.isTicketVaultReady()
        if (ret) {
          const data = await this.getRequestStatus(true)
          if (data) {
            // このdispenserから過去チケットをリクエストしたことがある
            if (!data.latest_token) {
              // まだチケットを配布されていない。
              this.ticketStatus = 2
            } else {
              // チケットを配布された過去がある
              const usedTime = await this.getTicketUsedTime()
              if (!usedTime) {
                // まだ未使用
                this.ticketStatus = 3
              } else {
                // チケット使用済み
                const lastUsedTime = parseInt(usedTime.replace(/.0+$/, '')) * 1000
                const pastTime = parseInt((new Date(lastUsedTime).getTime() - new Date().getTime()) / 1000)
                const h = Math.floor(pastTime / 3600)
                console.log(h, 'last used time hour', 999999)
                if (h <= -4) {
                  // 4時間以上経過
                  this.ticketStatus = 1 // 新しくリクエストできる
                } else {
                  this.ticketStatus = 4
                }
              }
            }
          } else {
            this.ticketStatus = 1
          }
        } else {
          this.ticketStatus = 1 // can request a ticket
        }
      } else {
        this.bloctoWalletUser = {}
        this.ticketStatus = 0
      }

      switch (this.ticketStatus) {
        case 0:
          this.noticeTitle = 'Please log in to your wallet' // 0: init
          break
        case 1:
          this.noticeTitle = this.$t('operation_text33') // 1: can request a ticket
          break
        case 2:
          this.noticeTitle = this.$t('operation_text34') // 2: ticket requested
          break
        case 3:
          this.noticeTitle = this.$t('operation_text35') // 3: can use a ticket
          break
        case 4:
          this.noticeTitle = 'Tap the Request a Code button. And save in texts.' // 4: can request a code
          break
      }
    },
    async isTicketVaultReady () {
      try {
        const ticketVault = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.hasTicketResource),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        if (ticketVault !== null) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    },
    async getRequestStatus (checkOnly) {
      try {
        this.noticeTitle = ''
        const result = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getTicketRequestStatus),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
            ])
          ]
        ).then(this.$fcl.decode)
        if (result) {
          if (checkOnly !== true) {
            const latestRequestTime = parseInt(result.time.replace(/.0+$/, '')) * 1000
            this.latestRequest = new Date(latestRequestTime)
            const mo = this.latestRequest.getMonth().toString()
            const d = this.latestRequest.getDate().toString()
            const requestDate = `${this.latestRequest.getFullYear()}/${mo.length > 1 ? mo : '0' + mo}/${d.length > 1 ? d : '0' + d}`
            const h = this.latestRequest.getHours().toString()
            const m = this.latestRequest.getMinutes().toString()
            const requestHour = `${h.length > 1 ? h : '0' + h}: ${m.length > 1 ? m : '0' + m}`
            const toast = this.$buefy.toast.open({
              indefinite: true,
              message: `Last Request Date: ${requestDate} ${requestHour}`
            })
            setTimeout(() => {
              toast.close()
            }, 5000)
          } else {
            return result
          }
        }
      } catch (e) {
      }
    },
    async requestTicket () {
      const ret = await this.isTicketVaultReady()
      let transactionCode = ''
      if (ret) {
        transactionCode = FlowTransactions.requestMoreTicket
      } else {
        transactionCode = FlowTransactions.requestTicket
      }
      this.$buefy.dialog.confirm({
        message: this.$t('ticket_text50'),
        onConfirm: async () => {
          try {
            // loading
            const loadingComponent = this.$buefy.loading.open({
              container: null
            })
            setTimeout(() => loadingComponent.close(), 3 * 1000)

            const transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(transactionCode),
                this.$fcl.args([
                  this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
            this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
            this.noticeTitle = this.$t('operation_text32')
            this.ticketStatus = 2
            this.callToast()
            return transactionId
          } catch (e) {
          }
        }
      })
    },
    useTicket () {
      try {
        this.$buefy.dialog.confirm({
          message: `This process requires ${this.price}$FLOW. <br>Tap "Approve" on the next wallet pop-up.`,
          confirmText: 'Agree',
          onConfirm: async () => {
            // loading
            const loadingComponent = this.$buefy.loading.open({
              container: null
            })
            setTimeout(() => loadingComponent.close(), 3 * 1000)

            const transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(FlowTransactions.useTicket),
                this.$fcl.args([
                  this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
                  this.$fcl.arg(this.ticketTokenId, this.$fclArgType.UInt64),
                  this.$fcl.arg(parseFloat(this.price).toFixed(2), this.$fclArgType.UFix64)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
            this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
            this.noticeTitle = `You used ${this.ticketName} ticket. <br>Request a code after 10 seconds since the transaction takes 10 seconds to complete.`
            this.ticketStatus = 4
            this.callToast()
            return transactionId
          }
        })
      } catch (e) {
      }
    },
    async requestCode (checkOnly) {
      const result = await this.$fcl.send(
        [
          this.$fcl.script(FlowScripts.getTicketCode),
          this.$fcl.args([
            this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
            this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
          ])
        ]
      ).then(this.$fcl.decode)
      if (result && Object.keys(result).length > 0) {
        this.ticketTokenId = parseInt(Object.keys(result)[0])
        if (result[this.ticketTokenId] !== '') {
          this.code = result[this.ticketTokenId].replace(/^elffab/, '').replace(/@tickets-on-flow.web.app$/, '').split('').reverse().join('')
        }
      }
    },
    async getTicketUsedTime () {
      const result = await this.$fcl.send(
        [
          this.$fcl.script(FlowScripts.getTicketUsedTime),
          this.$fcl.args([
            this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
            this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
          ])
        ]
      ).then(this.$fcl.decode)
      return result
    },
    async flowWalletLogout () {
      await this.$fcl.unauthenticate()
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
        console.log(e)
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
  }

  hr.separator {
    height: 0;
  }

  .content {
    margin: 10px auto 20px;
    padding: 16px;
    text-align: center;
    max-width: 800px;

    h1 {
      margin: 20px 0 16px;
      .next-date {
        color: #f14668;
        margin-top: 4px;
      }
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

    .code {
      font-size: 18px;
      color: #fff;
    }

    .request-btn {
      font-weight: bold;
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
