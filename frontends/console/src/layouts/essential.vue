<template>
    <div>
        <nuxt/>
        <loading :show-loading="showLoading" :message="loadingMessage"/>
        <b-alert v-if="alert.message" class="page-alert" :variant="alert.variant" show>{{alert.message}}</b-alert>
    </div>
</template>

<script>
import Loading from "~/components/global/Loading.vue";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      showLoading: false,
      loadingMessage: "",
      alert: {
        message: "",
        variant: "success"
      }
    };
  },
  mounted() {
    this.$nuxt.$on("ShowPageLoading", message => {
      this.showLoading = true;
      this.loadingMessage = message || "";
    });
    this.$nuxt.$on("HidePageLoading", () => {
      this.showLoading = false;
      this.loadingMessage = "";
    });
    this.$nuxt.$on("ShowAlert", ({ message, variant }) => {
      this.alert.message = message || "";
      this.alert.variant = variant || "success";
      setTimeout(() => {
        this.alert.message = "";
      }, 5000);
    });
  }
};
</script>
