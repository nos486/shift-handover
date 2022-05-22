<template>
  <v-card class="overflow-hidden" :min-width="width" :elevation="elevation" :outlined="outlined"
          style="border-color: #EEEEEE" :disabled="loading" :tile="tile">

    <div class="d-flex justify-space-between align-center grey lighten-3" :class="{'px-6 py-4':!small,'px-4 py-3':small}">
      <v-icon v-if="$slots['bar'] !== undefined" class="ml-2" :small="small" :color="$store.getters['app/baseColor']">
        {{ icon }}
      </v-icon>
      <div v-if="!small" class="text-h6 mr-auto">{{ title }}</div>
      <div v-else class="mr-auto">{{ title }}</div>
      <div>
        <slot name="bar"></slot>
        <v-icon v-if="$slots['bar'] === undefined" :small="small" :color="$store.getters['app/baseColor']">{{icon }}</v-icon>
      </div>
    </div>
    <v-progress-linear :color="$store.getters['app/baseColor']" :active="loading||!hideLoading"
                       :indeterminate="loading"></v-progress-linear>

    <div v-if="!fill" :class="{'grey lighten-4 pa-3':background,'px-5 py-5 overflow-auto':!background}" >
      <slot></slot>
    </div>
    <div v-else class="py-5 overflow-auto" >
      <slot></slot>
    </div>


    <slot name="footer"></slot>

    <div v-if="overlay" class="ma-4" style="position: absolute; bottom: 0px;left: 0px">
      <v-btn elevation="0" rounded dark :color="$store.getters['app/baseColor']" @click="$emit('overlayClick')">
        <v-icon left>{{overlayIcon}}</v-icon>
        {{overlayTitle}}
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "Form",
  components: {},
  props: {
    title: {
      default: "Card"
    },
    icon: {
      default: "mdi-login"
    },
    width: {
      default: "300px"
    },
    maxWidth: {
      default: "300px"
    },
    outlined: {
      type: Boolean,
      default: false
    },
    tile: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    hideLoading: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    elevation: {
      type: String,
      default: "1"
    },
    background: {
      type: Boolean,
      default: false
    },
    fill: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: false
    },
    overlayTitle: {
      type: String,
      default: "overlay"
    },
    overlayIcon: {
      type: String,
      default: "mdi-plus"
    },
  }
}
</script>

<style scoped>
</style>
