<template>
  <f7-page name="home" ptr @ptr:refresh="onRefresh">
    <template v-if="isLoggedIn">
      <f7-progressbar v-if="loading" infinite class="position-absolute"></f7-progressbar>

      <f7-navbar large>
        <f7-nav-left>
          <f7-link
            icon-ios="f7:menu"
            icon-aurora="f7:menu"
            icon-md="material:menu"
            panel-open="left"
          ></f7-link>
        </f7-nav-left>
        <f7-nav-title sliding>{{ $ml.get('SIDEBAR_MSG001') }}</f7-nav-title>
        <f7-nav-title-large>{{ $ml.get('SIDEBAR_MSG001') }}</f7-nav-title-large>
      </f7-navbar>

      <f7-block v-if="!loading && !visibleJobs.length">
        <p>{{ $ml.get('PROMPT_MSG044') }}</p>
      </f7-block>

      <div class="tasks-list">
        <div v-for="job in visibleJobs" :key="job.Code" class="job-card" @click="openTask(job)">
          <div class="job-card-row">
            <span class="job-card-row-icon">
              <f7-icon icon="f7-icons text-color-lightgray" size="16">info_circle</f7-icon>
            </span>
            <div class="job-card-row-content job-card-title-row">
              <span class="job-card-title">{{ job.Type || '—' }}</span>
              <f7-badge :color="jobStatus(job.Status).color">{{ jobStatus(job.Status).text }}</f7-badge>
              <f7-icon icon="f7-icons job-card-chevron" size="16">chevron_right</f7-icon>
            </div>
          </div>
          <div class="job-card-row">
            <span class="job-card-row-icon">
              <f7-icon size="16" icon="f7-icons size-16 icon-other-date text-color-lightgray"></f7-icon>
            </span>
            <span class="size-14 vertical-align-middle">{{ formatDate(job.BeginDate) }}</span>
          </div>
          <div class="job-card-row">
            <span class="job-card-row-icon">
              <f7-icon size="16" icon="f7-icons size-16 icon-menu-profile text-color-lightgray"></f7-icon>
            </span>
            <span class="size-14 vertical-align-middle">{{ job.CustomerName || job.Name || '—' }}</span>
          </div>
          <div class="job-card-row">
            <span class="job-card-row-icon">
              <f7-icon size="16" icon="f7-icons size-16 icon-address text-color-lightgray"></f7-icon>
            </span>
            <a href="#" class="job-card-address-link size-14" @click.prevent.stop="goToWorkLocation(job)">{{ addressLine(job) }}</a>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <login-screen />
    </template>
  </f7-page>
</template>

<script>
import LoginScreen from "../components/login-screen";
import { mapGetters } from "vuex";
import { getJobStatus, isJobVisible } from "../js/helpers/enum-job-status";
import moment from "moment";

export default {
  name: "home",

  components: {
    LoginScreen,
  },

  data: () => ({
    loading: false,
  }),

  computed: {
    ...mapGetters(["isLoggedIn", "info", "jobs"]),
    visibleJobs() {
      return this.jobs.filter((job) => isJobVisible(job.Status));
    },
  },

  methods: {
    jobStatus(code) {
      return getJobStatus(code);
    },
    addressLine(job) {
      return [job.Address, job.City, job.Region].filter(Boolean).join(", ") || "—";
    },
    formatDate(date) {
      return date ? moment(date).format("DD.MM.YYYY") : "—";
    },
    openTask(job) {
      this.$store.commit("SET_SELECTED_JOB", job);
      this.$f7router.navigate({ name: "task-details" });
    },
    goToWorkLocation(job) {
      this.$f7router.navigate({
        name: "work-location",
        query: {
          address: this.addressLine(job),
          lat: job.AddressLat || "",
          lng: job.AddressLng || "",
        },
      });
    },
    async fetchJobs(ptrDone) {
      this.loading = true;
      await this.$store.dispatch("GET_JOB_LIST", {
        MajorToken: this.info.MajorToken,
        MinorToken: this.info.MinorToken,
        InstallerCode: "",
        OrderId: "",
        Type: "",
        CustomerCode: "",
        all: "",
        page: 1,
        rows: 20,
        sort: "IMEI",
        order: "desc",
      });
      this.loading = false;
      if (typeof ptrDone === "function") {
        ptrDone();
      }
    },
    onRefresh(ptrDone) {
      this.fetchJobs(ptrDone);
    },
  },

  mounted() {
    if (this.isLoggedIn) {
      this.fetchJobs();
    }
  },

  watch: {
    isLoggedIn(val) {
      if (val) {
        this.fetchJobs();
      }
    },
  },
};
</script>

<style scoped>
</style>
