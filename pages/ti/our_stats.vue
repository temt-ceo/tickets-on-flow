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
              </h1>
              <p v-if="transactionScanUrl !== ''" class="check-transaction">
                <a :href="transactionScanUrl" target="_blank">{{ $t('operation_text56') }}</a>
              </p>
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
      v-model="showModal"
      class="stats"
      has-modal-card
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <b-field :label="$t('operation_text68') + ':'" />
          <b-select
            v-model="selectedContributor"
            rounded
            expanded
          >
            <option
              v-for="data in registeredContributors"
              :value="data"
              :key="data">
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
              :value="data.time"
              :key="data.time">
              {{ data.title }}
            </option>
          </b-select>
          <div class="stats-percent" style="color: #bbb; position: absolute; right: 25px; margin-top: 49px; z-index: 2;">%</div>
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
              type="number"
              min="0"
              rounded
              disabled
            />
          </b-field>
          <div class="stats-percent" style="color: #bbb; position: absolute; right: 25px; margin-top: 14px; z-index: 2;">%</div>
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
              type="number"
              min="0"
              rounded
              disabled
            />
          </b-field>
          <div v-if="itemCount >= 3" class="stats-percent" style="color: #bbb; position: absolute; right: 25px; margin-top: 14px; z-index: 2;">%</div>
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
              type="number"
              min="0"
              rounded
              disabled
            />
          </b-field>
          <div v-if="itemCount >= 4" class="stats-percent" style="color: #bbb; position: absolute; right: 25px; margin-top: 14px; z-index: 2;">%</div>
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
              type="number"
              min="0"
              rounded
              disabled
            />
          </b-field>
          <b-button @click="csvDownload" class="download" type="is-info is-light" icon-right="download" style="float: right; margin-top: -15px;">CSV</b-button>
        </section>
      </div>
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'

export default {
  name: 'CrowdfundingMaintenancePage',
  data () {
    return {
      bloctoWalletUser: {},
      address: null,
      noticeTitle: '',
      transactionScanUrl: '',
      showModal: false,
      allStats: {},
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
      registeredContributors: [],
      selectedContributor: null,
      registeredPolls: [],
      selectedPole: null,
      selectedIndex: null,
      waitTransactionComplete: false
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
          this.registeredPolls = this.allStats[key]
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
  methods: {
    addInputs () {
      if (this.itemCount < 4) {
        this.itemCount++
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
            this.registeredContributors.push(data[data.length - 1].nickname)
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
    async flowWalletLogout () {
      await this.$fcl.unauthenticate()
    },
    csvDownload () {
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += 'Nickname, Date, Title, Item1, Item2, Item3, Item4, Result1, Result2, Result3, Result4' + '\r\n'

      this.registeredPolls.forEach((row) => {
        const datetime = new Date(parseInt(row.time) * 1000).toLocaleDateString() + ' ' + new Date(parseInt(row.time) * 1000).toLocaleTimeString()
        const rowArray = [row.nickname, datetime, row.title, row.answer1, row.answer2, row.answer3, row.answer4, parseFloat(row.value1).toFixed(1).toString() + '%', parseFloat(row.value2).toFixed(1).toString() + '%', parseFloat(row.value3).toFixed(1).toString() + '%', parseFloat(row.value4).toFixed(1).toString() + '%']
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

.field:not(:last-child) {
  margin-bottom: 0.2rem;
  margin-top: 0.55rem;
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
