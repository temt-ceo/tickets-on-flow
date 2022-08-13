<template>
  <ticket-page />
</template>

<script>
import TicketPage from '~/components/common/TicketPage'

export default {
  name: 'TicketDispenser9',
  components: {
    TicketPage
  },
  head () {
    return {
      title: 'Tickets Onchain | Dispenser009',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Tickets Onchain, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
    }
  }
}
</script>
