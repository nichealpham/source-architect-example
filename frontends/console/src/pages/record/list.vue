<template>
  <div class="basic_box record-history-page">
    <div id="record-history-colum1" class="basic_box col-md-12 record-history-column">
      <div class="basic_box tools-bar">
        <div class="cs-input-icon search-name-box" style="margin-right:4px;">
          <i class="fa fa-search" aria-hidden="true"></i>
          <input v-model="searchBox" placeholder="Search record by name ...">
        </div>
        <div class="basic_box" style="width:86px;margin-right:4px;">
          <div class="cs-input-icon" >
            <input v-model="limit" @input="handleChangleLimit" placeholder="limit..." style="padding:0px;text-align:center;">
          </div>
        </div>
        <div class="cs-button-section tools-box">
          <button class="cs-tooltip" @click="downloadMultiple">
            <i class="fa fa-cloud-download" aria-hidden="true"></i>
            <!-- <span class="tooltiptext">Download</span> -->
          </button>
          <button class="cs-tooltip" @click="openMultipleReports">
            <i class="fa fa-file-text-o" aria-hidden="true"></i>
            <!-- <span class="tooltiptext">Report</span> -->
          </button>
          <button class="cs-tooltip" @click="deleteMultiple">
            <i class="fa fa-trash" aria-hidden="true"></i>
            <!-- <span class="tooltiptext">Delete</span> -->
          </button>
        </div>
      </div>
      <div class="basic_box content" style="margin-top:12px;">
        <div v-if="lookups.length" class="cs-container">
          <table>
            <tbody>
              <tr style="background-color:rgb(43, 49, 77);">
                <td width="2%" style="padding-left:2%;">#</td>
                <td width="2%"></td>
                <td width="2%">In.</td>
                <td width="1%"></td>
                <td width="27%">Record Name</td>
                <td width="19%" style="padding:0px 3% 0px 1%;">Caution Level</td>
                <td width="8%">Type</td>
                <td width="8%">Size</td>
                <td width="8%">Duration</td>
                <td width="12%">Created</td>
                <td colspan="3" width="11%">Options</td>
              </tr>
              <tr
                class="hover"
                v-for="(record, index) in lookups"
                @click="handleCheckboxClick(record._id)"
                :key="record._id"
              >
                <td width="2%" style="padding-left:2%;">
                  <b-form-checkbox
                    v-model="selectedIDs"
                    :value="record._id"
                    @click="preventDefault($event)"
                    :checked="selectedIDs.includes(record._id)"
                    :id="record._id"
                  ></b-form-checkbox>
                </td>
                <td width="2%"></td>
                <td width="2%">{{(page - 1) * limit + index + 1}}</td>
                <td width="1%"></td>
                <td width="27%">
                  <b-badge
                    style="width:60px;margin-right:18px;opacity:0.86;"
                    :variant="record.dangerLevel.variant"
                  >{{record.dangerLevel.label}}</b-badge>
                  <span
                    @click="openAnalysis($event, record._id)"
                    class="hover-underline"
                  >{{record.name}}</span>
                </td>
                <td width="19%" style="padding:0px 3% 0px 1%;">
                  <b-progress height="6px" class="mt-0" :max="100">
                    <b-progress-bar
                      :value="record.categories[0]"
                      variant="danger"
                    ></b-progress-bar>
                    <b-progress-bar
                      :value="record.categories[1]"
                      variant="warning"
                    ></b-progress-bar>
                    <b-progress-bar
                      :value="record.categories[2]"
                      variant="success"
                    ></b-progress-bar>
                    <b-progress-bar
                      :value="record.categories[3]"
                      variant="secondary"
                    ></b-progress-bar>
                  </b-progress>
                </td>
                <!-- <td width="19%" style="padding:0px 3% 0px 1%;">
                  
                </td> -->
                
                <td width="8%">{{record.extension}}</td>
                <td width="8%">{{record.size}}</td>
                <td width="8%">{{record.signalDuration}}</td>
                <td width="12%">{{record.createdAt}}</td>
                <td width="4%">
                  <i class="fa fa-cloud-download" aria-hidden="true" @click="downloadData(record._id, $event)"></i>
                </td>
                <td width="4%">
                  <i class="fa fa-file-text-o" aria-hidden="true" @click="openReport(record._id, $event)"></i>
                </td>
                <td width="3%">
                  <i class="fa fa-trash" aria-hidden="true" @click="deleteRecord(record._id, index)"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="cs-container">
          <span class="header">
            Record List
          </span>
          <span class="no-data custom-content">No records created yet.</span>
        </div>

        <div class="basic_box tools-bar" style="margin-top:-12px;" v-if="pages.length > 1">
          <div class="cs-button-section tools-box">
            

            <button style="width:68px;float:left;" @click="getPreviousPage">
              <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </button>
            
            <button style="width:68px;float:left;" @click="getNextPage">
              <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </button>

            <div class="basic_box" style="width:calc(100% - 72px * 2);">
              <button @click="selectPage(pageNum)" v-for="pageNum in pages" 
                      :style="{
                        'background-color': pageNum === page ? '#50597b' : 'rgb(57, 66, 100)'
                      }" :key="pageNum" style="margin-bottom:5px;">
                {{pageNum}}
              </button>
            </div>
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
      loadingMessage: "",
      lookups: [],
      serviceCost: {
        DURATION: { VALUE: 1.29, UNIT: 1000 }, // $1.2 for 1,000 secs
        STORAGE: { VALUE: 0.99, UNIT: Math.pow(2, 20) } // $0.8 for 1MB
      },
      filter: null,
      page: 1,
      limit: 15,
      pages: [],
      selectedIDs: [],
      searchBox: "",
      searchTimeout: null,
    };
  },
  watch: {
    searchBox: function(value) {
      if (value) {
        this.filter = { name: { $regex: value, $options: "i" } };
      }
      else {
        this.filter = null;
      }
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      }
      this.searchTimeout = setTimeout(async () => {
        await this.getRecordLookups();
      }, 600);
    },
  },
  beforeMount() {
    if (!this.$services.userAuthenticationService.validateLogin())
      this.$router.push("/login");
  },
  async mounted() {
    await this.getPagination();
    await this.getRecordLookups();
  },
  methods: {
    preventDefault(event) {
      event.preventDefault();
    },
    convert2HumanFileSize(size, decimal = 0) {
      let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
      let value = (size / Math.pow(1024, i)).toFixed(decimal);
      return value + ["B", "kB", "MB", "GB", "TB"][i];
    },
    convert2HumanTimeStamp(seconds) {
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
    handleCheckboxClick(_id) {
      if (this.selectedIDs.includes(_id)) {
        this.selectedIDs.splice(this.selectedIDs.indexOf(_id), 1);
      }
      else {
        this.selectedIDs.push(_id);
      }
    },
    handleChangleLimit() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = null;
      }
      this.searchTimeout = setTimeout(async () => {
        if (this.limit) {
          this.page = 1;
          await this.getPagination();
          await this.getRecordLookups();
        }
      }, 600);
    },
    async getPreviousPage() {
      if (this.page > 1) {
        this.page -= 1;
        await this.getRecordLookups();
      }
      else {
        this.showAlert(`No more data can be found!`, 'warning');
      }
    },
    async getNextPage() {
      let backups = this.lookups;
      this.page += 1;
      await this.getRecordLookups();
      if (!this.lookups.length) {
        this.showAlert(`No more data can be found!`, 'warning');
        this.page -= 1;
        this.lookups = backups;
      }
    },
    async selectPage(pageNumber) {
      this.page = pageNumber;
      await this.getRecordLookups();
    },
    async getPagination() {
      this.$nuxt.$emit("ShowPageLoading", "Loading records ...");
      let result = await this.$services.recordService.getCount(this.filter);
      if (result && result.body) {
        let counts = result.body;
        let maxPage = Math.ceil(counts / this.limit);
        this.pages = [];
        for (let i = 1; i <= maxPage; i++) {
        // for (let i = 1; i <= 100; i++) {
          this.pages.push(i);
        }
      }
      this.$nuxt.$emit("HidePageLoading");
    },
    convertCategories(categories = []) {
      let result = [0, 0, 0, 0];
      categories.forEach(category => {
        result[Number(category.value)] = category.confidenceLevel * 100
      })
      return result;
    },
    getDangerLevel(categories = []) {
      const dangerLevels = [
        { value: 3, label: 'DANGER', variant: 'secondary'},
        { value: 0, label: 'RISK', variant: 'danger'},
        { value: 1, label: 'WARN', variant: 'warning'},
        { value: 2, label: 'NORMAL', variant: 'success'},
      ];
      let result = {value: 4, label: 'UNKNOWN', variant: 'dark'};
      for (const level of dangerLevels) {
        if (categories[level.value] > 0) {
          result = level;
          break;
        }
      }
      return result;
    },
    async getRecordLookups() {
      this.$nuxt.$emit("ShowPageLoading", "Loading records ...");
      let result = await this.$services.recordService.getLookups(this.filter, this.page, this.limit);
      if (result && result.body) {
        let lookups = result.body || [];
        lookups.forEach(record => {
          record.createdAt = this.$moment(record.createdAt).format("MMM Do");
          record.extension = record.extension === "csv" ? "file" : "stream";
          record.signalDuration = this.convert2HumanTimeStamp(
            record.signalDuration
          );
          // This need to be in cronological order
          record.categories = this.convertCategories(record.categories);
          record.dangerLevel = this.getDangerLevel(record.categories);
          record.size = this.convert2HumanFileSize(record.size);
        });
        this.lookups = lookups;
      }
      this.$nuxt.$emit("HidePageLoading");
    },
    async deleteMultiple() {
      this.$nuxt.$emit("ShowPageLoading", "Deleting records ...");
      let promises = [];
      let _length = 0;
      this.selectedIDs.forEach(_id => {
        promises.push(this.$services.recordService.delete(_id));
        _length += 1;
      });
      Promise.all(promises)
        .then(async () => {
          await this.getRecordLookups();
          this.selectedIDs = [];
          this.showAlert(`Delete ${_length} ${_length < 2 ? "record" : "records"} successful!`, "success");
          this.$nuxt.$emit("HidePageLoading");
        })
        .catch(err => {
          this.showAlert(err.toString(), "danger");
          this.$nuxt.$emit("HidePageLoading");
        });
    },
    downloadMultiple() {
      this.selectedIDs.forEach(async _id => {
        await this.downloadData(_id);
      });
    },
    openMultipleReports() {
      this.selectedIDs.forEach(async _id => {
        await this.openReport(_id);
      });
    },
    async getRecordData(_recordId) {
      this.$nuxt.$emit("ShowPageLoading", "Loading record data ...");
      let result = await this.$services.recordService.getById(_recordId);
      this.$nuxt.$emit("HidePageLoading");
      return result && result.body;
    },
    async deleteRecord(_id, index) {
      this.$nuxt.$emit("ShowPageLoading", "Deleting record ...");
      let result = await this.$services.recordService.delete(_id);
      if (result && result.body) {
        this.lookups.splice(index, 1);
        this.showAlert(`Delete record ${_id} successful!`, "success");
      } else {
        this.showAlert(`Error ${(result && result.message) || "code 500, please contact technical support!"}`, "danger");
      }
      this.$nuxt.$emit("HidePageLoading");
    },
    async openAnalysis(event, _id) {
      event.stopPropagation();
      window.open(`/analyzer/${_id}`, '_blank');
    },
    async openReport(_id, event = null) {
      if (event) {
        event.stopPropagation();
      }
      let record = await this.getRecordData(_id);
      if (record) {
        let routeData = this.$router.resolve({
        path: `/analyzer/${_id}/report`, 
        query: {
          start: 0,
          limit: (record.analysis.total || 0) * (record.fileInfo.analysisInterval || 0) * (record.fileInfo.samplingFrequency || 250) / (record.fileInfo.dataColumns.length || 1),
          frequency: record.fileInfo.samplingFrequency || 250,
          span: 10,
          channels: record.fileInfo.dataColumns.length,
        }});
        window.open(routeData.href, '_blank');
      }
    },
    async downloadData(_id, event = null) {
      if (event) {
        event.stopPropagation();
      }
      let record = await this.getRecordData(_id);
      if (record) {
        window.open(record.dataUrl, '_blank');
      }
    },
    showAlert(message, variant = "success") {
      this.$nuxt.$emit("ShowAlert", { message, variant });
    }
  }
};
</script>

<style>
.record-history-page {
  height: calc(100vh - 64px);
  overflow: hidden;
}
.record-history-column {
  height: calc(100vh - 64px);
  overflow-y: scroll;
  padding: 6px 0px 0px 17px;
  cursor: context-menu;
  line-height: 100%;
  position: relative;
  overflow: hidden;
}
.record-history-column > .header {
  font-size: 13px;
  height: 21px;
  line-height: 100%;
}
.record-history-column > .tools-bar {
  width:calc(100% + 4px);
  margin: 0px 0px;
}
.record-history-column > .tools-bar > .search-name-box {
  width: calc(100% - (42px * 3 + 12px) - 14px - 90px);
  float: left;
}
.record-history-column > .tools-bar > .tools-box {
  width: calc(42px * 3 + 12px);
}
.record-history-column > .tools-bar > .tools-box > button {
  margin-right: 4px;
}
.record-history-column > .content {
  width: calc(100%);
  display: inline-block;
  position: relative;
  height: calc(100vh - 116px);
  overflow-x: hidden;
  overflow-y: scroll;
  /* background: red; */
}
.record-history-column > .header i,
span {
  margin-right: 8px;
}
</style>
