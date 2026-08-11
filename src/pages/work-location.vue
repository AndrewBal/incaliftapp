<template>
  <f7-page name="work-location">
    <f7-navbar>
      <f7-nav-left back-link="Back"></f7-nav-left>
      <f7-nav-title sliding>{{ $ml.get('COM_MSG040') }}</f7-nav-title>
    </f7-navbar>

    <f7-progressbar v-if="loading" infinite class="position-absolute"></f7-progressbar>

    <l-map
        v-if="hasCoords"
        ref="map"
        :zoom="zoom"
        :center="center"
        style="height: 100%"
        :options="{zoomControl: false}"
    >
      <l-control-layers position="topright"></l-control-layers>
      <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :subdomains="tileProvider.subdomains"
          layer-type="base"
      />

      <l-feature-group ref="markerFeatureGroup">
        <l-marker
            :lat-lng="[lat, lng]"
            :icon="markerIcon"
        ></l-marker>
      </l-feature-group>
    </l-map>

    <f7-block v-else-if="!loading" class="text-align-center">
      <p>{{ $ml.get('PROMPT_MSG045') }}</p>
    </f7-block>
  </f7-page>
</template>

<script>
import { LControlLayers, LFeatureGroup, LMap, LMarker, LTileLayer } from "vue2-leaflet";
import L from "leaflet";

export default {
  name: "work-location",

  components: {
    LMap, LTileLayer, LMarker, LControlLayers, LFeatureGroup,
  },

  data() {
    return {
      zoom: 15,
      center: L.latLng(0, 0),
      map: null,
      lat: null,
      lng: null,
      loading: true,

      tileProviders: [
        {
          name: 'Map',
          visible: true,
          url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
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
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        },
      ],

      markerIcon: L.icon({
        iconUrl: './static/images/marker.svg',
        iconSize: [60, 60],
        iconAnchor: [17, 55],
        popupAnchor: [0, -60]
      }),
    }
  },

  computed: {
    hasCoords() {
      return this.lat !== null && this.lng !== null;
    },
  },

  methods: {
    fitMap() {
      this.map = this.$refs.map.mapObject;
      if (this.$refs.markerFeatureGroup.mapObject.getBounds().isValid()) {
        this.map.fitBounds(this.$refs.markerFeatureGroup.mapObject.getBounds(), { padding: [16, 16], maxZoom: 15 });
      }
    },
  },

  async mounted() {
    const address = this.$f7route.query.address || '';
    const queryLat = parseFloat(this.$f7route.query.lat);
    const queryLng = parseFloat(this.$f7route.query.lng);

    if (!isNaN(queryLat) && !isNaN(queryLng) && queryLat !== 0 && queryLng !== 0) {
      this.lat = queryLat;
      this.lng = queryLng;
      this.center = L.latLng(queryLat, queryLng);
      this.loading = false;
      this.$nextTick(() => this.fitMap());
    } else if (address) {
      const coords = await this.$store.dispatch('fetchCoordinates', address);
      if (coords) {
        this.lat = coords.lat;
        this.lng = coords.lng;
        this.center = L.latLng(coords.lat, coords.lng);
        this.$nextTick(() => this.fitMap());
      }
      this.loading = false;
    } else {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
</style>
