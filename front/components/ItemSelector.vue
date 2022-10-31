<template>
  <div class="d-flex">
    <v-select :items="typeof this.items === 'string' ? [...additionalItem,...$store.getters['items/'+items]] : this.items" v-model="selected"
              :item-value="typeof this.items === 'string' ? 'id' : 'value'"
              :item-text="itemKey!==undefined? itemKey : 'name'"
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
    <v-btn v-if="refreshBtn && !disabled && typeof this.items === 'string'" fab small class="ml-2" elevation="0"
           title="Update"
           :color="$store.getters['app/baseColor']"
           @click="updateIdValueList(items)" :loading="loading" dark>
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ItemSelector",
  props: {
    value: {
      default: null
    },
    itemKey: {
      default: "name"
    },
    IOKey: {
      default: null
    },
    items: {},
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
      selected: null,
      loading: false,
      searchText: ""
    }
  },
  watch: {
    isModalShow: function (val) {
      if (val) this.reset()
    },
    value: function (value) {
      this.selected = this.value
    },
    defaultQuery: {
      handler: function () {
        console.log("defaultQuery")
      },
      deep: true
    },
  },
  mounted() {
    if (typeof this.items === 'string') {
      this.updateIdValueList(this.items)
      this.selected = this.value
    } else {
      this.selected = this.value
    }
  },
  methods: {
    reset() {
      if (typeof this.items === 'string') {
        this.searchText = ""
        this.updateIdValueList(this.items)
        this.selected = this.value
      } else {
        this.selected = this.value
      }
    },
    preprocessValueData(value) {
      let temp = JSON.parse(JSON.stringify(value))
      let IOtoNative = function (item) {
        if (this.IOKey !== "id" && item[this.IOKey] !== undefined) {
          item["id"] = item[this.IOKey]
          delete item[this.IOKey]
        }
        if (this.IOName !== "name" && item[this.IOName] !== undefined) {
          item["name"] = item[this.IOName]
          delete item[this.IOName]
        }
      }.bind(this)
      if (this.multiple) {
        temp.forEach((item, index) => {
          IOtoNative(item)
        })
      } else {
        IOtoNative(temp)
      }
      this.selected = temp
    },
    afterProcessValueData(list) {
      let temp = JSON.parse(JSON.stringify(list))
      let array = []
      if (this.multiple) {
        temp.forEach((item) => {
          let json = {}
          json[this.IOKey] = item
          array.push(json)
        })
      } else {
        return (list)
      }
      return array
    },
    updateIdValueList(name) {
      this.loading = true
      let payload = {
        name: name,
        headerData : {...this.defaultQuery}
      }

      if (this.searchOn !== undefined && this.searchText !== '') {
        payload.headerData = {
          [this.searchOn]: this.searchText
        }
      }

      this.$store.dispatch("items/update", payload).then((res) => {
        this.loading = false
      }).then(() => {
        this.loading = false
      })
    },
    selectorChanged(selected) {
      if(this.IOKey !== null){
        this.$emit('input', selected[this.IOKey])
      }else {
        this.$emit('input', selected)
      }

    }
  }
}
</script>

<style scoped>
</style>
