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
          pre: '本日の株価の予想結果はType1です。',
          post: 'Type1は株価は前日より低く推移しますが、日中に少し高めになると予想されます。そこで底値で買ってその高値で売ると利益が出ます。'
        },
        type2: {
          pre: '本日の株価の予想結果はType2です。',
          post: 'Type2は10:30 ~ 11:00ぐらいにとても株価が上昇すると予想されます。そこで9:30頃に前日比+1%未満で買うことができれば、高値で売った時に利益が出ます。'
        },
        type3: {
          pre: '本日の株価の予想結果はType3です。',
          post: 'Type3は9:45 ~ 10:00ぐらいに株価が上がるが、以降は下がると予想されます。そこで9:30頃に前日比+1%未満で買うことができれば、高値で売った時に利益が出ます。'
        },
        type4: {
          pre: '本日の株価の予想結果はType4です。',
          post: 'Type4は9:35ぐらいに辛うじて前日比プラスを出すが、それ以降、ガクッと落ちると考えられます。そこで、ガクッと落ちたところで買い、高めに戻った時に売ります。そうすることで利益が出ます。'
        },
        type5: {
          pre: '本日の株価の予想結果はType5です。',
          post: 'Type5は市場が大変荒れています。おそらく9:30の時点が1番の高値と考えられます。日中の底値で買い、高値で売るということを考えると、買いは可能ですが、売り時はほぼないと考えられます。'
        },
        type6: {
          pre: '本日の株価の予想結果はType6です。',
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
        { hid: 'keywords', name: 'keywords', content: 'Tickets, onFlow, Flow Blockchain, web3, crowdfunding, work, SNS, Dispenser002' }
      ]
    }
  }
}
</script>
