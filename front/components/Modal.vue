<template>
  <v-dialog v-model="modal" :width="wideWidth? 540:420" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot name="button"></slot>
      </div>
      <v-btn v-if="!$slots[ 'button' ]" fab dark :color="$store.getters['app/baseColor']" v-bind="attrs" v-on="on"
             :class="btnClass"
             elevation="0" :title="title" :small="smallBtn">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <Form :icon="icon" :title="title" has-action :loading="loading" :small="small" :overlay="overlay"
          :overlay-title="overlayTitle" :overlay-icon="overlayIcon"
          @overlayClick="()=>{$emit('overlayClick'); if(overlayClickClose) close()}">
      <slot v-bind:isShow="modal"></slot>
      <div v-if="hasAction" class="mb-n2">
        <v-btn text color="success" @click="$emit('save')" rounded :disabled="disableSave">{{ saveText }}</v-btn>
        <v-btn text color="error" @click="close" rounded>Cancel</v-btn>
      </div>
      <template slot="overlay">
        <slot name="overlay"></slot>
      </template>
    </Form>
  </v-dialog>
</template>

<script>
import Form from "./Form";
export default {
  name: "Modal",
  components: {Form},
  props: {
    value : {
      type: Boolean,
    },
    title: {
      default: "Card"
    },
    icon: {
      default: "mdi-login"
    },
    hasAction: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    },
    smallBtn: {
      type: Boolean,
      default: true
    },
    saveText: {
      default: "Save"
    },
    disableSave : {
      type: Boolean,
      default: false
    },
    btnClass: {
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    overlay: {
      type: Boolean,
      default: false
    },
    overlayClickClose: {
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
    wideWidth:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: this.value,
    }
  },
  watch: {
    value : function (value) {
      this.modal = value
    },
    modal: function () {
      if (this.modal) {
        this.$emit("show")
        this.$emit("input",true)
      } else {
        this.$emit("hide")
        this.$emit("input",false)
      }
    }
  },
  methods: {
    open: function () {
      this.modal = true
    },
    close: function () {
      this.modal = false
    }
  }
}
</script>

<style scoped>
</style>
