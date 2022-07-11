<template>
  <ticket-page />
</template>

<script>
import TicketPage from '~/components/common/TicketPage'

export default {
  name: 'TicketDispenser7',
  components: {
    TicketPage
  },
  head () {
    return {
      title: 'Chain Work Tickets | Dispenser007',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Chain Work, Tickets, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
    }
  }
}
</script>
