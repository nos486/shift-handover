<template>
  <div>
    <APITable :menu="menu"></APITable>
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
