<template>
  <div class="mantle">
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
      }, 2500);
    });
    this.configLayout();
  },
  methods: {
    configLayout() {
      let isMobile = false;
      let width = $(window).width();
      let height = $(window).height();
      if ( width <= height || width < 720) {
       isMobile = true;
      }
      if (isMobile) {
        $('#analyzer-left').css({
          "position": "absolute",
          "z-index": 2,
          "height": "100vh",
          "border-right": "4px solid rgb(43, 49, 77)",
          "background-color": "rgb(43, 49, 77)",
          "width": "360px",
          "left": "-360px",
        });
        $('#analyzer-right').css({
          "height": "100vh",
          "padding-left": "10px",
        });
        $('#analyzer-navigator-left-content').css({
          "height": "calc(100vh - 112px)"
        });
        $('#analyzer-navigator-left-title').css({
          "display": "inline-block"
        });
        $('#analyzer-navigator-left-title').on('click', () => {
          $('#analyzer-left').animate({
            "left": "-360px",
          }, 400)
        });
        $('#analyzer-right-burger, #analyzer-right-record-name').on('click', () => {
          $('#analyzer-left').animate({
            "left": "0px",
          }, 400)
        });
      }
    }
  }
};
</script>

<style>
body {
  /* background-image: url("https://firebasestorage.googleapis.com/v0/b/cassandra-c8497.appspot.com/o/console%2Fassets%2Fbackgounds%2Fwin.png?alt=media&token=3d1fa560-8bf2-442e-87cd-3883911ce6b4"); */
  background-size: cover;
  overflow: hidden;
}
.mantle {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0px;
  left: 0px;
  /* background-color: rgb(31, 36, 60, 0.8); */
  background-color: rgb(31, 36, 60, 1);
}
.page-content {
  width: 100vw;
  height: 100vh;
  display: inline-block;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
