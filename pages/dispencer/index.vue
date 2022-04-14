<template>
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
      チケット配布管理画面
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
        :disabled="!bloctoWalletUser.addr || !hasDispenserVault || !hasDispenser"
        @click="showInputModal = true"
      >
        チケットを配布する
      </b-button>
      <b-button
        v-if="bloctoWalletUser.addr && hasDispenserVault && hasDispenser"
        @click="showConfirmModal = true"
      >
        チケットリクエスト状況を確認
      </b-button>
      <b-button
        v-if="bloctoWalletUser.addr && !hasDispenser"
        :disabled="hasDispenserVault"
        @click="requestDispenser"
      >
        チケット配布機能の申請
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
      <b-button
        v-if="bloctoWalletUser.addr && hasDispenserVault && hasDispenser"
        @click="showConfirmPayModal = true"
      >
        チケット利用状況を確認
      </b-button>
    </div>
    <b-button
      class="return-top-button"
      tag="nuxt-link"
      to="/"
    >
      トップに戻る
    </b-button>
    <b-modal v-model="showInputModal">
      <ticket-input-modal
        :address="address"
        :dispenser="dispenserId"
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
      hasDispenserVault: false,
      hasDispenser: false,
      noticeTitle: '',
      transactionScanUrl: '',
      ticketUsedNow: false,
      ticketUsedMessage: '',
      showInputModal: false,
      showConfirmModal: false,
      showConfirmPayModal: false
    }
  },
  computed: {
    ticketUsedTokenList () {
      return this.$store.state.ticketUsedTokenList
    }
  },
  async mounted() {
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
        this.address =this.bloctoWalletUser?.addr
        this.hasDispenserVault = await this.hasTicketDispenserVault()

        if (this.hasDispenserVault) {
          this.hasDispenser = await this.hasTicketDispenser()

          if (this.hasDispenser) {
            this.noticeTitle = 'チケット配布が可能です'
          } else {
            this.noticeTitle = '現在、チケット配布機能の申請中です'
          }
        } else {
          this.noticeTitle = 'チケット配布機能の申請が必要です。配布機能の申請を押して下さい'
        }          
      } else {
        this.noticeTitle = 'チケット配布を行う方のウォレットにログインして下さい'
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
        console.log(e)
        return false
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
        console.log(e)
        return false
      }
    },
    async requestDispenser () {
      alert('チケット付与機能を申請される方は、次のウォレットのポップアップ画面で「承認」を押して下さい')
      try {
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.requestDispenser),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ]),
            this.$fcl.payer(this.$fcl.authz),
            this.$fcl.proposer(this.$fcl.authz),
            this.$fcl.authorizations([this.$fcl.authz]),
            this.$fcl.limit(9999)
          ]
        ).then(this.$fcl.decode)
        this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
        this.hasDispenser = await this.hasTicketDispenser()
        this.noticeTitle = `チケット配布機能の申請を完了しました。この画面のスクリーンショットを保管しておくことをお勧めします。`
      } catch (e) {
        this.noticeTitle = `Address: ${addr}, Error: ${e}`
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
          this.$fcl.getEventsAndBlockHeightRange(identifier, height - range, height)
        ]
      ).then(this.$fcl.decode)
      const { events } = response
      if (events.length > 0) {
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
          if (parseInt(data.dispenser_id) === this.dispenserId && blockHeight > lastBlockid) {
            newEvents.push({
              dispenser_id: data.dispenser_id,
              token_id: data.token_id,
              quantity: data.quantity,
              address: data.address,
              block_id: blockHeight
            })
            newPayers = newPayers + `#${data.token_id}さん, `
          }
        })
        if (newPayers != '') {
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
  text-align: left;
  padding-bottom: 32px;

  .page-title {
    margin-top: 40px;
    text-align: center;
  }

  .content {
    margin: 24px 0 40px;
    padding: 16px;
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

  .return-top-button {
    margin: 0 auto 24px;
    display: flex;

    &:first-of-type {
      margin-top: 32px;
    }
  }  
}
</style>