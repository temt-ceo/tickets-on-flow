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
  name: 'TicketZM',
  components: {
    TicketPage
  },
  data () {
    return {
      ticketTitle: this.$t('special_title1'),
      ticketDescription: this.$t('special_description1'),
      additionalDescription: {
        info: true,
        infoImage: '/img/stock-img.jpeg',
        infoDetail: {
          title: this.$t('operation_text134'),
          subtitle: this.$t('special_subtitle2') + '\r\n' + this.$t('special_subtitle1'),
          linkTitle: this.$t('special_link_title1') + '\r\n' + this.$t('special_link_title1_2') + '\r\n' + this.$t('special_link_title1_3'),
          linkUrl: this.$t('special_link_url1') + '\r\n' + this.$t('special_link_url1_2') + '\r\n' + this.$t('special_link_url1_3'),
          radio1: this.$t('special_additional1_description1'),
          radio2: this.$t('special_additional1_description2'),
          radio3: 'Type',
          radio3TabTitle: 'Type',
          radio3Tab1: 'Type1',
          radio3Tab2: 'Type2',
          radio3Tab3: 'Type3',
          radio3Tab4: 'Type4',
          radio3Tab5: 'Type5',
          radio3Tab6: 'Type6',
          radio3Tab1Title: 'Type1 ?',
          radio3Tab2Title: 'Type2 ?',
          radio3Tab3Title: 'Type3 ?',
          radio3Tab4Title: 'Type4 ?',
          radio3Tab5Title: 'Type5 ?',
          radio3Tab6Title: 'Type6 ?',
          radio3Tab1Contents: this.$t('special_additional1_type1_post'),
          radio3Tab2Contents: this.$t('special_additional1_type2_post'),
          radio3Tab3Contents: this.$t('special_additional1_type3_post'),
          radio3Tab4Contents: this.$t('special_additional1_type4_post'),
          radio3Tab5Contents: this.$t('special_additional1_type5_post'),
          radio3Tab6Contents: this.$t('special_additional1_type6_post'),
          radio1TabTitle: this.$t('special_additional1_description1'),
          radio1Tab1: '-5.8%',
          radio1Tab2: '-4.4%',
          radio1Tab3: '-3.2%',
          radio1Tab4: '-2.2%',
          radio1Tab5: '-1.6%',
          radio1Tab6: '-0.8%',
          radio1Tab7: '0.2%',
          radio1Tab8: '1.0%',
          radio1Tab1Title: '-5.8% ?',
          radio1Tab2Title: '-4.4% ?',
          radio1Tab3Title: '-3.2% ?',
          radio1Tab4Title: '-2.2% ?',
          radio1Tab5Title: '-1.6% ?',
          radio1Tab6Title: '-0.8% ?',
          radio1Tab7Title: '0.2% ?',
          radio1Tab8Title: '1.0% ?',
          radio1Tab1Contents: this.$t('special_additional1_bottom_1'),
          radio1Tab2Contents: this.$t('special_additional1_bottom_2'),
          radio1Tab3Contents: this.$t('special_additional1_bottom_3'),
          radio1Tab4Contents: this.$t('special_additional1_bottom_4'),
          radio1Tab5Contents: this.$t('special_additional1_bottom_5'),
          radio1Tab6Contents: this.$t('special_additional1_bottom_6'),
          radio1Tab7Contents: this.$t('special_additional1_bottom_7'),
          radio1Tab8Contents: this.$t('special_additional1_bottom_8'),
          radio2TabTitle: this.$t('special_additional1_description2'),
          radio2Tab1: '-2.5%',
          radio2Tab2: '-1.2%',
          radio2Tab3: '-0.5%',
          radio2Tab4: '0.1%',
          radio2Tab5: '1.6%',
          radio2Tab6: '3.3%',
          radio2Tab7: '4.5%',
          radio2Tab8: '5.6%',
          radio2Tab1Title: '-2.5% ?',
          radio2Tab2Title: '-1.2% ?',
          radio2Tab3Title: '-0.5% ?',
          radio2Tab4Title: '0.1% ?',
          radio2Tab5Title: '1.6% ?',
          radio2Tab6Title: '3.3% ?',
          radio2Tab7Title: '4.5% ?',
          radio2Tab8Title: '5.6% ?',
          radio2Tab1Contents: this.$t('special_additional1_high_1'),
          radio2Tab2Contents: this.$t('special_additional1_high_2'),
          radio2Tab3Contents: this.$t('special_additional1_high_3'),
          radio2Tab4Contents: this.$t('special_additional1_high_4'),
          radio2Tab5Contents: this.$t('special_additional1_high_5'),
          radio2Tab6Contents: this.$t('special_additional1_high_6'),
          radio2Tab7Contents: this.$t('special_additional1_high_7'),
          radio2Tab8Contents: this.$t('special_additional1_high_8')
        },
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
          post: this.$t('special_additional1_type6_post')
        },
        from: {
          pre: this.$t('special_additional1_from_pre'),
          post: this.$t('special_additional1_from_post')
        },
        to: {
          pre: this.$t('special_additional1_to_pre'),
          post: this.$t('special_additional1_to_post')
        }
      }
    }
  },
  head () {
    return {
      title: 'Chain Work Tickets | zm',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Chain Work, Tickets, チケッツ, チェインワーク, フロー, onFlow, Flow Blockchain, $FLOW, wallet address, earn FLOW, crowdfunding' }
      ]
    }
  }
}
</script>
