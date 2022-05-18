<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="text-wrap">
        Your Owned Tickets.
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
          label="Ticket"
          width="400"
          numeric
        >
          <a :href="props.row.path">
            {{ props.row.ticketName }}
          </a>
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="twitterAccount"
          label="Contact"
        >
          <a :href="'https://mobile.twitter.com/' + props.row.twitterAccount" target="_blank">
            @{{ props.row.twitterAccount }}
          </a>
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="time"
          label="Used at"
        >
          {{ props.row.used_time ? new Date(Number(props.row.used_time).toFixed(3) * 1000).toLocaleString().toLocaleString().replace(/(:\d{2}):00/, '$1') : 'unused' }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="paid"
          label="Paid"
        >
          {{ Number(props.row.price) > 0 ? `${new Number(props.row.price).toFixed(2)}$FLOW` : 'not yet' }}
        </b-table-column>
        <template #empty>
          <div class="has-text-centered">
            No tickets yet.
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
    tickets: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isBordered: false,
      isStriped: false,
      isNarrowed: false,
      isHoverable: false,
      isFocusable: false,
      isLoading: false,
      hasMobileCards: true
    }
  }
}
</script>

<style lang="scss" scoped>

.modal-card {
  width: auto;

  .modal-card-body {
    text-align: center;

    .text-wrap {
      margin: 16px;
      color: #222;

      p {
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
