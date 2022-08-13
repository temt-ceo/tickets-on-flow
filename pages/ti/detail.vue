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
  name: 'TicketDetail',
  components: {
    TicketPage
  },
  data () {
    return {
      ticketTitle: this.$t('special_title4'),
      ticketDescription: this.$t('special_description4') + ' DM if you\'re interested.',
      additionalDescription: {
        info: true,
        infoImage: '/img/img-3.jpg',
        infoDetail: {
          title: this.$t('ticket_text52'),
          subtitle: this.$t('special_subtitle4')
        }
      }
    }
  },
  head () {
    return {
      title: 'Tickets Onchain | Detail',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Tickets Onchain, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
    }
  }
}
</script>
