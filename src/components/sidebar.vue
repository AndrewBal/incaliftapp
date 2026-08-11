<template>
  <f7-panel left cover>
    <f7-view>
      <f7-page class="bg-color-white">
        <f7-block class="menu-top-block">
          <img :src=" require('../static/images/logo.svg') " alt="">
          <slot v-if="isLoggedIn && info && info.User">
            <p class="text-color-white no-margin-bottom">{{info.User.FirstName}} {{info.User.SubName}}</p>
            <p class="text-color-gray no-margin-top">{{info.User.EMail}}</p>

            <span class="app-version">{{appVersion}}</span>
          </slot>

        </f7-block>
        <f7-list no-chevron no-hairlines no-hairlines-between>
          <f7-list-item link="/" view=".view-main" :title="$ml.get('SIDEBAR_MSG001')" back force panel-close>
            <f7-icon slot="media" icon="f7-icons icon-menu-logout text-color-lightgray"></f7-icon>
          </f7-list-item>
          
          <f7-list-item
            :link="activationUrl"
            external 
            target="_blank"
            view=".view-main"
            :title="'Activation'"
            panel-close
          >
            <template #media>
              <f7-icon slot="media" icon="f7-icons icon-other-passed-items text-color-lightgray"></f7-icon>
            </template>
          </f7-list-item>
          <f7-list-item link="/trips/" view=".view-main" :title="$ml.get('SIDEBAR_MSG002')" panel-close>
            <f7-icon slot="media" icon="f7-icons icon-menu-trips text-color-lightgray"></f7-icon>
          </f7-list-item>
          <f7-list-item link="/faults/" view=".view-main" :title="$ml.get('SIDEBAR_MSG003')" panel-close>
            <f7-icon slot="media" icon="f7-icons icon-menu-fault text-color-lightgray"></f7-icon>
          </f7-list-item>
          <!--<f7-list-item link="/messages/" view=".view-main" :title="$ml.get('MESSAGES_MSG000')" panel-close>
            <f7-icon slot="media" icon="f7-icons icon-other-notes text-color-lightgray"></f7-icon>
          </f7-list-item>-->
          <f7-list-item link="/settings/" view=".view-main" :title="$ml.get('SIDEBAR_MSG004')" panel-close>
            <f7-icon slot="media" icon="f7-icons icon-menu-profile text-color-lightgray"></f7-icon>
          </f7-list-item>
          <f7-list-item link="#" :title="$ml.get('SIDEBAR_MSG005')" @click="logout" panel-close>
            <f7-icon slot="media" icon="f7-icons icon-menu-logout text-color-lightgray"></f7-icon>
          </f7-list-item>
        </f7-list>
      </f7-page>
    </f7-view>
  </f7-panel>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    /*params: {
      AppVersion: {
        type: String,
        default: '',
      }
    },*/
    name: "sidebar",
    data:() => ({
      //return {
        appVersion: '' //'1.0.0'//this.$f7.data.AppDetails.appVersion
      //}
    }),
    components:{

    },
    computed: {
      ...mapGetters(['isLoggedIn', 'info']),
      activationUrl() { console.log('this?.info',this?.info)
      return (
        'https://forms.quiktrak.com.au/prestart/activation/?MajorToken='+this?.info?.MajorToken+'&MinorToken='+this?.info?.MinorToken+'&Email='+this?.info?.User?.EMail
        /*f7.utils.serializeObject({
          AgentToken: this.ParentOrgCode,
        })*/
      );
    },
    },

    methods: {
      logout(){
        this.$store.dispatch('logout');
        this.$f7.methods.logout();
        /*this.$f7.view.main.router.back('/',{force: true});
        let additionalFlags = this.$f7.methods.getFromStorage('additionalFlags');
        localStorage.clear();
        if(!this.$f7.methods.isObjEmpty(additionalFlags)){
          this.$f7.methods.setInStorage({ name: 'additionalFlags', data: additionalFlags });
        }*/
      },
    },
    watch: {
      isLoggedIn(){
        this.appVersion = 'v'+this.$f7.data.AppDetails.appVersion
      }
    },

    /*mounted() {
      this.appVersion = 'v'+this.$f7.data.AppDetails.appVersion
    }*/
  }
</script>

<style scoped>
  .menu-top-block{
    margin: 0;
    padding: 15px 15px;
    background-size: cover;
    background-image: url(../static/images/bgmenu.png);
  }
  .menu-top-block img{
    width: 100%;
    max-width: 170px;
  }
  .list{
  --f7-list-item-title-text-color: #000;
  }

</style>