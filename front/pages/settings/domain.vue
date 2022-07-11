<template>
  <div>
    <APITable :menu="menu">

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
