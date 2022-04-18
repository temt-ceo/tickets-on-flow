<template>
  <section class="section">
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
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'

export default {
  name: 'TicketPage',
  data () {
    return {
      bloctoWalletUser: {},
      dispenser: location.href.split('3000/')[1].split('/')[0],
      user_id: null,
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
      } else {
        const result = await this.isAlreadyRequested()
        if (result) {
          this.noticeTitle = `既に他のウォレットで${this.ticketName}を申請されています。ログアウトして再度ご確認ください。`
          this.status = 0
        } else {
          this.status = 1
          this.noticeTitle = `${this.ticketname}を申請可能です。以下から申請ボタンを押してください。`
        }
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
    async isAlreadyRequested () {
      try {
        const result = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.isAlreadyRequested),
            this.$fcl.args([
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
              this.$fcl.arg(this.user_id, this.$fclArgType.UInt32)
            ])
          ]
        ).then(this.$fcl.decode)
        return result
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
        argsArr.push(this.$fcl.arg(this.user_id, this.$fclArgType.UInt32))
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
  // text-align: center;
  padding-bottom: 24px;

  .container {
    padding: 16px;
    text-align: center;

    .dispenser-notice {
      font-size: 16px;
    }

    .notice {
      font-size: 14px;
      margin-top: 16px;
    }

    .check-transaction a {
      color: purple;
      font-size: 14px;
      text-decoration: underline;
    }

    button {
      margin-top: 24px;
      width: 95%;

      .font-small span {
        font-size: 12px;
      }

      .font-xsmall span {
        font-size: 10px;
      }
    }
  }
}
</style>
