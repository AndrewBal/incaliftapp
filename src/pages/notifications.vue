<template>
  <f7-page
      name="notifications"
      ptr
      @ptr:refresh="getNewNotifications"
  >
    <f7-progressbar v-if="isLoading" infinite class="position-absolute"></f7-progressbar>
    <f7-navbar large>
      <f7-nav-left back-link="Back">
      </f7-nav-left>
      <f7-nav-title sliding>{{$ml.get('NOTIFICATIONS_MSG000')}}</f7-nav-title>
      <f7-nav-title-large>{{$ml.get('NOTIFICATIONS_MSG000')}}</f7-nav-title-large>
      <f7-nav-right>
        <f7-link icon="f7-icons icon-header-delete" href="#" :class="{ disabled: !items.length }" @click="deleteNotifications"></f7-link>
      </f7-nav-right>

    </f7-navbar>

    <f7-list
      ref="vlNotifications"
      class="vl-notifications"
      no-hairlines
      virtual-list
      media-list
      :virtual-list-params="{ items, searchAll, renderExternal, height: $theme.ios ? 78 : ($theme.md ? 86 : 46)}"
    >
      <ul>
        <f7-list-item
          v-for="item in vlData.items"
          :key="item.UniqueId"
          :title="item.alarm"
          :text="item.AssetName ? item.AssetName : item.name"
          link="#"
          @click="openNotification(item)"
        >
          <span slot="header" >{{item.CreateDateTime ? item.CreateDateTime : item.time}}</span>
        </f7-list-item>
      </ul>
    </f7-list>

    <f7-block v-if="!items.length">
      <p>{{$ml.get('PROMPT_MSG011')}}</p>
    </f7-block>


  </f7-page>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "notifications",

    data(){
      let notificationList = this.$f7.methods.getFromStorage("notifications")

      return{
        isLoading: false,
        items: notificationList && notificationList[localStorage.USERNAME] && notificationList[localStorage.USERNAME].length ? notificationList[localStorage.USERNAME] : [],
        vlData: {
          items: [],
        },
      }
    },
    computed: {
      ...mapGetters(['info']),
    },

    methods: {
      searchAll(query, items) {
        const found = [];
        for (let i = 0; i < items.length; i += 1) {
          if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
        }
        return found; // return array with mathced indexes
      },
      renderExternal(vl, vlData) {
        this.vlData = vlData;
      },
      openNotification(alarm){
        this.$f7router.navigate('/notification/',{
          context: alarm
        })
      },
      async getNewNotifications(ptrDone){
        this.isLoading = true;
        let newNotifications = await this.$f7.methods.getNewNotifications()
        this.isLoading = false;
        if(typeof ptrDone === 'function'){
          ptrDone()
        }

        if(!newNotifications.length){
          return
        }

        let notificationList = this.$f7.methods.getFromStorage("notifications")

        if(notificationList && notificationList[localStorage.USERNAME] && notificationList[localStorage.USERNAME].length > this.vlData.items.length){
          this.items = notificationList[localStorage.USERNAME]
          this.$refs.vlNotifications.f7VirtualList.replaceAllItems(notificationList[localStorage.USERNAME]);
        }

      },
      deleteNotifications(){
        this.$f7.dialog.confirm(this.$ml.get('PROMPT_MSG034'),
            () => {
              let notificationList = this.$f7.methods.getFromStorage("notifications")
              if(notificationList && notificationList[localStorage.USERNAME] && notificationList[localStorage.USERNAME].length){
                notificationList[localStorage.USERNAME] = []
                this.$f7.methods.setInStorage({name: 'notifications', data: notificationList})
                this.$refs.vlNotifications.f7VirtualList.deleteAllItems(notificationList[localStorage.USERNAME]);
                this.items = []
              }
            }
        );
      }
    },

    mounted() {
      this.getNewNotifications()

    }
  }
</script>

<style scoped>

</style>