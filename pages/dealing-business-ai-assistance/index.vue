<template>
  <section class="section">
    <div class="hero">
      <div class="hero--overlay">
        <div class="hero--content content">
          <h1 class="page-title">
            {{ ticketname ? ticketname : 'Ticket Application' }}
          </h1>
          <h1 class="notice">
            {{ noticeTitle }}
          </h1>
          <div v-if="ticketName && ticketName.length > 0" class="container">
            <h1
              v-if="ticketName !== '' && noticeTitle"
              class="dispenser-notice"
            >
              {{ noticeTitle }}
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
              @click="walletLogin"
            >
              {{ ticketName }}の内容を確認する
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && status === 1"
              @click="requestTicket"
            >
              申請する
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr && status === 2"
              @click="getUserTicketQuantity"
            >
              申請状況を確認する
            </b-button>
            <b-button
              v-if="bloctoWalletUser.addr"
              @click="flowWalletLogout"
            >
              Log out from Wallet
            </b-button>
          </div>
          <b-button
            tag="nuxt-link"
            to="/"
            type="is-warning is-light"
            class="to-top"
          >
            Back to Home
          </b-button>
        </div>
      </div>
      <section class="hero--bottom"></section>
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
      dispenser: location.href.split('3000/')[1].split('/')[0],
      userId: null,
      ticketInfo: {},
      ticketName: '',
      ticketWhere: '',
      ticketQuantity: 0,
      currentTicketQuantity: 0,
      status: 0,
      transactionScanUrl: '',
      noticeTitle: ''
    }
  },
  async mounted () {
    await this.getTicketInfo()
    await this.$fcl.currentUser.subscribe(this.setupUserInitialInfo)
    if (this.bloctoWalletUser.addr) {
      await this.checkCurrentStatus()
    }
  },
  methods: {
    async getTicketInfo () {
      // =======DEBUG=======
      this.dispenser = 1

      if (!this.ticketInfo[this.dispenser]) {
        try {
          const ticketInfo = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getTicketInfo),
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
            this.ticketName = this.ticketInfo[0].name
            this.ticketWhere = this.ticketInfo[0].where_to_use
            this.ticketQuantity = this.ticketInfo[0].quantity
          }
        } catch (e) {
          console.log(e)
        }
      } else {
        this.ticketName = this.ticketInfo[0].name
        this.ticketWhere = this.ticketInfo[0].where_to_use
        this.ticketQuantity = this.ticketInfo[0].quantity
      }
      if (this.ticketInfo.name !== '') {
        this.noticeTitle = `${this.ticketWhere}で使える${this.ticketName}が${this.dispenser}によって提供されています。`
      }
    },
    async flowWalletLogin () {
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
      } else if (this.ticketname) {
        this.status = 1
        this.noticeTitle = `${this.ticketname}を申請可能です。以下から申請ボタンを押してください。`
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
        console.log(e)
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
        console.log(e)
      }
    },
    async requestTicket () {
      const ret = await this.isTicketContainerReady()
      let transactionCode = ''
      const argsArr = [this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)]
      if (ret) {
        transactionCode = FlowTransactions.requestMoreTicket
        argsArr.push(this.$fcl.arg(this.userId, this.$fclArgType.UInt32))
      } else {
        transactionCode = FlowTransactions.requestTicket
      }
      alert('チケットを申請される方は、次のウォレットのポップアップ画面で「承認」を押してください')
      try {
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(transactionCode),
            this.$fcl.args([
              argsArr
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
        console.log(e)
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

    .to-top {
      margin-top: 24px;
    }

    .button {
      width: 90%;
      border-radius: 20px;
      margin: 18px 0;
      max-width: 400px;
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
