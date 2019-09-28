<template>
  <div class="mantle">
    <site-header id="site-header"/>
    <site-navigator id="site-navigator"/>
    <div id="site-content" class="site-content">
      <nuxt/>
    </div>
    <loading :show-loading="showLoading" :message="loadingMessage"/>
    <b-alert v-if="alert.message" class="page-alert" :variant="alert.variant" show>{{alert.message}}</b-alert>
  </div>
</template>

<script>
import Loading from "~/components/global/Loading.vue";
import SiteHeader from "~/components/global/Header.vue";
import SiteNavigator from "~/components/global/Navigator.vue";

export default {
  components: {
    Loading,
    SiteHeader,
    SiteNavigator
  },
  data() {
    return {
      showLoading: false,
      loadingMessage: "",
      alert: {
        message: "",
        variant: "success"
      },
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
        $('#nav-header-site-title').css({
          "display": "none"
        });
        $('#nav-navigator-site-title').css({
          "display": "inline-block"
        });
        $('#nav-header-bar').css({
          "width": "calc(100% - 54px)",
        });
        $('#site-navigator').css({
          "position": "absolute",
          "z-index": 2,
          "height": "100vh",
          "border-right": "4px solid rgb(43, 49, 77)",
          "left": "-300px",
        });
        $('#site-content').css({
          "width": "calc(100vw + 28px)",
          "margin-left": "-11px",
        });
        $('#nav-navigator-site-title').on('click', () => {
          $('#site-navigator').animate({
            "left": "-300px",
          }, 400)
        });
        $('#nav-header-burger, #nav-header-page-name').on('click', () => {
          $('#site-navigator').animate({
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
.site-content {
  width: calc(100% - 260px - 12px);
  height: calc(100vh - 64px);
  display: inline-block;
  position: relative;
  margin-left: 4px;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
