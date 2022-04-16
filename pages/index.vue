<template>
  <section class="section">
      <!--<card
        title="Free"
        icon="github"
      >
        Open source on <a href="https://github.com/buefy/buefy">
          GitHub
        </a>
      </card>

      <card
        title="Responsive"
        icon="cellphone-link"
      >
        <b class="has-text-grey">
          Every
        </b> component is responsive
      </card>

      <card
        title="Modern"
        icon="alert-decagram"
      >
        Built with <a href="https://vuejs.org/">
          Vue.js
        </a> and <a href="http://bulma.io/">
          Bulma
        </a>
      </card>

      <card
        title="Lightweight"
        icon="arrange-bring-to-front"
      >
        No other internal dependency
      </card>-->
    <div class="phone">
      <div class="header">
        <div>
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div>
          <label id="contactCount">Contacts</label>
        </div>
        <div>
          <i class="fa-solid fa-bars"></i>
        </div>
      </div>
      <div class="seachbar">
        <input type="text" name="searchcontact" id="searchcontact" placeholder="search..."/>
      </div>
      <div id="content" class="content">
        <div
          v-for="(ticket, index) in tickets"
          :key="index"
          class="c-contact"
        >
          <div class="identity_block">
            <label>{{ ticket.label }}</label>
            <i class="fa-solid fa-phone"></i>
            <span>{{ ticket.description }}</span>
          </div>
          <div
            :class="ticket.style"
            class="icon_block"
          >
            <label>{{ ticket.type }}</label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import Card from '~/components/Card'

export default {
  name: 'IndexPage',
  // components: {
  //   Card
  // },
  data () {
    return {
      tickets: []
    }
  },
  mounted () {
    this.setContentsData()
  },
  methods: {
    setContentsData () {
      for (let i = 1; i < 8; i++) {
        setTimeout(() => {
          this.tickets.push(
            {
              label: 'testLeanne Graham',
              description: '1-770-736-8031 x56442',
              style: 'color' + i,
              type: 'L'
            }
          )
        }, 50 * i)
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
  height: 95vh;
  background-image: linear-gradient(to bottom right, #973999, #f8598b, #f7bf00);

  .phone {
    width: 100%;
    max-width: 450px;
    height: 100%;
    margin: 0 auto;
    background: #596470;
    border-radius: 30px;
    border: 5px solid rgba(1, 1, 1, .2);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      left: 25%;
      top: 0;
      width: 50%;
      height: 3%;
      background: rgba(1, 1, 1, .2);
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
    }
  }

  .header {
    color: white;
    display: flex;
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
    transform: translateY(-16px);
    position: relative;
    z-index: 99999;

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
      -webkit-box-shadow: 0px 5px 15px -3px #cccccc;
      box-shadow: 0px 5px 15px -3px #cccccc;
    }
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    overflow: auto;
    top: 80px;
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
    }

    .identity_block > label {
      text-align: left;
      display: block;
    }

    .icon_block {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      border-radius: 50%;

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

    .identity_block {
      color: black;
      font-size: 12px;
      font-family: 'Roboto', sans-serif;

      & > span{
        color: gray;
        font-size: 10px;
      }

      & > i {
        color: gray;
        font-size: 8px;
        margin-right: 5px;
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
