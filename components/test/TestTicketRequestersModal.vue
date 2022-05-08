<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div>
        <b-table
          :data="ticketRequesterArray"
          :bordered="isBordered"
          :striped="isStriped"
          :narrowed="isNarrowed"
          :hoverable="isHoverable"
          :loading="isLoading"
          :focusable="isFocusable"
          :mobile-cards="hasMobileCards"
        >
          <b-table-column
            v-slot="props"
            field="user_id"
            label="user ID"
            width="40"
            numeric
          >
            {{ props.row.dispenser_id }}
          </b-table-column>

          <b-table-column
            v-slot="props"
            field="count"
            label="Request Count"
          >
            {{ props.row.count }}
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">
              No request yet.
            </div>
          </template>
        </b-table>
      </div>
    </section>
  </div>
</template>

<script>
import FlowScripts from '~/cadence/scripts'

export default {
  name: 'TestTicketRequestersModal',
  props: {
    address: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      ticketRequesterArray: [],
      isBordered: false,
      isStriped: false,
      isNarrowed: false,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: true
    }
  },
  mounted () {
    setTimeout(() => {
      this.confirmRequesters()
    }, 100)
  },
  methods: {
    confirmRequesters () {
      this.$buefy.dialog.prompt({
        message: 'dispenser_idを,区切りで２つ入力して下さい',
        inputAttrs: {
          type: 'text',
          placeholder: '1,10',
          maxlength: 10
        },
        confirmText: 'OK',
        onConfirm: async (value) => {
          const retArr = value.split(',')
          const st = parseInt(retArr[0])
          const ed = parseInt(retArr[1])
          const dispenserList = []
          if (st > 0 && st <= 999 && ed > 0 && ed <= 999 && st < ed) {
            for (let id = st; id <= ed; id++) {
              dispenserList.push(id)
            }
            try {
              const ticketRequesters = await this.$fcl.send(
                [
                  this.$fcl.script(FlowScripts.examinTicketRequesters),
                  this.$fcl.args([
                    this.$fcl.arg(this.address, this.$fclArgType.Address),
                    this.$fcl.arg(dispenserList, this.$fclArgType.Array(this.$fclArgType.UInt32))
                  ])
                ]
              ).then(this.$fcl.decode)
              const keys = Object.keys(ticketRequesters)
              keys.forEach((key) => {
                const userIds = Object.keys(ticketRequesters[key])
                let count = 0
                userIds.forEach((userId) => {
                  if (ticketRequesters[key][userId].latest_token === null) {
                    count++
                  }
                })
                const values = {
                  dispenser_id: key,
                  count
                }
                this.ticketRequesterArray.push(values)
              })
              this.$forceUpdate()
            } catch (e) {
            }
          }
        }
      })
    },
    dateThAttrs (column) {
      return column.label === 'Date' ? { class: 'has-text-success' } : null
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
    }

    .button-wrap {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      flex-direction: row-reverse;
      margin-left: 10px;

      .total-count {
        font-size: 12px;
        padding: 10px 3px 0 0;
      }
    }
  }
}
</style>
