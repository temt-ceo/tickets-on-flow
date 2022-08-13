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
                <span style="padding-top: 2px">{{ ticket.description }}</span>
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
              <span style="font-size: 10px;">{{ $t('ticket_text5') }}:</span><br>
              <span>@{{ ticket.twitter }}</span>
            </a>
            <div
              v-if="ticket.type !== 'stats'"
              class="upvote-div"
              style="position: absolute; right: 40px; bottom: 13px; color: #c8c8c8;"
              @click="clickTicketConfirmIcon(ticket)"
            >
              {{ upvoteCounts ? upvoteCounts[ticket.addr] : 0 }} upvotes
            </div>
            <div
              v-if="ticket.type !== 'stats'"
              class="comment-div"
              style="position: absolute; right: 12px; bottom: 5.5px; color: #c8c8c8;"
              @click="clickTicketConfirmIcon(ticket)"
            >
              <b-icon
                pack="fa-regular"
                icon="comment"
                size="is-medium"
                style="font-size: 0.8em; max-width: 8px;"
              />
              {{ commentCounts ? commentCounts[ticket.addr] : 0 }}
            </div>
            <span
              v-if="ticket.type !== 'stats'"
              style="position: absolute; right: 36px; bottom: -12px;"
              @click="clickTicketConfirmIcon(ticket)"
            >
              <b-icon
                pack="fa-solid"
                icon="circle-info"
                type="is-success"
                size="is-medium"
                style="font-size: 1.1em;"
              />
            </span>
            <span
              v-if="ticket.type !== 'stats' && ticket.doUkrainianSupport"
              style="position: absolute; right: 15px; bottom: -7px; font-size: 1.15em;"
              @click="clickTicketConfirmIcon(ticket)"
            >
              🇺🇦
            </span>
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
        <b-dropdown-item aria-role="listitem" @click="showCarousel5 = true">
          <div class="media">
            <b-icon class="media-left" size="is-small" pack="fad" icon="question" />
            <div class="media-content">
              <h3>{{ $t('ticket_text79') }} ⑴</h3>
            </div>
          </div>
        </b-dropdown-item>
        <b-dropdown-item aria-role="listitem" @click="showCarousel4 = true">
          <div class="media">
            <b-icon class="media-left" size="is-small" pack="fad" icon="question" />
            <div class="media-content">
              <h3>{{ $t('ticket_text79') }} ⑵</h3>
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
    <div v-if="showTutorial === true" class="fa-3x tutorial-man">
      <i class="uil uil-user" />
    </div>
    <div v-if="showTutorial === true">
      <b-notification
        v-model="tutorial.manActive"
        :closable="false"
        class="tutorial-man-text"
        :message="tutorial.messageMan"
        :type="tutorial.messageTypeMan"
      />
    </div>
    <div v-if="showTutorial === true" class="fa-3x tutorial-woman">
      <i class="uil uil-user" />
    </div>
    <div v-if="showTutorial === true">
      <b-notification
        v-model="tutorial.womanActive"
        :closable="false"
        class="tutorial-woman-text"
        :message="tutorial.messageWoman"
        :type="tutorial.messageTypeWoman"
      />
    </div>
    <div v-if="showTutorial === true && tutorial.showArrow === true" class="fa-3x tutorial-arrow">
      <i class="uil uil-location-arrow" />
    </div>

    <b-dropdown
      style="position: absolute; bottom: 80px; left: 8px;"
      aria-role="list"
      class="is-pulled-right telegram"
      position="is-top-right"
    >
      <template #trigger>
        <div class="fa-2x">
          <i
            class="fa-solid fa-tree fa-beat"
            style="color: #48c78e; --fa-beat-scale: 0.9; --fa-animation-duration: 1.2s;"
          />
        </div>
      </template>
      <p class="green-explanation">
        {{ $t('operation_text140') }}🌳🌳
      </p>
      <b-dropdown-item aria-role="listitem">
        <a
          :href="url.eco"
          target="_blank"
        >
          Results of Deloitte Canada's Assessment Survey
        </a>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem">
        <a
          :href="url.twitter"
          target="_blank"
        >
          Official Mini Video
        </a>
      </b-dropdown-item>
      <hr>
      <p class="green-explanation">
        {{ $t('operation_text141') }}🌳🌳
      </p>
      <b-dropdown-item aria-role="listitem">
        <a
          :href="url.environment"
          target="_blank"
        >
          {{ $t('operation_text142') }}
        </a>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem">
        <a
          :href="url.press"
          target="_blank"
        >
          {{ $t('operation_text143') }}
        </a>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem">
        <a
          :href="url.press2"
          target="_blank"
        >
          {{ $t('operation_text144') }}
        </a>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem">
        <a
          :href="url.press3"
          target="_blank"
        >
          Tickets are free to create and sell for life!🌳🌳
        </a>
      </b-dropdown-item>
      <b-dropdown-item aria-role="listitem">
        <nuxt-link to="/ti/multi">
          {{ $t('operation_text145') }}
        </nuxt-link>
      </b-dropdown-item>
    </b-dropdown>

    <div class="fa-2x" style="position: absolute; bottom: 16px; left: 4px;">
      <i
        class="fa-solid fa-heart fa-beat"
        style="color: #feecf0; --fa-beat-scale: 0.9; --fa-animation-duration: 1.2s;"
        @click="imageModal"
      />
    </div>
    <div v-if="!returnMode && isPc" class="hero2">
      <div class="hero--overlay">
        <div class="hero--content" />
      </div>
    </div>
    <img v-if="!returnMode" class="anime-image" src="/TicketsOnchain.png" :style="{display: offIcon}">
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
    <b-carousel
      v-if="showCarousel5"
      :arrow="carouselArrow"
      :arrow-hover="carouselArrowHover"
      :autoplay="carouselAutoPlay"
      :repeat="carouselRepeat"
      :interval="carouselInterval"
      :indicator="carouselIndicator"
      :indicator-inside="carouselInside"
      :indicator-style="carouselIndicatorStyle"
    >
      <b-carousel-item v-for="(carousel, i) in carousels5" :key="i">
        <section :class="`hero is-medium is-${carousel.color}`">
          <div class="hero-body has-text-centered">
            <h2 style="margin-bottom: 10px;">
              {{ carousel.text1 }}
            </h2>
            <h2 v-if="carousel.text2" style="margin-bottom: 10px;">
              {{ carousel.text2 }}
            </h2>
            <h2 v-if="carousel.text3">
              {{ carousel.text3 }}
            </h2>
          </div>
          <div class="close-icon" @click="showCarousel5 = false">
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
            src="~assets/image/TicketsOnchain.png"
            alt="Tickets Onchain"
            style="width: 165px;"
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
              <div v-if="next.disabled" class="modal-card-link">
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
    <b-modal
      v-model="isImageModalActive"
    >
      <div class="image">
        <img :src="modalImageSrc" style="height: 100%;">
        <div style="max-width: 760px; margin: 0 auto; text-align: center;">
          <button class="custom-btn btn-11" style="bottom: 50px;" @click="nextMange">
            {{ $t('ticket_text45') }}
          </button>
        </div>
      </div>
    </b-modal>
    <b-modal v-model="showConfirmModal">
      <check-ticket-modal
        :ticket="ticketModalInfo"
        :ticketWhen0="ticketModalWhenWeek"
        :ticket-title="ticketModalTitle"
        :ticket-description="ticketModalDescription"
        :no-login="false"
        :key="commentUpdateKey"
        @closeModal="showConfirmModal=false"
        @eventname="nextMove"
        @updateComment="resetModal"
      />
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import CheckTicketModal from '~/components/common/CheckTicketModal'

export default {
  name: 'IndexPage',
  components: {
    CheckTicketModal
  },
  data () {
    return {
      tickets: [],
      colors: { Finance: 'color1', Music: 'color3', Other: 'color7' },
      toolList: ['Zoom', 'Instagram', 'Discord', 'Teams', 'Google Meet', 'Ticket website', 'YouTube', 'Any tool', 'On-site'],
      language: 0,
      languageList: ['en', 'es', 'fr', 'zh', 'ar', 'pt', 'ja', 'de', 'all', 'uk'],
      isTapped: false,
      isTappedReset: null,
      showCarousel: false,
      showCarousel2: false,
      showCarousel3: false,
      showCarousel4: false,
      showCarousel5: false,
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
        { text: this.$t('ticket_text73'), image: '/image/help_slide_16_en.png', color: 'success' },
        { text: this.$t('ticket_text74'), image: '/image/help_slide_17_en.png', color: 'success' },
        { text: this.$t('ticket_text75'), image: '/image/help_slide_18_en.png', color: 'success' }
      ],
      carousels5: [
        { text1: this.$t('operation_text151'), text2: this.$t('operation_text152'), text3: this.$t('operation_text153'), color: 'success' },
        { text1: this.$t('operation_text154'), text2: this.$t('operation_text155'), text3: this.$t('operation_text156'), color: 'success' },
        { text1: this.$t('operation_text157'), text2: this.$t('operation_text158'), text3: null, color: 'success' },
        { text1: this.$t('operation_text159'), text2: this.$t('operation_text160'), text3: null, color: 'success' }
      ],
      searchLists: [],
      searchValue: '',
      ticketsBkup: [],
      selected: null,
      loadingTime: 0,
      returnMode: location.search === '?home',
      isPc: window.innerWidth > 1240,
      offIcon: null,
      isComponentModalActive: false,
      activeStep: 0,
      defaultLang: this.$i18n.locale,
      langStatClearTimeoutID: null,
      statsInfo: null,
      showTutorial: false,
      tutorial: {
        messageMan: this.$t('operation_text45'),
        manActive: true,
        messageWoman: this.$t('operation_text45'),
        womanActive: false,
        messageCnt: 0,
        messageTypeMan: 'is-info is-light',
        messageTypeWoman: '',
        showArrow: false
      },
      isImageModalActive: false,
      mangaCount: 0,
      modalImageSrc: '',
      url: {
        twitter: 'https://twitter.com/flow_blockchain/status/1517541363193065472',
        eco: 'https://www.onflow.org/post/flow-blockchain-sustainability-energy-deloitte-report-nft',
        environment: 'https://www.bloomberg.com/news/features/2022-07-14/heat-waves-in-europe-show-danger-of-turning-from-climate-goals-to-coal-power',
        press: 'https://prtimes.jp/main/html/rd/p/000000001.000104644.html#p-iframe-image-48622-1',
        press2: 'https://prtimes.jp/main/html/rd/p/000000001.000104644.html#p-iframe-image-52730-1',
        press3: 'https://prtimes.jp/main/html/rd/p/000000001.000104644.html#p-iframe-image-21174-1'
      },
      showConfirmModal: false,
      ticketModalInfo: {},
      ticketModalWhenWeek: '',
      ticketModalTitle: '',
      ticketModalDescription: '',
      commentUpdateKey: 0,
      allMessages: null,
      commentCounts: null,
      upvoteCounts: null,
      totalTicketCount: 0
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
      }, 3900)
    }

    const timerID = setInterval(() => {
      this.loadingTime += 200
    }, 200)
    this.readCommentCounts()
    await this.getTickets()
    clearInterval(timerID)
    await this.getStats()

    // preload Images
    const h = this.$createElement
    h('img', { attrs: { src: 'https://tickets-onchain.com/image/manga_03.png' } })
    h('img', { attrs: { src: 'https://tickets-onchain.com/image/manga_04.png' } })
    h('img', { attrs: { src: 'https://tickets-onchain.com/image/manga_01.png' } })
    h('img', { attrs: { src: 'https://tickets-onchain.com/image/manga_02.png' } })
  },
  methods: {
    imageModal () {
      this.isImageModalActive = true
      this.mangaCount = 0
      this.modalImageSrc = 'https://tickets-onchain.com/image/manga_03.png'
    },
    nextMange () {
      this.mangaCount++
      switch (this.mangaCount) {
        case 1:
          this.modalImageSrc = 'https://tickets-onchain.com/image/manga_04.png'
          break
        case 2:
          this.modalImageSrc = 'https://tickets-onchain.com/image/manga_01.png'
          break
        case 3:
          this.modalImageSrc = 'https://tickets-onchain.com/image/manga_02.png'
          break
        default:
          this.isImageModalActive = false
          this.modalImageSrc = 'https://tickets-onchain.com/image/manga_03.png'
      }
    },
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
      await this.getTickets(true)
    },
    clickTicketConfirmIcon (ticket) {
      const tickets = JSON.parse(JSON.stringify(this.$store.state.tickets))
      this.ticketModalInfo = tickets.find(obj => obj.domain === ticket.path)
      switch (this.ticketModalInfo.domain) {
        case 'zm':
          this.ticketModalTitle = this.$t('special_title1')
          this.ticketModalDescription = this.$t('special_description1')
          break
        case 'zmi':
          this.ticketModalTitle = this.$t('special_title2')
          this.ticketModalDescription = this.$t('special_description2')
          break
        case 'multi':
          this.ticketModalTitle = this.$t('special_title3')
          this.ticketModalDescription = this.$t('special_description3') + ' DM if you\'re interested.'
          break
        case 'detail':
          this.ticketModalTitle = this.$t('special_title4')
          this.ticketModalDescription = this.$t('special_description4') + ' DM if you\'re interested.'
          break
        default:
          this.ticketModalTitle = ''
          this.ticketModalDescription = ''
          break
      }
      this.showConfirmModal = true
    },
    async readCommentCounts () {
      try {
        const messages = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getMessages),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        this.allMessages = messages
      } catch (e) {
      }
    },
    showCommentCounts (tickets) {
      if (this.allMessages) {
        this.commentCounts = {}
        this.upvoteCounts = {}
        tickets.forEach((ticket) => {
          const when = ticket.when_to_use.split('||')
          this.commentCounts[when[4]] = this.allMessages[when[4]] ? this.allMessages[when[4]].got_comments?.filter(obj => obj.comment !== '').length : '0'
          this.upvoteCounts[when[4]] = this.allMessages[when[4]] ? this.allMessages[when[4]].got_upvote : '0'
        })
      } else {
        setTimeout(() => {
          this.showCommentCounts(tickets)
        }, 1000)
      }
    },
    resetModal () {
      this.commentUpdateKey += 1
    },
    nextMove () {
      this.showConfirmModal = false
      location.href = '/ti/' + this.ticketModalInfo.domain + '?learn-more=true'
    },
    async getTickets (withoutApi) {
      try {
        let tickets = []
        if (withoutApi) {
          tickets = JSON.parse(JSON.stringify(this.$store.state.tickets))
          tickets.sort((ticketA, ticketB) => {
            if (ticketA.domain === 'zm' && ticketB.domain === 'zmi') {
              return -1
            } else if (ticketA.domain === 'zmi' && ticketB.domain === 'zm') {
              return 1
            }
            return Math.random() - 0.5
          })
          this.tickets = []
          this.ticketsBkup = []
          this.searchLists = []
          if (this.statsInfo) {
            setTimeout(() => {
              this.tickets.push(this.statsInfo)
              this.ticketsBkup.push(this.statsInfo)
            }, 60)
          }
        } else {
          tickets = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getTickets),
              this.$fcl.args([
              ])
            ]
          ).then(this.$fcl.decode)
          tickets.sort((ticketA, ticketB) => {
            if (ticketA.domain === 'zm' && ticketB.domain === 'zmi') {
              return -1
            } else if (ticketA.domain === 'zmi' && ticketB.domain === 'zm') {
              return 1
            }
            return Math.random() - 0.5
          })
          this.totalTicketCount = tickets.length
          this.showCommentCounts(tickets)
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
            let doUkrainianSupport = false
            if (when.length >= 2) {
              if (parseInt(ticket.type) === 1) {
                datetime = `${this.$t('ticket_text56')} ` + new Date(parseInt(when[1])).toLocaleDateString().replace(/(:\d{2}):00/, '$1')
              } else {
                datetime = new Date(parseInt(when[1])).toLocaleString().replace(/(:\d{2}):00/, '$1') + ` ${this.$t('ticket_text6')} `
              }
              doUkrainianSupport = when.length >= 6 && when[5].length > 0
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
                  case 'multi':
                    ticketTitle = this.$t('special_title3')
                    ticketDescription = this.$t('special_description3') + ' DM if you\'re interested.'
                    break
                  case 'detail':
                    ticketTitle = this.$t('special_title4')
                    ticketDescription = this.$t('special_description4') + ' DM if you\'re interested.'
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
                  type,
                  doUkrainianSupport,
                  addr: when[4]
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
              }, 60 * (i + 2) + (1500 - this.loadingTime))
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
            // this.tickets.unshift(data)
            this.statsInfo = data
            this.getTickets(true)
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
          } else if (ticket.twitter === selected) {
            this.tickets.push(ticket)
          }
        })
      }
    },
    startTutorial () {
      this.tutorial.messageCnt = 0
      this.tutorial.messageMan = this.$t('ticket_text82')
      this.tutorial.manActive = true
      this.tutorial.womanActive = false
      this.tutorial.showArrow = false
      this.tutorial.messageTypeMan = 'is-info is-light'
      this.tutorial.messageTypeWoman = ''
      this.showTutorial = !this.showTutorial
    },
    forwardTutorial () {
      this.tutorial.messageCnt++
      switch (this.tutorial.messageCnt) {
        case 1:
          this.tutorial.womanActive = false
          this.tutorial.messageWoman = this.$t('ticket_text83')
          this.showTutorialPopup('woman')
          break
        case 2:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text84')
          this.showTutorialPopup('man')
          break
        case 3:
          this.tutorial.womanActive = false
          this.tutorial.messageWoman = this.$t('ticket_text85')
          this.showTutorialPopup('woman')
          break
        case 4:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text86')
          this.showTutorialPopup('man')
          break
        case 5:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text87')
          this.showTutorialPopup('man')
          break
        case 6:
          this.tutorial.womanActive = false
          this.tutorial.messageWoman = this.$t('ticket_text88')
          this.tutorial.messageTypeWoman = 'is-warning is-light'
          this.showTutorialPopup('woman')
          break
        case 7:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text89')
          this.tutorial.messageTypeMan = 'is-success is-light'
          this.showTutorialPopup('man')
          break
        case 8:
          this.tutorial.womanActive = false
          this.tutorial.messageWoman = this.$t('ticket_text90')
          this.showTutorialPopup('woman')
          break
        case 9:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text91')
          this.showTutorialPopup('man')
          break
        case 10:
          this.tutorial.womanActive = false
          this.tutorial.messageWoman = this.$t('ticket_text92')
          this.showTutorialPopup('woman')
          break
        case 11:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text93')
          this.showTutorialPopup('man')
          break
        case 12:
          this.tutorial.womanActive = false
          this.tutorial.messageWoman = this.$t('ticket_text94')
          this.showTutorialPopup('woman')
          break
        case 13:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text95')
          this.showTutorialPopup('man')
          break
        case 14:
          this.tutorial.womanActive = false
          this.tutorial.messageWoman = this.$t('ticket_text96')
          this.showTutorialPopup('woman')
          break
        case 15:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text97')
          this.tutorial.showArrow = true
          this.showTutorialPopup('man')
          break
        case 16:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text98')
          this.showTutorialPopup('man')
          break
        case 17:
          this.tutorial.manActive = false
          this.tutorial.messageMan = this.$t('ticket_text99')
          this.tutorial.showArrow = false
          this.showTutorialPopup('man')
          break
        case 18:
          this.tutorial.womanActive = false
          this.tutorial.messageWoman = this.$t('ticket_text100')
          this.showTutorialPopup('woman')
          break
        case 19:
          this.tutorial.messageCnt = 0
          this.showTutorial = false
          break
      }
    },
    showTutorialPopup (which) {
      setTimeout(() => {
        if (which === 'man') {
          this.tutorial.manActive = true
        } else if (which === 'woman') {
          this.tutorial.womanActive = true
        }
      }, 250)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "https://unicons.iconscout.com/release/v2.1.11/css/unicons.css";

* {
  box-sizing: border-box;
}

.section {
  height: calc(100vh - 53px);
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

  .tutorial-man {
    position: absolute;
    z-index: 1;
    bottom: 380px;
    left: -11px;
    color: #3e8ed0;
  }

  .tutorial-man-text {
    position: absolute;
    z-index: 1;
    width: 83vw;
    height: 212px;
    bottom: 292px;
    left: 46px;
    color: #3e8ed0;
    font-size: 12.5px;
    padding-right: 1rem;
    border-radius: 30px;
  }

  .tutorial-woman {
    position: absolute;
    z-index: 1;
    bottom: 200px;
    left: -11px;
    color: #f14668;
  }

  .tutorial-woman-text {
    position: absolute;
    z-index: 1;
    width: 83vw;
    height: 145px;
    bottom: 145px;
    left: 46px;
    color: #f14668;
    font-size: 12.5px;
    padding-right: 1rem;
    border-radius: 30px;
  }

  .turorial-next {
    margin-left: 74vw;
    color: #f14668;
  }

  .tutorial-arrow {
    position: absolute;
    z-index: 100;
    top: -35px;
    left: 76vw;
    color: #cc0f35;
  }

  .ticket-list {
    width: 100%;
    max-width: 785px;
    height: calc(100vh - 70px);
    margin: 0 auto;
    // background: #596470;
    background: rgba(255, 255, 255, 0.1);
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
      font-size: 10.5px;
    }

    .price {
      margin-left: 3px;
      position: absolute;
      min-width: 170px;
      bottom: 25px;
      left: 127px;
    }

    .twitter-label {
      color: #48c78e!important;
      position: absolute;
      bottom: 0px;
      line-height: 1.1;
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
      padding: 1px 3px 3px 5px;
      margin-top: 2px;

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
  background-image: radial-gradient(rgb(104, 141, 252), #1b1c50);
}

.anime-image {
  position: absolute;
  width: 53%;
  top: 48%;
  left: 55%;
  transform: translateX(-50%) translateY(-50%);
  margin: 0 auto;
  z-index: 5;
  animation: fadeOut2 2.1s linear forwards;
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

.green-explanation {
  margin: 10px 15px;
  text-decoration: underline;
  text-shadow: 0 0.2px 0.8px #257953;
}

@keyframes fadeOut {
  0% {
    transform: translateY(0px);
  }
  92% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-150vh);
  }
}

@keyframes fadeOut2 {
  0% {
    opacity: 0;
  }
  6% {
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  99% {
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
    .content.top-list {
      margin-bottom: 1.3rem;
    }

    .globe-btn {
      top: 100px;
    }

    .info-btn {
      top: 35px;
    }

    .turorial-next {
      margin-left: 53vw;
    }

    .tutorial-man-text {
      width: 33vw;
    }

    .tutorial-woman-text {
      width: 33vw;
    }

    .tutorial-arrow {
      left: 63vw;
    }

    .upvote-div {
      right: 146px !important;
      bottom: -3px !important;
    }

    .comment-div {
      right: 112px !important;
      bottom: -10px !important;
    }
  }
}

@media screen and (max-width: 750px) {
  .section {
    padding: 0.6rem 0.3rem 0 2.5rem;
  }
}

.custom-btn {
  min-width: 130px;
  height: 40px;
  color: #fff;
  font-size: 0.8rem;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
   box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),
   7px 7px 20px 0px rgba(0,0,0,.1),
   4px 4px 5px 0px rgba(0,0,0,.1);
  outline: none;
}

.btn-11 {
  border: none;
  background: rgb(251,33,117);
  background: linear-gradient(0deg, rgba(251,33,117,1) 0%, rgba(234,76,137,1) 100%);
  color: #fff;
  overflow: hidden;
}
.btn-11:hover {
    text-decoration: none;
    color: #fff;
}
.btn-11:before {
    position: absolute;
    content: '';
    display: inline-block;
    top: -180px;
    left: 0;
    width: 30px;
    height: 100%;
    background-color: #fff;
    animation: shiny-btn 10s ease-in-out infinite;
}
.btn-11:hover{
  opacity: .7;
}
.btn-11:active{
  box-shadow:  4px 4px 6px 0 rgba(255,255,255,.3), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255,255,255,.2), inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
}

@keyframes shiny-btn {
    0% { -webkit-transform: scale(0) rotate(45deg); opacity: 0; }
    90% { -webkit-transform: scale(0) rotate(45deg); opacity: 0.5; }
    91% { -webkit-transform: scale(4) rotate(45deg); opacity: 1; }
    100% { -webkit-transform: scale(50) rotate(45deg); opacity: 0; }
}

</style>
