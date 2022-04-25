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
            <b-dropdown-item aria-role="listitem">
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
            <b-menu-item icon="information-outline" label="Info"></b-menu-item>
            <b-menu-item icon="settings">
              <template #label="props">
                Organizer
                <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'"></b-icon>
              </template>
              <b-menu-item @click="clickBtn1" icon="account" label="Users"></b-menu-item>
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
              <b-menu-item icon="cash-multiple" label="Payments" disabled></b-menu-item>
            </b-menu-item>
            <b-menu-item icon="account" label="Flow Account">
              <b-menu-item @click="helpAccount" label="Account data"></b-menu-item>
              <b-menu-item @click="helpWallet" label="Wallet Address"></b-menu-item>
            </b-menu-item>
          </b-menu-list>
          <b-menu-list>
            <b-menu-item label="Expo" icon="link" tag="router-link" target="_blank" to="/expo"></b-menu-item>
          </b-menu-list>
          <b-menu-list label="Actions">
            <b-menu-item label="Logout"></b-menu-item>
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
      sidebarOpen: false,
      sidebarOverlay: true,
      sidebarFullheight: false,
      sidebarFullwidth: true,
      sidebarRight: true
    }
  },
  methods: {
    helpBusiness1 () {
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'You can get crypto assets for a price by providing information primarily online.<br>You can also have a dedicated page.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Undo',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Action pressed',
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
        actionText: 'Undo',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Action pressed',
            queue: false
          })
        }
      })
    },
    helpBusiness3 () {
      this.$buefy.snackbar.open({
        duration: 10000,
        message: 'You can easily ask people to donate to support your project.<br>Note: <em>0.05$FLOW~1FLOW is possible</em>.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Undo',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Action pressed',
            queue: false
          })
        }
      })
    },
    helpAccount () {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: 'Log in to see your wallet address.<br>Note: <em>The blockchain uses FlowBlockchain</em>.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Login',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Action pressed',
            queue: false
          })
        }
      })
    },
    helpWallet () {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: 'Log in to see your wallet address.<br>Note: <em>The blockchain uses FlowBlockchain</em>.',
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: 'Login',
        queue: false,
        onAction: () => {
          this.$buefy.toast.open({
            message: 'Action pressed',
            queue: false
          })
        }
      })
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
