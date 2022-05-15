<template>
  <section :class="{tapped: isTapped}" class="section top-screen">
    <div class="ticket-list">
      <div class="header">
        <div>
          <i class="fa-solid fa-magnifying-glass" />
        </div>
        <div>
          <label>Tickets</label>
        </div>
        <div>
          <i class="fa-solid fa-bars" />
        </div>
      </div>
      <div class="content">
        <div
          v-for="(ticket, index) in tickets"
          :key="index"
          class="ticket-card"
        >
          <div class="c-contact">
            <nuxt-link :to="'/ti/' + ticket.path">
              <div class="identity_block fa-3x">
                <label>{{ ticket.label }}</label>
                <i class="fa-solid fa-heart fa-beat" style="--fa-animation-duration: 0.5s;" />
                <span>{{ ticket.description }}</span>
              </div>
              <div class="price">
                <span>$FLOW: {{ ticket.price }}</span>
                <span class="datetime">({{ ticket.datetime }})</span>
              </div>
              <div
                :class="ticket.style"
                class="icon_block"
              >
                {{ $t('ticket_text1') }}:<br><label>{{ ticket.type }}</label>
              </div>
            </nuxt-link>
            <a
              :href="'https://mobile.twitter.com/' + ticket.twitter"
              target="_blank"
              :class="{ long: ticket.twitter.length > 15, too_long: ticket.twitter.length > 19 }"
              class="twitter-label"
            >
              @{{ ticket.twitter }}
            </a>
          </div>
        </div>
      </div>
      {{ selected }}
      <div class="searchbar">
        <b-autocomplete
          v-model="searchValue"
          :data="filteredDataArray"
          :placeholder="$t('operation_text4')"
          clearable
          rounded
          @select="option => { searchBarselected(option) }"
        >
          <template #empty>
            No results found
          </template>
        </b-autocomplete>
      </div>
    </div>

    <b-field class="lang-gage">
      <b-slider
        v-model="language"
        :min="0"
        :max="9"
        :tooltip="true"
        tooltip-type="is-info is-light"
        :custom-formatter="sliderFormatter"
        indicator
        tooltip-always
      />
    </b-field>

    <div class="globe-btn" @click="changeLang">
      <b-icon
        pack="fa-solid"
        icon="globe"
        size="is-large"
        type="is-info"
      />
    </div>

    <div class="info-btn">
      <b-dropdown
        aria-role="list"
      >
        <template #trigger>
          <b-icon
            pack="fa-solid"
            icon="circle-info"
            size="is-large"
            type="is-info"
          />
        </template>
        <b-dropdown-item aria-role="listitem" @click="helpHowToUse">
          <div class="media">
            <b-icon class="media-left" icon="information-outline" />
            <div class="media-content">
              <h3>{{ $t('help_text3') }}</h3>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div v-if="!returnMode" class="hero2">
      <div class="hero--overlay">
        <div class="hero--content" />
      </div>
    </div>
    <img v-if="!returnMode" class="anime-image" src="/tickets.png" :style="{display: offIcon}">

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
          <div class="close-icon" @click="showCarousel = false">
            <b-icon
              pack="fa-solid"
              icon="xmark"
              size="is-large"
            />
          </div>
        </section>
      </b-carousel-item>
    </b-carousel>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'

export default {
  name: 'IndexPage',
  data () {
    return {
      tickets: [],
      colors: { Finance: 'color1', Music: 'color3', Other: 'color7' },
      toolList: ['Zoom', 'Instagram', 'Discord', 'Teams', 'Google Meet', 'Ticket website', 'YouTube', 'Any tool', 'On-site'],
      language: 0,
      languageList: ['en', 'es', 'fr', 'zh', 'ar', 'pt', 'ja', 'de', 'ko', 'all'],
      isTapped: false,
      isTappedReset: null,
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
      searchLists: [],
      searchValue: '',
      ticketsBkup: [],
      selected: null,
      loadingTime: 0,
      returnMode: location.search === '?return=true',
      offIcon: null
    }
  },
  computed: {
    filteredDataArray () {
      if (this.searchValue === '' && this.tickets.length !== this.ticketsBkup.length) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.tickets = []
        // eslint-disable-next-line vue/no-async-in-computed-properties
        setTimeout(() => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.tickets = this.ticketsBkup
        })
      }
      return this.searchLists.filter((value) => {
        return value
          .toString()
          .toLowerCase()
          .includes(this.searchValue.toLowerCase())
      })
    }
  },
  async mounted () {
    const timerID = setInterval(() => {
      this.loadingTime += 200
    }, 200)
    this.language = this.languageList.indexOf(this.$i18n.locale)
    await this.getTickets()
    clearInterval(timerID)
  },
  methods: {
    sliderFormatter (val) {
      return this.languageList[val] || 'en'
    },
    changeLang () {
      clearTimeout(this.isTappedReset)
      if (this.isTapped === true) {
        this.language = this.language > 8 ? 0 : this.language + 1
      }
      this.isTapped = true
      this.isTappedReset = setTimeout(() => {
        this.isTapped = false
      }, 3000)
    },
    helpHowToUse () {
      this.showCarousel = true
    },
    carouselChange (value) {
      if (value >= 9) {
        setTimeout(() => {
          this.showCarousel = false
        }, 3000)
      }
    },
    async getTickets () {
      try {
        const tickets = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getTickets),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        this.$store.commit('updateTickets', tickets) // save tickets
        for (let i = 0; i < tickets.length; i++) {
          const ticket = tickets[i]
          if (ticket.name) {
            const where = ticket.where_to_use.split('||')
            let detail = ''
            let tool = ''
            if (where.length === 2) {
              tool = where[0]
              detail = where[1]
            } else if (where.length > 2) {
              tool = where[0]
              detail = ''
              for (let i = 1; i < where.length; i++) {
                detail = detail + (i === 1 ? '' : '||') + where[i]
              }
            }
            const when = ticket.when_to_use.split('||')
            let datetime = ''
            if (when.length >= 2) {
              datetime = new Date(when[1]).toLocaleString().replace(/(:\d{2}):00/, '$1') + ` ${this.$t('ticket_text6')} `
            }

            const ticketName = ticket.name.split('||@')
            if (ticketName[0].length) {
              let type = this.toolList[parseInt(tool) - 1] || ''
              if (type === 'Ticket website') {
                type = this.$t('ticket_text2')
              } else if (type === 'Any tool') {
                type = this.$t('ticket_text3')
              } else if (type === 'On-site') {
                type = this.$t('ticket_text4')
              }
              if (this.returnMode === true) {
                this.loadingTime = 1500
              }
              setTimeout(() => {
                const data = {
                  path: ticket.domain,
                  label: ticketName[0],
                  twitter: ticketName.length === 2 ? ticketName[1] : '',
                  description: detail,
                  price: ticket.price.replace(/\.?0+$/, ''),
                  datetime,
                  style: 'color' + (7 % (parseInt(tool) - 1) + 1).toString(),
                  type
                }
                this.tickets.push(data)
                this.ticketsBkup.push(data)
                this.offIcon = 'none'
              }, 60 * i + (1500 - this.loadingTime))
            }
          }
        }
        // 検索リスト
        tickets.forEach((ticket) => {
          const ticketName = ticket.name.split('||@')[0]
          if (!this.searchLists.includes(ticketName)) {
            this.searchLists.push(ticketName)
          }
        })
        tickets.forEach((ticket) => {
          const ticketName = ticket.name.split('||@')
          if (ticketName.length === 2) {
            const twitterAccount = '@' + ticketName[1]
            if (!this.searchLists.includes(twitterAccount)) {
              this.searchLists.push(twitterAccount)
            }
          }
        })
      } catch (e) {
      }
    },
    searchBarselected (selected) {
      if (selected) {
        this.tickets = []
        this.ticketsBkup.forEach((ticket) => {
          if (ticket.label === selected) {
            this.tickets.push(ticket)
          } else if (ticket.twitter === selected.substr(1)) {
            this.tickets.push(ticket)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

* {
  box-sizing: border-box;
}

.section {
  height: calc(100vh - 60px);
  padding: 1.5rem 0.3rem 0 2.5rem;
  max-width: 750px;
  margin: 0 auto;
  position: relative;

  .lang-gage {
    position: absolute;
    top: 100px;
    z-index: 1;
    width: 0;
    left: 24px;
  }

  .globe-btn {
    position: absolute;
    z-index: 1;
    top: 110px;
    left: 0%;
  }

  .info-btn {
    position: absolute;
    z-index: 1;
    top: 43px;
    left: 0%;

    .has-text-info {
      color: aliceblue !important;
      background-color: inherit;
    }
  }

  .ticket-list {
    width: 100%;
    max-width: 685px;
    height: calc(100vh - 100px);
    margin: 0 auto;
      background: #596470;
    border-radius: 30px;
    border: 5px solid rgba(1, 1, 1, .2);
    position: relative;
    overflow: hidden;
  }

  .header {
    color: white;
    display: flex;
    display: none;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    background-color:#b00c0c80;

    div {
      padding: 0 15px;

      i {
        font-size: 12px;
      }
      label {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 13px;
      }
    }
  }

  .searchbar {
    width: 100%;
    transform: translateY(21px);
    position: relative;

    .control {
      width: 90%;
      font-family: 'Roboto', sans-serif;
      outline: none;
      border: none;
      border-radius: 40px;
      margin: auto;
      display: block;
      -webkit-box-shadow: 0px 3px 10px -2px #cccccc;
      box-shadow: 0px 3px 10px -2px #cccccc;
    }
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    overflow: auto;
    top: 75px;
    padding-top: 20px;
    background-color: white;
    bottom: 0;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;

    &::-webkit-scrollbar {
      display: none;
    }

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      margin: 10px 5px;
      color: white;
      align-items: stretch;
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
      border-top-right-radius: 50px;
      border-bottom-right-radius: 50px;
      -webkit-box-shadow:  -1px 1px 15px -8px #acacac;
      box-shadow:  -1px 1px 15px -8px #acacac;
      padding: 10px;
    }

    div:not(.hidden) {
      animation: comeOn .5s linear forwards;
    }

    div.hidden {
      animation: comeOut .5s linear forwards;
    }

    div.hidden-full {
      display: none;
    }

    .ticket-card {
      min-height: 92px;

      .identity_block {
        flex: 2;
        color: black;
        font-size: 15px;
        font-family: 'Roboto', sans-serif;
        font-style: italic;
        line-height: 98%;
        padding-bottom: 5px;

        & > span{
          color: gray;
          font-size: 12px;
          display: inline-block;
        }

        & > i {
          color: gray;
          font-size: 8px;
        }

        & > label {
          text-align: left;
          display: inline-block;
          padding-right: 7px;
          padding-bottom: 3px;
        }
      }
    }

    .price {
      margin-left: 3px;
    }

    .datetime {
      color: #7957d5;
      margin-left: 6px;
    }

    .twitter-label {
      color: #48c78e!important;
      position: absolute;
      bottom: 10px;
      left: 130px;
      font-weight: bold;
      text-decoration: underline;
      font-size: 14px;

      &.long {
        font-size: 14px;
        &.too_long {
          font-size: 11px;
        }
      }
    }

    .icon_block {
      display: inline-block;
      color: white;
      min-width: 100px;
      max-width: 129px;
      border-radius: 5px;
      padding: 0 3px 3px 3px;
      margin-top: 4px;

      &.color1 {
        background-color: rgb(135, 67, 86);
      }

      &.color2 {
        background-color: rgb(198, 93, 123);
      }

      &.color3 {
        background-color: rgb(246, 137, 137);
      }

      &.color4 {
        background-color: rgb(246, 231, 216);
        color: #333;
      }

      &.color5 {
        background-color: rgb(247, 204, 172);
        color: #333;
      }

      &.color6 {
        background-color: rgb(198, 155, 123);
        color: #333;
      }

      &.color7 {
        background-color: rgb(130, 111, 102);
      }
    }

    @keyframes comeOn {
      0% {
        transform: translateX(-50px);
        opacity: 0;
      }
      80% {
        transform: translateX(10px);
        opacity: 1;
      }
      100% {
        transform: translateX(0px);
        opacity: 1;
      }
    }

    @keyframes comeOut {
      0% {
        transform: translateX(0px);
        opacity: 1;
      }
      20% {
        transform: translateX(10px);
        opacity: 1;
      }
      100% {
        transform: translateX(-50px);
        opacity: 0;
      }
    }
  }
}

.carousel {
  position: absolute;
  z-index: 100;
  top: 2px;
  left: 0;
  width: 100%;
  height: 100%;

  .carousel-item {
    height: 91vh;
  }

  .close-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #666;
    .icon {
      background-color: inherit;
    }
  }
}

.hero2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 3;
  animation: fadeOut 2.1s linear forwards;
}

.hero--overlay {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-image: linear-gradient(180deg, rgba(0,0,0,1), #1b1c50);
  background-size: cover;
  z-index: 2;
}

.hero--content {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: #dadff4;
}

.hero--bottom {
  width: 100%;
  height: 50vh;
  background-color: #1c1c1c;
  background-image: linear-gradient(0deg, rgba(0,0,0,.3), #1b1c50);
}

.anime-image {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  margin: 0 auto;
  z-index: 5;
  animation: fadeOut2 1.6s linear forwards;
}

@keyframes fadeOut {
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  80% {
    transform: translateY(0px);
    opacity: 0.9;
  }
  100% {
    transform: translateY(-150vh);
    opacity: 0.4;
  }
}

@keyframes fadeOut2 {
  0% {
    opacity: 0;
  }
  8% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  80% {
    opacity: 0.6;
  }
  100% {
    opacity: 0.0;
  }
}

@media screen and (min-width: 750px) {
  .hero2 {
    left: -50%;
    width: 200%;
  }
}

</style>
