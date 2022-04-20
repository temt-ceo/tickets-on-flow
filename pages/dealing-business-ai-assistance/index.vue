<template>
  <section class="section">
    <div class="hero">
      <div class="hero--overlay">
        <div class="hero--content content">
          <div v-if="ticketName && ticketName.length > 0">
            <h1 class="page-title">
              {{ ticketName ? ticketName : 'Ticket Application' }}
            </h1>
            <h1 class="notice">
              Event Name: {{ ticketName }}
            </h1>
            <h1 class="notice">
              Detail: {{ ticketWhere }}
            </h1>
            <h1 class="notice">
              More Information: <a :href="twitter" target="_blank">please click here</a>
            </h1>
            <p
              v-if="bloctoWalletUser.addr && status > 2"
              class="notice"
            >
              現在の{{ ticketName }}の枚数 : {{ currentTicketQuantity }}枚
            </p>
            <p
              v-if="transactionScanUrl !== ''"
              class="check-transaction"
            >
              <a :href="transactionScanUrl" target="_blank">Confirm Transaction</a>
            </p>
            <b-button
              v-if="ticketName !== '' && !bloctoWalletUser.addr"
              type="is-link is-light"
              @click="walletLogin"
            >
              Sign up for {{ ticketName }}
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && status === 1"
              type="is-link is-light"
              @click="requestTicket"
            >
              Apply for Ticket
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && status === 2"
              type="is-danger is-light"
              @click="getUserTicketQuantity"
            >
              申請状況を確認する
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr"
              type="is-link is-light"
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
  name: 'DealingBusinessAIAssistance',
  data () {
    return {
      bloctoWalletUser: {},
      dispenser: null,
      userId: null,
      ticketInfo: {},
      ticketName: '',
      ticketWhere: '',
      ticketQuantity: 0,
      twitter: '',
      currentTicketQuantity: 0,
      status: 0,
      transactionScanUrl: '',
      noticeTitle: ''
    }
  },
  async mounted () {
    await this.getTickets()
    await this.$fcl.currentUser.subscribe(this.setupUserInitialInfo)
    if (this.bloctoWalletUser.addr) {
      await this.checkCurrentStatus()
    }
  },
  methods: {
    async getTickets () {
      // =======DEBUG=======
      this.dispenser = 1

      if (!this.ticketInfo[this.dispenser]) {
        try {
          const ticketInfo = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getTickets),
              this.$fcl.args([
                this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
              ])
            ]
          ).then(this.$fcl.decode)
          if (ticketInfo == null) {
            this.ticketInfo = {}
            this.ticketName = ''
          } else {
            this.ticketInfo = ticketInfo
            const ticketName = this.ticketInfo.name.split('||@')
            this.ticketName = ticketName[0]
            this.twitter = 'https://twitter.com/' + ticketName[1]
            const where = this.ticketInfo.where_to_use.split('||')
            if (where.length === 2) {
              this.ticketWhere = where[1]
            } else if (where.length > 2) {
              this.ticketWhere = ''
              for (let i = 1; i < where.length; i++) {
                this.ticketWhere = this.ticketWhere + (i === 1 ? '' : '||') + where[i]
              }
            }
            this.ticketQuantity = this.ticketInfo.quantity
          }
        } catch (e) {
        }
      } else {
        const ticketName = this.ticketInfo.name.split('||@')
        this.ticketName = ticketName[0]
        this.twitter = ticketName[1]
        const where = this.ticketInfo.where_to_use.split('||')
        if (where.length === 2) {
          this.ticketWhere = where[1]
        } else if (where.length > 2) {
          this.ticketWhere = ''
          for (let i = 1; i < where.length; i++) {
            this.ticketWhere = this.ticketWhere + (i === 1 ? '' : '||') + where[i]
          }
        }
        this.ticketQuantity = this.ticketInfo.quantity
      }
      if (this.ticketInfo.name !== '') {
        this.noticeTitle = `${this.ticketName}が${this.twitter}によって提供されています。`
      }
    },
    async walletLogin () {
      if (!this.bloctoWalletUser.addr) {
        alert('チケットを管理するウォレットに接続します。まだ作成していない場合は新規での作成をお願いします。')
        await this.$fcl.authenticate()
      }
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
      if (ret) {
        await this.getUserTicketQuantity()
      } else if (this.ticketName) {
        this.status = 1
        this.noticeTitle = `${this.ticketName}を申請可能です。以下から申請ボタンを押してください。`
      } else {
        this.noticeTitle = 'Ticket has not been created yet.'
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
    async getUserTicketQuantity () {
      try {
        this.noticeTitle = ''
        const quantity = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getUserTicketQuantity),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
            ])
          ]
        ).then(this.$fcl.decode)
        this.currentTicketQuantity = quantity
        if (quantity === 0) {
          this.noticeTitle = `${this.ticketName}を全て消費済みです。`
          this.status = 5
        } else if (quantity > 0 && quantity < this.ticketQuantity) {
          this.noticeTitle = `${this.ticketName}は現在、残り${quantity}枚です。`
          this.status = 4
        } else if (quantity > 0 && quantity === this.ticketQuantity) {
          this.noticeTitle = `${this.ticketWhere}で使える${this.ticketName}が配布されました！次回使ってみましょう！`
          this.status = 3
        } else if (!quantity) {
          this.status = 2
          this.noticeTitle = `現在${this.ticketName}を申請中です。配布が完了するまでお待ち下さい。`
        }
      } catch (e) {
      }
    },
    async requestTicket () {
      const ret = await this.isTicketContainerReady()
      let transactionCode = ''
      if (ret) {
        transactionCode = FlowTransactions.requestMoreTicket
      } else {
        transactionCode = FlowTransactions.requestTicket
      }
      alert('チケットを申請される方は、次のウォレットのポップアップ画面で「承認」を押してください')
      try {
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

  .page-title {
    margin-top: 80px;
    font-size: 18px;
    color: white;
    text-align: center;
  }

  .content {
    margin: 10px 0 20px;
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

  .hero--video {
    min-width: 100%;
    min-height: 100vh;
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
