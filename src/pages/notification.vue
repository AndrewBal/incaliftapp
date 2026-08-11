<template>
  <f7-page name="notification">
    <!-- Top Navbar -->
    <f7-navbar>
      <f7-nav-left back-link="Back">
      </f7-nav-left>
      <f7-nav-title sliding>{{pageTitle}}</f7-nav-title>
      <f7-nav-right>
        <f7-link icon="f7-icons icon-menu-asset" popover-open=".popover-settings"></f7-link>
      </f7-nav-right>

    </f7-navbar>

    <f7-popover class="popover-settings">
      <f7-list>
        <f7-list-item @click="disableNotifications" link="#" :title="$ml.get('NOTIFICATIONS_MSG019')" no-chevron popover-close>
          <f7-icon slot="media" icon="f7-icons text-color-lightgray">bell_slash_fill</f7-icon>
        </f7-list-item>
      </f7-list>
    </f7-popover>



    <asset-status
        v-if="details.alarm.toLowerCase() === 'status' || details.alarm.toLowerCase() === 'config'"
        :details="details"
    />

    <asset-location
        v-else
        :details="details"
    />

    <!--<f7-block-title class="display-flex justify-content-space-between white-space-normal">
      <span>{{ details.Title }}</span>
      <span class="white-space-nowrap text-color-gray size-12">{{ details.Date }}</span>
    </f7-block-title>
    <f7-block>
     &lt;!&ndash; <f7-block-header>{{ details.Date }}</f7-block-header>&ndash;&gt;
      <p>{{ details.Text }}</p>
    </f7-block>-->


  </f7-page>


</template>

<script>

import capitalizeFirstLetter from '../js/helpers/capitalize-first-letter'
import alarmTypes from '../js/helpers/enum-alarm-types'
import AssetLocation from '../components/notification/asset-location'
import AssetStatus from '../components/notification/asset-status'
import {mapGetters} from "vuex";

  export default {
    name: "notification",

    components: {
      AssetLocation,
      AssetStatus
    },

    data() {
      return {
        pageTitle: capitalizeFirstLetter(this.$f7route.context.GeofenceName ? this.$f7route.context.GeofenceName + ' - ' + this.$f7route.context.AlertName : (this.$f7route.context.AlertName ? this.$f7route.context.AlertName : this.$f7route.context.alarm)),
        isLoading: false,
        details: this.$f7route.context,

      }
    },

    computed: {
      ...mapGetters(['currentTrip', 'info']),
    },

    mounted() {
      console.log(this.details)

      if(this.details.type === alarmTypes.ACCOFF && this.currentTrip && this.currentTrip.isTripStarted){
        this.$f7.methods.customDialog({
          text: this.$ml.get('PROMPT_MSG036'),
          buttons: [
            {
              text: this.$ml.get('COM_MSG003'),
            },
            {
              text: this.$ml.get('COM_MSG002'),
              onClick:()=>{
                this.endTrip()
              }
            }
          ]
        })
      }
    },

    methods: {
      disableNotifications(){
        this.$store.dispatch('SET_NOTIFICATION_STATUS', {
          IMEI: this.details.Imei ? this.details.Imei : this.details.imei ? this.details.imei : this.details.IMEI,
          MinorToken: this.info.MinorToken,
          State: 0,
          MobileToken: !localStorage.PUSH_MOBILE_TOKEN ? '123' : localStorage.PUSH_MOBILE_TOKEN,
          AppKey: !localStorage.PUSH_APP_KEY ? '123' : localStorage.PUSH_APP_KEY,
          Token: !localStorage.PUSH_DEVICE_TOKEN ? '123' : localStorage.PUSH_DEVICE_TOKEN,
          Type: !localStorage.DEVICE_TYPE ? 'webapp' : localStorage.DEVICE_TYPE,
        })
      },
      async endTrip() {

        let data = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,

          TaskCode: this.currentTrip.Trip.TaskCode
        }


        this.$f7.progressbar.show();
        let result = await this.$store.dispatch('END_TRIP', data);
        this.$f7.progressbar.hide();
        if (!result) {
          return
        }

        this.$store.dispatch('SET_NOTIFICATION_STATUS', {
          IMEI: this.currentTrip.Trip.IMEI,
          MinorToken: this.info.MinorToken,
          State: 0,
          MobileToken: !localStorage.PUSH_MOBILE_TOKEN ? '123' : localStorage.PUSH_MOBILE_TOKEN,
          AppKey: !localStorage.PUSH_APP_KEY ? '123' : localStorage.PUSH_APP_KEY,
          Token: !localStorage.PUSH_DEVICE_TOKEN ? '123' : localStorage.PUSH_DEVICE_TOKEN,
          Type: !localStorage.DEVICE_TYPE ? 'webapp' : localStorage.DEVICE_TYPE,
        })

        let tripObj = {
          isTripStarted: false,
          Trip: {}
        };
        this.$f7.methods.setInStorage({
          name: 'additionalFlags',
          data: tripObj
        });
        this.$store.dispatch('updateCurrentTrip', tripObj)

        this.$f7router.navigate('/trip/?id=3&getList=true', {
          context : result.Data
        })

        /*if (window.BackgroundGeolocation) {
          window.BackgroundGeolocation.stop().then(state => {
            this.$f7.methods.showToast(this.$ml.get('COM_MSG021'));
          })
        }*/

      },
    }

  }
</script>

<style scoped>

</style>