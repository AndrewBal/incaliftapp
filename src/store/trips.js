import Vue from 'vue'
import APIMETHODS from '../js/api-methods'
//import axios from 'axios'

export default {
  state: {
    trips: []
  },
  mutations: {
    SET_TRIPS: (state, trips) => {
      state.trips = trips;
    }
  },
  getters: {
    trips: s => s.trips
  },
  actions:{
    /*async UPLOAD_TASK({commit, dispatch}, data){
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.UPLOAD_TASK, { params: data } );
        if(response.data.MajorCode === '000'){
          return response.data
        }else{
          response.data.method = 'upload_task';
          commit('setApiValidationError', response.data)
        }
        console.log(response)
      } catch (e) {
        commit('setError',  e)
        throw e
      }
    }*/
    async START_TRIP({commit, dispatch}, data){
      try {
        
        let getParams = new URLSearchParams({ MinorToken: data.MinorToken, MajorToken: data.MajorToken });
        const response = await Vue.axios.post(APIMETHODS.URL.START_TRIP+'?'+getParams.toString(), data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}} );
      

        if(response.data.MajorCode === '000'){
          return response.data
        }else{
          response.data.method = 'start_trip';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError',  e)
        throw e
      }
    },
    async EDIT_TRIP({commit, dispatch}, data){
      try {
        
        let getParams = new URLSearchParams({ MinorToken: data.MinorToken, MajorToken: data.MajorToken });
        const response = await Vue.axios.post(APIMETHODS.URL.EDIT_TRIP+'?'+getParams.toString(), data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}} );
      

        if(response.data.MajorCode === '000'){
          return response.data
        }else{
          response.data.method = 'edit_trip';
         // commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError',  e)
        throw e
      }
    },
    async END_TRIP({commit, dispatch}, data){
      try {
       
        let getParams = new URLSearchParams({ MinorToken: data.MinorToken, MajorToken: data.MajorToken });
        const response = await Vue.axios.post(APIMETHODS.URL.END_TRIP+'?'+getParams.toString(), data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}} );
 

        if(response.data.MajorCode === '000'){
          return response.data
        }else{
          response.data.method = 'end_trip';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError',  e)
        throw e
      }
    },

    async GET_PLAYBACK({commit, dispatch}, data){
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.GET_PLAYBACK, { params: data } );
        if(response.data.MajorCode === '000' && response.data.Data){
          return response.data
        }else{
          response.data.method = 'get_playback';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError',  e)
        throw e
      }
    },

    async GET_PLAYBACK_OPTIMISED({commit, dispatch}, data){
      try {
        const response = await Vue.axios.post(APIMETHODS.URL.GET_PLAYBACK_ARR_OPTIMISED, data, {headers: {'Content-Type': 'application/json'}} );
        

        if(response.data.polylines){
          return response.data
        }else{
          response.data.method = 'get_playback_optimised';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError',  e)
        throw e
      }
    },

    async GET_TRIPS_IN_PROGRESS({commit, dispatch}, data){
      try {
 
        let getParams = new URLSearchParams({ MinorToken: data.MinorToken, MajorToken: data.MajorToken });
        const response = await Vue.axios.post(APIMETHODS.URL.GET_TRIPS_IN_PROGRESS+'?'+getParams.toString(), null, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}} );
 

        if(response.data.MajorCode === '000'){
          return response.data
        }else{
          response.data.method = 'trips_in_progress';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError',  e)
        throw e
      }
    },

    async GET_TRIPS_FROM_API({commit, dispatch}, data){
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.GET_TRIPS, { params: data } );
  
        if(response.data.MajorCode === '000' && response.data.Data && Array.isArray(response.data.Data)){
          commit('SET_TRIPS', response.data.Data)
          return response.data.Data
          /*
        return response.data.Data;*/
        }else{
         // response.data.method = 'get_trips';
          commit('setApiValidationError', response.data)
          return false
        }
        /*const trips = [
          {
            id: '1',
            Date: '20/10/10 12:34:12',
            AssetName: 'DAF 5687AS',
            Raiting: '9',
            Type: 'Business',
          },
          {
            id: '2',
            Date: '20/10/10 12:34:12',
            AssetName: 'Ford Transit Connect',
            Raiting: '3',
            Type: 'Private',
          },
          {
            id: '3',
            Date: '20/10/10 12:34:12',
            AssetName: 'DAF 5231BG',
            Raiting: '6',
            Type: 'Business',
          }
        ];*/

      } catch (e) {
        commit('setError',  e)
        throw e
      }
    },
    async GET_TASKS_FROM_API({commit, dispatch}, data){
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.GET_TASKS, { params: data } );
     
        if(response.data.MajorCode === '000' && response.data.Data && Array.isArray(response.data.Data)){
          // commit('SET_TRIPS', response.data.Data)
          return response.data.Data
          /*
        return response.data.Data;*/
        }else{
         // response.data.method = 'get_trips';
          commit('setApiValidationError', response.data)
          return false
        }
    

      } catch (e) {
        commit('setError',  e)
        throw e
      }
    },
    async SET_LOCAL_DB( data){
      try {   
        const response = await Vue.axios.post(APIMETHODS.URL.SET_LOCAL_DB, data, {headers: {'Content-Type': 'application/json'}} );
        if(response.data.MajorCode === '000'){
          return response.data
        }else{
          
         // commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
      //  commit('setError',  e)
        throw e
      }
    },
    async SEND_TRIP_REPORT(data) {
      try {   
        const response = await Vue.axios.post(APIMETHODS.URL.SEND_TRIP_REPORT, data, {headers:  {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}} );
        if(response.data.MajorCode === '000'){
          return response.data
        }else{
          
         // commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
      //  commit('setError',  e)
        throw e
      }
    }
  }
}