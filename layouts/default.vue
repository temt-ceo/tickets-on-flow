<template>
  <div>
    <nav
      class="navbar header has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="/?home"
          style="display: block; line-height: 0;"
        >
          <img
            src="~assets/image/chainwork.png"
            alt="Chain Work"
            height="28"
          >
          <br>
          <img
            src="~assets/image/tickets.png"
            alt="Tickets"
            height="28"
            style="padding-left: 20px;"
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
        <nuxt-link to="/youtube-contents/">
          <b-icon
            class="navbar-item youtube"
            pack="fa-brands"
            icon="youtube"
            size="medium"
            type="is-danger"
          />
        </nuxt-link>
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
          <b-dropdown-item v-if="developMode" aria-role="listitem">
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
            <nuxt-link to="/stats/">
              <b-dropdown-item aria-role="listitem" class="menu-long">
                ・{{ $t('operation_text55') }}
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
            <b-dropdown-item aria-role="listitem" class="menu-help" @click="showNoticeModal">
              👋 {{ $t('hamburger_menu3') }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>

    <b-modal
      v-model="isComponentModalActive"
      has-modal-card
      full-screen
      :can-cancel="false"
    >
      <div class="modal-card" style="width: auto; background-image: radial-gradient(rgb(65,105,225), #1b1c50);">
        <img
          src="~assets/image/chainwork.png"
          alt="Chain Work"
          style="width: 130px; padding-left: 10px; line-height: 0; padding-top: 9px;"
        >
        <br>
        <img
          src="~assets/image/tickets.png"
          alt="Tickets"
          style="width: 85px; line-height: 0; top: 28px; position: absolute; left: 33px;"
        >
        <section class="modal-card-body modal-notifications">
          <b-progress format="percent" :max="100">
            <template #bar>
              <b-progress-bar :value="progress1" show-value />
              <b-progress-bar :value="progress2" type="is-info" :show-value="showProgress2value" />
              <b-progress-bar :value="progress3" type="is-warning" :show-value="showProgress3value" />
              <b-progress-bar :value="progress4" type="is-success" :show-value="showProgress4value" />
            </template>
          </b-progress>
          <b-notification
            v-model="notification.first"
            aria-close-label="Close notification"
            :progress-bar="true"
            :auto-close="true"
            :duration="20000"
            :pause-on-hover="true"
          >
            {{ $t('operation_text45') }}
          </b-notification>
          <b-notification
            v-model="notification.second"
            :progress-bar="true"
            :auto-close="true"
            :duration="34000"
            :pause-on-hover="true"
            type="is-info"
            aria-close-label="Close notification"
          >
            {{ $t('operation_text46') }}
          </b-notification>
          <b-notification
            v-model="notification.third"
            :progress-bar="true"
            :auto-close="true"
            :duration="42000"
            :pause-on-hover="true"
            type="is-info is-light"
            aria-close-label="Close notification"
          >
            {{ $t('operation_text47') }}
          </b-notification>
          <b-notification
            v-model="notification.fourth"
            :progress-bar="true"
            :auto-close="true"
            :duration="54000"
            :pause-on-hover="true"
            type="is-warning"
            aria-close-label="Close notification"
            role="alert"
          >
            {{ $t('operation_text48') }}
          </b-notification>
          <b-notification
            v-model="notification.fifth"
            :progress-bar="true"
            :auto-close="true"
            :duration="66000"
            :pause-on-hover="true"
            type="is-warning is-light"
            aria-close-label="Close notification"
            role="alert"
          >
            {{ $t('operation_text49') }}
          </b-notification>
          <b-notification
            v-model="notification.sixth"
            :progress-bar="true"
            :auto-close="true"
            :duration="76000"
            :pause-on-hover="true"
            type="is-warning is-light"
            aria-close-label="Close notification"
            role="alert"
          >
            {{ $t('operation_text50') }}
          </b-notification>
          <b-notification
            v-model="notification.seventh"
            :progress-bar="true"
            :auto-close="true"
            :duration="86000"
            :pause-on-hover="true"
            type="is-success"
            aria-close-label="Close notification"
          >
            {{ $t('operation_text51') }}
          </b-notification>
          <b-notification
            v-model="notification.eighth"
            :progress-bar="true"
            :auto-close="true"
            :duration="95000"
            :pause-on-hover="true"
            type="is-success is-light"
            aria-close-label="Close notification"
          >
            {{ $t('operation_text52') }}
          </b-notification>
          <b-notification
            v-model="notification.ninth"
            aria-close-label="Close notification"
            :progress-bar="true"
            :auto-close="true"
            :duration="100000"
            :pause-on-hover="true"
            type="is-dark"
          >
            {{ $t('operation_text53') }}
          </b-notification>
          <div style="text-align: center;">
            <b-button
              type="is-text"
              :label="$t('operation_text54')"
              @click="sidebarOpen = true"
            />
          </div>
        </section>
      </div>
    </b-modal>

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

    <b-modal v-model="isI18nActive" :width="640" scroll="keep">
      <div class="card">
        <b-field>
          <b-radio-button
            v-model="i18nRadioButton"
            native-value="en"
            type="is-success"
          >
            <span class="fi fi-gb" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="es"
            type="is-success"
          >
            <span class="fi fi-es" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="fr"
            type="is-success"
          >
            <span class="fi fi-fr" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="zh"
            type="is-success"
          >
            <span class="fi fi-cn" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="ar"
            type="is-success"
          >
            <span class="fi fi-sa" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="pt"
            type="is-success"
          >
            <span class="fi fi-pt" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="ja"
            type="is-success"
          >
            <span class="fi fi-jp" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="de"
            type="is-success"
          >
            <span class="fi fi-de" />
          </b-radio-button>

          <b-radio-button
            v-model="i18nRadioButton"
            native-value="ko"
            type="is-success"
          >
            <span class="fi fi-kr" />
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
      style="z-index: 99; width: 100%; position: absolute; top: 0%;"
    >
      <div class="p-1">
        <img
          src="~assets/image/chainwork.png"
          alt="Chain Work"
          style="height: 25px;"
        >
        <br>
        <img
          src="~assets/image/tickets.png"
          alt="Tickets"
          style="height: 25px;"
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
      isI18nActive: false,
      isComponentModalActive: false,
      notification: {
        first: false,
        second: false,
        third: false,
        fourth: false,
        fifth: false,
        sixth: false,
        seventh: false,
        eighth: false,
        ninth: false
      },
      progress1: 0,
      progress2: 0,
      progress3: 0,
      progress4: 0,
      showProgress2value: false,
      showProgress3value: false,
      showProgress4value: false
    }
  },
  head () {
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })
    return {
      title: 'Tickets built on Flow Blockchain',
      htmlAttrs: {
        author: 'tokyo em technology',
        ...i18nHead.htmlAttrs
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1' },
        { hid: 'description', name: 'description', content: 'This system uses the Flow blockchain to enable business and crowdfunding worldwide. You can work worldwide through social network and Rewards are paid instantly.' },
        { hid: 'keywords', name: 'keywords', content: 'Tickets, onFlow, Flow Blockchain, web3, crowdfunding, work, social network' },
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
  watch: {
    i18nRadioButton: {
      handler (val) {
        this.changeLang()
      }
    },
    isComponentModalActive: {
      handler (val) {
        if (val === true) {
          setTimeout(() => {
            this.notification.first = true
          }, 300)
          setTimeout(() => {
            this.notification.second = true
          }, 2000)
          setTimeout(() => {
            this.notification.third = true
          }, 4000)
          setTimeout(() => {
            this.notification.fourth = true
          }, 18000)
          setTimeout(() => {
            this.notification.fifth = true
          }, 22000)
          setTimeout(() => {
            this.notification.sixth = true
          }, 26000)
          setTimeout(() => {
            this.notification.seventh = true
          }, 38000)
          setTimeout(() => {
            this.notification.eighth = true
          }, 40000)
          setTimeout(() => {
            this.notification.ninth = true
          }, 42000)
        } else {
          this.notification.first = false
          this.notification.second = false
          this.notification.third = false
          this.notification.fourth = false
          this.notification.fifth = false
          this.notification.sixth = false
          this.notification.seventh = false
          this.notification.eighth = false
          this.notification.ninth = false
          this.progress1 = 0
          this.progress2 = 0
          this.progress3 = 0
          this.progress4 = 0
          this.showProgress2value = false
          this.showProgress3value = false
          this.showProgress4value = false
        }
      }
    },
    'notification.first': {
      handler (val) {
        if (val === false) {
          this.progress1 = this.progress1 === 0 ? 12 : 25
          this.checkProgress()
        }
      }
    },
    'notification.second': {
      handler (val) {
        if (val === false) {
          this.progress2 = this.progress2 === 0 ? 12 : 25
          this.showProgress2value = true
          this.checkProgress()
        }
      }
    },
    'notification.third': {
      handler (val) {
        if (val === false) {
          this.progress2 = this.progress2 === 0 ? 12 : 25
          this.showProgress2value = true
          this.checkProgress()
        }
      }
    },
    'notification.fourth': {
      handler (val) {
        if (val === false) {
          this.progress3 = this.progress3 === 0 ? 10 : (this.progress3 === 10 ? 20 : 25)
          this.showProgress3value = true
          this.checkProgress()
        }
      }
    },
    'notification.fifth': {
      handler (val) {
        if (val === false) {
          this.progress3 = this.progress3 === 0 ? 10 : (this.progress3 === 10 ? 20 : 25)
          this.showProgress3value = true
          this.checkProgress()
        }
      }
    },
    'notification.sixth': {
      handler (val) {
        if (val === false) {
          this.progress3 = this.progress3 === 0 ? 10 : (this.progress3 === 10 ? 20 : 25)
          this.showProgress3value = true
          this.checkProgress()
        }
      }
    },
    'notification.seventh': {
      handler (val) {
        if (val === false) {
          this.progress4 = this.progress4 === 0 ? 12 : 25
          this.showProgress4value = true
          this.checkProgress()
        }
      }
    },
    'notification.eighth': {
      handler (val) {
        if (val === false) {
          this.progress4 = this.progress4 === 0 ? 12 : 25
          this.showProgress4value = true
          this.checkProgress()
        }
      }
    },
    'notification.ninth': {
      handler (val) {
        if (val === false) {
          this.progress1 = this.progress1 === 0 ? 12 : 25
          this.checkProgress()
        }
      }
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
      console.log(111)
      setTimeout(() => {
        this.$i18n.setLocale(this.i18nRadioButton)
        this.isI18nActive = false
        location.reload()
      })
    },
    checkProgress () {
      if (this.progress1 === 25 && this.progress2 === 25 && this.progress3 === 25 && this.progress4 === 25) {
        setTimeout(() => {
          this.isComponentModalActive = false
        }, 1000)
      }
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
    },
    showNoticeModal () {
      this.isComponentModalActive = true
    }
  }
}
</script>

<style lang="scss">

.navbar {
  position: sticky;
  top: 0;
  background-color: #596886 !important;

  .navbar-item {
    padding: 0.60rem 0.25rem 0 0.75rem;

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
      left: 229px;
      top: 15px;
      &:before {
        font-size: 8px;
      }
    }
  }

  .navbar-item img {
      max-height: 1.15rem;
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

        &.menu-long {
          font-size: 14px;
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
      border-color: #3e8ed0;
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

.switch span.control-label {
  position: relative;
  padding-left: calc(0.50em - 1px) !important;
  width: 135px;
}

.text-wrap {
  .switch span.control-label {
    width: 250px;
  }
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

.modal .stats-list {
  .label {
    margin-top: 1.2rem;
    margin-bottom: 0.2rem;
  }

  .field:not(:last-child) {
    margin-bottom: 0rem !important;
  }
}

.modal-notifications {
  width: 100%;
  max-width: 500px;
  top: 10%;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
}

#__layout {
  background-image: radial-gradient(#973999, #f8598b, #f7bf00);
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
    background-color: #f2effb;
  }

  td:nth-child(2) {
    background-color: #eff1fa;
  }

  td:nth-child(3) {
    background-color: #eff5fb;
  }

  td:nth-child(5) {
    background-color: #fffaeb;
  }

  td:nth-child(4) {
    background-color: #effaf5;
  }

  td:nth-child(6) {
    background-color: #f5f5f5;
  }
}

.check-ticket {
  .table-wrapper table.table {
    td {
      border-bottom: 0.5px dashed #666 !important;
    }

    td:nth-child(2) {
      text-align: left !important;
    }

    td:last-child {
      border-bottom: 1px solid whitesmoke !important;
    }
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

.step-content {
  width: 90%;
  padding: 3rem 0 0 2rem !important;
}

input[type="text"]:disabled,
input[type="number"]:disabled {
  color: black;
}

.setting-modal {
  max-height: 78vh;

  input,
  select {
    border-radius: 14px !important;
  }

  input[type="text"] {
    width: 83%;
  }

  .left-input input[type="text"] {
    width: 79%;
  }

  .control.has-icons-right .icon.is-right {
    right: 17%;
  }

  input[type="date"] {
    width: 92%;
  }

  .taginput .taginput-container.is-focusable {
    width: 83%;
    border-radius: 14px !important;
  }
}

.stats .has-addons .control {
    flex: 0 0 17.9%;
}

.user-data {
  .modal-card-body {
    padding: 0 22px;
  }

  button.download {
    padding: 4px 17px;
    height: 1.8rem;
    width: 1rem;
    float: right;
    bottom: 4px;
    left: 8px;
  }

  .b-table .table-wrapper.has-mobile-cards thead tr th.checkbox-cell {
    margin-bottom: 0;
    padding-top: 0;
    padding-right: 0;
  }

  .b-checkbox.checkbox[disabled] {
      opacity: 0.1;
  }

  .modal {
    line-height: 1.2;
    padding-top: 8%;

    .modal-body {
      padding-bottom: 10px;

      .b-tabs {
        margin-bottom: 0.2rem;
      }
    }

    .tab-content {
      padding: 0.2rem 1rem;
    }

    .modal-content {
      max-height: calc(100vh - 50px);

      .modal-content, .modal-card {
        max-height: calc(100vh - 50px);

        hr {
          height: 0
        }

        .table-wrapper.has-mobile-cards {
          height: 352px;

          tr {
            border-radius: 5px;

            a {
              color: #3e8ed0;
              text-decoration: none;
            }

            &.is-empty {
              margin-top: 5px;
              padding: 10px 0;
              border-radius: 8px;
            }

            /* $FLOW color */
            [data-label='Amount'] {
              color: #48c78e;
            }
          }
        }

        .ticket-confirm-modal .table-wrapper.has-mobile-cards {
          height: 312px;
        }
      }
    }

    hr {
      background-color: #f5f5f5;
      margin: 0.4rem 0;
    }

    .datepicker-header {
      .pagination {
        .pagination-previous,
        .pagination-next {
          display: block;
        }
      }
    }
  }
}

.navbar.is-primary .navbar-brand > a.navbar-item:focus {
  background-color: inherit;
}

.message-body {
  padding: 1.25em 1.5em 1.25em 1em;

  .media .media-left {
    margin-right: 0.1rem;
  }
}

.table-wrapper {
  table.table {
    thead tr {
      .checkbox-cell {
        height: 0;
        padding: 0;

        .checkbox,
        input {
          display: none !important;
        }
      }
      th:first-child {
        white-space: nowrap;
      }
      th:nth-child(2) {
        white-space: nowrap;
      }
      th:nth-child(4) {
        white-space: nowrap;
      }
    }
  }
}

.userdata-pagination.pagination {
  padding-bottom: 10px;
  margin-bottom: 0;

  .pagination-list {
    flex-grow: inherit !important;
  }

  .pagination-previous,
  .pagination-next {
    display: none;
  }

  .pagination-link.is-current {
    background-color: #3e8ed0;
  }
}

tr {
  border-radius: 5px;
}

.ticket-page {
  .content p:not(:last-child) {
    margin-bottom: 0;
  }

  .ticket-code-display {
    article {
      margin: 4px 0;
    }
  }
}

.ticket-detail {
  .datepicker {
    .dropdown.is-inline .dropdown-menu {
      width: 100%;
    }
    .dropdown-content {
      box-shadow: 0 1em 2em -0.25em rgb(10 10 10 / 40%), 0 0px 0 1px rgb(10 10 10 / 2%);
    }
  }
  .b-tooltip {
    position: fixed;
    width: 100%;
    max-width: 960px;
  }
}

.dialog.modal {
  .modal-card.animation-content {
    width: 88%;

    input[type="number"] {
      border-radius: 14px;
      width: 55%;
    }
  }
}

.modal-content, .modal-card {
    max-height: calc(100vh - 140px);
}

.modal-close {
  top: 10px;
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
  #__layout {
    background-image: linear-gradient(to bottom right, #973999, #f8598b, #f7bf00);
  }

  .navbar,
  .navbar-burger {
    display: block;
  }

  .stats .animation-content {
    width: 760px;
    max-width: 760px;
  }
}

@media screen and (min-width: 400px) {
  .navbar .dropdown-menu .dropdown-content .dropdown-item.menu-long {
    font-size: 16px;
  }
}
@media screen and (min-width: 700px) {
  .navbar .dropdown-menu .dropdown-content .dropdown-item.menu-long {
    font-size: 17px;
  }
  .stats-percent {
    display: none;
  }
}

@media screen and (min-height: 740px) {
  .user-data {
    .modal {
      .modal-content {
        .modal-content, .modal-card {
          .table-wrapper.has-mobile-cards {
            height: 412px;
          }

          .ticket-confirm-modal .table-wrapper.has-mobile-cards {
            height: 372px;
          }
        }
      }
    }
  }
}

@media screen and (min-height: 840px) {
  .user-data {
    .modal {
      .modal-content {
        .modal-content, .modal-card {
          .table-wrapper.has-mobile-cards {
            height: 472px;
          }

          .ticket-confirm-modal .table-wrapper.has-mobile-cards {
            height: 432px;
          }
        }
      }
    }
  }
}

</style>
