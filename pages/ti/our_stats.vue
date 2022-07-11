<template>
  <section>
    <div class="hero">
      <div class="hero--overlay">
        <div class="hero--content">
          <b-breadcrumb>
            <b-breadcrumb-item href="/?home">
              <b-icon
                icon="rotate-left"
                size="is-large"
              />
            </b-breadcrumb-item>
          </b-breadcrumb>

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
                <div v-if="statLinkPage != '' && !waitTransactionComplete" class="text-wrap">
                  {{ $t('operation_text84') }}:
                  <small>{{ statLinkPage }}</small>
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
              </h1>
              <p v-if="transactionScanUrl !== ''" class="check-transaction">
                <a :href="transactionScanUrl" target="_blank">{{ $t('operation_text56') }}</a>
              </p>
              <b-button
                :disabled="waitTransactionComplete"
                type="is-link is-light"
                @click="itemCountInput = 2; showInputModal = true"
              >
                {{ $t('operation_text79') }}
              </b-button>
              <b-button
                :disabled="waitTransactionComplete"
                type="is-link is-light"
                @click="showStats"
              >
                {{ $t('operation_text67') }}
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
        <section class="modal-card-body setting-modal">
          <b-field
            :label="$t('operation_text58')"
            :type="{ 'is-success': statTitleInput != ''}"
          >
            <b-input
              v-model="statTitleInput"
              maxlength="60"
              :placeholder="$t('operation_text59')"
              rounded
            />
          </b-field>
          <b-field
            :label="$t('operation_text63')"
            :type="{ 'is-success': nicknameInput != ''}"
          >
            <b-input
              v-model="nicknameInput"
              maxlength="20"
              placeholder="Nickname"
              rounded
            />
          </b-field>
          <b-field :label="$t('operation_text61')">
            <b-input
              v-model="statItem1Input"
              maxlength="60"
              :placeholder="$t('operation_text60') + '1.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult1Input"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
            />
          </b-field>
          <b-field>
            <b-input
              v-model="statItem2Input"
              maxlength="60"
              :placeholder="$t('operation_text60') + '2.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult2Input"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
            />
          </b-field>
          <b-field v-if="itemCountInput >= 3">
            <b-input
              v-model="statItem3Input"
              maxlength="60"
              :placeholder="$t('operation_text60') + '3.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult3Input"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
            />
          </b-field>
          <b-field v-if="itemCountInput >= 4">
            <b-input
              v-model="statItem4Input"
              maxlength="60"
              :placeholder="$t('operation_text60') + '4.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult4Input"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
            />
          </b-field>
          <b-field v-if="itemCountInput >= 5">
            <b-input
              v-model="statItem5Input"
              maxlength="60"
              :placeholder="$t('operation_text60') + '5.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult5Input"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
            />
          </b-field>
          <b-field v-if="itemCountInput >= 6">
            <b-input
              v-model="statItem6Input"
              maxlength="60"
              :placeholder="$t('operation_text60') + '6.'"
              rounded
              expanded
            />
            <b-input
              v-model="statResult6Input"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
            />
          </b-field>
          <div style="margin: 18px 0;">
            <b-button v-if="itemCountInput < 6" type="is-success is-light" icon-right="plus" @click="addInputs" />
            <b-field style="display: inline;">
              <b-tooltip
                :label="$t('operation_text83')"
                :active="switchShare == $t('operation_text82')"
                type="is-primary is-light"
                square
                always
              >
                <b-switch
                  v-model="switchShare"
                  :true-value="$t('operation_text81')"
                  :false-value="$t('operation_text82')"
                  type="is-warning"
                  style="padding-top: 7px;"
                >
                  {{ switchShare }}
                </b-switch>
              </b-tooltip>
            </b-field>
            <b-button
              :disabled="!statItem1Input || !statResult1Input || !statItem2Input || !statResult2Input || !nicknameInput"
              type="is-dark"
              style="float: right; margin-right: 3px;"
              @click="registerPoll"
            >
              {{ $t('operation_text12') }}
            </b-button>
          </div>
        </section>
      </div>
    </b-modal>

    <b-modal
      v-model="showModal"
      class="stats"
      has-modal-card
    >
      <div class="modal-card stats-list" style="width: auto">
        <section class="modal-card-body">
          <b-field v-if="linkedURLOnly == false" :label="$t('operation_text68') + ':'" />
          <b-select
            v-if="linkedURLOnly == false"
            v-model="selectedContributor"
            rounded
            expanded
          >
            <option
              v-for="data in registeredContributors"
              :key="data"
              :value="data"
            >
              {{ data }}
            </option>
          </b-select>
          <b-field :label="$t('operation_text58') + ':'" />
          <b-select
            v-model="selectedPole"
            rounded
            expanded
          >
            <option
              v-for="data in registeredPolls"
              :key="data.time"
              :value="data.time"
            >
              {{ data.title }}
            </option>
          </b-select>
          <b-field :label="$t('operation_text61') + '(%)'">
            <b-input
              v-model="statItem1"
              maxlength="60"
              :placeholder="$t('operation_text60') + '1.'"
              rounded
              expanded
              disabled
            />
            <b-input
              v-model="statResult1"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
              disabled
              style="min-width: 32vw;"
            />
          </b-field>
          <b-field>
            <b-input
              v-model="statItem2"
              maxlength="60"
              :placeholder="$t('operation_text60') + '2.'"
              rounded
              expanded
              disabled
            />
            <b-input
              v-model="statResult2"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
              disabled
              style="min-width: 32vw;"
            />
          </b-field>
          <b-field v-if="itemCount >= 3">
            <b-input
              v-model="statItem3"
              maxlength="60"
              :placeholder="$t('operation_text60') + '3.'"
              rounded
              expanded
              disabled
            />
            <b-input
              v-model="statResult3"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
              disabled
              style="min-width: 32vw;"
            />
          </b-field>
          <b-field v-if="itemCount >= 4">
            <b-input
              v-model="statItem4"
              maxlength="60"
              :placeholder="$t('operation_text60') + '4.'"
              rounded
              expanded
              disabled
            />
            <b-input
              v-model="statResult4"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
              disabled
              style="min-width: 32vw;"
            />
          </b-field>
          <b-field v-if="itemCount >= 5">
            <b-input
              v-model="statItem4"
              maxlength="60"
              :placeholder="$t('operation_text60') + '5.'"
              rounded
              expanded
              disabled
            />
            <b-input
              v-model="statResult5"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
              disabled
              style="min-width: 32vw;"
            />
          </b-field>
          <b-field v-if="itemCount >= 6">
            <b-input
              v-model="statItem6"
              maxlength="60"
              :placeholder="$t('operation_text60') + '6.'"
              rounded
              expanded
              disabled
            />
            <b-input
              v-model="statResult6"
              :placeholder="$t('operation_text61') + '(%)'"
              maxlength="30"
              rounded
              disabled
              style="min-width: 32vw;"
            />
          </b-field>
          <b-button class="download" type="is-info is-light" icon-right="download" style="position: absolute; top: 13px; right: 20px; height: 2.3rem; padding: 4px 12px;" @click="csvDownload">
            CSV
          </b-button>
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
      noticeTitle: '',
      transactionScanUrl: '',
      showModal: false,
      showInputModal: false,
      allStats: {},
      statTitle: '',
      statItem1: '',
      statItem2: '',
      statItem3: '',
      statItem4: '',
      statItem5: '',
      statItem6: '',
      statResult1: '',
      statResult2: '',
      statResult3: '',
      statResult4: '',
      statResult5: '',
      statResult6: '',
      nickname: '',
      itemCount: 2,
      statTitleInput: '',
      statItem1Input: '',
      statItem2Input: '',
      statItem3Input: '',
      statItem4Input: '',
      statItem5Input: '',
      statItem6Input: '',
      statResult1Input: '',
      statResult2Input: '',
      statResult3Input: '',
      statResult4Input: '',
      statResult5Input: '',
      statResult6Input: '',
      nicknameInput: '',
      itemCountInput: 2,
      registeredContributors: [],
      selectedContributor: null,
      registeredPolls: [],
      selectedPole: null,
      selectedIndex: null,
      waitTransactionComplete: false,
      switchShare: this.$t('operation_text81'),
      statLinkPage: '',
      tooltipActive: false,
      linkedURLOnly: false
    }
  },
  head () {
    return {
      title: 'Chain Work Tickets | Sharing Statistics',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Chain Work, Tickets, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
    }
  },
  watch: {
    selectedContributor: {
      handler (val) {
        const index = this.registeredContributors.findIndex((element) => {
          return element === val
        })
        if (index > -1 && index < this.registeredContributors.length) {
          const key = Object.keys(this.allStats)[index]
          this.registeredPolls = this.allStats[key].filter((obj) => {
            if (this.linkedURLOnly) {
              return obj.nickname !== obj.nickname.replace(/\|\|link\|\|$/, '')
            } else {
              return obj.nickname === obj.nickname.replace(/\|\|link\|\|$/, '')
            }
          })
          this.selectedPole = this.registeredPolls[0].time
        }
      }
    },
    selectedPole: {
      handler (val) {
        const index = this.registeredPolls.findIndex((element) => {
          return element.time === val
        })
        if (index > -1 && index < this.registeredPolls.length) {
          this.itemCount = 2
          this.statTitle = this.registeredPolls[index].title
          this.statItem1 = this.registeredPolls[index].answer1
          this.statItem2 = this.registeredPolls[index].answer2
          if (this.registeredPolls[index].answer3 && this.registeredPolls[index].answer3.length > 0) {
            this.itemCount = 3
          }
          if (this.registeredPolls[index].answer4 && this.registeredPolls[index].answer4.length > 0) {
            this.itemCount = 4
          }
          if (this.registeredPolls[index].answer5 && this.registeredPolls[index].answer5.length > 0) {
            this.itemCount = 5
          }
          if (this.registeredPolls[index].answer6 && this.registeredPolls[index].answer6.length > 0) {
            this.itemCount = 6
          }
          this.statItem3 = this.registeredPolls[index].answer3
          this.statItem4 = this.registeredPolls[index].answer4
          this.statItem5 = this.registeredPolls[index].answer5
          this.statItem6 = this.registeredPolls[index].answer6
          this.statResult1 = this.registeredPolls[index].value1
          this.statResult2 = this.registeredPolls[index].value2
          this.statResult3 = this.itemCount >= 3 ? this.registeredPolls[index].value3 : ''
          this.statResult4 = this.itemCount >= 4 ? this.registeredPolls[index].value4 : ''
          this.statResult5 = this.itemCount >= 5 ? this.registeredPolls[index].value5 : ''
          this.statResult6 = this.itemCount >= 6 ? this.registeredPolls[index].value6 : ''
          this.nickname = this.registeredPolls[index].nickname.replace(/\|\|link\|\|$/, '')
        }
      }
    }
  },
  mounted () {
    this.$fcl.currentUser.subscribe(this.setupWalletInfo)
    if (location.search.substr(0, 6) === '?link=') {
      this.showStatsFromLink()
    }
  },
  methods: {
    setupWalletInfo (user) {
      this.bloctoWalletUser = user
    },
    addInputs () {
      if (this.itemCountInput < 6) {
        this.itemCountInput++
      }
    },
    async showStats () {
      try {
        const stats = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getStats),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        this.registeredContributors = []
        this.allStats = stats
        if (Object.values(stats).length > 0) {
          Object.values(stats).forEach((data) => {
            let isPublic = false
            data.forEach((obj) => {
              if (obj.nickname === obj.nickname.replace(/\|\|link\|\|$/, '')) {
                isPublic = true
              }
            })
            if (isPublic) {
              this.registeredContributors.push(data[data.length - 1].nickname.replace(/\|\|link\|\|$/, ''))
            }
          })
          this.selectedContributor = this.registeredContributors[0]
          this.showModal = true
        } else {
          // No information registered.
          this.$buefy.toast.open({
            message: this.$t('operation_text64'),
            queue: false
          })
        }
      } catch (e) {
      }
    },
    async showStatsFromLink () {
      try {
        const stats = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getStats),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        this.registeredContributors = []
        this.allStats = {}
        const addrPortion = location.search.substr(6)
        Object.keys(stats).forEach((addr) => {
          if (addr.split('').slice(5, 15).reverse().join('') === addrPortion) {
            const arr = stats[addr]
            this.allStats[addr] = arr
            let isLinked = false
            arr.forEach((obj) => {
              if (obj.nickname !== obj.nickname.replace(/\|\|link\|\|$/, '')) {
                isLinked = true
              }
            })
            if (isLinked) {
              this.registeredContributors.push(arr[arr.length - 1].nickname.replace(/\|\|link\|\|$/, ''))
              this.linkedURLOnly = true
            }
            this.selectedContributor = this.registeredContributors[0]
            this.showModal = true
          }
        })
        if (this.registeredContributors.length === 0) {
          // No information registered.
          this.$buefy.toast.open({
            message: this.$t('operation_text64'),
            queue: false
          })
        }
      } catch (e) {
      }
    },
    async registerPoll () {
      this.noticeTitle = ''
      if (!this.bloctoWalletUser.addr) {
        await this.flowWalletLogin()
      } else {
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
      }
      if (this.bloctoWalletUser.addr) {
        if (!this.statItem3Input || !this.statResult3Input) {
          this.statItem3Input = ''
          this.statResult3Input = ''
        }
        if (!this.statItem4Input || !this.statResult4Input) {
          this.statItem4Input = ''
          this.statResult4Input = ''
        }
        if (!this.statItem5Input || !this.statResult5Input) {
          this.statItem5Input = ''
          this.statResult5Input = ''
        }
        if (!this.statItem6Input || !this.statResult6Input) {
          this.statItem6Input = ''
          this.statResult6Input = ''
        }
        let nickname = this.nicknameInput
        if (this.switchShare === this.$t('operation_text82') && nickname === nickname.replace(/\|\|link\|\|$/, '')) {
          nickname += '||link||'
        }

        // loading
        const loadingComponent = this.$buefy.loading.open({
          container: null
        })
        setTimeout(() => loadingComponent.close(), 3 * 1000)

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
                  this.$fcl.arg(nickname, this.$fclArgType.String),
                  this.$fcl.arg(this.statTitleInput, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem1Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem2Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem3Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem4Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem5Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem6Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult1Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult2Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult3Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult4Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult5Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult6Input, this.$fclArgType.String)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
          } else {
            const stats = await this.$fcl.send(
              [
                this.$fcl.script(FlowScripts.getStats),
                this.$fcl.args([
                ])
              ]
            ).then(this.$fcl.decode)
            if (stats[this.bloctoWalletUser.addr] && stats[this.bloctoWalletUser.addr].length > 0) {
              this.selectedIndex = stats[this.bloctoWalletUser.addr].length
            }
            transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(FlowTransactions.addStat),
                this.$fcl.args([
                  this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
                  this.$fcl.arg(nickname, this.$fclArgType.String),
                  this.$fcl.arg(this.statTitleInput, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem1Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem2Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem3Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem4Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem5Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statItem6Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult1Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult2Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult3Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult4Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult5Input, this.$fclArgType.String),
                  this.$fcl.arg(this.statResult6Input, this.$fclArgType.String)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
          }
          this.transactionScanUrl = `https://flowscan.org/transaction/${transactionId}`
          this.waitTransactionComplete = true
          this.showInputModal = false
          this.checkTransactionComplete(0)
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
      this.noticeTitle = this.$t('operation_text80')
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
          if (this.switchShare === this.$t('operation_text82')) {
            this.statLinkPage = 'https://chain-work.com/ti/our_stats?link=' + this.bloctoWalletUser.addr.split('').slice(5, 15).reverse().join('')
          }
          this.waitTransactionComplete = false
          clearInterval(timerID)
        }
      }, 4000)
    },
    async clickCopy () {
      await navigator.clipboard.writeText(this.statLinkPage)
      this.tooltipActive = true
    },
    async flowWalletLogout () {
      await this.$fcl.unauthenticate()
    },
    csvDownload () {
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'Nickname, Date, Title, Item1, Result1, Item2, Result2, Item3, Result3, Item4, Result4, Item5, Result5, Item6, Result6' + '\r\n'

      this.registeredPolls.forEach((row) => {
        const datetime = new Date(parseInt(row.time) * 1000).toLocaleDateString() + ' ' + new Date(parseInt(row.time) * 1000).toLocaleTimeString()
        const rowArray = [
          row.nickname.replace(/\|\|link\|\|$/, ''), datetime, row.title,
          row.answer1, row.value1,
          row.answer2, row.value2,
          row.answer3, row.value3,
          row.answer4, row.value4,
          row.answer5, row.value5,
          row.answer6, row.value6
        ]
        csvContent += rowArray.join(',') + '\r\n'
      })
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'statistics_result.csv')
      document.body.appendChild(link)
      link.click()
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

  .text-wrap {
    margin-top: 8px;
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
      font-size: 16px;
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

.modal {
  line-height: 1.0;

  .field:not(:last-child) {
    margin-bottom: 0.4rem;
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
