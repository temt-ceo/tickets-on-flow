<template>
  <section>
    <div class="hero">
      <video class="hero--video" src="https://static.videezy.com/system/resources/previews/000/012/739/original/Particles_3_60s_2kres_1.mp4" muted autoplay playsinline />
      <div class="hero--overlay">
        <div class="hero--content">
          <b-breadcrumb>
              <b-breadcrumb-item href="/?return=true">
                <b-icon
                  icon="rotate-left"
                  size="is-large">
                </b-icon>
              </b-breadcrumb-item>
          </b-breadcrumb>

          <section class="section">
            <div v-if="ticketName && ticketName.length > 0">
              <h1 class="page-title">
                {{ ticketName }}
              </h1>
              <hr class="separator">
              <div class="content">
                <p v-if="bloctoWalletUser.addr" class="description">
                  (Wallet Address: {{ bloctoWalletUser.addr }})
                </p>
                <h1 class="notice">
                  {{ noticeTitle }}
                  <b-skeleton size="is-large" height="70px" :active="waitTransactionComplete"></b-skeleton>
                  <b-skeleton size="is-large" width="60%" :active="waitTransactionComplete"></b-skeleton>
                  <ticket-date-time
                    v-if="ticketInfo.type == 0"
                    :ticketWhen0="ticketWhenWeek"
                    :ticketWhen1="ticketWhenTime"
                    :dispenser="dispenser"
                  />
                </h1>
                <h1 v-if="code" class="code">
                  CODE: {{ code }}
                </h1>
                <p v-if="transactionScanUrl !== ''" class="check-transaction">
                  <a :href="transactionScanUrl" target="_blank">Confirm the transaction</a>
                </p>
                <b-button
                  v-if="ticketStatus === 4 && !code"
                  type="is-link"
                  @click="requestCode"
                >
                  {{ $t('ticket_text21') }}
                </b-button>
                <b-button
                  type="is-link is-light"
                  @click="showConfirmModal = true"
                >
                  <span v-if="ticketInfo.type == 0">{{ $t('ticket_text7') }}</span>
                  <span v-if="ticketInfo.type == 1">{{ $t('ticket_text52') }}</span>
                </b-button>
                <b-button
                  v-if="ticketStatus === 3"
                  @click="useTicket"
                >
                  {{ $t('ticket_text22') }}
                </b-button>
                <b-button
                  v-if="ticketStatus <= 1 && bloctoWalletUser.addr && ticketInfo.type == 0"
                  type="is-link is-light"
                  @click="requestTicket"
                >
                 {{ $t('ticket_text23') }}
                </b-button>
                <b-button
                  v-if="bloctoWalletUser.addr && ticketStatus === 2"
                  type="is-warning is-light"
                  @click="getRequestStatus"
                >
                  <span v-if="ticketInfo.type == 0">{{ $t('ticket_text24') }}</span>
                  <span v-if="ticketInfo.type == 1">{{ $t('operation_text38') }}</span>
                </b-button>
                <b-button
                  v-if="ticketStatus <= 2 && bloctoWalletUser.addr && ticketInfo.type == 1"
                  type="is-link is-light"
                  @click="crowdfund"
                >
                 {{ $t('ticket_text54') }}
                </b-button>

                <b-button
                  v-if="ticketName !== '' && !bloctoWalletUser.addr"
                  type="is-success is-light"
                  @click="walletLogin"
                >
                  Connect Wallet
                </b-button>
              </div>
            </div>
            <div v-if="!ticketName">
              <div class="content">
                <div>
                  {{ $t('ticket_text25') }}
                </div>
                <b-button
                  tag="nuxt-link"
                  to="/"
                  type="is-warning is-light"
                  class="to-top"
                >
                  {{ $t('ticket_text26') }}
                </b-button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    <b-modal v-model="showConfirmModal">
      <check-ticket-modal
        :ticket="ticketInfo"
        @closeModal="showConfirmModal=false"
      />
    </b-modal>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'
import FlowTransactions from '~/cadence/transactions'
import CheckTicketModal from '~/components/common/CheckTicketModal'
import TicketDateTime from '~/components/common/TicketDateTime'

export default {
  name: 'TicketPage',
  components: {
    CheckTicketModal,
    TicketDateTime
  },
  data () {
    return {
      bloctoWalletUser: {},
      dispenser: null,
      code: null,
      ticketInfo: null,
      ticketTokenId: null,
      ticketName: '',
      ticketWhenWeek: null,
      ticketWhenTime: null,
      price: null,
      ticketStatus: 0, // 0: init, 1: can request a ticket, 2: ticket requested, 3: can use a ticket, 4: can request a code
      latestRequest: null,
      transactionScanUrl: '',
      noticeTitle: '',
      currentPageName: location.pathname.replace(/\/ti\//, '').replace(/\//g, ''),
      showConfirmModal: false,
      waitTransactionComplete: false,
      totalRemittance: null
    }
  },
  computed: {
    tickets: {
      get () {
        return this.$store.state.tickets
      }
    }
  },
  async mounted () {
    this.getTicketInfo(location.pathname)
    await this.$fcl.currentUser.subscribe(this.setupUserInitialInfo)
    await this.checkCurrentStatus()
  },
  methods: {
    async getTicketInfo (pathname) {
      let ticketInfo = this.tickets.find(obj => obj.domain === pathname.replace(/\/ti\//, '').replace(/\//g, ''))
      if (!ticketInfo) {
        await this.getTickets()
        ticketInfo = this.tickets.find(obj => obj.domain === pathname.replace(/\/ti\//, '').replace(/\//g, ''))
      }
      this.ticketInfo = ticketInfo
      if (this.ticketInfo) {
        this.dispenser = ticketInfo.dispenser_id
        const ticketName = ticketInfo.name.split('||@')
        this.ticketName = ticketName[0]
        this.price = ticketInfo.price.replace(/\.?0+$/, '')
        const when = ticketInfo.when_to_use.split('||')
        if (when.length >= 2) {
          this.ticketWhenWeek = when[0]
          this.ticketWhenTime = when[1]
        }
      }
    },
    async walletLogin () {
      if (!this.bloctoWalletUser.addr) {
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
    async setupUserInitialInfo (user) {
      this.bloctoWalletUser = user
      await this.checkCurrentStatus()
    },
    async checkCurrentStatus () {
      if (this.bloctoWalletUser.addr) {
        const ret = await this.isTicketVaultReady()
        if (ret) {
          const data = await this.getRequestStatus(true)
          if (data) {
            // このdispenserから過去チケットをリクエストしたことがある
            if (!data.latest_token) {
              // まだチケットを配布されていない。
              this.ticketStatus = 2
            } else {
              // チケットを配布された過去がある
              const usedTime = await this.getTicketUsedTime()
              if (!usedTime) {
                // まだ未使用
                this.ticketStatus = 3
              } else {
                // チケット使用済み
                const lastUsedTime = parseInt(usedTime.replace(/.0+$/, '')) * 1000
                const pastTime = parseInt((new Date(lastUsedTime).getTime() - new Date().getTime()) / 1000)
                const h = Math.floor(pastTime / 3600)
                if (h <= -4) {
                  // 4時間以上経過
                  this.ticketStatus = 1 // 新しくリクエストできる
                } else {
                  this.ticketStatus = 4
                }
              }
            }
            if (this.ticketInfo.type === 1) {
              this.totalRemittance = parseFloat(data.paid).toFixed(1)
            }
          } else {
            this.ticketStatus = 1
          }
        } else {
          this.ticketStatus = 1 // can request a ticket
        }
      } else {
        this.bloctoWalletUser = {}
        this.ticketStatus = 0
      }

      switch (this.ticketStatus) {
        case 0:
          this.noticeTitle = 'Please log in to your wallet' // 0: init
          break
        case 1:
          if (this.ticketInfo.type === 0) {
            this.noticeTitle = this.$t('operation_text33') // 1: can request a ticket
          } else if (this.ticketInfo.type === 1) {
            this.noticeTitle = this.$t('operation_text40') // 1: can crowdfund
          }
          break
        case 2:
          if (this.ticketInfo.type === 0) {
            this.noticeTitle = this.$t('operation_text32') // 2: ticket requested
          } else if (this.ticketInfo.type === 1) {
            this.noticeTitle = this.$t('operation_text37') // 2: crowdfunded
          }
          break
        case 3:
          this.noticeTitle = this.$t('operation_text35') // 3: can use a ticket
          break
        case 4:
          this.noticeTitle = 'Tap the Request a Code button. And save in texts.' // 4: can request a code
          break
      }
    },
    async isTicketVaultReady () {
      try {
        const ticketVault = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.hasTicketResource),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address)
            ])
          ]
        ).then(this.$fcl.decode)
        if (ticketVault !== null) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    },
    async getRequestStatus (checkOnly) {
      try {
        this.noticeTitle = ''
        const result = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getTicketRequestStatus),
            this.$fcl.args([
              this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
              this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
            ])
          ]
        ).then(this.$fcl.decode)
        if (result) {
          if (checkOnly !== true) {
            const latestRequestTime = parseInt(result.time.replace(/.0+$/, '')) * 1000
            this.latestRequest = new Date(latestRequestTime)
            const mo = this.latestRequest.getMonth().toString()
            const d = this.latestRequest.getDate().toString()
            const requestDate = `${this.latestRequest.getFullYear()}/${mo.length > 1 ? mo : '0' + mo}/${d.length > 1 ? d : '0' + d}`
            const h = this.latestRequest.getHours().toString()
            const m = this.latestRequest.getMinutes().toString()
            const requestHour = `${h.length > 1 ? h : '0' + h}: ${m.length > 1 ? m : '0' + m}`
            let message = ''
            if (this.ticketInfo.type === 0) {
              message = `Last Request Date: ${requestDate} ${requestHour}`
            } else if (this.ticketInfo.type === 1) {
              message = `${this.$t('operation_text39')}: ${parseFloat(result.paid).toFixed(1)} $FLOW`
            }

            const toast = this.$buefy.toast.open({
              indefinite: true,
              message
            })
            setTimeout(() => {
              toast.close()
            }, 5000)
          } else {
            return result
          }
        }
      } catch (e) {
      }
    },
    async requestTicket () {
      const ret = await this.isTicketVaultReady()
      let transactionCode = ''
      if (ret) {
        transactionCode = FlowTransactions.requestMoreTicket
      } else {
        transactionCode = FlowTransactions.requestTicket
      }
      this.$buefy.dialog.confirm({
        message: this.$t('ticket_text50'),
        onConfirm: async () => {
          try {
            // loading
            const loadingComponent = this.$buefy.loading.open({
              container: null
            })
            setTimeout(() => loadingComponent.close(), 3 * 1000)

            this.$buefy.snackbar.open({
              duration: 30000, // 30 seconds
              message: this.$t('operation_text17') + `↗︎ <a href="https://testnet.flowscan.org/account/${this.bloctoWalletUser?.addr}" target="_blank">${this.$t('operation_text31')}</a>`,
              type: 'is-danger',
              position: 'is-bottom-left',
              actionText: null,
              queue: false,
              onAction: () => {
              }
            })

            const transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(transactionCode),
                this.$fcl.args([
                  this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
            this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
            this.noticeTitle = this.$t('operation_text32')
            this.ticketStatus = 2
            this.callToast()
            return transactionId
          } catch (e) {
          }
        }
      })
    },
    useTicket () {
      try {
        this.$buefy.dialog.confirm({
          message: `This process requires ${this.price}$FLOW. <br>Tap "Approve" on the next wallet pop-up.`,
          confirmText: 'Agree',
          onConfirm: async () => {
            // loading
            const loadingComponent = this.$buefy.loading.open({
              container: null
            })
            setTimeout(() => loadingComponent.close(), 3 * 1000)

            const transactionId = await this.$fcl.send(
              [
                this.$fcl.transaction(FlowTransactions.useTicket),
                this.$fcl.args([
                  this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
                  this.$fcl.arg(this.ticketTokenId, this.$fclArgType.UInt64),
                  this.$fcl.arg(parseFloat(this.price).toFixed(2), this.$fclArgType.UFix64)
                ]),
                this.$fcl.payer(this.$fcl.authz),
                this.$fcl.proposer(this.$fcl.authz),
                this.$fcl.authorizations([this.$fcl.authz]),
                this.$fcl.limit(9999)
              ]
            ).then(this.$fcl.decode)
            this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
            this.noticeTitle = `You used ${this.ticketName} ticket. <br>Request a code after 10 seconds since the transaction takes 10 seconds to complete.`
            this.ticketStatus = 4
            this.callToast()
            return transactionId
          }
        })
      } catch (e) {
      }
    },
    crowdfund () {
      if (this.totalRemittance > 0) {
        return this.confirmRepeatRemittance()
      }
      let fund = 0
      this.$buefy.dialog.prompt({
        message: this.$t('ticket_text55'),
        inputAttrs: {
          type: 'number',
          placeholder: 'e.g. 10',
          min: 1,
          max: 99
        },
        confirmText: 'Next',
        trapFocus: true,
        type: 'is-dark',
        onConfirm: (value) => {
          fund = value

          this.$buefy.dialog.confirm({
            message: fund + this.$t('operation_text36') + '<br>' + this.$t('operation_text29'),
            type: 'is-dark',
            onConfirm: async () => {
              try {
                // loading
                const loadingComponent = this.$buefy.loading.open({
                  container: null
                })
                setTimeout(() => loadingComponent.close(), 3 * 1000)

                this.$buefy.snackbar.open({
                  duration: 120000, // 2 minutes
                  message: this.$t('operation_text30') + ` <a href="https://testnet.flowscan.org/account/${this.bloctoWalletUser?.addr}" target="_blank">${this.$t('operation_text31')}</a>`,
                  type: 'is-danger',
                  position: 'is-bottom-left',
                  actionText: null,
                  queue: false,
                  onAction: () => {
                  }
                })

                const transactionId = await this.$fcl.send(
                  [
                    this.$fcl.transaction(FlowTransactions.crowdfunding),
                    this.$fcl.args([
                      this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
                      this.$fcl.arg(parseFloat(fund).toFixed(2), this.$fclArgType.UFix64)
                    ]),
                    this.$fcl.payer(this.$fcl.authz),
                    this.$fcl.proposer(this.$fcl.authz),
                    this.$fcl.authorizations([this.$fcl.authz]),
                    this.$fcl.limit(9999)
                  ]
                ).then(this.$fcl.decode)
                this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
                this.noticeTitle = ''
                this.waitTransactionComplete = true
                this.callToast()
                const timerID = setInterval(async () => {
                  const ret = await this.isTicketVaultReady()
                  if (ret) {
                    const data = await this.getRequestStatus(true)
                    if (data) {
                      this.ticketStatus = 2
                      this.noticeTitle = this.$t('operation_text37')
                      this.waitTransactionComplete = false
                      clearInterval(timerID)
                    }
                  }
                }, 4000)

                return transactionId
              } catch (e) {
                console.log(e)
              }
            }
          })
        }
      })
    },
    async requestCode () {
      const result = await this.$fcl.send(
        [
          this.$fcl.script(FlowScripts.getTicketCode),
          this.$fcl.args([
            this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
            this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
          ])
        ]
      ).then(this.$fcl.decode)
      if (result && Object.keys(result).length > 0) {
        const ticketTokenId = parseInt(Object.keys(result)[0])
        if (result[ticketTokenId] !== '') {
          this.code = result[ticketTokenId].replace(/^elffab/, '').replace(/@tickets-on-flow.web.app$/, '').split('').reverse().join('')
        }
      }
    },
    confirmRepeatRemittance () {
      this.$buefy.dialog.confirm({
        message: this.$t('operation_text41'),
        onConfirm: () => {
          let fund = 0
          this.$buefy.dialog.prompt({
            message: this.$t('ticket_text55'),
            inputAttrs: {
              type: 'number',
              placeholder: 'e.g. 10',
              min: 1,
              max: 99
            },
            confirmText: 'Next',
            trapFocus: true,
            onConfirm: (value) => {
              fund = value

              this.$buefy.dialog.confirm({
                message: fund + this.$t('operation_text36') + '<br>' + this.$t('operation_text29'),
                onConfirm: async () => {
                  try {
                    // loading
                    const loadingComponent = this.$buefy.loading.open({
                      container: null
                    })
                    setTimeout(() => loadingComponent.close(), 3 * 1000)

                    this.$buefy.snackbar.open({
                      duration: 120000, // 2 minutes
                      message: this.$t('operation_text30') + ` <a href="https://testnet.flowscan.org/account/${this.bloctoWalletUser?.addr}" target="_blank">${this.$t('operation_text31')}</a>`,
                      type: 'is-danger',
                      position: 'is-bottom-left',
                      actionText: null,
                      queue: false,
                      onAction: () => {
                      }
                    })

                    const transactionId = await this.$fcl.send(
                      [
                        this.$fcl.transaction(FlowTransactions.crowdfunding),
                        this.$fcl.args([
                          this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32),
                          this.$fcl.arg(parseFloat(fund).toFixed(2), this.$fclArgType.UFix64)
                        ]),
                        this.$fcl.payer(this.$fcl.authz),
                        this.$fcl.proposer(this.$fcl.authz),
                        this.$fcl.authorizations([this.$fcl.authz]),
                        this.$fcl.limit(9999)
                      ]
                    ).then(this.$fcl.decode)
                    this.transactionScanUrl = `https://testnet.flowscan.org/transaction/${transactionId}`
                    this.noticeTitle = ''
                    this.waitTransactionComplete = true
                    this.callToast()
                    const timerID = setInterval(async () => {
                      const ret = await this.isTicketVaultReady()
                      if (ret) {
                        const data = await this.getRequestStatus(true)
                        if (data) {
                          this.ticketStatus = 2
                          this.noticeTitle = this.$t('operation_text37')
                          this.waitTransactionComplete = false
                          clearInterval(timerID)
                        }
                      }
                    }, 4000)

                    return transactionId
                  } catch (e) {
                    console.log(e)
                  }
                }
              })
            }
          })
        }
      })
    },
    async getTicketUsedTime () {
      const result = await this.$fcl.send(
        [
          this.$fcl.script(FlowScripts.getTicketUsedTime),
          this.$fcl.args([
            this.$fcl.arg(this.bloctoWalletUser?.addr, this.$fclArgType.Address),
            this.$fcl.arg(this.dispenser, this.$fclArgType.UInt32)
          ])
        ]
      ).then(this.$fcl.decode)
      if (result && Object.keys(result).length > 0) {
        this.ticketTokenId = parseInt(Object.keys(result)[0])
        return result[this.ticketTokenId]
      }

      return result
    },
    async getTickets () {
      try {
        const tickets = await this.$fcl.send(
          [
            this.$fcl.script(FlowScripts.getTickets),
            this.$fcl.args([
            ])
          ]
        ).then(this.$fcl.decode)
        this.$store.commit('updateTickets', tickets) // save tickets
        this.tickets = tickets
      } catch (e) {
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.section {
  margin-bottom: 30px;
  padding: 0 1.5rem;

  .page-title {
    font-size: 24px;
    text-align: center;
  }

  hr.separator {
    height: 0;
  }

  .content {
    margin: 10px auto 20px;
    padding: 16px;
    text-align: center;
    max-width: 800px;

    h1 {
      margin: 20px 0 16px;
    }

    .description {
      font-size: 14px;
    }

    .notice {
      font-size: 14px;
      color: rebeccapurple;
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
    }

    .code {
      font-size: 18px;
      color: #fff;
    }

    .request-btn {
      font-weight: bold;
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
  background-image: linear-gradient(180deg, rgba(0,0,0,1), #1b1c50);
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
  background-image: linear-gradient(0deg, rgba(0,0,0,.3), #1b1c50);
}
</style>
