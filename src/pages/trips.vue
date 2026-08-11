<template>
  <f7-page name="trips">
    <f7-progressbar
      v-if="loadingTrips"
      infinite
      class="position-absolute"
    ></f7-progressbar>
    <f7-navbar large>
      <f7-nav-left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>{{ $ml.get("SIDEBAR_MSG002") }}</f7-nav-title>
      <f7-nav-title-large>{{ $ml.get("SIDEBAR_MSG002") }}</f7-nav-title-large>
      <!--<f7-nav-right>
        <f7-link icon="f7-icons icon-other-date" href="#"></f7-link>
      </f7-nav-right>-->
    </f7-navbar>
    <f7-toolbar bottom no-shadow class="custom-toolbar">

      <div v-if="reportGenereted" class="row width-100 padding-horizontal">
        <f7-button
          color="green"
          fill
          icon="margin-right display-inline-block size-18 icon-download text-color-white"
          class="col-50 text-uppercase"
          @click="downloadTripReport"
          >{{ $ml.get("TRIPS_MSG027") }}</f7-button
        >
        <f7-button
          color="orange"
          fill
          icon="margin-right display-inline-block size-18 icon-profile-email text-color-white"
          class="col-50 text-uppercase"
          @click="sendTripReport"
          >{{ $ml.get("TRIPS_MSG028") }}
        </f7-button>
      </div>
      <div  v-else class="row width-100 padding-horizontal">
        <f7-button 
          color="green"
          fill
          icon="margin-right display-inline-block size-18  text-color-white"
          class="col-100 text-uppercase"
          @click="genTripsArr(false); reportGenereted = true"
          >{{ $ml.get("TRIPS_MSG029") }}</f7-button
        >
      </div>

    </f7-toolbar>

    <f7-list no-hairlines>
      <f7-list-item
        :title="$ml.get('TRIPS_MSG022')"
        smart-select
        :smart-select-params="{ openIn: 'popover', closeOnSelect: true }"
        :key="componentKeyPeriod"
      >
        <f7-icon
          slot="media"
          icon="f7-icons icon-other-date text-color-lightgray"
        ></f7-icon>
        <select name="period" v-model="selectedPeriod">
          <option
            v-for="period in periodList"
            :key="period.Val"
            :value="period.Val"
          >
            {{
              period.Val === -1
                ? $ml.get(period.Name)
                : period.Val + " " + $ml.get(period.Name)
            }}
          </option>
        </select>
      </f7-list-item>
      <f7-list-input
        v-if="selectedPeriod === -1"
        :label="$ml.get('COM_MSG034')"
        type="datepicker"
        :placeholder="$ml.get('COM_MSG035')"
        readonly
        :calendar-params="{
          dateFormat: 'M dd yyyy',
          rangePicker: true,
          closeOnSelect: true,
        }"
        @calendar:change="onChangeCustomPeriod"
      >
        <f7-icon
          slot="media"
          icon="f7-icons icon-other-date text-color-lightgray"
        ></f7-icon>
      </f7-list-input>
    </f7-list>

    <f7-block v-if="!loadingTrips && isNoData">
      <p>{{ $ml.get("PROMPT_MSG012") }}</p>
    </f7-block>

    <f7-list
      ref="vlTrips"
      class="vl-trips"
      virtual-list
      :virtual-list-params="{
        items,
        searchAll,
        renderExternal,
        height: $theme.ios ? 53 : $theme.md ? 54 : 46,
      }"
    >
      <ul>
        <f7-list-item
          v-for="(item, index) in vlData.items"
          :key="index"
          :title="item.AssetName"
          :after="item.TripTypeText"
          :link="'/trip/?id=' + item.TaskCode"
          :style="`top: ${vlData.topPosition}px`"
        >
          <span slot="header"
            >{{ item.StartDate | date("", "shortDateTime") }} -
            {{ item.EndDate | date("", "shortDateTime") }}</span
          >
        </f7-list-item>
      </ul>
    </f7-list>
  </f7-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import tFormat from "../js/helpers/time-formats";
import enumTripTypes from "../js/helpers/enum-trip-types";
import historyPeriodList from "@/js/helpers/history-period-list";

export default {
  name: "trips",
  data: () => ({
    reportGenereted: false,
    loadingTrips: false,
    isNoData: true,
    items: [],
    periodList: historyPeriodList,
    selectedPeriod: "",
    componentKeyPeriod: Date.now(),
    //dateFormat: tFormat[5],
    vlData: {
      items: [],
    },
    formmatTrips: [],
  }),
  computed: {
    ...mapGetters(["info"]),
  },
  methods: {
    async downloadTripReport() {
      await this.genTripsArr(true);
      var urlParams = "";
      urlParams += "?MinorToken=" + this.info.MinorToken;
      urlParams +=
        "&Period=" +
        moment()
          .subtract(this.selectedPeriod, "days")
          .startOf("day")
          .utc()
          .format(tFormat[7]) +
        "-" +
        moment().utc().format(tFormat[7]);

      var ref = cordova.InAppBrowser.open(
        "https://helper.quiktrak.com.au/generate/trip-report.php" + urlParams,
        "_system"
      );

      // location.href = "https://activation.gps-secure.co/send-trip/php/trip.php" + urlParams;
    },
    async sendTripReport() {
     // await this.genTripsArr();

      var urlParams = "";
      urlParams += "?MinorToken=" + this.info.MinorToken;
      urlParams +=
        "&Period=" +
        moment()
          .subtract(this.selectedPeriod, "days")
          .startOf("day")
          .utc()
          .format(tFormat[7]) +
        "-" +
        moment().utc().format(tFormat[7]); // Period;

      $.ajax({
        type: "POST",
        url: "https://helper.quiktrak.com.au/send-gpssecure-trip/",
        dataType: "json",
        data: {
          MinorToken: this.info.MinorToken,
          url:
            "https://helper.quiktrak.com.au/generate/pdf/gpssecure_trip_" +
            moment()
              .subtract(this.selectedPeriod, "days")
              .startOf("day")
              .utc()
              .format(tFormat[7]) +
            "-" +
            moment().utc().format(tFormat[7]) +
            "_" +
            this.info.MinorToken +
            ".pdf",
          recipients: this.info.User.EMail,
        },
        async: true,
        cache: false,
        beforeSend: function () {},
        success: function (data) {},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(XMLHttpRequest);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });

      location.href =
        "https://helper.quiktrak.com.au/generate/trip-report.php" + urlParams;
    },

    async genTripsArr(isDownload) {
      let params = {
        MinorToken: this.info.MinorToken,
        MajorToken: this.info.MajorToken,

        from: moment()
          .subtract(this.selectedPeriod, "days")
          .startOf("day")
          .utc()
          .format(tFormat[1]),
        to: moment().utc().format(tFormat[1]),
      };

      let tripsFromApi = await this.$store.dispatch(
        "GET_TRIPS_FROM_API",
        params
      );

      let formatTrips = tripsFromApi.map(async (trip) => {
        let obj = {
          ...trip,
          AvgSpeed: trip.AvgSpeed + " km/h",
          MaxSpeed: trip.MaxSpeed + " km/h",
          BeginTime: moment(trip.BeginTime, "YYYY-MM-DD[T]HH:mm:ss").format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          EndTime: moment(trip.EndTime, "YYYY-MM-DD[T]HH:mm:ss").format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          TripType: trip.TripType == 1 ? "Business" : "Personal",
          Mileage: trip.Mileage + " km",
          FuelUsed: trip.FuelUsed + " L",
          Ratiting: "10",
        };

        let fTrip = Object.assign({}, obj);

        let PromiseStartAddress = this.$store.dispatch("fetchAddress", {
          lat: trip.StartLat,
          lng: trip.StartLng,
        });

        let PromiseEndAddress = this.$store.dispatch("fetchAddress", {
          lat: trip.EndLat,
          lng: trip.EndLng,
        });

        await PromiseStartAddress.then((data) => {
          fTrip.StartAddress = data.split("'").join("");
        });
        await PromiseEndAddress.then((data) => {
          fTrip.EndAddress = data.split("'").join("");
        });

        delete fTrip.TaskCode;
        delete fTrip.EndLat;
        delete fTrip.EndLng;
        delete fTrip.StartLat;
        delete fTrip.StartLng;
        delete fTrip.Notes;
        delete fTrip.ID;
        delete fTrip.GenralNote;
        delete fTrip.DriverCustomerLng;
        delete fTrip.DriverCustomerLat;

        return fTrip;
      });

      await Promise.all(formatTrips).then((values) => {
        this.setToLocalDB(values, isDownload);
      });
    },
    async setToLocalDB(storage_data, isDownload) {
      $.ajax({
        type: "POST",
        url: "https://activation.gps-secure.co/send-trip/php/set_trip.php",
        dataType: "json",
        data: JSON.stringify({
          MinorToken: this.info.MinorToken,
          StorageData: storage_data,
          Status: isDownload ? 1 : 0
        }),
        async: true,
        cache: false,
        beforeSend: function () {},
        success: function (data) {},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          console.log(XMLHttpRequest);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    },
    searchAll(query, items) {
      const found = [];
      for (let i = 0; i < items.length; i += 1) {
        if (
          items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
          query.trim() === ""
        )
          found.push(i);
      }
      return found; // return array with mathced indexes
    },
    renderExternal(vl, vlData) {
      this.vlData = vlData;
    },
    formatItems(items) {
      if (items.length) {
        items.map((item) => {
          item.TripTypeText = this.$ml.get(enumTripTypes[item.TripType].path);
        });
        items.sort(
          (a, b) => moment(b.StartDate).unix() - moment(a.StartDate).unix()
        );
      }

      return items;
    },
    async onChangeCustomPeriod(values) {
      if (values.length === 2) {
        let params = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,

          from: moment.utc(values[0]).format(tFormat[1]),
          to: moment(values[1]).endOf("day").utc().format(tFormat[1]),
        };

        this.loadingTrips = true;

        let arr = await this.$store.dispatch("GET_TASKS_FROM_API", params);
        await this.$store.dispatch("GET_TRIPS_FROM_API", params);

        let items = arr.sort((a, b) => {
          return moment(a.StartDate).diff(b.StartDate);
        });

        this.isNoData = !items.length;
        console,log('items', items)
        this.$refs.vlTrips.f7VirtualList.replaceAllItems(items); // this.formatItems(items)
        this.loadingTrips = false;
      }
    },
  },
  watch: {
    async selectedPeriod(val) {
      if (val && val !== -1) {
        let params = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,

          from: moment()
            .subtract(val, "days")
            .startOf("day")
            .utc()
            .format(tFormat[1]),
          to: moment().utc().format(tFormat[1]),
        };
        this.loadingTrips = true;

        let arr = await this.$store.dispatch("GET_TASKS_FROM_API", params);
        await this.$store.dispatch("GET_TRIPS_FROM_API", params);

        let tasks = arr.filter(function (item) {
          return item.EndDate !== null;
        });

        let items = tasks.sort((a, b) => {
          return moment(a.StartDate).diff(b.StartDate);
        });

        this.isNoData = !items.length;
        this.$refs.vlTrips.f7VirtualList.replaceAllItems(items); // this.formatItems(items)
        this.loadingTrips = false;
      }
    },
  },
  async mounted() {
    this.selectedPeriod = 3;
    this.componentKeyPeriod = Date.now();
  },
};
</script>

<style scoped>
</style>