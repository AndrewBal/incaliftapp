<template>
  <f7-page name="notifications">
    <f7-navbar large>
      <!--<f7-nav-left back-link="Back">
      </f7-nav-left>-->
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>{{$ml.get('MESSAGES_MSG000')}}</f7-nav-title>
      <f7-nav-title-large>{{$ml.get('MESSAGES_MSG000')}}</f7-nav-title-large>
      <f7-nav-right>
        <!--<f7-link icon="f7-icons icon-header-delete" href="#" :class="{ disabled: !items.length }"></f7-link>-->
      </f7-nav-right>

    </f7-navbar>

    <f7-list
      v-if="items.length"
      class="vl-notifications"
      no-hairlines
      virtual-list
      media-list
      :virtual-list-params="{ items, searchAll, height: $theme.ios ? 78 : ($theme.md ? 86 : 46)}"
    >
      <ul>
        <f7-list-item
          v-for="item in items"
          :key="item.id"
          :title="item.Title"
          :text="item.Text"
          :after="item.Date"
          link="#"
          @click="openMessage(item)"
        >
          <span slot="header" >
            <f7-icon class="f7-icons icon-profile-email text-color-lightgray size-16 message-icon">
              <f7-badge v-if="!item.isReaded" color="red"></f7-badge>
            </f7-icon>
          </span>
        </f7-list-item>
      </ul>
    </f7-list>

    <f7-block v-else>
      <p>{{$ml.get('PROMPT_MSG011')}}</p>
    </f7-block>


  </f7-page>
</template>

<script>
  export default {
    name: "notifications",

    data(){
      return {
        loading: true,
        items: [],
        /* vlData: {
           items: [],
         },*/
      }
    },

    methods: {
      searchAll(query, items) {
        const found = [];
        for (let i = 0; i < items.length; i += 1) {
          if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
        }
        return found; // return array with mathced indexes
      },
      openMessage(item){
        item.isReaded = true
        this.$f7.view.main.router.navigate({
          name: 'message',
        }, {
          context: item
        })
      }
    },

    async mounted() {
      //let items = await this.$store.dispatch('GET_FAULTS_FROM_API');
     /* items.map(item => {
        item.Stars = this.$f7.methods.getStars(item.Raiting);
      });*/
      this.items = [{
        id: '1',
        Title: 'Message Title',
        Text: 'Some message text goes here',
        Date: '21/10/21 12:34:12',
        isReaded: false,
      },{
        id: '2',
        Title: 'Message Title2',
        Text: 'Some message text goes here2',
        Date: '20/10/21 12:34:12',
        isReaded: false,
      }];


      this.loading = false;
    }
  }
</script>

<style scoped>

</style>