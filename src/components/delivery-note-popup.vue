<template>
  <f7-popup
    :opened="openPopup"
    :closeOnEscape="false"
    :closeByBackdropClick="false"
  >
    <f7-page>
      <f7-navbar>
        <f7-nav-left>
          <f7-link icon="icon-back" @click="closePopup"></f7-link>
        </f7-nav-left>
        <f7-nav-title sliding>{{noteDetails.Name}}</f7-nav-title>
        <!--<f7-nav-right>
          <f7-link @click="closePopup">Close</f7-link>
        </f7-nav-right>-->
      </f7-navbar>

      <f7-toolbar bottom no-shadow class="custom-toolbar">
        <div class="row width-100 padding-horizontal">
          <label for="submit-popup-form" class="col button button-fill text-uppercase bg-color-green">
            {{$ml.get('COM_MSG009')}}
          </label>
        </div>
      </f7-toolbar>

      <upload-image-popup
        ref="uploadImagePopup"
        @imageUploaded = "updateImgSrc"
      />

      <div class="top-img-wrapper">
        <div class="top-img-content">
          <f7-photo-browser
            ref="photoBrowser"
            :photos="[imgAddress + img]"
            theme="dark"
          ></f7-photo-browser>
          <img
            v-if="img"
            :src="imgAddress + img"
            alt=""
            @click="$refs.photoBrowser.open()"
          >
        </div>
        <div class="top-img-load-button bg-color-custom" @click="openUploadImgOptions">
          <i class="f7-icons icon-other-photo text-color-white"></i>
        </div>
      </div>

      <f7-list form no-hairlines @submit.prevent="submitHandler">
        <button type="submit" hidden id="submit-popup-form"></button>
        <!--<f7-list-item
          :title="$ml.get('FAULT_POPUP_MSG001')"
          smart-select
          :smart-select-params="{openIn: 'popover' }"
        >
          <f7-icon slot="media" icon="f7-icons icon-other-fail text-color-lightgray"></f7-icon>
          <select name="assetList" v-model="selected" required validate>
            <option
              v-for="reason in noteDetails.Reasons"
              :key="reason.Code"
              :value="reason.Code" >{{reason.Name}}</option>
          </select>
        </f7-list-item>-->

        <f7-list-input
          type="textarea"
          :label="$ml.get('FAULT_POPUP_MSG002')"
          :placeholder="$ml.get('FAULT_POPUP_MSG002')"
          :value="notes"
          @input="notes = $event.target.value"
          required validate
        >
          <f7-icon slot="media" icon="f7-icons icon-other-notes text-color-lightgray" ></f7-icon>
        </f7-list-input>
      </f7-list>
    </f7-page>
  </f7-popup>
</template>

<script>
  //import UploadImagePopup from '../components/upload-image-popup'
  import APIMETHODS from '@/js/api-methods'
  import UploadImagePopup from "./questions/upload-image-popup";
  export default {
    name: "fault-popup",
    components: {UploadImagePopup},
    props: {
      openPopup: {
        type: Boolean,
        default: false
      },
      noteDetails: {
        type: Object,
        default: ()=>{}
      },
     
      savedNotes: {
        type: String,
        default: ''
      },
      savedImg: {
        type: String,
        default: ''
      }
    },
    computed: {

    },

    data() {
      return {
        notes: this.savedNotes,
        //selected: this.selectedReason,
        img: this.savedImg,
        imgAddress: APIMETHODS.DOMAIN9+'Attachment/images/',
        //photos: this.savedImg ? [this.savedImg] : [],
      }
    },


    methods: {
      closePopup(){
        this.$emit('closePopup')
      },
      openUploadImgOptions(){
        this.$refs.uploadImagePopup.showUploadOptions()
      },
      updateImgSrc(src){
        this.img = src;
      },
      submitHandler(){
        this.$emit('setNote',{
          optionCode: this.noteDetails.Code,
          note: {
            PhotoNote: this.notes,
             PhotoPath: this.img,
          }
        })
      }
    },


  }
</script>

<style scoped>

</style>