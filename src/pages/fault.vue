<template>
  <f7-page name="fault">
    <!-- Top Navbar -->
    <f7-navbar large>
      <f7-nav-left back-link="Back">
      </f7-nav-left>
      <f7-nav-title sliding>{{pageTitle}}</f7-nav-title>
      <f7-nav-title-large>{{pageTitle}}</f7-nav-title-large>
    </f7-navbar>

    <div class="top-img-wrapper">
      <div class="top-img-content">
        <f7-photo-browser
          ref="photoBrowser"
          :photos="photos"
          theme="dark"
        ></f7-photo-browser>
        <img
          v-if="fault.Photos"
          :src="photos[0]"
          alt=""
          @click="$refs.photoBrowser.open()">
        <!--<img
          v-if="fault.Photos"
          v-for="(item, index) in photos"
          :src="item"
          alt=""
          @click="$refs.photoBrowser.open()">-->
      </div>
    </div>

    <f7-list no-hairlines>
      <f7-list-item
        :header="$ml.get('FAULTS_MSG001')"
        :title="fault.Time | date"
      >
        <f7-icon slot="media" icon="f7-icons icon-other-date text-color-lightgray"></f7-icon>
      </f7-list-item>
      <f7-list-item
        :header="$ml.get('FAULTS_MSG005')"
        :title="fault.CheckName"
      >
        <f7-icon slot="media" icon="f7-icons icon-other-checklist text-color-lightgray"></f7-icon>
      </f7-list-item>
      <f7-list-item
        :header="$ml.get('FAULTS_MSG003')"
        :title="fault.ReasonName"
      >
        <f7-icon slot="media" icon="f7-icons icon-menu-fault text-color-lightgray"></f7-icon>
      </f7-list-item>
      <f7-list-input
        type="textarea"
        :label="$ml.get('FAULTS_MSG002')"
        :value="fault.OptionName"
        readonly
      >
        <f7-icon slot="media" icon="f7-icons icon-other-na-items text-color-lightgray" ></f7-icon>
      </f7-list-input>

      <f7-list-input
        type="textarea"
        :label="$ml.get('FAULTS_MSG004')"
        :value="fault.Message"
        :placeholder="$ml.get('COM_MSG018')"
        readonly
      >
        <f7-icon slot="media" icon="f7-icons icon-other-notes text-color-lightgray" ></f7-icon>
      </f7-list-input>

    </f7-list>


  </f7-page>


</template>

<script>
  import APIMETHODS from '@/js/api-methods'
  import {mapGetters} from 'vuex'

  export default {
    name: "fault",

    data: ()=>({
      pageTitle: 'Fault Details',
      loading: true,
      fault: {},
      photos: [],
    }),

    computed: {
      ...mapGetters(['faults'])
    },

    async mounted() {
      let fault = this.faults.find(fault => fault.customId === this.$f7route.query.id );
      if(fault && fault.Photos){
        let photos = fault.Photos.split(',');
        let pattern = /^http/i;
        for (let i = 0; i < photos.length; i++) {
          if(!pattern.test(photos[i])){
            photos[i] = APIMETHODS.DOMAIN9+'Attachment/images/'+photos[i];
          }
          this.photos = photos;
        }
      }
      this.pageTitle = fault.AssetName;
      this.fault = fault;

      this.loading = false;
    }

  }
</script>

<style scoped>

</style>