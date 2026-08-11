<template>
  <f7-popup
      :opened="isOpened"
      :closeOnEscape="false"
      :closeByBackdropClick="false"
      @popup:opened="onPopupOpened"
      @popup:closed="onPopupClosed"
  >
    <f7-page>
      <f7-navbar>
        <!--<f7-nav-left>
          <f7-link icon="icon-back" @click="$emit('closePopup')"></f7-link>
        </f7-nav-left>-->
        <f7-nav-title sliding>{{ $ml.get('HOME_MSG001') }}</f7-nav-title>
        <f7-nav-right>
          <f7-link @click="$emit('closePopup')">{{ $ml.get('COM_MSG036') }}</f7-link>
        </f7-nav-right>
      </f7-navbar>

      <div class="playback-wrapper">
        <f7-progressbar v-if="isLoading" infinite  class="position-absolute"></f7-progressbar>

        <l-map
            ref="map"
            :zoom="zoom"
            :center="center"
            @leaflet:load="mapLoaded"
            style="height: 100%"
            :options="{zoomControl: true}"
        >
          <l-control-layers position="topright"  ></l-control-layers>
          <l-tile-layer
              v-for="tileProvider in tileProviders"
              :key="tileProvider.name"
              :name="tileProvider.name"
              :visible="tileProvider.visible"
              :url="tileProvider.url"
              :subdomains="tileProvider.subdomains"
              layer-type="base"/>

          <l-feature-group
              ref="markersFeatureGroup"
              v-if="assetList.length"
          >
            <l-marker
               v-for="asset in assetList"
               :key="asset.assetID"
               :lat-lng="[asset.lat, asset.lng]"
               :icon="asset.selected ? markerIconSelected : markerIcon"
               @click="selectAsset(asset)"
           >
             <l-tooltip>
              {{ asset.name }}
             </l-tooltip>
           </l-marker>
          </l-feature-group>

          <l-feature-group
              ref="myLocationFeatureGroup"
          >
            <l-circle
                v-if="myLocationAccuracy.center.length"
                :lat-lng="myLocationAccuracy.center"
                :radius="myLocationAccuracy.radius"
                :color="myLocationAccuracy.color"
            />
            <l-marker
               v-if="myLocationMarkerLatLng.length"
               :lat-lng="myLocationMarkerLatLng"
               :icon="myLocationMarkerIcon"
           >
             <l-tooltip>
              {{ $ml.get('PROMPT_MSG028') }}
             </l-tooltip>
           </l-marker>
          </l-feature-group>


        </l-map>

        <div class="row position-absolute bottom-0 width-100 over-map">
          <div class="col padding">
            <button
                class="button button-fill color-green"
                @click="confirmSelection"
                :class="{ disabled : !assetList.length || !selectedNewAssetImei }"
            >
              {{ $ml.get('COM_MSG037') }}
            </button>
          </div>
        </div>



      </div>

    </f7-page>
  </f7-popup>


</template>

<script>
  import L from 'leaflet';
  import { LMap, LTileLayer, LMarker, LControlLayers, LFeatureGroup, LTooltip, LCircle } from 'vue2-leaflet';
  import {mapGetters} from "vuex";
  import parseAssetsLocationData from "../js/helpers/parse-assets-position-data"
  export default {
    name: "map-select-asset",

    components: {
      LMap, LTileLayer, LMarker, LControlLayers, LFeatureGroup, LTooltip, LCircle
    },

    props: {
      isOpened: {
        type: Boolean,
        default: false
      },
      selectedImei: {
        type: String,
        default: ''
      }
    },

    emits: ['closePopup', 'selectAsset'],

    data: function(){

      return {
        zoom: 8,
        center: L.latLng(-31.906823, 115.816785),
        map: '',
        isLoading: false,

        tileProviders: [
          {
            name: 'Map',
            visible: true,
            url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            subdomains: ['mt0','mt1','mt2','mt3']
          },
          // {
          //   name: 'OpenStreetMap',
          //   visible: false,
          //   url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          // },
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
        markerIconSelected: L.icon({
          iconUrl: './static/images/marker-selected.svg',
          iconSize:     [60, 60], // size of the icon
          iconAnchor:   [17, 55], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
        }),
        myLocationMarkerIcon: L.icon({
          iconUrl: './static/images/marker-me.svg',
          iconSize:     [60, 60], // size of the icon
          iconAnchor:   [17, 55], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
        }),

        myLocationMarkerLatLng: [],
        myLocationAccuracy: {
          center: [],
          radius: 0,
          color: '#29abe2'
        },
        myLocationWatcher: null,
        isMyPositionCentered: false,

        assetList: [],
        selectedNewAssetImei: ''
      }
    },

    computed: {
      ...mapGetters(['info']),
    },

    watch: {

    },
    methods: {

      mapLoaded(){

      },
      onPopupOpened(){
        this.map.invalidateSize()
       // this.map.getMyLocation()
        this.getAssetsLocation()
      },
      onPopupClosed(){
        this.$emit('closePopup')
        if(navigator.geolocation && this.myLocationWatcher){
          navigator.geolocation.clearWatch(this.myLocationWatcher);
        }
        this.isMyPositionCentered = false
      },
      getMyLocation() {
        if (!navigator.geolocation) {
          this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG023'))
          return
        }

        this.myLocationWatcher = navigator.geolocation.watchPosition(this.showMyPosition, this.handleMyPositionError, {
          enableHighAccuracy: true,
          timeout: 15000
        });

      },
      showMyPosition(position) {
        if(!position || !position.coords || !parseFloat(position.coords.latitude) || !parseFloat(position.coords.longitude)){
          return;
        }
        this.myLocationMarkerLatLng = [position.coords.latitude, position.coords.longitude]
        this.myLocationAccuracy.center = [position.coords.latitude, position.coords.longitude]
        this.myLocationAccuracy.radius = position.coords.accuracy
        if(!this.isMyPositionCentered){
          this.$nextTick(async () => {
            this.map.fitBounds(this.$refs.myLocationFeatureGroup.mapObject.getBounds(),{padding:[16,16], maxZoom: 15})
            this.isMyPositionCentered = true
          })
        }
      },
      handleMyPositionError(error) {
        console.log(error)
        switch(error.code) {
          case error.PERMISSION_DENIED:
            this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG024'))
            break;
          case error.POSITION_UNAVAILABLE:
            this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG025'))
            break;
          case error.TIMEOUT:
            this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG026'))
            break;
          case error.UNKNOWN_ERROR:
            this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG027'))
            break;
        }
      },
      async getAssetsLocation(){
        let codes = '';
        if(this.info.Devices.length){
          this.info.Devices.map(item => {
            codes += item.ID+','
          })
        }
        if(!codes){
          return
        }
        codes = codes.slice(0, -1);

        let response = await this.$store.dispatch('GET_ASSETS_LOCATION', { codes })

        

        if(!response || !response.length){
          return
        }
        let availableAssets = this.info.Devices.filter(itm => !itm.ContactCode)
         
        this.assetList = [...parseAssetsLocationData(response, availableAssets)]

        
        if(this.selectedImei){
          this.assetList.find(itm => itm.imei === this.selectedImei).selected = true
        }
      },
      selectAsset(asset){
        this.assetList.map( itm => { itm.selected = false })
        this.selectedNewAssetImei = asset.imei
        asset.selected = true

      },
      confirmSelection(){
        this.$emit('closePopup')
        this.$emit('selectAsset', this.selectedNewAssetImei)
      }
    },
    mounted() {
      this.$nextTick(async () => {
        this.map = this.$refs.map.mapObject;


        //this.$refs.map.mapObject.ANY_LEAFLET_MAP_METHOD();
      });
    },
    beforeDestroy() {

    }
  }
</script>

<style scoped>

</style>