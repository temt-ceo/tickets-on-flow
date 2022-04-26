<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div v-if="isCompleteDispense" class="text-wrap">
        <p class="complete-register">
          チケットの配布を行いました。<br>
          配布完了までに約10秒、時間がかかります。<br>
          「トランザクションを確認」をクリックして表示された画面でSEALEDと表示された後、<br>
          配布されたチケットが表示されます。
        </p>
        <p
          v-if="transactionScanUrl !== ''"
          class="check-transaction"
        >
          <a :href="transactionScanUrl" target="_blank" class="scanlink">Confirm the transaction</a>
        </p>
      </div>
      <div class="text-wrap">
        List of ticket applicants
        <br>
        <b-button
          @click="dispenseTicket"
          :disabled="checkedRows.length === 0"
          type="is-link"
        >
          Distribute
        </b-button>
        <br>
      </div>
      <b-table
        :data="ticketRequesterArray"
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
          field="user_id"
          label="user ID"
          width="40"
          numeric
          v-slot="props"
        >
          {{ props.row.user_id }}
        </b-table-column>

        <b-table-column
          field="count"
          label="Request Count"
          v-slot="props"
        >
          {{ props.row.count }}
        </b-table-column>

        <b-table-column
          field="paid"
          label="Total Payments"
          v-slot="props"
        >
          {{ new Number(props.row.paid).toFixed(2) }}
        </b-table-column>

        <b-table-column
          field="latest_token"
          label="Last issued token ID"
          v-slot="props"
        >
          {{ props.row.latest_token }}
        </b-table-column>

        <b-table-column
          field="time"
          label="Request Date"
          :th-attrs="dateThAttrs"
          centered
          v-slot="props"
        >
          <span class="tag is-success">
            {{ new Date(parseInt(props.row.time) * 1000).toLocaleDateString() }} {{ new Date(parseInt(props.row.time) * 1000).toLocaleTimeString() }}
          </span>
        </b-table-column>
        <template #empty>
          <div class="has-text-centered">No records</div>
        </template>
      </b-table>
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
    dispenser: {
      type: Number,
      required: true,
      default: null
    }
  },
  data () {
    return {
      ticketRequesters: {},
      ticketRequesterArray: [],
      ticketName: '',
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
    await this.confirmRequesters()
  },
  methods: {
    async confirmRequesters () {
      try {
        const ticketRequesters = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getTicketRequesters),
            this.$fcl.args([
              this.$fcl.arg(this.address, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        console.log(ticketRequesters, 88888)
        this.ticketRequesters = ticketRequesters
        const keys = Object.keys(ticketRequesters)
        for (let i = 0; i < keys.length; i++) {
          this.ticketRequesterArray.push(ticketRequesters[keys[i]])
        }
        this.$forceUpdate()
      } catch (e) {
      }
    },
    dispenseTicket () {
      try {
        this.$buefy.dialog.prompt({
          message: 'Enter the dispenser_id in the text box below',
          inputAttrs: {
            type: 'text',
            placeholder: 'e.g. 100',
            maxlength: 10
          },
          trapFocus: true,
          onConfirm: async (code) => {
            // loading
            const loadingComponent = this.$buefy.loading.open({
              container: null
            })
            setTimeout(() => loadingComponent.close(), 3 * 1000)

            const bcode = 'elffab' + code.toString().split('').reverse().join('') + '@tickets-on-flow.web.app'
            const transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(FlowTransactions.dispenseTicket),
                this.$fcl.args([
                  this.$fcl.arg(bcode, this.$fclArgType.String),
                  this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
                  this.$fcl.arg(this.checkedRows, this.$fclArgType.Array(this.$fclArgType.AnyStruct))
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
      font-size: 24px;
      margin: 16px;

      p {
        color: #222;
        margin: 8px 0;
      }

      h2 {
        font-size: 18px;
      }
    }

    .check-transaction {
      text-align : center;
      margin-top: 16px;

      a {
        color: purple;
        font-size: 14px;
        text-decoration: underline;
      }
    }
  }
}
</style>
