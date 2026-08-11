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
        <span>{{ item.Name }}</span>
        <f7-badge :color="isAnswered(item.Code) ? 'green' : 'orange'">
          {{ isAnswered(item.Code) ? 'Done' : 'In process' }}
        </f7-badge>
      </div>

      <f7-toolbar v-if="isEditable" bottom no-shadow class="custom-toolbar">
        <div class="row width-100 padding-horizontal">
          <f7-button color="green" fill class="col text-uppercase" @click="goToFinish">Done</f7-button>
        </div>
      </f7-toolbar>
    </template>
  </f7-page>
</template>

<script>
import { mapGetters } from "vuex";
import { JOB_STATUS } from "../js/helpers/enum-job-status";
import ChecklistItemPopup from "../components/task/checklist-item-popup";

export default {
  name: "task-checklist",
  components: { ChecklistItemPopup },

  data: () => ({
    isItemPopupOpen: false,
    activeItem: {},
    popupKey: 1,
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
    goToFinish() {
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
</style>
