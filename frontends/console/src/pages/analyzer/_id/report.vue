<template>
  <section class="document">
    <div v-for="(pageData, pageIndex) in report.pages" :key="pageIndex" class="page">
      <div class="page_section">
				<img class="company_logo" :src="report.header['Logo Url']"/>
        <div class="page_header right">
          <label contenteditable="true" style="text-align:right;font-weight:bold;font-size:12px;text-transform:uppercase">{{report.header['Company Name']}}</label>
          <label contenteditable="true" style="text-align:right;">Tel: {{report.header['Telephone']}}, Fax: {{report.header['Fax']}}</label>
          <label contenteditable="true" style="text-align:right;">{{report.header['Address']}}</label>
        </div>
			</div>
			<div class="page_section" v-if="pageIndex === 0" style="margin-top:0.5cm;">
				<label class="page_title" contenteditable="true">{{report.title}}</label>
				<label class="sub_title" contenteditable="true">{{$moment(report.date).format('MMMM Do, YYYY')}}</label>
				<label class="sub_title" contenteditable="true">Requester: {{report.requester}}</label>
			</div>
      <div v-for="(sectionObj, sectionName) in pageData" :key="sectionName" class="page_section">
				<header style="margin-bottom:6px;">{{sectionName}}:</header>
				<div class="page_devision" style="width:calc(100% - 0px);">
					<table style="width:100%;">
            <tbody>
              <tr v-for="(fieldValue, fieldName) in sectionObj" :key="fieldName">
                <td class="table-cell-title"><label class="print-standard-text" style="text-align:right;" contenteditable="true">{{fieldName}}:</label></td>
                <td class="table-cell-content"><label @input="handleEdit(sectionName, fieldName, $event.target.innerText)" class="print-standard-text border-invisible-on-print" contenteditable="true">{{fieldValue}}</label></td>
              </tr>
            </tbody>
					</table>
				</div>
			</div>
      <div class="page_footer" :style="{'bottom': `${1.5 + 0.3 * pageIndex}cm`}">
        <label contenteditable="true">Page {{pageIndex + 1}} of {{totalPages}}</label>
        <label contenteditable="true">@ 2018 {{report.header['Company Name']}}. All rights reserved.</label>
      </div>
		</div>
    <div v-for="channel in channels" :key="`channel-${channel}`" class="page">
      <div class="page_section">
				<img class="company_logo" :src="report.header['Logo Url']"/>
        <div class="page_header right">
          <label contenteditable="true" style="text-align:right;font-weight:bold;font-size:12px;text-transform:uppercase">{{report.header['Company Name']}}</label>
          <label contenteditable="true" style="text-align:right;">Tel: {{report.header['Telephone']}}, Fax: {{report.header['Fax']}}</label>
          <label contenteditable="true" style="text-align:right;">{{report.header['Address']}}</label>
        </div>
			</div>
      <div class="page_section">
        <header style="margin-bottom:6px;">7. Channel {{channelKeys[channel - 1]}} Waveform:</header>
        <div class="page_section" v-for="section in (sections > sectionsLimit ? sectionsLimit : sections)" :key="`section-${section}`">
          <div :id="`report-signal-waveform-chart-${section - 1}-channel-${channel - 1}`" 
              class="report-signal-waveform-chart">
          </div>
          <div class="report-waveform-bottom-labels">
            <span :style="{'width': `${100 / windowSpan}%`}" v-for="n in windowSpan" :key="n">
              {{windowSpan * (section - 1) + n}}s
            </span>
          </div>
        </div>
      </div>
      <div class="page_footer" :style="{'bottom': `${1.5 + 0.3 * channel}cm`}">
        <label contenteditable="true">Page {{channel + 2}} of {{totalPages}}</label>
        <label contenteditable="true">@ 2018 {{report.header['Company Name']}}. All rights reserved.</label>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  layout: "essential",
  data() {
    return {
      _recordId: "",

      start: 0,
      limit: 1000,

      frequency: 250,
      sections: 1,
      sectionsLimit: 6,

      channels: 1,
      channelKeys: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII'],
      
      dataUrl: "",
      totalPages: 2,
      windowSpan: 10,
      report: {
        title: "Electrocardiogram Analysis Report",
        date: new Date(),
        requester: "",
        header: {
          "Logo Url": "https://nichealpham.github.io/Cassandra-project/images/logo.png",
          "Company Name": "Cassandra AI, Co. LTD",
          "Address": "Intercontinental Office, Ho Chi Minh City, Vietnam",
          "Telephone": "+(84)-811-2133",
          "Fax": "IKD81-9876-B832A"
        },
        pages: [
          {
            "1. Patient Information:": {
              "Full Name": "",
              "Email": "",
              "Telephone": "",
              "Address": "",
              "Birthdate": "",
              "Measurement": "",
              "Medical History": "",
            },
            "2. Doctor / Physician Information:": {
              "Full Name": "",
              "Email": "",
              "Telephone": "",
              "Hospital": "",
              "Department": "",
              "Certificate ID": "",
              "Work Address": "",
            },
            "3. Diagnosis Information:": {
              "Analysis Result": "",
              "Test Condition": "",
              "Measured Date": "",
              "Symptoms": "",
              "Medication": "",
              "Interpretation": "",
              "Signal Indicator": ""
            },
          },
          {
            "4. Signal Information": {
              "Record ID": "",
              "Record Name": "",
              "Created": "",
              "Sampling Rate": "",
              "Duration": "",
              "File Info": "",
            },
            "5. Device Information": {
              "Name": "",
              "Device ID": "",
              "Specification": "",
              "Accessories": ""
            },
            "6. Additional Information": {
              "Patient's Notes": "",
              "Physician's Notes": ""
            }
          }
        ],
      },
      reportUpdate: null,
      waveforms: [],
      charts: [],

      notificationInterval: null,
      reportTimeout: null,
    };
  },
  // Change page head title for saving PDF on the browser
  head () {
    return {
      title: this.$route.params.id
    }
  },
  async mounted() {
    if (!this.$services.userAuthenticationService.validateLogin())
      this.$router.push("/login");
    
    this._recordId = this.$route.params.id;
    this.dataUrl = this.$route.query.dataUrl;
    this.start = Number(this.$route.query.start) || 0;
    this.limit = Number(this.$route.query.limit) || 1000;
    this.channels = Number(this.$route.query.channels) || 1;
    this.frequency = Number(this.$route.query.frequency) || 250,

    this.sections = Math.floor((this.limit - this.start) / this.frequency / this.windowSpan);
    this.totalPages += this.channels;

    await this.findReport();
    await this.getWaveforms();

    this.configLayout();
  },
  methods: {
    async findReport() {
      this.showLoading("Loading report data ...");
      let result = await this.$services.reportService.findReportByRecordId(this._recordId).catch(err => {
        this.showNotification(`Get report error: ${err.toString()}`, 'danger');
      });
      this.hideLoading();
      if (!result || !result.body) {
        await this.createReport();
      }
      else {
        this.report = result.body.data;
        this.reportUpdate = JSON.parse(JSON.stringify(this.report));
      }
    },
    handleEdit(sectionName, fieldName, value) {
      if (this.reportTimeout) {
        clearTimeout(this.reportTimeout);
        this.reportTimeout = null;
      }
      this.reportTimeout = setTimeout(async () => {
        for (let i = 0; i < this.reportUpdate.pages.length; i++) {
          if (this.reportUpdate.pages[i][sectionName]) {
            this.reportUpdate.pages[i][sectionName][fieldName] = value;
            break;
          }
        }
        let response = await this.$services.reportService.updateReportByRecordId(this._recordId, this.reportUpdate).catch(err => {
          this.showNotification(`Update report error: ${err.toString()}`, 'danger');
        });
        if (!response || response.error || !response.body) {
          this.showNotification(`Update report encouter an error! Please try again shortly. Error: ${response.error || 'Something went wrong.'}`, 'danger');
        }
        else {
          this.showNotification(`Update report successful!`);
        }
      }, 400);
    },
    async createReport() {
      this.showLoading("Auto filling report data ...");
      let result = await this.$services.reportService.createReportForRecord(this._recordId).catch(err => {
        this.showNotification(`Create report error: ${err.toString()}`, 'danger');
      });
      this.hideLoading();
      if (!result || !result.body) {
        this.showNotification(`Report is not available at the moment! Please try again shortly!`, 'warning');
        await this.createReport();
      }
      else {
        this.report = result.body.data;
        this.reportUpdate = JSON.parse(JSON.stringify(this.report));
      }
    },
    async getWaveforms() {
      this.showLoading("Loading waveforms data ...");
      let result = await this.$services.streamService.getWaveforms(this._recordId, this.start, this.limit).catch(err => {
        this.hideLoading();
        this.showNotification(`Get waveform error: ${err.toString()}`, 'danger');
        return [];
      });
      this.hideLoading();
      if (!result || !result.body || !result.body[0] || !result.body[0].length) {
        this.showNotification(`No data can be found!`, 'warning');
      }
      else {
        let sectionIndex = 0;
        this.charts = [];
        this.waveforms = result.body;
        setTimeout(() => {
          let sections = this.sections > this.sectionsLimit ? this.sectionsLimit : this.sections;
          for (let sectionIndex = 0; sectionIndex < sections; sectionIndex++) {
            let channels = [];
            for (let channelIndex = 0; channelIndex < this.channels; channelIndex++) {
              let data = this.waveforms[channelIndex].splice(0, this.frequency * this.windowSpan);
              let chart = this.drawWaveformChart(`#report-signal-waveform-chart-${sectionIndex}-channel-${channelIndex}`, data);
              channels.push(chart);
            }
            this.charts.push(channels);
          };
        }, 200);
      }
    },
    drawWaveformChart(chartId, data) {
      return this.$chartist.Line(
        chartId,
        {
          series: [data]
        },
        {
          fullWidth: true,
          axisX: {
            showGrid: false,
            offset: 0,
            showLabel: false,
            scaleMinSpace: 10
          },
          axisY: {
            offset: 0,
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
          stroke: "black",
          "stroke-width": "1px"
        });
      });
    },
    showNotification(message, variant = "success") {
      this.$nuxt.$emit("ShowAlert", { message, variant });
    },
    showLoading(message) {
      this.notificationInterval = setInterval(() => {
        this.showNotification(message)
      }, 2500);
    },
    hideLoading(message) {
      if (this.notificationInterval) {
        clearInterval(this.notificationInterval);
        this.notificationInterval = null;
      }
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
    },
    configLayout() {
      let isMobile = false;
      let width = $(window).width();
      let height = $(window).height();
      if ( width <= height || width < 720) {
       isMobile = true;
      }
      if (isMobile) {
        $('.document').css({
          "margin-left": "20px",
        });
      }
    }
  }
};
</script>

<style></style>
