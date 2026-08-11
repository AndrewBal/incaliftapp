<template>
  <f7-page name="check-list">
    <f7-navbar large>
      <f7-nav-left>
        <f7-link icon="icon-back" @click="closeCheckList"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>{{ pageTitle }}</f7-nav-title>
      <f7-nav-title-large>{{ pageTitle }}</f7-nav-title-large>
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
          :class="{ disabled: !isAllAnswered }"
          @click="isSummaryPopupOpen = true"
          >{{ $ml.get("COM_MSG009") }}</f7-button
        >
      </div>
    </f7-toolbar>

    <!-- :checklist = "checklist" -->
    <summary-popup
      :openPopup="isSummaryPopupOpen"
      :answers="answers"
      :imei="selectedAsset"
      :assetName="assetName"
      @closePopup="isSummaryPopupOpen = false"
      @closeCheckList="closeCheckList"
      
    />
    <f7-list>
      <f7-list-item
        checkbox
        v-for="list in checkLists"
        ref="checkLists"
        :checked="isAllAnswered"
        :key="list.Code"
        :value="list.Code"
        class="item-input custom-smart-select-wrapper"
        @click="showCheckList(list.Code)"
      >
        {{ list.Name }}
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
//import Vue from 'vue'
//import $$ from 'dom7';
import { mapGetters, mapActions } from "vuex";
import SummaryPopup from "../components/questions/summary-popup";
import checkLists from "../js/helpers/check-list";
import moment from "moment";
import tFormat from "../js/helpers/time-formats";

export default {
  name: "check-list",
  data: () => ({
    pageTitle: "Prestart Checklist",
    checkLists: [],
    assetList: [],
    isDriver: true,
    selectedCheckList: null,
    answers: {},
    isAllAnswered: false,
    isSummaryPopupOpen: false,
    imei: "",
    assetName: "",
    selectedAsset: "",
    //panelDamageStore: "",
    BrakesStore: "",
    chekedList: {},
  }),
  components: {
    SummaryPopup,
  },

  computed: {
    ...mapGetters(["info"]),
  },

  watch: {
    info() {
      this.assetList = this.info.Devices || [];
      // this.checkLists = this.info.CheckList || [];

      if (this.assetList.length) {
        let asset = this.assetList.find((itm) => !itm.ContactCode);
        if (asset) {
          this.selectedAsset = asset.IMEI;
        }
      }
      // if(this.checkLists.length){
      //   this.selectedCheckList = this.checkLists[0].Code
      // }
    },
  },
  methods: {
    // checkAllAnswer(state = "", code = "", additionalDetails = {}) {
    //   this.answers[code] = {
    //     ...additionalDetails,
    //     state,
    //   };

    //   console.log(this.answers)

    //   let answeredKeys = Object.keys(this.answers);
    //   if (answeredKeys.length === this.checkLists.length) {
    //     this.isAllAnswered = true;
    //   }

    // },
    showCheckList(code) { 
      this.selectedCheckList = code;
      if (!this.selectedCheckList) {
        this.$f7.methods.customDialog({
          title: this.pageTitle,
          text: this.$ml.get("PROMPT_MSG005"),
        });
        return;
      }
      if (!this.selectedAsset) {
        this.$f7.methods.customDialog({
          title: this.pageTitle,
          text: this.$ml.get("PROMPT_MSG006"),
        });
        return;
      }
 

      let answeredKeys = Object.keys(this.chekedList);
      if (answeredKeys.length === this.checkLists.length) {
        this.isAllAnswered = true;
      }

      this.$f7router.navigate({
        name: "questions",
        query: {
          imei: this.selectedAsset,
          cheklist: this.selectedCheckList,
          isDriver: this.isDriver,
        },
      });
    },
    closeCheckList() {


      this.isSummaryPopupOpen = false;
              this.$f7router.navigate({
                name: "home",
              });
      // this.$f7.methods.customDialog({
      //   title: this.pageTitle,
      //   text: this.$ml.get("PROMPT_MSG004"),
      //   buttons: [
      //     {
      //       text: this.$ml.get("COM_MSG003"),
      //     },
      //     {
      //       text: this.$ml.get("COM_MSG002"),
      //       onClick: () => {
              
      //       },
      //     },
      //   ],
      // });
    },

    selectTripType(params) {
      var modalTex = `
                    <div class="custom-modal-text margin-bottom">${this.$ml.get(
                      "PROMPT_MSG010"
                    )}</div>
                    <div class="list no-margin no-hairlines text-color-black">
                        <ul>
                            <li>
                                <label class="item-radio item-content color-green">
                                    <input type="radio" name="trip-type" value="1"  checked/>
                                    <i class="icon icon-radio"></i>
                                    <div class="item-inner">
                                        <div class="item-title">${this.$ml.get(
                                          "COM_MSG014"
                                        )}</div>
                                    </div>
                                </label>
                            </li>
                            <li>
                                <label class="item-radio item-content color-green">
                                    <input type="radio" name="trip-type" value="2"  />
                                    <i class="icon icon-radio"></i>
                                    <div class="item-inner">
                                        <div class="item-title">${this.$ml.get(
                                          "COM_MSG015"
                                        )}</div>
                                    </div>
                                </label>
                            </li>
                            <li>
                                <label class="item-radio item-content color-green">
                                    <input type="radio" name="trip-type" value="3"  />
                                    <i class="icon icon-radio"></i>
                                    <div class="item-inner">
                                        <div class="item-title">${this.$ml.get(
                                          "COM_MSG016"
                                        )}</div>
                                    </div>
                                </label>
                            </li>
                        </ul>
                    </div>
                `;
      this.$f7.methods.customDialog({
        text: modalTex,
        buttons: [
          {
            text: this.$ml.get("COM_MSG017"),
            onClick: async (dialog) => {
              let tripType = dialog.$el
                .find('input[name="trip-type"]:checked')
                .val();

              if (tripType !== "3") {
                //diagnostic
                // let data = {
                //   MinorToken: this.info.MinorToken,
                //   MajorToken: this.info.MajorToken,

                //   TaskCode: params.TaskCode,
                //   TripType: tripType,
                // };
                // try {
                //   this.$f7.progressbar.show();
                //   let result = await this.$store.dispatch("START_TRIP", data);
                //   this.$f7.progressbar.hide();
                //   if (!result) {
                //     return;
                //   }
                // } catch (e) {
                //   this.$f7.progressbar.hide();
                // }

                // let obj = {
                //   isTripStarted: true,
                //   Trip: {
                //     AssetName: this.assetName,
                //     AssetId: this.assetId,
                //     IMEI: this.imei,
                //     StartTime: moment(params.UpdateTime).format(tFormat[0]),
                //     TaskCode: params.TaskCode,
                //     TripType: tripType,
                //   },
                // };

                // this.$f7.methods.setInStorage({
                //   name: "additionalFlags",
                //   data: obj,
                // });

                // this.$store.dispatch("updateCurrentTrip", obj);

                // this.$f7.methods.customDialog({
                //   text: this.$ml.get("PROMPT_MSG033"),
                // });

                // this.$store.dispatch("SET_NOTIFICATION_STATUS", {
                //   IMEI: this.imei,
                //   MinorToken: this.info.MinorToken,
                //   State: 1,
                //   MobileToken: !localStorage.PUSH_MOBILE_TOKEN
                //     ? "123"
                //     : localStorage.PUSH_MOBILE_TOKEN,
                //   AppKey: !localStorage.PUSH_APP_KEY
                //     ? "123"
                //     : localStorage.PUSH_APP_KEY,
                //   Token: !localStorage.PUSH_DEVICE_TOKEN
                //     ? "123"
                //     : localStorage.PUSH_DEVICE_TOKEN,
                //   Type: !localStorage.DEVICE_TYPE
                //     ? "webapp"
                //     : localStorage.DEVICE_TYPE,
                // });
                // /*if (window.BackgroundGeolocation) {
                //     window.BackgroundGeolocation.setConfig({
                //       params: {
                //         //Token: userInfo.token,
                //       }
                //     }).then(state => {
                //       window.BackgroundGeolocation.start().then(state => {
                //         this.$f7.methods.showToast(this.$ml.get('COM_MSG020'));
                //       })
                //     }).catch(error => {
                //       console.log('- BackgroundGeolocation error: ', error);
                //     });
                //   }*/
              }
              this.$f7.view.main.router.back();
              this.isSummaryPopupOpen = false;
            },
          },
        ],
      });
    },
  },
  mounted() {
    /*let panelDamageStore = this.$f7.methods.getFromStorage("panelDamage");
    let trailerFloorStore = this.$f7.methods.getFromStorage("trailerFloor");
    let trailerSidePanelStore =
      
      this.$f7.methods.getFromStorage("trailerSidePanel");
    let tyresStore = this.$f7.methods.getFromStorage("tyres");
    let loadSheetStore = this.$f7.methods.getFromStorage("loadSheet");
    let OilWaterStore = this.$f7.methods.getFromStorage("OilWater");
   
    
    this.$nextTick(() => {
      if (Object.keys(panelDamageStore).length !== 0) {
        this.$refs.checkLists[1].checked = true;
        this.answers.PanelDamaged = panelDamageStore;
      } else {
        this.$refs.checkLists[1].checked = false;
      }
      if (Object.keys(trailerFloorStore).length !== 0) {
        this.$refs.checkLists[2].checked = true;
        this.answers.TrailerFloor = trailerFloorStore;
      } else {
        this.$refs.checkLists[2].checked = false;
      }

      if (Object.keys(trailerSidePanelStore).length !== 0) {
        this.$refs.checkLists[3].checked = true;
        this.answers.TrailerSidePanel = trailerSidePanelStore;
      } else {
        this.$refs.checkLists[3].checked = false;
      }
      if (Object.keys(tyresStore).length !== 0) {
        this.$refs.checkLists[4].checked = true;
        this.answers.Tyres = tyresStore;
      } else {
        this.$refs.checkLists[4].checked = false;
      }
      if (Object.keys(loadSheetStore).length !== 0) {
        this.$refs.checkLists[5].checked = true;
        this.answers.LoadSheet = loadSheetStore;
      } else {
        this.$refs.checkLists[5].checked = false;
      }
      if (Object.keys(OilWaterStore).length !== 0) {
        this.$refs.checkLists[0].checked = true;
        this.answers.OilWater = OilWaterStore;
      } else {
        this.$refs.checkLists[0].checked = false;
      }*/
 
    let BrakesStore = this.$f7.methods.getFromStorage("Brakes");
    let VisibilityStore = this.$f7.methods.getFromStorage("Visibility");
    let CabinStore = this.$f7.methods.getFromStorage("Cabin");
    let WheelsStore = this.$f7.methods.getFromStorage("Wheels");
    let GuardsStore = this.$f7.methods.getFromStorage("Guards");
    let HydraulicsStore = this.$f7.methods.getFromStorage("Hydraulics");
    let ExcessiveWearStore = this.$f7.methods.getFromStorage("ExcessiveWear");
    let OilStore = this.$f7.methods.getFromStorage("Oil");
    let CheckAndSecureStore = this.$f7.methods.getFromStorage("CheckAndSecure");
    let CheckAllSafetyStore = this.$f7.methods.getFromStorage("CheckAllSafety");
    let FuelTankStore = this.$f7.methods.getFromStorage("FuelTank");
    let CheckCabinStore = this.$f7.methods.getFromStorage("CheckCabin");
    let EngineStore = this.$f7.methods.getFromStorage("Engine");
    let TrailerRegoStore = this.$f7.methods.getFromStorage("TrailerRego");
    let MiscStore = this.$f7.methods.getFromStorage("Misc");
    //let OperatorsNamesStore = this.$f7.methods.getFromStorage("OperatorsNames");
   
    
    this.$nextTick(() => {
      if (Object.keys(BrakesStore).length !== 0) {
        this.$refs.checkLists[0].checked = true;
        this.answers.Brakes = BrakesStore;
      } else {
        this.$refs.checkLists[0].checked = false;
      }
      if (Object.keys(VisibilityStore).length !== 0) {
        this.$refs.checkLists[1].checked = true;
        this.answers.Visibility = VisibilityStore;
      } else {
        this.$refs.checkLists[1].checked = false;
      }

      if (Object.keys(CabinStore).length !== 0) {
        this.$refs.checkLists[2].checked = true;
        this.answers.Cabin = CabinStore;
      } else {
        this.$refs.checkLists[2].checked = false;
      }
      if (Object.keys(WheelsStore).length !== 0) {
        this.$refs.checkLists[3].checked = true;
        this.answers.Wheels = WheelsStore;
      } else {
        this.$refs.checkLists[3].checked = false;
      }
      if (Object.keys(GuardsStore).length !== 0) {
        this.$refs.checkLists[4].checked = true;
        this.answers.Guards = GuardsStore;
      } else {
        this.$refs.checkLists[4].checked = false;
      }
      if (Object.keys(HydraulicsStore).length !== 0) {
        this.$refs.checkLists[5].checked = true;
        this.answers.Hydraulics = HydraulicsStore;
      } else {
        this.$refs.checkLists[5].checked = false;
      }
      if (Object.keys(ExcessiveWearStore).length !== 0) {
        this.$refs.checkLists[6].checked = true;
        this.answers.ExcessiveWear = ExcessiveWearStore;
      } else {
        this.$refs.checkLists[6].checked = false;
      }
      if (Object.keys(OilStore).length !== 0) {
        this.$refs.checkLists[7].checked = true;
        this.answers.Oil = OilStore;
      } else {
        this.$refs.checkLists[7].checked = false;
      }
      if (Object.keys(CheckAndSecureStore).length !== 0) {
        this.$refs.checkLists[8].checked = true;
        this.answers.CheckAndSecure = CheckAndSecureStore;
      } else {
        this.$refs.checkLists[8].checked = false;
      }
      if (Object.keys(CheckAllSafetyStore).length !== 0) {
        this.$refs.checkLists[9].checked = true;
        this.answers.CheckAllSafety = CheckAllSafetyStore;
      } else {
        this.$refs.checkLists[9].checked = false;
      }
      if (Object.keys(FuelTankStore).length !== 0) {
        this.$refs.checkLists[10].checked = true;
        this.answers.FuelTank = FuelTankStore;
      } else {
        this.$refs.checkLists[10].checked = false;
      }
      if (Object.keys(CheckCabinStore).length !== 0) {
        this.$refs.checkLists[11].checked = true;
        this.answers.CheckCabin = CheckCabinStore;
      } else {
        this.$refs.checkLists[11].checked = false;
      }
      if (Object.keys(EngineStore).length !== 0) {
        this.$refs.checkLists[12].checked = true;
        this.answers.Engine = EngineStore;
      } else {
        this.$refs.checkLists[12].checked = false;
      }
      if (Object.keys(TrailerRegoStore).length !== 0) {
        this.$refs.checkLists[13].checked = true;
        this.answers.TrailerRego = TrailerRegoStore;
      } else {
        this.$refs.checkLists[13].checked = false;
      }
      if (Object.keys(MiscStore).length !== 0) {
        this.$refs.checkLists[14].checked = true;
        this.answers.Misc = MiscStore;
      } else {
        this.$refs.checkLists[14].checked = false;
      }
      /*if (Object.keys(OperatorsNamesStore).length !== 0) {
        this.$refs.checkLists[15].checked = true;
        this.answers.OperatorsNames = OperatorsNamesStore;
      } else {
        this.$refs.checkLists[15].checked = false;
      }*/

     
      if (this.checkLists.length ===  Object.keys(this.answers).length) {
        this.isAllAnswered = true;
      }
    });

    //this.isAllAnswered = true;


   // let checklistSelected = this.info.CheckList.find(list => list.Code === this.$f7route.query.cheklistCode)
 



     this.checkLists = checkLists;
     this.selectedAsset = this.$f7route.query.imei;



    // console.log('this.checkLists' , this.checkLists)
 

    let asset = this.info.Devices.find((device) => device.IMEI === this.selectedAsset);

    
     
    
    this.assetName = asset.Name;


     
  },
};
</script>

<style scoped>
.question-button {
  opacity: 0.5;
}
.question-button.active {
  opacity: 1;
}
</style>