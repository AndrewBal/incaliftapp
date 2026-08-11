<template>
  <!--<f7-login-screen id="my-login-screen">
      <f7-view>-->
        <f7-page login-screen class="theme-dark">
          <f7-login-screen-title class="logo padding-horizontal">
            <img :src="logo" alt="">
          </f7-login-screen-title>
          <form @submit.prevent="signIn" >
          <f7-list >
            <f7-list-input
              floating-label
              type="text"
              required
              validate
              name="username"
              :label="$ml.get('AUTH_MSG001')"
              :placeholder="$ml.get('AUTH_MSG001')"
              :value="username"
              @input="username = $event.target.value"
            ></f7-list-input>
            <f7-list-input
              floating-label
              required
              validate
              :type="passwordType"
              name="password"
              :label="$ml.get('AUTH_MSG002')"
              :placeholder="$ml.get('AUTH_MSG002')"
              :value="password"
              @input="password = $event.target.value"
            >
              <div slot="content-end" @click="switchVisability('passwordType')" class="margin-left link"><i class="f7-icons icon-other-password "></i></div>
            </f7-list-input>
          </f7-list>
          <f7-list class="login-buttons">
            <f7-list-item>
              <f7-button
                type="submit"
                fill
                large
                class="color-custom"
              >{{$ml.get('AUTH_MSG003')}}</f7-button>
            </f7-list-item>
            <f7-list-item class="">
            <f7-link
              :href="registrationUrl"
              external
              target="_blank"
              class="button button-fill button-large color-black text-align-center display-flex justify-content-center"
    style="width: inherit; margin: 0 auto;">
              <span>Registration</span>
            </f7-link>

          </f7-list-item>

          </f7-list>
          </form>
        </f7-page>
    <!--  </f7-view>
    </f7-login-screen>-->
</template>

<script>
  import getDevicePushInfo from "../js/helpers/get-device-push-info";

  export default {
    name: "login-screen",

    data() {
      return {
        passwordType: 'password',
        logo: 'static/images/logo.svg',
        username: null,
        password: null,
        registrationUrl: 'https://forms.quiktrak.com.au/prestart/registration/'
      }
    },
    mounted() {
      getDevicePushInfo();
    },
    methods: {
      switchVisability(name) {
        this[name] = this[name] === 'password' ? 'text' : 'password';
      },
      async signIn() {
        const formData = {
          username: this.username,
          password: this.password,

          AppKey: !localStorage.PUSH_APP_KEY ? '123' : localStorage.PUSH_APP_KEY,
          MobileToken: !localStorage.PUSH_MOBILE_TOKEN ? '123' : localStorage.PUSH_MOBILE_TOKEN,
          DeviceToken: !localStorage.PUSH_DEVICE_TOKEN ? '123' : localStorage.PUSH_DEVICE_TOKEN,
          DeviceType: !localStorage.DEVICE_TYPE ? 'webapp' : localStorage.DEVICE_TYPE,
        };
        this.$f7.methods.hideKeyboard();
        try {
          //this.$f7.dialog.preloader('Loading...');
          this.$f7.progressbar.show();
          await this.$store.dispatch('login', formData)
          //await this.$nextTick();
          this.$f7.progressbar.hide();
        } catch (e) {}
      },
    }
  }
</script>

<style >
.login-buttons .simple-list li:after, .login-buttons .links-list a:after, .login-buttons .item-inner:after {
content: none !important;
}
</style>