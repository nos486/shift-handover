<template>
  <div class="d-flex flex-column">
    <APITable ref="api" :menu="menu" @createDataChange="createDataChange" @updateDataChange="updateDataChange">
      <template slot="item.title" slot-scope="{item}">
        <div class="d-flex align-center">
          <div>
            <v-icon v-if="item.severity === 'critical'" color="red">mdi-alert-circle</v-icon>
            <v-icon v-if="item.severity === 'major'" color="orange">mdi-alert-circle</v-icon>
            <v-icon v-if="item.severity === 'miner'" color="yellow" class="text--accent-4">mdi-alert-circle</v-icon>
            <v-icon v-if="item.severity === 'none'">mdi-alert-circle</v-icon>
          </div>
          <div class="ml-2">
            {{ item.title }}
          </div>
        </div>

      </template>

      <template slot="item.reporter" slot-scope="{item}">
        {{ (item.reporter !== null) ? item.reporter.username : "-" }}
      </template>

      <template slot="item.reporterDomain" slot-scope="{item}">
        {{ (item.reporter !== null) ? (item.reporter.domain !== null) ? item.reporter.domain.name : "- " : "-" }}
      </template>

      <template slot="item.domain" slot-scope="{item}">
        <v-chip small color="orange" dark>
          {{ (item.domain !== null) ? item.domain.name : "-" }}
        </v-chip>
      </template>

      <template slot="item.duration" v-if="item.endTime !== null" slot-scope="{item}">
        {{$secondToString((new Date(item.endTime) - new Date(item.startTime))/1000)}}
      </template>

      <template slot="item.outage" v-if="item.outageEndTime !== null" slot-scope="{item}">
        {{$secondToString((new Date(item.outageEndTime) - new Date(item.outageStartTime))/1000)}}
      </template>

      <template slot="item.status" slot-scope="{item}">
        <v-icon :color="item.status === 'close' ? 'green' : 'red'" :title="item.status">
          {{ item.status === 'close' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
      </template>

      <template slot="item.affectedServices" slot-scope="{item}">
        <v-chip v-for="service in item.affectedServices" :key="service.id" small
                :color="$store.getters['app/baseColor']" dark style="margin: 2px">
          {{ service.name }}
        </v-chip>
        <v-chip v-if="item.affectedServices.length === 0" small dark>
          None
        </v-chip>
      </template>

      <template slot="header">
        <DomainSelector v-if="$store.getters['services/user/user'].role === 'admin'" v-model="queryDomain"></DomainSelector>
      </template>

    </APITable>
  </div>
</template>

<script>
import menu from "@/menu";

export default {
  name: 'SpecialEvents',
  data: () => {
    return {
      menu: null,
      queryDomain : null
    }
  },
  computed: {
    userDomain : function () {
      return this.$store.getters["services/user/user"].domain
    },
  },
  watch :{
    userDomain : {
      handler : function (){
        this.menu = menu.getItem("event").clone().headerSelect(this.userDomain.eventsList)
        this.menu.getHeader("domain").defaultAmount = this.userDomain.id
      },
    },
    queryDomain : function (){
      this.$nextTick(()=>{
        this.$refs.api.getData({"domain":this.queryDomain})
        this.$store.dispatch("items/update",{name: "domain"}).then(()=>{
          for (let domain of this.$store.getters["items/domain"]){
            if (domain.id === this.queryDomain){
              this.menu = menu.getItem("event").clone().headerSelect(domain.eventsList)
            }
          }
        })
      })
    }
  },
  mounted() {
    if(this.userDomain !== undefined){
      this.menu = menu.getItem("event").clone().headerSelect(this.userDomain.eventsList)
    }
  },
  methods: {
    createDataChange(data) {
      this.setHeaders(data)
    },
    updateDataChange(data) {
      this.setHeaders(data)
    },

    setHeaders(data){
      if (data.status === "open") {
        this.menu.getHeader("endTime").isHidden = true
        this.menu.getHeader("outageStartTime").isHidden = true
        this.menu.getHeader("outageEndTime").isHidden = true
        data.endTime = null
        data.outageStartTime = null
        data.outageEndTime = null
      } else {
        if (!this.menu.getHeader("startTime").isHidden){
          this.menu.getHeader("endTime").isHidden = false
          this.menu.getHeader("outageStartTime").isHidden = false
          this.menu.getHeader("outageEndTime").isHidden = false
        }

      }
    }
  }
}

</script>
