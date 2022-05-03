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
        <b-dropdown
          v-if="developMode"
          aria-role="list"
          class="is-pulled-right"
          position="is-bottom-left"
        >
          <template #trigger>
            <b-icon
              class="navbar-item"
              icon="github"
              size="medium"
            />
          </template>
          <b-dropdown-item aria-role="listitem">
            <a
              :href="url.github.transaction"
              target="_blank"
            >
              All Transactions
            </a>
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem">
            <a
              :href="url.github.script"
              target="_blank"
            >
              All Scripts
            </a>
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem">
            <a
              :href="url.github.contract1"
              target="_blank"
            >
              Smart Contract
            </a>
            (
            <a
              :href="url.github.contract2"
              target="_blank"
            >
              Github
            </a>
            )
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem">
            <a
              :href="url.github.playground"
              target="_blank"
            >
              Play Ground
            </a>(*Please do not edit.)
          </b-dropdown-item>
        </b-dropdown>
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
                {{ $t('hamburger_menu1') }}
              </b-dropdown-item>
            </nuxt-link>
            <b-dropdown-item aria-role="listitem" class="i18n" @click="isI18nActive = !isI18nActive">
              <b-icon
                pack="fa-solid"
                icon="language"
                size="is-large"
              />
            </b-dropdown-item>
            <b-dropdown-item aria-role="listitem" class="menu-help" @click="isToUActive = !isToUActive">
              Terms of Use
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

    <b-modal v-model="isToUActive" :width="640" scroll="keep">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <p class="title is-4">
              Terms of Use
            </p>
            This system is the infrastructure for the future of Web3, laying the foundation for building Web3 businesses using the payment methods of the Flow ecosystem.<br>
            This will allow people who want to start a business to freely do business with people around the world in a situation where there is no one to exploit in the middle.<br>
            By making Flow’s existing trusted digital marketplace more direct and user-to-user, the system allows people to enter the business of connecting with others around the world.<br>
            You will be the first to experience the world of Web3, where payments are made instantly by blockchain.<br>
            Flow blockchain system makes it clear that a common global interface can be created and monetized. By being able to sell a common value to the world, the Ukrainian war victims are able to sell their strengths to the rest of the world at equal value.<br>
            <small>05/02/2022 Tokyo EM Technology & Co.</small>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="isI18nActive" :width="640" scroll="keep" @click="changeLang">
      <div class="card">
        <b-field>
          <b-radio-button
            v-model="i18nRadioButton"
            native-value="en"
            type="is-success"
          >
            <span class="fi fi-gb" @click="changeLang" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="es"
            type="is-success"
          >
            <span class="fi fi-es" @click="changeLang" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="fr"
            type="is-success"
          >
            <span class="fi fi-fr" @click="changeLang" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="zh"
            type="is-success"
          >
            <span class="fi fi-cn" @click="changeLang" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="ar"
            type="is-success"
          >
            <span class="fi fi-sa" @click="changeLang" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="pt"
            type="is-success"
          >
            <span class="fi fi-pt" @click="changeLang" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="ja"
            type="is-success"
          >
            <span class="fi fi-jp" @click="changeLang" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="de"
            type="is-success"
          >
            <span class="fi fi-de" @click="changeLang" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="ko"
            type="is-success"
          >
            <span class="fi fi-kr" @click="changeLang" />
          </b-radio-button>
        </b-field>
      </div>
    </b-modal>

    <b-modal v-model="showConfirmModal">
      <owned-tickets-confirm-modal
        :tickets="ownedTicket"
        :wallet="bloctoWalletUser"
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
              <b-menu-item label="Basic data" @click="helpSnackbar(6)" />
              <b-menu-item label="Basic data 2" @click="helpSnackbar(7)" />
              <b-menu-item label="How to use" @click="helpHowToUse" />
            </b-menu-item>
            <b-menu-item icon="marker">
              <template #label="props">
                Organizer
                <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'" />
              </template>
              <b-menu-item icon="account" label="Customers" @click="helpSnackbar(5)" />
              <b-menu-item icon="cellphone-link">
                <template #label>
                  Businesses
                  <b-dropdown aria-role="list" class="is-pulled-right" position="is-bottom-left">
                    <template #trigger>
                      <b-icon icon="dots-vertical" />
                    </template>
                    <b-dropdown-item aria-role="listitem" @click="helpSnackbar(0)">
                      Community?
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="helpSnackbar(1)">
                      Business?
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="helpSnackbar(2)">
                      Tipping?
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="helpSnackbar(3)">
                      Donations?
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-menu-item>
              <b-menu-item icon="cash-multiple" label="Payments" @click="helpSnackbar(4)" />
            </b-menu-item>
            <b-menu-item icon="account" label="Flow Account">
              <b-menu-item label="Account data" @click="helpSnackbar(8)" />
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
        github: {
          transaction: 'https://github.com/temt-ceo/tickets-on-flow/blob/main/cadence/transactions.js',
          script: 'https://github.com/temt-ceo/tickets-on-flow/blob/main/cadence/scripts.js',
          contract1: 'https://flow-view-source.com/testnet/account/0x39899237382f2a8a/contract/Tv18',
          contract2: 'https://github.com/temt-ceo/tickets-on-flow/blob/main/cadence/Tickets.cdc',
          playground: 'https://play.onflow.org/d9b1cb97-b54c-4d49-8187-258d6c2eab41?type=account&id=0e075014-fb30-4594-96d5-d13d94383399&storage=none'
        },
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
        { text: 'Step 1. Click Login', image: '/image/help_slide_1.png', color: 'primary' },
        { text: 'Step 2. Select Blocto', image: '/image/help_slide_2.png', color: 'info' },
        { text: 'Step 2. Select Create Your Original Ticket', image: '/image/help_slide_3.png', color: 'success' },
        { text: 'Step 4. Press Apply button', image: '/image/help_slide_4.png', color: 'warning' },
        { text: 'Step 5. Enter the ticket page name', image: '/image/help_slide_5.png', color: 'danger' },
        { text: 'Step 6. Enter your e-mail address', image: '/image/help_slide_6.png', color: 'primary' },
        { text: 'Step 7. Wait up to 24 hours', image: '/image/help_slide_7.png', color: 'info' },
        { text: 'Step 8. Press Distribute button', image: '/image/help_slide_8.png', color: 'success' },
        { text: 'Step 9. Enter ticket information', image: '/image/help_slide_9.png', color: 'warning' },
        { text: 'Step 10. Share the URL of the ticket at the bottom of the screen', image: '/image/help_slide_10.png', color: 'danger' }
      ],
      isToUActive: false,
      i18nRadioButton: 'en',
      isI18nActive: false
    }
  },
  head () {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })
    return {
      title: 'Tickets onFlow',
      htmlAttrs: {
        author: 'tokyo em technology',
        ...i18nHead.htmlAttrs
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1' },
        { hid: 'description', name: 'description', content: 'The first business application on Flow blockchain for everyone. Let\'s do a business on Flow blockchain.' },
        { hid: 'keywords', name: 'keywords', content: 'tickets, onflow, flow, blockchain, donation, tipping, community, business, web3, ticket' },
        { name: 'format-detection', content: 'telephone=no' },
        ...i18nHead.meta
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/tickets.png' },
        { rel: 'apple-touch-icon', size: '72x72', href: '/tickets.png' },
        { rel: 'apple-touch-icon', size: '114x114', href: '/tickets.png' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css', integrity: 'sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==', crossorigin: 'anonymous', referrerpolicy: 'no-referrer' },
        { rel: 'stylesheet', href: '/css/flag-icons.min.css' },
        ...i18nHead.link
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
    changeLang () {
      setTimeout(() => {
        this.$i18n.setLocale(this.i18nRadioButton)
        // location.href = this.switchLocalePath(this.i18nRadioButton)
      })
    },
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
    helpHowToUse () {
      this.showCarousel = true
      this.sidebarOpen = false
    },
    helpSnackbar (type) {
      let message = ''
      switch (type) {
        case 0:
          message = 'You can easily collect dues from the community.'
          break
        case 1:
          message = 'You can get crypto assets for a price by providing information primarily online.<br>You can also have a dedicated page.'
          break
        case 2:
          message = 'When you want to give someone money, you can easily do so.<br>You can also have a dedicated page.'
          break
        case 3:
          message = 'You can easily ask people to donate to support your project.<br>Everything is done user-to-user on the blockchain.'
          break
        case 4:
          message = 'You will need your own page to create tickets. Its cost is only 0.5$Flow.<br>That\'s all you need to make money for life.'
          break
        case 5:
          message = 'Everyone in the world will pay for your ability.<br>Use your strengths to earn money for your ministry!'
          break
        case 6:
          message = 'Why Blockchain? All international transactions are instantly and commission-free.'
          break
        case 7:
          message = 'Your expertise is instantly recognized and paid for by people!'
          break
        case 8:
          message = 'This service uses Flow Blockchain.<br>All transactions are done via the blockchain.'
          break
      }
      this.$buefy.snackbar.open({
        duration: 10000,
        message,
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
        color: darkslategrey !important;
        padding: 0.8rem 1rem;

        .icon {
          top: calc(50% - 13px);
          left: 15px;
          height: 0;
        }

        &.i18n {
          margin: 8px 0 13px;
        }

        &.menu-help {
          padding: 0.8rem 0.9em;
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

.menu-list a, a.dropdown-item {
  color: #4a4a4a !important;
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

.fi {
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
  font-size: 36px;
}

.field.has-addons {
  flex-wrap: wrap;

  .control {
    flex: 0 0 33.333333%;

    label {
      border-radius: unset;
      padding: 40px 0;
    }
  }
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
