<template>
  <f7-page name="faults">
    <f7-progressbar v-if="loadingFaults" infinite class="position-absolute"></f7-progressbar>
    <f7-navbar large>
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>{{$ml.get('SIDEBAR_MSG003')}}</f7-nav-title>
      <f7-nav-title-large>{{$ml.get('SIDEBAR_MSG003')}}</f7-nav-title-large>
    </f7-navbar>

    <f7-list no-hairlines>
      <f7-list-item
        :title="$ml.get('TRIPS_MSG022')"
        smart-select
        :smart-select-params="{openIn: 'popover', closeOnSelect: true }"
        :key="componentKeyPeriod"
      >
        <f7-icon slot="media" icon="f7-icons icon-other-date text-color-lightgray"></f7-icon>
        <select name="period" v-model="selectedPeriod" >
          <option
            v-for="period in periodList"
            :key="period.Val"
            :value="period.Val"
          >{{ period.Val === -1 ? $ml.get(period.Name) : period.Val + ' ' + $ml.get(period.Name) }}</option>
        </select>
      </f7-list-item>
      <f7-list-input
        v-if="selectedPeriod === -1"
        :label="$ml.get('COM_MSG034')"
        type="datepicker"
        :placeholder="$ml.get('COM_MSG035')"
        readonly
        :calendar-params="{ dateFormat: 'M dd yyyy', rangePicker: true, closeOnSelect: true }"
        @calendar:change="onChangeCustomPeriod"
      >
        <f7-icon slot="media" icon="f7-icons icon-other-date text-color-lightgray"></f7-icon>
      </f7-list-input>
    </f7-list>

    <f7-block v-if="!loadingFaults && isNoData">
      <p>{{$ml.get('PROMPT_MSG013')}}</p>
    </f7-block>

    <f7-list
      ref="vlFaults"
      class="vl-faults"
      virtual-list
      media-list
      :virtual-list-params="{ items, searchAll, renderExternal, height: heightCalc }"
    >
      <ul>
        <f7-list-item
          v-for="(item, index) in vlData.items"
          :key="index"
          :title="item.AssetName"
          :text="item.OptionName"
          :link="'/fault/?id=' + item.customId"
          :style="`top: ${vlData.topPosition}px`"
        >
          <span slot="header">{{item.Time | date('', 'shortDateTime')}} - <span class='text-color-orange'>{{item.ReasonName}}</span></span>
        </f7-list-item>
      </ul>
    </f7-list>



  </f7-page>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import moment from 'moment'
  import tFormat from '../js/helpers/time-formats'
  import historyPeriodList from '@/js/helpers/history-period-list';

  export default {
    name: "faults",

    data: ()=>({
      loadingFaults: false,
      isNoData: true,
      items: [],
      periodList: historyPeriodList,
      selectedPeriod: '',
      componentKeyPeriod: Date.now(),
      //dateFormat: tFormat[5],
      vlData: {
        items: [],
      },
    }),

    computed: {
      ...mapGetters(['info']),
    },

    methods: {
      searchAll(query, items) {
        const found = [];
        for (let i = 0; i < items.length; i += 1) {
          if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
        }
        return found; // return array with mathced indexes
      },
      renderExternal(vl, vlData) {
        this.vlData = vlData;
      },
      heightCalc(item){
        let ret = this.$theme.ios ? 78 : 86;
        if(item.OptionName > 55){
          ret += this.$theme.ios ? 21 : 20 ;
        }
        return ret
      },
      formatItems(items){
        if(items.length){
          /*items.map((item)=>{
            item.TripTypeText = this.$ml.get(enumTripTypes[item.TripType].path)
          })*/
          items.sort((a, b) =>  moment(b.Time).unix() - moment(a.Time).unix())
        }
        return items;
      },
      async onChangeCustomPeriod(values){
        if(values.length === 2){
          let params = {
            MinorToken: this.info.MinorToken,
            MajorToken: this.info.MajorToken,

            From: moment.utc(values[0]).format(tFormat[1])+'.000Z',
            To: moment(values[1]).endOf('day').utc().format(tFormat[1])+'.000Z',
          };

          this.loadingFaults = true;
          let items = await this.$store.dispatch('GET_FAULTS_FROM_API', params);
          this.isNoData = !items.length;
          this.$refs.vlFaults.f7VirtualList.replaceAllItems(this.formatItems(items));
          this.loadingFaults = false;
        }
      }
    },

    watch: {
      async selectedPeriod(val){
        if(val && val !== -1){
          let params = {
            MinorToken: this.info.MinorToken,
            MajorToken: this.info.MajorToken,

            From: moment().subtract(val, "days").startOf('day').utc().format(tFormat[1])+'.000Z',
            To: moment().utc().format(tFormat[1])+'.000Z',
          };
          this.loadingFaults = true;
          let items = await this.$store.dispatch('GET_FAULTS_FROM_API', params);
          this.isNoData = !items.length;
          this.$refs.vlFaults.f7VirtualList.replaceAllItems(this.formatItems(items));
          this.loadingFaults = false;
        }
      }
    },

    async mounted() {
      this.selectedPeriod = 3;
      this.componentKeyPeriod = Date.now();

     /* let items = await this.$store.dispatch('GET_FAULTS_FROM_API');
     /!* items.map(item => {
        item.Stars = this.$f7.methods.getStars(item.Raiting);
      });*!/
      this.items = items;


      //this.$f7.virtualList.get('.vl-trips').replaceAllItems(this.items);

      this.loading = false;*/
    }
  }
</script>

<style scoped>

</style>