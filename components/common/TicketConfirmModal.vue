<template>
  <div class="modal-card user-data">
    <section class="modal-card-body ticket-confirm-modal">
      <div class="text-wrap" style="padding-left: 36px; text-align: center;">
        {{ $t('operation_text75') }}
        <b-button v-if="owner === 0" class="download" type="is-light" icon-right="download" @click="csvDownload" />
      </div>
      <div v-if="isCompleteTransaction" class="text-wrap">
        <b-message type="is-success" has-icon>
          {{ $t('operation_text78') }}
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
      <div v-if="!isCompleteTransaction">
        <b-table
          :data="displayTicketRequesters"
          :checked-rows.sync="checkedRows"
          :is-row-checkable="(row) => owner == 0 && row.latest_token == null"
          :checkbox-position="checkboxPosition"
          checkbox-type="is-info"
          :checkable="owner === 0"
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
            field="time"
            :label="$t('operation_text105')"
            :th-attrs="dateThAttrs"
            centered
          >
            <span class="tag is-success" @click="showSchedule(props.row.time)">
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
            v-if="owner === 1"
            v-slot="props"
            field="count"
            :label="$t('operation_text102')"
          >
            {{ props.row.count }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="paid"
            :label="$t('operation_text103')"
          >
            <span style="color: #48c78e;">{{ Number(props.row.paid).toFixed(2) }} $FLOW</span>
          </b-table-column>

          <b-table-column
            v-if="owner === 0"
            v-slot="props"
            field="count"
            :label="$t('operation_text102')"
          >
            {{ props.row.count }}
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
              No applicants yet.
            </div>
          </template>
        </b-table>
        <hr>
        <b-pagination
          v-if="ticketRequesters && ticketRequesters.length > perPage"
          v-model="current"
          :total="ticketRequesters.length"
          :range-before="rangeBefore"
          :range-after="rangeAfter"
          :simple="isSimple"
          :rounded="isRounded"
          :per-page="perPage"
          order="is-centered"
          size="is-small"
          class="userdata-pagination"
        />
        <div v-if="owner === 0" class="table-wrapper">
          <div class="table_">
            <div class="row">
              <div class="cell">
                (Total issues: {{ latestMintedTokenId }} tickets)
              </div>
              <div class="cell rowspanned">
                <b-button
                  :disabled="checkedRows.length === 0"
                  type="is-info"
                  @click="dispenseTicket"
                >
                  {{ $t('operation_text77') }}
                </b-button>
              </div>
            </div>
            <div class="row">
              <div v-if="peopleWaitingCount == 0" class="cell colspan">
                (People waiting: {{ peopleWaitingCount }} person)
              </div>
              <div v-if="peopleWaitingCount > 0" class="cell colspan">
                (People waiting: <span style="color: #f14668; font-style: italic; font-size: 15px;">{{ peopleWaitingCount }}</span> person)
              </div>
              <div class="cell empty" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <b-datepicker
      v-if="showCalendar"
      v-model="date"
      inline
      :events="events"
      indicators="dots"
      style="position: absolute; width: 100%; top: 8%; text-align: center;"
    />
    <b-button v-if="showCalendar" type="is-danger" style="width: 100%; margin: 0px auto; position: absolute; bottom: 0; margin: 0 auto;" @click="hideSchedule">
      Close
    </b-button>
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
    },
    owner: {
      type: Number,
      required: true,
      default: null
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
      isCompleteTransaction: false,
      checkedRows: [],
      checkboxPosition: 'left',
      isBordered: false,
      isStriped: false,
      isNarrowed: false,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: true,
      perPage: window.innerWidth >= 768 ? 10 : 2,
      displayTicketRequesters: window.innerWidth >= 768 ? this.ticketRequesters.slice(0, 10) : this.ticketRequesters.slice(0, 2),
      current: 1,
      rangeBefore: 1,
      rangeAfter: 1,
      isSimple: false,
      isRounded: true,
      waitTransactionComplete: false,
      showCalendar: false,
      date: new Date(),
      events: [],
      xDown: null,
      yDown: null
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
            const localeTime = new Date(data.data?.time * 1000).toLocaleTimeString()
            eventInfo += `User ${data.data?.user_id} requested at ${localeTime}`
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
        this.displayTicketRequesters = this.ticketRequesters.slice(position, position + this.perPage)
      }
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
      this.peopleWaitingCount = this.ticketRequesters.filter(data => data.latest_token === null).length
      this.displayTicketRequesters = this.ticketRequesters.slice(0, this.perPage)
      // subscribeに対応
      setInterval(() => {
        this.peopleWaitingCount = this.ticketRequesters.filter(data => data.latest_token === null).length
        this.displayTicketRequesters = this.ticketRequesters.slice(this.perPage * (this.current - 1), this.perPage * (this.current - 1) + this.perPage)
      }, 2000)
    } catch (e) {
    }
    document.addEventListener('touchstart', this.handleTouchStart, false)
    document.addEventListener('touchmove', this.handleTouchMove, false)
  },
  methods: {
    dispenseTicket () {
      try {
        this.$buefy.dialog.prompt({
          message: this.$t('operation_text125'),
          inputAttrs: {
            type: 'text',
            placeholder: '',
            maxlength: 100
          },
          trapFocus: true,
          onConfirm: async (code) => {
            // loading
            const loadingComponent = this.$buefy.loading.open({
              container: null
            })
            setTimeout(() => loadingComponent.close(), 3 * 1000)

            const bcode = 'elffab' + code.toString().split('').reverse().join('') + '@chain-work.com'
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
            this.isCompleteTransaction = true
            this.callToast()
            const timerID = setInterval(async () => {
              const newArr = []
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
                if (ticketRequesters[key].crowdfunding === false) {
                  newArr.push(ticketRequesters[key])
                }
              })
              const waitingCount = newArr.filter(data => data.latest_token === null).length
              if (waitingCount < this.peopleWaitingCount) {
                clearInterval(timerID)
                newArr.forEach((obj) => {
                  this.ticketRequesters.forEach((data) => {
                    if (obj.user_id === data.user_id) {
                      data.latest_token = obj.latest_token // unexpected mutation エラーを回避
                    }
                  })
                })
                this.waitTransactionComplete = false
                this.peopleWaitingCount = waitingCount
                const latestMintedTokenId = await this.$fcl.send(
                  [
                    this.$fcl.script(FlowScripts.getLatestMintedTokenId),
                    this.$fcl.args([
                      this.$fcl.arg(this.address, this.$fclArgType.Address)
                    ])
                  ]
                ).then(this.$fcl.decode)
                this.latestMintedTokenId = latestMintedTokenId || 0
                this.isCompleteTransaction = false
                this.$buefy.toast.open({
                  duration: 3000,
                  message: this.$t('operation_text114')
                })
              }
            }, 4000)
          }
        })
      } catch (e) {
      }
    },
    refund (userId, paid) {
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
        this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
        this.waitTransactionComplete = true
        this.isCompleteTransaction = true
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
            if (ticketRequesters[key].crowdfunding === false && ticketRequesters[key].user_id === userId) {
              if (parseFloat(ticketRequesters[key].paid) < parseFloat(totalPaid)) {
                clearInterval(timerID)
                this.waitTransactionComplete = false
                this.isCompleteTransaction = false
                this.$buefy.toast.open({
                  duration: 3000,
                  message: this.$t('operation_text114')
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
    },
    getTouches (evt) {
      return evt.touches || evt.originalEvent.touches // browser API || jQuery
    },
    handleTouchStart (evt) {
      const firstTouch = this.getTouches(evt)[0]
      this.xDown = firstTouch.clientX
      this.yDown = firstTouch.clientY
    },
    handleTouchMove (evt) {
      if (!this.xDown || !this.yDown) {
        return
      }

      const xUp = evt.touches[0].clientX
      const yUp = evt.touches[0].clientY

      const xDiff = this.xDown - xUp
      const yDiff = this.yDown - yUp

      if (Math.abs(xDiff) > Math.abs(yDiff)) { /* most significant */
        /* right swipe */
        if (this.current * this.perPage < this.ticketRequesters.length && xDiff > 0) {
          this.current++
        /* left swipe */
        } else if (this.current > 1 && xDiff < 0) {
          this.current--
        }
      // } else {
      //   if (yDiff > 0) {
      //     /* down swipe */
      //     console.log('down----->>>')
      //   } else {
      //     /* up swipe */
      //     console.log('up----->>>')
      //   }
      }
      /* reset values */
      this.xDown = null
      this.yDown = null
    }
  }
}
</script>

<style lang="scss" scoped>

.modal-card {
  width: auto;

  .modal-card-body.ticket-confirm-modal {

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

    .table-wrapper {
      position: relative;
      float: right;
      min-height: 40px;
      margin-bottom: 2px;
      text-align: left;
      font-size: 13px;
      color: #485fc7;
    }
    .table_ {
      display: table;
      position: relative;
      width: 300px;
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
      min-width: 120px;
    }
    .cell.rowspanned {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      min-width: 120px;
    }
  }
}
@media screen and (min-width: 769px) {
  .modal-card-body.ticket-confirm-modal {
    min-height: 650px;
  }
}

</style>
