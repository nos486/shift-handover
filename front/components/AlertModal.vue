<template>
  <v-dialog v-model="modal" width="300">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot name="button"></slot>
      </div>
    </template>
    <v-card :disabled="loading">
      <div class="red">

        <v-card-title class="text-h5 white--text py-2">
          <v-icon right dark>{{ icon }}</v-icon>
          <div class="mt-1">
            {{ title }}
          </div>
        </v-card-title>
      </div>

      <v-card-text>
        <div class="mt-5">
          {{text}}
        </div>
      </v-card-text>

      <v-card-actions>
        <div class="mb-1">
          <v-btn color="error" @click="click" elevation="0" rounded :loading="loading">{{ okText }}</v-btn>
          <v-btn text color="success" @click="modal = false" rounded>Back</v-btn>
        </div>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
import Form from "./Form";
export default {
  name: "AlertModal",
  components: {Form},
  props: {
    title: {
      default: "Warning"
    },
    icon: {
      default: "mdi-delete"
    },
    text: {
      default: "Are you sure ?"
    },
    okText: {
      default: "Yes"
    },
    loading: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      modal: false,
    }
  },
  methods: {
    open: function (data=null) {
      this.modal = true
      this.data = data
    },
    close: function () {
      this.modal = false
    },
    click : function () {
      this.$emit('ok',this.data);
    }
  }
}
</script>

<style scoped>
</style>
