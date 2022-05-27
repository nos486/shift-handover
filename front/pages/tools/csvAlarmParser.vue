<template>
  <div class="pa-2">
    <Form title="CSV">
      <v-file-input filled rounded full-width placeholder="Input CSV File" dense
                    :color="$store.getters['app/baseColor']" @change="fileChange"></v-file-input>
      <v-data-table
        class="mt-2"
        :items-per-page="-1"
        :headers="headers"
        :items="data"
      ></v-data-table>
    </Form>


  </div>
</template>

<script>
import menu from "@/menu";
import Papa from "../../js/Papa"

export default {
  name: "csvAlarmParser",
  data: () => {
    return {
      ids: [],
      counts: [],
      allAlarms: [],
      headers: [
        {text: "Start", value: "start"},
        {text: "End", value: "end"},
        {text: "Name", value: "name"},
        {text: "Alarm Source", value: "source"},
        {text: "Alarm ID", value: "id"},
        {text: "Count", value: "count"},
        {text: "Severity", value: "severity"},
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
      if (file !== null) {
        Papa.parse(file, {
            complete: (res) => {
              this.allAlarms = []
              this.ids = []
              this.data = []
              this.counts = []
              try {
                res.data.shift()
                this.allAlarms = res.data
                for (let alarm of res.data) {
                  if (alarm.length > 1) {
                    this.ids.push(alarm[21].replace("\t", ""))
                    this.ids.push(alarm[21].replace("\t", ""))
                    this.counts[alarm[21]] = (this.counts[alarm[21]] || 0) + 1;
                  }
                }
                Object.entries(this.counts).forEach(([key, value]) => {

                  let alarms = this.getAllAlarm(key)

                  let sources = []
                  for (let alarm of alarms){
                    sources.push(alarm[2].replace("\t", "\r\n"))
                  }
                  sources = [...new Set(sources)]

                  this.data.push({
                    start: alarms.lastItem[3].replace("\t", ""),
                    end: alarms[0][8].replace("\t", ""),
                    name: alarms[0][1].replace("\t", ""),
                    source: sources.join(","),
                    id: alarms[0][21].replace("\t", ""),
                    count: value,
                    severity: alarms[0][0].replace("\t", "")
                  })
                })
              }
              catch(e){
                console.log(e)
                this.$store.commit("alert/error","Can't parse file")
              }

            },
            error(state, message) {
              console.log(state, message)
            }
          })
      }

    }
  }
}
</script>

<style scoped>

</style>
