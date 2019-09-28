<template>
  <div class="mantle">
    <nuxt/>
  </div>
</template>

<script>
export default {
  async asyncData({ store, route }) {
    return {};
  },
  methods: {}
};
</script>

<style>
body {
  background-image: url("https://firebasestorage.googleapis.com/v0/b/cassandra-c8497.appspot.com/o/console%2Fassets%2Fbackgounds%2Fwin.png?alt=media&token=3d1fa560-8bf2-442e-87cd-3883911ce6b4");
  background-size: cover;
  overflow: hidden;
}
</style>