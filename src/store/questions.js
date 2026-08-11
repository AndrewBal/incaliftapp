import Vue from 'vue'
import APIMETHODS from '../js/api-methods'

export default {
  actions:{
    /**
     * @return {boolean}
     */
    async UPLOAD_TASK({commit, dispatch}, data){
      try {
        
        let getParams = new URLSearchParams({ MinorToken: data.MinorToken, MajorToken: data.MajorToken });
        const response = await Vue.axios.post(APIMETHODS.URL.UPLOAD_TASK+'?'+getParams.toString(), data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}} );
        console.log(response.data)

        if(response.data.MajorCode === '000'){
          return response.data
        }else{
          response.data.method = 'upload_task';
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError',  e)
        throw e
      }
    }
  }
}