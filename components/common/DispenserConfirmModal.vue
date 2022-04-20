<template>
  <div class="modal-card">
    <section class="modal-card-body">
      <div class="text-wrap">
        Those who have recently requested are as follows.
      </div>
      <div class="contents">
        <div v-if="requesters.length > 0" class="text-wrap">
          <p class="content-information">
            <span class="col1">requester_id</span>
            <span class="col2">Email address</span>
            <span class="col3">domain</span>
            <span class="col4">paid</span>
          </p>
          <ul class="requester-list">
            <li
              v-for="(obj, index) in requesters"
              :key="index"
            >
              <div class="dispenser-id">
                #{{ obj.dispenser_id }}
              </div>
              <div
                class="requester-address"
              >
                {{ obj.email }}
              </div>
              <div class="requester-domain">
                {{ obj.domain }}
              </div>
              <div class="payed-block">
                {{ obj.paid.toString().substr(0, 3) }} $FLOW
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="requesters.length === 0" class="text-wrap">
        <p class="no-requester">
          No applicants yet.
        </p>
      </div>
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
