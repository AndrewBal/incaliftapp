import Vue from 'vue'
import APIMETHODS from '../js/api-methods'

const qs = require('qs');

export default {
  actions: {
    async GET_ASSETS_LOCATION({commit, rootState}, query){
      try {
        let data = qs.stringify(query)

        let getParams = new URLSearchParams({ MinorToken: rootState.info.MinorToken, MajorToken: rootState.info.MajorToken });

        const response = await Vue.axios.post(APIMETHODS.URL.GET_ASSETS_LOCATION+'?'+getParams.toString(), data );
        //console.log(response)
        if (response.data.MajorCode === '000') {
          return response.data.Data
        }else{
          response.data.method = 'GET_ASSETS_LOCATION';
          commit('setApiValidationError', response.data)
          return false
        }

      } catch (e) {
        if(e && e.response && e.response.data) e.response.data.method = 'GET_ASSETS_LOCATION';
        commit('setError',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
        throw e
      }
    },
    async SET_IMMOBILISATION({commit}, query){
      try {
        //let data = qs.stringify(query)

        const response = await Vue.axios.get(APIMETHODS.URL.SET_IMMOBILISATION_NO_PAY, { params: query } );
        //console.log(response)
        if (response.data.MajorCode === '000') {
          return response.data.Data
        }else{
          response.data.method = 'SET_IMMOBILISATION';
          commit('setApiValidationError', response.data)
          return false
        }

      } catch (e) {
        if(e && e.response && e.response.data) e.response.data.method = 'SET_IMMOBILISATION';
        commit('setError',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
        throw e
      }
    },
    async SET_NOTIFICATION_STATUS({commit}, query){
      try {
        let data = qs.stringify(query)

        const response = await Vue.axios.post(APIMETHODS.URL.SET_NOTIFICATION_STATUS, data );
        //console.log(response)
        if (response.data.MajorCode === '000') {
          return response.data.Data
        }else{
          response.data.method = 'SET_NOTIFICATION_STATUS';
          commit('setApiValidationError', response.data)
          return false
        }

      } catch (e) {
        if(e && e.response && e.response.data) e.response.data.method = 'SET_NOTIFICATION_STATUS';
        commit('setError',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
        throw e
      }
    },
    async GET_ASSET_DETAILS({commit}, query){
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.GET_ASSET_DETAILS, { params: query } );
        //console.log(response)
        if (response.data.MajorCode === '000') {
          return response.data.Data && response.data.Data.Assets && response.data.Data.Assets[0] ? response.data.Data.Assets[0] : {}
        }else{
          response.data.method = 'GET_ASSET_DETAILS';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        if(e && e.response && e.response.data) e.response.data.method = 'GET_ASSET_DETAILS';
        commit('setError',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
        throw e
      }
    },
    async UNBIND_ASSET({commit}, query){
       
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.UNBIND_ASSET, { params: query } );
         console.log(response)
        if (response.data.MajorCode === '000') {
          return response
        }else{
          response.data.method = 'UNBIND_ASSET';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        if(e && e.response && e.response.data) e.response.data.method = 'UNBIND_ASSET';
        commit('setError',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
        throw e
      }
    },
  }
}
