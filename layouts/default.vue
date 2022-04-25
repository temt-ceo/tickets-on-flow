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
        <a :href="url.github" target="_blank">
          <b-icon
            class="navbar-item"
            icon="github"
            size="medium"
            type="is-danger"
          />
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
            type="is-warning"
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
            <b-dropdown-item  @click="sidebarOpen = true" aria-role="listitem" class="menu-help">
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
      @change="carouselChange($event)"
      style="z-index: 100;"
    >
      <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
        <section :class="`hero is-medium is-${carousel.color}`">
          <div class="hero-body has-text-centered">
            <h1 class="title">{{carousel.text}}</h1>
            <img
              :src="carousel.image"
              alt="Tickets Manual"
              style="max-height: 400px;"
            />
          </div>
        </section>
      </b-carousel-item>
    </b-carousel>

    <Nuxt />

    <b-sidebar
      type="is-light"
      :fullheight="sidebarFullheight"
      :fullwidth="sidebarFullwidth"
      :overlay="sidebarOverlay"
      :right="sidebarRight"
      v-model="sidebarOpen"
    >
      <div class="p-1">
        <img
          src="~assets/image/tickets.png"
          alt="Tickets"
        />
        <b-menu>
          <b-menu-list label="Help">
            <b-menu-item icon="information-outline" label="Info">
              <b-menu-item @click="helpBasicData1" label="Basic data"></b-menu-item>
              <b-menu-item @click="helpBasicData2" label="Basic data 2"></b-menu-item>
              <b-menu-item @click="helpHowToUse" label="How to use"></b-menu-item>
            </b-menu-item>
            <b-menu-item icon="marker">
              <template #label="props">
                Organizer
                <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'"></b-icon>
              </template>
              <b-menu-item @click="helpCustomers" icon="account" label="Customers"></b-menu-item>
              <b-menu-item icon="cellphone-link">
                <template #label>
                  Businesses
                  <b-dropdown aria-role="list" class="is-pulled-right" position="is-bottom-left">
                    <template #trigger>
                        <b-icon icon="dots-vertical"></b-icon>
                    </template>
                    <b-dropdown-item @click="helpBusiness1" aria-role="listitem">Business?</b-dropdown-item>
                    <b-dropdown-item @click="helpBusiness2" aria-role="listitem">Tipping?</b-dropdown-item>
                    <b-dropdown-item @click="helpBusiness3" aria-role="listitem">Donations?</b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-menu-item>
              <b-menu-item @click="helpPayments" icon="cash-multiple" label="Payments"></b-menu-item>
            </b-menu-item>
            <b-menu-item icon="account" label="Flow Account">
              <b-menu-item @click="helpAccount" label="Account data"></b-menu-item>
              <b-menu-item @click="helpWallet" label="Wallet Address"></b-menu-item>
            </b-menu-item>
          </b-menu-list>
          <b-menu-list label="Actions">
            <b-menu-item @click="walletLogin" :label="helpLogin"></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      url: {
        twitter: 'https://mobile.twitter.com/_official_asp',
        discord: 'https://discord.com/channels/965133581238296636/965133581238296640',
        github: 'https://github.com/temt-ceo/tickets-on-flow/tree/develop',
        youtube: 'https://youtu.be/-kqmTFCrPtE'
      },
      helpLogin: null,
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
      carouselInterval: 4000,
      carouselIndicator: true,
      carouselInside: true,
      carouselIndicatorStyle: 'is-lines',
      carousels: [
        { text: 'Step 1. Click Login', image: '/help_slide_1.png', color: 'primary' },
        { text: 'Step 2. Select Blocto', image: '/help_slide_2.png', color: 'info' },
        { text: 'Step 2. Select Create Your Original Ticket', image: '/help_slide_3.png', color: 'success' },
        { text: 'Step 4. Press Apply button', image: '/help_slide_4.png', color: 'warning' },
        { text: 'Step 5. Enter the ticket page path', image: '/help_slide_5.png', color: 'danger' },
        { text: 'Step 6. Enter your e-mail address', image: '/help_slide_6.png', color: 'primary' },
        { text: 'Step 7. Wait up to 24 hours', image: '/help_slide_7.png', color: 'info' },
        { text: 'Step 8. Press Distribute button', image: '/help_slide_8.png', color: 'success' },
        { text: 'Step 9. Enter ticket information', image: '/help_slide_9.png', color: 'warning' },
        { text: 'Step 10. Share the URL of the ticket at the bottom of the screen', image: '/help_slide_10.png', color: 'danger' }
      ]
    }
  },
  async mounted () {
    this.helpLogin = 'Logout'
    await this.$fcl.currentUser.subscribe(this.setupWalletInfo)
  },
  methods: {
    async walletLogin () {
      if (this.helpLogin === 'Logout') {
        await this.$fcl.unauthenticate()
        this.$buefy.toast.open({
          message: 'Logged out.',
          queue: false
        })
      } else {
        this.$buefy.snackbar.open({
          duration: 10000,
          message: 'The login screen will appear.<br>Please login or Sign in.<br>If you are new to FlowBlockchain, we recommend the Blocto wallet.',
          type: 'is-danger',
          position: 'is-bottom-left',
          actionText: 'Got it',
          queue: false,
          onAction: () => {
          }
        })
        await this.$fcl.authenticate()
      }
    },
    setupWalletInfo (user) {
      this.bloctoWalletUser = user

      if (this.bloctoWalletUser?.addr) {
        this.helpLogin = 'Logout'
      } else {
        this.helpLogin = 'Login'
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
      console.log(value)
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

        .icon {
          top: calc(50% - 13px);
          left: 15px;
          height: 0;
        }

        &.i18n {
          margin: 7px 0;
          min-height: 20px;
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

.carousel {
  z-index: 2;
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
