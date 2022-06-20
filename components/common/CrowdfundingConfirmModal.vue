<template>
  <div class="modal-card user-data">
    <section class="modal-card-body">
      <div class="text-wrap" style="padding-left: 36px; text-align: center;">
        <span v-if="owner === 0">{{ $t('operation_text76') }}</span>
        <span v-if="owner === 1">{{ $t('hamburger_menu4') }}</span>
        <b-button v-if="owner === 0" class="download" type="is-light" icon-right="download" @click="csvDownload" />
      </div>
      <div>
        <b-table
          :data="ticketRequesters"
          :checked-rows.sync="checkedRows"
          :is-row-checkable="(row) => owner == 0 ? true : false"
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
            field="user_id"
            :label="$t('operation_text101')"
            width="40"
            numeric
          >
            {{ props.row.user_id }}
          </b-table-column>

          <b-table-column
            v-if="owner === 0"
            v-slot="props"
            field="address"
            label="Wallet Address"
            width="40"
            numeric
          >
            {{ props.row.address }}
          </b-table-column>

          <b-table-column
            v-if="owner === 0"
            v-slot="props"
            field="count"
            label="Count"
          >
            {{ props.row.count }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="paid"
            :label="$t('operation_text106')"
          >
            {{ new Number(props.row.paid).toFixed(2) }} $FLOW
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="time"
            label="Paid Date"
            :th-attrs="dateThAttrs"
            centered
          >
            <span v-if="owner === 0" class="tag is-success" @click="showSchedule(props.row.time)">
              {{ new Date(parseInt(props.row.time) * 1000).toLocaleDateString() }} {{ new Date(parseInt(props.row.time) * 1000).toLocaleTimeString() }}
            </span>
            <span v-if="owner === 1">
              {{ new Date(parseInt(props.row.time) * 1000).toLocaleDateString() }} {{ new Date(parseInt(props.row.time) * 1000).toLocaleTimeString() }}
            </span>
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">
              No funds yet.
            </div>
          </template>
        </b-table>
        <hr>
        <b-pagination
          v-if="isPaginate"
          v-model="current"
          total="100"
          :range-before="rangeBefore"
          :range-after="rangeAfter"
          size="is-small"
          :simple="isSimple"
          :rounded="isRounded"
          :per-page="perPage"
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
  name: 'CrowdfundingConfirmModal',
  props: {
    ticketRequesters: {
      type: Array,
      required: true
    },
    owner: {
      type: Number,
      required: true,
      default: null
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
      isPaginate: false,
      current: 10,
      perPage: window.innerWidth < 768 ? 2 : 10,
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
            const paid = parseFloat(data.data?.paid).toFixed(2) + ' $FLOW'
            eventInfo += `User ${data.data?.user_id} supported ${paid}`
          })
          this.$buefy.toast.open({
            duration: 6000,
            message: eventInfo,
            type: 'is-link'
          })
        }
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
  methods: {
    showSchedule (date) {
      this.date = new Date(parseInt(date) * 1000)
      this.events = []
      this.ticketRequesters.forEach((obj) => {
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
      console.log(this.ticketRequesters, 888)
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'User Id, Wallet Address, Count, Amount, Datetime' + '\r\n'

      this.ticketRequesters.forEach((row) => {
        console.log(row)
        const datetime = new Date(parseInt(row.time) * 1000).toLocaleDateString() + ' ' + new Date(parseInt(row.time) * 1000).toLocaleTimeString()
        const rowArray = [row.user_id, row.address, row.count, parseFloat(row.paid).toFixed(2).toString() + ' FLOW', datetime]
        csvContent += rowArray.join(',') + '\r\n'
      })
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'your_funds.csv')
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
