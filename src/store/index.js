import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import questions from './questions'
import trips from './trips'
import faults from './faults'
import assets from './assets'
import userSettings from './user-settings'
import jobs from './jobs'
import APIMETHODS from '../js/api-methods'
import checkList from '../js/helpers/check-list'

const qs = require('qs');

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    isLoggedIn: false,
    error: null,
    apiValidationError: null,
    info: {},
    checklist: [],
    currentTrip: {}
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    },

    setApiValidationError(state, error){
      state.apiValidationError = error
    },
    clearApiValidationError(state) {
      state.apiValidationError = null
    },
    setCheckList(state, checklist){
      state.checklist = checklist
    },

    setInfo(state, info){
      state.info = info
    },
    clearInfo(state){
      state.info = {}
    },
    setAccountInfo(state, accountInfo){
      state.info.User = accountInfo;
    },

    setAuthState(state, auth){
      state.isLoggedIn = auth
    },

    setCurrentTrip(state, tripInfo){
      state.currentTrip = tripInfo
    },
    clearCurrentTrip(state){
      state.currentTrip = {}
    }


  },
  getters: {
    error: s => s.error,
    apiValidationError: s => s.apiValidationError,
    isLoggedIn: s => s.isLoggedIn,
    info: s => s.info,
    checklist: s =>  s.checklist,
    currentTrip: s => s.currentTrip
  },
  actions: {
    updateCurrentTrip({dispatch, commit}, info){
      commit('setCurrentTrip', info)
    },
    async clearAllInfo({dispatch, commit, rootState}){
      try {
        await Vue.axios.get(APIMETHODS.URL.LOGOUT, { params: {
            MinorToken: rootState.info.MinorToken,
            deviceToken: localStorage.PUSH_DEVICE_TOKEN,
            mobileToken: localStorage.PUSH_MOBILE_TOKEN,
          } } ).then(async function (response) {
            //commit('clearInfo');
            await Vue.nextTick();
            commit('clearCurrentTrip');
        })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    
    },
    async fetchAddress({dispatch}, latlng){
      const data = {
        format: 'json',
        zoom: 18,
        addressdetails: 1,

        lat: latlng.lat,
        lon: latlng.lng
      };

      let ret = JSON.stringify(latlng);
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.GET_ADDRESS_BY_GEOCODER, { params: data } );
        if (response.data.display_name) {
          ret = response.data.display_name;
        }
      }catch (e) {
        try {
          const response = await Vue.axios.get(APIMETHODS.URL.GET_ADDRESS_BY_GEOCODER2, { params: data } );
          if (response.data.display_name) {
            ret = response.data.display_name;
          }
        }catch (e) {}
      }

      return ret;
    },
    async fetchCoordinates({dispatch}, address){
      const data = {
        q: address,
        format: 'json',
        limit: 1
      };

      let ret = null;
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.GET_COORDINATES_BY_GEOCODER, { params: data } );
        if (Array.isArray(response.data) && response.data[0]) {
          ret = { lat: parseFloat(response.data[0].lat), lng: parseFloat(response.data[0].lon) };
        }
      }catch (e) {
        try {
          const response = await Vue.axios.get(APIMETHODS.URL.GET_COORDINATES_BY_GEOCODER2, { params: data } );
          if (Array.isArray(response.data) && response.data[0]) {
            ret = { lat: parseFloat(response.data[0].lat), lng: parseFloat(response.data[0].lon) };
          }
        }catch (e) {}
      }

      return ret;
    },
    async GET_NEW_NOTIFICATIONS({dispatch, commit}, query){
      try {
        //let data = qs.stringify(query)

        const response = await Vue.axios.get(APIMETHODS.URL.GET_NEW_NOTIFICATIONS, { params: query } );
        //console.log(response)
        if (response.data.MajorCode === '000') {
          if (Array.isArray(response.data.Data) && response.data.Data.length > 0) {
            //setNotificationList(result.Data);
          }
          return response.data.Data
        }else{
          response.data.method = 'GET_NEW_NOTIFICATIONS';
          commit('setApiValidationError', response.data)
          return false
        }

      } catch (e) {
        if(e && e.response && e.response.data) e.response.data.method = 'GET_NEW_NOTIFICATIONS';
        commit('setError',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
        throw e
      }
    },
    async SUBMIT_ACCIDENT_REPORT({dispatch, commit}, query){
      try {
        let data = qs.stringify(query)

        const response = await Vue.axios.post(APIMETHODS.URL.SUBMIT_ACCIDENT_REPORT, data );
        //console.log(response)
        if (response.data.MajorCode === '000') {
          return response.data.Data
        }else{
          response.data.method = 'SUBMIT_ACCIDENT_REPORT';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        if(e && e.response && e.response.data) e.response.data.method = 'SUBMIT_ACCIDENT_REPORT';
        commit('setError',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
        throw e
      }
    }

  },
  modules: {
    auth,
    questions,
    trips,
    faults,
    userSettings,
    assets,
    jobs
  }
})
