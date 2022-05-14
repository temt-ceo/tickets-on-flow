<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="text-wrap">
        Those who have recently requested are as follows.
      </div>
      <b-table
        :data="requesters"
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
          field="dispenser_id"
          label="DispenserID"
          width="40"
          numeric
        >
          {{ props.row.dispenser_id }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="description"
          label="Description"
        >
          {{ props.row.description }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="domain"
          label="Domain"
        >
          {{ props.row.domain }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="paid"
          label="Paid"
        >
          {{ new Number(props.row.paid).toFixed(2) }} $FLOW
        </b-table-column>
        <template #empty>
          <div class="has-text-centered">
            No applicants yet.
          </div>
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>

export default {
  name: 'DispenserConfirmModal',
  props: {
    requesters: {
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
