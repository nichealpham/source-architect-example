<template>
  <section></section>
</template>

<script>
export default {
  layout: "login",
  beforeMount() {
    if (!this.$services.userAuthenticationService.validateLogin())
      this.$router.push("/login");
    else this.$router.push("/record/list");
  }
};
</script>
