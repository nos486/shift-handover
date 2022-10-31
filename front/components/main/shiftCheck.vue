<template>
  <div>
    <APITable ref="api" :menu="menu" :get-data-extra-headers="(allDomains) ? {} : $store.getters['services/user/queryDomain'] !== '' ? {'domain':$store.getters['services/user/queryDomain']} :{'selfDomain':true}">
      <template slot="item.date" slot-scope="{item}">
        {{ new Date(item.date).toDateString() }}
      </template>


      <template slot="item.isDay" slot-scope="{item}">
        <div v-if="item.isDay">
          <v-icon color="orange">mdi-white-balance-sunny</v-icon>
          Day
        </div>
        <div v-else>
          <v-icon color="black">mdi-moon-waning-crescent</v-icon>
          Night
        </div>
      </template>


      <template slot="item.operator" slot-scope="{item}">
        <v-chip small :color="$store.getters['app/baseColor']" dark>
          {{ item.operator.username }}
        </v-chip>
      </template>

      <template slot="item.domain" slot-scope="{item}">
        <v-chip small color="green" dark>
          {{ item.domain.name }}
        </v-chip>
      </template>

      <template slot="item.handoverTo" slot-scope="{item}">
        {{(item.handoverTo !== undefined) ? item.handoverTo.username : "-" }}
      </template>
    </APITable>
  </div>
</template>

<script>
import menu from "@/menu";

export default {
  name: "ShiftCheck",
  props: {
    allDomains: {
      type : Boolean,
      default: false
    }
  },
  data: () => {
    return {
      menu: menu.getItem("shift"),
    }
  },
  computed : {
    domain : function (){
      return this.$store.getters['services/user/queryDomain']
    }
  },
  watch : {
    domain : function (){
      this.$nextTick(()=>{
        this.$refs.api.getData()
      })
    }
  }
}
</script>

<style scoped>

</style>
