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
        <b-icon
          class="navbar-item"
          pack="fa-brands"
          icon="youtube"
          size="medium"
          type="is-warning"
        />
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
        discord: 'https://discord.com/channels/965133581238296636/965133581238296640',
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
        color: darkgreen;

        .icon {
          top: calc(50% - 13px);
          left: 15px;
          height: 0;
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
