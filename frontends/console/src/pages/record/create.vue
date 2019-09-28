<template>
  <div class="basic_box record-create-page">
    <div id="record-create-colum1" class="basic_box col-md-12 record-create-column">
      <div class="basic_box content" style="margin-top:8px;">
        <div class="basic_box col-md-12">
          <div class="cs-container">
            <span class="footer" style="padding:0px;padding-top:5px;">
              <span class="bottom-title" style="font-size:14px;margin-left:12px;">Upload New Records</span>
              <b-form-file
                multiple
                v-model="newFiles"
                :state="Boolean(newFiles)"
                class="cs-file-upload"
                ref="newFilesInput"
              ></b-form-file>
            </span>
            <table v-if="files.length">
              <tbody>
                <tr style="background-color:rgb(57, 66, 100);">
                  <td width="5%" style="padding-left:2%;">#</td>
                  <td width="24%" style="padding:0px 1% 0px 1%;">Data Columns</td>
                  <td width="21%">Record Name</td>
                  <td width="8%">Hz</td>
                  <td width="8%">Span</td>
                  <td width="8%">Size</td>
                  <td width="8%">Dur</td>
                  <td width="8%">Cost</td>
                  <td width="10">Opts</td>
                </tr>
                <tr class="hover" v-for="(file, index) in files" :key="index">
                  <td width="5%" style="padding-left:2%;">{{index + 1}}</td>
                  <td width="24%" style="padding:0px 1% 0px 1%;">
                    <b-form-group>
                      <b-form-checkbox-group
                        @change="handleColumnsChange(index)"
                        v-model="file.columns"
                      >
                        <b-form-checkbox v-for="col in file.listColumns" :key="col" :value="col"></b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </td>
                  <td width="21%">
                    <input type="text" v-model="file.recordName">
                  </td>
                  <td width="8%">
                    <input type="number" @change="handleFsChange(file.fs, index)" v-model="file.fs">
                  </td>
                  <td width="8%">
                    <input type="number" v-model="file.interval">
                  </td>
                  <td width="8%">{{file.size}}</td>
                  <td
                    width="8%"
                  >{{(file.columns && file.columns.length) || 0}} x {{convert2HumanDuration(file.duration)}}</td>
                  <td width="8%">{{file.cost ? '$' + file.cost : 'N/A'}}</td>
                  <td width="10%">
                    <i @click="deleteFile(index)" class="fa fa-trash cs-tooltip" aria-hidden="true">
                      <span class="tooltiptext" style="margin-left:-20px;width:50px;">Delete</span>
                    </i>
                  </td>
                </tr>
              </tbody>
            </table>
            <span v-else class="no-data">Upload csv data files to create new records.</span>
            <span class="header" v-show="totalCost" style="font-size:14px;">
              Estimated Charge:
              <span
                style="font-size:16px;margin-left:12px;color:#e0e0e0;font-weight:bold;"
                ;
              >
                <i class="fa fa-credit-card" style="margin-right:6px;" aria-hidden="true"></i>
                ${{totalCost.toFixed(2)}} USD
              </span>
            </span>
          </div>
          <div class="basic_box tools-bar" style="margin-top:-10px;">
            <button
              v-if="files.length"
              @click="createRecords"
              class="cs-button cs-success-bg btn-upload"
            >
              <i class="fa fa-plus" aria-hidden="true"></i>
              Create These {{files.length}} Records
            </button>
            <button
              @click="discardAllFiles"
              v-if="files.length"
              class="cs-button cs-primary-bg btn-cancel"
            >Discard</button>
          </div>
        </div>
        <div v-if="processingRecords.length" class="basic_box col-md-12" style="margin-top:-4px;">
          <div class="cs-container">
            <span class="header" style="font-size:14px;">Processing Status</span>
            <table v-if="processingRecords.length">
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
                  v-for="(record, index) in processingRecords"
                  @click="handleCheckboxClick(record._id)"
                  :key="record._id"
                >
                  <td width="5%" style="padding-left:2%;">{{index + 1}}.</td>
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
                      @click="deleteAnalyzingRecord(record._id, index)"
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
  </div>
</template>

<script>
export default {
  layout: "default",
  data() {
    return {
      selectedRecordsId: [],
      records: [],
      processingRecords: [],
      files: [],
      newFiles: [],
      serviceCost: {
        DURATION: { VALUE: 1.29, UNIT: 1000 }, // $0.8 for 1,000 secs
        STORAGE: { VALUE: 0.99, UNIT: Math.pow(2, 20) } // $0.2 for 1MB
      },
      globalConfig: {
        fs: 250,
        interval: 10
      },
      totalCost: 0,
      inputOnChangeTimeout: null,
      updateRecordStatusInterval: null
    };
  },
  watch: {
    newFiles: {
      handler: function(files) {
        if (!files.length) return;
        this.files = [...this.files, ...this.filesHanlder(files)];
        this.clearFilesInput();
      },
      deep: true
    }
  },
  beforeMount() {
    if (!this.$services.userAuthenticationService.validateLogin())
      this.$router.push("/login");
  },
  async mounted() {
    this.getServicePricing();
    this.getAnalyzingRecords();
    this.updateRecordStatusInterval = setInterval(
      this.getAnalyzingStatus,
      2500
    );
  },
  methods: {
    getServicePricing() {
      this.$services.paymentService
        .getServicePricing()
        .then(result => {
          if (result && result.data) {
            this.serviceCost = result.data;
            // this.showAlert("Get service fee successful!", "success");
          } else {
            this.showAlert(
              "Cannot get newest costing scheme. Please note that estimated charge maybe inaccurate!",
              "warning"
            );
          }
        })
        .catch(err => {
          this.showAlert(
            `Get newest costing scheme errored. ${err.toString()}`,
            "danger"
          );
        });
    },
    createRecords() {
      this.$nuxt.$emit("ShowPageLoading", "Creating records ...");
      let promises = [];
      this.files.forEach(file => {
        let data = {
          fs: file.fs,
          interval: file.interval,
          recordName: file.recordName,
          columns: file.columns.join(",")
        };
        promises.push(this.$services.recordService.create(file.file, data));
      });
      Promise.all(promises)
        .then(list => {
          this.showAlert(
            `Create ${list.length} ${
              list.length < 2 ? "record" : "records"
            } successful!`,
            "success"
          );
          // this.$router.push("/record/processing");
          list.forEach(apiResult => {
            if (apiResult && apiResult.body) {
              let record = apiResult.body;
              record.createdAt = this.$moment(record.createdAt).fromNow();
              record.percentage = 0;
              this.processingRecords.push(record);
            }
          });
          this.$nuxt.$emit("HidePageLoading");
          this.records = [];
          this.clearFilesInput();
          this.discardAllFiles();
        })
        .catch(err => {
          this.showAlert(err.toString(), "danger");
          this.$nuxt.$emit("HidePageLoading");
        });
    },
    getAnalyzingRecords() {
      this.$services.recordService
        .getAnalyzing()
        .then(result => {
          if (result && result.body) {
            let records = result.body;
            records.forEach(record => {
              record.createdAt = this.$moment(record.createdAt).fromNow();
              record.percentage = 0;
            });
            this.processingRecords = records;
            if (records.length) {
              this.showAlert(
                `Found ${
                  records.length
                } records that are current under processing!`,
                "success"
              );
            }
          } else {
            this.showAlert(
              "Cannot get analyzing records at the moment!",
              "warning"
            );
          }
        })
        .catch(err => {
          this.showAlert(
            `Get analyzing records errored. ${err.toString()}`,
            "danger"
          );
        });
    },
    async getAnalyzingStatus() {
      if (!this.processingRecords.length) return;
      for (let i = 0; i < this.processingRecords.length; i++) {
        let _id = this.processingRecords[i]._id;
        this.$services.recordService.getStatus(_id).then(result => {
          if (result && result.body) {
            let status = result.body;
            let percentage = Math.floor((status.step / status.total) * 100);
            if (percentage === 100) {
              this.processingRecords[i].percentage = 100;
              setTimeout(() => {
                let record = this.processingRecords.splice(i, 1);
                this.showAlert(
                  `Analyzing record ${record[0].name} successful!`,
                  "success"
                );
              }, 6000);
            } else {
              if (
                this.processingRecords[i].percentage &&
                this.processingRecords[i].percentage >= percentage
              ) {
                let value =
                  this.processingRecords[i].percentage +
                  Math.floor(Math.random() * 4);
                if (value >= 99) {
                  this.processingRecords[i].percentage = 99;
                } else {
                  this.processingRecords[i].percentage = value;
                }
              } else {
                this.processingRecords[i].percentage = percentage;
              }
            }
          }
        });
      }
    },
    async deleteAnalyzingRecord(_id, ind) {
      this.$nuxt.$emit("ShowPageLoading", "Deleting record ...");
      let result = await this.$services.recordService.delete(_id);
      if (result && result.body) {
        this.processingRecords.splice(ind, 1);
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
    filesHanlder(files) {
      return files.map((file, index) => {
        return {
          file,
          fs: this.globalConfig.fs || 250,
          interval: this.globalConfig.interval || 10,
          recordName: file.name,
          size: this.convert2HumanFileSize(file.size),
          duration: this.calculateAllFields(file, this.files.length + index),
          cost: 0,
          columns: [],
          listColumns: []
        };
      });
    },
    updateTotalCost() {
      this.totalCost = 0;
      this.files.forEach(file => (this.totalCost += file.cost));
    },
    handleFsChange(fs, fileInd) {
      let fileInfo = this.files[fileInd];
      let file = fileInfo.file;
      let fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = e => {
        let text = fileReader.result;
        let rows = text.split("\n").length;
        // Calculate duration = rows / fs (single columns only)
        let duration = Math.floor(rows / fs || 250);
        fileInfo.duration = duration;
        // .end
        // Calculate service cost
        let storageCost =
          (this.serviceCost.STORAGE.VALUE * file.size) /
          this.serviceCost.STORAGE.UNIT;
        let durationCost =
          (this.serviceCost.DURATION.VALUE *
            duration *
            fileInfo.columns.length) /
          this.serviceCost.DURATION.UNIT;

        let totalCost = Math.floor((storageCost + durationCost) * 1000) / 1000;
        fileInfo.cost = totalCost;
        this.updateTotalCost();
        // .end
      };
    },
    handleColumnsChange(fileInd) {
      let fileInfo = this.files[fileInd];
      let file = fileInfo.file;
      let fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = e => {
        let text = fileReader.result;
        let rows = text.split("\n").length;
        let columns = this.files[fileInd].columns;
        // Calculate service cost
        let storageCost =
          (this.serviceCost.STORAGE.VALUE * file.size) /
          this.serviceCost.STORAGE.UNIT;
        let durationCost =
          (this.serviceCost.DURATION.VALUE *
            fileInfo.duration *
            columns.length) /
          this.serviceCost.DURATION.UNIT;

        let totalCost = Math.floor((storageCost + durationCost) * 1000) / 1000;
        fileInfo.cost = totalCost;
        this.updateTotalCost();
        // .end
      };
    },
    calculateAllFields(file, fileInd) {
      let fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = e => {
        let text = fileReader.result;
        let rows = text.split("\n").length;
        let fileInfo = this.files[fileInd];
        // Calculate columns
        let totalColumns = text.substring(0, text.indexOf("\n")).split(",")
          .length;
        let i = 0;
        while (i < totalColumns) {
          fileInfo.listColumns.push(i);
          i++;
        }
        fileInfo.columns = fileInfo.listColumns.slice(1);
        // .end
        // Calculate duration = rows / fs (single columns only)
        let duration = Math.floor(rows / this.globalConfig.fs || 250);
        fileInfo.duration = duration;
        // .end
        // Calculate service cost
        let storageCost =
          (this.serviceCost.STORAGE.VALUE * file.size) /
          this.serviceCost.STORAGE.UNIT;
        let durationCost =
          (this.serviceCost.DURATION.VALUE *
            duration *
            fileInfo.columns.length) /
          this.serviceCost.DURATION.UNIT;

        let totalCost = Math.floor((storageCost + durationCost) * 1000) / 1000;
        fileInfo.cost = totalCost;
        this.totalCost += totalCost;
        // .end
      };
    },
    deleteFile(index) {
      this.files.splice(index, 1);
      this.updateTotalCost();
    },
    discardAllFiles() {
      this.files = [];
      this.totalCost = 0;
    },
    clearFilesInput() {
      this.$refs.newFilesInput.reset();
    },
    convert2HumanFileSize(size, decimal = 0) {
      let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
      let value = (size / Math.pow(1024, i)).toFixed(decimal);
      return value + ["B", "kB", "MB", "GB", "TB"][i];
    },
    convert2HumanDuration(seconds) {
      seconds = Number(seconds);
      var h = Math.floor(seconds / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor((seconds % 3600) % 60);

      let result = "";
      if (h > 0) result += h + "h";
      if (m > 0) result += m + "m";
      if (s > 0 && h <= 0 && m <= 0) result += s + "s";
      return result;
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
.record-create-column > .tools-bar > .tools-box {
  width: calc(42px * 1 + 12px);
  margin-left: 6px;
}
.record-create-column > .content {
  width: 100%;
  display: inline-block;
  position: relative;
  height: calc(100vh - 70px);
  overflow-x: hidden;
  overflow-y: scroll;
  /* background: red; */
}
.record-create-column > .header i,
span {
  margin-right: 8px;
}
.btn-upload {
  padding-left: 40px;
  padding-right: 56px;
  margin-bottom: 12px;
}
.btn-cancel {
  padding-left: 20px;
  padding-right: 20px;
  margin-left: 8px;
  margin-bottom: 12px;
}
</style>
