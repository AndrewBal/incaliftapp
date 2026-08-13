<template>
  <f7-page name="task-checklist">
    <f7-navbar large>
      <f7-nav-left back-link="Back"></f7-nav-left>
      <f7-nav-title sliding>Checklist</f7-nav-title>
      <f7-nav-title-large>Checklist</f7-nav-title-large>
    </f7-navbar>

    <template v-if="job">
      <checklist-item-popup
        :key="popupKey"
        :openPopup="isItemPopupOpen"
        :item="activeItem"
        :savedComment="activeAnswer.comment"
        :savedImg="activeAnswer.photo"
        @closePopup="isItemPopupOpen = false"
        @save="onItemSave"
      />

      <div
        v-for="item in checklistItems"
        :key="item.Code"
        class="checklist-item-row"
        @click="openItem(item)"
      >
        <span>{{ item.CheckListQuestion }}</span>
        <f7-badge :color="isAnswered(item.Code) ? 'green' : 'orange'">
          {{ isAnswered(item.Code) ? 'Done' : 'In process' }}
        </f7-badge>
      </div>

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
            @click="goToFinish"
          >Done</f7-button>
        </div>
      </f7-toolbar>
    </template>
  </f7-page>
</template>

<script>
import { mapGetters } from "vuex";
import { JOB_STATUS } from "../js/helpers/enum-job-status";
import { parseTimePeriod } from "../js/helpers/parse-time-period";
import ChecklistItemPopup from "../components/task/checklist-item-popup";

// Placeholder checkListCode values for the 3 fixed sign-off questions — the real
// Job/Edit contract only documents per-checklist-item JobOptions entries, so these
// need to be confirmed/replaced with real codes once backend defines them.
const EXTRA_QUESTION_CODES = {
  safe: "SAFE_TO_USE",
  repairs: "REQUIRES_REPAIR",
  conforms: "CONFORMS_TO_AS",
};

export default {
  name: "task-checklist",
  components: { ChecklistItemPopup },

  data: () => ({
    isItemPopupOpen: false,
    activeItem: {},
    popupKey: 1,
    answers: { safe: "", repairs: "", conforms: "" },
  }),

  computed: {
    ...mapGetters(["selectedJob", "checklistItems", "checklistAnswers"]),
    job() {
      return this.selectedJob;
    },
    isEditable() {
      return this.job && this.job.Status === JOB_STATUS.IN_PROGRESS;
    },
    activeAnswer() {
      return this.checklistAnswers[this.activeItem.Code] || { comment: "", photo: "" };
    },
    jobTimePeriod() {
      return this.job ? parseTimePeriod(this.job.TimePeriod) : { beginDate: null, endDate: null };
    },
    isChecklistComplete() {
      return this.checklistItems.length > 0 && this.checklistItems.every((item) => this.isAnswered(item.Code));
    },
    canFinish() {
      return this.isChecklistComplete && this.answers.safe && this.answers.repairs && this.answers.conforms;
    },
  },

  methods: {
    isAnswered(code) {
      const answer = this.checklistAnswers[code];
      return !!(answer && answer.comment && answer.comment.trim().length);
    },
    openItem(item) {
      if (!this.isEditable) return;
      this.activeItem = item;
      this.popupKey += 1;
      this.isItemPopupOpen = true;
    },
    onItemSave({ code, comment, img }) {
      this.$store.commit("SET_CHECKLIST_ANSWER", { code, answer: { comment, photo: img } });
      this.persistAnswers();
      this.isItemPopupOpen = false;
    },
    persistAnswers() {
      this.$f7.methods.setInStorage({
        name: "checklistAnswers_" + this.job.Code,
        data: this.checklistAnswers,
      });
    },
    setAnswer(key, value) {
      if (!this.isEditable) return;
      this.answers[key] = value;
    },
    formatApiDate(momentDate) {
      return momentDate && momentDate.isValid() ? momentDate.format("YYYY-MM-DD HH:mm:ss") : "";
    },
    async goToFinish() {
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
        InstallerContactCode: this.job.InstallerId || "",
        BeginDate: this.formatApiDate(this.jobTimePeriod.beginDate),
        EndDate: this.formatApiDate(this.jobTimePeriod.endDate),
        Notes: this.job.Notes || "",
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
      this.$f7.progressbar.hide();
      if (!editResult) return;

      this.$f7router.navigate({ name: "task-finish" });
    },
  },

  async mounted() {
    if (!this.job) {
      this.$f7router.navigate({ name: "home" });
      return;
    }
    if (!this.checklistItems.length) {
      await this.$store.dispatch("GET_JOB_CHECKLIST", { AgentCode: this.job.AgentCode });
    }
    // Locally-persisted answers are the only source of truth we have client-side —
    // there's no confirmed endpoint to re-fetch previously-submitted answers for a job.
    const stored = this.$f7.methods.getFromStorage("checklistAnswers_" + this.job.Code);
    if (stored && Object.keys(stored).length) {
      this.$store.commit("SET_CHECKLIST_ANSWERS", stored);
    }
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
