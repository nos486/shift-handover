<template>
  <div class="d-flex flex-column">
    {{data}}
  </div>
</template>

<script>
import menu from "@/menu";
export default {
  data : ()=>{
    return {
      menu: menu.getItem("event"),
      data : {}
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getData()
  },
  methods :{
    getData() {
      this.$store.dispatch("services/global/get",{
        pathName : this.menu.value,
        header : {
          _id : this.id
        }
      }).then((res)=>{
        this.data = res
      })
    }
  }
}

</script>
