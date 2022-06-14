<template>
  <div class="pa-2">
    <Form title="CAB" icon="mdi-file-excel" elevation="0" outlined :loading="loading">
      <template slot="bar">
        <v-btn v-if="data.length > 0" elevation="0" :color="$store.getters['app/baseColor']" text @click="addToServer">
          <v-icon>mdi-plus</v-icon> ADD
        </v-btn>
      </template>
      <v-file-input filled rounded full-width placeholder="Input xls File" dense
                    :color="$store.getters['app/baseColor']" @change="fileChange"></v-file-input>
      <v-data-table
        class="mt-2"
        :items-per-page="-1"
        :headers="headers"
        :items="data"
      >
        <template slot="item.startTime" slot-scope="{item}">
          {{item.startTime.toLocaleString()}}
        </template>

        <template slot="item.endTime" slot-scope="{item}">
          {{item.endTime.toLocaleString()}}
        </template>

        <template slot="item.outageStartTime" slot-scope="{item}">
          {{ (item.outageStartTime !== null) ? item.outageStartTime.toLocaleString() : "-"}}
        </template>

        <template slot="item.outageEndTime" slot-scope="{item}">
          {{ (item.outageEndTime !== null) ? item.outageEndTime.toLocaleString() : "-"}}
        </template>

      </v-data-table>
    </Form>

  </div>
</template>

<script>
import menu from "@/menu";
import XLSX from "../../js/xlsx.full.min"

export default {
  name: "cabParser",
  data: () => {
    return {
      loading : false,
      ids: [],
      counts: [],
      allAlarms: [],
      headers: [
        {text: "Title", value: "title"},
        {text: "Order ID", value: "orderId"},
        {text: "Domain", value: "domainName"},
        {text: "Start Time", value: "startTime"},
        {text: "End Time", value: "endTime"},
        {text: "Outage Start Time", value: "outageStartTime"},
        {text: "Outage End Time", value: "outageEndTime"},
        {text: "Status", value: "status"}
      ],
      data: []

      // start=alarm[3].replace("\t", ""),
      // end=alarm[8].replace("\t", ""),
      // name=alarm[1].replace("\t", ""),
      // source=alarm[2].replace("\t", ""),
      // id=alarm[21].replace("\t", ""),
      // count=count,
      // severity=alarm[0].replace("\t", "")

    }
  },
  methods: {

    getAllAlarm(alarmId) {
      let alarms = []
      for (let al of this.allAlarms) {
        if (parseInt(al[21]) === parseInt(alarmId)) {  // alarm ID
          alarms.push(al)
        }
      }
      return alarms
    },

    fileChange(file) {
      this.data = []
      if (file !== null) {

        let reader = new FileReader();
        reader.onload = function(e) {
          let arrayBuffer = new Uint8Array(reader.result);
          let wb =  XLSX.read(arrayBuffer)
          const ws = wb.Sheets[wb.SheetNames[0]];

          const data = XLSX.utils.sheet_to_json( ws,{header:1,raw: false, defval:null});

          let cabs = data.slice(2).map((r) => r.reduce((acc, x, i) => {
            acc[data[1][i]] = x;
            return acc;
          }, {}))

          for (let cabData of cabs){
            // let domain =  this.$store.getters["items/domain"].find((value, index) => {
            //   // return value["name"] == cabData["DOMAIN"]
            //   return cabData["DOMAIN"] === this.$store.getters["services/user/user"].domain.name
            // })

            if (cabData["DOMAIN"] === this.$store.getters["services/user/user"].domain.name){
              this.data.push({
                title : cabData["TITLE"],
                orderId : cabData["OrderId"],
                domainName : this.$store.getters["services/user/user"].domain.name,
                domain : this.$store.getters["services/user/user"].domain.id,
                startTime : new Date(`${cabData["Action Start Date"].replaceAll("-"," ")} ${cabData[" Start Time"]}`),
                endTime : new Date(`${cabData["Action End Date"].replaceAll("-"," ")} ${cabData[" End Time"]}`),
                outageStartTime : (cabData["OutageStart"] === "Null") ? null : new Date(`${cabData["Action Start Date"].replaceAll("-"," ")} ${cabData["OutageStart"]}`),
                outageEndTime : (cabData["OutageEnd"] === "Null") ? null : new Date(`${cabData["Action Start Date"].replaceAll("-"," ")} ${cabData["OutageEnd"]}`),
                status : ""
              })
            }
          }
        }.bind(this)
        reader.readAsArrayBuffer(file);
      }

    },
    addToServer(){
      this.loading = true
      this.$store.dispatch("services/global/post",{
        pathName : "cr/batch",
        array : this.data
      }).then((res)=>{
        this.$store.commit("alert/success","Added.")
        this.loading = false
      }).catch((e)=>{
        console.log(e)
        this.$store.commit("alert/error",e)
        this.loading = false
      })
    }

  }
}
</script>

<style scoped>

</style>
