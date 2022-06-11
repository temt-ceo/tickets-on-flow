<template>
  <section>
    <div class="hero">
      <div class="hero--overlay">
        <div class="hero--content">
          <section class="section">
            <h1 class="page-title">
              {{ $t('operation_text55') }}
            </h1>
            <div class="content">
              <h1 class="notice">
                {{ noticeTitle }}
                <b-skeleton size="is-large" :active="waitTransactionComplete" />
                <b-skeleton size="is-large" :active="waitTransactionComplete" />
                <b-skeleton size="is-large" width="60%" :active="waitTransactionComplete" />
              </h1>
              <p v-if="transactionScanUrl !== ''" class="check-transaction">
                <a :href="transactionScanUrl" target="_blank">{{ $t('operation_text56') }}</a>
              </p>
              <b-button
                :disabled="waitTransactionComplete"
                type="is-link is-light"
                @click="showInputModal = true"
              >
                {{ $t('operation_text57') }}
              </b-button>
              <b-button
                :disabled="waitTransactionComplete"
                type="is-link is-light"
                @click="showEditStats"
              >
                {{ $t('operation_text62') }}
              </b-button>
            </div>
          </section>
        </div>
      </div>
    </div>
    <b-modal
      v-model="showInputModal"
      has-modal-card
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <b-field
            :label="$t('operation_text58')"
            :type="{ 'is-success': statTitle != ''}"
          >
            <b-input
              v-model="statTitle"
              maxlength="60"
              :placeholder="$t('operation_text59')"
              rounded
            />
          </b-field>
          <b-field
            :label="$t('operation_text63')"
            :type="{ 'is-success': nickname != ''}"
          >
            <b-input
              v-model="nickname"
              maxlength="20"
              placeholder="Nickname"
              rounded
            />
          </b-field>
          <b-field :label="$t('operation_text61')">
            <b-input
              v-model="statItem1"
              maxlength="60"
              :placeholder="$t('operation_text60') + '1.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult1"
              :placeholder="$t('operation_text61') + '(%)'"
              type="number"
              min="0"
              rounded
            />
          </b-field>
          <b-field>
            <b-input
              v-model="statItem2"
              maxlength="60"
              :placeholder="$t('operation_text60') + '2.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult2"
              :placeholder="$t('operation_text61') + '(%)'"
              type="number"
              min="0"
              rounded
            />
          </b-field>
          <b-field v-if="itemCount >= 3">
            <b-input
              v-model="statItem3"
              maxlength="60"
              :placeholder="$t('operation_text60') + '3.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult3"
              :placeholder="$t('operation_text61') + '(%)'"
              type="number"
              min="0"
              rounded
            />
          </b-field>
          <b-field v-if="itemCount >= 4">
            <b-input
              v-model="statItem4"
              maxlength="60"
              :placeholder="$t('operation_text60') + '4.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult4"
              :placeholder="$t('operation_text61') + '(%)'"
              type="number"
              min="0"
              rounded
            />
          </b-field>
          <div>
            <b-button v-if="itemCount < 4" type="is-danger" icon-right="plus" @click="addInputs" />
            <b-button
              :disabled="!statItem1 || !statResult1 || !statItem2 || !statResult2 || !nickname"
              type="is-dark"
              style="float: right; margin-right: 10px;"
              @click="registerPoll"
            >
              {{ $t('operation_text12') }}
            </b-button>
          </div>
        </section>
      </div>
    </b-modal>

    <b-modal
      v-model="showEditModal"
      has-modal-card
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <b-select
            v-model="selectedPole"
            rounded
            expanded
          >
            <option
              v-for="data in registeredPolls"
              :value="data.time"
              :key="data.time">
              {{ data.title }}
            </option>
          </b-select>
          <b-field
            :label="$t('operation_text58')"
            :type="{ 'is-success': statTitle != ''}"
          >
            <b-input
              v-model="statTitle"
              maxlength="60"
              :placeholder="$t('operation_text59')"
              rounded
            />
          </b-field>
          <b-field
            :label="$t('operation_text63')"
            :type="{ 'is-success': nickname != ''}"
          >
            <b-input
              v-model="nickname"
              maxlength="20"
              placeholder="Nickname"
              rounded
            />
          </b-field>
          <b-field :label="$t('operation_text61')">
            <b-input
              v-model="statItem1"
              maxlength="60"
              :placeholder="$t('operation_text60') + '1.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult1"
              :placeholder="$t('operation_text61') + '(%)'"
              type="number"
              min="0"
              rounded
            />
          </b-field>
          <b-field>
            <b-input
              v-model="statItem2"
              maxlength="60"
              :placeholder="$t('operation_text60') + '2.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult2"
              :placeholder="$t('operation_text61') + '(%)'"
              type="number"
              min="0"
              rounded
            />
          </b-field>
          <b-field v-if="itemCount >= 3">
            <b-input
              v-model="statItem3"
              maxlength="60"
              :placeholder="$t('operation_text60') + '3.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult3"
              :placeholder="$t('operation_text61') + '(%)'"
              type="number"
              min="0"
              rounded
            />
          </b-field>
          <b-field v-if="itemCount >= 4">
            <b-input
              v-model="statItem4"
              maxlength="60"
              :placeholder="$t('operation_text60') + '4.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult4"
              :placeholder="$t('operation_text61') + '(%)'"
              type="number"
              min="0"
              rounded
            />
          </b-field>
          <div>
            <b-button v-if="itemCount < 4" type="is-danger" icon-right="plus" @click="addInputs" />
            <b-button
              :disabled="!statItem1 || !statResult1 || !statItem2 || !statResult2 || !nickname"
              type="is-dark"
              style="float: right; margin-right: 10px;"
              @click="editPoll"
            >
              {{ $t('operation_text13') }}
            </b-button>
          </div>
        </section>
      </div>
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'

export default {
  name: 'CrowdfundingMaintenancePage',
  data () {
    return {
      bloctoWalletUser: {},
      address: null,
      noticeTitle: '',
      transactionScanUrl: '',
      showInputModal: false,
      showEditModal: false,
      statTitle: '',
      statItem1: '',
      statItem2: '',
      statItem3: '',
      statItem4: '',
      statResult1: null,
      statResult2: null,
      statResult3: null,
      statResult4: null,
      nickname: '',
      itemCount: 2,
      registeredPolls: [],
      selectedPole: null,
      selectedIndex: null,
      waitTransactionComplete: false
    }
  },
  watch: {
    showEditModal: {
      handler (val) {
        if (val === false) {
          this.itemCount = 2
        }
      }
    },
    showInputModal: {
      handler (val) {
        if (val === false) {
          this.itemCount = 2
        }
      }
    },
    selectedPole: {
      handler (val) {
        const index = this.registeredPolls.findIndex((element) => {
          return element.time === val
        })
        if (index > -1 && index < this.registeredPolls.length) {
          this.statTitle = this.registeredPolls[index].title
          this.statItem1 = this.registeredPolls[index].answer1
          this.statItem2 = this.registeredPolls[index].answer2
          if (this.registeredPolls[index].answer3 && this.registeredPolls[index].answer3.length > 0) {
            this.itemCount = 3
          }
          if (this.registeredPolls[index].answer4 && this.registeredPolls[index].answer4.length > 0) {
            this.itemCount = 4
          }
          this.statItem3 = this.registeredPolls[index].answer3
          this.statItem4 = this.registeredPolls[index].answer4
          this.statResult1 = parseFloat(this.registeredPolls[index].value1, 1)
          this.statResult2 = parseFloat(this.registeredPolls[index].value2, 1)
          this.statResult3 = this.itemCount >= 3 ? parseFloat(this.registeredPolls[index].value3, 1) : null
          this.statResult4 = this.itemCount >= 4 ? parseFloat(this.registeredPolls[index].value4, 1) : null
          this.nickname = this.registeredPolls[index].nickname
          this.selectedIndex = index
        }
      }
    }
  },
  mounted () {
    this.$fcl.currentUser.subscribe(this.setupWalletInfo)
  },
  methods: {
    addInputs () {
      if (this.itemCount < 4) {
        this.itemCount++
      }
    },
    async showEditStats () {
      if (!this.bloctoWalletUser.addr) {
        await this.flowWalletLogin()
      }
      if (this.bloctoWalletUser.addr) {
        try {
          const stats = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.getStats),
              this.$fcl.args([
              ])
            ]
          ).then(this.$fcl.decode)
          if (stats[this.bloctoWalletUser.addr] && stats[this.bloctoWalletUser.addr].length > 0) {
            this.registeredPolls = stats[this.bloctoWalletUser.addr]
            this.selectedPole = this.registeredPolls[0].time
            this.showEditModal = true
          } else {
            // No information registered.
            this.$buefy.toast.open({
              message: this.$t('operation_text64'),
              queue: false
            })
          }
        } catch (e) {
        }
      }
    },
    async flowWalletLogin () {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: this.$t('help_text18'),
        type: 'is-danger',
        position: 'is-bottom-left',
        actionText: null,
        queue: false,
        onAction: () => {
        }
      })
      await this.$fcl.authenticate()
    },
    async flowWalletLogout () {
      await this.$fcl.unauthenticate()
    },
    setupWalletInfo (user) {
      this.bloctoWalletUser = user

      if (this.bloctoWalletUser?.addr) {
        this.address = this.bloctoWalletUser?.addr
      }
    },
    async registerPoll () {
      this.noticeTitle = ''
      if (!this.bloctoWalletUser.addr) {
        await this.flowWalletLogin()
      }
      if (this.bloctoWalletUser.addr) {
        if (!this.statItem3 || !this.statResult3) {
          this.statItem3 = ''
          this.statResult3 = 0
        }
        if (!this.statItem4 || !this.statResult4) {
          this.statItem4 = ''
          this.statResult4 = 0
        }

        try {
          const hasStatsVault = await this.$fcl.send(
            [
              this.$fcl.script(FlowScripts.hasStatsVault),
              this.$fcl.args([
                this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
              ])
            ]
          ).then(this.$fcl.decode)
          let transactionId = null
          if (!hasStatsVault) {
            this.selectedIndex = 0
            transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(FlowTransactions.createStat),
                this.$fcl.args([
                  this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
                  this.$fcl.arg(this.nickname, this.$fclArgType.String),
                  this.$fcl.arg(this.statTitle, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem1, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem2, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem3, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem4, this.$fclArgType.String),
                  this.$fcl.arg(parseFloat(this.statResult1).toFixed(1), this.$fclArgType.UFix64),
                  this.$fcl.arg(parseFloat(this.statResult2).toFixed(1), this.$fclArgType.UFix64),
                  this.$fcl.arg(parseFloat(this.statResult3).toFixed(1), this.$fclArgType.UFix64),
                  this.$fcl.arg(parseFloat(this.statResult4).toFixed(1), this.$fclArgType.UFix64)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
          } else {
            this.selectedIndex = this.registeredPolls.length
            transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(FlowTransactions.addStat),
                this.$fcl.args([
                  this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
                  this.$fcl.arg(this.nickname, this.$fclArgType.String),
                  this.$fcl.arg(this.statTitle, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem1, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem2, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem3, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem4, this.$fclArgType.String),
                  this.$fcl.arg(parseFloat(this.statResult1).toFixed(1), this.$fclArgType.UFix64),
                  this.$fcl.arg(parseFloat(this.statResult2).toFixed(1), this.$fclArgType.UFix64),
                  this.$fcl.arg(parseFloat(this.statResult3).toFixed(1), this.$fclArgType.UFix64),
                  this.$fcl.arg(parseFloat(this.statResult4).toFixed(1), this.$fclArgType.UFix64)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
          }
          this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
          this.waitTransactionComplete = true
          this.showInputModal = false
          this.checkTransactionComplete(0)
        } catch (e) {
          console.log(e)
        }
      }
    },
    async editPoll () {
      this.noticeTitle = ''
      if (!this.statItem3 || !this.statResult3) {
        this.statItem3 = ''
        this.statResult3 = 0
      }
      if (!this.statItem4 || !this.statResult4) {
        this.statItem4 = ''
        this.statResult4 = 0
      }

      try {
        const transactionId = await this.$fcl.send(
          [
            this.$fcl.transaction(FlowTransactions.updateStat),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
              this.$fcl.arg(String(this.selectedIndex), this.$fclArgType.UInt32),
              this.$fcl.arg(this.nickname, this.$fclArgType.String),
              this.$fcl.arg(this.statTitle, this.$fclArgType.String),
              this.$fcl.arg(this.statItem1, this.$fclArgType.String),
              this.$fcl.arg(this.statItem2, this.$fclArgType.String),
              this.$fcl.arg(this.statItem3, this.$fclArgType.String),
              this.$fcl.arg(this.statItem4, this.$fclArgType.String),
              this.$fcl.arg(parseFloat(this.statResult1).toFixed(1), this.$fclArgType.UFix64),
              this.$fcl.arg(parseFloat(this.statResult2).toFixed(1), this.$fclArgType.UFix64),
              this.$fcl.arg(parseFloat(this.statResult3).toFixed(1), this.$fclArgType.UFix64),
              this.$fcl.arg(parseFloat(this.statResult4).toFixed(1), this.$fclArgType.UFix64)
            ]),
            this.$fcl.payer(this.$fcl.authz),
            this.$fcl.proposer(this.$fcl.authz),
            this.$fcl.authorizations([this.$fcl.authz]),
            this.$fcl.limit(9999)
          ]
        ).then(this.$fcl.decode)
        this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
        this.waitTransactionComplete = true
        this.showEditModal = false
        const expectedUpdateCount = this.registeredPolls[this.selectedIndex].update_count + 1
        this.checkTransactionComplete(expectedUpdateCount)
      } catch (e) {
        console.log(e)
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
    checkTransactionComplete (expectedUpdateCount) {
      this.callToast()

      const timerID = setInterval(async () => {
        const stats = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getStats),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        const myStat = stats[this.bloctoWalletUser.addr]
        if (myStat && myStat[this.selectedIndex] && parseInt(myStat[this.selectedIndex].update_count) === expectedUpdateCount) {
          this.noticeTitle = this.$t('operation_text65')
          this.waitTransactionComplete = false
          clearInterval(timerID)
        }
      }, 4000)
    }
  }
}
</script>

<style lang="scss" scoped>

.section {
  padding-bottom: 100px;
  padding: 0 1.5rem;

  .page-title {
    font-size: 24px;
    text-align: center;
    padding: 0 5px;
  }

  .content {
    margin-bottom: 80px;
    padding: 16px;
    text-align: center;
    max-width: 800px;

    h1 {
      margin: 20px 0 16px;
    }

    .description {
      font-size: 16px;
    }

    .notice {
      font-size: 18px;
      color: white;
    }

    .check-transaction a {
      font-size: 16px;
      text-decoration: underline;
    }

    .button {
      width: 90%;
      border-radius: 20px;
      margin: 18px 0;
      max-width: 400px;

      &.to-top {
        margin-top: 34px;
      }
    }
  }
}

.hero {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 92vh;
}

.hero--video {
  min-width: 1980px;
  z-index: 1;
}

.hero--overlay {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-image: radial-gradient(#3e9, #1b1c50);
  background-size: cover;
  z-index: 2;
  opacity: 0.87;
}

.hero--content {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: #dadff4;
}

.hero--bottom {
  width: 100%;
  height: 50vh;
  background-color: #1c1c1c;
  background-image: radial-gradient(#3e9, #1b1c50);
}
</style>
