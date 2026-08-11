<template>
  <f7-page :page-content="false">
    <!--<f7-navbar :title="$ml.get('SIDEBAR_MSG004')" back-link="Back"></f7-navbar>-->
    <f7-navbar >
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>{{$ml.get('SIDEBAR_MSG004')}}</f7-nav-title>
    </f7-navbar>

    <f7-toolbar tabbar top>
      <f7-link tab-link="#tab-1" tab-link-active>{{$ml.get('USER_SETTINGS_MSG001')}}</f7-link>
      <f7-link tab-link="#tab-2">{{$ml.get('USER_SETTINGS_MSG002')}}</f7-link>
    </f7-toolbar>

    <f7-tabs animated>
      <f7-tab id="tab-1" class="page-content with-bottom-button" tab-active>
        <profile />
      </f7-tab>

      <f7-tab id="tab-2" class="page-content">
        <password />
      </f7-tab>

    </f7-tabs>
  </f7-page>
</template>

<script>
  import Profile from '../components/settings/profile'
  import Password from '../components/settings/password'
  export default {
    name: "settings",

    components: {
      Password,
      Profile
    }
  }
</script>

<style scoped>

</style>