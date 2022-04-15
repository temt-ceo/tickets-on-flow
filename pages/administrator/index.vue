<template>
  <section class="section">
    <h1 class="page-title">
      チケットMint機能 管理画面
    </h1>
    <hr class="separator">
    <div class="content">
      <p v-if="bloctoWalletUser.addr" class="description">
        (ウォレットのアドレス: {{ bloctoWalletUser.addr }})
      </p>
      <h1 class="notice">
        {{ noticeTitle}}
      </h1>
      <p v-if="transactionScanUrl !== ''" class="check-transaction">
        <a :href="transactionScanUrl" target="_blank">トランザクションを確認</a>
      </p>
      <b-button
        :disabled="!isAdmin"
        @click="dispenseDispenser"
      >
        チケットMint機能を付与
      </b-button>
      <b-button
        v-if="!bloctoWalletUser.addr"
        @click="flowWalletLogin"
      >
        管理しているウォレットに接続
      </b-button>
      <b-button
        v-if="bloctoWalletUser.addr"
        @click="flowWalletLogout"
      >
        ウォレットからログアウト
      </b-button>
    </div>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'

export default {
  name: 'AdministratorPage',
  data () {
    return {
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
        this.noticeTitle = '付与ボタンを押して下さい'
      } else {
        this.noticeTitle = 'コントラクトの管理者のウォレットでログインして下さい'
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
    async dispenseDispenser () {
      const addr = prompt('チケット付与機能を付与する場合は、以下のテキストボックスに該当する人物のウォレットアドレスを入力して下さい')
      if (addr) {
        const dispenserId = await this.getRequestedDispensers()
        if (!dispenserId) {
          this.noticeTitle = `dispenserIdが取得できませんでした。`
          return
        }
        const ret = confirm(`Dispenser ID ${dispenserId}にチケット配布機能を付与します。よろしければOKを押して下さい。`)
        if (ret) {
          try {
            const transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(FlowTransactions.dispenseDispenser),
                this.$fcl.args([
                  this.$fcl.arg(this.addr, this.$fclArgType.Address)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
            this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
            this.noticeTitle = `Address: ${addr}にチケット配布機能を付与しました。`
            return transactionId
          } catch (e) {
            this.noticeTitle = `Address: ${addr}, Error: ${e}`
          }
        }
      }
    },
    async getRequestedDispensers () {
      try {
        const dispenserId = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getRequestedDispensers),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        return dispenserId
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.section {
  text-align: left;
  padding-bottom: 24px;
  background-color: #D6D6D6;
  margin: 0;

  .page-title {
    margin-top: 40px;
    text-align: center;
    color: purple;

    .notice {
      font-size: 14px;
      color: green;
    }

    .check-transaction a {
      color: purple;
      font-size: 14px;
      text-decoration: underline;
    }
  }
}
</style>