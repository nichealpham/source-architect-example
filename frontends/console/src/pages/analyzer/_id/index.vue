<template>
    <div class="basic_box">
        <div id="analyzer-left" class="side-nav basic_box col-lg-3">
          <div class="basic_box tools-bar" style="padding-right:12px;">
            <a id="analyzer-navigator-left-title" style="display:none;">
              <i class="fa fa-arrow-left" aria-hidden="true"></i> hide menu
            </a>
            <div class="basic_box button-wrapper">
              <button @click="downloadSignalData" class="cs-button cs-primary-bg right col-md-6 first">
                Download Data
              </button>
              <button @click="previewAnalysisReport" class="cs-button cs-success-bg right col-md-6 second">
                Report Preview
              </button>
            </div>
          </div>
          <div id="analyzer-navigator-left-content" class="basic_box side-nav-wraper">
            <div class="cs-container" style="margin-bottom:4px;">
              <b-btn v-b-toggle="`analysisPannel`" class="header" style="line-height:24px;">
                Analysis Result
                <i class="fa fa-angle-down" aria-hidden="true" style="line-height:24px;"></i>
              </b-btn>
              <b-collapse visible id="analysisPannel" class="basic_box">
                <div v-if="record.analysis" class="basic_box">
                  <h2
                      class="danger-label"
                      :style="{'color': dangerLevel.color}"
                      :variant="dangerLevel.variant"
                    >{{dangerLevel.label}}</h2>
                  <div class="basic_box chart-wraper">
                    <div id="analysis-result-chart" class="basic_box ct-square"></div>
                  </div>
                </div>
                <div v-else class="no-data" style="margin-bottom:20px;">Data cannot be found!</div>
              </b-collapse>
            </div>
            <div class="cs-container" style="margin-bottom:4px;">
              <b-btn v-b-toggle="`countsPannel`" class="header" style="line-height:24px;">
                Segments Counts
                <i class="fa fa-angle-down" aria-hidden="true" style="line-height:24px;"></i>
              </b-btn>
              <b-collapse id="countsPannel" class="basic_box">
                <div v-if="record.analysis" class="basic_box" style="padding-bottom:2px;">
                  <div class="basic_box">
                    <div class="basic_box chart-label ami" style="">
                      <span class="title">AMI</span>
                      <span class="value">{{Math.round(stats.ami * record.analysis.total) || 0}}</span>
                      <!-- <span class="symbol">%</span> -->
                    </div>
                    <div class="basic_box chart-label isc" style="border-color:#fcb150">
                      <span class="title">ISC</span>
                      <span class="value">{{Math.round(stats.isc * record.analysis.total) || 0}}</span>
                      <!-- <span class="symbol">%</span> -->
                    </div>
                    <div class="basic_box chart-label nsr" style="border-color:#128d76">
                      <span class="title">NSR</span>
                      <span class="value">{{Math.round(stats.nsr * record.analysis.total) || 0}}</span>
                      <!-- <span class="symbol">%</span> -->
                    </div>
                    <div class="basic_box chart-label scd" style="border-color:#546E7A">
                      <span class="title">SCD</span>
                      <span class="value">{{Math.round(stats.scd * record.analysis.total) || 0}}</span>
                      <!-- <span class="symbol">%</span> -->
                    </div>
                  </div>
                </div>
                <div v-else class="no-data" style="margin-bottom:20px;">Data cannot be found!</div>
              </b-collapse>
            </div>
            <div class="cs-container" style="margin-bottom:0px;">
              <b-btn v-b-toggle="`infoPannel`" class="header" style="line-height:24px;">
                Signal Information
                <i class="fa fa-angle-down" aria-hidden="true" style="line-height:24px;"></i>
              </b-btn>
              <b-collapse visible id="infoPannel" class="basic_box" style="margin-bottom:20px;padding-top:18px;">
                <div v-if="record && record._id" class="basic_box">
                  <table>
                    <tbody>
                      <tr style="border:0px;height:24px;line-height:24px;">
                        <td class="field-title cs-3dot">#ID:</td>
                        <td class="field-content cs-3dot">{{record._id}}</td>
                      </tr>
                      <tr style="border:0px;height:24px;line-height:24px;">
                        <td class="field-title cs-3dot">Name:</td>
                        <td class="field-content cs-3dot">{{record.name}}</td>
                      </tr>
                      <tr style="border:0px;height:24px;line-height:24px;">
                        <td class="field-title cs-3dot">Created:</td>
                        <td class="field-content cs-3dot">{{$moment(record.createdAt).format('YYYY-MM-DD')}}</td>
                      </tr>
                      <tr style="border:0px;height:24px;line-height:24px;">
                        <td class="field-title cs-3dot">Interval:</td>
                        <td class="field-content cs-3dot">{{convert2HumanTimeStamp(record.fileInfo.analysisInterval) || '0s'}} ( {{record.analysis.total || 0}} segments )</td>
                      </tr>
                      <tr style="border:0px;height:24px;line-height:24px;">
                        <td class="field-title cs-3dot">Duration:</td>
                        <td class="field-content cs-3dot">{{convert2HumanTimeStamp(record.fileInfo.analysisInterval) || '0s'}} * {{record.analysis.total || 0}} = {{convert2HumanTimeStamp((record.analysis.total || 0) * record.fileInfo.analysisInterval )|| '0s'}}</td>
                      </tr>
                      <tr style="border:0px;height:24px;line-height:24px;">
                        <td class="field-title cs-3dot">Sampling:</td>
                        <td class="field-content cs-3dot">{{record.fileInfo.samplingFrequency}}Hz</td>
                      </tr>
                      <tr style="border:0px;height:24px;line-height:24px;">
                        <td class="field-title cs-3dot">Encoding:</td>
                        <td class="field-content cs-3dot">{{record.fileInfo.encoding}} / {{record.fileInfo.extension}}</td>
                      </tr>
                      <tr style="border:0px;height:24px;line-height:24px;">
                        <td class="field-title cs-3dot">File Type:</td>
                        <td class="field-content cs-3dot">{{record.fileInfo.mimetype}}</td>
                      </tr>
                      <tr style="border:0px;height:24px;line-height:24px;">
                        <td class="field-title cs-3dot">File Size:</td>
                        <td class="field-content cs-3dot">{{convert2HumanFileSize(record.fileInfo.size)}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else class="no-data">Data cannot be found!</div>
              </b-collapse>
            </div>
          </div>
        </div>
        <div id="analyzer-right" class="site-content basic_box col-lg-9">
          <div class="basic_box tools-bar">
            <div class="cs-input-icon search-name-box">
              <i id="analyzer-right-burger" class="fa fa-bars" aria-hidden="true"></i>
              <label id="analyzer-right-record-name" class="label-title">{{record.name}}</label>
            </div>
            <div class="cs-button-section tools-box">
              <button style="width:68px;" @click="getPreviousWaveforms">
                <i class="fa fa-step-backward" aria-hidden="true"></i>
              </button>
              <button @click="fastPreviousSegments">
                <i class="fa fa-fast-backward" aria-hidden="true"></i>
              </button>
              <button v-if="!stream.updateChartsInterval" @click="playSignals">
                <i class="fa fa-play" aria-hidden="true"></i>
              </button>
              <button v-else @click="pauseSignals">
                <i class="fa fa-pause" aria-hidden="true"></i>
              </button>
              <button @click="fastForwardWaveforms">
                <i class="fa fa-fast-forward" aria-hidden="true"></i>
              </button>
              <button style="width:68px;" @click="getNextWaveforms">
                <i class="fa fa-step-forward" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="basic_box waveforms-wraper" style="margin-top:-7px;">
            <div class="cs-container" style="margin-bottom:6px;">
              <b-btn v-b-toggle="`waveformPannel`" class="header" style="line-height:24px;height:44px;">
                Signal Waveforms
                <i class="fa fa-angle-down" aria-hidden="true" style="line-height:24px;"></i>
              </b-btn>
              <b-collapse visible id="waveformPannel" class="basic_box" style="padding-bottom:10px;padding-top:24px;">
                <div v-if="waveforms.length" class="basic_box">
                  <div v-for="(waveform, ind) in waveforms" :key="ind" class="basic_box">
                    <span class="chart-title">ECG-v{{ind + 1}}</span>
                    <div :id="`signal-waveform-chart-channel-${ind}`" class="basic_box col-md-12 signal-waveform-chart"></div>
                    <div class="waveform-bottom-labels">
                      <span :style="{'width': `${100 / settings.interval}%`}" v-for="n in settings.interval" :key="n">
                        {{settings.interval * settings.page + n}}s
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="no-data">Data cannot be found!</div>
              </b-collapse>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  layout: "starter",
  data() {
    return {
      _recordId: "",
      record: {
        _id: "",
        name: "",
        dataUrl: "",
        createdAt: "",
        analysis: {},
        fileInfo: {},
      },
      settings: {
        interval: 6,
        start: {
          hours: 0,
          minutes: 0,
          seconds: 0
        },
        page: 0,
      },
      stream: {
        getNewWaveformsDataInterval: null,
        updateChartsInterval: null,
        refreshRate: 40,
        waveformsBin: [],
        waveforms: [],
        cursor: 0
      },
      waveforms: [],
      charts: [],
      stats: {
        ami: 0.00,
        isc: 0.00,
        nsr: 0.00,
        scd: 0.00,
      },
      categories: [0, 0, 0, 0],
      dangerLevel: {value: 4, label: 'UNKNOWN', variant: 'dark', color: 'White'},
    };
  },
  beforeMount() {
    if (!this.$services.userAuthenticationService.validateLogin())
      this.$router.push("/login");
  },
  async mounted() {
    this._recordId = this.$route.params.id;
    await this.getRecordData();
    await this.getWaveforms();
    this.initWaveformCharts(this.waveforms);
  },
  methods: {
    convertCategories(categories = []) {
      categories.forEach(category => {
        this.categories[Number(category.value)] = category.confidenceLevel * 100
      });
    },
    getDangerLevel(categories = []) {
      const dangerLevels = [
        { value: 3, label: 'DANGER', variant: 'secondary', color: '#546E7A'},
        { value: 0, label: 'RISK', variant: 'danger', color: '#e64c65'},
        { value: 1, label: 'WARN', variant: 'warning', color: '#fcb150'},
        { value: 2, label: 'NORMAL', variant: 'success', color: '#149F85'},
      ];
      for (const level of dangerLevels) {
        if (this.categories[level.value] > 0) {
          this.dangerLevel = level;
          break;
        }
      }
    },
    async getRecordData() {
      this.$nuxt.$emit("ShowPageLoading", "Loading record data ...");
      let result = await this.$services.recordService.getById(this._recordId);
      if (result && result.body) {
        this.record = result.body;
        // console.log(this.record);
        // this.settings.interval = this.record.fileInfo.analysisInterval > 20 ? 20 : this.record.fileInfo.analysisInterval;
        this.getCategoriesStatistics(this.record.analysis.categories);
        this.convertCategories(this.record.analysis.categories);
        this.getDangerLevel(this.record.analysis.categories);
        this.drawAnalysisChart(this.record.analysis);
      }
      this.$nuxt.$emit("HidePageLoading");
    },
    stopStreaming() {
      clearInterval(this.stream.updateChartsInterval);
      clearInterval(this.stream.getNewWaveformsDataInterval);
      this.stream.updateChartsInterval = null;
      this.stream.getNewWaveformsDataInterval = null;
    },
    cleanStreamData() {
      this.stream.waveformsBin = [];
      this.stream.waveforms = [];
      this.stream.cursor = 0;
    },
    playSignals() {
      let _step = Math.round(this.record.fileInfo.samplingFrequency / this.stream.refreshRate);
      let _window = this.stream.refreshRate * this.settings.interval;
      
      if (!this.stream.waveformsBin[0] || !this.stream.waveformsBin[0].length) {
        this.stream.waveformsBin = this.downSamplingWaveforms(this.waveforms, _step);
        
        this.stream.cursor = 0;
        this.stream.waveforms = [];
        
        for (let i = 0; i < this.waveforms.length; i++) {
          this.stream.waveforms.push([]);
          for (let j = 0; j < _window; j++) {
            this.stream.waveforms[i].push(null);
          }
        }
        this.updateWaveformCharts(this.stream.waveforms);
      }

      this.stream.updateChartsInterval = setInterval(() => {
        if (this.stream.cursor === _window || !this.stream.waveformsBin[0].length) {
          this.stream.waveformsBin = [];
          this.stopStreaming();
          // this.updateWaveformCharts(this.waveforms);
          // console.log('interval stoped');
          return;
        }
        for (let i = 0; i < this.stream.waveformsBin.length; i++) {
          let value = this.stream.waveformsBin[i].shift();
          this.stream.waveforms[i][this.stream.cursor] = value;
        }
        this.updateWaveformCharts(this.stream.waveforms);
        this.stream.cursor += 1;
      }, 1000 / this.stream.refreshRate);
    },
    pauseSignals() {
      this.stopStreaming();
    },
    downSamplingWaveforms(waveforms, steps = 1) {
      let lightwaveforms = [];
      waveforms.forEach(waveform => {
        let lightwaveform = [];
        waveform.forEach((value, _ind) => {
          if (_ind % steps === 0)
            lightwaveform.push(value);
        });
        lightwaveforms.push(lightwaveform);
      });
      return lightwaveforms;
    },
    async getNextWaveforms() {
      this.stopStreaming();
      this.cleanStreamData();
      let waveforms = await this.getWaveforms(this.settings.page + 1);
      if (!waveforms || !waveforms[0])
        return;

      this.updateWaveformCharts(waveforms);
    },
    async getPreviousWaveforms() {
      this.stopStreaming();
      this.cleanStreamData();
      let waveforms = await this.getWaveforms(this.settings.page - 1);
      if (!waveforms || !waveforms[0])
        return;

      this.updateWaveformCharts(waveforms);
    },
    async fastForwardWaveforms() {
      this.stopStreaming();
      this.cleanStreamData();
      if (!this.record || !this.record.dataUrl) {
        this.showAlert(`Record file cannot be found!`, 'danger');
        return;
      }
      if (!this.record.analysis.total) {
        this.showAlert(`Record is not analyzed yet! Please try again shortly.`, 'danger');
        return;
      }
      if (!this.record.fileInfo.dataColumns || !this.record.fileInfo.dataColumns.length) {
        this.showAlert(`Record data columns is not defined!`, 'danger');
        return;
      }
      let page = Math.ceil(this.record.analysis.total / this.record.fileInfo.dataColumns.length * this.record.fileInfo.analysisInterval / this.settings.interval) - 1;
      let waveforms = await this.getWaveforms(page);
      
      if (!waveforms || !waveforms[0])
        return;

      this.updateWaveformCharts(waveforms);
    },
    async fastPreviousSegments() {
      this.stopStreaming();
      this.cleanStreamData();
      let waveforms = await this.getWaveforms(0);
      this.updateWaveformCharts(waveforms);
    },
    async getWaveforms(page = 0, showLoading = true, updateSettingsPage = true) {
      if (!this.record || !this.record.dataUrl)
        return [];

      if (showLoading)
        this.$nuxt.$emit("ShowPageLoading", "Loading waveforms data ...");
      
      let limit = this.settings.interval * this.record.fileInfo.samplingFrequency;
      let start = page * limit;

      let result = await this.$services.streamService.getWaveforms(this._recordId, start, limit).catch(err => {
        this.$nuxt.$emit("HidePageLoading");
        this.showAlert(`Get waveform error: ${err.toString()}`, 'danger');
        return [];
      });
      if (!result || !result.body || !result.body[0] || !result.body[0].length) {
        this.$nuxt.$emit("HidePageLoading");
        this.showAlert(`No more data can be found!`, 'warning');
        return [];
      }
      else {
        this.$nuxt.$emit("HidePageLoading");
        if (updateSettingsPage)
          this.settings.page = page;

        let currentSeconds = page * this.settings.interval;
        this.settings.start.hours = Math.floor(currentSeconds / 3600);
        this.settings.start.minutes = Math.floor((currentSeconds - this.settings.start.hours * 3600) / 60);
        this.settings.start.seconds = currentSeconds - this.settings.start.hours * 3600 - this.settings.start.minutes * 60;

        let waveforms = result.body;
        let missingValues = this.settings.interval * this.record.fileInfo.samplingFrequency - waveforms[0].length;
        while(missingValues > 0) {
          waveforms.forEach(waveform => waveform.push(null));
          missingValues -= 1;
        }
        this.waveforms = waveforms;
        return this.waveforms;
      }
    },
    initWaveformCharts(waveforms) {
      // add little delay so that v-if can update DOM
      this.$nuxt.$emit("ShowPageLoading", "Loading waveforms data ...");
      setTimeout(() => {
        this.charts = [];
        waveforms.forEach((waveform, _ind) => {
          let chart = this.drawWaveformChart(`#signal-waveform-chart-channel-${_ind}`, waveform);
          this.charts.push(chart);
        });
        this.$nuxt.$emit("HidePageLoading");
      }, 200);
    },
    updateWaveformCharts(waveforms) {
      if (!this.charts || !this.charts.length)
        return;

      waveforms.forEach((waveform, _ind) => {
        this.charts[_ind].update({
          series: [waveform]
        })
      });
    },
    drawWaveformChart(chartId, data, yLabel = "") {
      return this.$chartist
        .Line(
          chartId,
          {
            series: [data]
          },
          {
            chartPadding: 40,
            fullWidth: true,
            axisX: {
              showGrid: false,
              offset: 0,
              showLabel: false,
              scaleMinSpace: 10
            },
            axisY: {
              offset: 0,
              high: this.findMax(data),
              low: this.findMin(data),
              showGrid: false,
              showLabel: false,
              scaleMinSpace: 40
            }
          }
        )
        .on("created", function(context) {
          context.svg.elem("rect", {
            x: context.chartRect.x1,
            y: context.chartRect.y2,
            width: context.chartRect.width(),
            height: context.chartRect.height(),
            fill: "none",
            stroke: "#e0e0e0",
            "stroke-width": "1px"
          });
        });
    },
    getCategoriesStatistics(categories) {
      categories.forEach(category => {
        if (category.value === '0')
          this.stats.ami = category.confidenceLevel;
        else if (category.value === '1')
          this.stats.isc = category.confidenceLevel;
        else if (category.value === '2')
          this.stats.nsr = category.confidenceLevel;
        else if (category.value === '3')
          this.stats.scd = category.confidenceLevel;
      });
    },
    drawAnalysisChart(analysis) {
      let _labels = ["ami", "isc", "nsr", "scd"];
      let labels = [];
      analysis.categories.forEach(category => {
        labels.push(_labels[category.value]);
      });
      this.$chartist.Pie('#analysis-result-chart', {
        series: analysis.categories.map(category => {
          return {
            value: category.confidenceLevel * analysis.total,
            className: `analysis-class-${category.value}`
          }
        }),
        labels,
      }, {
        donut: true,
        donutWidth: 50,
        donutSolid: true,
        showLabel: true,
        startAngle: 30,
        width: '100%',
        labelOffset: -2,
        labelInterpolationFnc: (label) => {
          if (!this.stats[label])
            return null;
          // Hide if stats = 100%
          if (this.stats[label] === 1) {
            return null;
          }
          // return `${Math.round(this.stats[label] * analysis.total)} ${label.toUpperCase()} segments`;
          return `${Math.round(this.stats[label] * 100)}% ${label.toUpperCase()}`;
        }
      });
    },
    preventDefault(event) {
      event.preventDefault();
    },
    showAlert(message, variant = "success") {
      this.$nuxt.$emit("ShowAlert", { message, variant });
    },
    convert2HumanFileSize(size, decimal = 0) {
      let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
      let value = (size / Math.pow(1024, i)).toFixed(decimal);
      return value + ["B", "kB", "MB", "GB", "TB"][i];
    },
    convert2HumanTimeStamp(seconds) {
      if (!seconds)
        seconds = 0;
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
    downloadSignalData() {
      window.open(`${this.record.dataUrl}`, '_blank');
    },
    previewAnalysisReport() {
      let routeData = this.$router.resolve({
        path: `/analyzer/${this._recordId}/report`, 
        query: {
          start: 0,
          limit: (this.record.analysis.total || 0) * (this.record.fileInfo.analysisInterval || 0) * (this.record.fileInfo.samplingFrequency || 250) / (this.waveforms.length || 1),
          // dataUrl: this.record.dataUrl,
          frequency: this.record.fileInfo.samplingFrequency || 250,
          span: 10,
          channels: this.waveforms.length,
      }});
      window.open(routeData.href, '_blank');
    },
    findMax(array) {
      let max = -1000;
      array.forEach(item => {
        if (item > max) max = item;
      });
      return max;
    },
    findMin(array) {
      let min = 1000;
      array.forEach(item => {
        if (item < min) min = item;
      });
      return min;
    }
    // Backup Play Signal => Maintained signal shape but performance hitted hard !!!
    // playSignals() {
    //   let cursor = 0;
    //   let stepSize = Math.round(this.record.fileInfo.samplingFrequency / this.settings.refreshRate);
    //   let windowSize = this.waveforms[0] && this.waveforms[0].length || 0;
      
    //   let blanks = [];
    //   for (let i = 0; i < this.waveforms.length; i++) {
    //     blanks.push([]);
    //     for (let j = 0; j < windowSize; j++) {
    //       blanks[i].push(null);
    //     }
    //   }
    //   this.updateWaveformCharts(blanks);

    //   this.settings.updateChartsInterval = setInterval(() => {
    //     if (cursor === windowSize) {
    //       clearInterval(this.settings.updateChartsInterval);
    //       this.settings.updateChartsInterval = null;
    //       return;
    //     }
    //     for (let i = 0; i < this.waveforms.length; i++) {
    //       for (let j = 0; j < stepSize; j++) {
    //         blanks[i][cursor + j] = this.waveforms[i][cursor + j];
    //       }
    //     }
    //     cursor += stepSize;
    //     console.log('curosr', cursor);
    //     this.updateWaveformCharts(blanks);
    //   }, 1000 / this.settings.refreshRate);
    // },
  }
};
</script>

<style>
.site-content {
  height: calc(100vh - 0px);
  display: inline-block;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-top: 7px;
}
.side-nav {
  height: calc(100vh - 0px);
  padding-top: 7px;
  display: inline-block;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-left: 4px;
}
.button-wrapper button.first {
  width: calc(50% - 4px);
  float: left;
}
.button-wrapper button.second {
  width: calc(50% - 4px);
  float: right;
}
table .field-title {
  width: 35%;
  text-align: right;
  padding-right: 10px;
  padding-left: 4px;
}
table .field-content {
  width: 65%;
  text-align: left;
  padding-right: 4px;
  padding-left: 0px;
}
#analysisPannel .chart-wraper {
  width: 260px;
  margin: 7px calc(50% - 130px) 7px;
}
#analysisPannel .ct-label {
  stroke: #e0e0e0;
  font-size: 11px;
}
.danger-label {
  width: 100%;
  position:absolute;
  text-align:center;
  top:calc(50%+5px);
  z-index:10;
  font-weight: bold;
}
.analysis-class-0 {
  stroke: #e64c65;
  fill: #e64c65;
}
.chart-label.ami {
  border-color:#e64c65;
  color: #e64c65;
}
.analysis-class-1 {
  stroke: #fcb150;
  fill: #fcb150;
}
.chart-label.isc {
  border-color:#fcb150;
  color: #fcb150;
}
.analysis-class-2 {
  stroke: #128d76;
  fill: #128d76;
}
.chart-label.nsr {
  border-color:#128d76;
  color: #128d76;
}
.analysis-class-3 {
  stroke: #546E7A;
  fill: #546E7A;
}
.chart-title {
  font-size: 13px;
  margin-bottom: 6px;
  width: 100%;
  display: inline-block;
  text-align: center;
  font-weight: bolder;
}
.chart-label.scd {
  border-color:#546E7A;
  color: #546E7A;
}
.chart-label {
  width: 25%;
  height: 68px;
  /* border-top: 4px solid red; */
  position: relative;
  padding: 6px 0px 6px 0px;
  margin-top: 0px;
  /* background: rgb(43, 49, 77); */
}
.chart-label .title {
  width: 100%;
  font-size: 12px;
  line-height: 24px;
  font-weight: bolder;
  display: inline-block;
  text-align: center;
  /* color: inherit; */
  color: #e0e0e0;
}
.chart-label .value {
  width: 100%;
  font-size: 30px;
  font-weight: bolder;
  display: inline-block;
  text-align: center;
  color: inherit;
  margin-top: -6px;
}
.chart-label .symbol {
  font-size: 13px;
  color: #e0e0e0;
  position: absolute;
  right: calc(50% - 30px);
  top: 28px;
}
.signal-waveform-chart {
  width: 100%;
  height: 234px;
  margin-top: -40px;
}
.signal-waveform-chart .ct-point {
  stroke-width: 0px;
}
.signal-waveform-chart .ct-grids line {
  stroke: #e0e0e0;
}
.signal-waveform-chart .ct-labels span {
  color: #e0e0e0;
}
.signal-waveform-chart .ct-series-a .ct-line {
  stroke: rgb(20, 159, 133);
  stroke-width: 2px;
}
.signal-waveform-chart .ct-series-a .ct-point {
  stroke: rgb(20, 159, 133);
}
.waveform-bottom-labels {
  width: calc(100% - 80px);
  margin-left: 40px;
  top: -30px;
  border-top: 1px solid #e0e0e0;
  height: 16px;
  position: relative;
  overflow: hidden;
}
.waveform-bottom-labels span {
  font-size: 12px;
  height: 14px;
  overflow: visible;
  position: relative;
  display: inline-block;
  border-left: 1px solid #e0e0e0;
  padding-right: 4px;
  padding-top: 4px;
  top: -4px;
  text-align: right;
}
.tools-bar {
  position: relative;
  margin-bottom: 8px;
}
.waveforms-wraper {
  position: relative;
  height: calc(100vh - 62px);
  padding-bottom: 12px;
  /* background: red; */
  overflow-x: hidden;
  overflow-y: scroll;
}
.side-nav-wraper {
  position: relative;
  height: calc(100vh - 62px);
  /* padding-bottom: 12px; */
  /* background: red; */
  overflow-x: hidden;
  overflow-y: scroll;
}
.tools-bar > .search-name-box {
  width: calc(100% - (42px * 3 + 68px * 2 + 6 * 4px) - 9px);
  float: left;
  border-radius: 6px;
}
.tools-bar > .tools-box {
  width: calc(42px * 3 + 68px * 2 + 6 * 4px);
  margin-left: 6px;
}
#analyzer-navigator-left-title {
  display: inline-block;
  line-height: 48px;
  margin: 0;
  cursor: pointer;
  text-transform: uppercase;
  background-color: rgb(20, 159, 133);
  font-weight: 600;
  text-align: center;
  padding: 0px;
  font-size: 16px;
  padding-left: 0px;
  width: 100%;
  margin-bottom: 8px;
}
</style>
