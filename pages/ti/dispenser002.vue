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
      additionalDescription: {
        type1: {
          pre: this.$t('special_additional1_type1_pre'),
          post: this.$t('special_additional1_type1_post')
        },
        type2: {
          pre: this.$t('special_additional1_type2_pre'),
          post: this.$t('special_additional1_type2_post')
        },
        type3: {
          pre: this.$t('special_additional1_type3_pre'),
          post: this.$t('special_additional1_type3_post')
        },
        type4: {
          pre: this.$t('special_additional1_type4_pre'),
          post: this.$t('special_additional1_type4_post')
        },
        type5: {
          pre: this.$t('special_additional1_type5_pre'),
          post: this.$t('special_additional1_type5_post')
        },
        type6: {
          pre: this.$t('special_additional1_type6_pre'),
          post: 'Type6はzoomの株価が市場で比較的安いと考えられており、午後になって株価が最も高くなると考えられます。午前中に底値で買って午後に高値で売ると利益が出ます。'
        },
        from: {
          pre: '買い時(底値)の予想結果: 前日比',
          post: ' (この価格で指値で買いを入れます。)'
        },
        to: {
          pre: '売り時(高値)の予想結果: 前日比',
          post: ' (買いの指値が通っていれば、その後この価格で指値で売りを入れます。これは同日内で売買をすることで利益を出すことを目的としています。)'
        }
      }
    }
  },
  head () {
    return {
      title: 'Tickets onFlow | Dispenser002\'s Web Page',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Tickets, onFlow, Flow Blockchain, web3, crowdfunding, work, social network, Dispenser002' }
      ]
    }
  }
}
</script>
