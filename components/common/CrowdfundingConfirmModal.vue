<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="text-wrap">
        Your Funds.
      </div>
      <div>
        <b-table
          :data="ticketRequesters"
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
            field="user_id"
            label="User ID"
            width="40"
            numeric
          >
            {{ props.row.user_id }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="address"
            label="Wallet Address"
            width="40"
            numeric
          >
            {{ props.row.address }}
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
              No Funds yet.
            </div>
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'CrowdfundingConfirmModal',
  props: {
    ticketRequesters: {
      type: Array,
      required: true
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
