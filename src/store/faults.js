import Vue from 'vue'
import APIMETHODS from "../js/api-methods";

export default {
  state: {
    faults: []
  },
  mutations: {
    SET_FAULTS: (state, faults) => {
      state.faults = faults;
    }
  },
  getters: {
    faults: s => s.faults
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
    async GET_FAULTS_FROM_API({commit, dispatch}, data){
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.GET_FAULTS, { params: data } );
        //console.log(response.data)
        if(response.data.MajorCode === '000' && response.data.Data && Array.isArray(response.data.Data)){
          if(response.data.Data.length){
            let i = 1;
            response.data.Data.map( item => {
              item.customId = ''+i;
              i++;
            })
          }
          commit('SET_FAULTS', response.data.Data)
          return response.data.Data
          /*
        return response.data.Data;*/
        }else{
          // response.data.method = 'get_trips';
          commit('setApiValidationError', response.data)
          return false
        }

        /*
        const faults = [
          {
            id: '1',
            Date: '20/10/10 12:34:12',
            AssetName: 'DAF 5687AS',
            Question: 'Visually check chassis, suspension including air bags, check cab & body for damage. Visually check chassis, suspension including air bags, check cab & body for damage. Visually check chassis, suspension including air bags, check cab & body for damage',
            Reason: 'Not Working',
          },
          {
            id: '2',
            Date: '20/10/10 12:34:12',
            AssetName: 'Ford Transit Connect',
            Question: 'Visually check chassis, suspension including air bags, check cab & body for damage',
            Reason: 'Not Working',
          },
          {
            id: '3',
            Date: '20/10/10 12:34:12',
            AssetName: 'DAF 5231BG',
            Question: 'Visually check chassis, suspension including air bags, check cab & body for damage',
            Reason: 'Not Working',
          }
        ];
        commit('SET_FAULTS', faults)
        return faults;*/
      } catch (e) {
        commit('setError',  e)
        throw e
      }
    }
  }
}