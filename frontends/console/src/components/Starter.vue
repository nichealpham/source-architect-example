<template>
  <div class="container-no-overflow" style="height:calc(100vh - 64px);">
    <div class="container-scroll-only-y" style="padding:12px 0px 12px 17px;"></div>
  </div>
</template>

<script>
export default {
  layout: "default",
  data() {
    return {
      analytics: []
    };
  },
  watch: {
    analytics: {
      handler: function(old, newData) {},
      deep: true
    }
  },
  beforeMount() {
    if (!this.$services.userAuthenticationService.validateLogin())
      this.$router.push("/login");
  },
  async mounted() {},
  methods: {
    preventDefault(event) {
      event.preventDefault();
    },
    showAlert(message, variant = "success") {
      this.$nuxt.$emit("ShowAlert", { message, variant });
    }
  }
};
</script>

<style>
</style>
