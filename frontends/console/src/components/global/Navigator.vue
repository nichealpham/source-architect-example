<template>
  <div class="left-nav">
    <div class="custom-container">
      <a id="nav-navigator-site-title" class="box-header site-name" style="display:none;">
        <i class="fa fa-arrow-left" aria-hidden="true"></i> hide menu
      </a>
      <div v-for="(section, index) in navigators" :key="index">
        <a class="nav-button">{{section.title}}</a>
        <ul class="nav-section">
          <li v-for="nav in section.subNavs" :key="nav.url">
            <a
              :href="nav.href"
              class="nav-button hover-text"
              :class="{'nav-focused': $route.path.includes(nav.href)}"
            >
              <i :class="nav.icon" aria-hidden="true"></i>
              {{nav.title}}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "blank",
  components: {},
  data: () => ({
    navigators: [
      {
        title: "Records Management",
        subNavs: [
          {
            title: "Records Lists",
            href: "/record/list",
            icon: "fa fa-folder-o"
          },
          // {
          //   title: "Processing Status",
          //   href: "/record/processing",
          //   icon: "fa fa-spinner"
          // },
          {
            title: "Upload New Records",
            href: "/record/create",
            icon: "fa fa-plus"
          }
        ]
      },
      {
        title: "My Account",
        subNavs: [
          {
            title: "Statistics",
            href: "/account/stats",
            icon: "fa fa-star-o"
          },
          {
            title: "User Information",
            href: "/account/info",
            icon: "fa fa-info"
          }
        ]
      },
      {
        title: "Billing Account",
        subNavs: [
          {
            title: "Service Cost",
            href: "/billing/cost",
            icon: "fa fa-usd"
          },
          {
            title: "Paycheck & History",
            href: "/billing/paycheck",
            icon: "fa fa-star-o"
          }
        ]
      }
    ]
  })
};
</script>

<style>
.left-nav {
  width: 260px;
  height: calc(100vh - 64px);
  display: inline-block;
  position: relative;
  background-color: rgb(56, 65, 99);
  margin-left: 4px;
  overflow: hidden;
}
.left-nav > .custom-container {
  width: calc(100% + 24px);
  height: calc(100vh - 64px);
  overflow-x: hidden;
  overflow-y: scroll;
}
.nav-button {
  cursor: context-menu;
  width: 100%;
  height: 60px;
  line-height: 58px;
  padding: 0px 60px 0px 0px;
  display: inline-block;
  background-color: rgb(43, 49, 77);
  font-size: 15px;
  text-align: right;
  color: #e0e0e0;
}
.nav-section {
  width: 100%;
  line-height: 58px;
  display: inline-block;
  list-style: none;
  text-align: right;
}
.nav-section li {
  cursor: pointer;
  display: inline-block;
}
.nav-section a {
  background-color: transparent;
  font-size: 13px;
  cursor: pointer;
}
.nav-focused {
  color: rgb(20, 159, 133);
}
.left-nav .box-header {
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
.left-nav .site-name {
  width: 260px;
  font-size: 16px;
  padding-left: 0px;
}
</style>
