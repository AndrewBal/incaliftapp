<template>
  <f7-list no-hairlines class="no-margin-top">
    <f7-list-item v-if="details.AssetName" :title="$ml.get('NOTIFICATIONS_MSG002')" :after="details.AssetName">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-other-asset"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.Imei" :title="$ml.get('NOTIFICATIONS_MSG003')" :after="details.Imei">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-imei"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.Imsi" :title="$ml.get('NOTIFICATIONS_MSG010')" :after="details.Imsi">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-device-installed"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.Direction" :title="$ml.get('NOTIFICATIONS_MSG008')" :after="details.Direction | direction">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-coordinates"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.Relay" :title="$ml.get('NOTIFICATIONS_MSG011')" :after="details.Relay">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-relay"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.Battery" :title="$ml.get('NOTIFICATIONS_MSG012')" :after="details.Battery">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-battery"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.Power" :title="$ml.get('NOTIFICATIONS_MSG013')" :after="details.Power">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-power"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.GPS" :title="$ml.get('NOTIFICATIONS_MSG014')" :after="details.GPS">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-gps"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.GSM" :title="$ml.get('NOTIFICATIONS_MSG015')" :after="details.GSM">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-gsm"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.GPRS" :title="$ml.get('NOTIFICATIONS_MSG016')" :after="details.GPRS">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-gprs"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.Charger" :title="$ml.get('NOTIFICATIONS_MSG017')" :after="details.Charger">
      <f7-icon slot="media" icon="f7-icons text-color-lightgray icon-voltage"></f7-icon>
    </f7-list-item>
    <f7-list-item v-if="details.PARAMS" :after="$ml.get('NOTIFICATIONS_MSG018')"></f7-list-item>
    <li v-if="details.PARAMS">
      <ul>
        <f7-list-item
            v-for="(value, key) in details.PARAMS"
            :key="key"
            :title="key"
            :after="value"></f7-list-item>
      </ul>
    </li>
  </f7-list>
</template>

<script>
export default {
  name: "asset-status",
  props: {
    details:{
      type: Object,
      default: ()=>{}
    }
  },
}
</script>

<style scoped>

</style>