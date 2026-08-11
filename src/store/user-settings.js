import Vue from 'vue'
import APIMETHODS from '../js/api-methods'

export default {
  actions: {
    async EDIT_ACCOUNT({commit, dispatch}, data) {
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.EDIT_ACCOUNT, {params: data});
        console.log(response.data)
        if (response.data.MajorCode === '000' && response.data.Data) {

          commit('setAccountInfo', response.data.Data.User)
          return response.data.Data

        } else {
          response.data.method = 'edit_account';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
    async CHANGE_PASSWORD({commit, dispatch}, data) {
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.CHANGE_PASSWORD, {params: data});
        //console.log(response.data)
        if (response.data.MajorCode === '000') {

          // commit('SET_FAULTS', response.data.Data)
          return response.data

        } else {
          response.data.method = 'change_password';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}
