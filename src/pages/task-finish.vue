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
            <div>{{ formatDate(job.BeginDate) }}</div>
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

      <div class="detail-card finish-question-card">
        <div class="detail-card-value">This equipment IS / NOT safe to be used</div>
        <div class="row finish-toggle-row">
          <f7-button :fill="answers.safe === 'Yes'" color="green" class="col" :disabled="!isEditable" @click="setAnswer('safe', 'Yes')">Is</f7-button>
          <f7-button :fill="answers.safe === 'No'" color="red" class="col" :disabled="!isEditable" @click="setAnswer('safe', 'No')">Not</f7-button>
        </div>
      </div>

      <div class="detail-card finish-question-card">
        <div class="detail-card-value">This equipment DOES / DOES NOT require repairs</div>
        <div class="row finish-toggle-row">
          <f7-button :fill="answers.repairs === 'Yes'" color="green" class="col" :disabled="!isEditable" @click="setAnswer('repairs', 'Yes')">Does</f7-button>
          <f7-button :fill="answers.repairs === 'No'" color="red" class="col" :disabled="!isEditable" @click="setAnswer('repairs', 'No')">Does Not</f7-button>
        </div>
      </div>

      <div class="detail-card finish-question-card">
        <div class="detail-card-value">This equipment DOES / DOES NOT conform to current Australian Standards in its present condition</div>
        <div class="row finish-toggle-row">
          <f7-button :fill="answers.conforms === 'Yes'" color="green" class="col" :disabled="!isEditable" @click="setAnswer('conforms', 'Yes')">Does</f7-button>
          <f7-button :fill="answers.conforms === 'No'" color="red" class="col" :disabled="!isEditable" @click="setAnswer('conforms', 'No')">Does Not</f7-button>
        </div>
      </div>

      <f7-toolbar v-if="isEditable" bottom no-shadow class="custom-toolbar">
        <div class="row width-100 padding-horizontal">
          <f7-button
            color="green"
            fill
            class="col text-uppercase"
            :class="{ disabled: !canFinish }"
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

// Placeholder checkListCode values for the 3 fixed sign-off questions — the real
// Job/Edit contract only documents per-checklist-item JobOptions entries, so these
// need to be confirmed/replaced with real codes once backend defines them.
const EXTRA_QUESTION_CODES = {
  safe: "SAFE_TO_USE",
  repairs: "REQUIRES_REPAIR",
  conforms: "CONFORMS_TO_AS",
};

export default {
  name: "task-finish",

  data: () => ({
    notes: "",
    answers: { safe: "", repairs: "", conforms: "" },
  }),

  computed: {
    ...mapGetters(["selectedJob", "checklistItems", "checklistAnswers"]),
    job() {
      return this.selectedJob;
    },
    addressLine() {
      if (!this.job) return "—";
      return [this.job.Address, this.job.City, this.job.Region].filter(Boolean).join(", ") || "—";
    },
    isEditable() {
      return this.job && this.job.Status === JOB_STATUS.IN_PROGRESS;
    },
    isChecklistComplete() {
      return this.checklistItems.length > 0 && this.checklistItems.every((item) => {
        const answer = this.checklistAnswers[item.Code];
        return !!(answer && answer.comment && answer.comment.trim().length);
      });
    },
    canFinish() {
      return this.isChecklistComplete && this.answers.safe && this.answers.repairs && this.answers.conforms;
    },
  },

  methods: {
    formatDate(date) {
      return date ? moment(date).format("DD.MM.YYYY") : "—";
    },
    setAnswer(key, value) {
      if (!this.isEditable) return;
      this.answers[key] = value;
    },
    close() {
      this.$f7router.back();
    },
    async finishWork() {
      if (!this.canFinish) return;

      const mainOptions = this.checklistItems.map((item) => {
        const answer = this.checklistAnswers[item.Code] || {};
        return {
          checkListCode: item.Code,
          message: "",
          jobAnswer: answer.comment || "",
          result: "No",
          photo: answer.photo || "",
        };
      });
      const extraOptions = [
        { checkListCode: EXTRA_QUESTION_CODES.safe, message: "", jobAnswer: "", result: this.answers.safe, photo: "" },
        { checkListCode: EXTRA_QUESTION_CODES.repairs, message: "", jobAnswer: "", result: this.answers.repairs, photo: "" },
        { checkListCode: EXTRA_QUESTION_CODES.conforms, message: "", jobAnswer: "", result: this.answers.conforms, photo: "" },
      ];

      this.$f7.progressbar.show();
      const editResult = await this.$store.dispatch("EDIT_JOB", {
        Imei: this.job.Imei || "",
        Type: this.job.Type || "",
        CustomerCode: this.job.CustomerCode || "",
        AgentCode: this.job.AgentCode || "",
        InstallerContactCode: this.job.InstallerContactCode || "",
        BeginDate: this.job.BeginDate || "",
        EndDate: this.job.EndDate || "",
        Notes: this.notes,
        Address: this.job.Address || "",
        City: this.job.City || "",
        Region: this.job.Region || "",
        AddressLat: this.job.AddressLat || "",
        AddressLng: this.job.AddressLng || "",
        JobModel: this.job.JobModel || "",
        JobSerialNo: this.job.JobSerialNo || "",
        JobName: this.job.JobName || "",
        Code: this.job.Code,
        JobOptions: [...mainOptions, ...extraOptions],
      });
      if (!editResult) {
        this.$f7.progressbar.hide();
        return;
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
.finish-question-card {
  flex-direction: column;
  align-items: stretch;
}
.finish-toggle-row {
  margin-top: 10px;
  gap: 8px;
}
</style>
