<template>
  <f7-page name="task-details">
    <f7-navbar large>
      <f7-nav-left back-link="Back"></f7-nav-left>
      <f7-nav-title sliding>Details</f7-nav-title>
      <f7-nav-title-large>Details</f7-nav-title-large>
    </f7-navbar>

    <template v-if="job">
      <div class="detail-card">
        <span class="detail-card-icon">
          <f7-icon icon="f7-icons icon-other-date text-color-lightgray" size="18"></f7-icon>
        </span>
        <div class="detail-card-content">
          <div class="detail-card-label">Date</div>
          <div class="detail-card-value">{{ formatDate(jobBeginDate) }}</div>
        </div>
      </div>

      <div class="detail-card">
        <span class="detail-card-icon">
          <f7-icon icon="f7-icons icon-menu-profile text-color-lightgray" size="18"></f7-icon>
        </span>
        <div class="detail-card-content">
          <div class="detail-card-label">Customer</div>
          <div class="detail-card-value">{{ job.CustomerName || job.Name || '—' }}</div>
        </div>
      </div>

      <div class="detail-card">
        <span class="detail-card-icon">
          <f7-icon icon="f7-icons icon-address text-color-lightgray" size="18"></f7-icon>
        </span>
        <div class="detail-card-content">
          <div class="detail-card-label">Work Location</div>
          <a href="#" class="detail-card-value detail-card-link" @click.prevent="goToWorkLocation">{{ addressLine }}</a>
        </div>
      </div>

      <div class="detail-card">
        <span class="detail-card-icon">
          <f7-icon icon="f7-icons icon-other-asset text-color-lightgray" size="18"></f7-icon>
        </span>
        <div class="detail-card-content">
          <div class="detail-card-label">Model</div>
          <div class="detail-card-value">{{ job.JobModel || '—' }}</div>
        </div>
      </div>

      <div class="detail-card">
        <span class="detail-card-icon">
          <f7-icon icon="f7-icons icon-imei text-color-lightgray" size="18"></f7-icon>
        </span>
        <div class="detail-card-content">
          <div class="detail-card-label">Serial No</div>
          <div class="detail-card-value">{{ job.JobSerialNo || '—' }}</div>
        </div>
      </div>

      <div class="detail-card">
        <span class="detail-card-icon">
          <f7-icon icon="f7-icons icon-other-checklist text-color-lightgray" size="18"></f7-icon>
        </span>
        <div class="detail-card-content">
          <div class="detail-card-label">Checklist</div>
          <div class="detail-card-value">
            <div v-for="item in checklistItems" :key="item.Code">• {{ item.CheckListQuestion }}</div>
          </div>
        </div>
      </div>

      <f7-toolbar v-if="isScheduledOrHold" bottom no-shadow class="custom-toolbar">
        <div class="row width-100 padding-horizontal">
          <f7-button color="green" fill class="col text-uppercase" @click="startWork">Start Work</f7-button>
        </div>
      </f7-toolbar>

      <f7-toolbar v-else-if="isInProgress" bottom no-shadow class="custom-toolbar">
        <div class="row width-100 padding-horizontal">
          <f7-button color="orange" class="col text-uppercase" @click="holdJob">Hold</f7-button>
          <f7-button color="green" fill class="col text-uppercase" @click="continueChecklist">Continue Checklist</f7-button>
        </div>
      </f7-toolbar>
    </template>
  </f7-page>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import { JOB_STATUS } from "../js/helpers/enum-job-status";
import { parseTimePeriod } from "../js/helpers/parse-time-period";

export default {
  name: "task-details",

  computed: {
    ...mapGetters(["info", "jobs", "selectedJob", "checklistItems"]),
    job() {
      return this.selectedJob;
    },
    jobBeginDate() {
      return this.job ? parseTimePeriod(this.job.TimePeriod).beginDate : null;
    },
    addressLine() {
      if (!this.job) return "—";
      return [this.job.Address, this.job.City, this.job.Region].filter(Boolean).join(", ") || "—";
    },
    isScheduledOrHold() {
      return this.job && [JOB_STATUS.SCHEDULED, JOB_STATUS.HOLD].includes(this.job.Status);
    },
    isInProgress() {
      return this.job && this.job.Status === JOB_STATUS.IN_PROGRESS;
    },
  },

  methods: {
    formatDate(date) {
      return date ? moment(date).format("DD.MM.YYYY") : "—";
    },
    goToWorkLocation() {
      this.$f7router.navigate({
        name: "work-location",
        query: {
          address: this.addressLine,
          lat: this.job.AddressLat || "",
          lng: this.job.AddressLng || "",
        },
      });
    },
    async startWork() {
      const anotherJobInProgress = this.jobs.find(
        (j) => j.Code !== this.job.Code && j.Status === JOB_STATUS.IN_PROGRESS
      );
      if (anotherJobInProgress) {
        this.$f7.methods.customDialog({
          title: "Job in progress",
          text: "Another job is already In Progress. Hold or complete it before starting this one.",
        });
        return;
      }

      this.$f7.methods.customDialog({
        title: "Start Work",
        text: "Change this job's status to In Progress?",
        buttons: [
          { text: "Cancel" },
          {
            text: "Start",
            onClick: async () => {
              this.$f7.progressbar.show();
              const result = await this.$store.dispatch("CHANGE_JOB_STATUS", {
                Code: this.job.Code,
                Status: JOB_STATUS.IN_PROGRESS,
              });
              this.$f7.progressbar.hide();
              if (result) {
                this.continueChecklist();
              }
            },
          },
        ],
      });
    },
    holdJob() {
      this.$f7.methods.customDialog({
        title: "Hold Job",
        text: "Put this job on hold?",
        buttons: [
          { text: "Cancel" },
          {
            text: "Hold",
            onClick: async () => {
              this.$f7.progressbar.show();
              const result = await this.$store.dispatch("CHANGE_JOB_STATUS", {
                Code: this.job.Code,
                Status: JOB_STATUS.HOLD,
              });
              this.$f7.progressbar.hide();
              if (result) {
                this.$f7.view.main.router.back("/", { force: true });
              }
            },
          },
        ],
      });
    },
    continueChecklist() {
      this.$f7router.navigate({ name: "task-checklist" });
    },
  },

  async mounted() {
    if (!this.job) {
      this.$f7router.navigate({ name: "home" });
      return;
    }
    await this.$store.dispatch("GET_JOB_CHECKLIST", { AgentCode: this.job.AgentCode });
  },
};
</script>

<style scoped>
</style>
