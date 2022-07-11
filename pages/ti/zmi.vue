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
      ticketTitle: this.$t('special_title2'),
      ticketDescription: this.$t('special_description2'),
      additionalDescription: {
        info: true,
        infoImage: '/img/img-1.jpeg',
        infoDetail: {
          title: this.$t('operation_text134'),
          subtitle: this.$t('special_subtitle2'),
          radio1: this.$t('special_additional2_description1'),
          radio2: this.$t('special_additional2_description2'),
          radio3: this.$t('special_additional2_description3'),
          radio1TabTitle: this.$t('special_additional2_description1'),
          radio1Tab1: '8:30',
          radio1Tab2: '8:30->9:00',
          radio1Tab3: 'QQQ3.MI/3',
          radio1Tab4: 'NQ=F',
          radio1Tab5: 'sq(9:00)',
          radio1Tab6: 'Yesterday_Criteria',
          radio1Tab1Title: '8:30 ?',
          radio1Tab2Title: '8:30->9:00 ?',
          radio1Tab3Title: 'QQQ3.MI/3 ?',
          radio1Tab4Title: 'NQ=F ?',
          radio1Tab5Title: 'sq(9:00) ?',
          radio1Tab6Title: 'Yesterday Criteria ?',
          radio1Tab1Contents: this.$t('special_additional2_input1_pre') + ' ' + this.$t('special_additional2_input1_post'),
          radio1Tab2Contents: this.$t('special_additional2_input2_pre') + ' (%)',
          radio1Tab3Contents: this.$t('special_additional2_input3_pre') + ' ' + this.$t('special_additional2_input1_post'),
          radio1Tab4Contents: this.$t('special_additional2_input4_pre') + ' ' + this.$t('special_additional2_input1_post'),
          radio1Tab5Contents: this.$t('special_additional2_input5_pre') + '. ' + this.$t('special_additional2_input5_post'),
          radio1Tab6Contents: this.$t('special_additional2_input7_pre') + '.',
          radio2TabTitle: this.$t('special_additional2_description2'),
          radio2Tab1: 'Yesterday_Close',
          radio2Tab2: 'QQQ3_market_from_before_trading_hours',
          radio2Tab3: 'NQ=F_market_from_before_trading_hours',
          radio2Tab4: 'Recent_Momentum',
          radio2Tab5: 'Close_day_before_yesterday',
          radio2Tab6: 'Close_3_day_change',
          radio2Tab1Title: 'Yesterday Close ?',
          radio2Tab2Title: 'QQQ3 market from before trading hours ?',
          radio2Tab3Title: 'NQ=F market from before trading hours ?',
          radio2Tab4Title: 'Recent Momentum ?',
          radio2Tab5Title: 'Close day before yesterday ?',
          radio2Tab6Title: 'Close 3 day change ?',
          radio2Tab1Contents: this.$t('special_additional2_input6_pre') + '. (%)',
          radio2Tab2Contents: this.$t('special_additional2_input8_pre') + '. ' + this.$t('special_additional2_input8_post'),
          radio2Tab3Contents: this.$t('special_additional2_input9_pre') + '. (%)',
          radio2Tab4Contents: this.$t('special_additional2_input10_pre') + '. (%)',
          radio2Tab5Contents: this.$t('special_additional2_input11_pre') + '. (%)',
          radio2Tab6Contents: this.$t('special_additional2_input12_pre') + ' ' + this.$t('special_additional2_input1_post'),
          radio3TabTitle: this.$t('special_additional2_description3'),
          radio3Tab1: 'Momentum_3_day_change',
          radio3Tab2: 'Close_5_day_change',
          radio3Tab3: 'Market_5_day_change',
          radio3Tab4: 'PER_20_day_change',
          radio3Tab1Title: 'Momentum 3 day change ?',
          radio3Tab2Title: 'Close 5 day change ?',
          radio3Tab3Title: 'Market 5 day change ?',
          radio3Tab4Title: 'PER 20 day change ?',
          radio3Tab1Contents: this.$t('special_additional2_input13_pre'),
          radio3Tab2Contents: this.$t('special_additional2_input14_pre') + ' ' + this.$t('special_additional2_input1_post'),
          radio3Tab3Contents: this.$t('special_additional2_input15_pre'),
          radio3Tab4Contents: this.$t('special_additional2_input16_pre')
        },
        '8:30': {
          pre: this.$t('special_additional2_input1_pre') + ': ',
          post: '(%)'
        },
        '8:30->9:00': {
          pre: this.$t('special_additional2_input2_pre') + ': ',
          post: '(%)'
        },
        'NQ=F': {
          pre: this.$t('special_additional2_input4_pre') + ': ',
          post: '(%)'
        },
        'sq(9:00)': {
          pre: this.$t('special_additional2_input5_pre') + ': ',
          post: '(%)'
        },
        Yesterday_Close: {
          pre: this.$t('special_additional2_input6_pre') + ': ',
          post: '(%)'
        },
        Yesterday_Criteria: {
          pre: this.$t('special_additional2_input7_pre') + ': ',
          post: '(%)'
        },
        QQQ3_market_from_before_trading_hours: {
          pre: this.$t('special_additional2_input8_pre') + ': ',
          post: '(%)'
        },
        'NQ=F_market_from_before_trading_hours': {
          pre: this.$t('special_additional2_input9_pre') + ': ',
          post: '(%)'
        },
        Recent_Momentum: {
          pre: this.$t('special_additional2_input10_pre') + ': ',
          post: '(%)'
        },
        Close_day_before_yesterday: {
          pre: this.$t('special_additional2_input11_pre') + ': ',
          post: '(%)'
        },
        Close_3_day_change: {
          pre: this.$t('special_additional2_input12_pre') + ': ',
          post: '(%)'
        },
        Momentum_3_day_change: {
          pre: this.$t('special_additional2_input13_pre') + ': ',
          post: '(%)'
        },
        Close_5_day_change: {
          pre: this.$t('special_additional2_input14_pre') + ': ',
          post: '(%)'
        },
        Market_5_day_change: {
          pre: this.$t('special_additional2_input15_pre') + ': ',
          post: '(%)'
        },
        PER_20_day_change: {
          pre: this.$t('special_additional2_input16_pre') + ': ',
          post: '(%)'
        }
      }
    }
  },
  head () {
    return {
      title: 'Chain Work Tickets | zmi',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Chain Work, Tickets, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
    }
  }
}
</script>
