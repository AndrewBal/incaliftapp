<template>
  <f7-page :page-content="false">
    <f7-navbar>
      <f7-nav-left>
        <f7-link
          icon="f7-icons size-25 icon-header-arrow"
          href="/trips/"
        ></f7-link
      ></f7-nav-left>
      <f7-nav-title>{{ pageTitle }}</f7-nav-title>
    </f7-navbar>
    <f7-toolbar tabbar top>
      <f7-link tab-link="#tab-1" tab-link-active>{{
        $ml.get("TRIPS_MSG001")
      }}</f7-link>
      <f7-link tab-link="#tab-2">{{ $ml.get("TRIPS_MSG002") }}</f7-link>
      <f7-link tab-link="#tab-3">{{ $ml.get("TRIPS_MSG023") }}</f7-link>
      <f7-link tab-link="#tab-4">{{ $ml.get("TRIPS_MSG024") }}</f7-link>
    </f7-toolbar>

    <f7-tabs animated>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <slot v-if="!loading">
          <div class="gauge-rating text-align-center">
            <f7-gauge
              v-if="trip.Gauge"
              type="semicircle"
              :value="trip.Gauge.Value"
              :value-text="trip.Gauge.Raiting"
              border-bg-color="#8e8e93"
              :border-color="trip.Gauge.BorderColor"
              :label-text="$ml.get('TRIPS_MSG004')"
              label-text-color="#8e8e93"
            ></f7-gauge>
          </div>

          <f7-block-title
            class="block-title text-uppercase text-align-center margin-top text-color-black"
            >{{ $ml.get("TRIPS_MSG003") }}</f7-block-title
          >
          <f7-block
            class="block-stars text-align-center"
            v-html="trip.TripStat.Stars.Template"
          >
          </f7-block>

          <!--<f7-block-title class="block-title text-uppercase text-align-center">{{$ml.get('TRIPS_MSG016')}}</f7-block-title>-->
          <f7-list class="no-hairline-top">
            <f7-list-item
              :header="$ml.get('TRIPS_MSG017')"
              :title="trip.TripStat.IMEI"
            >
              <f7-icon
                slot="media"
                icon="f7-icons icon-other-asset text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG018')"
              :title="$ml.get('TextTripType')"
            >
              <f7-icon
                slot="media"
                icon="f7-icons icon-report-trip text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG005')"
              :title="trip.TripStat.Distance + ' ' + trip.TripStat.MileageUnit"
            >
              <f7-icon
                slot="media"
                icon="f7-icons icon-trip-distance text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG006')"
              :title="trip.TripStat.Time"
            >
              <f7-icon
                slot="media"
                icon="f7-icons icon-trip-time text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG010')"
              :title="trip.TripStat.Start"
            >
              <f7-icon
                slot="media"
                icon="f7-icons icon-other-date text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG011')"
              :title="trip.TripStat.Finish"
            >
              <f7-icon
                slot="media"
                icon="f7-icons icon-other-date text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG007')"
              :title="trip.TripStat.MaxSpeed + ' ' + trip.TripStat.SpeedUnit"
            >
              <f7-icon
                slot="media"
                icon="f7-icons icon-trip-speed text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG008')"
              :title="trip.TripStat.AvargeSpeed + ' ' + trip.TripStat.SpeedUnit"
            >
              <f7-icon
                slot="media"
                icon="f7-icons icon-trip-speed text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
            <f7-list-item
              :header="$ml.get('TRIPS_MSG009')"
              :title="trip.TripStat.FuelUsed + ' ' + trip.TripStat.FuelUnit"
            >
              <f7-icon
                slot="media"
                icon="f7-icons icon-trip-fuel text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
          </f7-list>
        </slot>
      </f7-tab>
      <f7-tab id="tab-3" class="page-content">
        <f7-list>
          <f7-list-item
            v-for="trip of tripList"
            :key="trip.EndTime"
            class="flex-direction-column align-items-stretch"
          >
            <f7-icon
              slot="media"
              icon="f7-icons size-25 icon-live-trip text-color-lightgray"
            ></f7-icon>

            <div class="width-100 flex-direction-column align-items-stretch">
              <div class="item-title size-12 only-2-rows">
                <span>{{ trip.DriverCustomerName }}</span>
                <div class="item-header text-color-gray">
                  {{ trip.BeginLocalTime }}
                </div>
                {{ trip.StartAddress }}
              </div>
              <div class="item-text margin-half">
                <div class="row no-gap">
                  <div class="col-50">
                    <f7-icon
                      slot="media"
                      icon="f7-icons size-16 icon-trip-time text-color-lightgray"
                    ></f7-icon>
                    <span
                      class="size-14 vertical-align-middle margin-left-half text-color-gray"
                    >
                      {{ trip.Runtime }}</span
                    >
                  </div>
                  <div class="col-50">
                    <f7-icon
                      slot="media"
                      icon="f7-icons size-16 icon-menu-trips text-color-lightgray"
                    ></f7-icon>
                    <span
                      class="size-14 vertical-align-middle margin-left-half text-color-gray"
                      >{{ trip.Mileage }}</span
                    >
                  </div>
                  <div class="col-50">
                    <f7-icon
                      slot="media"
                      icon="f7-icons size-16 icon-trip-speed text-color-lightgray"
                    ></f7-icon>
                    <span
                      class="size-14 vertical-align-middle margin-left-half text-color-gray"
                      >{{ trip.MaxSpeed }}</span
                    >
                  </div>
                  <div class="col-50">
                    <f7-icon
                      slot="media"
                      icon="f7-icons size-16 icon-trip-speed text-color-lightgray"
                    ></f7-icon>
                    <span
                      class="size-14 vertical-align-middle margin-left-half text-color-gray"
                      >{{ trip.AvgSpeed }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="item-title size-12 only-2-rows">
                <div class="item-header text-color-gray">
                  {{ trip.EndLocalTime }}
                </div>
                {{ trip.EndAddress }}
              </div>
            </div>
          </f7-list-item>
        </f7-list>
      </f7-tab>

      <f7-tab id="tab-2" class="page-content">
        <playback
          v-if="!loadingPlayback"
          :historyArr="historyArr"
          :historyEvents="historyEventsArr"
          :assetName="trip.Name"
        />

        <f7-block v-else class="text-align-center">
          <f7-preloader color="gray"></f7-preloader>
        </f7-block>
      </f7-tab>
      <f7-tab id="tab-4" class="page-content">
        <div v-for="trip of tripList" :key="trip.EndTime">
          <f7-block-header>{{ $ml.get("HOME_MSG016") }}</f7-block-header>

          <f7-list>
            <f7-list-item header="..." :title="trip.GenralNote">
              <f7-icon
                slot="media"
                icon="f7-icons size-25 icon-other-notes text-color-lightgray"
              ></f7-icon>
            </f7-list-item>
          </f7-list>

          <div v-for="(note, index) of trip.Notes" :key="note.Code">
            <f7-block-header v-if="index % 2 == 0">{{
              $ml.get("TRIPS_MSG026")
            }}</f7-block-header>

            <f7-block-header v-else>{{
              $ml.get("TRIPS_MSG025")
            }}</f7-block-header>

            <f7-list>
              <f7-list-item>
                <div class="top-img-wrapper">
                  <div class="top-img-content">
                    <img
                      v-if="note.PhotoPath"
                      :src="imgAddress + note.PhotoPath"
                      alt=""
                    />
                  </div>
                </div>
              </f7-list-item>
              <f7-list-item header="Notes" :title="note.PhotoNote">
                <f7-icon
                  slot="media"
                  icon="f7-icons size-25 icon-other-notes text-color-lightgray"
                ></f7-icon>
              </f7-list-item>
            </f7-list>
          </div>
        </div>
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<script>
import APIMETHODS from "@/js/api-methods";
import { mapGetters } from "vuex";
import Playback from "../components/trips/playback";
import enumTripTypes from "../js/helpers/enum-trip-types";
import moment from "moment";
import tFormat from "../js/helpers/time-formats";
import parsePlaybackHisArr from "../js/helpers/parse-playback-his-arr";
import parsePlaybackHisEvents from "../js/helpers/parse-playback-his-events";
export default {
  name: "trip",
  data: () => ({
    pageTitle: "Trip",
    loading: true,
    loadingPlayback: true,
    trip: {},
    imgAddress: APIMETHODS.DOMAIN9 + "Attachment/images/",
    historyArr: [],
    historyEventsArr: [],
    completedTrips: [],
    tripList: [],
  }),
  components: {
    Playback,
  },
  computed: {
    ...mapGetters(["trips", "info"]),
    mlTextTripType() {
      return enumTripTypes[this.trip.TripStat.TripType] || "";
    },
  },

  methods: {
    getDifferenceBTtwoDates(date1, date2) {
      let ret = "";
      if (date1 && date2) {
        //let one_day=1000*60*60*24;

        // Convert both dates to milliseconds
        let date1_ms = moment(date1).valueOf();
        let date2_ms = moment(date2).valueOf();

        ret = date2_ms - date1_ms;
      }
      return ret;
    },
    async getTrips(taskCode) {
      let tripsParams = {
        MinorToken: this.info.MinorToken,
        MajorToken: this.info.MajorToken,
        TaskCode: taskCode,
      };

      let tripsFromApi = await this.$store.dispatch(
        "GET_TRIPS_FROM_API",
        tripsParams
      );

      let sortTrips = tripsFromApi.sort((a, b) => {
        return moment(a.BeginTime).diff(b.BeginTime);
      });

      if (tripsFromApi) {
        let msTime = this.getDifferenceBTtwoDates(
          sortTrips[0].BeginTime,
          sortTrips[sortTrips.length - 1].EndTime
        );
        this.trip.TripStat.Time = moment
          .duration(msTime, "milliseconds")
          .format("d[d] h[h] m[m]");
      } else {
        let msTime = this.getDifferenceBTtwoDates(
          this.trip.TripStat.Start,
          this.trip.TripStat.Finish
        );
        this.trip.TripStat.Time = moment
          .duration(msTime, "milliseconds")
          .format("d[d] h[h] m[m]");
      }

      await Promise.all(
        sortTrips.map(async (trip) => {
          if (trip.BeginTime) {
            trip.BeginLocalTime = moment(
              trip.BeginTime,
              "YYYY-MM-DD[T]HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss");
          }
          if (trip.EndTime) {
            trip.EndLocalTime = moment(
              trip.EndTime,
              "YYYY-MM-DD[T]HH:mm:ss"
            ).format("YYYY-MM-DD HH:mm:ss");
          }

          try {
            if (trip.StartLat && trip.StartLng) {
              trip.StartAddress = await this.$store.dispatch("fetchAddress", {
                lat: trip.StartLat,
                lng: trip.StartLng,
              });
            }
            if (trip.EndLat && trip.EndLng) {
              trip.EndAddress = await this.$store.dispatch("fetchAddress", {
                lat: trip.EndLat,
                lng: trip.EndLng,
              });
            }
          } catch (error) {
            console.error("Failed to fetch address for trip:", trip, error);
          }
        })
      );

      this.tripList = sortTrips;
      console.log("this.tripList", this.tripList);
    },
  },
  async mounted() {
    let ret = {};
    let utcOffset = moment().utcOffset();

    if (this.$f7route.context && this.$f7route.context.IMEI) {
      ret = {
        Name: this.$f7route.context.Name,
        TripStat: {
          Raiting: "10",
          Stars: {},
          Distance: this.$f7route.context.Mileage, //1200,
          Time: this.$f7route.context.Runtime, //'8:56:23',
          MaxSpeed: this.$f7route.context.MaxSpeed, //'121 km/h',
          AvargeSpeed: this.$f7route.context.AvgSpeed, //'87 km/h',
          FuelUsed: this.$f7route.context.FuelUsed, //'70 L',
          Start: moment(this.$f7route.context.BeginTime)
            .add(utcOffset, "minutes")
            .format(tFormat[0]), //'09.01.2018 1:34 PM ',
          Finish: moment(this.$f7route.context.EndTime)
            .add(utcOffset, "minutes")
            .format(tFormat[0]), //'09.01.2018 4:54 PM',
          IMEI: this.$f7route.context.IMEI,
          AssetId: this.$f7route.context.ID,
          TripType: this.$f7route.context.TripType,
          SpeedUnit: "km/h",
          FuelUnit: "L",
          MileageUnit: "km",
          TaskCode: this.$f7route.query.id,
        },
        Gauge: {},
      };
      //ret.TripStat.Raiting = trip.Raiting;
      ret.TripStat.Stars = this.$f7.methods.getStars(ret.TripStat.Raiting);
      ret.Gauge = this.$f7.methods.getGaugeRaitingDetails(ret.TripStat.Raiting);

      console.log(ret.TripStat.Stars);
      this.getTrips(ret.TripStat.TaskCode);
    } else {
      let trip = this.trips.find(
        (trip) => trip.TaskCode === this.$f7route.query.id
      );

      console.log(trip);
      ret = {
        Name: trip.AssetName,
        TripStat: {
          Raiting: "10",
          Stars: {},
          Distance: trip.Mileage,
          Time: trip.Runtime,
          MaxSpeed: trip.MaxSpeed,
          AvargeSpeed: trip.AvgSpeed,
          FuelUsed: trip.FuelUsed,
          /*Start: moment(trip.BeginTime).format(tFormat[0]),
            Finish: moment(trip.EndTime).format(tFormat[0]),*/
          Start: moment(trip.BeginTime)
            .add(utcOffset, "minutes")
            .format(tFormat[0]), //'09.01.2018 1:34 PM ',
          Finish: moment(trip.EndTime)
            .add(utcOffset, "minutes")
            .format(tFormat[0]), //'09.01.2018 4:54 PM',
          IMEI: trip.IMEI,
          AssetId: trip.ID,
          TripType: trip.TripType,
          SpeedUnit: "km/h",
          FuelUnit: "L",
          MileageUnit: "km",

          TaskCode: trip.TaskCode,
        },
        Gauge: {},
      };
      //ret.TripStat.Raiting = trip.Raiting;
      ret.TripStat.Stars = this.$f7.methods.getStars(ret.TripStat.Raiting);
      ret.Gauge = this.$f7.methods.getGaugeRaitingDetails(ret.TripStat.Raiting);
      console.log(ret.TripStat.Stars);
      this.getTrips(trip.TaskCode);
    }

    this.pageTitle = ret.Name;
    this.trip = ret;
    this.loading = false;

    let playbackParams = {
      MinorToken: this.info.MinorToken,
      Code: this.trip.TripStat.AssetId,
      From: moment(this.trip.TripStat.Start, tFormat[0])
        .utc()
        .format(tFormat[1]),
      To: moment(this.trip.TripStat.Finish, tFormat[0])
        .utc()
        .format(tFormat[1]),
    };

    let payback = await this.$store.dispatch("GET_PLAYBACK", playbackParams);

    this.loadingPlayback = false;

    if (
      !payback ||
      !payback.Data ||
      !payback.Data.HisArry ||
      !payback.Data.HisArry.length
    ) {
      /* this.$f7.methods.customDialog({
          title: this.$ml.get('TRIPS_MSG002'),
          text: this.$ml.get('COM_MSG022')
        });*/
      return;
    }

    this.historyArr = parsePlaybackHisArr(payback.Data.HisArry);
    this.historyEventsArr =
      payback.Data.HisEvents && payback.Data.HisEvents.length
        ? parsePlaybackHisEvents(payback.Data.HisEvents)
        : [];
  },
};
</script>

<style scoped>
.gauge-rating {
  margin-top: 32px;
}
</style>