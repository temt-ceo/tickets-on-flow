<template>
  <ticket-page
    :ticket-title="ticketTitle"
    :ticket-description="ticketDescription"
    :additional-description="additionalDescription"
  />
</template>

<script>
import TicketPage from '~/components/common/TicketPage'

export default {
  name: 'TicketDispenser2',
  components: {
    TicketPage
  },
  data () {
    return {
      ticketTitle: this.$t('special_title1'),
      ticketDescription: this.$t('special_description1'),
      additionalDescription: null
    }
  },
  head () {
    return {
      title: 'Tickets onFlow | Dispenser002\'s Web Page',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Tickets, onFlow, Flow Blockchain, web3, crowdfunding, work, SNS, Dispenser002' }
      ]
    }
  }
}
</script>
