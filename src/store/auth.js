import Vue from 'vue'
import APIMETHODS from '../js/api-methods'
const qs = require('qs');

export default {
  actions: {
    async login({dispatch, commit}, query) {
      try {
        await Vue.axios.get(APIMETHODS.URL.LOGIN, { params: query } ).then(async function (response) {
          console.log(response.data)

          if(response.data.MajorCode === '000'){
            commit('setInfo', response.data.Data)
            await Vue.nextTick();
            commit('setAuthState', true)
            localStorage.USERNAME = query.username;
            localStorage.PASSWORD = query.password;
          }else{
            //method name for correct error message
            response.data.method = 'login';

            commit('setApiValidationError', response.data)
            await Vue.nextTick();
            commit('setAuthState', false)

          }
        })


      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async logout({dispatch, commit}) {
      await dispatch('clearAllInfo');
      commit('setAuthState', false)
    },
    async REFRESH_PUSH_TOKEN({commit}, query){
      try {
        let data = qs.stringify(query)

        const response = await Vue.axios.post(APIMETHODS.URL.REFRESH_PUSH_TOKEN, data );
        console.log(response)
        /*if (response.data.MajorCode === '000') {
          return response.data.Data
        }else{
          response.data.method = 'SET_NOTIFICATION_STATUS';
          commit('setApiValidationError', response.data)
          return false
        }*/

      } catch (e) {
        if(e && e.response && e.response.data) e.response.data.method = 'REFRESH_PUSH_TOKEN';
        commit('setError',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
        throw e
      }
    },
  }
}
