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
        <a :href="url.telegram" target="_blank">
          <b-icon
            class="navbar-item telegram"
            pack="fab"
            icon="telegram"
            size="medium"
            type="is-info"
          />
        </a>
        <a :href="url.youtube" target="_blank">
          <b-icon
            class="navbar-item youtube"
            pack="fa-brands"
            icon="youtube"
            size="medium"
            type="is-danger"
          />
        </a>
        <a :href="url.discord" target="_blank" class="discord">
          <b-icon
            class="navbar-item"
            pack="fa-brands"
            icon="discord"
            size="medium"
            type="is-success"
          />
        </a>
        <user-data />

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
              {{ $t('develop_menu1') }}
            </a>
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem">
            <a
              :href="url.github.script"
              target="_blank"
            >
              {{ $t('develop_menu2') }}
            </a>
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem">
            <a
              :href="url.github.contract1"
              target="_blank"
            >
              {{ $t('develop_menu3') }}
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
            </a>
            (*{{ $t('develop_menu4') }})
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
                ・{{ $t('hamburger_menu1') }}
              </b-dropdown-item>
            </nuxt-link>
            <nuxt-link to="/crowdfunding/">
              <b-dropdown-item aria-role="listitem">
                ・{{ $t('hamburger_menu4') }}
              </b-dropdown-item>
            </nuxt-link>
            <b-dropdown-item aria-role="listitem" class="i18n" @click="isI18nActive = !isI18nActive">
              <b-icon
                pack="fa-solid"
                icon="language"
                size="is-large"
              />
            </b-dropdown-item>
            <nuxt-link to="/about/">
              <b-dropdown-item aria-role="listitem" class="menu-help">
                {{ $t('hamburger_menu5') }}
              </b-dropdown-item>
            </nuxt-link>
            <b-dropdown-item aria-role="listitem" class="menu-help" @click="isToUActive = !isToUActive">
              {{ $t('hamburger_menu2') }}
            </b-dropdown-item>
            <b-dropdown-item aria-role="listitem" class="menu-help" @click="sidebarOpen = true">
              👋 {{ $t('hamburger_menu3') }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>

    <b-modal v-model="isToUActive" :width="640" scroll="keep">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <p class="title is-4">
              {{ $t('hamburger_menu2') }}
            </p>
            {{ $t('terms_of_use1') }}
            <br>
            {{ $t('terms_of_use2') }}
            <br>
            {{ $t('terms_of_use3') }}
            <br>
            {{ $t('terms_of_use4') }}
            <br>
            {{ $t('terms_of_use5') }}
            <br>
            {{ $t('terms_of_use6') }}
            <br>
            {{ $t('terms_of_use7') }}
            <br>
            {{ $t('terms_of_use8') }}
            <br>
            {{ $t('terms_of_use9') }}
            <br>
            {{ $t('terms_of_use10') }}
            <br>
            {{ $t('terms_of_use11') }}
            <br>
            {{ $t('terms_of_use12') }}
            <br>
            {{ $t('terms_of_use13') }}
            <br>
            {{ $t('terms_of_use15') }}
            <br>
            {{ $t('terms_of_use16') }}
            <br><br><br>
            <small>&copy; 05/10/2022 Tokyo EM Technology & Co.</small>
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
            <b-menu-item icon="information-outline" label="FAQ">
              <b-menu-item :label="$t('help_text15')" />
              <b-menu-item label="⇨Why?" @click="helpSnackbar(11)" />
              <b-menu-item label="⇨How?" @click="helpSnackbar(9)" />
              <b-menu-item label="⇨Where?" @click="helpSnackbar(12)" />
              <b-menu-item label="⇨When?" @click="helpSnackbar(13)" />
              <b-menu-item label="⇨Who?" @click="helpSnackbar(10)" />
            </b-menu-item>
            <b-menu-item icon="information-outline" label="Info">
              <b-menu-item icon="information-outline" :label="$t('help_text2')" @click="helpSnackbar(6)" />
              <b-menu-item icon="account" label="Customers" @click="helpSnackbar(5)" />
            </b-menu-item>
            <!-- <b-menu-item icon="marker">
              <template #label="props">
                Organizer
                <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'" />
              </template>
              <b-menu-item :label="$t('help_text2') + ' 2'" @click="helpSnackbar(7)" />
              <b-menu-item icon="cellphone-link">
                <template #label>
                  Businesses
                  <b-dropdown aria-role="list" class="is-pulled-right" position="is-bottom-left">
                    <template #trigger>
                      <b-icon icon="dots-vertical" />
                    </template>
                    <b-dropdown-item aria-role="listitem" @click="helpSnackbar(0)">
                      {{ $t('help_text4') }}?
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="helpSnackbar(1)">
                      {{ $t('help_text5') }}?
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="helpSnackbar(2)">
                      {{ $t('help_text6') }}?
                    </b-dropdown-item>
                    <b-dropdown-item aria-role="listitem" @click="helpSnackbar(3)">
                      {{ $t('help_text7') }}?
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-menu-item>
              <b-menu-item icon="cash-multiple" label="Payments" @click="helpSnackbar(4)" />
            </b-menu-item> -->
            <b-menu-item icon="account" label="Flow Account">
              <b-menu-item label="Account data" @click="helpSnackbar(8)" />
              <b-menu-item label="Wallet Address" @click="helpWallet" />
            </b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import UserData from '~/components/common/UserData'

export default {
  name: 'DefaultLayout',
  components: {
    UserData
  },
  data () {
    return {
      bloctoWalletUser: {},
      url: {
        twitter: 'https://mobile.twitter.com/_official_asp',
        telegram: 'https://t.me/ukraine_blockchain',
        discord: 'https://discord.gg/DV6VafmQ2S',
        github: {
          transaction: 'https://github.com/temt-ceo/tickets-on-flow/blob/main/cadence/transactions.js',
          script: 'https://github.com/temt-ceo/tickets-on-flow/blob/main/cadence/scripts.js',
          contract1: 'https://flow-view-source.com/testnet/account/0x39899237382f2a8a/contract/TicketsV20',
          contract2: 'https://github.com/temt-ceo/tickets-on-flow/blob/main/cadence/Tickets.cdc',
          playground: 'https://play.onflow.org/d9b1cb97-b54c-4d49-8187-258d6c2eab41?type=account&id=0e075014-fb30-4594-96d5-d13d94383399&storage=none'
        },
        youtube: 'https://www.youtube.com/channel/UC2ebXnn3Gab5qPrfKtGN6hA'
      },
      developMode: false,
      sidebarOpen: false,
      sidebarOverlay: true,
      sidebarFullheight: false,
      sidebarFullwidth: false,
      sidebarRight: true,
      isToUActive: false,
      i18nRadioButton: this.$i18n.locale || 'en',
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
  mounted () {
    this.developMode = location.search === '?m=developer'
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
    this.$fcl.currentUser.subscribe(this.setupWalletInfo)
  },
  methods: {
    setupWalletInfo (user) {
      this.bloctoWalletUser = user
    },
    changeLang () {
      setTimeout(() => {
        this.$i18n.setLocale(this.i18nRadioButton)
        this.isI18nActive = false
        location.reload()
      })
    },
    helpSnackbar (type) {
      let message = ''
      switch (type) {
        // case 0:
        //   message =
        //   break
        // case 1:
        //   message =
        //   break
        // case 2:
        //   message =
        //   break
        // case 3:
        //   message =
        //   break
        // case 4:
        //   message =
        //   break
        case 5:
          message = this.$t('help_text13')
          break
        case 6:
          message = this.$t('help_text14')
          break
        // case 7:
        //   message = this.$t('help_text15')
        //   break
        case 8:
          message = this.$t('help_text16')
          break
        case 9:
          message = this.$t('help_text8')
          break
        case 10:
          message = this.$t('help_text9')
          break
        case 11:
          message = this.$t('help_text10')
          break
        case 12:
          message = this.$t('help_text11')
          break
        case 13:
          message = this.$t('help_text12')
          break
      }
      this.$buefy.snackbar.open({
        duration: 10000,
        message,
        type: 'is-danger',
        position: 'is-bottom-right',
        actionText: null,
        queue: false,
        onAction: () => {
        }
      })
    },
    async clickCopy () {
      await navigator.clipboard.writeText(this.bloctoWalletUser?.addr)
    },
    helpWallet () {
      if (this.bloctoWalletUser?.addr) {
        this.$buefy.snackbar.open({
          duration: 5000,
          message: this.bloctoWalletUser?.addr,
          type: 'is-danger',
          position: 'is-bottom-right',
          actionText: 'Copy',
          queue: false,
          onAction: async () => {
            await this.clickCopy()
            this.$buefy.toast.open({
              message: 'Copied!',
              queue: false
            })
          }
        })
      } else {
        this.$buefy.snackbar.open({
          duration: 5000,
          message: this.$t('help_text17'),
          type: 'is-danger',
          position: 'is-bottom-right',
          actionText: null,
          queue: false,
          onAction: () => {
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">

.navbar {
  position: sticky;
  top: 0;

  .navbar-item {
    padding: 0 0.25rem 0 0.75rem;

    &.icon {
      height: 3.75rem;
      padding: 2px 1.25rem 0;
    }
  }

  .discord {
    display: none;
  }

  .notice-icon {
    i {
      color: #f14668;
      font-size: 8px;
      position: absolute;
      left: 256px;
      top: 15px;
      &:before {
        font-size: 8px;
      }
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

  .telegram i {
    background-image: radial-gradient(white 0%, white 60%, transparent 61%);
    border-radius: 50%;
    &:before {
      font-size: 18px;
    }
  }

  .youtube i {
    background-image: radial-gradient(white 0%, white 45%, transparent 46%);
    &:before {
      font-size: 18px;
    }
  }
}

.check-transaction a,
.snackbar a {
  color: tomato !important;
}

.dialog {
  .media .media-content {
    input:focus {
      border-color: #48c78e;
      -webkit-box-shadow: none;
      box-shadow: none;
    }
  }
}

.modal-body nav.tabs {
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
}

.breadcrumb {
  position: absolute;
  top: 10px;
  left: 5px;

  li {
    a {
      color: #3e8ed0 !important;
    }
  }
}

.menu-list a, a.dropdown-item {
  color: #4a4a4a !important;
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

#__layout {
  background-image: linear-gradient(to bottom right, #973999, #f8598b, #f7bf00);
}

.section.top-screen{
  .b-slider {
    .b-slider-track {
      background: none;

      .b-slider-fill {
        background: #dbdbdb !important;
      }

      .b-slider-thumb-wrapper.has-indicator .b-slider-thumb {
        border-radius: 10px;
        padding: 0px;
        // background: #b5b5b5;
        // color: #b5b5b5;
      }
    }

    .tooltip-trigger {
      opacity: 0;
    }
  }
  .icon {
    .fa-2x {
      font-size: 1.3em;
    }

    i.fa-globe {
      background-color: #454545;
      border-radius: 5px;
      padding: 3px;
    }

    &.is-clickable { // searchbar
      background-color: inherit;
      padding-bottom: 5px;
    }
  }

  .dropdown-item .icon {
    background-color: inherit;
  }

  .tooltip-content {
    display: none;
  }

  &.tapped .tooltip-content {
    display: block !important;
  }
}

.button {
  span {
    padding: 3px;
  }
}

.hero-body {
  height: 95vh;
}

.searchbar .control input{
  font-size: 12px;
  padding: 16px 10px;
  box-shadow: 0px 1px 2px -1px #cccccc;
}

// チケット名が縦長になるのを防ぐため
.table-wrapper table.table {
  td {
    font-size: 14px;
  }

  td:first-child {
    white-space: nowrap;
  }
}

.ticket-title {
  color: #485fc7;
  text-align: center;
  // --typing-steps: 14;
  // overflow: hidden;
  // white-space: nowrap;
  // letter-spacing: 3px;
  // border-right: 0.4px solid #b29feb;
  // animation: typing 1.8s steps(var(--typing-steps)),
  //   blinking 0.7s steps(1) infinite;
  // &.long {
  //   font-size: 12px;
  //   padding-top: 3px;
  // }
}

.dropdown-item {
  .media {
    .media-left {
      padding-right: 1rem;
      margin-right: 0.5px;
    }

    .media-content {
      color: #3e8ed0;
      font-size: large;
      h3 {
        text-shadow: 0 0.2px 0.8px #0000ff;
      }
    }
  }
}

@keyframes typing {
  0% {
    width: 0px;
  }
  100% {
    width: 90%;
  }
}

@keyframes blinking {
  0%,
  100% {
    border-color: transparent;
  }
  50% {
    border-color: #b29feb;
  }
}

@media screen and (min-width: 1024px) {
  .navbar,
  .navbar-burger {
    display: block;
  }
}

</style>
