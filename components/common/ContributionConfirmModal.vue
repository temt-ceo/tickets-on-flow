<template>
  <div class="modal-card user-data">
    <section class="modal-card-body">
      <div class="text-wrap" style="padding-left: 36px;">
        {{ $t('operation_text74') }}
        <b-button class="download" type="is-light" icon-right="download" @click="csvDownload" />
      </div>
      <div>
        <b-table
          :data="displayTicketRequesters"
          :bordered="isBordered"
          :striped="isStriped"
          :narrowed="isNarrowed"
          :hoverable="isHoverable"
          :loading="isLoading"
          :focusable="isFocusable"
          :mobile-cards="hasMobileCards"
        >
          <b-table-column
            v-slot="props"
            field="Webpage"
            :label="$t('operation_text99')"
            width="40"
            numeric
          >
            <a :href="'/ti/' + props.row.domain">{{ props.row.domain }}</a>
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="twitterAccount"
            :label="$t('ticket_text5')"
            width="40"
            numeric
          >
            <a :href="'https://twitter.com/' + props.row.dispenser_name" target="_blank">@{{ props.row.dispenser_name }}</a>
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="time"
            :label="$t('operation_text100')"
            :th-attrs="dateThAttrs"
            centered
          >
            <span class="tag is-success" @click="showSchedule(props.row.time)">
              {{ new Date(parseInt(props.row.time) * 1000).toLocaleDateString() }} {{ new Date(parseInt(props.row.time) * 1000).toLocaleTimeString() }}
            </span>
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="paid"
            :label="$t('operation_text97')"
          >
            {{ new Number(props.row.paid).toFixed(2) }} $FLOW
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">
              No contributions yet.
            </div>
          </template>
        </b-table>
        <hr>
        <b-pagination
          v-if="ticketRequesterArray && ticketRequesterArray.length > this.perPage"
          v-model="current"
          :total="this.ticketRequesterArray.length"
          :range-before="rangeBefore"
          :range-after="rangeAfter"
          :simple="isSimple"
          :rounded="isRounded"
          :per-page="perPage"
          order="is-centered"
          size="is-small"
          class="userdata-pagination"
        />
      </div>
    </section>
    <b-datepicker
      v-if="showCalendar"
      v-model="date"
      inline
      :events="events"
      indicators="dots"
      style="position: absolute; width: 100%; top: 8%;"
    />
    <b-button v-if="showCalendar" type="is-danger" style="width: 350px; margin: 0 auto;" @click="hideSchedule">
      Close
    </b-button>
  </div>
</template>

<script>

export default {
  name: 'ContributionConfirmModal',
  props: {
    ticketRequesters: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      ticketRequesterArray: [],
      ticketName: '',
      latestMintedTokenId: null,
      transactionScanUrl: '',
      isCompleteRegister: false,
      flowscanLink: 'https://testnet.flowscan.org/transaction',
      checkedRows: [],
      isBordered: false,
      isStriped: false,
      isNarrowed: false,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: true,
      current: 1,
      perPage: window.innerWidth >= 768 ? 10 : 2,
      displayTicketRequesters: [],
      rangeBefore: 1,
      rangeAfter: 1,
      isSimple: false,
      isRounded: true,
      showCalendar: false,
      date: new Date(),
      events: []
    }
  },
  watch: {
    date: {
      handler (val) {
        const target = new Date(val)
        const events = this.events.filter((obj) => {
          return obj.date.toLocaleDateString() === target.toLocaleDateString()
        })
        if (events.length > 0) {
          let eventInfo = ''
          events.forEach((data) => {
            if (eventInfo !== '') {
              eventInfo += '<br>'
            }
            const date = new Date(data.data?.time * 1000)
            const localeTime = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
            eventInfo += `Your Contribution DateTime: ${localeTime}`
          })
          this.$buefy.toast.open({
            duration: 6000,
            message: eventInfo,
            type: 'is-link'
          })
        }
      }
    },
    current: {
      handler (val) {
        const position = this.perPage * (val - 1)
        this.displayTicketRequesters = this.ticketRequesterArray.slice(position, position + this.perPage)
      }
    }
  },
  computed: {
    tickets: {
      get () {
        return this.$store.state.tickets
      }
    }
  },
  mounted () {
    const keys = Object.keys(this.ticketRequesters)
    keys.forEach((key) => {
      const ticketData = this.tickets.find((ticket) => {
        return parseInt(ticket.dispenser_id) === parseInt(key)
      })
      const data = this.ticketRequesters[key]
      const when = ticketData.when_to_use.split('||')
      this.ticketRequesterArray.push(
        {
          dispenser_name: ticketData ? ticketData.name.split('||@')[1] : key,
          domain: ticketData ? ticketData.domain : '',
          paid: data.paid,
          count: data.count,
          endDate: when.length >= 2 ? new Date(parseInt(when[1])) : '',
          time: data.time
        }
      )
    })
    this.displayTicketRequesters = this.ticketRequesterArray.slice(0, this.perPage)
  },
  methods: {
    showSchedule (date) {
      this.date = new Date(parseInt(date) * 1000)
      this.events = []
      this.ticketRequesterArray.forEach((obj) => {
        const target = new Date(parseInt(obj.time) * 1000)
        this.events.push(
          {
            date: new Date(target),
            type: 'is-success',
            data: obj
          }
        )
      })
      this.showCalendar = true
    },
    hideSchedule () {
      this.showCalendar = false
    },
    dateThAttrs (column) {
      return column.label === 'Date' ? { class: 'has-text-success' } : null
    },
    csvDownload () {
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'Webpage, Organizer\'s Twitter Account, Count, Amount, Datetime' + '\r\n'

      this.ticketRequesterArray.forEach((row) => {
        const datetime = new Date(parseInt(row.time) * 1000).toLocaleDateString() + ' ' + new Date(parseInt(row.time) * 1000).toLocaleTimeString()
        const rowArray = ['https://chain-work.com/ti/' + row.domain, '@' + row.dispenser_name, row.count, parseFloat(row.paid).toFixed(2).toString() + ' FLOW', datetime]
        csvContent += rowArray.join(',') + '\r\n'
      })
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'your_contribution_list.csv')
      document.body.appendChild(link)
      link.click()
    }
  }
}
</script>

<style lang="scss" scoped>

.modal-card {
  width: auto;

  .modal-card-body {

    .text-wrap {
      margin: 16px;
      color: #222;

      p {
        margin: 8px 0;
      }

      h2 {
        font-size: 18px;
      }
    }

    a {
      text-decoration: underline;
    }

    .button-wrap {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      flex-direction: row-reverse;
      margin-left: 10px;

      .total-count {
        font-size: 12px;
        padding: 10px 3px 0 0;
      }
    }

    th.checkbox-cell {
      margin-bottom: 0.5rem
    }

    p.complete-register {
      font-weight: bold;
      font-size: 18px;
    }

    .check-transaction {
      text-align : center;
      margin-top: 16px;

      a {
        font-size: 16px;
        text-decoration: underline;
      }
    }
  }
}
</style>
