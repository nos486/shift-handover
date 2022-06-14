<template>
  <div class="d-flex justify-space-between rounded-pill pa-2 div-hover custom-input" >
    <div class="align-self-center grey--text text--darken-2 ml-4 mr-2" style="font-size: 16px">{{ title }}</div>
    <div @click="openPicker" class="d-flex flex-fill align-center">
      <div v-if="date !== ''" class="ml-2 flex-fill text-left">
        {{ isDateTime ? date.toLocaleString() : date.toLocaleDateString() }}

      </div>
      <div v-else class="ml-2 flex-fill text-left grey--text">

      </div>
      <v-btn small icon color="red" class="mr-2" @click="clear" :disabled="disabled">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </div>

    <PersianDatePicker v-model="date" :color="$colorCode($store.getters['app/baseColor'])"
                       locale="en,fa"
                       :type="isDateTime ? 'datetime' : 'date'"
                       append-to="body"
                       custom-input="#my-custom-editable-input"
                       :show="show"
                       :format="isDateTime? 'YYYY/M/D HH:MM' : 'YYYY/M/D HH:MM'"
                       @close="show=false"
                       @change="dateChange"
                       timezone="+4:30"
                       style="position: absolute">

    </PersianDatePicker>
  </div>


</template>

<script>
export default {
  name: "DateSelector",
  props: {
    value: {
      default: "",
    },
    title: {
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isModalShow: {
      type: Boolean,
      default: false
    },
    isDateTime :{
      type: Boolean,
      default: false
    },
  },
  data: () => {
    return {
      show : false,
      date: "",
      menuDate: false,
    }
  },
  components: {
    PersianDatePicker: () => import('vue-persian-datetime-picker'),
  },
  mounted() {
    // this.set()
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal, oldVal) {
          this.set()
      },
    },
    isModalShow: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.set()
        }
      },
    },
    show: function (val) {
      if(this.value == null){
        this.date = new Date()
        this.$emit('input', this.date)
      }
    },
  },
  methods: {
    openPicker(){
      this.show=true
    },
    set: function () {
      this.date = ""
      if (this.value !== null) {
        this.date = new Date(this.value)
      }
    },
    resetDateToToday: function () {
      if (this.date === "") {
        this.date = new Date().toISOString().substr(0, 10)
        this.dateChange(this.date)
      }
    },
    clear: function (event) {
      event.stopPropagation();
      this.date = ""
      this.$emit('input', null)
    },
    dateChange: function (val) {
      console.log(this.date.toString())
      // this.$emit('input', new Date(this.date).toISOString())
      this.$emit('input', this.date)
    },
  }
}
</script>

<style>
/*.vpd-container > .vpd-content {*/
/*  font-family: Vazir*/
/*}*/
</style>
