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
      <owned-tickets-confirm-modal
        :tickets="ownedTicket"
        :wallet="bloctoWalletUser"
        @closeModal="showConfirmModal=false"
      />
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import OwnedTicketsConfirmModal from '~/components/common/OwnedTicketsConfirmModal'

export default {
  name: 'UserData',
  components: {
    OwnedTicketsConfirmModal
  },
  data () {
    return {
      ownedTicket: [],
      showConfirmModal: false,
      bloctoWalletUser: {},
      noticeIcon: true
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
          const ret = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.hasTicketResource),
              this.$fcl.args([
                this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
              ])
            ]
          ).then(this.$fcl.decode)
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
        } catch (e) {
        }
      } else {
        this.noticeIcon = true
      }
    }

  }
}
</script>

<style lang="scss" scoped>
section {
  display: inline-flex;
  width: 40px;
}
</style>
