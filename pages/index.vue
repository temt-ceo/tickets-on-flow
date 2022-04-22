<template>
  <section class="section">
    <div class="ticket-list">
      <div class="header">
        <div>
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div>
          <label>Tickets</label>
        </div>
        <div>
          <i class="fa-solid fa-bars"></i>
        </div>
      </div>
      <div class="seachbar">
        <input type="text" name="searchcontact" placeholder="search..."/>
      </div>
      <div class="content">
        <div
          v-for="(ticket, index) in tickets"
          :key="index"
        >
          <nuxt-link :to="'/ti/' + ticket.path" >
            <div class="c-contact">
              <div class="identity_block fa-3x">
                <label>{{ ticket.label }}</label>
                <i class="fa-solid fa-heart fa-beat" style="--fa-animation-duration: 0.5s;"></i>
                <span>{{ ticket.description }}</span>
              </div>
              <div
                :class="ticket.style"
                class="icon_block"
              >
                <label>{{ ticket.type }}</label>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FlowScripts from '~/cadence/scripts'

export default {
  name: 'IndexPage',
  data () {
    return {
      tickets: [],
      colors: { Finance: 'color1', Music: 'color3', Other: 'color7' },
      labels: [
        {
          path: 'dealing-business-ai-assistance',
          label: 'Dealing Business AI Assistance',
          description: 'on this website',
          style: 'color1',
          type: 'Finance'
        },
        // {
        //   label: 'testLeanne Graham',
        //   description: '1-770-736-8031 x56442',
        //   style: 'color2',
        //   type: 'L'
        // },
        // {
        //   label: 'testLeanne Graham',
        //   description: '1-770-736-8031 x56442',
        //   style: 'color3',
        //   type: 'L'
        // },
        // {
        //   label: 'testLeanne Graham',
        //   description: '1-770-736-8031 x56442',
        //   style: 'color4',
        //   type: 'L'
        // },
        // {
        //   label: 'testLeanne Graham',
        //   description: '1-770-736-8031 x56442',
        //   style: 'color5',
        //   type: 'L'
        // },
        // {
        //   label: 'Test Drink Ticket',
        //   description: 'at charch',
        //   style: 'color7',
        //   type: 'Music'
        // },
        {
          path: 'test-ticket',
          label: 'Test Ticket',
          description: 'on livestreaming',
          style: 'color3',
          type: 'Other'
        }
      ]
    }
  },
  async mounted () {
    await this.getTickets()
  },
  methods: {
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
        for (let i = 0; i < tickets.length; i++) {
          const ticket = tickets[i]
          if (ticket.name) {
            const detailArr = ticket.where_to_use.split('||')
            let detail = ''
            if (detailArr.length === 2) {
              detail = detailArr[1]
            } else if (detailArr.length > 2) {
              detail = ''
              for (let i = 1; i < detailArr.length; i++) {
                detail = detail + (i === 1 ? '' : '||') + detailArr[i]
              }
            }
            const ticketName = ticket.name.split('||@')[0]
            if (ticketName) {
              setTimeout(() => {
                this.tickets.push(
                  {
                    path: ticket.domain,
                    label: ticket.name.split('||@')[0],
                    description: detail,
                    style: 'color3',
                    type: 'Rank: ' + (i + 1)
                  }
                )
              }, 60 * i + 60)
            }
          }
        }
      } catch (e) {
      }
    }
  }
}
</script>
<style lang="scss" scoped>

* {
  box-sizing: border-box;
}

.section {
  height: 91vh;
  background-image: linear-gradient(to bottom right, #973999, #f8598b, #f7bf00);
  padding: 1.1rem 1.5rem 0;

  .ticket-list {
    width: 100%;
    max-width: 450px;
    height: 85vh;
    margin: 0 auto;
    background: #596470;
    border-radius: 30px;
    border: 5px solid rgba(1, 1, 1, .2);
    position: relative;
    overflow: hidden;
  }

  .header {
    color: white;
    display: flex;
    display: none;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    background-color:#b00c0c80;

    div {
      padding: 0 15px;

      i {
        font-size: 12px;
      }
      label {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 13px;
      }
    }
  }
  .seachbar {
    width: 100%;
    transform: translateY(23px);
    position: relative;
    z-index: 2;

    input {
      width: 90%;
      font-family: 'Roboto', sans-serif;
      font-size: 10px;
      padding: 10px;
      outline: none;
      border: none;
      border-radius: 40px;
      margin: auto;
      display: block;
      -webkit-box-shadow: 0px 3px 10px -2px #cccccc;
      box-shadow: 0px 3px 10px -2px #cccccc;
    }
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    overflow: auto;
    top: 75px;
    padding-top: 20px;
    background-color: white;
    bottom: 0;

    &::-webkit-scrollbar {
      display: none;
    }

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      margin: 10px 5px;
      color: white;
      align-items: stretch;
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
      border-top-right-radius: 50px;
      border-bottom-right-radius: 50px;
      -webkit-box-shadow:  -1px 1px 15px -8px #acacac;
      box-shadow:  -1px 1px 15px -8px #acacac;
      padding: 10px;
    }

    div:not(.hidden) {
      animation: comeOn .5s linear forwards;
    }

    div.hidden {
      animation: comeOut .5s linear forwards;
    }

    div.hidden-full {
      display: none;
    }

    .identity_block {
      flex: 2;
      color: black;
      font-size: 15px;
      font-family: 'Roboto', sans-serif;
      font-style: italic;

      & > span{
        color: gray;
        font-size: 10px;
      }

      & > i {
        color: gray;
        font-size: 8px;
        margin-right: 5px;
      }

      & > label {
        text-align: left;
        display: block;
      }
    }

    .icon_block {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      border-radius: 40%;

      &.color1 {
        background-color: rgb(135, 67, 86);
      }

      &.color2 {
        background-color: rgb(198, 93, 123);
      }

      &.color3 {
        background-color: rgb(246, 137, 137);
      }

      &.color4 {
        background-color: rgb(246, 231, 216);
      }

      &.color5 {
        background-color: rgb(247, 204, 172);
      }

      &.color6 {
        background-color: rgb(198, 155, 123);
      }

      &.color7 {
        background-color: rgb(130, 111, 102);
      }
    }

    .photo_block {
      background-color: rgba(1, 1, 1, .5);
    }

    .icon_block label {
      font-size: 10px;
    }

    @keyframes comeOn {
      0% {
        transform: translateX(-50px);
        opacity: 0;
      }
      80% {
        transform: translateX(10px);
        opacity: 1;
      }
      100% {
        transform: translateX(0px);
        opacity: 1;
      }
    }

    @keyframes comeOut {
      0% {
        transform: translateX(0px);
        opacity: 1;
      }
      20% {
        transform: translateX(10px);
        opacity: 1;
      }
      100% {
        transform: translateX(-50px);
        opacity: 0;
      }
    }
  }
}

</style>
