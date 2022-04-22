<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="text-wrap">
        List of ticket applicants
      </div>
      <div
        v-if="ticketRequesters && !isCompleteRegister"
        class="text-wrap"
      >
        <div class="nft-list-container">
          <p class="content-information">
            <span class="col1">user ID</span>
            <span class="col2">Address</span>
            <span class="col3">Number of uses</span>
          </p>
          {{ new Date().getTime() }}
          <ul class="requester-list">
            <li
              v-for="(requester, index) in ticketRequesters"
              :key="index"
            >
              <div class="token-id">
                #{{ requester.user_id }}
              </div>
              <div
                class="requester-address"
                :class="{ 'requester-address-long': requester.address.length >= 30}"
              >
                <a
                  :href="flowscanLink + requester.address"
                  class="address"
                  target="_blank"
                >
                  {{
                    requester.address.length >= 30 ? (
                      isPC ? requester.address.substr(0, 36) + '...' : requester.address.substr(0, 27) + '...'
                    ) : requester.address
                  }}
                </a>
              </div>
              <div class="is-done">
                <span>{{ requester.count }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="!ticketRequesters" class="text-wrap">
        <p class="no-requester">
          No one has applied for a ticket yet.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import FlowScripts from '~/cadence/scripts'

export default {
  name: 'TicketConfirmModal',
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
      ticketRequesters: {},
      ticketName: '',
      transactionScanUrl: '',
      isCompleteRegister: false,
      flowscanLink: 'https://testnet.flowscan.org/transaction'
    }
  },
  async mounted () {
    await this.confirmRequesters()
  },
  methods: {
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
        console.log(ticketRequesters, 88888)
        this.ticketRequesters = ticketRequesters
        this.ticketRequesters.forEach((obj) => {
          obj.done = false
        })
        this.$forceUpdate()
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

    .text-wrap {
      margin: 16px;

      p {
        color: #222;
        margin: 8px 0;
      }

      h2 {
        font-size: 18px;
      }

      p.no-requester {
        font-weight: bold;
      }

      .content-information {
        margin: 0;
        font-size: 12px;

        .col1 {
          margin-left: 2px;
        }

        .col2 {
          margin-left: 14px;
        }

        .col3 {
          margin-right: 7px;
          display: block;
          float: right;
        }
      }
      .requester-list {
        li {
          position: relative;
          display: flex;
          animation: fadeIn 0.5s linear;
          animation-fill-mode: both;
          background-color: #fff;
          border-bottom: 1.5px solid #222;

          &:nth-child(1) {
            border-top: 1.5px solid #222;
          }

          div {
            border-left: 1.5px solid #222;
            border-right: 1.5px solid #222;
            padding: 7px;
            color: #222;
            font-size: 16px;
            font-weight: bold;
          }

          .token-id {
            width: 18%;
            border-right: none;
          }

          .requester-address {
            width: 70%;
            border-right: none;
          }

          .requester-address-long {
            font-size: 12px;
          }

          .address {
            color: #0089c7;

            &:visited {
              color: #A766ff;
            }
          }

          .is-done {
            width: 12%;
          }

          .purple {
            color: purple;
          }
        }
      }
    }
  }
}
</style>
