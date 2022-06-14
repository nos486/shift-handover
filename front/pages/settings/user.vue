<template>
  <div>
    <APITable :menu="menu">
      <template slot="item.domain" slot-scope="{item}">
        {{ item.domain.name }}
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
      menu: menu.getItem("settings").getItem("user"),
    }
  },
}
</script>

<style scoped>

</style>
