<template>
  <div>
    <APITable :menu="menu">
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


      <template slot="item.operatorName" slot-scope="{item}">
        <v-chip small :color="$store.getters['app/baseColor']" dark>
          {{ item.operatorName }}
        </v-chip>
      </template>

      <template slot="item.domainName" slot-scope="{item}">
        <v-chip small color="green" dark>
          {{ item.domainName }}
        </v-chip>

      </template>
    </APITable>
  </div>
</template>

<script>
import menu from "@/menu";

export default {
  name: "ShiftCheck",
  data: () => {
    return {
      menu: menu.getItem("shift"),
    }
  },
}
</script>

<style scoped>

</style>
