<template>
  <header class="header">
    <a id="nav-header-site-title" class="box-header site-name">cassandra console
      <!-- <i class="fa fa-bars" aria-hidden="true"></i> -->
    </a>
    <a @click="logout" class="box-header logout">
      <i class="fa fa-times" aria-hidden style="margin:0px;"></i>
    </a>
    <div id="nav-header-bar" class="bar">
      <a class="profile hover" href="?show-profile=true">
        <i class="fa fa-user-o" aria-hidden="true"></i>
        Nicheal Pham
      </a>
      <!-- <div class="bar search hover">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input class="header-search" type="text" placeholder="Search anything here ..." />
      </div>-->
      <div class="page-name">
        <i id="nav-header-burger" class="fa fa-bars" aria-hidden="true"></i>
        <span id="nav-header-page-name">{{pageTitle}}</span>
      </div>
    </div>
    <loading :show-loading="showLoading" :message="loadingMessage"/>
  </header>
</template>

<script>
import Loading from "~/components/global/Loading.vue";

export default {
  layout: "blank",
  components: {
    Loading
  },
  mounted() {
    this.pageTitle = this.getPageName(this.$route.path);
  },
  watch: {
    "$route.path": {
      handler: function(path) {
        this.pageTitle = this.getPageName(path);
      },
      deep: true
    }
  },
  data() {
    return {
      showLoading: false,
      loadingMessage: "",
      pageTitle: "",
      pageNames: [
        { title: "RECORD LIST", url: "record/list" },
        { title: "PROCESSING STATUS", url: "record/processing" },
        { title: "UPLOAD NEW RECORD", url: "record/create" },
        { title: "USER INFORMATION", url: "account/info" },
        { title: "STATISTICS", url: "account/stats" },
        { title: "SERVICE COST", url: "/billing/cost" },
        { title: "PAYCHECK & HISTORY", url: "/billing/paycheck" },
      ]
    };
  },
  methods: {
    getPageName(url) {
      let title = "";
      this.pageNames.forEach(pageName => {
        if (url.includes(pageName.url)) title = pageName.title;
      });
      return title;
    },
    async logout() {
      this.showLoading = true;
      this.$services.userAuthenticationService.expireUserAuthentication();
      setTimeout(() => {
        this.showLoading = false;
        this.$router.push("/login");
      }, 1200);
    }
  }
};
</script>

<style>
.header {
  width: 100%;
  display: inline-block;
  height: 56px;
  padding: 2px 6px 4px 4px;
  /* background-color: rgb(56, 65, 90); */
  /* - 64px */
}
.header > .box-header {
  display: inline-block;
  line-height: 48px;
  margin: 0;
  cursor: pointer;
  text-transform: uppercase;
  background-color: rgb(20, 159, 133);
  font-weight: 600;
  text-align: center;
  padding: 0px;
}
.header > .site-name {
  width: 260px;
  font-size: 16px;
  padding-left: 0px;
}
.header > .logout {
  width: 48px;
  height: 48px;
  text-align: center;
  float: right;
}
.header > .bar {
  width: calc(100% - 260px - 48px - 6px -3px);
  float: right;
  margin-right: 4px;
  background-color: rgb(56, 65, 99);
}
.header > .bar > .profile {
  float: right;
  margin-right: -10px;
  cursor: pointer;
  text-align: right;
  padding: 0px 20px 0px 20px;
  text-decoration: none;
  font-size: 14px;
  color: #e0e0e0;
  line-height: 48px;
}
.header > .bar > .page-name {
  width: 40%;
  float: left;
  font-size: 14px;
  margin-left: -10px;
  padding-left: 20px;
  text-transform: uppercase;
  font-size: 18px;
  color: #e0e0e0;
  font-weight: bold;
  line-height: 48px;
}
.header > .bar > .page-name > i {
  margin-right: 6px;
}
.header-search {
  width: calc(100% - 14px);
  min-width: 240px;
  background-color: transparent;
}
</style>
