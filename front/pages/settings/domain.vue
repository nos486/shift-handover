<template>
  <div>
    <APITable :menu="menu">
      <template slot="item.manager" slot-scope="{item}">
        {{ (item.manager !== null) ? item.manager.username : "-" }}
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
