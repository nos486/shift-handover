<template>
  <div class="d-flex">
    <v-select :items="items" v-model="selected"
              :item-value="itemKey"
              :item-text="itemValue"
              :color="$store.getters['app/baseColor']" :item-color="$store.getters['app/baseColor']"
              filled dense rounded single-line :deletable-chips="multiple" hide-details @change="selectorChanged"
              :disabled="loading || disabled" :multiple="multiple" light :small-chips="multiple"
              :style="small ? 'width: 130px' : ''">
      <template v-if="searchOn !== undefined" slot="prepend-item">
        <div class="d-flex pa-2">
          <v-text-field v-model="searchText" hide-details :color="$store.getters['app/baseColor']" filled rounded dense
                        single-line></v-text-field>
          <v-btn fab small class="ml-2" elevation="0" title="Update"
                 :color="$store.getters['app/baseColor']"
                 @click="updateIdValueList(name)" :loading="loading" dark>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </div>
      </template>
      <template v-if="!small" slot="prepend-inner">
        <div class="d-flex align-center" style="height: 24px">
          <div v-if="title.length < 11" class="grey--text text--darken-2 mr-4 text-no-wrap">
            {{ title }}
          </div>
          <div v-else class="grey--text text--darken-2 mr-4">
            <small>{{ title }}</small>
          </div>
        </div>
      </template>
    </v-select>
    <v-btn v-if="refreshBtn && !disabled" fab small class="ml-2" elevation="0"
           title="Update" :color="$store.getters['app/baseColor']"
           @click="updateIdValueList(itemsName)" :loading="loading" dark>
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ItemSelector",
  props: {
    value: {
      default: () => {
        return []
      }
    },
    itemKey: {
      default: "id"
    },
    itemValue: {
      default: "name"
    },
    itemsName: {
      type: String
    },
    title: {
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isModalShow: {
      type: Boolean,
      default: false
    },
    refreshBtn: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    },
    searchOn: {
      type: String
    },
    defaultQuery: {
      default: () => {
        return {}
      }
    },
    additionalItem: {
      default: () => {
        return []
      }
    }
  },
  data: () => {
    return {
      // {name : "Ongoing",id: "ongoing"},
      items: [],
      selected: [],
      loading: false,
      searchText: ""
    }
  },
  watch: {
    isModalShow: {
      handler: function (val) {
        if (val) this.reset()
      },
      immediate: true
    },
    value: {
      handler: function () {
        console.log(this.value)
        // this.preprocessValueData()
      },
      immediate: true,
      deep: true
    }
    //   function (x,y) {
    //   if (this.multiple) {
    //     if(this.value[0] != undefined){
    //       console.log("f",this.value)
    //       this.preprocessValueData()
    //     }
    //   }else {
    //     if(this.value !== undefined) this.preprocessValueData()
    //   }
    // }
  },
  mounted() {
    this.preprocessValueData()
    this.updateIdValueList(this.itemsName)
  },
  methods: {
    reset() {
      this.searchText = ""
      this.preprocessValueData()
      this.updateIdValueList(this.itemsName)
    },
    preprocessValueData() {
      if (this.multiple) {
        this.selected = []
        if (this.value.length > 0 && typeof this.value[0] === 'object') {
          for (let value of this.value) {
            this.selected.push(value[this.itemKey])
          }
        }else {
          this.selected = this.value
        }
      } else {
        if (typeof this.value === 'object') {
          this.selected = this.value[this.itemKey]
        }else {
          this.selected = this.value
        }
      }
      if (this.selected !== this.value) this.selectorChanged(this.selected)
    },
    updateIdValueList(name) {
      this.loading = true
      let payload = {
        name: name,
        headerData: {...this.defaultQuery}
      }
      if (this.searchOn !== undefined && this.searchText !== '') {
        payload.headerData = {
          [this.searchOn]: this.searchText
        }
      }
      this.$store.dispatch("items/update", payload).then((res) => {
        this.loading = false
        this.items = []
        for (let item of res) {
          this.items.push({[this.itemKey]: item[this.itemKey], [this.itemValue]: item[this.itemValue]})
        }

      }).then(() => {
        this.loading = false
      })
    },
    selectorChanged(selected) {
      this.$emit('input', selected)
    }
  }
}
</script>

<style scoped>
</style>
