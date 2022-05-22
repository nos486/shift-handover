<template>
  <div class="pa-3" style="position: absolute;z-index: 1000;right: 6px">
    <transition v-for="(alert,key) in alertList" :key="key" name="fade" mode="out-in" >
      <v-alert :type="alert.type" v-show="true" min-width="300px" border="bottom">
        {{ alert.message }}
      </v-alert>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Alert",
  data () {
    return {}
  },
  computed : {
    alertList(){
      return this.$store.getters["alert/alertList"]
    }
  },
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
