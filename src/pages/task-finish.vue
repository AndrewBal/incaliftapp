<template>
  <f7-page name="task-finish">
    <f7-navbar>
      <f7-nav-left back-link="Back"></f7-nav-left>
      <f7-nav-title sliding>{{ job && job.JobName || 'Task' }}</f7-nav-title>
      <f7-nav-right>
        <f7-link icon="icon-header-close" @click="close"></f7-link>
      </f7-nav-right>
    </f7-navbar>

    <template v-if="job">
      <div class="job-card">
        <div class="job-card-row">
          <span class="job-card-row-icon">
            <f7-icon icon="f7-icons icon-other-date text-color-lightgray" size="16"></f7-icon>
          </span>
          <div class="job-card-row-content">
            <div class="detail-card-label">Date</div>
            <div>{{ formatDate(jobTimePeriod.beginDate) }}</div>
          </div>
        </div>
        <div class="job-card-row">
          <span class="job-card-row-icon">
            <f7-icon icon="f7-icons icon-menu-profile text-color-lightgray" size="16"></f7-icon>
          </span>
          <div class="job-card-row-content">
            <div class="detail-card-label">Customer</div>
            <div>{{ job.CustomerName || job.Name || '—' }}</div>
          </div>
        </div>
        <div class="job-card-row">
          <span class="job-card-row-icon">
            <f7-icon icon="f7-icons icon-other-asset text-color-lightgray" size="16"></f7-icon>
          </span>
          <div class="job-card-row-content">
            <div class="detail-card-label">Model</div>
            <div>{{ job.JobModel || '—' }}</div>
          </div>
        </div>
        <div class="job-card-row">
          <span class="job-card-row-icon">
            <f7-icon icon="f7-icons icon-imei text-color-lightgray" size="16"></f7-icon>
          </span>
          <div class="job-card-row-content">
            <div class="detail-card-label">Serial No</div>
            <div>{{ job.JobSerialNo || '—' }}</div>
          </div>
        </div>
        <div class="job-card-row">
          <span class="job-card-row-icon">
            <f7-icon icon="f7-icons icon-address text-color-lightgray" size="16"></f7-icon>
          </span>
          <div class="job-card-row-content">
            <div class="detail-card-label">Work Location</div>
            <div>{{ addressLine }}</div>
          </div>
        </div>
      </div>

      <f7-list no-hairlines>
        <f7-list-input
          type="textarea"
          label="Notes"
          placeholder="Notes"
          :value="notes"
          :readonly="!isEditable"
          @input="notes = $event.target.value"
        >
          <f7-icon slot="media" icon="f7-icons icon-other-notes text-color-lightgray"></f7-icon>
        </f7-list-input>
      </f7-list>

      <f7-toolbar v-if="isEditable" bottom no-shadow class="custom-toolbar">
        <div class="row width-100 padding-horizontal">
          <f7-button
            color="green"
            fill
            class="col text-uppercase"
            @click="finishWork"
          >Finish Work</f7-button>
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
  name: "task-finish",

  data: () => ({
    notes: "",
  }),

  computed: {
    ...mapGetters(["selectedJob"]),
    job() {
      return this.selectedJob;
    },
    jobTimePeriod() {
      return this.job ? parseTimePeriod(this.job.TimePeriod) : { beginDate: null, endDate: null };
    },
    addressLine() {
      if (!this.job) return "—";
      return [this.job.Address, this.job.City, this.job.Region].filter(Boolean).join(", ") || "—";
    },
    isEditable() {
      return this.job && this.job.Status === JOB_STATUS.IN_PROGRESS;
    },
  },

  methods: {
    formatDate(date) {
      return date ? moment(date).format("DD.MM.YYYY") : "—";
    },
    close() {
      this.$f7router.back();
    },
    async finishWork() {
      this.$f7.progressbar.show();

      const notes = this.notes.trim();
      if (notes) {
        const noteResult = await this.$store.dispatch("ADD_NOTE", {
          CustomerCode: this.job.CustomerCode || "",
          NoteText: notes,
          JobCode: this.job.Code,
        });
        if (!noteResult) {
          this.$f7.progressbar.hide();
          return;
        }
      }

      const statusResult = await this.$store.dispatch("CHANGE_JOB_STATUS", {
        Code: this.job.Code,
        Status: JOB_STATUS.COMPLETE,
      });
      this.$f7.progressbar.hide();
      if (statusResult) {
        this.$f7.methods.setInStorage({ name: "checklistAnswers_" + this.job.Code, data: {} });
        this.$f7.view.main.router.back("/", { force: true });
      }
    },
  },

  mounted() {
    if (!this.job) {
      this.$f7router.navigate({ name: "home" });
      return;
    }
    this.notes = this.job.Notes || "";
  },
};
</script>

<style scoped>
</style>
