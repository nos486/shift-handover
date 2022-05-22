<template>
  <div class="d-flex flex-column">
    <APITable :menu="menu" @createDataChange="createDataChange" @updateDataChange="updateDataChange">
      <template slot="item.title" slot-scope="{item}">
        <div class="d-flex align-center">
          <div>
            <v-icon v-if="item.severity === 'critical'" color="red">mdi-alert-circle</v-icon>
            <v-icon v-if="item.severity === 'major'" color="orange">mdi-alert-circle</v-icon>
            <v-icon v-if="item.severity === 'miner'" color="yellow" class="text--accent-4">mdi-alert-circle</v-icon>
            <v-icon v-if="item.severity === 'none'" >mdi-alert-circle</v-icon>
          </div>
          <div class="ml-2">
            {{item.title}}
          </div>
        </div>

      </template>

      <template slot="item.domainName" slot-scope="{item}">
        <v-chip small color="orange" dark>
          {{item.domainName}}
        </v-chip>
      </template>

      <template slot="item.status" slot-scope="{item}">
          <v-icon :color="item.status === 'close' ? 'green' : 'red'" :title="item.status">
            {{item.status === 'close'? 'mdi-check-circle' : 'mdi-alert-circle'}}
          </v-icon>
      </template>

      <template slot="item.affectedDomainsNames" slot-scope="{item}">

        <v-chip v-for="domain in item.affectedDomainsNames" :key="domain" small :color="$store.getters['app/baseColor']" dark style="margin: 2px">
          {{domain}}
        </v-chip>
        <v-chip v-if="item.affectedDomainsNames.length === 0" small dark>
          None
        </v-chip>
      </template>

      <template slot="item.affectedServicesNames" slot-scope="{item}">

        <v-chip v-for="service in item.affectedServicesNames" :key="service" small :color="$store.getters['app/baseColor']" dark style="margin: 2px">
          {{service}}
        </v-chip>
        <v-chip v-if="item.affectedServicesNames.length === 0" small dark>
          None
        </v-chip>
      </template>

    </APITable>
  </div>
</template>

<script>
import menu from "@/menu";
export default {
  name: 'SpecialEvents',
  data : ()=>{
    return {
      menu: menu.getItem("event").clone(),
    }
  },
  computed : {
  },
  mounted() {
    this.menu.getHeader("domain").defaultAmount = this.$store.getters["services/user/user"].domain
  },
  methods :{
    createDataChange(data){
      if(data.status === "open"){
        this.menu.getHeader("endTime").isHidden = true
        this.menu.getHeader("outageStartTime").isHidden = true
        this.menu.getHeader("outageEndTime").isHidden = true
        data.endTime = null
        data.outageStartTime = null
        data.outageEndTime = null
      }else {
        this.menu.getHeader("endTime").isHidden = false
        this.menu.getHeader("outageStartTime").isHidden = false
        this.menu.getHeader("outageEndTime").isHidden = false
      }
    },
    updateDataChange(data){
      if(data.status === "open"){
        this.menu.getHeader("endTime").isHidden = true
        this.menu.getHeader("outageStartTime").isHidden = true
        this.menu.getHeader("outageEndTime").isHidden = true
        data.endTime = null
        data.outageStartTime = null
        data.outageEndTime = null
      }else {
        this.menu.getHeader("endTime").isHidden = false
        this.menu.getHeader("outageStartTime").isHidden = false
        this.menu.getHeader("outageEndTime").isHidden = false
      }
    }
  }
}

</script>
