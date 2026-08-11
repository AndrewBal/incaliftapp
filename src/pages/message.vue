<template>
  <f7-page name="message">
    <!-- Top Navbar -->
    <f7-navbar large>
      <f7-nav-left back-link="Back">
      </f7-nav-left>
      <f7-nav-title sliding>{{pageTitle}}</f7-nav-title>
      <f7-nav-title-large>{{pageTitle}}</f7-nav-title-large>
    </f7-navbar>


    <f7-block-title class="display-flex justify-content-space-between white-space-normal">
      <span>{{ details.Title }}</span>
      <span class="white-space-nowrap text-color-gray size-12">{{ details.Date }}</span>
    </f7-block-title>
    <f7-block>
     <!-- <f7-block-header>{{ details.Date }}</f7-block-header>-->
      <p>{{ details.Text }}</p>
    </f7-block>


  </f7-page>


</template>

<script>


  export default {
    name: "message",

    data() {
      return {
        pageTitle: 'Message',
        isLoading: false,
        details: this.$f7route.context
      }
    },

    computed: {

    },

    async mounted() {

    }

  }
</script>

<style scoped>

</style>