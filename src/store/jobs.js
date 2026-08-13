import Vue from 'vue'
import APIMETHODS from '../js/api-methods'

export default {
  state: {
    jobs: [],
    jobsTotal: 0,
    selectedJob: null,
    checklistItems: [],
    checklistAnswers: {},
  },
  mutations: {
    SET_JOBS: (state, jobs) => { state.jobs = jobs },
    SET_JOBS_TOTAL: (state, total) => { state.jobsTotal = total },
    SET_SELECTED_JOB: (state, job) => { state.selectedJob = job },
    SET_JOB_CHECKLIST_ITEMS: (state, items) => { state.checklistItems = items },
    SET_CHECKLIST_ANSWERS: (state, answers) => { state.checklistAnswers = answers },
    SET_CHECKLIST_ANSWER: (state, { code, answer }) => {
      Vue.set(state.checklistAnswers, code, answer)
    },
    SET_JOB_STATUS: (state, { code, status }) => {
      if (state.selectedJob && state.selectedJob.Code === code) {
        Vue.set(state.selectedJob, 'Status', status)
      }
      const job = state.jobs.find(j => j.Code === code)
      if (job) {
        Vue.set(job, 'Status', status)
      }
    },
  },
  getters: {
    jobs: s => s.jobs,
    jobsTotal: s => s.jobsTotal,
    selectedJob: s => s.selectedJob,
    checklistItems: s => s.checklistItems,
    checklistAnswers: s => s.checklistAnswers,
  },
  actions: {
    async GET_JOB_LIST({ commit }, data) {
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.GET_JOB_LIST, { params: data })
        if (response.data.MajorCode === '000' && response.data.Data && Array.isArray(response.data.Data.JobList)) {
          commit('SET_JOBS', response.data.Data.JobList)
          commit('SET_JOBS_TOTAL', response.data.Data.Total)
          return response.data.Data.JobList
        } else {
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },

    async CHANGE_JOB_STATUS({ commit }, { Code, Status }) {
      try {
        let getParams = new URLSearchParams({ Code, Status })
        const response = await Vue.axios.post(APIMETHODS.URL.CHANGE_JOB_STATUS + '?' + getParams.toString(), null, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        if (response.data.MajorCode === '000') {
          commit('SET_JOB_STATUS', { code: Code, status: Status })
          return response.data
        } else {
          response.data.method = 'change_job_status'
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },

    // Response shape assumed to mirror GET_JOB_LIST (`Data.CheckList`) — verify against
    // the live testapi response and adjust once confirmed.
    async GET_JOB_CHECKLIST({ commit }, { AgentCode }) {
      try {
        const response = await Vue.axios.get(APIMETHODS.URL.GET_JOB_CHECKLIST, { params: { AgentCode } })
        if (response.data.MajorCode === '000') {
          const items = response.data.Data || []
          commit('SET_JOB_CHECKLIST_ITEMS', items)
          return items
        } else {
          response.data.method = 'get_job_checklist'
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },

    async ADD_NOTE({ commit, rootState }, { CustomerCode, NoteText, JobCode }) {
      try {
        let getParams = new URLSearchParams({
          MajorToken: rootState.info.MajorToken,
          MinorToken: rootState.info.MinorToken,
          CustomerCode,
          NoteText,
          JobCode,
        })
        const response = await Vue.axios.post(APIMETHODS.URL.ADD_NOTE + '?' + getParams.toString(), null, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        if (response.data.MajorCode === '000') {
          return response.data
        } else {
          response.data.method = 'add_note'
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },

    async EDIT_JOB({ commit }, data) {
      try {
        const { JobOptions, ...jobFields } = data
        let getParams = new URLSearchParams({ ...jobFields, JobOptions: JSON.stringify(JobOptions || []) })
        const response = await Vue.axios.post(APIMETHODS.URL.EDIT_JOB + '?' + getParams.toString(), null, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        if (response.data.MajorCode === '000') {
          return response.data
        } else {
          response.data.method = 'edit_job'
          commit('setApiValidationError', response.data)
          return false
        }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },
  },
}
