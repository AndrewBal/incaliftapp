<template>
  <f7-page name="accident-report">
    <!-- Top Navbar -->
    <f7-progressbar v-if="isLoading" infinite  class="position-absolute"></f7-progressbar>
    <f7-navbar large>
      <f7-nav-left back-link="Back">
      </f7-nav-left>
      <f7-nav-title sliding>{{pageTitle}}</f7-nav-title>
      <f7-nav-title-large>{{pageTitle}}</f7-nav-title-large>
    </f7-navbar>

    <f7-toolbar bottom no-shadow class="custom-toolbar">
      <div class="row width-100 padding-horizontal">
        <label for="submit-form-accident-report" class="col button button-fill text-uppercase bg-color-green">
          {{$ml.get('COM_MSG008')}}
        </label>
      </div>
    </f7-toolbar>

    <form @submit.prevent="submitHandler">
      <input type="submit" hidden id="submit-form-accident-report">

      <f7-block-title>{{ $ml.get('ACCIDENT_REPORT_MSG010') }}</f7-block-title>
      <f7-list class="no-hairline-bottom" >
        <f7-list-input
            :label="$ml.get('USER_SETTINGS_MSG003')"
            :placeholder="$ml.get('USER_SETTINGS_MSG003')"
            type="text"
            clear-button
            :value="firstName"
            @input="firstName = $event.target.value"
        >
          <f7-icon slot="media" icon="f7-icons icon-profile-name  text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('USER_SETTINGS_MSG004')"
            :placeholder="$ml.get('USER_SETTINGS_MSG004')"
            type="text"
            clear-button
            :value="lastName"
            @input="lastName = $event.target.value"
        >
          <f7-icon slot="media" icon="f7-icons icon-profile-name text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('USER_SETTINGS_MSG005')"
            :placeholder="$ml.get('USER_SETTINGS_MSG005')"
            type="email"
            clear-button
            :value="email"
            @input="email = $event.target.value"
        >
          <f7-icon slot="media" icon="f7-icons icon-profile-email text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('USER_SETTINGS_MSG006')"
            :placeholder="$ml.get('USER_SETTINGS_MSG006')"
            type="tel"
            clear-button
            :value="phone"
            @input="phone = $event.target.value"
        >
          <f7-icon slot="media" icon="f7-icons icon-profile-phone text-color-lightgray"></f7-icon>
        </f7-list-input>
      </f7-list>

      <f7-block-title>{{ $ml.get('ACCIDENT_REPORT_MSG014') }}</f7-block-title>
      <f7-list class="no-hairline-bottom">
        <f7-list-input
            :label="$ml.get('ACCIDENT_REPORT_MSG007')"
            :placeholder="$ml.get('ACCIDENT_REPORT_MSG007')"
            type="text"
            clear-button
            :value="address"
            @input="address = $event.target.value"
            validate
            required
        >
          <f7-icon slot="media" icon="f7-icons icon-address text-color-lightgray"></f7-icon>
          <div slot="content-end" @click.stop="isMapSelectAddressOpened = true" class="link margin-right"><i class="f7-icons icon-address text-color-green "></i></div>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('ACCIDENT_REPORT_MSG013')"
            placeholder="50.249984, 32.282368"
            type="text"
            clear-button
            :value="addressCoords"
            @input="addressCoords = $event.target.value"
        >
          <f7-icon slot="media" icon="f7-icons icon-coordinates text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('ACCIDENT_REPORT_MSG008')"
            :placeholder="$ml.get('ACCIDENT_REPORT_MSG008')"
            type="textarea"
            clear-button
            :value="notes"
            @input="notes = $event.target.value"
        >
          <f7-icon slot="media" icon="f7-icons icon-other-notes text-color-lightgray"></f7-icon>
        </f7-list-input>
      </f7-list>

      <f7-block-title>{{ $ml.get('ACCIDENT_REPORT_MSG011') }}</f7-block-title>
      <f7-list class="no-hairline-bottom">
        <f7-list-input
            :label="$ml.get('NOTIFICATIONS_MSG002')"
            :placeholder="$ml.get('NOTIFICATIONS_MSG002')"
            type="text"
            clear-button
            :value="assetName"
            @input="assetName = $event.target.value"
            validate
            required
        >
          <f7-icon slot="media" icon="f7-icons icon-other-asset text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('ACCIDENT_REPORT_MSG001')"
            :placeholder="$ml.get('ACCIDENT_REPORT_MSG001')"
            type="text"
            clear-button
            :value="registration"
            @input="registration = $event.target.value"
            validate
            required
        >
          <f7-icon slot="media" icon="f7-icons icon-interval-reminder-registration text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('ACCIDENT_REPORT_MSG002')"
            :placeholder="$ml.get('ACCIDENT_REPORT_MSG002')"
            type="text"
            clear-button
            :value="vinNumber"
            @input="vinNumber = $event.target.value"
            validate
            required
        >
          <f7-icon slot="media" icon="f7-icons icon-imei text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('ACCIDENT_REPORT_MSG003')"
            :placeholder="$ml.get('ACCIDENT_REPORT_MSG003')"
            type="text"
            clear-button
            :value="make"
            @input="make = $event.target.value"
            validate
            required
        >
          <f7-icon slot="media" icon="f7-icons icon-header-tracking text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('ACCIDENT_REPORT_MSG004')"
            :placeholder="$ml.get('ACCIDENT_REPORT_MSG004')"
            type="text"
            clear-button
            :value="model"
            @input="model = $event.target.value"
            validate
            required
        >
          <f7-icon slot="media" icon="f7-icons icon-header-tracking text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('ACCIDENT_REPORT_MSG005')"
            :placeholder="$ml.get('ACCIDENT_REPORT_MSG005')"
            type="text"
            clear-button
            :value="color"
            @input="color = $event.target.value"
            validate
            required
        >
          <f7-icon slot="media" icon="f7-icons icon-live-color text-color-lightgray"></f7-icon>
        </f7-list-input>
        <f7-list-input
            :label="$ml.get('ACCIDENT_REPORT_MSG006')"
            :placeholder="$ml.get('ACCIDENT_REPORT_MSG006')"
            type="text"
            clear-button
            :value="year"
            @input="year = $event.target.value"
            validate
            required
        >
          <f7-icon slot="media" icon="f7-icons icon-other-date text-color-lightgray"></f7-icon>
        </f7-list-input>
      </f7-list>

      <f7-block-title class="display-flex justify-content-space-between align-items-flex-end">
        {{ $ml.get('ACCIDENT_REPORT_MSG015') }}
        <a @click="addOtherDriver" href="#" class="link">
          <f7-icon f7="plus" class="text-color-green"></f7-icon>
        </a>
      </f7-block-title>
      <f7-card v-for="(item, index) in otherVehicles" :key="index" >
        <f7-card-header
            valign="center"
          >
          {{ $ml.with("number", index+1).get('ACCIDENT_REPORT_MSG016') }}
          <a @click="removeOtherDriver(index)" href="#" class="link">
            <f7-icon icon="f7-icons icon-header-close size-16 text-color-red"></f7-icon>
          </a>
        </f7-card-header>
        <f7-card-content :padding="false">
          <f7-list class="padding-bottom">
            <f7-list-input
                :label="$ml.get('ACCIDENT_REPORT_MSG017')"
                :placeholder="$ml.get('ACCIDENT_REPORT_MSG017')"
                type="text"
                clear-button
                :value="item.driverName"
                @input="item.driverName = $event.target.value"
                validate
                required
            >
              <f7-icon slot="media" icon="f7-icons icon-profile-name  text-color-lightgray"></f7-icon>
            </f7-list-input>
            <f7-list-input
                :label="$ml.get('USER_SETTINGS_MSG006')"
                :placeholder="$ml.get('USER_SETTINGS_MSG006')"
                type="tel"
                clear-button
                :value="item.phone"
                @input="item.phone = $event.target.value"
                validate
                required
            >
              <f7-icon slot="media" icon="f7-icons icon-profile-phone text-color-lightgray"></f7-icon>
            </f7-list-input>
            <f7-list-input
                :label="$ml.get('ACCIDENT_REPORT_MSG018')"
                :placeholder="$ml.get('ACCIDENT_REPORT_MSG018')"
                type="text"
                clear-button
                :value="item.vehicleRegistration"
                @input="item.vehicleRegistration = $event.target.value"
                validate
                required
            >
              <f7-icon slot="media" icon="f7-icons icon-interval-reminder-registration text-color-lightgray"></f7-icon>
            </f7-list-input>
            <f7-list-input
                :label="$ml.get('ACCIDENT_REPORT_MSG003')"
                :placeholder="$ml.get('ACCIDENT_REPORT_MSG003')"
                type="text"
                clear-button
                :value="item.make"
                @input="item.make = $event.target.value"
            >
              <f7-icon slot="media" icon="f7-icons icon-header-tracking text-color-lightgray"></f7-icon>
            </f7-list-input>
            <f7-list-input
                :label="$ml.get('ACCIDENT_REPORT_MSG004')"
                :placeholder="$ml.get('ACCIDENT_REPORT_MSG004')"
                type="text"
                clear-button
                :value="item.model"
                @input="item.model = $event.target.value"
            >
              <f7-icon slot="media" icon="f7-icons icon-header-tracking text-color-lightgray"></f7-icon>
            </f7-list-input>
            <f7-list-input
                :label="$ml.get('ACCIDENT_REPORT_MSG005')"
                :placeholder="$ml.get('ACCIDENT_REPORT_MSG005')"
                type="text"
                clear-button
                :value="item.color"
                @input="item.color = $event.target.value"
            >
              <f7-icon slot="media" icon="f7-icons icon-live-color text-color-lightgray"></f7-icon>
            </f7-list-input>
            <f7-list-input
                :label="$ml.get('ACCIDENT_REPORT_MSG006')"
                :placeholder="$ml.get('ACCIDENT_REPORT_MSG006')"
                type="text"
                clear-button
                :value="item.year"
                @input="item.year = $event.target.value"
            >
              <f7-icon slot="media" icon="f7-icons icon-other-date text-color-lightgray"></f7-icon>
            </f7-list-input>
          </f7-list>
        </f7-card-content>
      </f7-card>


      <f7-block-title>{{ $ml.get('ACCIDENT_REPORT_MSG009') }}</f7-block-title>
      <div class="list no-hairlines-between no-hairline-bottom ">
        <ul class="row justify-content-flex-start">
          <li v-for="(photoSrc, key) in photos" :key="key" class="col-33 margin-top margin-bottom margin-left-half" @click="$refs.photoBrowser.open(key)">
            <div class="bg-color-lightgray image-container">
              <img class="content" :src="imgAddress + photoSrc" alt=""/>
              <a @click.stop="removeImg(photoSrc)" href="#" class="link delete"><i class="f7-icons icon-header-close size-18 text-color-red"></i></a>
            </div>
          </li>
          <li v-if="photos.length < maxPhotosCount" class="col-33 margin-top margin-bottom margin-left-half" @click="openUploadImgOptions">
            <div class="bg-color-lightgray image-container">
              <div class="content"></div>
            </div>
          </li>
        </ul>
      </div>

    </form>


    <map-select-address
        :isOpened = isMapSelectAddressOpened
        :addressCoords = addressCoords

        @closePopup="isMapSelectAddressOpened = false"
        @addressSelected = "setAddress"
    />

    <f7-photo-browser
        ref="photoBrowser"
        :photos="photoBrowserImages"
        theme="dark"
    ></f7-photo-browser>
    <upload-image-popup
        ref="uploadImagePopup"
        @imageUploaded = "addImgSrc"
    />
  </f7-page>


</template>

<script>

  import MapSelectAddress from "../components/accident-report/map-select-address"
  import UploadImagePopup from "../components/questions/upload-image-popup";
  import {mapGetters} from "vuex";
  import APIMETHODS from '@/js/api-methods'

  export default {
    name: "accident-report",

    components: { MapSelectAddress, UploadImagePopup },

    data() {
      return {
        pageTitle: this.$ml.get('ACCIDENT_REPORT_MSG000'),
        isLoading: false,
        isMapSelectAddressOpened: false,
        imgAddress: APIMETHODS.DOMAIN9+'Attachment/images/',
        details: this.$f7route.context,

        firstName: '',
        lastName: '',
        email: '',
        phone: '',

        assetName: '',
        registration: '',
        vinNumber: '',
        make: '',
        model: '',
        color: '',
        year: '',
        address: '',
        addressCoords: '',
        addressLat: '',
        addressLng: '',
        notes: '',

        otherVehicles: [],

        photos: [],
        maxPhotosCount: 10,
      }
    },

    computed: {
      ...mapGetters(['info']),
      photoBrowserImages(){
        return !this.photos.length ? [] : this.photos.map( itm => this.imgAddress + itm)
      }
    },

    mounted() {


      console.log(this.details)
      this.getAssetDetails()

      this.firstName = this.info.User.FirstName;
      this.lastName = this.info.User.SubName;
      this.email = this.info.User.EMail;
      this.phone = this.info.User.Mobile;

      this.addOtherDriver()
    },

    methods: {
      async getAssetDetails(){
        this.isLoading = true
        let asset = await this.$store.dispatch('GET_ASSET_DETAILS', {
          MajorToken: this.info.MajorToken,
          imeis: this.$f7route.query.imei,
        })
        this.isLoading = false

        if(this.$f7.methods.isObjEmpty(asset)){
          return
        }
        this.assetName = asset.Name
        //this.registration = asset.Name
        this.vinNumber = asset.VinNumber
        this.make = asset.Make
        this.model = asset.Model
        this.color = asset.Color
        this.year = asset.Year


        console.log(asset)
      },
      async setAddress(params){
        if (!params || !params.length){
          return
        }
        this.addressCoords = params.toString()
        this.addressLat = params[0]
        this.addressLng = params[1]
        this.$f7.progressbar.show();
        this.address = await this.$store.dispatch('fetchAddress', {lat: params[0], lng: params[1]});
        this.$f7.progressbar.hide();
      },
      openUploadImgOptions(){
        this.$refs.uploadImagePopup.showUploadOptions()
      },
      addImgSrc(src){
        this.photos.push(src)
      },
      removeImg(src){
        let index = this.photos.findIndex(itm => itm === src )
        if (index !== -1){
          this.photos.splice(index, 1)
        }
      },
      addOtherDriver(){
        this.otherVehicles.unshift({
          driverName: '',
          phone: '',
          vehicleRegistration: '',
          make: '',
          model: '',
          color: '',
          year: '',
        })
      },
      removeOtherDriver(index){
        this.otherVehicles.splice(index, 1)
      },
      async endTrip() {
        let additionalFlags = this.$f7.methods.getFromStorage("additionalFlags");

          let data = {
          GenralNote: this.details.GenralNote,
          Notes: this.details.Notes,
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,
          isRouteFinished: true,
          TaskCode: additionalFlags.Trip.TaskCode, //this.Trip.TaskCode,
        };

        this.$f7.progressbar.show();
        let result = await this.$store.dispatch("END_TRIP", data);
        this.$f7.progressbar.hide();

        if (!result) {
          return;
        }

        let tripObj = {
          isTripStarted: false,
         Trip: {},
        };
        this.$f7.methods.setInStorage({
          name: "additionalFlags",
          data: tripObj,
        });
        this.$store.dispatch("updateCurrentTrip", tripObj);

        this.$store.dispatch("SET_NOTIFICATION_STATUS", {
          IMEI: this.$f7route.query.imei,
          MinorToken: this.info.MinorToken,
          State: 0,
          MobileToken: !localStorage.PUSH_MOBILE_TOKEN
            ? "123"
            : localStorage.PUSH_MOBILE_TOKEN,
          AppKey: !localStorage.PUSH_APP_KEY
            ? "123"
            : localStorage.PUSH_APP_KEY,
          Token: !localStorage.PUSH_DEVICE_TOKEN
            ? "123"
            : localStorage.PUSH_DEVICE_TOKEN,
          Type: !localStorage.DEVICE_TYPE ? "webapp" : localStorage.DEVICE_TYPE,
        });
        
        /*this.$f7.methods.setInStorage({
          name: "panelDamage",
          data: {},
        });

        this.$f7.methods.setInStorage({
          name: "trailerFloor",
          data: {},
        });

        this.$f7.methods.setInStorage({
          name: "trailerSidePanel",
          data: {},
        });

        this.$f7.methods.setInStorage({
          name: "tyres",
          data: {},
        });

        this.$f7.methods.setInStorage({
          name: "loadSheet",
          data: {},
        });
         this.$f7.methods.setInStorage({
          name: "OilWater",
          data: {},
        });*/
        this.$f7.methods.setInStorage({
            name: 'Brakes',
            data: {}
          });
        this.$f7.methods.setInStorage({
            name: 'Visibility',
            data: {}
          });
        this.$f7.methods.setInStorage({
            name: 'Cabin',
            data: {}
          });
        this.$f7.methods.setInStorage({
          name: 'Wheels',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'Guards',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'Hydraulics',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'ExcessiveWear',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'Oil',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'CheckAndSecure',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'CheckAllSafety',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'FuelTank',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'CheckCabin',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'Engine',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'TrailerRego',
          data: {}
        });
        this.$f7.methods.setInStorage({
          name: 'Misc',
          data: {}
        });
        /*this.$f7.methods.setInStorage({
          name: 'OperatorsNames',
          data: {}
        });*/
        
      },
      async submitHandler() {
        let splittedCoords = this.addressCoords.split(',')
        let data = {
          MinorToken: this.info.MinorToken,
          MajorToken: this.info.MajorToken,

          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone,
          imei: this.$f7route.query.imei,
          assetName: this.assetName,
          registration: this.registration,
          vinNumber: this.vinNumber,
          make: this.make,
          model: this.model,
          color: this.color,
          year: this.year,
          address: this.address,
          notes: this.notes,
          photos: [...this.photos],
          lat: splittedCoords.length === 2 ? splittedCoords[0].trim() : this.lat ? this.lat : '',
          lng: splittedCoords.length === 2 ? splittedCoords[1].trim() : this.lng ? this.lng : '',

          otherVehicles: this.otherVehicles.map(a => ({...a}))
        };

        //addressCoords

        console.log(data)
        this.isLoading = true;
        let result = await this.$store.dispatch('SUBMIT_ACCIDENT_REPORT', data);
        this.isLoading = false;

        if(!result){
          return
        }

        this.$f7.methods.customDialog({
          text: this.$ml.get('PROMPT_MSG040')
        })

        this.endTrip()
        this.$f7.view.main.router.back();
      }
    }

  }
</script>

<style scoped>
  .image-container{
    position: relative;
    width: 100%;
    padding-top: 75%; /* 4:3 Aspect Ratio */
    background-image: url("../static/images/other-image.svg");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 35%;
    border-radius: 8px;
  }
  .image-container .content{
    position:  absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    margin: auto auto;
    max-height: 100%;
    max-width: 100%;
  }
  .image-container .delete {
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: rgba(255,255,255,.8);
    border-radius: 50%;
    padding: 4px;
    box-shadow: 0px 0px 10px rgba(0,0,0, .5);
  }
</style>