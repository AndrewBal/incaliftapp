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
        <f7-nav-title sliding>{{ $ml.get('ACCIDENT_REPORT_MSG007') }}</f7-nav-title>
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

            style="height: 100%"
            :options="{zoomControl: true}"

            @click="onMapClick"
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

          <l-marker
              v-if="accidentMarkerLatLng.length"
              :lat-lng="accidentMarkerLatLng"
              :icon="markerIconSelected"
          >
            <l-tooltip>
              {{ $ml.get('ACCIDENT_REPORT_MSG012') }}
            </l-tooltip>
          </l-marker>


        </l-map>

        <div class="row position-absolute bottom-0 width-100 over-map">
          <div class="col padding">
            <button
                class="button button-fill color-custom"
                :class="{ disabled : !accidentMarkerLatLng.length }"
                @click="confirmSelection"
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

export default {
  name: "map-select-address",

  components: {
    LMap, LTileLayer, LMarker, LControlLayers, LFeatureGroup, LTooltip, LCircle
  },

  props: {
    isOpened: {
      type: Boolean,
      default: false
    },
    addressCoords: {
      type: String,
      default: ''
    }
  },

  emits: ['closePopup', 'addressSelected'],

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
      accidentMarkerLatLng: []

    }
  },

  mounted() {
    this.$nextTick(async () => {
      this.map = this.$refs.map.mapObject;


      //this.$refs.map.mapObject.ANY_LEAFLET_MAP_METHOD();
    });
  },

  methods: {
    onPopupOpened(){
      this.map.invalidateSize()
      this.getMyLocation()

      if(this.addressCoords){
        let coords = this.addressCoords.split(',').map( itm => parseFloat(itm) )
        if(Array.isArray(coords) && coords[0] || coords[1]){
          this.accidentMarkerLatLng = coords
        }
      }

    },
    onPopupClosed(){
      this.$emit('closePopup')
      if(navigator.geolocation && this.myLocationWatcher){
        navigator.geolocation.clearWatch(this.myLocationWatcher);
      }
      this.isMyPositionCentered = false
      this.accidentMarkerLatLng = []
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
          let bounds = [ this.$refs.myLocationFeatureGroup.mapObject.getBounds() ]
          if(this.accidentMarkerLatLng && this.accidentMarkerLatLng.length){
            bounds.push([...this.accidentMarkerLatLng])
          }
          this.map.fitBounds(bounds, {padding:[16,16], maxZoom: 15})
          this.isMyPositionCentered = true
        })
      }
    },
    handleMyPositionError(error) {
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
    confirmSelection(){
      this.$emit('closePopup')
      this.$emit('addressSelected', this.accidentMarkerLatLng)
    },
    onMapClick(e){
      this.accidentMarkerLatLng = [e.latlng.lat.toFixed(5), e.latlng.lng.toFixed(5)]
    }
  },

}
</script>

<style scoped>

</style>