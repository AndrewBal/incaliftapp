// Import Vue
import Vue from 'vue';
import {store} from '@/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './ml'

import '@/utils/jquery-global.js';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';


// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import 'leaflet/dist/leaflet.css';
import '../css/icons.css';
import '../css/app.less';
import '../fonts/fontastic/styles.css'

import dateFilter from '../filters/date.filter'
import directionFilter from '../filters/direction.filter'

// Import App Component
import App from '../components/app.vue';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

//fix, to accept POST request by server(allow to omit additional OPTIONS request)
//removed because can'r overwrite content-type header in optimised route request
/*axios.interceptors.request.use(function (config) {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  return config;
});*/

Vue.use(VueAxios, axios);

Vue.filter('date', dateFilter);
Vue.filter('direction', directionFilter);
// Init App
new Vue({
  el: '#app',
  store,
  render: (h) => h(App),

  // Register App Component
  components: {
    app: App
  },
});