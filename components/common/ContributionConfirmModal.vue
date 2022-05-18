<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="text-wrap">
        Your Contributions.
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
            label="Total"
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
      hasMobileCards: true
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
