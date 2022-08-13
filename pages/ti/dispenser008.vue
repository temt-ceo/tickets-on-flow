<template>
  <ticket-page />
</template>

<script>
import TicketPage from '~/components/common/TicketPage'

export default {
  name: 'TicketDispenser8',
  components: {
    TicketPage
  },
  head () {
    return {
      title: 'Tickets Onchain | Dispenser008',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Tickets Onchain, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
    }
  }
}
</script>
