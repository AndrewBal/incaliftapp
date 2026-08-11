<template>
  <f7-popup
    :opened="openPopup"
    :closeOnEscape="false"
    :closeByBackdropClick="false"
  >
    <f7-page>
      <f7-navbar>
        <f7-nav-left>
          <f7-link icon="icon-header-close" @click="closePopup"></f7-link>
        </f7-nav-left>
        <f7-nav-title sliding>{{ item.Name }}</f7-nav-title>
      </f7-navbar>

      <f7-toolbar bottom no-shadow class="custom-toolbar">
        <div class="row width-100 padding-horizontal">
          <f7-button color="green" fill class="col text-uppercase" @click="saveHandler">Done</f7-button>
        </div>
      </f7-toolbar>

      <upload-image-popup
        ref="uploadImagePopup"
        @imageUploaded="updateImgSrc"
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

      <f7-list no-hairlines>
        <f7-list-input
          type="textarea"
          label="Notes"
          placeholder="Notes"
          :value="comment"
          @input="comment = $event.target.value"
        >
          <f7-icon slot="media" icon="f7-icons icon-other-notes text-color-lightgray"></f7-icon>
        </f7-list-input>
      </f7-list>
    </f7-page>
  </f7-popup>
</template>

<script>
import APIMETHODS from '@/js/api-methods'
import UploadImagePopup from "../questions/upload-image-popup";

export default {
  name: "checklist-item-popup",
  components: { UploadImagePopup },
  props: {
    openPopup: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    savedComment: {
      type: String,
      default: "",
    },
    savedImg: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      comment: this.savedComment,
      img: this.savedImg,
      imgAddress: APIMETHODS.DOMAIN9 + 'Attachment/images/',
    };
  },
  watch: {
    savedComment(val) {
      this.comment = val;
    },
    savedImg(val) {
      this.img = val;
    },
  },
  methods: {
    closePopup() {
      this.$emit('closePopup');
    },
    openUploadImgOptions() {
      this.$refs.uploadImagePopup.showUploadOptions();
    },
    updateImgSrc(src) {
      this.img = src;
    },
    saveHandler() {
      this.$emit('save', {
        code: this.item.Code,
        comment: this.comment,
        img: this.img,
      });
    },
  },
};
</script>

<style scoped>
</style>
