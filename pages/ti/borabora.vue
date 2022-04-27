<template>
  <section class="section">
    <div class="hero">
      <div class="hero--overlay">
        <div class="hero--content content">
          <div v-if="ticketName && ticketName.length > 0" class="text-wrap">
            <h1
              :class="ticketName.length > 30 ? 'long' : ''"
              class="page-title"
            >
              {{ ticketName }}
            </h1>
            <hr>
            <h1 class="notice">
              Price: {{ price }} $FLOW
            </h1>
            <h1 class="notice">
              Detail: <a :href="twitter" target="_blank">please click here</a>
            </h1>
            <h1 class="notice">
              Usage: {{ ticketWhere }}
            </h1>
            <h1 class="notice">
              {{ ticketWhenDate }} {{ ticketWhenHour }} Start
            </h1>
            <p
              v-if="transactionScanUrl !== ''"
              class="check-transaction"
            >
              <a :href="transactionScanUrl" target="_blank">Confirm the transaction</a>
            </p>
            <hr>
            <b-button
              v-if="ticketName !== '' && !bloctoWalletUser.addr"
              type="is-link is-light"
              @click="walletLogin"
            >
              Sign up / Log in
            </b-button>
            <b-button
              :disabled="status !== 3"
              @click="useTicket"
            >
              Use a Ticket
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && status === 1"
              type="is-link is-light"
              @click="requestTicket"
            >
              Request a Ticket
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && status === 2"
              type="is-link is-light"
              @click="getRequestStatus"
            >
              Check Request Status
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr"
              type="is-danger is-light"
              @click="flowWalletLogout"
            >
              Log out from Wallet
            </b-button>
            <b-button
              tag="nuxt-link"
              to="/"
              type="is-warning is-light"
              class="to-top"
            >
              Return to TOP
            </b-button>
          </div>
          <div v-if="!ticketName">
            <b-button
              tag="nuxt-link"
              to="/"
              type="is-warning is-light"
              class="to-top"
            >
              Return to TOP
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'

export default {
  name: 'TicketDispenser1',
  data () {
    return {
      bloctoWalletUser: {},
      dispenser: null,
      userId: null,
      ticketName: '',
      ticketWhere: '',
      ticketWhenDate: '',
      ticketWhenHour: '',
      ticketWhenTZ: 0,
      twitter: '',
      price: null,
      status: 0,
      latestRequest: null,
      transactionScanUrl: '',
      noticeTitle: ''
    }
  },
  computed: {
    tickets: {
      get () {
        return this.$store.state.tickets
      }
    }
  },
  async mounted () {
    this.getTicketInfo(location.pathname)
    await this.$fcl.currentUser.subscribe(this.setupUserInitialInfo)
    if (this.bloctoWalletUser.addr) {
      await this.checkCurrentStatus()
    }
  },
  methods: {
    getTicketInfo (pathname) {
      const ticketInfo = this.tickets.find(obj => obj.domain === pathname.replace(/\/ti\//, '').replace(/\//g, ''))
      if (ticketInfo) {
        this.dispenser = ticketInfo.dispenser_id
        const ticketName = ticketInfo.name.split('||@')
        this.ticketName = ticketName[0]
        this.twitter = 'https://twitter.com/' + ticketName[1]
        this.price = ticketInfo.price.replace(/\.?0+$/, '')
        const when = ticketInfo.when_to_use.split('||')
        if (when.length === 2) {
          this.ticketWhenTZ = parseInt(when[0])
          const ticketWhen = new Date(when[1])
          const mo = ticketWhen.getMonth().toString()
          const d = ticketWhen.getDate().toString()
          this.ticketWhenDate = `${mo.length > 1 ? mo : '0' + mo}/${d.length > 1 ? d : '0' + d}/${ticketWhen.getYear()}`
          const h = ticketWhen.getHours().toString()
          const m = ticketWhen.getMinutes().toString()
          this.ticketWhenHour = `${h.length > 1 ? h : '0' + h}: ${m.length > 1 ? m : '0' + m}`
        }
        const where = ticketInfo.where_to_use.split('||')
        if (where.length === 2) {
          this.ticketWhere = where[1]
        } else if (where.length > 2) {
          this.ticketWhere = ''
          for (let i = 1; i < where.length; i++) {
            this.ticketWhere = this.ticketWhere + (i === 1 ? '' : '||') + where[i]
          }
        }
      }
    },
    walletLogin () {
      if (!this.bloctoWalletUser.addr) {
        this.$buefy.dialog.confirm({
          message: 'Connect to the wallet where you will manage your tickets. Please create a new one if you have not.',
          onConfirm: async () => {
            await this.$fcl.authenticate()
          }
        })
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

      if (this.bloctoWalletUser?.addr) {
        await this.checkCurrentStatus()
      } else {
        this.bloctoWalletUser = {}
      }
    },
    async checkCurrentStatus () {
      const ret = await this.isTicketVaultReady()
      // if (ret) {
      //   await this.getRequestStatus()
      // } else if (this.ticketName) {
      this.status = ret ? 2 : 1
      //   this.noticeTitle = `${this.ticketName}を申請可能です。以下から申請ボタンを押してください。`
      // } else {
      //   this.noticeTitle = 'Ticket has not been created yet.'
      //   this.callToast()
      // }
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
    async getRequestStatus () {
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
        }
      } catch (e) {
        console.log(e)
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
        message: 'Please press "Approve" on the next wallet pop-up. The ticket registrar will put the ticket in your wallet. <br>This is free of charge.',
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
            this.noticeTitle = `${this.ticketName}の申請を行いました。`
            this.status = 2
            return transactionId
          } catch (e) {
          }
        }
      })
    },
    async useTicket () {
      alert('チケットを申請される方は、次のウォレットのポップアップ画面で「承認」を押してください')
      try {
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
              this.$fcl.arg(this.user_id, this.$fclArgType.UInt32)
            ]),
            this.$fcl.payer(this.$fcl.authz),
            this.$fcl.proposer(this.$fcl.authz),
            this.$fcl.authorizations([this.$fcl.authz]),
            this.$fcl.limit(9999)
          ]
        ).then(this.$fcl.decode)
        this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
        this.noticeTitle = `${this.ticketName}を使用しました。チケット配布者にお知らせください。`
        this.status = 2
        return transactionId
      } catch (e) {
      }
    },
    async flowWalletLogout () {
      await this.$fcl.unauthenticate()
      if (this.ticketName !== '') {
        this.noticeTitle = `${this.ticketWhere}で使える${this.ticketName}が${this.dispenser}によって提供されています。`
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.section {
  padding-bottom: 32px;

  .content {
    margin: 10px 0 20px;
    padding: 16px;
    text-align: center;
    max-width: 800px;

    .text-wrap {
      margin: 0 20px;

      .page-title {
        margin: 80px auto 0;
        font-size: 18px;
        color: mediumspringgreen;
        text-align: center;
        --typing-steps: 14;
        overflow: hidden;
        white-space: nowrap;
        letter-spacing: 3px;
        border-right: 1px solid #9778d7;
        animation: typing 2s steps(var(--typing-steps)),
          blinking 0.7s steps(1) infinite;
        &.long {
          font-size: 16px;
        }
      }

      h1 {
        margin: 20px 0 16px;
      }

      .description {
        font-size: 16px;
      }

      .notice {
        font-size: 16px;
        color: lightsteelblue;
      }

      .check-transaction a {
        color: tomato;
        font-size: 16px;
        text-decoration: underline;
      }

      .request-btn {
        font-weight: bold;
      }

      .button {
        width: 90%;
        border-radius: 20px;
        margin: 14px 0;
        max-width: 400px;
      }
    }
  }

  @keyframes typing {
    0% {
      width: 0px;
    }
    100% {
      width: 100%;
    }
  }

  @keyframes blinking {
    0%,
    100% {
      border-color: transparent;
    }
    50% {
      border-color: #9778d7;
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
