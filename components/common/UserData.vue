<template>
  <section class="user-data">
    <span @click="showAccount">
      <b-icon
        class="navbar-item"
        icon="account"
        size="medium"
        type="is-warning"
      />
    </span>
    <b-icon
      v-if="noticeIcon"
      class="notice-icon"
      icon="circle"
      size="medium"
      type="is-info"
    />

    <b-modal v-model="showConfirmModal">
      <div class="modal-body">
        <b-tabs v-model="activeTab" style="background-color: aliceblue;">
          <b-tab-item :label="$t('modal_text1')">
            <owned-tickets-confirm-modal
              :tickets="ownedTicket"
            />
          </b-tab-item>

          <b-tab-item :label="$t('modal_text2')">
            <contribution-confirm-modal
              :ticket-requesters="contributions"
            />
          </b-tab-item>

          <b-tab-item :label="$t('modal_text3')">
            <ticket-confirm-modal
              :address="bloctoWalletUser.addr"
              :ticket-requesters="ticketSalesData"
              :owner="0"
            />
          </b-tab-item>

          <b-tab-item :label="$t('modal_text4')">
            <crowdfunding-confirm-modal
              :address="bloctoWalletUser.addr"
              :ticket-requesters="crowdfundingData"
              :owner="0"
            />
          </b-tab-item>
        </b-tabs>
        <div>
          <a :href="`https://testnet.flowscan.org/account/${bloctoWalletUser.addr}`" target="_blank" style="display: inline-block; padding-right: 25px;">
            <b-icon
              class="navbar-item"
              pack="fa-solid"
              icon="wallet"
              size="is-large"
              type="is-success"
              style="display: inline; padding-right: 0;"
            />
            <b-icon
              class="navbar-item"
              pack="fa-solid"
              icon="franc-sign"
              size="is-large"
              type="is-success"
              style="display: inline; padding-left: 0;"
            />
            <br>
            <span style="color: #48c78e;">{{ balance }}</span>
          </a>
          <b-button
            type="is-danger"
            style="margin: 6px auto 0 20px;"
            outlined
            @click="walletLogout"
          >
            {{ $t('operation_text43') }}
          </b-button>
        </div>
      </div>
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import OwnedTicketsConfirmModal from '~/components/common/OwnedTicketsConfirmModal'
import ContributionConfirmModal from '~/components/common/ContributionConfirmModal'
import TicketConfirmModal from '~/components/common/TicketConfirmModal'
import CrowdfundingConfirmModal from '~/components/common/CrowdfundingConfirmModal'

export default {
  name: 'UserData',
  components: {
    OwnedTicketsConfirmModal,
    ContributionConfirmModal,
    TicketConfirmModal,
    CrowdfundingConfirmModal
  },
  data () {
    return {
      balance: null,
      ownedTicket: [],
      contributions: {},
      ticketSalesData: [],
      crowdfundingData: [],
      showConfirmModal: false,
      bloctoWalletUser: {},
      noticeIcon: true,
      activeTab: 0
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
    await this.$fcl.currentUser.subscribe(this.setupWalletInfo)
  },
  methods: {
    async showAccount () {
      if (this.bloctoWalletUser?.addr) {
        this.showConfirmModal = true
      } else {
        await this.walletLogin()
        if (this.bloctoWalletUser?.addr) {
          this.showConfirmModal = true
        }
      }
    },
    async walletLogin () {
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
    async setupWalletInfo (user) {
      this.bloctoWalletUser = user
      // get account data
      if (this.bloctoWalletUser?.addr) {
        this.noticeIcon = false
        try {
          // 所持チケット
          const ret = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.hasTicketResource),
              this.$fcl.args([
                this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
              ])
            ]
          ).then(this.$fcl.decode)

          if (ret !== null) {
            const ownedTicket = ret.ownedTicket
            const keys = Object.keys(ownedTicket)
            keys.forEach((key) => {
              if (ownedTicket[key].readable_code) {
                ownedTicket[key].readable_code = ownedTicket[key].readable_code.replace(/^elffab/, '').replace(/@chain-work.com$/, '').split('').reverse().join('')
              }
              const ticketInfo = this.tickets.find(obj => obj.dispenser_id === ownedTicket[key].dispenser_id)
              const ticketName = ticketInfo.name?.split('||@')
              ownedTicket[key].path = `/ti/${ticketInfo.domain}`
              ownedTicket[key].ticketName = ticketName[0]
              ownedTicket[key].twitterAccount = ticketName[1]
              this.ownedTicket.push(ownedTicket[key])
            })
            // クラウドファンディング
            for (let i = 0; i < ret.contribution.length; i++) {
              const result = await this.$fcl.send(
                [
                  this.$fcl.script(FlowScripts.getTicketRequestStatus),
                  this.$fcl.args([
                    this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
                    this.$fcl.arg(String(ret.contribution[i]), this.$fclArgType.UInt32)
                  ])
                ]
              ).then(this.$fcl.decode)
              this.contributions[ret.contribution[i]] = result
            }
          }
          // チケット売上
          const hasDispenserVault = await this.hasTicketDispenserVault()
          if (hasDispenserVault) {
            const ticketRequesters = await this.$fcl.send(
              [
                this.$fcl.script(FlowScripts.getTicketRequesters),
                this.$fcl.args([
                  this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
                ])
              ]
            ).then(this.$fcl.decode)
            if (ticketRequesters) {
              const keys = Object.keys(ticketRequesters)
              keys.forEach((key) => {
                // console.log(ticketRequesters[key])
                // クラウドファンディング利益分
                if (ticketRequesters[key].crowdfunding === true) {
                  this.crowdfundingData.push(ticketRequesters[key])
                  this.crowdfundingData.sort((a, b) => parseInt(b.time) - parseInt(a.time))
                }
                // チケット売上
                if (ticketRequesters[key].crowdfunding === false) {
                  this.ticketSalesData.push(ticketRequesters[key])
                  this.ticketSalesData.sort((a, b) => parseInt(b.time) - parseInt(a.time))
                }
              })
            }
          }
          await this.getFlowBalance()
        } catch (e) {
          console.log(e)
        }
      } else {
        this.noticeIcon = true
      }
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
          this.balance = '(' + parseFloat(balance).toFixed(3) + ' $FLOW)'
        }
      } catch (e) {
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
    walletLogout () {
      this.$buefy.dialog.confirm({
        message: this.$t('operation_text42'),
        type: 'is-dark',
        cancelText: 'No',
        confirmText: 'Yes',
        onConfirm: async () => {
          await this.$fcl.unauthenticate()
          this.$buefy.toast.open({
            message: 'Signed out.',
            queue: false
          })
          setTimeout(() => {
            location.reload()
          }, 750)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  display: inline-flex;
  width: 40px;
}

.modal-body {
  background-color: white;
  text-align: center;
  padding-bottom: 20px;
}
</style>
