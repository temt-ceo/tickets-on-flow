<template>
  <section class="section">
    <h1 class="page-title">
      チケット管理画面
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
        <a :href="transactionScanUrl" target="_blank">Confirm the transaction</a>
      </p>
      <b-button
        :disabled="!bloctoWalletUser.addr"
        @click="flowWalletLogout"
      >
        Log out from Wallet
      </b-button>
    </div>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'

export default {
  name: 'UseTicketPage',
  data () {
    return {
      bloctoWalletUser: {},
      address: null,
      dispenser: location.href.split('3000/')[1].split('/')[0],
      user_id: null,
      ticketInfo: {},
      ticketName: '',
      ticketWhere: '',
      ticketQuantity: 0,
      currentTicketQuantity: 0,
      showModal: false,
      noticeTitle: '',
      transactionScanUrl: ''
    }
  },
  async mounted () {
    await this.$fcl.currentUser.subscribe(this.setupWalletInfo)
    await this.getTickets()
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
        this.address = this.bloctoWalletUser.addr
        const ret = await this.isTicketVaultReady()
        if (ret) {
          await this.getUserTicketQuantity()
        } else {
          this.noticeTitle = 'チケットの申請が必要です。チケットの申請をして配布された後、再度読み込む必要があります。'
          setTimeout(() => {
            location.href = location.href.replace('/use-ticket', '')
          }, 5000)
        }
      } else {
        this.noticeTitle = 'ウォレットにログインして下さい。'
      }
    },
    async getTickets () {
      if (!this.ticketInfo[this.dispenser]) {
        try {
          const ticketInfo = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getTickets),
              this.$fcl.args([
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
        }
      } else {
        this.ticketName = this.ticketInfo[0].name
        this.ticketWhere = this.ticketInfo[0].where_to_use
        this.ticketQuantity = this.ticketInfo[0].quantity
      }
      // Not registered yet.
      if (this.ticketInfo.name === undefined) {
        location.href = location.href.replace('/use-ticket', '')
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
        } else if (quantity > 0 && quantity <= this.ticketQuantity) {
          this.noticeTitle = `${this.ticketName}は現在、残り${quantity}枚です。`
        } else if (!quantity) {
          this.noticeTitle = `現在${this.ticketName}を申請中です。配布が完了するまでお待ち下さい。`
        }
      } catch (e) {
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.section {
  text-align: left;
  padding-bottom: 24px;

  .page-title {
    margin-top: 32px;
    text-align: center;

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
