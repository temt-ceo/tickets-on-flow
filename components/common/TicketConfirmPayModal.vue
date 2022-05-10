<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="text-wrap">
        Ticket Usage List
      </div>
      <div class="contents">
        <div v-if="ticketUsedList.length > 0" class="text-wrap">
          <div class="nft-list-container">
            <p class="content-information">
              <span class="col1">トークンID</span>
              <span class="col2">ウォレット</span>
              <span class="col3">支払額</span>
              <span class="col4">ブロック</span>
            </p>
            <ul class="payer-list">
              <li
                v-for="(payer, index) in ticketUsedList"
                :key="index"
              >
                <div class="token-id">
                  #{{ payer.token_id }}
                </div>
                <div
                  class="payer-address"
                  :class="{ 'payer-address-long': payer.address.length >= 30}"
                >
                  <a
                    :href="flowscanLink + payer.address"
                    class="address"
                    target="_blank"
                  >
                    {{
                      payer.address.length >= 10 ? (
                        isPC ? payer.address.substr(0, 12) + '...' : payer.address.substr(0, 9) + '...'
                      ) : payer.address
                    }}
                  </a>
                </div>
                <div class="payed-paid">
                  {{ payer.paid }}
                </div>
                <div class="payed-block">
                  {{ latestBlockHeight - payer.block_id }} ago
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="ticketUsedList.length === 0" class="text-wrap">
        <p class="no-payer">
          No one has used tickets yet.
        </p>
      </div>
      <div class="text-wrap">
        *Usage data will be deleted when you clear your browser history.
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'TicketConfirmPayModal',
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
      ticketUsedList: [],
      latestBlockHeight: null,
      isCompleteRegister: false,
      flowscanLink: 'https://testnet.flowscan.org/transaction'
    }
  },
  computed: {
    ticketUsedTokenList () {
      return this.$store.state.ticketUsedTokenList
    }
  },
  methods: {
    async confirmPayers () {
      try {
        const laatestBlock = await this.$fcl.send(
          [
            this.$fcl.getBlock(true)
          ]
        ).then(this.$fcl.decode)
        this.latestBlockHeight = laatestBlock.height
        this.ticketUsedList = this.ticketUsedTokenList.reverse()
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

      p.no-payer {
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
          margin-left: 10px;
        }

        .col4 {
          margin-right: 7px;
          display: block;
          float: right;
        }
      }
      .payer-list {
        li {
          position: relative;
          display: flex;
          animation: fadeIn 0.5s linear;
          animation-fill-mode: both;
          background-color: #fff;
          border-top: none;
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

          .payer-address {
            width: 36%;
            border-right: none;
          }

          .payer-address-long {
            font-size: 12px;
          }

          .address {
            color: #0089c7;

            &:visited {
              color: #A766ff;
            }
          }

          .payed-paid {
            width: 10%;
            border-right: none;
          }

          .payed-block {
            width: 36%;
            text-align: right;
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
