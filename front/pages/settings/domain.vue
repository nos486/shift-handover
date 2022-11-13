<template>
  <div>
    <APITable :menu="menu">
      <template slot="item.eventsList" slot-scope="{item}">
        <v-chip v-for="event in item.eventsList" class="ma-1" :key="event" small :color="$store.getters['app/baseColor']" dark>
          {{event}}
        </v-chip>
      </template>
    </APITable>
  </div>
</template>

<script>
import menu from "@/menu";

export default {
  name: "Domain",
  data : ()=>{
    return {
      menu: menu.getItem("settings").getItem("domain"),
    }
  },
}
</script>

<style scoped>

</style>
