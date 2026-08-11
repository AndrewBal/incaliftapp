<template>
  <div class="with-bottom-button box-sizing-border-box ">
    <f7-toolbar bottom no-shadow class="custom-toolbar">
      <div class="row width-100 padding-horizontal">
        <label for="submit-form-password" class="col button button-fill text-uppercase bg-color-green">
          {{$ml.get('COM_MSG008')}}
        </label>
      </div>
    </f7-toolbar>

    <f7-list no-hairlines form @submit.prevent="submitHandler">
      <input type="submit" hidden id="submit-form-password">
      <f7-list-input
        :label="$ml.get('USER_SETTINGS_MSG007')"
        :placeholder="$ml.get('USER_SETTINGS_MSG007')"
        :type="passwordType1"
        clear-button
        validate
        required
        :value="currentPassword"
        @input="currentPassword = $event.target.value"
      >
        <f7-icon slot="media" icon="f7-icons icon-profile-password text-color-lightgray"></f7-icon>
        <div slot="content-end" @click="switchVisability('passwordType1')" class="margin-right link"><i class="f7-icons icon-other-password "></i></div>
      </f7-list-input>
      <f7-list-input
        :label="$ml.get('USER_SETTINGS_MSG008')"
        :placeholder="$ml.get('USER_SETTINGS_MSG008')"
        :type="passwordType2"
        clear-button
        validate
        required
        :value="newPassword"
        @input="newPassword = $event.target.value"
      >
        <f7-icon slot="media" icon="f7-icons icon-profile-password text-color-lightgray"></f7-icon>
        <div slot="content-end" @click="switchVisability('passwordType2')" class="margin-right link"><i class="f7-icons icon-other-password "></i></div>
      </f7-list-input>
      <f7-list-input
        :label="$ml.get('USER_SETTINGS_MSG009')"
        :placeholder="$ml.get('USER_SETTINGS_MSG009')"
        :type="passwordType3"
        clear-button
        validate
        required
        :value="confirmPassword"
        @input="confirmPassword = $event.target.value"
      >
        <f7-icon slot="media" icon="f7-icons icon-profile-password text-color-lightgray"></f7-icon>
        <div slot="content-end" @click="switchVisability('passwordType3')" class="margin-right link"><i class="f7-icons icon-other-password "></i></div>
      </f7-list-input>
    </f7-list>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: "password",

    data: () => ({
      passwordType1: 'password',
      passwordType2: 'password',
      passwordType3: 'password',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }),

    computed: {
      ...mapGetters(['info'])
    },

    methods: {
      switchVisability(name) {
        this[name] = this[name] === 'password' ? 'text' : 'password';
      },
      async submitHandler() {
        if (this.newPassword.length < 6) {
          this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG022'));
          return false;
        }
        if (this.newPassword !== this.confirmPassword) {
          this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG021'));
          return false;
        }

        var params = {
          MajorToken: this.info.MajorToken,
          MinorToken: this.info.MinorToken,

          oldpwd: this.currentPassword,
          newpwd: this.newPassword,
        };

        this.$f7.progressbar.show();
        let result = await this.$store.dispatch('CHANGE_PASSWORD', params);
        this.$f7.progressbar.hide();
        if (!result) {
          return;
        }
        this.$f7.dialog.alert(this.$ml.get('PROMPT_MSG020'), ()=>{
          this.$store.dispatch('logout');
          this.$f7.methods.logout();
        });
        //this.$f7.view.main.router.back();
      }
    }
  }
</script>

<style scoped>

</style>