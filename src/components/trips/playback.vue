<template>
  <div class="playback-wrapper">
    <f7-progressbar v-if="loadingPlaybackOptimised" infinite  class="position-absolute"></f7-progressbar>
    <div class="map-wrapper">
      <l-map
        ref="map"
        :zoom="zoom"
        :center="center"
        @leaflet:load="mapLoaded"
        style="height: 100%"
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
          ref="groupMainRoute"
          :visible="!showOptimised"
        >
          <l-polyline
          ref="route"
          :lat-lngs="routeLatLng"
          :options="PolylineCustomization.mainBg"></l-polyline>
          <l-polyline
            ref="route"
            :lat-lngs="routeLatLng"
            :options="PolylineCustomization.main"></l-polyline>
        </l-feature-group>

        <l-feature-group
          ref="groupOptimisedRoute"
          :visible="showOptimised"
        >
          <l-polyline
            :lat-lngs="routeLatLngOptimised"
            :options="PolylineCustomization.mainBg"></l-polyline>
          <l-polyline
            :lat-lngs="routeLatLngOptimised"
            :options="PolylineCustomization.main"></l-polyline>

          <l-polyline
            :lat-lngs="routeLatLngDropped"
            :options="PolylineCustomization.droppedBg"></l-polyline>
          <l-polyline
            :lat-lngs="routeLatLngDropped"
            :options="PolylineCustomization.dropped"></l-polyline>

          <l-polyline
            :lat-lngs="routeLatLngBoundaries"
            :options="PolylineCustomization.boundariesBg"></l-polyline>
          <l-polyline
            :lat-lngs="routeLatLngBoundaries"
            :options="PolylineCustomization.boundaries"></l-polyline>
        </l-feature-group>

        <l-marker
          v-if="historyArr.length"
          :lat-lng="markerLatLng"
          :icon="markerIcon"
        >
          <l-popup>
            <table cellpadding="0" cellspacing="0" border="0" class="marker-data-table">
              <tbody>
              <tr>
                <td class="marker-data-caption">{{$ml.get('PLAYBACK_MSG000')}}</td>
                <td class="marker-data-value">{{mapPopupData.name}}</td>
              </tr>
              <tr>
                <td class="marker-data-caption">{{$ml.get('PLAYBACK_MSG001')}}</td>
                <td class="marker-data-value">{{mapPopupData.positionTime | date('X')}}</td>
              </tr>
              <tr>
                <td class="marker-data-caption">{{$ml.get('PLAYBACK_MSG002')}}</td>
                <td class="marker-data-value">{{mapPopupData.mileage}} {{mapPopupData.mileageUnit}}</td>
              </tr>
              <tr>
                <td class="marker-data-caption">{{$ml.get('PLAYBACK_MSG003')}}</td>
                <td class="marker-data-value">{{mapPopupData.speed}} {{mapPopupData.speedUnit}}</td>
              </tr>
              <tr>
                <td class="marker-data-caption">{{$ml.get('PLAYBACK_MSG004')}}</td>
                <td class="marker-data-value">{{mapPopupData.direction | direction}}</td>
              </tr>
              <tr>
                <td class="marker-data-caption">{{$ml.get('PLAYBACK_MSG005')}}</td>
                <td class="marker-data-value marker-address asset-address">{{mapPopupData.coords}}</td>
              </tr>
              <tr>
                <td class="marker-data-caption">{{$ml.get('PLAYBACK_MSG006')}}</td>
                <td class="marker-data-value marker-address asset-address">{{mapPopupData.address}}</td>
              </tr>
              </tbody>
            </table>
          </l-popup>
        </l-marker>
      </l-map>

      <f7-fab position="right-bottom" slot="fixed" color="darkgray" @click="playbackStarted = !playbackStarted" :class="{disabled: !historyArr.length}">
        <i class="f7-icons text-color-white" :class="playbackStarted ? 'icon-header-stop' : 'icon-header-play'"></i>
      </f7-fab>

      <f7-fab position="left-bottom" slot="fixed" color="darkgray" :class="{disabled: !historyArr.length}">
        <f7-icon ios="f7:plus" aurora="f7:plus" md="material:add"></f7-icon>
        <f7-icon ios="f7:xmark" aurora="f7:xmark" md="material:close"></f7-icon>
        <f7-fab-buttons position="top">
          <f7-fab-button
            :label="showOptimised ? $ml.get('TRIPS_MSG020') : $ml.get('TRIPS_MSG021')"
            @click="showOptimised = !showOptimised"
          ><i class="icon f7-icons icon-report-trip text-color-white"></i></f7-fab-button>
        </f7-fab-buttons>
      </f7-fab>

    </div>
    <div class="bottom-section padding-top">

      <f7-block class="no-margin">
        <f7-range
          :min="0"
          :max="pointsCount"
          :step="1"
          :value="playbackRangeVal"
          @range:change="onRangeChangePlayback"

        ></f7-range>
      </f7-block>
      <div class="list no-hairlines no-hairlines-between no-margin">
        <ul class="display-flex justify-content-space-between" >
          <li>
            <div class="item-content">
              <div class="item-inner">
                <div class="item-title">
                  <div class="item-header item-label">{{$ml.get('TRIPS_MSG012')}}</div>
                  {{startTime | date('X')}}
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="item-content">
              <div class="item-inner">
                <div class="item-title text-align-right">
                  <div class="item-header item-label">{{$ml.get('TRIPS_MSG013')}}</div>
                  {{endTime | date('X')}}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <f7-block class="no-margin-bottom margin-top-half">
        <f7-range
          :min="1"
          :max="16"
          :step="0.5"
          :value="playbackSpeed"
          @range:change="onRangeChangeSpeed"
        ></f7-range>
      </f7-block>
      <div class="list no-hairlines no-hairlines-between no-margin list-item-height-initial">
        <ul class="display-flex justify-content-space-between" >
          <li>
            <div class="item-content">
              <div class="item-inner">
                <div class="item-title">
                  <div class="item-header item-label">{{$ml.get('TRIPS_MSG014')}}</div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="item-content">
              <div class="item-inner">
                <div class="item-title text-align-right">
                  <div class="item-header item-label">{{$ml.get('TRIPS_MSG015')}}</div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

    </div>
  </div>

</template>

<script>
  import L from 'leaflet';
  import { LMap, LTileLayer, LMarker, LControlLayers, LPolyline, LFeatureGroup, LPopup } from 'vue2-leaflet';
  export default {
    name: "playback",
    props: {
      historyArr: {
        type: Array,
        default: function () {
          return []
        },
      },
      historyEvents: {
        type: Array,
        default: function () {
          return []
        },
      },
      assetName: {
        type: String,
        default: ''
      }
    },
    data: function(){
      return {
        zoom: 13,
        center: L.latLng(-31.906823, 115.816785),
        map: '',

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

        PolylineCustomization: {
          mainBg: {
            //color: '#f44336',
            color: '#039ac5',
            weight: 6,
            opacity: 1,
          },
          main: {
            //color: '#f96868',
            color: '#00b9ee',
            weight: 3,
            opacity: 1,
          },
          droppedBg: {
            //color: '#b50000',     //red
            color: '#b47605',   //orange
            weight: 6,
            opacity: 0.7,
          },
          dropped: {
            //color: '#fc0405',
            color: '#fd9a08',   //orange
            weight: 3,
            opacity: 0.7,
          },
          boundariesBg: {
            color: '#6199CC',
            weight: 6,
            opacity: 0.4,
          },
          boundaries: {
            color: '#00B1FC',
            weight: 3,
            opacity: 0.4,
          },
        },

        playbackSpeed: 1,
        playbackRangeVal: 0,
        pointsCount: !this.historyArr.length ? 0 : this.historyArr.length-1,
        routeLatLng: !this.historyArr.length ? [] : this.historyArr.map(el => { return [el.lat, el.lng] }),
        markerLatLng: !this.historyArr.length ? [] : [this.historyArr[0].lat, this.historyArr[0].lng],
        markerIcon: L.icon({
          iconUrl: './static/images/marker.svg',
          iconSize:     [60, 60], // size of the icon
          iconAnchor:   [17, 55], // point of the icon which will correspond to marker's location
          popupAnchor:  [0, -60] // point from which the popup should open relative to the iconAnchor
        }),
        mapPopupData:{
          name: this.assetName,
          positionTime: !this.historyArr.length ? '' : this.historyArr[0].positionTime,
          speed: !this.historyArr.length ? '' : this.historyArr[0].speed,
          speedUnit: 'km/h',
          mileage: !this.historyArr.length ? '' : this.historyArr[0].mileage,
          mileageUnit: 'km',
          direction: !this.historyArr.length ? '' : this.historyArr[0].direct,
          coords: !this.historyArr.length ? '' : this.historyArr[0].lat.toFixed(6) +', '+this.historyArr[0].lng.toFixed(6),
          address: this.$ml.get('COM_MSG019'),
        },
        startTime: !this.historyArr.length ? '' : this.historyArr[0].positionTime,
        endTime: !this.historyArr.length ? '' : this.historyArr[this.historyArr.length-1].positionTime,
        addresses: {},
        lastAdderssQueryInfo: {},
        playbackTimer: false,
        playbackStarted: false,

        loadingPlaybackOptimised: false,
        showOptimised: false,
        routeLatLngOptimised: [],
        routeLatLngDropped: [],
        routeLatLngBoundaries: [],
      }
    },
    components: {
      LMap, LTileLayer, LMarker, LControlLayers, LPolyline, LFeatureGroup, LPopup
    },
    watch: {
      playbackStarted(val){
        if(val){
          this.playbackIntervalFunc();
        }else{
          clearInterval(this.playbackTimer);
        }
      }
    },
    methods: {
      async onRangeChangePlayback(value){
        this.playbackRangeVal = value;
        this.markerLatLng = this.routeLatLng[value];
        this.map.setView(this.routeLatLng[value]);

        this.mapPopupData.positionTime = this.historyArr[value].positionTime;
        this.mapPopupData.speed = this.historyArr[value].speed;
        //this.mapPopupData.speedUnit = '';
        this.mapPopupData.mileage = this.historyArr[value].mileage;
        //this.mapPopupData.mileageUnit = '';
        this.mapPopupData.direction = this.historyArr[value].direct;
        //this.mapPopupData.address = '';
        this.mapPopupData.coord = this.historyArr[value].lat.toFixed(6) + ', ' + this.historyArr[value].lng.toFixed(6);

        if(this.addresses[value]){
          this.mapPopupData.address = this.addresses[value];
        }else if(this.lastAdderssQueryInfo.address && Math.floor(this.historyArr[value].lat * 10000) / 10000 === this.lastAdderssQueryInfo.lat && Math.floor(this.historyArr[value].lng * 10000) / 10000 === this.lastAdderssQueryInfo.lng ){
          this.mapPopupData.address = this.addresses[value] = this.lastAdderssQueryInfo.address;
        }else{
          this.mapPopupData.address = this.lastAdderssQueryInfo.address = this.addresses[value] = await this.$store.dispatch('fetchAddress', {lat: this.historyArr[value].lat, lng: this.historyArr[value].lng});
          this.lastAdderssQueryInfo.lat = Math.floor(this.historyArr[value].lat * 10000) / 10000;
          this.lastAdderssQueryInfo.lng = Math.floor(this.historyArr[value].lng * 10000) / 10000;
        }

        //console.log(values)
      },
      onRangeChangeSpeed(value){
        this.playbackSpeed = value;
      },
      playbackIntervalFunc: function(){
        clearInterval(this.playbackTimer);
        this.playbackTimer = setInterval(this.playbackIntervalFunc, 1000 / this.playbackSpeed);
        if (this.playbackRangeVal !== this.pointsCount) {
          this.playbackRangeVal++;
        }else{
          this.playbackRangeVal = 0;
          this.playbackStarted = false;
        }
      },
      async getOptimizedRoute(){
        if(!this.historyArr.length){
          return;
        }

        let rawArray = [];
        for (let i = 0; i < this.historyArr.length; i++) {
          rawArray.push([
            null,
            null,
            null,
            new Date(this.historyArr[i].positionTime * 1000),
            null,
            null,
            null,
            null,
            null,
            null,
            this.historyArr[i].lat,   //lat
            this.historyArr[i].lng,   // lng
            null,
            this.historyArr[i].direct,   //direct
            this.historyArr[i].speed,   //speed
            this.historyArr[i].mileage    //mileage
          ]);
        }

        let optimisedPlayback = await this.$store.dispatch('GET_PLAYBACK_OPTIMISED', JSON.stringify(rawArray));
        this.loadingPlaybackOptimised = false;

        if(optimisedPlayback){
          if(optimisedPlayback.polylines){
            this.routeLatLngOptimised = optimisedPlayback.polylines;
          }
          if(optimisedPlayback.dropped){
            this.routeLatLngDropped = optimisedPlayback.dropped;
          }
          if(optimisedPlayback.boundaries){
            this.routeLatLngBoundaries = optimisedPlayback.boundaries;
          }
          this.showOptimised = true;
        }
      },
      mapLoaded(){
        /*let map = this.$refs.map;
        let route = this.$refs.route;
        console.log(this.$refs)
        console.log(route)
        map.fitBounds(route.getBounds());*/
      }
    },
    mounted() {
      this.$nextTick(async () => {
        this.map = this.$refs.map.mapObject;
        let route = this.$refs.route.mapObject;

        if(this.historyArr.length){
          this.map.fitBounds(route.getBounds());
          this.mapPopupData.address = await this.$store.dispatch('fetchAddress', {lat: this.markerLatLng[0], lng: this.markerLatLng[1]})
          this.getOptimizedRoute()
        }

        //this.$refs.map.mapObject.ANY_LEAFLET_MAP_METHOD();
      });
    },
    beforeDestroy() {
      this.playbackStarted = false;
      clearInterval(this.playbackTimer);
    }
  }
</script>
