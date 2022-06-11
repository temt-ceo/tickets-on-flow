<template>
  <div class="modal-card user-data">
    <section class="modal-card-body">
      <div class="text-wrap" style="padding-left: 36px;">
        {{ $t('operation_text75') }}
        <b-button @click="csvDownload" class="download" type="is-light" icon-right="download" />
      </div>
      <div v-if="isCompleteDispense" class="text-wrap">
        <b-message type="is-success" has-icon>
          Tickets were distributed.
          It takes about 10 seconds to complete.
          <b-skeleton size="is-large" :active="waitTransactionComplete" />
          <b-skeleton size="is-large" :active="waitTransactionComplete" />
          <b-skeleton size="is-large" width="60%" :active="waitTransactionComplete" />
        </b-message>
        <p
          v-if="transactionScanUrl !== ''"
          class="check-transaction"
        >
          <a :href="transactionScanUrl" target="_blank" class="scanlink">{{ $t('operation_text56') }}</a>
        </p>
      </div>
      <div v-if="!isCompleteDispense">
        <b-table
          :data="ticketRequesters"
          :checked-rows.sync="checkedRows"
          :is-row-checkable="(row) => row.latest_token == null"
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
        <div class="tablewrapper">
          <div class="table">
            <div class="row">
              <div class="cell rowspanned">
                <b-button
                  :disabled="checkedRows.length === 0"
                  type="is-info"
                  @click="dispenseTicket"
                >
                  {{ $t('operation_text77') }}
                </b-button>
              </div>
              <div class="cell">
                (Total issues: {{ latestMintedTokenId }} tickets)
              </div>
            </div>
          </div>
        </div>

        <div class="button-wrap">
          <span class="total-count"></span>
          <span class="total-count"></span>
        </div>
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
      peopleWaitingCount: 0,
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
      hasMobileCards: true,
      isPaginate: false,
      current: 10,
      perPage: window.innerWidth < 768 ? 2 : 10,
      rangeBefore: 1,
      rangeAfter: 1,
      isSimple: false,
      isRounded: true,
      waitTransactionComplete: false
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
      this.peopleWaitingCount = this.ticketRequesters.filter(data => data.latest_token == null).length
      console.log(this.peopleWaitingCount)
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
              addrList.push({ key: String(this.checkedRows[i].user_id), value: this.checkedRows[i].address })
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
            this.waitTransactionComplete = true
            this.isCompleteDispense = true
          }
        })
      } catch (e) {
      }
    },
    dateThAttrs (column) {
      return column.label === 'Date' ? { class: 'has-text-success' } : null
    },
    csvDownload () {
      console.log(this.ticketRequesters, 888)
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'User Id, Wallet Address, Count, Amount, Datetime' + '\r\n'

      this.ticketRequesters.forEach((row) => {
        const datetime = new Date(parseInt(row.time) * 1000).toLocaleDateString() + ' ' + new Date(parseInt(row.time) * 1000).toLocaleTimeString()
        const rowArray = [row.user_id, row.address, row.count, parseFloat(row.paid).toFixed(2).toString() + ' FLOW', datetime]
        csvContent += rowArray.join(',') + '\r\n'
      })
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'sales_list.csv')
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
      gap: 5px;
      flex-wrap: wrap;
      flex-direction: row-reverse;
      margin-left: 10px;
      color: #222;

      .total-count {
        font-size: 14px;
        padding: 0px 3px 0 0;
      }

      button.download {
        position: absolute;
        top: 3px;
        right: 0;
      }
    }

    th.checkbox-cell {
      margin-bottom: 0.5rem
    }

    .check-transaction {
      text-align : center;
      margin-top: 16px;

      a {
        font-size: 16px;
        text-decoration: underline;
      }
    }

    .tablewrapper {
      position: relative;
    }
    .table {
      display: table;
      position: relative
    }
    .row {
      display: table-row;
    }
    .cell {
      display: table-cell;
    }
    .cell.empty
    {
      border: none;
      width: 100px;
    }
    .cell.rowspanned {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100px;
    }
  }
}
</style>
