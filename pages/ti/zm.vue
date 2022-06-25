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
          title: 'チケット概要',
          subtitle: '以下の項目を読み込みます。',
          radio1: 'Type',
          radio2: '買う時の値段',
          radio3: '売る時の値段',
          radio1TabTitle: 'Typeとは',
          radio1Tab1: 'Type1',
          radio1Tab2: 'Type2',
          radio1Tab3: 'Type3',
          radio1Tab4: 'Type4',
          radio1Tab5: 'Type5',
          radio1Tab6: 'Type6',
          radio1Tab1Title: 'Type1 ?',
          radio1Tab2Title: 'Type2 ?',
          radio1Tab3Title: 'Type3 ?',
          radio1Tab4Title: 'Type4 ?',
          radio1Tab5Title: 'Type5 ?',
          radio1Tab6Title: 'Type6 ?',
          radio1Tab1Contents: this.$t('special_additional1_type1_post'),
          radio1Tab2Contents: this.$t('special_additional1_type2_post'),
          radio1Tab3Contents: this.$t('special_additional1_type3_post'),
          radio1Tab4Contents: this.$t('special_additional1_type4_post'),
          radio1Tab5Contents: this.$t('special_additional1_type5_post'),
          radio1Tab6Contents: this.$t('special_additional1_type6_post'),
          radio2TabTitle: '買う時の値段とは',
          radio2Tab1: '-5.8%',
          radio2Tab2: '-4.4%',
          radio2Tab3: '-3.2%',
          radio2Tab4: '-2.2%',
          radio2Tab5: '-1.6%',
          radio2Tab6: '-0.8%',
          radio2Tab7: '0.2%',
          radio2Tab8: '1.0%',
          radio2Tab1Title: '-5.8% ?',
          radio2Tab2Title: '-4.4% ?',
          radio2Tab3Title: '-3.2% ?',
          radio2Tab4Title: '-2.2% ?',
          radio2Tab5Title: '-1.6% ?',
          radio2Tab6Title: '-0.8% ?',
          radio2Tab7Title: '0.2% ?',
          radio2Tab8Title: '1.0% ?',
          radio2Tab1Contents: this.$t('special_additional1_type1_post'),
          radio2Tab2Contents: this.$t('special_additional1_type2_post'),
          radio2Tab3Contents: this.$t('special_additional1_type3_post'),
          radio2Tab4Contents: this.$t('special_additional1_type4_post'),
          radio2Tab5Contents: this.$t('special_additional1_type5_post'),
          radio2Tab6Contents: this.$t('special_additional1_type6_post'),
          radio2Tab7Contents: this.$t('special_additional1_type6_post'),
          radio2Tab8Contents: this.$t('special_additional1_type6_post'),
          radio3TabTitle: '売る時の値段とは',
          radio3Tab1: '-2.5%',
          radio3Tab2: '-1.2%',
          radio3Tab3: '-0.5%',
          radio3Tab4: '0.1%',
          radio3Tab5: '1.6%',
          radio3Tab6: '3.3%',
          radio3Tab7: '4.5%',
          radio3Tab8: '5.6%',
          radio3Tab1Title: '-2.5% ?',
          radio3Tab2Title: '-1.2% ?',
          radio3Tab3Title: '-0.5% ?',
          radio3Tab4Title: '0.1% ?',
          radio3Tab5Title: '1.6% ?',
          radio3Tab6Title: '3.3% ?',
          radio3Tab7Title: '4.5% ?',
          radio3Tab8Title: '5.6% ?',
          radio3Tab1Contents: this.$t('special_additional1_type1_post'),
          radio3Tab2Contents: this.$t('special_additional1_type2_post'),
          radio3Tab3Contents: this.$t('special_additional1_type3_post'),
          radio3Tab4Contents: this.$t('special_additional1_type4_post'),
          radio3Tab5Contents: this.$t('special_additional1_type5_post'),
          radio3Tab6Contents: this.$t('special_additional1_type6_post'),
          radio3Tab7Contents: this.$t('special_additional1_type6_post'),
          radio3Tab8Contents: this.$t('special_additional1_type6_post')
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
      title: 'Tickets onFlow | Dispenser002\'s Web Page',
      meta: [
        { hid: 'keywords', name: 'keywords', content: 'Tickets, onFlow, Flow Blockchain, web3, crowdfunding, work, social network, Dispenser002' }
      ]
    }
  }
}
</script>
