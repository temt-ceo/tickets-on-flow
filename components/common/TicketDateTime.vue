<template>
  <div v-if="ticketWhen0 && ticketWhen1" class="next-date">
    {{ ticketDateTime }}
  </div>
</template>

<script>

export default {
  name: 'TicketDateTime',
  props: {
    ticketWhen0: {
      type: String,
      required: true,
      default: ''
    },
    ticketWhen1: {
      type: String,
      required: true,
      default: ''
    },
    dispenser: {
      type: Number,
      required: true,
      default: null
    }
  },
  computed: {
    ticketTime: {
      get () {
        return this.$store.state.ticketTime
      }
    }
  },
  data () {
    return {
      ticketDateTime: null
    }
  },
  mounted () {
    const unixTime = parseInt((new Date(this.ticketWhen1).getTime() - new Date().getTime()) / 1000)
    const h = Math.floor(unixTime / 3600)
    const m = Math.floor(unixTime / 60 % 60)
    const day = new Date().getDay()
    const dayEvent = new Date(this.ticketWhen1)
    const dayEventDay = dayEvent.getDay()
    if (unixTime < 0) {
      // すでに過去のイベントの場合、6時間経過ずみで12時間後次のイベントの始まる曜日に変わるのであれば、
      const day2 = new Date(new Date().getTime() + 12 * 60 * 60 * 1000).getDay()
      if (h < -6 && (day !== dayEventDay || day !== day2)) {
        let nextDay = (day !== dayEventDay && h < -12) ? day : day2
        // Mondayを0にしたので合わせる
        nextDay = nextDay - 1 < 0 ? 6 : nextDay - 1
        const weekdays = this.ticketWhen0.split('').sort().join('')
        let match = false
        let nextDate = 0
        while (!match) {
          for (let i = 0; i < weekdays.length; i++) {
            const registeredDay = parseInt(weekdays.substr(i, 1))
            if (registeredDay === nextDay) {
              match = true
            }
          }
          nextDay = nextDay + 1 > 6 ? 0 : nextDay + 1
          if (nextDate > 6) {
            match = true // 繰り返しなし
          }
          if (!match) {
            nextDate++
          }
        }
        if (nextDate <= 6) {
          const nextEventDate = new Date(new Date().getTime() + nextDate * 24 * 60 * 60 * 1000)
          // ↓↓↓ nextEventが次のイベントの開始日
          const nextEvent = new Date(nextEventDate.getFullYear(), nextEventDate.getMonth(), nextEventDate.getDate(), dayEvent.getHours(), dayEvent.getMinutes(), dayEvent.getSeconds())
          const nextEventTime = parseInt(nextEvent.getTime() - new Date().getTime()) / 1000
          const hNext = Math.floor(nextEventTime / 3600)
          const mNext = Math.floor(nextEventTime / 60 % 60)
          // 保存データ
          let previousEventTime = null
          let hPrev = null
          let mPrev = null
          if (this.ticketTime[this.dispenser]) {
            previousEventTime = parseInt(this.ticketTime[this.dispenser] - new Date().getTime()) / 1000
            hPrev = 24 - Math.ceil(previousEventTime / 3600)
            mPrev = 60 - Math.ceil(previousEventTime / 60 % 60)
          }

          if (!hPrev || hPrev > 4) {
            switch (hNext) {
              case 0:
                this.ticketDateTime = `${this.$t('ticket_text12')} ${mNext} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
                break
              case 1:
                this.ticketDateTime = `${this.$t('ticket_text12')} ${hNext} ${this.$t('ticket_text8')} ${mNext} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
                break
              default:
                this.ticketDateTime = `${this.$t('ticket_text12')} ${hNext} ${this.$t('ticket_text9')} ${mNext} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
                break
            }
            this.ticketTime[this.dispenser] = nextEvent.getTime()
            this.$store.commit('updateTicketTime', this.ticketTime)
          } else {
            // 過去として表示
            switch (h) {
              case 0:
                this.ticketDateTime = `${this.$t('ticket_text11_2')} ${Math.abs(mPrev)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
                break
              case 1:
                this.ticketDateTime = `${this.$t('ticket_text11_2')} ${Math.abs(hPrev)} ${this.$t('ticket_text8')} ${Math.abs(mPrev)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
                break
              default:
                this.ticketDateTime = `${this.$t('ticket_text11_2')} ${Math.abs(hPrev)} ${this.$t('ticket_text9')} ${Math.abs(mPrev)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
                break
            }
          }
        }
      } else {
        // 過去として表示
        switch (h) {
          case 0:
            this.ticketDateTime = `${this.$t('ticket_text11_2')} ${Math.abs(m)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
            break
          case 1:
            this.ticketDateTime = `${this.$t('ticket_text11_2')} ${Math.abs(h)} ${this.$t('ticket_text8')} ${Math.abs(m)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
            break
          default:
            this.ticketDateTime = `${this.$t('ticket_text11_2')} ${Math.abs(h)} ${this.$t('ticket_text9')} ${Math.abs(m)} ${this.$t('ticket_text10')} ${this.$t('ticket_text11')}`
            break
        }
      }
    } else {
      // もうすぐ始まる
      switch (h) {
        case 0:
          this.ticketDateTime = `${this.$t('ticket_text12')} ${m} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
          break
        case 1:
          this.ticketDateTime = `${this.$t('ticket_text12')} ${h} ${this.$t('ticket_text8')} ${m} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
          break
        default:
          this.ticketDateTime = `${this.$t('ticket_text12')} ${h} ${this.$t('ticket_text9')} ${m} ${this.$t('ticket_text10')} ${this.$t('ticket_text13')}`
          break
      }
      this.ticketTime[this.dispenser] = new Date(this.ticketWhen1).getTime()
      this.$store.commit('updateTicketTime', this.ticketTime)
    }
  }
}
</script>

<style lang="scss" scoped>
  .next-date {
    color: #f14668;
    margin-top: 4px;
  }
</style>
