<template>

  <div class="with-bottom-button box-sizing-border-box ">

    <f7-toolbar bottom no-shadow class="custom-toolbar">
      <div class="row width-100 padding-horizontal">
        <label for="submit-form-profile" class="col button button-fill text-uppercase bg-color-green">
          {{$ml.get('COM_MSG008')}}
        </label>
      </div>
    </f7-toolbar>

    <f7-list no-hairlines form @submit.prevent="submitHandler">
      <input type="submit" hidden id="submit-form-profile">
      <f7-list-input
        :label="$ml.get('USER_SETTINGS_MSG003')"
        :placeholder="$ml.get('USER_SETTINGS_MSG003')"
        type="text"
        clear-button
        :value="firstName"
        @input="firstName = $event.target.value"
      >
        <f7-icon slot="media" icon="f7-icons icon-profile-name text-color-lightgray"></f7-icon>
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
  </div>

</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: "profile",

    data: () => ({
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    }),

    computed: {
      ...mapGetters(['info'])
    },

    methods: {
      async submitHandler() {
        var params = {
          MajorToken: this.info.MajorToken,
          MinorToken: this.info.MinorToken,

          FirstName: this.firstName,
          SubName: this.lastName,
          Mobile: this.phone,
          // Phone: this.phone,
          EMail: this.email,
        };

        this.$f7.progressbar.show();
        let result = await this.$store.dispatch('EDIT_ACCOUNT', params);
        this.$f7.progressbar.hide();
        if(!result){
          return;
        }
        this.$f7.view.main.router.back();
      }
    },

    mounted() {
      this.firstName = this.info.User.FirstName;
      this.lastName = this.info.User.SubName;
      this.email = this.info.User.EMail;
      this.phone = this.info.User.Mobile;


    }
  }
</script>

<style scoped>

</style>