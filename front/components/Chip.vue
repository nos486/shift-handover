<template>

  <div class="d-flex align-center">
    <v-icon :color="color" size="46">{{icon}}</v-icon>
    <div class="d-flex flex-column grey--text ml-2">
      <H2 class="mt-n1">{{title}}</H2>
      <div v-if="text !== ''" class="mt-n2">{{text}}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props :{
    color:{
      default : "blue"
    },
    large :{
      default : true
    },
    dark :{
      default : true
    },
    icon :{
      default : "mdi-clipboard-text-clock"
    },
    title :{
      default : "chip"
    },
    text :{
      default : ""
    }
  },
  name: "Chip"
}
</script>

<style scoped>

</style>
