<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div v-if="isCompleteDispense" class="text-wrap">
        <p class="complete-register">
          Tickets were distributed.<br>
          It takes about 10 seconds to complete registration.<br>
          After clicking "Confirm the transaction" and seeing the word SEALED on the screen,<br>
          A button of "Use a ticket" will appear on the customer's screen.
        </p>
        <p
          v-if="transactionScanUrl !== ''"
          class="check-transaction"
        >
          <a :href="transactionScanUrl" target="_blank" class="scanlink">Confirm the transaction</a>
        </p>
      </div>
      <div v-if="!isCompleteDispense">
        <div class="button-wrap">
          <b-button
            :disabled="checkedRows.length === 0"
            type="is-info"
            @click="dispenseTicket"
          >
            Distribute tickets
          </b-button>
          <span class="total-count">(Total issues: {{ latestMintedTokenId }} tickets)</span>
          <br>
        </div>
        <b-table
          :data="ticketRequesters"
          :checked-rows.sync="checkedRows"
          :is-row-checkable="(row) => row.id !== 3 && row.id !== 4"
          checkable
          :checkbox-position="checkboxPosition"
          :checkbox-type="checkboxType"
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
            label="user ID"
            width="40"
            numeric
          >
            {{ props.row.user_id }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="count"
            label="Request Count"
          >
            {{ props.row.count }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="paid"
            label="Total Payments"
          >
            {{ new Number(props.row.paid).toFixed(2) }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="latest_token"
            label="Last issued token ID"
          >
            {{ props.row.latest_token }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="time"
            label="Request Date"
            :th-attrs="dateThAttrs"
            centered
          >
            <span class="tag is-success">
              {{ new Date(parseInt(props.row.time) * 1000).toLocaleDateString() }} {{ new Date(parseInt(props.row.time) * 1000).toLocaleTimeString() }}
            </span>
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">
              No request yet.
            </div>
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'

export default {
  name: 'TicketConfirmModal',
  props: {
    address: {
      type: String,
      required: true,
      default: ''
    },
    ticketRequesters: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      ticketName: '',
      latestMintedTokenId: null,
      transactionScanUrl: '',
      isCompleteRegister: false,
      flowscanLink: 'https://testnet.flowscan.org/transaction',
      isCompleteDispense: false,
      checkedRows: [],
      checkboxPosition: 'left',
      checkboxType: 'is-primary',
      isBordered: false,
      isStriped: false,
      isNarrowed: false,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: true
    }
  },
  async mounted () {
    try {
      const latestMintedTokenId = await this.$fcl.send(
        [
          this.$fcl.script(FlowScripts.getLatestMintedTokenId),
          this.$fcl.args([
            this.$fcl.arg(this.address, this.$fclArgType.Address)
          ])
        ]
      ).then(this.$fcl.decode)
      this.latestMintedTokenId = latestMintedTokenId || 0
    } catch (e) {
    }
  },
  methods: {
    dispenseTicket () {
      try {
        this.$buefy.dialog.prompt({
          message: 'Enter the information you want to put on the screen for the customer who used the ticket.',
          inputAttrs: {
            type: 'text',
            placeholder: 'e.g. 100',
            maxlength: 50
          },
          trapFocus: true,
          onConfirm: async (code) => {
            // loading
            const loadingComponent = this.$buefy.loading.open({
              container: null
            })
            setTimeout(() => loadingComponent.close(), 3 * 1000)

            const bcode = 'elffab' + code.toString().split('').reverse().join('') + '@tickets-on-flow.web.app'
            const addrList = []
            for (let i = 0; i < this.checkedRows.length; i++) {
              addrList.push({ key: parseInt(this.checkedRows[i].user_id), value: this.checkedRows[i].address })
            }
            const transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(FlowTransactions.dispenseTicket),
                this.$fcl.args([
                  this.$fcl.arg(addrList, this.$fclArgType.Dictionary({ key: this.$fclArgType.UInt32, value: this.$fclArgType.Address })),
                  this.$fcl.arg(bcode, this.$fclArgType.String)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
            this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
            this.isCompleteDispense = true
          }
        })
      } catch (e) {
      }
    },
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
      color: #222;
      margin: 16px;

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
      color: #222;

      .total-count {
        font-size: 14px;
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
