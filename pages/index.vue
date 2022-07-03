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
      <div class="content top-list">
        <div
          v-for="(ticket, index) in tickets"
          :key="index"
          class="ticket-card"
          :class="{'short-card': ticket.type === 'stats'}"
        >
          <div class="c-contact">
            <nuxt-link :to="'/ti/' + ticket.path">
              <div class="identity_block fa-3x">
                <label>{{ ticket.label }}</label>
                <i class="fa-solid fa-heart fa-beat" style="--fa-animation-duration: 0.5s;" /><br>
                <span>{{ ticket.description }}</span>
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
                v-if="ticket.type !== 'Crowdfunding' && ticket.type !== 'stats'"
                :class="ticket.style"
                class="icon_block"
              >
                {{ $t('ticket_text1') }}:<br><label>{{ ticket.type }}</label>
              </div>
            </nuxt-link>
            <nuxt-link :to="'/ti/' + ticket.path">
              <div class="price">
                <span v-if="ticket.type !== 'Crowdfunding' && ticket.type !== 'stats'">$FLOW: {{ ticket.price }}</span>
                <span v-if="ticket.type === 'Crowdfunding'" class="datetime2">{{ ticket.datetime }}</span>
              </div>
            </nuxt-link>
            <a
              v-if="ticket.type !== 'stats'"
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
        <b-dropdown-item aria-role="listitem" @click="showCarousel4 = true">
          <div class="media">
            <b-icon class="media-left" size="is-small" pack="fad" icon="question" />
            <div class="media-content">
              <h3>{{ $t('ticket_text79') }}</h3>
            </div>
          </div>
        </b-dropdown-item>
        <b-dropdown-item aria-role="listitem" @click="showCarousel = true">
          <div class="media">
            <b-icon class="media-left" size="is-small" pack="fad" icon="question" />
            <div class="media-content">
              <h3>{{ $t('ticket_text78') }}</h3>
            </div>
          </div>
        </b-dropdown-item>
        <b-dropdown-item aria-role="listitem" @click="showCarousel2 = true">
          <div class="media">
            <b-icon class="media-left" size="is-small" pack="fad" icon="question" />
            <div class="media-content">
              <h3>{{ $t('ticket_text76') }}</h3>
            </div>
          </div>
        </b-dropdown-item>
        <b-dropdown-item aria-role="listitem" @click="showCarousel3 = true">
          <div class="media">
            <b-icon class="media-left" size="is-small" pack="fad" icon="question" />
            <div class="media-content">
              <h3>{{ $t('ticket_text77') }}</h3>
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
    <img v-if="!returnMode" class="anime-image" src="/chainwork-top.png" :style="{display: offIcon}" >
    <small class="bottom-copyright">&copy; Tokyo EM Technology & Co.</small>
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
    >
      <b-carousel-item v-for="(carousel, i) in carousels" :key="i">
        <section :class="`hero is-medium is-${carousel.color}`">
          <div class="hero-body has-text-centered">
            <h2 style="margin-bottom: 10px;">
              {{ carousel.text }}
            </h2>
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
    >
      <b-carousel-item v-for="(carousel, i) in carousels2" :key="i">
        <section :class="`hero is-medium is-${carousel.color}`">
          <div class="hero-body has-text-centered">
            <h2 style="margin-bottom: 10px;">
              {{ carousel.text }}
            </h2>
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
    <b-carousel
      v-if="showCarousel3"
      :arrow="carouselArrow"
      :arrow-hover="carouselArrowHover"
      :autoplay="carouselAutoPlay"
      :repeat="carouselRepeat"
      :interval="carouselInterval"
      :indicator="carouselIndicator"
      :indicator-inside="carouselInside"
      :indicator-style="carouselIndicatorStyle"
    >
      <b-carousel-item v-for="(carousel, i) in carousels3" :key="i">
        <section :class="`hero is-medium is-${carousel.color}`">
          <div class="hero-body has-text-centered">
            <h2 style="margin-bottom: 10px;">
              {{ carousel.text }}
            </h2>
            <img
              :src="carousel.image"
              alt="Tickets Manual"
              style="max-height: 400px;"
            >
          </div>
          <div class="close-icon" @click="showCarousel3 = false">
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
      v-if="showCarousel4"
      :arrow="carouselArrow"
      :arrow-hover="carouselArrowHover"
      :autoplay="carouselAutoPlay"
      :repeat="carouselRepeat"
      :interval="carouselInterval"
      :indicator="carouselIndicator"
      :indicator-inside="carouselInside"
      :indicator-style="carouselIndicatorStyle"
    >
      <b-carousel-item v-for="(carousel, i) in carousels4" :key="i">
        <section :class="`hero is-medium is-${carousel.color}`">
          <div class="hero-body has-text-centered">
            <h2 style="margin-bottom: 10px;">
              {{ carousel.text }}
            </h2>
            <img
              :src="carousel.image"
              alt="Tickets Manual"
              style="max-height: 400px;"
            >
          </div>
          <div class="close-icon" @click="showCarousel4 = false">
            <b-icon
              pack="fa-solid"
              icon="xmark"
              size="is-large"
            />
          </div>
        </section>
      </b-carousel-item>
    </b-carousel>

    <b-modal
      v-model="isComponentModalActive"
      has-modal-card
      full-screen
      :can-cancel="false"
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <img
            src="~assets/image/chainwork.png"
            alt="Chain Work"
            style="width: 100px;"
          >
          <br>
          <img
            src="~assets/image/tickets.png"
            alt="Tickets"
            style="width: 70px; margin-left: 20px;"
          >
          <b-steps
            v-model="activeStep"
            position="is-left"
            size="is-small"
            :animated="true"
            :rounded="true"
            :has-navigation="true"
            label-position="bottom"
            :mobile-mode="null"
            vertical
            class="step-center"
          >
            <b-step-item step="1" label="" type="is-success">
              <h1 class="title has-text-centered">
                It's how your phone should work.
              </h1>
              <h1 class="title has-text-centered">
                Fast.&nbsp;Secure.&nbsp;Simple.
              </h1>
            </b-step-item>

            <b-step-item step="2" label="01" type="is-success">
              <h1 class="title has-text-centered">
                It's fast.
              </h1>
              <h1 class="title has-text-centered">
                Send a cryptocurrency in seconds.
              </h1>
            </b-step-item>

            <b-step-item step="3" label="02" type="is-success">
              <h1 class="title has-text-centered">
                It's secure.
              </h1>
              <h1 class="title has-text-centered">
                Trusted by transactions on Flow Blockchain.
              </h1>
            </b-step-item>

            <b-step-item step="4" label="03" type="is-success" disabled>
              <h1 class="title has-text-centered">
                It's easy.
              </h1>
              <h1 class="title has-text-centered">
                Make business with just three taps.
              </h1>
            </b-step-item>

            <template
              #navigation="{previous, next}"
            >
              <div class="modal-card-link" v-if="next.disabled">
                <nuxt-link to="/youtube-contents/">
                  {{ $t('terms_of_use67') }}
                </nuxt-link>
              </div>
              <footer class="modal-card-foot">
                <div style="width: 75%; margin-left: 22%;">
                  <b-button
                    outlined
                    icon-pack="fas"
                    icon-left="backward"
                    :disabled="previous.disabled"
                    @click.prevent="previous.action"
                  />
                  <b-button
                    outlined
                    type="is-success"
                    icon-pack="fas"
                    icon-right="forward"
                    :disabled="next.disabled"
                    @click.prevent="next.action"
                  />
                  <b-button
                    type="is-text"
                    :label="$t('operation_text44')"
                    style="margin-left: 18px; padding: 0;"
                    @click="isComponentModalActive = false"
                  />
                </div>
              </footer>
            </template>
          </b-steps>
        </section>
      </div>
    </b-modal>
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
      showCarousel3: false,
      showCarousel4: false,
      carouselArrow: true,
      carouselArrowHover: false,
      carouselAutoPlay: true,
      carouselRepeat: false,
      carouselInterval: 15000,
      carouselIndicator: true,
      carouselInside: true,
      carouselIndicatorStyle: 'is-lines',
      carousels: [
        { text: `Step 1. ${this.$t('ticket_text58')}`, image: '/image/help_slide_1_en.png', color: 'success' },
        { text: `Step 2. ${this.$t('ticket_text72')}`, image: '/image/help_slide_15_en.png', color: 'success' }
      ],
      carousels2: [
        { text: `Step 1. ${this.$t('ticket_text59')}`, image: '/image/help_slide_2_en.png', color: 'info' },
        { text: `Step 2. ${this.$t('ticket_text60')}`, image: '/image/help_slide_3_en.png', color: 'info' },
        { text: `Step 3. ${this.$t('ticket_text61')}`, image: '/image/help_slide_4_en.png', color: 'info' },
        { text: `Step 4. ${this.$t('ticket_text62')}`, image: '/image/help_slide_5_en.png', color: 'info' },
        { text: `Step 5. ${this.$t('ticket_text63')}`, image: '/image/help_slide_6_en.png', color: 'info' },
        { text: `Step 6. ${this.$t('ticket_text64')}`, image: '/image/help_slide_7_en.png', color: 'info' },
        { text: `Step 7. ${this.$t('ticket_text65')}`, image: '/image/help_slide_8_en.png', color: 'info' },
        { text: `Step 8. ${this.$t('ticket_text66')}`, image: '/image/help_slide_9_en.png', color: 'info' },
        { text: `Step 9. ${this.$t('ticket_text67')}`, image: '/image/help_slide_10_en.png', color: 'info' },
        { text: `Step 10. ${this.$t('ticket_text68')}`, image: '/image/help_slide_11_en.png', color: 'success' }
      ],
      carousels3: [
        { text: `Step 1. ${this.$t('ticket_text69')}`, image: '/image/help_slide_12_en.png', color: 'warning' },
        { text: `Step 2. ${this.$t('ticket_text70')}`, image: '/image/help_slide_13_en.png', color: 'success' },
        { text: `Step 3. ${this.$t('ticket_text71')}`, image: '/image/help_slide_14_en.png', color: 'warning' }
      ],
      carousels4: [
        { text: `Step 1. ${this.$t('ticket_text73')}`, image: '/image/help_slide_16_en.png', color: 'primary' },
        { text: `Step 2. ${this.$t('ticket_text74')}`, image: '/image/help_slide_17_en.png', color: 'info' },
        { text: `Step 3. ${this.$t('ticket_text75')}`, image: '/image/help_slide_18_en.png', color: 'success' }
      ],
      searchLists: [],
      searchValue: '',
      ticketsBkup: [],
      selected: null,
      loadingTime: 0,
      returnMode: location.search === '?home',
      offIcon: null,
      isComponentModalActive: false,
      activeStep: 0,
      defaultLang: this.$i18n.locale,
      langStatClearTimeoutID: null
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
  watch: {
    activeStep: {
      handler (val) {
        if (val === 3) {
          setTimeout(() => {
            if (this.activeStep === 3) {
              this.isComponentModalActive = false
            }
          }, 7000)
        }
      }
    }
  },
  async mounted () {
    this.language = this.languageList.indexOf(this.$i18n.locale)
    if (this.language < 0) {
      this.language = 9 // リストの中に無ければallを選択
    }

    // animation
    if (!this.returnMode) {
      setTimeout(() => {
        this.isComponentModalActive = true
      }, 2800)
    }

    const timerID = setInterval(() => {
      this.loadingTime += 200
    }, 200)
    await this.getTickets()
    clearInterval(timerID)
    await this.getStats()
  },
  methods: {
    sliderFormatter (val) {
      return this.languageList[val] || 'en'
    },
    async changeLang () {
      clearTimeout(this.isTappedReset)
      if (this.isTapped === true) {
        this.language = this.language > 8 ? 0 : this.language + 1
      }
      this.isTapped = true
      this.isTappedReset = setTimeout(() => {
        this.isTapped = false
      }, 5000)
      const language = this.languageList[this.language]
      this.$i18n.setLocale(language)
      await this.getTickets(true)
      clearTimeout(this.langStatClearTimeoutID)
      await this.getStats()
    },
    async getTickets (withoutApi) {
      try {
        let tickets = []
        if (withoutApi) {
          tickets = this.$store.state.tickets
          this.tickets = []
          this.ticketsBkup = []
          this.searchLists = []
        } else {
          tickets = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getTickets),
              this.$fcl.args([
              ])
            ]
          ).then(this.$fcl.decode)
          this.$store.commit('updateTickets', tickets) // save tickets
        }
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
              if (parseInt(ticket.type) === 1) {
                datetime = `${this.$t('ticket_text56')} ` + new Date(parseInt(when[1])).toLocaleString().replace(/(:\d{2}):00/, '$1')
              } else {
                datetime = new Date(parseInt(when[1])).toLocaleString().replace(/(:\d{2}):00/, '$1') + ` ${this.$t('ticket_text6')} `
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
              if (parseInt(ticket.type) === 1) {
                type = 'Crowdfunding'
                tool = 1
              } else {
                tool = 4 // チケットも色固定
              }
              if (this.returnMode === true || withoutApi === true) {
                this.loadingTime = 1500
              }
              setTimeout(() => {
                let ticketTitle = null
                let ticketDescription = null
                switch (ticket.domain) {
                  case 'zm':
                    ticketTitle = this.$t('special_title1')
                    ticketDescription = this.$t('special_description1')
                    break
                  case 'zmi':
                    ticketTitle = this.$t('special_title2')
                    ticketDescription = this.$t('special_description2')
                    break
                  default:
                    break
                }

                const data = {
                  path: ticket.domain,
                  label: ticketTitle || ticketName[0], // 多言語対応
                  is_multilingual: ticketTitle !== null,
                  twitter: ticketName.length === 2 ? ticketName[1] : '',
                  description: ticketDescription || detail, // 多言語対応
                  price: ticket.price.replace(/\.?0+$/, ''),
                  datetime,
                  style: 'color' + (parseInt(tool) % 7 + 1).toString(),
                  type
                }
                const language = this.languageList[this.language]
                if (language === when[2] || data.is_multilingual || language === 'all') {
                  this.tickets.push(data)
                  this.ticketsBkup.push(data)
                }
                this.offIcon = 'none'
                // 検索リスト
                if (!this.searchLists.includes(data.label)) {
                  this.searchLists.push(data.label)
                }
                if (!this.searchLists.includes(data.twitter)) {
                  this.searchLists.push(data.twitter)
                }
                if (i === tickets.length - 1 && withoutApi) {
                  this.$i18n.setLocale(this.defaultLang) // 言語を元に戻す
                }
              }, 60 * i + (1500 - this.loadingTime))
            }
          }
        }
      } catch (e) {
      }
    },
    async getStats () {
      try {
        const stats = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getStats),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        if (Object.keys(stats).length > 0) {
          this.langStatClearTimeoutID = setTimeout(() => {
            const data = {
              path: 'our_stats',
              label: this.$t('operation_text55'),
              twitter: '',
              description: this.$t('operation_text66'),
              price: '',
              datetime: '',
              style: 'color1',
              type: 'stats'
            }
            // const arr = this.tickets
            // this.tickets = []
            this.tickets.unshift(data)
            // arr.forEach((obj) => {
            //   this.tickets.push(obj)
            // })

            this.ticketsBkup.unshift(data)
          }, 3000)
        }
      } catch (e) {
      }
    },
    searchBarselected (selected) {
      if (selected) {
        this.tickets = []
        this.ticketsBkup.forEach((ticket) => {
          if (ticket.label === selected) {
            this.tickets.push(ticket)
          } else if (ticket.label_search === selected) {
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
    top: 112px;
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
    max-width: 785px;
    height: calc(100vh - 70px);
    margin: 0 auto;
    // background: #596470;
    background: hsla(240, 100%, 50%, 0.1);
    border-radius: 30px;
    // border: 5px solid rgba(1, 1, 1, .2);
    border: 2px solid rgba(255, 255, 5, 0.7);
    position: relative;
    overflow: hidden;
  }

  .content.top-list {
    background-image: linear-gradient(to top left, honeydew 0%, snow 35%, honeydew 100%);
    padding-top: 5px;
    top: 65px;
    margin-bottom: 0.3rem;
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
    transform: translateY(16px);
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
      background-color: white;

      &.short-card {
        min-height: 40px;
      }

      .identity_block {
        flex: 2;
        color: black;
        font-size: 15px;
        font-family: 'Roboto', sans-serif;
        font-style: italic;
        line-height: 99%;
        padding-bottom: 4px;

        & > span{
          color: gray;
          font-size: 12px;
          display: inline-block;
        }

        & > i {
          color: gray;
          font-size: 8px;
          vertical-align: 2px;
        }

        & > label {
          text-align: left;
          // display: inline-block;
          padding-right: 3px;
          padding-bottom: 3px;
        }
      }
    }

    .datetime {
      color: #7957d5;
      margin-left: 6px;
    }

    .datetime2 {
      color: #7957d5;
    }

    .price {
      margin-left: 3px;
      position: absolute;
      min-width: 170px;
      bottom: 24px;
      left: 127px;
    }

    .twitter-label {
      color: #48c78e!important;
      position: absolute;
      bottom: 2px;
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

.modal-card-body {
  .title {
    font-size: 1.8rem;
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
  background-image: radial-gradient(rgb(65,105,225), #1b1c50);
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
  background-image: radial-gradient(rgb(65,105,225), #1b1c50);
}

.anime-image {
  position: absolute;
  width: 79%;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  margin: 0 auto;
  z-index: 5;
  animation: fadeOut2 1.6s linear forwards;
}

.step-center {
  position: absolute;
  top: 43%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  max-width: 485px;
  min-width: 350px;
}

.modal-card-link {
  width: 100%;
  position: absolute;
  top: 45vh;
  font-size: 18px;
  text-decoration: underline;
  text-align: center;
  background: none;
}

.modal-card-foot {
  width: 100%;
  position: absolute;
  top: 58vh;
  text-align: center;
  background: none;
}

.bottom-copyright {
  display: none;
  position: absolute;
  bottom: 3px;
  left: 65px;
  color: wheat;
  font-size: 8px;
}

@keyframes fadeOut {
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  80% {
    transform: translateY(0px);
    opacity: 1;
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
    opacity: 0.7;
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

  .bottom-copyright {
    display: block;
  }

  .section {
    .ticket-list {
      border: 4px solid rgba(255, 255, 255, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }

    .content.top-list {
      margin-bottom: 1.3rem;
    }

    .globe-btn {
      top: 100px;
    }

    .info-btn {
      top: 35px;
    }
  }
}

@media screen and (max-width: 750px) {
  .section {
    padding: 0.6rem 0.3rem 0 2.5rem;
  }
}

</style>
