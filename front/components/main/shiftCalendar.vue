<template>
  <Loading :loading="loading">
    <v-calendar
      ref="calendar"
      v-model="value"
      type="month"
      :color="$store.getters['app/baseColor']"
      :events="events"
      :event-height="26"
      event-ripple
      :event-more="false"
      @change="getEvents"
    >
      <template slot="event" slot-scope="{event}">
        <div class="px-2 py-1 d-flex justify-space-between">
          <v-icon v-if="event.isDay" small color="white">mdi-white-balance-sunny</v-icon>
          <v-icon v-else color="white" small>mdi-moon-waning-crescent</v-icon>
          <div class="ml-2 text-uppercase font-weight-bold">
            {{event.name}}
          </div>
          <div class="ml-auto">
            {{event.domain}}
          </div>
        </div>
      </template>
      <template slot=""></template>
    </v-calendar>
  </Loading>
</template>

<script>
export default {
  name: "shiftCalendar",
  props : {
    allDomains : {
      default : false
    },
  },
  data : function () {
    return {
      loading :false,
      value : "",
      events : []
    }
  },
  methods :{
    getEvents({ start, end }){
      this.loading = true
      let headers = {
        fromDate : new Date(start.date).toISOString(),
        toDate : new Date(end.date).toISOString(),
        itemsPerPage : 1000
      }
      if (!this.allDomains) headers["selfDomain"] = true
      this.$store.dispatch("services/global/get",{
        pathName : "shift",
        header : headers
      }).then((res)=>{
        let events = []
        for (let shift of res.result){
          events.push({
            name: shift.operatorName,
            domain : shift.domainName,
            start : new Date(shift.date).getTime(),
            end : new Date(shift.date).getTime(),
            isDay : shift.isDay,
            color: shift.isDay ? "blue" : "grey",
            timed: true,
          })
        }

        this.events = events.reverse()
        this.loading = false
      }).catch(()=>{
        this.loading = false
      })
    },
    getEventColor(event){
      console.log(event)
      return "blue"
    }
  }
}
</script>

<style scoped>

</style>
