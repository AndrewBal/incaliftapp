<template>
  <f7-app :params="f7params">
    <sidebar />

    <f7-view main class="safe-areas" url="/"></f7-view>
  </f7-app>
</template>
<script>
//import {mapGetters, mapActions} from 'vuex'
import { Device } from "framework7/framework7-lite.esm.bundle.js";
import getDevicePushInfo from "../js/helpers/get-device-push-info";
import formatNewNotification from "../js/helpers/fromat-new-notification";
//import { MLBuilder } from 'vue-multilanguage'
import cordovaApp from "../js/cordova-app.js";
import routes from "../js/routes.js";
import sidebar from "./sidebar";
import { mapGetters } from "vuex";
import { store } from "../store";
//import VConsole from 'vconsole';
export default {
  data() {
    return {
      // Framework7 Parameters


      f7params: {
        id: "com.quiktrak.prestart", // App bundle ID
        name: "PreStart", // App name
        theme: "auto", // Automatic theme detection

        data: function () {
          return {
            logo: "static/images/logo.png",
            logoModal: "static/images/logo-black.svg",

            AppDetails: {
              appId: "",
              appVersion: "0.0.0",
            },
          };
        },

        // App routes
        routes: routes,

        // Register service worker
        serviceWorker: Device.cordova
          ? {}
          : {
              path: "/service-worker.js",
            },
        // Input settings
        input: {
          scrollIntoViewOnFocus: Device.cordova && !Device.electron,
          scrollIntoViewCentered: Device.cordova && !Device.electron,
        },
        // Cordova Statusbar settings
        statusbar: {
          iosOverlaysWebView: true,
          androidOverlaysWebView: false,
        },
        routerAjaxStart: function () {
          this.progressbar.show();
        },
        routerAjaxComplete: function () {
          this.progressbar.hide();
        },
        methods: {
          hideKeyboard: function () {
            document.activeElement.blur();
            //$$("input").blur();
          },
          sortArrayByObjProps: function (list, sortBy) {
            //sortBy.direction == 1  means asc
            //sortBy.direction == -1 means desc
            if (list && list.length) {
              list.sort(function (a, b) {
                let i = 0,
                  result = 0;
                while (i < sortBy.length && result === 0) {
                  result =
                    sortBy[i].direction *
                    (a[sortBy[i].prop].toString().toUpperCase() <
                    b[sortBy[i].prop].toString().toUpperCase()
                      ? -1
                      : a[sortBy[i].prop].toString().toUpperCase() >
                        b[sortBy[i].prop].toString().toUpperCase()
                      ? 1
                      : 0);
                  i++;
                }
                return result;
              });
            }
            return list;
          },
          isObjEmpty: function (obj) {
            // null and undefined are "empty"
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0) return false;
            if (obj.length === 0) return true;

            // If it isn't an object at this point
            // it is empty, but it can't be anything *but* empty
            // Is it empty?  Depends on your application.
            if (typeof obj !== "object") return true;

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (let key in obj) {
              if (hasOwnProperty.call(obj, key)) return false;
            }

            return true;
          },
          customDialog(params) {
          
            let buttons = !params.buttons ? [{ text: "OK" }] : params.buttons;
            let modalTex = "";
            if (params.title) {
              modalTex +=
                '<div class="custom-modal-title text-color-red">' +
                params.title +
                "</div>";
            }
            if (params.text) {
              modalTex +=
                '<div class="custom-modal-text">' + params.text + "</div>";
            }

            this.dialog
              .create({
                closeByBackdropClick: !!params.closeByBackdropClick,
                destroyOnClose: true,
                title:
                  '<div class="custom-modal-logo-wrapper"><img class="custom-modal-logo" src="' +
                  this.data.logoModal +
                  '" alt=""/></div>',
                text: modalTex,
                verticalButtons: buttons.length > 2,
                buttons: buttons,
              })
              .open();
          },

          customNotification(params) {
            this.notification
              .create({
                title: this.name,
                //titleRightText: 'now',
                subtitle: params.title ? params.title : "",
                text: params.text ? params.text : "",
                closeTimeout: params.hold ? params.hold : 3000,
                closeOnClick: true,
                //closeButton: true,
                on: {
                  close: function (notification) {
                    notification.$el.remove();
                  },
                },
              })
              .open();
          },
          showToast: function (text) {
            this.toast
              .create({
                position: "top",
                text: text,
                closeTimeout: 1000,
                destroyOnClose: true,
              })
              .open();
          },
          logout() {
            this.view.main.router.back("/", { force: true });
            let mobileToken = !localStorage.PUSH_MOBILE_TOKEN
              ? ""
              : localStorage.PUSH_MOBILE_TOKEN;
            let deviceToken = !localStorage.PUSH_DEVICE_TOKEN
              ? ""
              : localStorage.PUSH_DEVICE_TOKEN;
            let additionalFlags =
              this.methods.getFromStorage("additionalFlags");
            let notifications = this.methods.getFromStorage("notifications");

            

            if (!this.methods.isObjEmpty(additionalFlags)) {
              this.methods.setInStorage({
                name: "additionalFlags",
                data: {},
              });
            }

            localStorage.clear();
            if (!this.methods.isObjEmpty(notifications)) {
              this.methods.setInStorage({
                name: "notifications",
                data: notifications,
              });
            }
            if (deviceToken) localStorage.PUSH_DEVICE_TOKEN = deviceToken;
            if (mobileToken) localStorage.PUSH_MOBILE_TOKEN = mobileToken;
          },
          getFromStorage: function (name) {
            var ret = [];
            var str = "";
            if (name) {
              switch (name) {
                case "additionalFlags":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.ADDIITIONALFLAGS"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;

                case "notifications":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.NOTIFICATIONS"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
//
                  /*case "OperatorsNames":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.OPERNAMES"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;*/
                  
                  case "Misc":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.MISC"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "TrailerRego":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.TRAILERREGO"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "Engine":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.ENGINE"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "CheckCabin":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.CHECKCABIN"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "FuelTank":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.FUELTANK"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "CheckAllSafety":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.CHECKALLSAFETY"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "CheckAndSecure":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.CHECKANDSECURE"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "ExcessiveWear":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.EXCESSIVEWEAR"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "Oil":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.OIL"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "Hydraulics":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.HYDRAULICS"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "Guards":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.GUARDS"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "Wheels":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.WHEELS"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "Cabin":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.CABIN"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "Visibility":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.VISABILITY"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                  case "Brakes":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.BRAKES"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                  
                /*case "panelDamage":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.PANELDAMAGELIST"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                case "trailerFloor":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.TRAILERFLOORLIST"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                case "trailerSidePanel":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.TRAILERSIDEPANELLIST"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                case "tyres":
                  str = localStorage.getItem("COM.QUIKTRAK.PRESTART.TYRESLIST");
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                case "loadSheet":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.LOADSHEETLIST"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;
                   case "OilWater":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.OILWATERLIST"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;*/
                case "customerInfo":
                  str = localStorage.getItem(
                    "COM.QUIKTRAK.PRESTART.CUSTOMERINFO"
                  );
                  if (str) {
                    ret = JSON.parse(str);
                  } else {
                    ret = {};
                  }
                  break;

                default:
                  this.dialog.alert(
                    "There is no item saved with such name - " + name
                  );
              }
            } else {
              this.dialog.alert("Wrong query parameters!");
            }
            return ret;
          },
          setInStorage: function (params) {
            if (typeof params == "object" && params.name && params.data) {
              switch (params.name) {
                case "additionalFlags":
                  let flags = this.methods.getFromStorage(params.name);
                  const keys = Object.keys(params.data);
                  for (const key of keys) {
                    flags[key] = params.data[key];
                  }
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.ADDIITIONALFLAGS",
                    JSON.stringify(flags)
                  );
                  break;

                case "notifications":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.NOTIFICATIONS",
                    JSON.stringify(params.data)
                  );
                  break;
//set

                /*case "OperatorsNames":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.OPERNAMES",
                    JSON.stringify(params.data)
                  );
                  break;*/
                  case "Misc":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.MISC",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "TrailerRego":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.TRAILERREGO",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "Engine":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.ENGINE",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "CheckCabin":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.CHECKCABIN",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "FuelTank":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.FUELTANK",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "CheckAllSafety":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.CHECKALLSAFETY",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "CheckAndSecure":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.CHECKANDSECURE",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "Oil":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.OIL",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "ExcessiveWear":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.EXCESSIVEWEAR",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "Hydraulics":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.HYDRAULICS",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "Guards":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.GUARDS",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "Wheels":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.WHEELS",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "Cabin":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.CABIN",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "Visibility":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.VISABILITY",
                    JSON.stringify(params.data)
                  );
                  break;
                  case "Brakes":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.BRAKES",
                    JSON.stringify(params.data)
                  );
                  break;
                  

/*                case "panelDamage":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.PANELDAMAGELIST",
                    JSON.stringify(params.data)
                  );
                  break;
                case "trailerFloor":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.TRAILERFLOORLIST",
                    JSON.stringify(params.data)
                  );
                  break;
                case "trailerSidePanel":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.TRAILERSIDEPANELLIST",
                    JSON.stringify(params.data)
                  );
                  break;
                case "tyres":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.TYRESLIST",
                    JSON.stringify(params.data)
                  );
                  break;
                case "loadSheet":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.LOADSHEETLIST",
                    JSON.stringify(params.data)
                  );
                  break;
                   case "OilWater":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.OILWATERLIST",
                    JSON.stringify(params.data)
                  );
                  break;
                  */
                case "customerInfo":
                  localStorage.setItem(
                    "COM.QUIKTRAK.PRESTART.CUSTOMERINFO",
                    JSON.stringify(params.data)
                  );
                  break;
                default:
                  this.dialog.alert(
                    "There is no function associated with this name - " +
                      params.name
                  );
              }
            } else {
              this.dialog.alert("Wrong query parameters!");
            }
          },
          getStars: function (Raiting) {
            if (Raiting) {
              Raiting = parseFloat(Raiting);
            }
            var ret = {
              Value: 0,
              Template: "",
              Color: "",
            };

            switch (true) {
              case Raiting >= 9:
                ret.Value = 5;
                ret.Color = "text-color-green";
                break;

              case Raiting >= 7:
                ret.Value = 4;
                ret.Color = "text-color-green";
                break;

              case Raiting >= 5:
                ret.Value = 3;
                ret.Color = "text-color-orange";
                break;

              case Raiting >= 3:
                ret.Value = 2;
                ret.Color = "text-color-red";
                break;

              default:
                ret.Value = 1;
                ret.Color = "text-color-red";
            }
            /*for (var i = ret.Value; i >= 1; i--) {
                  ret.Template += '<i class="f7-icons icon-trip-star"></i>';
              }*/
            for (var i = 1; i <= 5; i++) {
              if (i <= ret.Value) {
                ret.Template +=
                  '<i class="f7-icons icon-trip-star ' + ret.Color + '"></i>';
              } else {
                ret.Template +=
                  '<i class="f7-icons icon-trip-star text-color-gray"></i>';
              }
            }

            return ret;
          },
          getGaugeRaitingDetails: function (Raiting) {
            var ret = {
              Value: 0,
              BorderColor: "#BC2132",
              Raiting: 0,
            };

            ret.Raiting = Raiting;
            ret.Value = Raiting / 10;
            switch (true) {
              case Raiting >= 8:
                ret.BorderColor = "#39B54A";
                break;

              case Raiting >= 5:
                ret.BorderColor = "#F7931E";
                break;
            }

            return ret;
          },
          getBooleanVal: function (val) {
            return val ? JSON.parse(val.toLowerCase()) : "";
          },
          setNotificationList: function (list) {
            let self = this;

            let pushList = self.methods.getFromStorage("notifications");
            let user = localStorage.USERNAME;

            if (!pushList || self.methods.isObjEmpty(pushList)) {
              pushList = {};
            }
            if (!pushList[user]) {
              pushList[user] = [];
            }

            if (Array.isArray(list)) {
              list = formatNewNotification(list);
              for (let i = 0; i < list.length; i++) {
                list[i].UniqueId = self.utils.id();
                pushList[user].unshift(list[i]);
              }
            }
            self.methods.setInStorage({
              name: "notifications",
              data: pushList,
            });
          },
          getNewNotifications() {
            return new Promise(async (resolve, reject) => {
              let newNotifications = await store.dispatch(
                "GET_NEW_NOTIFICATIONS",
                {
                  MinorToken: store.state.info.MinorToken,
                  deviceToken: !localStorage.PUSH_DEVICE_TOKEN
                    ? ""
                    : localStorage.PUSH_DEVICE_TOKEN,
                }
              );
              //newNotifications = ['{"title":"test","type":32,"imei":"0000001683122697","name":"0000001683122697","lat":50.249984,"lng":32.282368,"speed":130,"direct":0,"time":"2018-08-23 16:56:37"}'];
              //newNotifications = ['{"Imei":"0354188046337940","AssetName": "Test","Acc":"OFF","Relay":"OFF","Battery":"4477(mV)","Charger":"0(mV)","Power":"1","GPS":"V,0","GSM":"2,-107(dB)","GPRS":"Offline","alarm":"status","Imsi":"43688875220070"}'];
              if (
                !newNotifications ||
                !Array.isArray(newNotifications) ||
                !newNotifications.length
              ) {
                resolve([]);
                return;
              }
              this.methods.setNotificationList(newNotifications);
              resolve(newNotifications);
            });
          },
        },
      },
    };
  },
  components: {
    sidebar,
  },
  computed: {
    ...mapGetters(["error", "apiValidationError", "info"]),
    /* error() {
        return this.$store.getters.error
      },
      apiValidationError() {
        return this.$store.getters.apiValidationError
      }*/
  },
  methods: {
   

    async onReady(f7) {
      // Init cordova APIs (see cordova-app.js)
      //const vConsole = new VConsole();
      if (Device.cordova) {
        cordovaApp.init(f7);
      }
      getDevicePushInfo();

      if (localStorage.USERNAME && localStorage.PASSWORD) {
        const formData = {
          username: localStorage.USERNAME,
          password: localStorage.PASSWORD,

          AppKey: !localStorage.PUSH_APP_KEY
            ? "123"
            : localStorage.PUSH_APP_KEY,
          MobileToken: !localStorage.PUSH_MOBILE_TOKEN
            ? "123"
            : localStorage.PUSH_MOBILE_TOKEN,
          DeviceToken: !localStorage.PUSH_DEVICE_TOKEN
            ? "123"
            : localStorage.PUSH_DEVICE_TOKEN,
          DeviceType: !localStorage.DEVICE_TYPE
            ? "webapp"
            : localStorage.DEVICE_TYPE,
        };
        // this.$f7.dialog.preloader(this.$ml.get('COM_MSG019'));
        this.$f7.progressbar.show();
        await this.$store.dispatch("login", formData);
        //await this.$nextTick();
        this.$f7.progressbar.hide();
        //this.$f7.dialog.close();
      }
    },
  },
  watch: {
    error(err) {
      this.$f7.dialog.alert(
        this.$ml.get("PROMPT_MSG001"),
        this.$ml.get("PROMPT_MSG000")
      );
      //this.$error(messages[fbError.code] || 'Something not good')
    },
     apiValidationError(err) {
      switch (err.method) {
        case "login":
          this.$f7.methods.customDialog({
            title: this.$ml.get("PROMPT_MSG000"),
            text: this.$ml.get("AUTH_MSG000"),
          });
          break;

        case "start_trip":
          if (
            err.MajorCode === "100" &&
            err.MinorCode === "1002" &&
            err.Data === "ANOTHER_TRIP_IS_RUNNING"
          ) {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG014"),
            });
          } else if (
            err.MajorCode === "100" &&
            err.MinorCode === "1002" &&
            err.Data === "NO_POSITION"
          ) {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG017"),
            });
          } else if (
            err.MajorCode === "100" &&
            err.MinorCode === "ASSET_BE_USEING"
          ) {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml
                .with("name", err.Data.FirstName + " " + err.Data.SurName)
                .get("PROMPT_MSG031"),
            });
          } else if (
            err.MajorCode === "100" &&
            err.MinorCode === "DRIVER_BIND_OTHER_CAR"
          ) {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text:
                "You are already driving another vehicle: " +
                err.Data.UsingAssetName +
                ". Finish current trip and try again",
              buttons: [
                {
                  text: "OK",
                },
                {
                  text: "Finish Trip",
                   onClick: async () => {
                   
                      
                   await this.$store.dispatch("UNBIND_ASSET", { Imei: err.Data.UsingAssetImei});
                     //console.log(result);
                  }
                }
              ],
            });
          } else {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG001"),
            });
          }
          break;
        //{"MajorCode":"100","MinorCode":"ASSET_BE_USEING","Data":{"FirstName":"driver","SurName":"driver","Mail":"prestart.driver@gmail.com","Code":"0d1aec9f-d5ac-4668-99c6-6bf85758b7e8"}}
        case "end_trip":
          if (
            err.MajorCode === "100" &&
            err.MinorCode === "1002" &&
            err.Data === "NO_TRIP_RECORD"
          ) {
            let obj = {
              isTripStarted: false,
              Trip: {},
            };
            this.$f7.methods.setInStorage({
              name: "additionalFlags",
              data: obj,
            });
            this.$store.dispatch("updateCurrentTrip", obj);
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG015"),
            });
          } else {
            // this.$f7.methods.customDialog({
            //   title: this.$ml.get("PROMPT_MSG000"),
            //   text: this.$ml.get("PROMPT_MSG001"),
            // });
          }
          break;

        case "get_playback":
          if (err.MajorCode === "100" && err.MinorCode === "1002") {
            /*this.$f7.methods.customDialog({
                title: this.$ml.get('TRIPS_MSG002'),
                text: this.$ml.get('TRIPS_MSG019')
              })       */
            this.$f7.methods.customDialog({
              title: this.$ml.get("TRIPS_MSG002"),
              text: this.$ml.get("COM_MSG022"),
            });
          } else {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG001"),
            });
          }
          break;

        case "get_playback_optimised":
          this.$f7.methods.customDialog({
            title: this.$ml.get("PROMPT_MSG000"),
            text: this.$ml.get("PROMPT_MSG016"),
          });
          break;

        case "edit_account":
          if (err.MajorCode === "100" && err.MinorCode === "1002") {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG018"),
            });
          } else {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG001"),
            });
          }
          break;

        case "change_password":
          if (err.MajorCode === "100" && err.MinorCode === "1004") {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG019"),
            });
          } else {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG001"),
            });
          }
          break;

        case "SET_IMMOBILISATION":
          if (
            (err.MajorCode === "100" && err.MinorCode === "1003") ||
            (err.MajorCode === "200" && err.MinorCode === "1003")
          ) {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG030"),
            });
          } else if (err.MajorCode === "100" && err.MinorCode === "0000") {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG029"),
            });
          } else {
            this.$f7.methods.customDialog({
              title: this.$ml.get("PROMPT_MSG000"),
              text: this.$ml.get("PROMPT_MSG001"),
            });
          }
          break;

        default:
          this.$f7.methods.customDialog({
            title: this.$ml.get("PROMPT_MSG000"),
            text: this.$ml.get("PROMPT_MSG001"),
          });
      }
      //this.$error(messages[fbError.code] || 'Something not good')
    },
  },
  mounted() {
    this.$f7ready(this.onReady);
    
  },
};
</script>