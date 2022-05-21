<template>
  <section>
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
      type="is-warning"
    />

    <b-modal v-model="showConfirmModal">
      <div class="modal-body">
        <b-tabs v-model="activeTab">
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
            />
          </b-tab-item>

          <b-tab-item :label="$t('modal_text4')">
            <crowdfunding-confirm-modal
              :ticket-requesters="crowdfundingData"
            />
          </b-tab-item>
        </b-tabs>
        <div>
          <a :href="`https://testnet.flowscan.org/account/${bloctoWalletUser.addr}`" target="_blank" style="display: inline-block; padding-top: 5px; padding-right: 25px;">
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
          </a>
          <b-button
            v-if="bloctoWalletUser.addr"
            type="is-danger"
            @click="walletLogout"
            style="margin: 0 auto 0 30px;"
            outlined
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
    showAccount () {
      if (this.bloctoWalletUser?.addr) {
        this.showConfirmModal = true
      } else {
        this.walletLogin()
      }
    },
    async walletLogin () {
      if (this.bloctoWalletUser?.addr) {
        await this.$fcl.unauthenticate()
        this.$buefy.toast.open({
          message: 'Logged out.',
          queue: false
        })
      } else {
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
                ownedTicket[key].readable_code = ownedTicket[key].readable_code.replace(/^elffab/, '').replace(/@tickets-on-flow.web.app$/, '').split('').reverse().join('')
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
                    this.$fcl.arg(ret.contribution[i], this.$fclArgType.UInt32)
                  ])
                ]
              ).then(this.$fcl.decode)
              this.contributions[ret.contribution[i]] = result
            }
          }
          // チケット売上
          const hasDispenserVault = await this.hasTicketDispenserVault()
          if (hasDispenserVault) {
            // クラウドファンディング利益分
            const ticketRequesters = await this.$fcl.send(
              [
                this.$fcl.script(FlowScripts.getTicketRequesters),
                this.$fcl.args([
                  this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
                ])
              ]
            ).then(this.$fcl.decode)
            const keys = Object.keys(ticketRequesters)
            keys.forEach((key) => {
              console.log(ticketRequesters[key])
              // クラウドファンディング利益分
              if (ticketRequesters[key].crowdfunding === true) {
                this.crowdfundingData.push(ticketRequesters[key])
              }
              // チケット売上
              if (ticketRequesters[key].crowdfunding === false) {
                this.ticketSalesData.push(ticketRequesters[key])
              }
            })
          }
        } catch (e) {
        }
      } else {
        this.noticeIcon = true
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
            message: 'Logged out.',
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
