<template>
  <div class="modal-card user-data">
    <section class="modal-card-body">
      <div class="text-wrap" style="padding-left: 36px; text-align: center;">
        <span v-if="owner === 0">{{ $t('operation_text76') }}</span>
        <span v-if="owner === 1">{{ $t('hamburger_menu4') }}</span>
        <b-button v-if="owner === 0" class="download" type="is-light" icon-right="download" @click="csvDownload" />
      </div>
      <div v-if="isOngoingTransaction" class="text-wrap">
        <b-message type="is-success" has-icon>
          {{ $t('operation_text80') }}
        </b-message>
        <b-skeleton size="is-large" :active="waitTransactionComplete" />
        <b-skeleton size="is-large" :active="waitTransactionComplete" />
        <b-skeleton size="is-large" width="60%" :active="waitTransactionComplete" />
        <p
          v-if="transactionScanUrl !== ''"
          class="check-transaction"
        >
          <a :href="transactionScanUrl" target="_blank" class="scanlink">{{ $t('operation_text56') }}</a>
        </p>
      </div>
      <div v-if="!isOngoingTransaction">
        <b-table
          :data="displayTicketRequesters"
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
            v-if="owner === 1"
            v-slot="props"
            field="number"
            :label="$t('operation_text115')"
            width="40"
            numeric
          >
            {{ props.row.number }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="time"
            :label="$t('operation_text116')"
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
            v-slot="props"
            field="paid"
            :label="$t('operation_text106')"
          >
            <span style="color: #48c78e;">{{ new Number(props.row.paid).toFixed(2) }} $FLOW</span>
          </b-table-column>

          <b-table-column
            v-if="owner === 0"
            v-slot="props"
            field="refund"
            :label="$t('operation_text127')"
          >
            <span v-if="Number(props.row.paid) > 0" class="tag is-warning" style="padding: 0 25px;" @click="refund(props.row.user_id, props.row.paid)">
              {{ $t('operation_text128') }}
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
          v-if="ticketRequesters && ticketRequesters.length > this.perPage"
          v-model="current"
          :total="this.ticketRequesters.length"
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
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'

export default {
  name: 'CrowdfundingConfirmModal',
  props: {
    address: {
      type: String,
      required: true,
      default: ''
    },
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
      flowscanLink: 'https://flowscan.org/transaction',
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
      displayTicketRequesters: window.innerWidth >= 768 ? this.ticketRequesters.slice(0, 10) : this.ticketRequesters.slice(0, 2),
      rangeBefore: 1,
      rangeAfter: 1,
      isSimple: false,
      isRounded: true,
      showCalendar: false,
      date: new Date(),
      events: [],
      waitTransactionComplete: false,
      isOngoingTransaction: false
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
            duration: 3000,
            message: eventInfo,
            type: 'is-link'
          })
        }
      }
    },
    current: {
      handler (val) {
        const position = this.perPage * (val - 1)
        this.displayTicketRequesters = this.ticketRequesters.slice(position, position + this.perPage)
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
    try {
      this.displayTicketRequesters = this.ticketRequesters.slice(0, this.perPage)
      // subscribeに対応
      setInterval(() => {
        this.displayTicketRequesters = this.ticketRequesters.slice(this.perPage * (this.current - 1), this.perPage * (this.current - 1) + this.perPage)
      }, 2000)
    } catch (e) {
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
    async refund (userId, paid) {
      const isSet = await this.$fcl.send(
        [
          this.$fcl.script(FlowScripts.isThisUserSetRefundVault),
          this.$fcl.args([
            this.$fcl.arg(userId, this.$fclArgType.UInt32)
          ])
        ]
      ).then(this.$fcl.decode)
      if (!isSet) {
        this.$buefy.dialog.alert(this.$t('operation_text132'))
        return
      }
      this.$buefy.dialog.prompt({
        message: this.$t('operation_text129'),
        inputAttrs: {
          type: 'text',
          placeholder: '',
          maxlength: 5
        },
        trapFocus: true,
        onConfirm: (value) => {
          const fund = parseFloat(value).toFixed(2)
          if (Math.abs(String(fund).length - value.length) > 3) {
            this.$buefy.dialog.alert(this.$t('operation_text130'))
          } else if (fund > 0 && fund <= Number(paid).toFixed(2)) {
            this.$buefy.dialog.confirm({
              message: String(fund) + this.$t('operation_text36'),
              onConfirm: () => {
                this.refundTransaction(fund, userId, paid)
              }
            })
          } else if (fund > 0 && fund > Number(paid).toFixed(2)) {
            this.$buefy.dialog.alert(this.$t('operation_text131'))
          } else {
            this.$buefy.dialog.alert(this.$t('operation_text130'))
          }
        }
      })
    },
    async refundTransaction (fund, userId, totalPaid) {
      try {
        // loading
        const loadingComponent = this.$buefy.loading.open({
          container: null
        })
        setTimeout(() => loadingComponent.close(), 3 * 1000)
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.refund),
            this.$fcl.args([
              this.$fcl.arg(this.address, this.$fclArgType.Address),
              this.$fcl.arg(String(userId), this.$fclArgType.UInt32),
              this.$fcl.arg(String(fund), this.$fclArgType.UFix64)
            ]),
            this.$fcl.payer(this.$fcl.authz),
            this.$fcl.proposer(this.$fcl.authz),
            this.$fcl.authorizations([this.$fcl.authz]),
            this.$fcl.limit(9999)
          ]
        ).then(this.$fcl.decode)
        this.transactionScanUrl = `https://flowscan.org/transaction/${transactionId}`
        this.waitTransactionComplete = true
        this.isOngoingTransaction = true
        this.callToast()
        const timerID = setInterval(async () => {
          const ticketRequesters = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getTicketRequesters),
              this.$fcl.args([
                this.$fcl.arg(this.address, this.$fclArgType.Address)
              ])
            ]
          ).then(this.$fcl.decode)
          const keys = Object.keys(ticketRequesters)
          keys.forEach((key) => {
            if (ticketRequesters[key].crowdfunding === true && ticketRequesters[key].user_id === userId) {
              if (parseFloat(ticketRequesters[key].paid) < parseFloat(totalPaid)) {
                clearInterval(timerID)
                this.waitTransactionComplete = false
                this.isOngoingTransaction = false
                this.$buefy.toast.open({
                  duration: 3000,
                  message: this.$t('operation_text114')
                })
                this.ticketRequesters.forEach((data) => {
                  if (ticketRequesters[key].user_id === data.user_id) {
                    data.paid = ticketRequesters[key].paid
                  }
                })
              }
            }
          })
        }, 4000)
      } catch (e) {
      }
    },
    callToast () {
      const toast = this.$buefy.toast.open({
        indefinite: true,
        message: this.$t('operation_text34')
      })
      setTimeout(() => {
        toast.close()
      }, 10000)
    },
    hideSchedule () {
      this.showCalendar = false
    },
    dateThAttrs (column) {
      return column.label === 'Date' ? { class: 'has-text-success' } : null
    },
    csvDownload () {
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
