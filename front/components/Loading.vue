<template>
  <div style="position: relative">
    <div v-if="loading" class="d-flex align-center justify-center" style="width: 100%;height: 100%;position: absolute;z-index: 1000" >
      <v-progress-circular indeterminate :color="$store.getters['app/baseColor']" size="80"></v-progress-circular>
    </div>
    <div style="width: 100%;height: 100%" :style="{'padding': padding}">
      <slot></slot>
    </div>
  </div>


</template>

<script>
export default {
  name: "Loading",
  props :{
    loading :{
      default: true
    },
    padding : {
      default : "0px"
    }
  }
}
</script>

<style scoped>

</style>
