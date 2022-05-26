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
                <span v-if="ticket.type !== 'Crowdfunding'">$FLOW: {{ ticket.price }}</span>
                <span v-if="ticket.type !== 'Crowdfunding'" class="datetime">({{ ticket.datetime }})</span>
                <span v-if="ticket.type === 'Crowdfunding'" class="datetime2">{{ ticket.datetime }}</span>
              </div>
              <div
                v-if="ticket.type === 'Crowdfunding'"
                :class="ticket.style"
                class="icon_block"
                style="padding: 11px 7px;"
              >
                <label>{{ ticket.type }}</label>
              </div>
              <div
                v-if="ticket.type !== 'Crowdfunding'"
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
        <b-dropdown-item aria-role="listitem" @click="showCarousel = true">
          <div class="media">
            <b-icon class="media-left" icon="information" />
            <div class="media-content">
              <h3>New! How to start crowdfunding!</h3>
            </div>
          </div>
        </b-dropdown-item>
        <b-dropdown-item aria-role="listitem" @click="showCarousel2 = true">
          <div class="media">
            <b-icon class="media-left" icon="information" />
            <div class="media-content">
              <h3>How to proceed with crowdfunding</h3>
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
    <b-carousel
      v-if="showCarousel2"
      :arrow="carouselArrow"
      :arrow-hover="carouselArrowHover"
      :autoplay="carouselAutoPlay"
      :repeat="carouselRepeat"
      :interval="carouselInterval"
      :indicator="carouselIndicator"
      :indicator-inside="carouselInside"
      :indicator-style="carouselIndicatorStyle"
      @change="carouselChange2($event)"
    >
      <b-carousel-item v-for="(carousel, i) in carousels2" :key="i">
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
          <div class="close-icon" @click="showCarousel2 = false">
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
      showCarousel2: false,
      carouselArrow: true,
      carouselArrowHover: false,
      carouselAutoPlay: true,
      carouselRepeat: false,
      carouselInterval: 7500,
      carouselIndicator: true,
      carouselInside: true,
      carouselIndicatorStyle: 'is-lines',
      carousels: [
        { text: 'Step 1. Tap Enable Button', image: '/image/help_slide_1_en.png', color: 'primary' },
        { text: 'Step 2. Type a little description', image: '/image/help_slide_2_en.png', color: 'info' },
        { text: 'Step 3. Decide your dedicated webpage name', image: '/image/help_slide_3_en.png', color: 'success' },
        { text: 'Step 4. Wait for the transaction to complete', image: '/image/help_slide_4_en.png', color: 'warning' },
        { text: 'Step 5. After the transaction is completed, wait up to 1 day for activation', image: '/image/help_slide_5_en.png', color: 'danger' },
        { text: 'Step 6. Tap Setting Button', image: '/image/help_slide_6_en.png', color: 'primary' },
        { text: 'Step 7. Enter a summary and wait for registration to complete.', image: '/image/help_slide_7_en.png', color: 'info' },
        { text: 'Step 8. Now your crowdfunding begins!', image: '/image/help_slide_8_en.png', color: 'success' },
        { text: 'Step 9. If you want to change from Crowdfunding to Tickets, leave the name empty.', image: '/image/help_slide_9_en.png', color: 'warning' },
        { text: 'Step 10. You can then also issue tickets.', image: '/image/help_slide_10_en.png', color: 'danger' }
      ],
      carousels2: [
        { text: 'Step 1. Tap Support Button', image: '/image/help_slide_11_en.png', color: 'primary' },
        { text: 'Step 2. Enter the amount in $FLOW', image: '/image/help_slide_12_en.png', color: 'info' },
        { text: 'Step 3. Proceed with the transaction', image: '/image/help_slide_13_en.png', color: 'success' },
        { text: 'Step 4. Wait for the transaction to complete', image: '/image/help_slide_14_en.png', color: 'warning' },
        { text: 'Step 5. After the transaction is completed, you can check the amount  by tapping the icon above.', image: '/image/help_slide_15_en.png', color: 'danger' },
        { text: 'Step 6.You can also view your ticket sales.', image: '/image/help_slide_16_en.png', color: 'primary' },
        { text: 'Step 7. You can also check the total amount on the Crowdfund web page.', image: '/image/help_slide_17_en.png', color: 'info' },
        { text: 'Step 8. The organizer will see your wallet address and the amount of your donation.', image: '/image/help_slide_18_en.png', color: 'success' }
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
    carouselChange (value) {
      if (value >= 9) {
        setTimeout(() => {
          this.showCarousel = false
        }, 7500)
      }
    },
    carouselChange2 (value) {
      if (value >= 7) {
        setTimeout(() => {
          this.showCarousel2 = false
        }, 7500)
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
              if (ticket.type === 1) {
                datetime = `${this.$t('ticket_text56')} ` + new Date(when[1]).toLocaleString().replace(/(:\d{2}):00/, '$1')
              } else {
                datetime = new Date(when[1]).toLocaleString().replace(/(:\d{2}):00/, '$1') + ` ${this.$t('ticket_text6')} `
              }
            }

            const ticketName = ticket.name.split('||@')
            if (ticketName[0].length) {
              let type = this.toolList[parseInt(tool) - 1] || ''
              // チケット
              if (type === 'Ticket website') {
                type = this.$t('ticket_text2')
              } else if (type === 'Any tool') {
                type = this.$t('ticket_text3')
              } else if (type === 'On-site') {
                type = this.$t('ticket_text4')
              }
              // Crowdfunding
              if (ticket.type === 1) {
                type = 'Crowdfunding'
                tool = 1
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
                  style: 'color' + (parseInt(tool) % 7 + 1).toString(),
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
  padding: 1.0rem 0.3rem 0 2.5rem;
  max-width: 750px;
  margin: 0 auto;
  position: relative;

  .c-contact {
    width: 100%;
  }

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
    height: calc(100vh - 70px);
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

    .datetime2 {
      color: #7957d5;
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
      min-width: 100px;
      max-width: 129px;
      border-radius: 5px;
      padding: 1px 3px 3px 3px;
      margin-top: 4px;

      &.color1 {
        background-color: rgb(135, 67, 86);
        color: white;
      }

      &.color2 {
        background-color: rgb(198, 93, 123);
        color: white;
      }

      &.color3 {
        background-color: rgb(246, 137, 137);
        color: white;
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
        background-color: rgb(130, 111, 102);
        color: white;
      }

      &.color7 {
        background-color: rgb(198, 155, 123);
        color: white;
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

@media screen and (max-width: 750px) {
  .section {
    padding: 0.6rem 0.3rem 0 2.5rem;
  }
}

</style>
