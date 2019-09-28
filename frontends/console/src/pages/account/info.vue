<template>
  <div class="container-no-overflow" style="height:calc(100vh - 64px);">
    <div class="container-scroll-only-y" style="padding:12px 0px 12px 17px;">
      <div
        class="basic_box"
        style="background:rgba(57, 66, 100, 1);border-radius:6px;padding-bottom:20px;"
      >
        <div class="basic_box col-md-8" style="padding-top:20px;padding-left:30px;">
          <div class="basic_box">
            <span
              class="section-title"
              style="border-bottom:1px solid #e0e0e0"
            >i. general information</span>
            <div class="basic_box">
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">First name:</span>
                <input
                  placeholder="First name ..."
                  v-model="user.firstName"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Last name:</span>
                <input
                  placeholder="Last name ..."
                  v-model="user.lastName"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
            </div>
            <div class="basic_box">
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Email:</span>
                <input
                  placeholder="Email ..."
                  v-model="user.email"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Phone:</span>
                <input
                  placeholder="Phone ..."
                  v-model="user.personalInfo.phone"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
            </div>
            <div class="basic_box">
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Account _uuid:</span>
                <input disabled :value="user._id" class="cs-input" style="background:#50597b;">
              </div>
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Access Token:</span>
                <input
                  disabled
                  type="password"
                  :value="user.accessToken"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
            </div>
          </div>
          <div class="basic_box" style="margin-top:20px;">
            <span
              class="section-title"
              style="border-bottom:1px solid #e0e0e0"
            >ii. bussiness information</span>
            <div class="basic_box">
              <div class="col-md-12 cs-input-with-top-label">
                <span class="labelname">Company Name:</span>
                <input
                  placeholder="Company Name ..."
                  v-model="user.businessInfo.companyName"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
            </div>
            <div class="basic_box">
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Office Phone:</span>
                <input
                  v-model="user.businessInfo.phone"
                  placeholder="Office Phone ..."
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Occupation:</span>
                <input
                  v-model="user.businessInfo.occupation"
                  placeholder="Occupation ..."
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
            </div>
            <div class="basic_box">
              <div class="col-md-12 cs-input-with-top-label">
                <span class="labelname">Office Address:</span>
                <input
                  placeholder="Office Address ..."
                  v-model="user.businessInfo.address"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
            </div>
          </div>
          <div class="basic_box" style="margin-top:20px;">
            <span
              class="section-title"
              style="border-bottom:1px solid #e0e0e0"
            >iii. personal information</span>
            <div class="basic_box">
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Country:</span>
                <input
                  placeholder="Country ..."
                  v-model="user.personalInfo.country"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">City:</span>
                <input
                  placeholder="City ..."
                  v-model="user.personalInfo.city"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
            </div>
            <div class="basic_box">
              <div class="col-md-12 cs-input-with-top-label">
                <span class="labelname">Address:</span>
                <input
                  placeholder="Address ..."
                  v-model="user.personalInfo.address"
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
            </div>
            <div class="basic_box">
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Phone:</span>
                <input
                  v-model="user.personalInfo.phone"
                  placeholder="Phone ..."
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
              <div class="col-md-6 cs-input-with-top-label">
                <span class="labelname">Postal Code:</span>
                <input
                  type="number"
                  v-model="user.personalInfo.postalCode"
                  placeholder="Postal Code ..."
                  class="cs-input"
                  style="background:#50597b;"
                >
              </div>
            </div>
          </div>
        </div>
        <div class="basic_box col-md-4" style="padding-top:20px;">
          <!-- <span class="section-title col-md-12" style="text-align:center;margin-bottom:6px;">
            {{user.firstName}} {{user.lastName}}
          </span>-->
          <div class="basic_box avatar-holder">
            <img id="user-avatar" :src="user.avatar">
          </div>
          <span class="username">{{user.firstName}} {{user.lastName}}</span>
          <span class="sub-username">{{user.businessInfo.occupation || 'Premium Account'}}</span>
          <span class="sub-username">{{user.businessInfo.companyName}}</span>
          <div class="cs-upload-file" style="width:200px;margin:20px calc(50% - 100px);">
            <button class="cs-success-bg">Change user avatar</button>
            <input type="file" name="myfile" ref="file" v-on:change="handleAvatarUpload()">
          </div>
        </div>
      </div>
      <!-- <div class="basic_box" style="margin-top:10px;">
        <button class="cs-button cs-success-bg btn-upload">Update Profile</button>
        <button
          class="cs-button cs-primary-bg btn-cancel"
          style="margin-left:10px;"
        >Deactivate Account</button>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  layout: "default",
  data() {
    return {
      files: [],
      user: {
        firstName: "",
        lastName: "",
        avatar: "",
        _id: "",
        personalInfo: {
          country: "",
          city: "",
          address: "",
          phone: "",
          postalCode: 70000
        },
        businessInfo: {
          companyName: "",
          address: "",
          phone: "",
          occupation: ""
        },
        updateUserTimeout: null
      }
    };
  },
  watch: {
    user: {
      handler: function(oldUser, user) {
        if (this.updateUserTimeout) {
          clearTimeout(this.updateUserTimeout);
          this.updateUserTimeout = null;
        }
        this.updateUserTimeout = setTimeout(() => {
          if (!user._id) return;
          this.$services.userService
            .update(user._id, user)
            .then(() => {
              this.showAlert(`Update user profile successful!`, "success");
            })
            .catch(err => {
              this.showAlert(
                `Update user failed! Error: ${err.toString()}`,
                "danger"
              );
            });
        }, 400);
      },
      deep: true
    }
  },
  beforeMount() {
    if (!this.$services.userAuthenticationService.validateLogin())
      this.$router.push("/login");
  },
  async mounted() {
    await this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      this.$nuxt.$emit("ShowPageLoading", "Retrieving user info ...");
      let _id = this.$services.userAuthenticationService.getUserId();
      let result = await this.$services.userService.getUserInfo(_id);
      if (result && result.body) this.user = { ...this.user, ...result.body };
      this.$nuxt.$emit("HidePageLoading");
    },
    async handleAvatarUpload() {
      this.$nuxt.$emit("ShowPageLoading", "Update user avatar ...");
      let file = this.$refs.file.files[0];
      let result = await this.$services.userService.updateAvatar(
        this.user._id,
        file
      );
      if (result && result.body) {
        let fr = new FileReader();
        fr.onload = function() {
          document.getElementById("user-avatar").src = fr.result;
        };
        fr.readAsDataURL(file);
      }
      this.$nuxt.$emit("HidePageLoading");
    },
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
.avatar-holder {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 6px solid #50597b;
  margin: 0px calc(50% - 85px);
  background: #50597b;
  overflow: hidden;
  margin-top: 46px;
}
.avatar-holder > img {
  width: 170px;
  margin-top: -5px;
  margin-left: -5px;
}
.username {
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  display: inline-block;
  text-align: center;
  margin-top: 12px;
  text-transform: uppercase;
}
.sub-username {
  font-size: 14px;
  width: 100%;
  display: inline-block;
  text-align: center;
  margin-top: 6px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  width: 100%;
  display: inline-block;
  margin-top: 6px;
  text-transform: uppercase;
  line-height: 42px;
  margin-bottom: 13px;
}
.labelname {
  font-size: 16px;
}
.custom-input {
  background-color: rgb(57, 66, 100);
  border-radius: 3px;
  display: inline-block;
  width: 100%;
  height: 42px;
  padding-left: 14px;
  padding-right: 14px;
  font-size: 13px;
  border: solid 2px transparent;
  transition: border 0.4s;
}
.btn-upload {
  padding-left: 40px;
  padding-right: 56px;
  float: right;
}
.btn-cancel {
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 8px;
  float: right;
}
</style>
