<template>
  <div>
    <APITable :menu="menu">
      <template slot="item.domainName" slot-scope="{item}">
        <v-chip small :color="$store.getters['app/baseColor']" dark >
          {{item.domainName}}
        </v-chip>

      </template>
    </APITable>
  </div>
</template>

<script>
import menu from "@/menu";

export default {
  name: "Service",
  data : ()=>{
    return {
      menu: menu.getItem("settings").getItem("service"),
    }
  },
}
</script>

<style scoped>

</style>
