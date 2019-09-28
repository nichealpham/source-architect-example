<template>
  <div class="basic_box record-create-page">
    <div id="record-create-colum1" class="basic_box col-md-12 record-create-column">
      <div class="basic_box content" style="margin-top:8px;">
        <div class="cs-container">
          <span class="header" style="font-size:14px;">Processing Status</span>
          <table v-if="records.length">
            <tbody>
              <tr style="background-color:rgb(57, 66, 100);">
                <td width="5%" style="padding-left:2%;">#</td>
                <td width="18%" style="padding:0px 1% 0px 1%;">Progress</td>
                <td width="4%" style="font-size:11px;"></td>
                <td width="2%" style="font-size:11px;"></td>
                <td width="21%">Record Name</td>
                <td width="8%">Size</td>
                <td width="32%">Created At</td>
                <td colspan="2" width="10%">Options</td>
              </tr>
              <tr
                class="hover"
                v-for="(record, index) in records"
                @click="handleCheckboxClick(record._id)"
                :key="record._id"
              >
                <td width="5%" style="padding-left:2%;">
                  <!-- <b-form-checkbox
                    v-model="selectedRecordsId"
                    :value="record._id"
                    @click="preventDefault($event)"
                    :checked="selectedRecordsId.includes(record._id)"
                    :id="record._id"
                  ></b-form-checkbox>-->
                  {{index + 1}}.
                </td>
                <td width="18%" style="padding:0px 1% 0px 1%;">
                  <b-progress class="mt-0" :max="100" animated>
                    <b-progress-bar :value="record.percentage" variant="secondary"></b-progress-bar>
                  </b-progress>
                </td>
                <td width="4%" style="font-size:11px;">{{record.percentage}}%</td>
                <td width="2%" style="font-size:11px;"></td>
                <td width="21%">{{record.name}}</td>
                <td width="8%">{{convert2HumanFileSize(record.size)}}</td>
                <td width="32%">{{record.createdAt}}</td>
                <td width="5%">
                  <i class="fa fa-refresh cs-tooltip" aria-hidden="true">
                    <span class="tooltiptext" style="margin-left:-30px">Re-analyze</span>
                  </i>
                </td>
                <td width="5%">
                  <i
                    @click="deleteRecord(record._id, index)"
                    class="fa fa-trash cs-tooltip"
                    aria-hidden="true"
                  >
                    <span class="tooltiptext" style="margin-left:-20px;width:50px;">Delete</span>
                  </i>
                </td>
              </tr>
            </tbody>
          </table>
          <span v-else class="no-data">Records under processing will show up here.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "default",
  data() {
    return {
      selectedRecordsId: [],
      records: [],
      updateRecordStatusInterval: null
    };
  },
  beforeMount() {
    if (!this.$services.userAuthenticationService.validateLogin())
      this.$router.push("/login");
  },
  async mounted() {
    await this.getAnalyzingRecords();
    this.updateRecordStatusInterval = setInterval(
      this.getAnalyzingStatus,
      2500
    );
  },
  methods: {
    async getAnalyzingRecords() {
      this.$nuxt.$emit("ShowPageLoading", "Loading records ...");
      let result = await this.$services.recordService.getAnalyzing();
      if (result && result.body) {
        let records = result.body;
        records.forEach(record => {
          record.createdAt = this.$moment(record.createdAt).fromNow();
          record.percentage = 0;
        });
        this.records = [...this.records, ...records];
      }
      this.$nuxt.$emit("HidePageLoading");
    },
    async getAnalyzingStatus() {
      if (!this.records.length) return;
      for (let i = 0; i < this.records.length; i++) {
        let _id = this.records[i]._id;
        this.$services.recordService.getStatus(_id).then(result => {
          if (result && result.body) {
            let status = result.body;
            let percentage = Math.floor((status.step / status.total) * 100);
            if (percentage === 100) {
              this.records[i].percentage = 100;
              setTimeout(() => {
                this.records.splice(i, 1);
              }, 6000);
            } else {
              if (
                this.records[i].percentage &&
                this.records[i].percentage >= percentage
              ) {
                let value =
                  this.records[i].percentage + Math.floor(Math.random() * 4);
                if (value >= 99) {
                  this.records[i].percentage = 99;
                } else {
                  this.records[i].percentage = value;
                }
              } else {
                this.records[i].percentage = percentage;
              }
            }
          }
        });
      }
    },
    async deleteRecord(_id, ind) {
      this.$nuxt.$emit("ShowPageLoading", "Deleting record ...");
      let result = await this.$services.recordService.delete(_id);
      if (result && result.body) {
        this.records.splice(ind, 1);
        this.showAlert(`Delete record ${_id} successful!`, "success");
      } else {
        this.showAlert(
          `Error ${(result && result.message) ||
            "code 500, please contact technical support!"}`,
          "danger"
        );
      }
      this.$nuxt.$emit("HidePageLoading");
    },
    preventDefault(event) {
      event.preventDefault();
    },
    handleCheckboxClick(_id) {
      if (this.selectedRecordsId.includes(_id))
        this.selectedRecordsId.splice(this.selectedRecordsId.indexOf(_id), 1);
      else this.selectedRecordsId.push(_id);
    },
    showAlert(message, variant = "success") {
      this.$nuxt.$emit("ShowAlert", { message, variant });
    },
    convert2HumanFileSize(size, decimal = 0) {
      let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
      let value = (size / Math.pow(1024, i)).toFixed(decimal);
      return value + ["B", "kB", "MB", "GB", "TB"][i];
    }
  }
};
</script>

<style>
.record-create-page {
  height: calc(100vh - 64px);
  overflow: hidden;
}
.record-create-column {
  height: calc(100vh - 64px);
  overflow-y: scroll;
  padding: 0px 0px 0px 17px;
  cursor: context-menu;
  line-height: 100%;
  position: relative;
  overflow: hidden;
}
.record-create-column > .header {
  font-size: 13px;
  height: 21px;
  line-height: 100%;
}
.record-create-column > .tools-bar {
  margin: 0px 0px;
}
.record-create-column > .tools-bar > .search-name-box {
  width: calc(100% - (42px * 2 + 8px) - 14px);
  float: left;
}
.record-create-column > .tools-bar > .tools-box {
  width: calc(42px * 2 + 12px);
  margin-left: 6px;
}
.record-create-column > .content {
  width: 100%;
  display: inline-block;
  position: relative;
  /* height: calc(100vh - 160px); */
  height: calc(100vh - 70px);
  overflow-x: hidden;
  overflow-y: scroll;
  /* background: red; */
}
.record-create-column > .header i,
span {
  margin-right: 8px;
}
</style>
