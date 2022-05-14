<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="contents">
        <div class="text-wrap title">
          {{ $t('ticket_text32') }}
        </div>
        <div class="nft-list-container">
          <p
            v-if="transactionScanUrl !== ''"
            class="check-transaction"
          >
            <a :href="transactionScanUrl" target="_blank" class="scanlink">Confirm the transaction</a>
          </p>
          <div
            v-if="showFlag && !ticketInfo && !isCompleteRegister"
            class="text-wrap"
          >
            <b-field
              :label="'1. '+ $t('operation_text5')"
              :type="{ 'is-success': registerName != '', 'is-danger': registerName === ''}"
            >
              <b-input
                v-model="registerName"
                maxlength="40"
                :placeholder="$t('operation_text1')"
              />
            </b-field>
            <b-field
              :label="'2. ' + $t('operation_text7')"
              :type="{ 'is-success': registerWhere != '', 'is-danger': registerWhere === ''}"
            >
              <b-input
                v-model="registerWhere"
                maxlength="60"
                :placeholder="$t('operation_text3')"
              />
            </b-field>
            <b-field :label="'3. ' + $t('operation_text35')">
              <b-datepicker
                v-model="registerWhen"
                :first-day-of-week="1"
                :placeholder="$t('operation_text2')"
              >
                <b-button
                  label="Today"
                  type="is-primary"
                  icon-left="calendar-today"
                  @click="registerWhen = new Date()"
                />
                <b-button
                  label="Clear"
                  type="is-danger"
                  icon-left="close"
                  outlined
                  @click="registerWhen = null"
                />
              </b-datepicker>
              <b-timepicker
                v-model="registerWhen"
                rounded
                :placeholder="$t('operation_text2')"
              />
            </b-field>

            <div class="button-wrap">
              <b-button @click="$emit('closeModal')">
                Close
              </b-button>
              <b-button
                :disabled="!registerName || !registerWhere || !registerWhen"
                @click="registerTicketInfo"
              >
                {{ $t('operation_text12') }}
              </b-button>
            </div>
          </div>
          <div v-if="isCompleteRegister" class="text-wrap">
            <p class="complete-register">
              {{ $t('operation_text14') }}<br>
              {{ $t('operation_text15') }}<br>
              {{ $t('operation_text16') }}<br>
              {{ $t('operation_text17') }} <a :href="dispenserPage">{{ dispenserPage }}</a>
            </p>
          </div>
          <div v-if="showFlag && ticketInfo && !isCompleteRegister" class="text-wrap">
            <p class="complete-register">
              {{ $t('operation_text18') }}<br>
              <span class="red">
                {{ $t('operation_text19') }}
              </span>
            </p>
            <b-field
              :label="'1. '+ $t('operation_text5')"
              :type="{ 'is-success': registerName != ''}"
            >
              <b-input
                v-model="registerName"
                maxlength="40"
                :placeholder="$t('operation_text1')"
              />
            </b-field>
            <b-field
              :label="'2. ' + $t('operation_text7')"
              :type="{ 'is-success': registerWhere != '', 'is-danger': registerWhere === ''}"
            >
              <b-input
                v-model="registerWhere"
                maxlength="60"
                :placeholder="$t('operation_text3')"
              />
            </b-field>
            <b-field :label="'3. ' + $t('operation_text35')">
              <b-datepicker
                v-model="registerWhen"
                :first-day-of-week="1"
                :placeholder="$t('operation_text2')"
              >
                <b-button
                  label="Today"
                  type="is-primary"
                  icon-left="calendar-today"
                  @click="registerWhen = new Date()"
                />
                <b-button
                  label="Clear"
                  type="is-danger"
                  icon-left="close"
                  outlined
                  @click="registerWhen = null"
                />
              </b-datepicker>
              <b-timepicker
                v-model="registerWhen"
                rounded
                :placeholder="$t('operation_text2')"
              />
            </b-field>

            <b-field :label="$t('operation_text11')">
              <b-checkbox
                v-model="registerTwitterEdit"
                true-value="Yes"
                false-value="No"
              >
                {{ registerTwitterEdit }}
              </b-checkbox>
            </b-field>
            <div class="button-wrap">
              <b-button @click="$emit('closeModal')">
                Close
              </b-button>
              <b-button
                :disabled="!registerWhere || !registerWhen"
                @click="registerTicketInfo"
              >
                {{ $t('operation_text13') }}
              </b-button>
            </div>
          </div>
          <div v-if="isCompleteDispense" class="text-wrap">
            <p class="complete-register">
              {{ $t('ticket_text27') }}<br>
              {{ $t('ticket_text28') }}<br>
              {{ $t('ticket_text29') }}<br>
              {{ $t('ticket_text30') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'

export default {
  name: 'TicketInputModal',
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
    },
    dispenserPage: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      ticketInfo: null,
      registerName: '',
      registerWhereType: '-',
      registerWhere: '',
      registerWhen: new Date(),
      registerWhenWeekdays: [],
      registerType: null, // Reserves for the future
      registerPrice: 0,
      registerTwitter: '',
      registerTwitterEdit: 'No',
      transactionScanUrl: '',
      isCompleteRegister: false,
      isCompleteDispense: false,
      ticketRequesters: [],
      requestList: [],
      receivedList: [],
      showFlag: false,
      tagOpenOnFocus: true,
      weeekdays: [
        { day: this.$t('operation_text20'), id: 0 },
        { day: this.$t('operation_text21'), id: 1 },
        { day: this.$t('operation_text22'), id: 2 },
        { day: this.$t('operation_text23'), id: 3 },
        { day: this.$t('operation_text24'), id: 4 },
        { day: this.$t('operation_text25'), id: 5 },
        { day: this.$t('operation_text26'), id: 6 }
      ],
      filteredWeekdays: [
        { day: this.$t('operation_text20'), id: 0 },
        { day: this.$t('operation_text21'), id: 1 },
        { day: this.$t('operation_text22'), id: 2 },
        { day: this.$t('operation_text23'), id: 3 },
        { day: this.$t('operation_text24'), id: 4 },
        { day: this.$t('operation_text25'), id: 5 },
        { day: this.$t('operation_text26'), id: 6 }
      ],
      indexOfTicket: null
    }
  },
  async mounted () {
    await this.getTickets()
  },
  methods: {
    getFilteredWeekdays (text) {
      this.filteredWeekdays = this.weeekdays.filter((option) => {
        return option.day
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase())
      })
    },
    async getTickets () {
      this.showFlag = false
      this.isCompleteRegister = false
      if (!this.ticketInfo) {
        try {
          const tickets = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getTickets),
              this.$fcl.args([
              ])
            ]
          ).then(this.$fcl.decode)
          this.ticketInfo = tickets.find((ticket, index) => {
            const match = ticket.dispenser_id === this.dispenser
            if (match) {
              this.indexOfTicket = index
            }
            return match
          })
          if (this.ticketInfo) {
            const name = this.ticketInfo.name.split('||@')
            if (name.length === 2) {
              this.registerName = name[0]
              this.registerTwitter = name[1]
            } else if (name.length > 2) {
              this.registerName = name[0]
              this.registerTwitter = ''
              for (let i = 1; i < name.length; i++) {
                this.registerTwitter = this.registerTwitter + (i === 1 ? '' : '||@') + name[i]
              }
              this.registerTwitter = name[1]
            }
            const where = this.ticketInfo.where_to_use.split('||')
            if (where.length === 2) {
              this.registerWhereType = where[0]
              this.registerWhere = where[1]
            } else if (where.length > 2) {
              this.registerWhereType = where[0]
              this.registerWhere = ''
              for (let i = 1; i < where.length; i++) {
                this.registerWhere = this.registerWhere + (i === 1 ? '' : '||') + where[i]
              }
            }
            const when = this.ticketInfo.when_to_use.split('||')
            if (when.length === 3) {
              const weekdays = when[0]
              for (let i = 0; i < weekdays.length; i++) {
                const day = weekdays.substr(i, 1)
                switch (day) {
                  case '0':
                    this.registerWhenWeekdays.push({ day: this.$t('operation_text20'), id: 0 })
                    break
                  case '1':
                    this.registerWhenWeekdays.push({ day: this.$t('operation_text21'), id: 1 })
                    break
                  case '2':
                    this.registerWhenWeekdays.push({ day: this.$t('operation_text22'), id: 2 })
                    break
                  case '3':
                    this.registerWhenWeekdays.push({ day: this.$t('operation_text23'), id: 3 })
                    break
                  case '4':
                    this.registerWhenWeekdays.push({ day: this.$t('operation_text24'), id: 4 })
                    break
                  case '5':
                    this.registerWhenWeekdays.push({ day: this.$t('operation_text25'), id: 5 })
                    break
                  case '6':
                    this.registerWhenWeekdays.push({ day: this.$t('operation_text26'), id: 6 })
                    break
                }
              }
              this.registerWhen = new Date(when[1])
            }
            this.registerPrice = this.ticketInfo.price.replace(/\.?0+$/, '')

            this.registerType = this.ticketInfo.type
          } else {
            this.ticketInfo = null
          }
          await this.confirmRequesters()
        } catch (e) {
        }
      } else {
        await this.confirmRequesters()
      }
    },
    registerTicketInfo () {
      if (!this.ticketInfo || this.registerTwitterEdit === 'Yes') {
        this.$buefy.dialog.prompt({
          message: this.$t('operation_text27'),
          inputAttrs: {
            type: 'text',
            placeholder: `${this.$t('ticket_text40')} @official_twitter`,
            maxlength: 40
          },
          confirmText: 'Next',
          trapFocus: true,
          onConfirm: (value) => {
            if (value.indexOf('@') === 0) {
              value = value.substr(1)
            }
            this.registerTwitter = value
            const explanation = !this.ticketInfo ? `(${this.$t('operation_text28')})` : ''
            this.$buefy.dialog.confirm({
              message: `${this.$t('operation_text29')}<br>${explanation}`,
              onConfirm: this.ticketInfo ? this.updateTicketInfo : this.addTicketInfo
            })
          }
        })
      } else {
        this.$buefy.dialog.confirm({
          message: this.$t('operation_text29'),
          onConfirm: this.updateTicketInfo
        })
      }
    },
    async addTicketInfo () {
      const registerType = 0 // Reserves for the future
      const registerName = this.registerName + '||@' + this.registerTwitter
      const registerWhere = this.registerWhereType + '||' + this.registerWhere
      const registerWeekdays = this.registerWhenWeekdays.map(obj => obj.id).join('')
      const registerWhen = registerWeekdays + '||' + this.registerWhen + '||' + navigator.language
      try {
        // loading
        const loadingComponent = this.$buefy.loading.open({
          container: null
        })
        setTimeout(() => loadingComponent.close(), 3 * 1000)

        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.addTicketInfo),
            this.$fcl.args([
              this.$fcl.arg(registerType, this.$fclArgType.UInt8),
              this.$fcl.arg(registerName, this.$fclArgType.String),
              this.$fcl.arg(registerWhere, this.$fclArgType.String),
              this.$fcl.arg(registerWhen, this.$fclArgType.String),
              this.$fcl.arg(parseFloat(this.registerPrice).toFixed(2), this.$fclArgType.UFix64)
            ]),
            this.$fcl.payer(this.$fcl.authz),
            this.$fcl.proposer(this.$fcl.authz),
            this.$fcl.authorizations([this.$fcl.authz]),
            this.$fcl.limit(9999)
          ]
        ).then(this.$fcl.decode)
        this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
        this.isCompleteRegister = true
        return transactionId
      } catch (e) {
      }
    },
    async updateTicketInfo () {
      const registerType = 0 // Reserves for the future
      const registerName = this.registerName + '||@' + this.registerTwitter
      const registerWhere = this.registerWhereType + '||' + this.registerWhere
      const registerWeekdays = this.registerWhenWeekdays.map(obj => obj.id).join('')
      const registerWhen = registerWeekdays + '||' + this.registerWhen + '||' + navigator.language
      try {
        // loading
        const loadingComponent = this.$buefy.loading.open({
          container: null
        })
        setTimeout(() => loadingComponent.close(), 3 * 1000)

        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.updateTicketInfo),
            this.$fcl.args([
              this.$fcl.arg(this.indexOfTicket, this.$fclArgType.UInt32),
              this.$fcl.arg(registerType, this.$fclArgType.UInt8),
              this.$fcl.arg(registerName, this.$fclArgType.String),
              this.$fcl.arg(registerWhere, this.$fclArgType.String),
              this.$fcl.arg(registerWhen, this.$fclArgType.String),
              this.$fcl.arg(parseFloat(this.registerPrice).toFixed(2), this.$fclArgType.UFix64)
            ]),
            this.$fcl.payer(this.$fcl.authz),
            this.$fcl.proposer(this.$fcl.authz),
            this.$fcl.authorizations([this.$fcl.authz]),
            this.$fcl.limit(9999)
          ]
        ).then(this.$fcl.decode)
        this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
        this.isCompleteRegister = true
        return transactionId
      } catch (e) {
      }
    },
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
        if (ticketRequesters === null) {
          this.ticketRequesters = []
        } else {
          this.ticketRequesters = ticketRequesters
        }
        this.showFlag = true
      } catch (e) {
      }
    },
    async confirmReceivers () {
      try {
        const ticketReceivers = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getTicketReceivers),
            this.$fcl.args([
              this.$fcl.arg(this.address, this.$fclArgType.Address),
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
            ])
          ]
        ).then(this.$fcl.decode)
        this.ticketRequesters.forEach((obj) => {
          obj.done = ticketReceivers == null ? false : ticketReceivers.includes(obj.address)
        })
        this.requestList = this.ticketRequesters.filter(obj => !obj.grant)
        this.receivedList = this.ticketRequesters.filter(obj => obj.grant)
        this.showFlag = true
      } catch (e) {
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.modal-card {
  width: auto;

  .modal-card-body {
    max-width: 600px;
    margin: 0 auto;

    .scanlink {
      text-decoration: underline;
    }

    .text-wrap {
      margin: 4px;

      p {
        color: #222;
        margin: 8px 0;
      }

      h2 {
        font-size: 18px;
      }

      p.complete-register {
        font-weight: bold;
      }

      .check-transaction {
        text-align : center;
        margin-top: 16px;

        a {
          font-size: 16px;
          text-decoration: underline;
        }
      }

      .red {
        color: red;
      }

      .button-wrap {
        margin-top: 15px;
        text-align: center;

        & .button {
          border-radius: 30px;
          border-color: revert;
        }
      }

      .important {
        color: green;
      }
    }
  }
}
</style>
