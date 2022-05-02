<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="/"
        >
          <img
            src="~assets/image/tickets.png"
            alt="Tickets"
            height="28"
          >
        </a>
        <a :href="url.twitter" target="_blank">
          <b-icon
            class="navbar-item"
            icon="twitter"
            size="medium"
            type="is-info"
          />
        </a>
        <a :href="url.youtube" target="_blank">
          <b-icon
            class="navbar-item"
            pack="fa-brands"
            icon="youtube"
            size="medium"
            type="is-danger"
          />
        </a>
        <a :href="url.discord" target="_blank">
          <b-icon
            class="navbar-item"
            pack="fa-brands"
            icon="discord"
            size="medium"
            type="is-success"
          />
        </a>
        <span @click="showAccount">
          <b-icon
            class="navbar-item"
            icon="account"
            size="medium"
            type="is-warning"
          />
        </span>
        <a
          v-if="developMode"
          :href="url.github"
          target="_blank"
        >
          <b-icon
            class="navbar-item"
            icon="github"
            size="medium"
          />
        </a>
        <div class="navbar-burger">
          <b-dropdown aria-role="list">
            <template #trigger>
              <div class="hamburger">
                <span />
                <span />
                <span />
              </div>
            </template>
            <nuxt-link to="/dispenser/">
              <b-dropdown-item aria-role="listitem">
                Create your original ticket
              </b-dropdown-item>
            </nuxt-link>
            <b-dropdown-item aria-role="listitem" class="i18n">
              <b-icon
                pack="fa-solid"
                icon="language"
                size="is-large"
              />
            </b-dropdown-item>
            <b-dropdown-item aria-role="listitem" class="menu-help" @click="sidebarOpen = true">
              👋 Hi, need Help?
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>

    <b-carousel
      v-if="showCarousel"
      :arrow="carouselArrow"
      :arrow-hover="carouselArrowHover"
      :autoplay="carouselAutoPlay"
      :repeat="carouselRepeat"
      :interval="carouselInterval"
      :indicator="carouselIndicator"
      :indicator-inside="carouselInside"
      :indicator-style="carouselIndicatorStyle"
      style="z-index: 100;"
      @change="carouselChange($event)"
    >
      <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
        <section :class="`hero is-medium is-${carousel.color}`">
          <div class="hero-body has-text-centered">
            <h1 class="title">
              {{ carousel.text }}
            </h1>
            <img
              :src="carousel.image"
              alt="Tickets Manual"
              style="max-height: 400px;"
            >
          </div>
        </section>
      </b-carousel-item>
    </b-carousel>

    <b-modal v-model="showConfirmModal">
      <owned-tickets-confirm-modal
        :tickets="ownedTicket"
        @closeModal="showConfirmModal=false"
      />
    </b-modal>

    <Nuxt />

    <b-sidebar
      v-model="sidebarOpen"
      type="is-light"
      :fullheight="sidebarFullheight"
      :fullwidth="sidebarFullwidth"
      :overlay="sidebarOverlay"
      :right="sidebarRight"
    >
      <div class="p-1">
        <img
          src="~assets/image/tickets.png"
          alt="Tickets"
        >
        <b-menu>
          <b-menu-list label="Help">
            <b-menu-item icon="information-outline" label="Info">
              <b-menu-item label="Basic data" @click="helpBasicData1" />
              <b-menu-item label="Basic data 2" @click="helpBasicData2" />
              <b-menu-item label="How to use" @click="helpHowToUse" />
            </b-menu-item>
            <b-menu-item icon="marker">
              <template #label="props">
                Organizer
                <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'" />
              </template>
              <b-menu-item icon="account" label="Customers" @click="helpCustomers" />
              <b-menu-item icon="cellphone-link">
                <template #label>
                  Businesses
                  <b-dropdown aria-role="list" class="is-pulled-right" position="is-bottom-left">
                    <template #trigger>
                      <b-icon icon="dots-vertical" />
                    </template>
                    <b-dropdown-item aria-role="listitem" @click="helpBusiness0">
                      Community?
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="helpBusiness1">
                      Business?
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="helpBusiness2">
                      Tipping?
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="helpBusiness3">
                      Donations?
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-menu-item>
              <b-menu-item icon="cash-multiple" label="Payments" @click="helpPayments" />
            </b-menu-item>
            <b-menu-item icon="account" label="Flow Account">
              <b-menu-item label="Account data" @click="helpAccount" />
              <b-menu-item label="Wallet Address" @click="helpWallet" />
            </b-menu-item>
          </b-menu-list>
          <b-menu-list label="Actions">
            <b-menu-item :label="loginLabel" @click="walletLogin" />
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import OwnedTicketsConfirmModal from '~/components/common/OwnedTicketsConfirmModal'

export default {
  name: 'DefaultLayout',
  components: {
    OwnedTicketsConfirmModal
  },
  data () {
    return {
      url: {
        twitter: 'https://mobile.twitter.com/_official_asp',
        discord: 'https://discord.gg/DV6VafmQ2S',
        github: 'https://github.com/temt-ceo/tickets-on-flow/',
        youtube: 'https://www.youtube.com/channel/UC2ebXnn3Gab5qPrfKtGN6hA'
      },
      developMode: false,
      ownedTicket: [],
      showConfirmModal: false,
      loginLabel: null,
      sidebarOpen: false,
      sidebarOverlay: true,
      sidebarFullheight: false,
      sidebarFullwidth: false,
      sidebarRight: true,
      bloctoWalletUser: {},
      showCarousel: false,
      carouselArrow: true,
      carouselArrowHover: false,
      carouselAutoPlay: true,
      carouselRepeat: false,
      carouselInterval: 5000,
      carouselIndicator: true,
      carouselInside: true,
      carouselIndicatorStyle: 'is-lines',
      carousels: [
        { text: 'Step 1. Click Login', image: '/help_slide_1.png', color: 'primary' },
        { text: 'Step 2. Select Blocto', image: '/help_slide_2.png', color: 'info' },
        { text: 'Step 2. Select Create Your Original Ticket', image: '/help_slide_3.png', color: 'success' },
        { text: 'Step 4. Press Apply button', image: '/help_slide_4.png', color: 'warning' },
        { text: 'Step 5. Enter the ticket page name', image: '/help_slide_5.png', color: 'danger' },
        { text: 'Step 6. Enter your e-mail address', image: '/help_slide_6.png', color: 'primary' },
        { text: 'Step 7. Wait up to 24 hours', image: '/help_slide_7.png', color: 'info' },
        { text: 'Step 8. Press Distribute button', image: '/help_slide_8.png', color: 'success' },
        { text: 'Step 9. Enter ticket information', image: '/help_slide_9.png', color: 'warning' },
        { text: 'Step 10. Share the URL of the ticket at the bottom of the screen', image: '/help_slide_10.png', color: 'danger' }
      ]
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
    this.developMode = location.search === '?develop'
    this.loginLabel = 'Logout'
    await this.$fcl.currentUser.subscribe(this.setupWalletInfo)
  },
  methods: {
    showAccount () {
      if (this.loginLabel === 'Login') {
        this.walletLogin()
      } else {
        this.showConfirmModal = true
      }
    },
    async walletLogin () {
      if (this.loginLabel === 'Logout') {
        await this.$fcl.unauthenticate()
        this.$buefy.toast.open({
          message: 'Logged out.',
          queue: false
        })
      } else {
        this.$buefy.snackbar.open({
          duration: 10000,
          message: 'Please login or Sign in.<br>If you are new to FlowBlockchain, we recommend the Blocto wallet.',
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
        this.loginLabel = 'Logout'
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
        this.loginLabel = 'Login'
      }
    },
    helpBasicData1 () {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: 'Everyone in the world will pay for your ability.<br>Use your strengths to earn money for your ministry!',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    helpBasicData2 () {
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'Why Blockchain? All international transactions are instantaneous and commission-free.<br>Your expertise is instantly recognized and paid for by people all over the world!',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    helpHowToUse () {
      this.showCarousel = true
      this.sidebarOpen = false
    },
    helpCustomers () {
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'Everyone in the world will pay for your ability.<br>Use your strengths to earn money for your ministry!',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    helpBusiness0 () {
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'Easily collect dues from the community.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    helpBusiness1 () {
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'You can get crypto assets for a price by providing information primarily online.<br>You can also have a dedicated page.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    helpBusiness2 () {
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'When you want to give someone money, you can easily do so.<br>You can also have a dedicated page.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    helpBusiness3 () {
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'You can easily ask people to donate to support your project.<br>Everything is done user-to-user on the blockchain.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    helpPayments () {
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'You will need your own page to create tickets. Its cost is only 0.5$Flow.<br>That\'s all you need to make money for life.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    helpAccount () {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: 'This service uses Flow Blockchain.<br>All transactions are done via the blockchain.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    helpWallet () {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: this.bloctoWalletUser?.addr ? this.bloctoWalletUser?.addr : 'Log in to see your wallet address.<br>Note: <em>The blockchain uses FlowBlockchain</em>.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Got it',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Come on, Let\'s do it!',
            queue: false
          })
        }
      })
    },
    carouselChange (value) {
      if (value >= 10) {
        this.showCarousel = false
        this.sidebarOpen = true
      }
    }
  }
}
</script>

<style lang="scss">

.navbar {
  .navbar-item {
    padding: 0 0.25rem 0 0.75rem;

    &.icon {
      height: 3.75rem;
      padding: 2px 1.25rem 0;
    }
  }

  .navbar-item img {
      max-height: 3.25rem;
  }

  .navbar-burger {
    margin-top: 5px;
  }

  .dropdown-menu {
    left: auto;
    right: 20%;

    .dropdown-content {
      padding: 14px 0 20px;

      .dropdown-item {
        font-size: 17px;
        font-weight: bold;
        font-style: italic;
        color: darkslategrey;
        padding: 0.8rem 1rem;

        .icon {
          top: calc(50% - 13px);
          left: 15px;
          height: 0;
        }

        &.i18n {
          margin: 2px 0;
        }

        &.menu-help {
          padding-left: 0.7em;
        }
      }
    }
  }

  .hamburger {
    min-width: 50px;
    min-height: 50px;
  }
}

a {
  color: tomato !important;
}

.carousel {
  z-index: 2;
}

span.control-label {
  position: absolute;
  padding-left: calc(1.75em - 1px) !important;
}

.field {
  margin-top: 0.5rem;
  margin-bottom: 2rem !important;
}
@media screen and (min-width: 1024px) {
  .navbar,
  .navbar-burger {
    display: block;
  }
}

@media screen and (max-width: 768px) {
  .modal .animation-content {
    width: 90% !important;
  }
}

</style>
