<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <Modal v-model="isModalShow" :title="title" :icon="icon" :save-text="isEditableForm ? 'Save' : 'Add'"
           @save="save" :loading="loading" @show="modalShow" :disable-save="invalid">
      <template v-if="isEditableForm" slot="button">
        <div></div>
      </template>

      <v-form ref="formNew" @submit.prevent class="mb-5">
<!--        <div v-for="item in items" :key="item.id">-->
<!--          {{(isEditableForm && item.isUpdateOnly)}},{{!(item.isHidden && !item.isCreateOnly)}},{{!item.isReadOnly}}-->
<!--        </div>-->
        <div v-for="item in items" :key="item.value" class="mb-3"
             v-if="!item.vif && (!(!isEditableForm && !item.isUpdateOnly) || !(item.isHidden && !item.isCreateOnly)) && !item.isReadOnly && !item.isHidden">
          <div v-if="item.type === Boolean" class="d-flex justify-space-between rounded-pill pa-2 div-hover">
            <div class="align-self-center grey--text text--darken-2 mr-4" style="font-size: 16px">{{ item.text }}</div>
            <v-switch v-model="form[item.value]" hide-details dense class="ma-0"
                      :color="$store.getters['app/baseColor']" :disabled="item.isReadOnly"></v-switch>
          </div>

          <DateSelector v-if="item.type === Date || item.type === 'DateTime'" v-model="form[item.value]" :title="item.text"
                        :is-modal-show="isModalShow" :disabled="item.isReadOnly" :is-date-time="item.type === 'DateTime'">
          </DateSelector>

          <ItemSelector v-if="item.type === 'select'" v-model="form[item.value]"
                        :items="item.items" :title="item.text" :multiple="item.isMultiple" :disabled="item.isReadOnly"
                        :is-modal-show="isModalShow" :itemKey="item.itemKey" :search-on="item.searchOn">
          </ItemSelector>

          <ValidationProvider v-if="item.type === 'textarea'" :rules="item.rules" v-slot="{ errors }"
                              :name="item.text">
            <v-textarea v-model="form[item.value]" auto-grow rows="2" row-height="35"
                        :error-messages="errors" :hide-details="errors.length === 0"
                        :color="$store.getters['app/baseColor']"
                        filled dense rounded :disabled="item.isReadOnly">
              <template slot="prepend-inner">
                <div class="d-flex align-center" style="height: 24px">
                  <div v-if="item.text.length < 11" class="grey--text text--darken-2 mr-2 text-no-wrap">
                    {{ item.text }}
                  </div>
                  <div v-else class="grey--text text--darken-2 mr-2">
                    <small>{{ item.text }}</small>
                  </div>
                </div>
              </template>
            </v-textarea>
          </ValidationProvider>

          <ValidationProvider v-if="item.type === undefined || item.type === Number" :rules="item.rules"
                              v-slot="{ errors }" :name="item.text">
            <v-text-field v-model="form[item.value]"
                          :error-messages="errors" :hide-details="errors.length === 0"
                          :color="$store.getters['app/baseColor']"
                          filled dense rounded single-line :disabled="item.isReadOnly">
              <template slot="prepend-inner">
                <div class="d-flex align-center" style="height: 24px">
                  <div v-if="item.text.length < 11" class="grey--text text--darken-2 mr-2 text-no-wrap">
                    {{ item.text }}
                  </div>
                  <div v-else class="grey--text text--darken-2 mr-2">
                    <small>{{ item.text }}</small>
                  </div>
                </div>
              </template>
            </v-text-field>
          </ValidationProvider>


        </div>
      </v-form>
    </Modal>
  </validation-observer>

</template>

<script>

import {ValidationObserver, ValidationProvider} from 'vee-validate'

export default {
  name: "ModalForm",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {
    value: {
      type: Object,
    },
    title: {
      default: "Card"
    },
    icon: {
      default: "mdi-login"
    },
    items: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false
    },
    isEditableForm: {
      type: Boolean,
      default: false
    },
  },
  data: () => {
    return {
      isValid: false,
      isModalShow: false,
      validationObserver: {},
      form: {},
    }
  },
  watch: {
    value: {
      deep :true,
      handler(newVal, oldVal) {
        if (this.value != null) {
          this.form = this.value
        }
      },
    },
    form: {
      handler: function () {
        this.$emit("input", this.form)
      },
      deep: true
    },

  },
  mounted() {
    if (this.value != null) this.form = this.value
  },
  methods: {
    open(value) {
      this.isModalShow = true
      if (this.value != null) {
              this.form = this.value
            }
    },
    close() {
      this.isModalShow = false
    },
    validate() {
      this.$refs.observer.validateWithInfo().then((x) => {
        return x.isValid
      })
    },
    modalShow() {
      this.$nextTick(() => {
        this.$refs.observer.reset()
      })
      this.$emit("show")
    },
    save() {
      this.$emit("save")
    }
  }
}
</script>

<style>
.rtl .v-input__control > .v-input__slot > .v-text-field__slot > input {
  direction: rtl;
}
.ltr .v-input__control > .v-input__slot > .v-text-field__slot > input {
  direction: ltr;
}
</style>
