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
          >
          </b-icon>
        </a>
        <a :href="url.twitter" target="_blank">
          <b-icon
            class="navbar-item"
            icon="twitter"
            size="medium"
            type="is-info"
          >
          </b-icon>
        </a>
        <b-icon
          class="navbar-item"
          pack="fa-brands"
          icon="youtube"
          size="medium"
          type="is-warning"
        >
        </b-icon>
        <b-icon
          class="navbar-item"
          pack="fa-brands"
          icon="discord"
          size="medium"
          type="is-success"
        >
        </b-icon>
        <div class="navbar-burger">
          <b-dropdown aria-role="list">
            <template #trigger>
              <div>
                <span />
                <span />
                <span />
              </div>
            </template>
            <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
            <b-dropdown-item aria-role="listitem">
              <b-icon
                pack="fa-solid"
                icon="language"
                size="is-large"
              >
              </b-icon>
            </b-dropdown-item>
            <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
        </b-dropdown>
        </div>
      </div>
    </nav>

    <Nuxt />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      url: {
        twitter: 'https://mobile.twitter.com/_official_asp',
        github: 'https://github.com/temt-ceo/tickets-on-flow/tree/develop'
      },
      isActive: false,
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        }
      ]
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
    margin-top: 4px;
  }

  .dropdown-trigger {
    margin: 25px;
  }

  .dropdown-item {
    .icon {
      top: calc(50% - 13px);
      left: 25px;
      height: 0;
    }
  }
}

@media screen and (min-width: 1024px) {
  .navbar,
  .navbar-burger {
    display: block;
  }
}

</style>
