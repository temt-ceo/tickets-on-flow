<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="contents">
        <div class="text-wrap title">
          Setting
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
              label="1. Ticket Name"
              :message="registerName === '' ? 'Please enter a value': ''"
              :type="{ 'is-success': registerName != '', 'is-danger': registerName === ''}"
            >
              <b-input
                v-model="registerName"
                maxlength="40"
                placeholder="e.g. Conversation Rights"
              />
            </b-field>
            <b-field label="2. Which tool do you use?">
              <b-select
                v-model="registerWhereType"
                placeholder="Select..."
              >
                <option value="1">
                  Zoom
                </option>
                <option value="2">
                  Discord
                </option>
                <option value="3">
                  Teams
                </option>
                <option value="4">
                  Google Meet
                </option>
                <option value="5">
                  YouTube
                </option>
                <option value="6">
                  On this webpage
                </option>
                <option value="7">
                  (None)On-site
                </option>
                <option value="8">
                  Other tools
                </option>
              </b-select>
            </b-field>
            <b-field
              label="3. How do you connect to the tool? or Detail the description of location"
              :message="registerWhere === '' ? 'Please enter': ''"
              :type="{ 'is-success': registerWhere != '', 'is-danger': registerWhere === ''}"
            >
              <b-input
                v-model="registerWhere"
                maxlength="40"
                placeholder="e.g. Send invitation code on this webpage."
              />
            </b-field>
            <b-field label="4. When will the tickets be used?">
              <b-datepicker
                v-model="registerWhen"
                :first-day-of-week="1"
                placeholder="Click to select..."
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
                placeholder="Select..."
              />
            </b-field>
            <b-field label="5. Where is your time zone?">
              <b-select
                v-model="registerWhenTZ"
                placeholder="Select..."
              >
                <option value="0">
                  London(+0)
                </option>
                <option value="1">
                  Berlin(+1)
                </option>
                <option value="2">
                  Johannesburg(+2)
                </option>
                <option value="3">
                  Baghdad(+3)
                </option>
                <option value="4">
                  Dubai(+4)
                </option>
                <option value="5">
                  Karachi(+5)
                </option>
                <option value="6">
                  Kolkata(+5.5)
                </option>
                <option value="7">
                  Dhaka(+6)
                </option>
                <option value="8">
                  Jakarta(+7)
                </option>
                <option value="9">
                  Shanghai(+8)
                </option>
                <option value="10">
                  Tokyo(+9)
                </option>
                <option value="11">
                  Sydney(+10)
                </option>
                <option value="12">
                  Noumea(+11)
                </option>
                <option value="13">
                  Auckland(+12)
                </option>
                <option value="14">
                  Pago Pago(-11)
                </option>
                <option value="15">
                  Honolulu(-10)
                </option>
                <option value="16">
                  Anchorage(-9)
                </option>
                <option value="17">
                  Los Angeles(-8)
                </option>
                <option value="18">
                  Denver(-7)
                </option>
                <option value="19">
                  Chicago(-6)
                </option>
                <option value="20">
                  New York(-5)
                </option>
                <option value="21">
                  Santiago(-4)
                </option>
                <option value="22">
                  Buenos Aires(-3)
                </option>
                <option value="23">
                  Noronha(-2)
                </option>
                <option value="24">
                  Azores(-1)
                </option>
              </b-select>
            </b-field>
            <b-field label="6. Price($FLOW)">
              <b-select
                v-model="registerPrice"
                placeholder="Select..."
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
              </b-select>
            </b-field>
            <div class="button-wrap">
              <b-button @click="$emit('closeModal')">
                Close
              </b-button>
              <b-button
                :disabled="!registerName || !registerWhere || !registerWhereType || !registerWhen || !registerWhenTZ || !registerPrice"
                @click="registerTicketInfo"
              >
                Register
              </b-button>
            </div>
          </div>
          <div v-if="isCompleteRegister" class="text-wrap">
            <p class="complete-register">
              Tickets registered.<br>
              It takes about 10 seconds to complete registration.<br>
              After clicking "Confirm the transaction" and seeing the word SEALED on the screen,<br>
              the ticket request button will appear on <a :href="ticketPage">{{ ticketPage }}</a>
            </p>
          </div>
          <div v-if="showFlag && ticketInfo && !isCompleteRegister" class="text-wrap">
            <p class="complete-register">
              You have already registered a ticket. If you wish to edit/suspend your ticket, please enter the following and press the Update button.<br>
              <span class="red">
                (Empty the ticket name if you want to suspend. Once a user has applied for a ticket, it cannot be suspended.)
              </span>
            </p>
            <b-field
              label="1. Ticket Name"
              :message="registerName === '' ? 'Please enter a value': ''"
              :type="{ 'is-success': registerName != ''}"
            >
              <b-input
                v-model="registerName"
                maxlength="40"
                placeholder="e.g. Conversation Rights"
              />
            </b-field>
            <b-field label="2. Which tool do you use?">
              <b-select
                v-model="registerWhereType"
                placeholder="Select..."
              >
                <option value="1">
                  Zoom
                </option>
                <option value="2">
                  Discord
                </option>
                <option value="3">
                  Teams
                </option>
                <option value="4">
                  Google Meet
                </option>
                <option value="5">
                  YouTube
                </option>
                <option value="6">
                  On this webpage
                </option>
                <option value="7">
                  (None)On-site
                </option>
                <option value="8">
                  Other tools
                </option>
              </b-select>
            </b-field>
            <b-field
              label="3. How do you connect to the tool? or Detail the description of location"
              :message="registerWhere === '' ? 'Please enter': ''"
              :type="{ 'is-success': registerWhere != '', 'is-danger': registerWhere === ''}"
            >
              <b-input
                v-model="registerWhere"
                maxlength="40"
                placeholder="e.g. Send invitation code on this webpage."
              />
            </b-field>
            <b-field label="4. When will the tickets be used?">
              <b-datepicker
                v-model="registerWhen"
                :first-day-of-week="1"
                placeholder="Click to select..."
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
                placeholder="Select..."
              />
            </b-field>
            <b-field label="5. Where is your time zone?">
              <b-select
                v-model="registerWhenTZ"
                placeholder="Select..."
              >
                <option value="0">
                  London(+0)
                </option>
                <option value="1">
                  Berlin(+1)
                </option>
                <option value="2">
                  Johannesburg(+2)
                </option>
                <option value="3">
                  Baghdad(+3)
                </option>
                <option value="4">
                  Dubai(+4)
                </option>
                <option value="5">
                  Karachi(+5)
                </option>
                <option value="6">
                  Kolkata(+5.5)
                </option>
                <option value="7">
                  Dhaka(+6)
                </option>
                <option value="8">
                  Jakarta(+7)
                </option>
                <option value="9">
                  Shanghai(+8)
                </option>
                <option value="10">
                  Tokyo(+9)
                </option>
                <option value="11">
                  Sydney(+10)
                </option>
                <option value="12">
                  Noumea(+11)
                </option>
                <option value="13">
                  Auckland(+12)
                </option>
                <option value="14">
                  Pago Pago(-11)
                </option>
                <option value="15">
                  Honolulu(-10)
                </option>
                <option value="16">
                  Anchorage(-9)
                </option>
                <option value="17">
                  Los Angeles(-8)
                </option>
                <option value="18">
                  Denver(-7)
                </option>
                <option value="19">
                  Chicago(-6)
                </option>
                <option value="20">
                  New York(-5)
                </option>
                <option value="21">
                  Santiago(-4)
                </option>
                <option value="22">
                  Buenos Aires(-3)
                </option>
                <option value="23">
                  Noronha(-2)
                </option>
                <option value="24">
                  Azores(-1)
                </option>
              </b-select>
            </b-field>
            <b-field label="6. Price($FLOW)">
              <b-select
                v-model="registerPrice"
                placeholder="Select..."
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
              </b-select>
            </b-field>
            <b-field label="7. Want to change your Twitter account name?">
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
                :disabled="!registerWhere || !registerWhereType || !registerWhen || !registerWhenTZ || !registerPrice"
                @click="registerTicketInfo"
              >
                Update
              </b-button>
            </div>
          </div>
          <div
            v-if="showFlag && ticketInfo && ticketRequesters.length > 0 && !isCompleteDispense"
            class="text-wrap"
          >
            <p class="complete-register">
              チケット配布待ちの方が<span class="important">{{ requestList.length }}人</span>います。<br>
              チケットを配布される場合は配布ボタンを押してください。
            </p>
            <div class="button-wrap">
              <b-button @click="$emit('closeModal')">
                とじる
              </b-button>
              <b-button
                :disabled="requestList.length === 0"
                @click="dispenseTicket"
              >
                配布
              </b-button>
            </div>
          </div>
          <div v-if="isCompleteDispense" class="text-wrap">
            <p class="complete-register">
              チケットの配布を行いました。<br>
              配布完了までに約10秒、時間がかかります。<br>
              「トランザクションを確認」をクリックして表示された画面でSEALEDと表示された後、<br>
              配布されたチケットが表示されます。
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
    ticketPage: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      ticketInfo: null,
      registerName: '',
      registerWhereType: null,
      registerWhere: '',
      registerWhen: new Date(),
      registerWhenTZ: null,
      registerType: null, // Reserves for the future
      registerPrice: null,
      registerTwitter: '',
      registerTwitterEdit: 'No',
      transactionScanUrl: '',
      isCompleteRegister: false,
      isCompleteDispense: false,
      ticketRequesters: [],
      requestList: [],
      receivedList: [],
      showFlag: false,
      indexOfTicket: null
    }
  },
  async mounted () {
    await this.getTickets()
  },
  methods: {
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
            if (when.length === 2) {
              this.registerWhenTZ = when[0]
              this.registerWhen = new Date(when[1])
            }
            this.registerPrice = this.ticketInfo.price.replace(/0+$/, '')
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
          message: 'Enter your Twitter account detailing your ticket use.',
          inputAttrs: {
            type: 'text',
            placeholder: 'e.g. @official_ticket',
            maxlength: 40
          },
          confirmText: 'Next',
          trapFocus: true,
          onConfirm: (value) => {
            if (value.indexOf('@') === 0) {
              value = value.substr(1)
            }
            this.registerTwitter = value
            const explanation = !this.ticketInfo ? `Once registered, a ticket request button will appear on your ticket webpage. (${this.ticketPage})<br>` : ''
            this.$buefy.dialog.confirm({
              message: `${explanation}If you are sure, please press "Approve" on the pop-up that will appear after this.`,
              onConfirm: this.ticketInfo ? this.updateTicketInfo : this.addTicketInfo
            })
          }
        })
      } else {
        this.$buefy.dialog.confirm({
          message: 'If you are sure, please press "Approve" on the pop-up that will appear after this.',
          onConfirm: this.updateTicketInfo
        })
      }
    },
    async addTicketInfo () {
      const registerType = 0 // Reserves for the future
      const registerName = this.registerName + '||@' + this.registerTwitter
      const registerWhere = this.registerWhereType + '||' + this.registerWhere
      const registerWhen = this.registerWhenTZ + '||' + this.registerWhen
      try {
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.addTicketInfo),
            this.$fcl.args([
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
              this.$fcl.arg(registerType, this.$fclArgType.UInt8),
              this.$fcl.arg(registerName, this.$fclArgType.String),
              this.$fcl.arg(registerWhere, this.$fclArgType.String),
              this.$fcl.arg(registerWhen, this.$fclArgType.String),
              this.$fcl.arg(Number(this.registerPrice), this.$fclArgType.UFix64)
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
      const registerWhen = this.registerWhenTZ + '||' + this.registerWhen
      try {
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.updateTicketInfo),
            this.$fcl.args([
              this.$fcl.arg(this.indexOfTicket, this.$fclArgType.UInt32),
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
              this.$fcl.arg(registerType, this.$fclArgType.UInt8),
              this.$fcl.arg(registerName, this.$fclArgType.String),
              this.$fcl.arg(registerWhere, this.$fclArgType.String),
              this.$fcl.arg(registerWhen, this.$fclArgType.String),
              this.$fcl.arg(Number(this.registerPrice), this.$fclArgType.UFix64)
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
        console.log(e)
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
    },
    async dispenseTicket () {
      try {
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.dispenseTicket),
            this.$fcl.args([
              this.$fcl.arg(this.ticketInfo.name, this.$fclArgType.String)
            ]),
            this.$fcl.payer(this.$fcl.authz),
            this.$fcl.proposer(this.$fcl.authz),
            this.$fcl.authorizations([this.$fcl.authz]),
            this.$fcl.limit(9999)
          ]
        ).then(this.$fcl.decode)
        this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
        this.isCompleteDispense = true
        return transactionId
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
          color: purple;
          font-size: 14px;
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
