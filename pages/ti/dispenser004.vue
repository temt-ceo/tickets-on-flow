<template>
  <ticket-page />
</template>

<script>
import TicketPage from '~/components/common/TicketPage'

export default {
  name: 'TicketDispenser4',
  components: {
    TicketPage
  },
  head () {
    return {
      title: 'Tickets onFlow | Dispenser004\'s Web Page',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Tickets, onFlow, Flow Blockchain, web3, crowdfunding, work, SNS, Dispenser004' }
      ]
    }
  }
}
</script>
