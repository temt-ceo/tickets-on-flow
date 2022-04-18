<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="text-wrap">
        Ticket Distribution Management
      </div>
      <div class="contents">
        <div class="nft-list-container">
          <p
            v-if="transactionScanUrl !== ''"
            class="check-transaction"
          >
            <a :href="transactionScanUrl" target="_blank">Confirm Transaction</a>
          </p>
          <div
            v-if="showFlag && !ticketInfo && !isCompleteRegister"
            class="text-wrap"
          >
            <b-field
              label="Name of Ticket"
              :message="refisterName === '' ? 'Please enter a value': ''"
              :type="{ 'is-success': refisterName != '', 'is-danger': refisterName === ''}"
            >
              <b-input
                v-model="refisterName"
                placeholder="e.g. Conversation Rights"
              />
            </b-field>
            <b-field
              label="Enter the location to be used"
              :message="refisterWhere === '' ? 'Please enter a value': ''"
              :type="{ 'is-success': refisterWhere != '', 'is-danger': refisterWhere === ''}"
            >
              <b-input
                v-model="refisterWhere"
                placeholder="e.g. on this website, on Live Streaming"
              />
            </b-field>
            <b-field
              label="How many times can it be used per capita?">
              <b-select
                v-model="refisterQuantity"
                placeholder="Please select"
              >
                <option value="1">
                  1 times
                </option>
                <option value="2">
                  2 times
                </option>
                <option value="3">
                  3 times
                </option>
                <option value="4">
                  4 times
                </option>
                <option value="5">
                  5 times
                </option>
                <option value="10">
                  10 times
                </option>
              </b-select>
            </b-field>
            <b-field
              label="How many times can it be used per capita?">
              <b-select
                v-model="refisterType"
                placeholder="Please select"
              >
                <option value="1">
                  1 times
                </option>
                <option value="2">
                  2 times
                </option>
                <option value="3">
                  3 times
                </option>
                <option value="4">
                  4 times
                </option>
                <option value="5">
                  5 times
                </option>
                <option value="10">
                  10 times
                </option>
              </b-select>
            </b-field>
            <div class="button-wrap">
              <b-button @click="$emit('closeModal')">
                Close
              </b-button>
              <b-button
                :disabled="refisterName === '' || refisterWhere === '' || refisterWhen === '' || refisterQuantity === null || refisterType === null"
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
              After clicking "Confirm Transaction" and seeing the word SEALED on the screen,<br>
              the ticket application button will appear on the ticket application page.
            </p>
          </div>
          <div v-if="showFlag && ticketInfo && !isCompleteRegister && ticketRequesters.length === 0" class="text-wrap">
            <p class="complete-register">
              チケットを登録済みです。編集/中断される場合は以下を入力して更新ボタンを押して下さい。<br>
              <span class="red">
                (中断はチケット名を空にして下さい)<br>
                (ユーザーがチケットを申請した後は、編集/中断は出来ませんのでご注意下さい)
              </span>
            </p>
            <b-field
              label="Name of Ticket"
              :message="ticketInfo.name === '' ? 'Please enter a value': ''"
              :type="{ 'is-success': ticketInfo.name != ''}"
            >
              <b-input
                v-model="ticketInfo.name"
                placeholder="e.g. Conversation Rights"
              />
            </b-field>
            <b-field
              label="Enter the location to be used"
              :message="ticketInfo.where_to_use === '' ? 'Please enter a value': ''"
              :type="{ 'is-success': ticketInfo.where_to_use != '', 'is-danger': ticketInfo.where_to_use === ''}"
            >
              <b-input
                v-model="ticketInfo.where_to_use"
                placeholder="e.g. on this website, on Live Streaming"
              />
            </b-field>
            <b-field
              label="How many times can it be used per capita?">
              <b-select
                v-model="ticketInfo.quantity"
                placeholder="Please select"
              >
                <option value="1">
                  1 times
                </option>
                <option value="1">
                  2 times
                </option>
                <option value="1">
                  3 times
                </option>
                <option value="1">
                  4 times
                </option>
                <option value="1">
                  5 times
                </option>
                <option value="1">
                  10 times
                </option>
              </b-select>
            </b-field>
            <div class="button-wrap">
              <b-button @click="$emit('closeModal')">
                Close
              </b-button>
              <b-button
                :disabled="ticketInfo.where_to_use === '' || ticketInfo.when_to_use === '' || ticketInfo.quantity === null || ticketInfo.type === null"
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
      default: null
    },
    dispenser: {
      type: Number,
      required: true,
      default: null
    }
  },
  data () {
    return {
      ticketInfo: null,
      refisterName: '',
      refisterWhere: '',
      refisterWhen: '',
      refisterType: null,
      refisterQuantity: null,
      transactionScanUrl: '',
      isCompleteRegister: false,
      isCompleteDispense: false,
      ticketRequesters: [],
      requestList: [],
      showFlag: false
    }
  },
  async mounted () {
    await this.getTicketInfo()
  },
  methods: {
    async getTicketInfo () {
      this.showFlag = false
      this.isCompleteRegister = false
      if (!this.ticketInfo) {
        try {
          const ticketInfo = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getTicketInfo),
              this.$fcl.args([
                this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
              ])
            ]
          ).then(this.$fcl.decode)
          this.ticketInfo = ticketInfo
          if (ticketInfo) {
            this.isCompleteRegister = true
          }
          await this.confirmRequesters()
        } catch (e) {
          console.log(e)
        }
      } else {
        await this.confirmRequesters()
      }
    },
    async registerTicketInfo () {
      if (this.isCompleteRegister) {
        this.refisterName = this.ticketInfo.name
        this.refisterType = this.ticketInfo.type
        this.refisterWhere = this.ticketInfo.where_to_use
        this.refisterWhen = this.ticketInfo.when_to_use
        this.refisterQuantity = parseInt(this.ticketInfo.quantity)
        window.alert('この後表示されるポップアップで承認を押して下さい。')
      } else {
        this.refisterQuantity = parseInt(this.refisterQuantity)
        const ret = window.confirm('登録を行いますと、チケット申請ボタンが表示されます。表示してよろしければこの後表示されるポップアップで承認を押して下さい。')
        if (!ret) {
          return
        }
      }
      try {
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.addTicketInfo),
            this.$fcl.args([
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
              this.$fcl.arg(this.refisterType, this.$fclArgType.UInt8),
              this.$fcl.arg(this.refisterName, this.$fclArgType.String),
              this.$fcl.arg(this.refisterWhere, this.$fclArgType.String),
              this.$fcl.arg(this.refisterWhen, this.$fclArgType.String),
              this.$fcl.arg(this.refisterQuantity, this.$fclArgType.UInt8)
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
        console.log(e)
      }
    },
    async confirmRequesters () {
      try {
        const ticketRequesters = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getTicketRequesters),
            this.$fcl.args([
              this.$fcl.arg(this.address, this.$fclArgType.Address),
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
            ])
          ]
        ).then(this.$fcl.decode)
        if (ticketRequesters === null) {
          this.ticketRequesters = []
        } else {
          this.ticketRequesters = ticketRequesters
        }
        await this.confirmReceivers()
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
        this.requestList = this.ticketRequesters.filter((obj) => { return !obj.done })
        this.showFlag = true
        console.log(this.ticketInfo, this.isCompleteRegister, 8888)
      } catch (e) {
        console.log(e)
      }
    },
    async dispenseTicket () {
      const addrList = this.requestList.map(obj => obj.address)
      try {
        const ticketQuantity = parseInt(this.ticketInfo.quantity)
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.dispenseTicket),
            this.$fcl.args([
              this.$fcl.arg(this.ticketInfo.name, this.$fclArgType.String),
              this.$fcl.arg(ticketQuantity, this.$fclArgType.UInt8),
              this.$fcl.arg(addrList, this.$fclArgType.Array(this.$fclArgType.Address))
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
        console.log(e)
      }
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
      }

      .important {
        color: green;
      }
    }
  }
}
</style>
