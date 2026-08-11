<template>
  <f7-popup
    :opened="openPopup"
    :closeOnEscape="false"
    :closeByBackdropClick="false"
    @popup:open="popupOpen"
  >
    <f7-page>
      <f7-navbar>
        <f7-nav-left>
          <f7-link icon="icon-back" @click="closePopup"></f7-link>
        </f7-nav-left>
        <f7-nav-title sliding>{{ pageTitle }}</f7-nav-title>
        <f7-nav-right>
          <f7-link icon="icon-header-close" @click="closeCheckList"></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-toolbar bottom no-shadow class="custom-toolbar">
        <div class="row width-100 padding-horizontal">
          <f7-button
            color="green"
            fill
            class="col text-uppercase"
            @click="submitHandler"
            >{{ $ml.get("COM_MSG008") }}</f7-button
          >
        </div>
      </f7-toolbar>

      <f7-list>
        <f7-list-item :title="$ml.get('HOME_MSG006')" :after="assetName">
          <f7-icon
            slot="media"
            icon="f7-icons icon-other-asset text-color-lightgray"
          ></f7-icon>
        </f7-list-item>
        <f7-list-item
          :title="$ml.get('FAULTS_MSG005')"
          :after="CustomerName + ' CheckSheet'"
          >
          <f7-icon
            slot="media"
            icon="f7-icons icon-other-checklist text-color-lightgray"
          ></f7-icon>
        </f7-list-item>
        <f7-list-item :title="$ml.get('TRIPS_MSG018')" :after="tripType">
          <f7-icon
            slot="media"
            icon="f7-icons icon-address text-color-lightgray"
          ></f7-icon>
        </f7-list-item>

        <f7-list-item
          :title="$ml.get('HOME_MSG003')"
          :after="info.User.FirstName + ' ' + info.User.SubName"
        >
          <f7-icon
            slot="media"
            icon="f7-icons icon-profile-name text-color-lightgray"
          ></f7-icon>
        </f7-list-item>
        <f7-list-item
          v-show="isBusinessTrip"
          :title="$ml.get('HOME_MSG014')"
          :after="customerName"
        >
          <f7-icon
            slot="media"
            icon="f7-icons icon-profile-name text-color-lightgray"
          ></f7-icon>
        </f7-list-item>
        <f7-list-item
        class="customer-address"
          v-show="isBusinessTrip"
          :after="customerAddress"
        >
          <f7-icon
            slot="media"
            icon="f7-icons icon-address text-color-lightgray"
          ></f7-icon>
        </f7-list-item>
      </f7-list>

      <f7-block-title class="text-uppercase text-align-center">{{
        $ml.get("QUESTIONS_MSG007")
      }}</f7-block-title>
      <f7-block class="row">
        <div
          class="
            col-50
            rounded-small
            text-color-white
            bg-color-red
            text-align-center
            padding-vertical
          "
        >
          <div>
            <i class="f7-icons icon-other-fail size-36 padding-bottom-8"></i>
          </div>
          <div>{{ $ml.get("QUESTIONS_MSG008") }}</div>
          <div>{{ summary["fail"] }}</div>
        </div>
        <!-- <div class="col-33 rounded-small text-color-white bg-color-orange text-align-center padding-vertical">
          <div><i class="f7-icons icon-other-na-items size-36 padding-bottom-8"></i></div>
          <div>{{$ml.get('QUESTIONS_MSG009')}}</div>
          <div>{{ summary['na'] }}</div>
        </div> -->
        <div
          class="
            col-50
            rounded-small
            text-color-white
            bg-color-green
            text-align-center
            padding-vertical
          "
        >
          <div>
            <i
              class="f7-icons icon-other-passed-items size-36 padding-bottom-8"
            ></i>
          </div>
          <div>{{ $ml.get("QUESTIONS_MSG010") }}</div>
          <div>{{ summary["pass"] }}</div>
        </div>
      </f7-block>

      <f7-block>
        <p>{{ $ml.get("QUESTIONS_MSG005") }}</p>
        <p class="text-color-white">{{ $ml.get("QUESTIONS_MSG006") }}</p>
      </f7-block>
    </f7-page>
  </f7-popup>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import moment from "moment";
import tFormat from "../../js/helpers/time-formats";

export default {
  name: "summary-popup",
  props: {
    openPopup: {
      type: Boolean,
      default: false,
    },
    assetName: {
      type: String,
      default: "",
    },
    imei: {
      type: String,
      default: "",
    },
    checklist: {
      type: Object,
      default: () => {},
    },
    answers: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    pageTitle: "Summary",
    summary: {},
    allAnswers: {},
    tripType: "",
    isBusinessTrip: false,
    customerAddress: "",
    customerName: "",
    CustomerName: ''
  }),
  computed: {
    ...mapGetters(["info", "currentTrip"]),
  },
  watch: {
    info() {
      if(this.info.CustomerName) {
        this.CustomerName = this.info.CustomerName
      }
    }
  },
  methods: {
    ...mapActions(["UPLOAD_TASK"]),
    closePopup() {
      this.$emit("closePopup");
    },
    closeCheckList() {
      this.$emit("closeCheckList");
    },
    popupOpen() {
      console.log(this.currentTrip, "currentTrip");
      let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");
      let customerInfo = this.$f7.methods.getFromStorage("customerInfo");

      if (customerInfo) {
        this.customerAddress = customerInfo.CustomerAddress;
        this.customerName = customerInfo.CustomerName;
      }

      if (additionalFlags.Trip.TripType === "1") {
        this.tripType = this.$ml.get("COM_MSG014");
        this.isBusinessTrip = true;
      } else {
        this.tripType = this.$ml.get("COM_MSG015");
        this.isBusinessTrip = false;
      }

      var summary = {
        pass: 0, //pass
        // na: 0,  //na
        fail: 0, //fault
      };

      this.allAnswers = {
        /*
        ...this.answers.PanelDamaged,
        ...this.answers.TrailerFloor,
        ...this.answers.TrailerSidePanel,
        ...this.answers.Tyres,
        ...this.answers.LoadSheet,
        ...this.answers.OilWater,*/
        ...this.answers.Brakes,
        ...this.answers.Visibility,
        ...this.answers.Cabin,
        ...this.answers.Wheels,
        ...this.answers.Guards,
        ...this.answers.Hydraulics,
        ...this.answers.ExcessiveWear,
        ...this.answers.Oil,
        ...this.answers.CheckAndSecure,
        ...this.answers.CheckAllSafety,
        ...this.answers.FuelTank,
        ...this.answers.CheckCabin,
        ...this.answers.Engine,
        ...this.answers.TrailerRego,
        ...this.answers.Misc,
        //...this.answers.OperatorsNames,
      };
  
              
      // counting answers states
      for (const key of Object.keys(this.allAnswers)) {
        summary[this.allAnswers[key].state]++;
      }

      // this.pageTitle = this.checklist.Name;
      this.summary = summary;
    },
    async submitHandler() {
            let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");

       if(this.info.boundAsset.length) {
        await this.$store.dispatch("UNBIND_ASSET", { Imei: this.info.boundAsset});
      }

      let data = {
        MinorToken: this.info.MinorToken,
        MajorToken: this.info.MajorToken,

        CheckCode: "aabc9ee0-b36d-4806-8e4d-b65899f7da7c", //atga this.checklist.Code
        IMEI: this.imei,
        Options: [],
      };

      for (const key of Object.keys(this.allAnswers)) {
        data.Options.push({
          OptionCode: key,
          Result: this.allAnswers[key].state,
          Photos: this.allAnswers[key].img || "",
          //ReasonCode: this.answers[key].reasonCode || '',
          message: this.allAnswers[key].notes || "",
        });
      }

      //this.$emit('summaryResult', data)

      try {

        if(!this.info.TaskCode.length || !additionalFlags.Trip.TaskCode) {
            this.$f7.progressbar.show();
            let result = await this.$store.dispatch("UPLOAD_TASK", data);
            this.$f7.progressbar.hide();
            if (!result) {
              return;
            }

             this.startTrip({
                TaskCode: result.Data.model.Code,
                UpdateTime: result.Data.model.UpdateTime,
              });

        } else {
        
             this.startTrip({
                TaskCode: this.info.TaskCode,
               // UpdateTime: result.Data.UpdateTime,
              });
        }
      
       
       
        // this.$emit('selectTripType',{TaskCode: result.Data.Code, UpdateTime: result.Data.UpdateTime})
      } catch (e) {
        this.$f7.progressbar.hide();
      }
    },
    async startTrip(params) {
      let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");
      let customerInfo = this.$f7.methods.getFromStorage("customerInfo");
      let data = {};

     

      if (Object.keys(customerInfo).length == 0) {
        data = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,
          TaskCode: params.TaskCode,
          TripType: additionalFlags.Trip.TripType,
        };
      } else {
        data = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,
          TaskCode: params.TaskCode,
          TripType: additionalFlags.Trip.TripType,
          DeliveryCustomerName: customerInfo.CustomerName,
          DeliveryCustomerLat: customerInfo.CoordsDelivery[0],
          DeliveryCustomerLng: customerInfo.CoordsDelivery[1],
        };
      }

      try {
        this.$f7.progressbar.show();
        let result = await this.$store.dispatch("START_TRIP", data);
        this.$f7.progressbar.hide();
        if (!result) {
          return;
        }

   
      } catch (e) {
        this.$f7.progressbar.hide();
      }

      let obj = {
        isTripStarted: true,
        Trip: {
          AssetName: this.assetName,
          AssetId: this.assetId,
          IMEI: this.imei,
          StartTime: moment(params.UpdateTime).format(tFormat[0]),
          TaskCode: params.TaskCode,
          TripType: additionalFlags.Trip.TripType,
        },
      };
      this.$store.dispatch("updateCurrentTrip", obj);

      this.$f7.methods.setInStorage({
        name: "additionalFlags",
        data: obj,
      });

      this.$store.dispatch("SET_NOTIFICATION_STATUS", {
        IMEI: this.imei,
        MinorToken: this.info.MinorToken,
        State: 1,
        MobileToken: !localStorage.PUSH_MOBILE_TOKEN
          ? "123"
          : localStorage.PUSH_MOBILE_TOKEN,
        AppKey: !localStorage.PUSH_APP_KEY ? "123" : localStorage.PUSH_APP_KEY,
        Token: !localStorage.PUSH_DEVICE_TOKEN
          ? "123"
          : localStorage.PUSH_DEVICE_TOKEN,
        Type: !localStorage.DEVICE_TYPE ? "webapp" : localStorage.DEVICE_TYPE,
      });

      //  this.closePopup()
      this.closeCheckList();

      this.$f7.methods.customDialog({
        text: this.$ml.get("PROMPT_MSG033"),
      });
    },
  },
};
</script>

<style scoped>
</style>