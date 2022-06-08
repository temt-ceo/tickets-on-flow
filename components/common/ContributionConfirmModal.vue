<template>
  <div class="modal-card user-data">
    <section class="modal-card-body">
      <div class="text-wrap">
        Your Contributions.
        <b-button @click="csvDownload" class="download" type="is-light" icon-right="download" />
      </div>
      <div>
        <b-table
          :data="ticketRequesterArray"
          :checked-rows.sync="checkedRows"
          :is-row-checkable="(row) => row.id !== 3 && row.id !== 4"
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
            label="Webpage"
            width="40"
            numeric
          >
            <a :href="'/ti/' + props.row.domain">{{ props.row.domain }}</a>
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="Name"
            label="Twitter ID"
            width="40"
            numeric
          >
            <a :href="'https://twitter.com/' + props.row.dispenser_name" target="_blank">@{{ props.row.dispenser_name }}</a>
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="count"
            label="Count"
          >
            {{ props.row.count }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="paid"
            label="Amount"
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
            <span class="tag is-success">
              {{ new Date(parseInt(props.row.time) * 1000).toLocaleDateString() }} {{ new Date(parseInt(props.row.time) * 1000).toLocaleTimeString() }}
            </span>
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">
              No Contributions yet.
            </div>
          </template>
        </b-table>
        <hr>
        <b-pagination
          v-if="isPaginate"
          total="100"
          v-model="current"
          :range-before="rangeBefore"
          :range-after="rangeAfter"
          size="is-small"
          :simple="isSimple"
          :rounded="isRounded"
          :per-page="perPage"
        >
        </b-pagination>
      </div>
    </section>
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
      isPaginate: false,
      current: 10,
      perPage: window.innerWidth < 768 ? 2 : 10,
      rangeBefore: 1,
      rangeAfter: 1,
      isSimple: false,
      isRounded: true
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
      this.ticketRequesterArray.push(
        {
          dispenser_name: ticketData ? ticketData.name.split('||@')[1] : key,
          domain: ticketData ? ticketData.domain : '',
          paid: data.paid,
          count: data.count,
          time: data.time
        }
      )
    })
  },
  methods: {
    dateThAttrs (column) {
      return column.label === 'Date' ? { class: 'has-text-success' } : null
    },
    csvDownload () {
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'Webpage, Organizer\'s Twitter Account, Count, Amount, Datetime' + '\r\n'

      this.ticketRequesterArray.forEach((row) => {
        const datetime = new Date(parseInt(row.time) * 1000).toLocaleDateString() + ' ' + new Date(parseInt(row.time) * 1000).toLocaleTimeString()
        const rowArray = ['https://tickets-on-flow.web.app/ti/' + row.domain, '@' + row.dispenser_name, row.count, parseFloat(row.paid).toFixed(2).toString() + ' FLOW', datetime]
        csvContent += rowArray.join(',') + '\r\n'
      })
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'funds.csv')
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
