<template>
  <f7-popup
    :opened="openPopup"
    :closeOnEscape="false"
    :closeByBackdropClick="false"
    @popup:opened="popupOpened"
  >
    <f7-page >
      <f7-navbar>
        <f7-nav-left >
          <f7-link icon="icon-back" @click="openPopup = false"></f7-link>
        </f7-nav-left>
        <f7-nav-title sliding>{{$ml.get('COM_MSG011')}}</f7-nav-title>
        <f7-nav-right>
          <f7-link  icon="f7-icons size-20 icon-sign" @click="submitHandler"></f7-link>
        </f7-nav-right>

      </f7-navbar>

      <input ref="ImageInput" type="file" hidden name="ImageInput" id="ImageInput" accept="image/*" @change="onNewImageLoaded">
      <div class="asset_img_before_crop" style="">
        <img style="max-width: 980px; max-height: 980px; " id="image" ref="image" :src="imgSrc" alt="">
       <!-- <img style="max-width: 980px; max-height: 980px; " id="image" ref="image" src="https://res.cloudinary.com/dmuibj5uf/image/upload/v1591374240/sinoafrica/pckahbvv5pt7lgo0rjac.png" alt="">-->
      </div>
      <button type="button" class="button button-fill color-white text-color-black redo" @click="rotateImg(90)"><span class="f7-icons">arrow_uturn_left</span></button>
      <button type="button" class="button button-fill color-white text-color-black undo" @click="rotateImg(-90)"><span class="f7-icons">arrow_uturn_right</span></button>
    </f7-page>
  </f7-popup>
</template>

<script>
  import Vue from 'vue'
  import Cropper from 'cropperjs';
  import APIMETHODS from '@/js/api-methods'

  import 'cropperjs/dist/cropper.css';

  export default {
    name: "upload-image-popup",
    props: {

    },
    data: ()=>({
      imgSrc: '',
      openPopup: false,
    }),
    methods: {
      showUploadOptions: function(){
        let self = this;
        self.$f7.actions.create({
          buttons: [
            {
              //text: this.$ml.get('COM_MSG012'),
              text: `<div class="action_button_wrapper">
                                    <div class="action_button_block action_button_media text-color-lightgray">
                                        <i class="f7-icons icon-other-photo size-20"></i>
                                    </div>
                                    <div class="action_button_block action_button_text ">
                                        ${ this.$ml.get('COM_MSG012') }
                                    </div>
                                </div>`,
              onClick: () => {
                //this.openPopup = true;
                self.getImageFromDevice(1);
              }
            },
            /*{
              //text: this.$ml.get('COM_MSG013'),
              text: `<div class="action_button_wrapper">
                                    <div class="action_button_block action_button_media text-color-lightgray">
                                        <i class="f7-icons icon-other-image size-20"></i>
                                    </div>
                                    <div class="action_button_block action_button_text">
                                        ${ this.$ml.get('COM_MSG013') }
                                    </div>
                                </div>`,
              onClick: function () {
                self.getImageFromDevice(0);
              }
            },*/
            {
              //text: this.$ml.get('COM_MSG013'),
              text: `<div class="action_button_wrapper">
                                    <div class="action_button_block action_button_media text-color-lightgray">
                                        <i class="f7-icons icon-other-image size-20"></i>
                                    </div>
                                    <div class="action_button_block action_button_text">
                                        ${ this.$ml.get('COM_MSG013') }
                                    </div>
                                </div>`,
              onClick: () => {
                //$$('#ImageInput').click();
                this.$refs.ImageInput.click()
              }
            },
            {
              //text: this.$ml.get('COM_MSG004'),
              text: `<div class="action_button_wrapper">
                                    <div class="action_button_block action_button_media text-color-red">
                                        <i class="f7-icons icon-header-close size-16"></i>
                                    </div>
                                    <div class="action_button_block action_button_text">
                                        ${ this.$ml.get('COM_MSG004') }
                                    </div>
                                </div>`,
              color: 'red',
            },
          ]
        }).open();
      },
      getImageFromDevice(source=1){
        if (!navigator.camera) {
          this.$f7.methods.customDialog({ title: this.$ml.get('PROMPT_MSG000'), text: this.$ml.get('PROMPT_MSG007') });
          return;
        }
        let options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: source, // 0:Photo Library, 1=Camera, 2=Saved Album
          encodingType: 0 // 0=JPG 1=PNG
        };

        navigator.camera.getPicture(
          (imgData) => {
            this.imgSrc = "data:image/jpeg;base64," + imgData;
            Vue.nextTick(()=>{
              this.openPopup = true;
            });

          },
          () => {
            //this.$f7.methods.customDialog({ title: this.$ml.get('PROMPT_MSG000'), text: this.$ml.get('PROMPT_MSG008') });
          },
          options);
      },
      rotateImg(angle){
        this.cropper.rotate(angle);
      },
      popupOpened() {
        if(this.cropper){
          this.cropper.destroy();
        }

        this.cropper = new Cropper(this.$refs.image, {
          aspectRatio: NaN,
          dragMode:'move',
          rotatable:true,
          minCropBoxWidth:200,
          minCropBoxHeight:200,
          minCanvasWidth:200,
          minCanvasHeight:200,
          minContainerWidth:200,
          minContainerHeight:200,
          crop: function(data) {
          }
        });
      },
      onNewImageLoaded(e){
        let noError = 1;
        //console.log( e.target)
        let file = e.target.files[0];
        let maxFileSize = 5; // in MB
        if (file) {
          //validate file extension(filetype)
          if (!/image/.test(file.type)) {
            noError = 0;
            this.$f7.methods.customNotification({title:this.$ml.get('PROMPT_MSG037')});
          }
          //validate file size
          if ( file.size > maxFileSize * 1024 * 1024 ) {
            //console.log('here');
            noError = 0;
            this.$f7.methods.customNotification({title:this.$ml.get('PROMPT_MSG038') + ' ' + maxFileSize + this.$ml.get('PROMPT_MSG039')});
          }
          if (noError) {
            this.previewFile(file);
          }
        }
      },
      previewFile(file){
        this.$f7.progressbar.show();

        let reader  = new FileReader();

        reader.onloadend = () => {
          // preview.src = reader.result;
          this.imgSrc = reader.result;
          Vue.nextTick(()=>{
            this.openPopup = true;
          });
          this.$f7.progressbar.hide();
        };

        if (file) {
          reader.readAsDataURL(file); //reads the data as a URL
        } else{
          this.$f7.dialog.close();
        }
      },
      submitHandler(){
        let resImg =  this.cropper.getCroppedCanvas({
          minWidth: 200,
          minHeight: 200
        }).toDataURL("image/jpeg",0.4);

        this.$f7.data.NewImageTimestamp = new Date().getTime();
        let assetImg = {
          data: resImg,
          id: 'Prestart_'+this.$f7.data.NewImageTimestamp
        };

        this.$f7.dialog.progress();
        this.$f7.request.promise.post(APIMETHODS.URL.PHOTO_UPLOAD, assetImg, 'json')
          .then( (result) => {
            this.$f7.dialog.close();
            if(result.data.MajorCode === '000') {
              //console.log(result.data);
              this.openPopup = false;
              this.$emit('imageUploaded', result.data.Data+'?'+ this.$f7.data.NewImageTimestamp);
            }else{
              this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG009') + `<br>MajorCode: ${result.data.MajorCode}<br>MinorCode: ${result.data.MinorCode}<br>${result.data.Data}`);
            }
            this.$f7.popup.close();
          })
          .catch( (err) => {
            console.log(err);
            this.$f7.dialog.close();
            if (err && err.status === 404){
              this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG003'));
            }else if(err && err.status === 413 && err.message === "Request Entity Too Large"){
              this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG041'));
            }else{
              this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG001'));
            }
          });
      }
    }
  }
</script>

<style scoped>
  /* ASSET EDIT PHOTO */
  .asset_img_before_crop{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .asset_img_before_crop img{
    width: 100%;
    max-width: 100%;
  }
  .redo,
  .undo{

    position: absolute;
    bottom: 20px;
    left :20px;
    right: auto;
    font-size: 30px;
    width: 80px;
  }
  .undo{
    left: auto;
    right :20px;
  }
</style>