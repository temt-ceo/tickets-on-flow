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
  name: 'TicketMulti',
  components: {
    TicketPage
  },
  data () {
    return {
      ticketTitle: this.$t('special_title3'),
      ticketDescription: this.$t('special_description3') + ' DM if you\'re interested.',
      additionalDescription: {
        info: true,
        infoImage: '/img/img-2.png',
        infoDetail: {
          title: this.$t('ticket_text52'),
          subtitle: this.$t('special_subtitle3')
        }
      }
    }
  },
  head () {
    return {
      title: 'Tickets Onchain | Multi',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Tickets Onchain, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
    }
  }
}
</script>
