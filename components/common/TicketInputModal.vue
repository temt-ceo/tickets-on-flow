<template>
  <div v-if="isTypeSame != null || demo" class="modal-card">
    <section class="modal-card-body setting-modal">
      <div class="contents">
        <div class="text-wrap title">
          {{ $t('ticket_text32') }}
        </div>
        <div class="nft-list-container">
          <b-message v-if="isTypeSame == false" type="is-warning" has-icon>
            {{ $t('operation_text18') }}
          </b-message>
          <b-message v-if="demo == true" type="is-success" has-icon>
            {{ $t('operation_text92') }}; {{ $t('operation_text93') }}
          </b-message>
          <div v-if="isCompleteRegister" class="text-wrap">
            <div class="complete-register">
              <div>{{ $t('operation_text15') }}</div>
              <b-skeleton size="is-large" :active="isCompleteRegister" />
              <b-skeleton size="is-large" :active="isCompleteRegister" style="margin-bottom: 5px;" />
              <p>{{ $t('operation_text16') }}</p>
              <small>{{ dispenserPage }}</small>
              <b-tooltip
                label="Copied!"
                type="is-info"
                :active="tooltipActive"
              >
                <b-button type="is-info is-light" @click="clickCopy">
                  Copy
                </b-button>
              </b-tooltip>
            </div>
          </div>
          <p
            v-if="transactionScanUrl !== ''"
            class="check-transaction"
          >
            <a :href="transactionScanUrl" target="_blank" class="scanlink">{{ $t('operation_text56') }}</a>
          </p>
          <div v-if="isTypeSame || demo">
            <div
              v-if="(showFlag && !ticketInfo && !isCompleteRegister) || demo"
              class="text-wrap"
            >
              <b-field
                :label="'1. '+ $t('operation_text5')"
                :type="{ 'is-success': registerName != '', 'is-danger': registerName === ''}"
                class="register-text-input"
              >
                <b-input
                  v-model="registerName"
                  maxlength="50"
                  :placeholder="$t('operation_text1')"
                />
              </b-field>
              <b-field :label="'2. ' + $t('operation_text6')">
                <b-select
                  v-model="registerWhereType"
                  :placeholder="$t('operation_text2')"
                >
                  <option value="1">
                    Zoom
                  </option>
                  <option value="2">
                    Instagram
                  </option>
                  <option value="3">
                    Discord
                  </option>
                  <option value="4">
                    Teams
                  </option>
                  <option value="5">
                    Google Meet
                  </option>
                  <option value="6">
                    {{ $t('ticket_text2') }}
                  </option>
                  <option value="7">
                    YouTube
                  </option>
                  <option value="8">
                    {{ $t('ticket_text3') }}
                  </option>
                  <option value="9">
                    {{ $t('ticket_text4') }}
                  </option>
                </b-select>
              </b-field>
              <b-field
                :label="'3. ' + $t('operation_text7')"
                :type="{ 'is-success': registerWhere != '', 'is-danger': registerWhere === ''}"
                class="register-text-input"
              >
                <b-input
                  v-model="registerWhere"
                  maxlength="100"
                  :placeholder="$t('operation_text3')"
                />
              </b-field>
              <b-field :label="'4. ' + $t('operation_text8')">
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
              <b-field :label="$t('operation_text9')">
                <b-taginput
                  v-model="registerWhenWeekdays"
                  :data="filteredWeekdays"
                  autocomplete
                  :open-on-focus="tagOpenOnFocus"
                  field="day"
                  icon="label"
                  :placeholder="$t('operation_text2')"
                  @typing="getFilteredWeekdays"
                />
              </b-field>
              <b-field :label="'5. ' + $t('operation_text10')" style="margin-bottom: 1.25rem;">
                <b-select
                  v-model="registerPrice"
                  :placeholder="$t('operation_text2')"
                >
                  <option value="1">
                    1 FLOW
                  </option>
                  <option value="0.9">
                    0.9 FLOW
                  </option>
                  <option value="0.8">
                    0.8 FLOW
                  </option>
                  <option value="0.7">
                    0.7 FLOW
                  </option>
                  <option value="0.6">
                    0.6 FLOW
                  </option>
                  <option value="0.5">
                    0.5 FLOW
                  </option>
                  <option value="0.4">
                    0.4 FLOW
                  </option>
                  <option value="0.3">
                    0.3 FLOW
                  </option>
                  <option value="0.2">
                    0.2 FLOW
                  </option>
                  <option value="0.1">
                    0.1 FLOW
                  </option>
                  <option value="0.05">
                    0.05 FLOW
                  </option>
                  <option value="1.25">
                    1.25 FLOW
                  </option>
                  <option value="1.5">
                    1.5 FLOW
                  </option>
                  <option value="1.75">
                    1.75 FLOW
                  </option>
                  <option value="2">
                    2 FLOW
                  </option>
                  <option value="2.25">
                    2.25 FLOW
                  </option>
                  <option value="2.5">
                    2.5 FLOW
                  </option>
                  <option value="2.75">
                    2.75 FLOW
                  </option>
                  <option value="3">
                    3 FLOW
                  </option>
                  <option value="3.25">
                    3.25 FLOW
                  </option>
                  <option value="3.5">
                    3.5 FLOW
                  </option>
                  <option value="3.75">
                    3.75 FLOW
                  </option>
                  <option value="4">
                    4 FLOW
                  </option>
                  <option value="4.25">
                    4.25 FLOW
                  </option>
                  <option value="4.5">
                    4.5 FLOW
                  </option>
                  <option value="4.75">
                    4.75 FLOW
                  </option>
                  <option value="5">
                    5 FLOW
                  </option>
                </b-select>
              </b-field>
              <b-field :label="$t('operation_text87')">
                <b-switch v-model="switchDiscloseSales"
                  :true-value="$t('operation_text88')"
                  :false-value="$t('operation_text89')"
                  type="is-info"
                >
                  {{ switchDiscloseSales }}
                </b-switch>
              </b-field>
              <div class="button-wrap">
                <b-button @click="$emit('closeModal')">
                  Close
                </b-button>
                <b-button
                  type="is-info"
                  :disabled="!registerName || !registerWhere || !registerWhereType || !registerWhen || !registerPrice"
                  @click="registerTicketInfo"
                >
                  {{ $t('operation_text12') }}
                </b-button>
              </div>
            </div>
            <div v-if="showFlag && ticketInfo && !isCompleteRegister" class="text-wrap">
              <p>
                <b-message type="is-danger" has-icon>
                  {{ $t('operation_text19') }}
                </b-message>
              </p>
              <b-field
                :label="'1. '+ $t('operation_text5')"
                :type="{ 'is-success': registerName != ''}"
                class="register-text-input"
              >
                <b-input
                  v-model="registerName"
                  maxlength="50"
                  :placeholder="$t('operation_text1')"
                />
              </b-field>
              <b-field :label="'2. ' + $t('operation_text6')">
                <b-select
                  v-model="registerWhereType"
                  :placeholder="$t('operation_text2')"
                >
                  <option value="1">
                    Zoom
                  </option>
                  <option value="2">
                    Instagram
                  </option>
                  <option value="3">
                    Discord
                  </option>
                  <option value="4">
                    Teams
                  </option>
                  <option value="5">
                    Google Meet
                  </option>
                  <option value="6">
                    Ticket website
                  </option>
                  <option value="7">
                    YouTube
                  </option>
                  <option value="8">
                    Any tool
                  </option>
                  <option value="9">
                    On-site
                  </option>
                </b-select>
              </b-field>
              <b-field
                :label="'3. ' + $t('operation_text7')"
                :type="{ 'is-success': registerWhere != '', 'is-danger': registerWhere === ''}"
                class="register-text-input"
              >
                <b-input
                  v-model="registerWhere"
                  maxlength="100"
                  :placeholder="$t('operation_text3')"
                />
              </b-field>
              <b-field :label="'4. ' + $t('operation_text8')">
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
              <b-field :label="$t('operation_text9')">
                <b-taginput
                  v-model="registerWhenWeekdays"
                  :data="filteredWeekdays"
                  autocomplete
                  :open-on-focus="tagOpenOnFocus"
                  field="day"
                  icon="label"
                  :placeholder="$t('operation_text2')"
                  @typing="getFilteredWeekdays"
                />
              </b-field>
              <b-field :label="'5. ' + $t('operation_text10')">
                <b-select
                  v-model="registerPrice"
                  :placeholder="$t('operation_text2')"
                >
                  <option value="1">
                    1 FLOW
                  </option>
                  <option value="0.9">
                    0.9 FLOW
                  </option>
                  <option value="0.8">
                    0.8 FLOW
                  </option>
                  <option value="0.7">
                    0.7 FLOW
                  </option>
                  <option value="0.6">
                    0.6 FLOW
                  </option>
                  <option value="0.5">
                    0.5 FLOW
                  </option>
                  <option value="0.4">
                    0.4 FLOW
                  </option>
                  <option value="0.3">
                    0.3 FLOW
                  </option>
                  <option value="0.2">
                    0.2 FLOW
                  </option>
                  <option value="0.1">
                    0.1 FLOW
                  </option>
                  <option value="0.05">
                    0.05 FLOW
                  </option>
                  <option value="1.25">
                    1.25 FLOW
                  </option>
                  <option value="1.5">
                    1.5 FLOW
                  </option>
                  <option value="1.75">
                    1.75 FLOW
                  </option>
                  <option value="2">
                    2 FLOW
                  </option>
                  <option value="2.25">
                    2.25 FLOW
                  </option>
                  <option value="2.5">
                    2.5 FLOW
                  </option>
                  <option value="2.75">
                    2.75 FLOW
                  </option>
                  <option value="3">
                    3 FLOW
                  </option>
                  <option value="3.25">
                    3.25 FLOW
                  </option>
                  <option value="3.5">
                    3.5 FLOW
                  </option>
                  <option value="3.75">
                    3.75 FLOW
                  </option>
                  <option value="4">
                    4 FLOW
                  </option>
                  <option value="4.25">
                    4.25 FLOW
                  </option>
                  <option value="4.5">
                    4.5 FLOW
                  </option>
                  <option value="4.75">
                    4.75 FLOW
                  </option>
                  <option value="5">
                    5 FLOW
                  </option>
                </b-select>
              </b-field>
              <b-field :label="$t('operation_text87')">
                <b-switch v-model="switchDiscloseSales"
                  :true-value="$t('operation_text88')"
                  :false-value="$t('operation_text89')"
                  type="is-info"
                >
                  {{ switchDiscloseSales }}
                </b-switch>
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
                  type="is-info"
                  :disabled="!registerWhere || !registerWhereType || !registerWhen || !registerPrice"
                  @click="registerTicketInfo"
                >
                  {{ $t('operation_text13') }}
                </b-button>
              </div>
            </div>
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
    },
    demo: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data () {
    return {
      ticketInfo: null,
      registerName: '',
      registerWhereType: null,
      registerWhere: '',
      registerWhen: new Date(),
      registerWhenWeekdays: [],
      registerType: null, // Reserves for the future
      registerPrice: null,
      registerTwitter: '',
      registerTwitterEdit: 'No',
      isTypeSame: null,
      transactionScanUrl: '',
      isCompleteRegister: false,
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
      indexOfTicket: null,
      tooltipActive: false,
      switchDiscloseSales: this.$t('operation_text88')
    }
  },
  async mounted () {
    if (!this.demo) {
      await this.getTickets()
    }
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
            const match = parseInt(ticket.dispenser_id) === this.dispenser
            if (match) {
              this.indexOfTicket = index
            }
            return match
          })
          let isTypeSame = null
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
            if (when.length >= 2) {
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
              this.registerWhen = new Date(parseInt(when[1]))
              if (when.length < 4 || when[3] === '') {
                this.switchDiscloseSales = this.$t('operation_text89')
              } else {
                this.switchDiscloseSales = this.$t('operation_text88')
              }
            }
            this.registerPrice = this.ticketInfo.price.replace(/\.?0+$/, '')

            this.registerType = parseInt(this.ticketInfo.type)
            isTypeSame = !(this.registerName !== '' && this.registerType !== 0)
          } else {
            isTypeSame = true
            this.ticketInfo = null
          }
          await this.confirmRequesters()
          this.isTypeSame = isTypeSame
        } catch (e) {
        }
      } else {
        await this.confirmRequesters()
      }
    },
    registerTicketInfo () {
      if (this.demo) {
        this.$emit('closeModal')
        return
      }

      if (!this.ticketInfo || this.registerTwitterEdit === 'Yes') {
        this.$buefy.dialog.prompt({
          message: this.$t('operation_text27'),
          inputAttrs: {
            type: 'text',
            placeholder: `${this.$t('ticket_text40')} @official_twitter`,
            maxlength: 50
          },
          confirmText: 'Next',
          trapFocus: true,
          onConfirm: (value) => {
            if (value.indexOf('@') === 0) {
              value = value.substr(1)
            }
            this.registerTwitter = value
            this.$buefy.dialog.confirm({
              message: this.$t('operation_text29'),
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
      let registerWhen = registerWeekdays + '||' + this.registerWhen.getTime() + '||' + navigator.language + '||'
      if (this.switchDiscloseSales === this.$t('operation_text88')) {
        registerWhen = registerWhen + this.address
      }

      try {
        // loading
        const loadingComponent = this.$buefy.loading.open({
          container: null
        })
        setTimeout(() => loadingComponent.close(), 3 * 1000)

        this.$buefy.snackbar.open({
          duration: 5000, // 5 seconds
          message: this.$t('operation_text85') + '<br>' + this.$t('operation_text29'),
          type: 'is-danger',
          position: 'is-bottom-left',
          actionText: null,
          queue: false,
          onAction: () => {
          }
        })

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
        this.transactionScanUrl = `https://flowscan.org/transaction/${transactionId}`
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
      let registerWhen = registerWeekdays + '||' + this.registerWhen.getTime() + '||' + navigator.language + '||'
      if (this.switchDiscloseSales === this.$t('operation_text88')) {
        registerWhen = registerWhen + this.address
      }

      try {
        // loading
        const loadingComponent = this.$buefy.loading.open({
          container: null
        })
        setTimeout(() => loadingComponent.close(), 3 * 1000)

        this.$buefy.snackbar.open({
          duration: 5000, // 5 seconds
          message: this.$t('operation_text85') + '<br>' + this.$t('operation_text29'),
          type: 'is-danger',
          position: 'is-bottom-left',
          actionText: null,
          queue: false,
          onAction: () => {
          }
        })

        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.updateTicketInfo),
            this.$fcl.args([
              this.$fcl.arg(String(this.indexOfTicket), this.$fclArgType.UInt32),
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
        this.transactionScanUrl = `https://flowscan.org/transaction/${transactionId}`
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
              this.$fcl.arg(String(this.dispenser), this.$fclArgType.UInt32)
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
    },
    async clickCopy () {
      await navigator.clipboard.writeText(this.dispenserPage)
      this.tooltipActive = true
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

      &.title {
        margin-bottom: 10px;
      }

      p {
        color: #222;
        margin: 8px 0;
      }

      h2 {
        font-size: 18px;
      }

      .complete-register {
        div {
          font-weight: bold;
        }

        small {
          font-weight: bold;
          color: #485fc7;
        }
      }

      .red {
        color: red;
      }

      .button-wrap {
        margin: 20px;
        text-align: center;

        & .button {
          border-radius: 30px;
          border-color: revert;
          margin: 0 5px;
        }
      }

      .important {
        color: green;
      }
    }

    .check-transaction {
      text-align: center;
      font-size: 18px;

      a {
        text-decoration: underline;
      }
    }

  }
  .button.is-info.is-light {
    border-color: #0d68ce;
    padding: 0 2px;
    height: 1.8em;
  }
}
</style>
