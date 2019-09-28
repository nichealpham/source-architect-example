<template>
  <section class="custom-container">
      <div class="card_login">
        <div class="col-md-12" style="margin-top:40px;">
            <img class="logo" src="https://firebasestorage.googleapis.com/v0/b/cassandra-c8497.appspot.com/o/console%2Fassets%2Fglobal%2Fstartup.png?alt=media&token=a0bae3bb-20ab-4e3d-aec3-89ac43d93ea9">
        </div>
        <form @submit.prevent>
            <h1 class="title">Cassandra Console</h1>
            <div class="card_row">
                <i class="fa fa-user" aria-hidden="true"></i>
                <input class="input" type="email" v-model="email" placeholder="Email" required>
            </div>
            <div class="card_row" style="margin-top:-16px;">
                <i class="fa fa-unlock-alt" aria-hidden="true"></i>
                <input class="input" type="password" v-model="password" placeholder="Password" required>
            </div>
            <button @click="login" class="button submit" type="submit">SIGN IN</button>
            <label v-if="errorMessage" class="label-error">{{errorMessage}}</label>
        </form>
      </div>
      <loading :show-loading="showLoading" :message="loadingMessage" />
  </section>
</template>

<script>
import Loading from "~/components/global/Loading.vue";

export default {
  layout: "login",
  components: {
    Loading
  },
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      showLoading: false,
      loadingMessage: ""
    };
  },
  beforeMount() {
    if (this.$services.userAuthenticationService.validateLogin())
      this.$router.push("/record/list");
  },
  methods: {
    async login() {
      this.showLoading = true;
      let result = await this.$services.userService.login(
        this.email,
        this.password
      );
      if (result && result.body) {
        this.$services.userAuthenticationService.setUserAuthentication(
          result.body
        );
        setTimeout(() => {
          this.showLoading = false;
          this.$router.push("/record/list");
        }, 1200);
      } else {
        this.showLoading = false;
        this.errorMessage =
          (result && result.error) ||
          "An error occured! Please try again shortly.";
      }
    }
  }
};
</script>

<style>
.custom-container {
  width: 100vw;
  min-height: 100vh;
  display: fixed;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-bottom: 40px;
}

.card_login {
  margin-bottom: 15px;
  background-color: rgba(0, 0, 0, 0.24);
  border-radius: 5px;
  padding-top: 10px;
  min-width: 580px;
  width: 60%;
  max-width: 640px;
  margin-top: calc(50vh - 275px);
  margin-right: auto;
  margin-left: auto;
  height: 540px;
  border-radius: 6px;
}

.logo {
  width: 128px;
  display: inline-block;
  margin: 0px auto;
}

.title {
  display: block;
  line-height: 60px;
  margin: 0;
  text-align: center;
  font-weight: 400;
  font-size: 36px;
  letter-spacing: 2px;
  color: white;
}

.card_row {
  min-width: 460px;
  width: calc(100% - 180px);
  margin-left: 90px;
  display: inline-block;
  margin: 0px auto;
}
.card_row i {
  position: absolute;
  float: left;
  margin-left: 22px;
  margin-top: 50px;
  font-size: 18px;
}

.input {
  width: 100%;
  height: 52px;
  line-height: 40px;
  font-size: 18px;
  padding-left: 50px;
  background-color: rgba(0, 0, 0, 0.21);
  border-radius: 4px;
  margin-top: 32px;
  color: #fff;
  border: solid 2px transparent;
  border-radius: 6px;
  -webkit-transition: border-color 0.4s;
  transition: border-color 0.4s;
  outline: none;
}

.input:focus {
  border-color: #fefefefe;
}

.submit {
  background: #e64c65;
  margin: 32px auto;
  transition: background-color 0.4s;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  height: 48px;
  line-height: 40px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 4px;
  min-width: 240px;
  outline: none;
}

.submit:hover {
  background: #cc324b;
}

.submit:focus {
  outline: none;
  background: #962739;
}
.submit:active {
  outline: none;
  background: #962739;
}

.label-error {
  width: 100%;
  display: inline-block;
  color: red;
  text-align: center;
}
</style>
