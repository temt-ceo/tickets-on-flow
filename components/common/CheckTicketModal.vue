<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="text-wrap text-title">
        <span v-if="ticket.type == 0">{{ $t('ticket_text14') }}</span>
        <span v-if="ticket.type == 1">{{ $t('ticket_text52') }}</span>
      </div>
      <b-table
        :data="tickets"
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
          field="ticketName"
          :label="$t('ticket_text15')"
        >
          <div :class="{long: props.row.ticketName.length > 20, very_long: props.row.ticketName.length > 25}" class="ticket-title">
            {{ props.row.ticketName }}
          </div>
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="description"
          :label="$t('ticket_text16')"
        >
          {{ props.row.description }}
        </b-table-column>

        <b-table-column
          v-if="ticket.type == 0"
          v-slot="props"
          field="type"
          :label="$t('ticket_text1')"
        >
          {{ props.row.type }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="twitter"
          :label="ticket.type == 0 ? $t('ticket_text17') : $t('ticket_text53')"
        >
          <a :href="props.row.twitter" target="_blank">
            @{{ props.row.twitterAccount }}
          </a>
        </b-table-column>

        <b-table-column
          v-if="ticket.type == 0"
          v-slot="props"
          field="ticketPrice"
          :label="$t('ticket_text18')"
        >
          {{ props.row.ticketPrice }} $FLOW
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="ticketWhen"
          :label="ticket.type == 0 ? $t('ticket_text19') : $t('operation_text35')"
        >
          {{ props.row.ticketWhen }}
        </b-table-column>
        <template #empty>
          <div class="has-text-centered">
            {{ $t('ticket_text20') }}
          </div>
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>

export default {
  name: 'OwnedTicketsConfirmModal',
  props: {
    ticket: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      tickets: [],
      toolList: ['Zoom', 'Instagram', 'Discord', 'Teams', 'Google Meet', 'Ticket website', 'YouTube', 'Any tool', 'On-site'],
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
    const ticket = {}
    const ticketName = this.ticket.name.split('||@')
    ticket.ticketName = ticketName[0]
    ticket.twitter = 'https://twitter.com/' + ticketName[1]
    ticket.twitterAccount = ticketName[1]
    ticket.ticketPrice = this.ticket.price.replace(/\.?0+$/, '')
    const when = this.ticket.when_to_use.split('||')
    if (when.length >= 2) {
      ticket.ticketWhen = new Date(when[1]).toLocaleString().replace(/(:\d{2}):00/, '$1') + (this.ticket.type === 1 ? '' : ` ${this.$t('ticket_text6')} `)
    }
    const where = this.ticket.where_to_use.split('||')
    let detail = ''
    let tool = ''
    if (where.length === 2) {
      tool = where[0]
      detail = where[1]
    } else if (where.length > 2) {
      tool = where[0]
      detail = ''
      for (let i = 1; i < where.length; i++) {
        detail = detail + (i === 1 ? '' : '||') + where[i]
      }
    }
    let type = this.toolList[parseInt(tool) - 1] || ''
    if (type === 'Ticket website') {
      type = 'in ' + this.$t('ticket_text2')
    } else if (type === 'Any tool') {
      type = this.$t('ticket_text3')
    } else if (type === 'On-site') {
      type = this.$t('ticket_text4')
    }
    ticket.description = detail
    ticket.type = type
    ticket.ticketWhereType = where[0]
    if (where.length === 2) {
      ticket.ticketWhere = where[1]
    } else if (where.length > 2) {
      ticket.ticketWhere = ''
      for (let i = 1; i < where.length; i++) {
        ticket.ticketWhere = ticket.ticketWhere + (i === 1 ? '' : '||') + where[i]
      }
    }
    this.tickets.push(ticket)
  }
}
</script>

<style lang="scss" scoped>

.modal-card {
  width: auto;

  .modal-card-body {
    text-align: center;
    padding: 20px 10px;

    .text-wrap {
      margin: 16px;

      &.text-title {
        font-size: 18px;
      }

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
          margin-left: 1%;
        }

        .col2 {
          margin-left: 5%;
        }

        .col3 {
          margin-left: 30%;
        }

        .col4 {
          margin-right: 1%;
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

          .dispenser-id {
            width: 10%;
            border-right: none;
          }

          .requester-address {
            width: 40%;
            border-right: none;
          }

          .address {
            color: #0089c7;

            &:visited {
              color: #A766ff;
            }
          }

          .requester-domain {
            width: 36%;
            border-right: none;
          }

          .payed-block {
            width: 14%;
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
