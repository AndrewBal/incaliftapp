<template>
  <l-map
      ref="map"
      :zoom="zoom"
      :center="center"

      style="height: 100%"
      :options="{zoomControl: false}"
  >
    <l-control-layers position="topright"  ></l-control-layers>
    <l-tile-layer
        v-for="tileProvider in tileProviders"
        :key="tileProvider.name"
        :name="tileProvider.name"
        :visible="tileProvider.visible"
        :url="tileProvider.url"
        :subdomains="tileProvider.subdomains"
        layer-type="base"
    />

    <l-feature-group
        ref="markerFeatureGroup"
    >
      <l-marker
          :lat-lng="[details.Lat, details.Lng]"
          :icon="markerIcon"
      >
        <l-popup>
          <table cellpadding="0" cellspacing="0" border="0" class="marker-data-table">
            <tbody>
            <!--<tr>
              <td class="marker-data-caption">{{ $ml.get('NOTIFICATIONS_MSG001') }}</td>
              <td class="marker-data-value">{{ details.Aalrm }}</td>
            </tr>-->
            <tr>
              <td class="marker-data-caption">{{ $ml.get('NOTIFICATIONS_MSG002') }}</td>
              <td class="marker-data-value">{{ details.AssetName }}</td>
            </tr>
            <tr>
              <td class="marker-data-caption">{{ $ml.get('NOTIFICATIONS_MSG003') }}</td>
              <td class="marker-data-value">{{ details.Imei }}</td>
            </tr>
            <tr>
              <td class="marker-data-caption">{{ $ml.get('NOTIFICATIONS_MSG004') }}</td>
              <td class="marker-data-value">{{ details.PositionTimeLocal ? details.PositionTimeLocal : (details.PositionTime) ? details.PositionTime : (details.CreateDateTime) ? details.CreateDateTime : details.time }}</td>
            </tr>
            <!-- <tr>
               <td class="marker-data-caption">{{ $ml.get('NOTIFICATIONS_MSG002') }}</td>
               <td class="marker-data-value">{{ mapPopupData.mileage }} {{ mapPopupData.mileageUnit }}</td>
             </tr>-->
            <tr>
              <td class="marker-data-caption">{{ $ml.get('NOTIFICATIONS_MSG007') }}</td>
              <td class="marker-data-value">{{ details.Speed }} km/h</td>
            </tr>
            <tr>
              <td class="marker-data-caption">{{ $ml.get('NOTIFICATIONS_MSG008') }}</td>
              <td class="marker-data-value">{{ details.Direction | direction }}</td>
            </tr>
            <tr>
              <td class="marker-data-caption">{{ $ml.get('NOTIFICATIONS_MSG005') }}</td>
              <td class="marker-data-value">{{ parseFloat(details.Lat).toFixed(4) }}, {{ parseFloat(details.Lng).toFixed(4) }}</td>
            </tr>
            <tr>
              <td class="marker-data-caption">{{ $ml.get('NOTIFICATIONS_MSG006') }}</td>
              <td class="marker-data-value marker-address asset-address">{{ customAddress ? customAddress : $ml.get('COM_MSG019') }}</td>
            </tr>
            </tbody>
          </table>

        </l-popup>
      </l-marker>
    </l-feature-group>
  </l-map>
</template>

<script>

import {LControlLayers, LFeatureGroup, LMap, LMarker, LPopup, LTileLayer} from "vue2-leaflet";
import L from "leaflet";

export default {
  name: "asset-location",
  components: {
    LMap, LTileLayer, LMarker, LControlLayers, LFeatureGroup, LPopup
  },
  props: {
    details:{
      type: Object,
      default: ()=>{}
    }
  },
  data() {

    return {
      //pageTitle: this.$f7route.context.GeofenceName ? this.$f7route.context.GeofenceName + ' - ' + this.$f7route.context.AlertName : (this.$f7route.context.AlertName ? this.$f7route.context.AlertName : this.$f7route.context.alarm),
      //isLoading: false,
      //details: this.$f7route.context,

      zoom: 13,
      center: L.latLng(47.41322, -1.219482),
      map: '',
      customAddress: '',

      tileProviders: [
        {
          name: 'Map',
          visible: true,
          url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: ['mt0','mt1','mt2','mt3']
        },
        {
          name: 'OpenStreetMap',
          visible: false,
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },
        {
          name: 'Satelitte',
          visible: false,
          url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          subdomains: ['mt0','mt1','mt2','mt3']
        },
        /*{
          name: 'OpenStreetMap',
          visible: true,
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },*/
      ],

      markerIcon: L.icon({
        iconUrl: './static/images/marker.svg',
        iconSize:     [60, 60], // size of the icon
        iconAnchor:   [17, 55], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
      }),

    }
  },

  mounted() {
    this.$nextTick(async () => {
      this.map = this.$refs.map.mapObject;
      if (this.$refs.markerFeatureGroup.mapObject.getBounds().isValid()) {
        this.map.fitBounds(this.$refs.markerFeatureGroup.mapObject.getBounds(),{padding:[16,16], maxZoom: 15})
      }
      this.customAddress = await this.$store.dispatch('fetchAddress', {lat: this.details.Lat, lng: this.details.Lng});

    });
  },
}
</script>
