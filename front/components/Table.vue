<template>
  <div>
    <v-data-table
      :headers="processedHeader"
      :items="items"
      :checkbox-color="$store.getters['app/baseColor']"
      :server-items-length="total"
      :options.sync="options"
    >
      <template v-for="header in headers" :slot="`header.${header.value}`" slot-scope="{attributes}">
        <div class="d-flex align-center">
          <v-edit-dialog ref="editDialog" v-if="header.isFilterable" @save="filterSave" @open="filterOpen" @close="filterClose">
            <v-icon small title="Filter"
                    :color="(oldFilterData[header.value] !== undefined && oldFilterData[header.value] !== '')? 'red' : ''">
              mdi-filter
            </v-icon>

            <template v-slot:input>
              <Form icon="mdi-filter-plus" :title="'Filter ' + header.text" small hide-loading>
                <template v-if="oldFilterData[header.value] !== undefined && oldFilterData[header.value] !== ''" slot="bar">
                  <v-btn class="lighten-1 my-n2" dark small rounded text
                         title="Remove Filter" color="red" @click="clearFilter(header.value)" elevation="0">
                    <div>Remove Filter</div>
                    <v-icon small right>mdi-filter-off</v-icon>
                  </v-btn>
                </template>
                <div class="d-flex justify-space-between justify-center" style="width: 300px">
                  <v-text-field v-model="filterData[header.value]" :placeholder="header.text" filled dense rounded
                                persistent-placeholder append-icon="mdi-check" @click:append="filterSave"
                                :color="$store.getters['app/baseColor']" hide-details></v-text-field>
                </div>
              </Form>
            </template>
          </v-edit-dialog>

          <div class="mr-1 d-flex flex-column" v-if="header.text">
            <div>
              {{ header.text }}
            </div>
            <small v-if="oldFilterData[header.value] !== undefined && oldFilterData[header.value] !== ''" class="mt-n1">
              {{ oldFilterData[header.value] }}
            </small>
          </div>
        </div>
      </template>

      <template v-for="row in headers" :slot="'item.'+row.slot" slot-scope="{ item }">
        <div v-if="row.type === Boolean">
          <v-icon v-if="item[row.slot]" color="success">mdi-check-bold</v-icon>
          <v-icon v-else color="error">mdi-close-thick</v-icon>
        </div>
        <div v-if="row.type === 'second'" class="d-flex align-center">
          <v-icon small class="mr-1">mdi-clock</v-icon>
          {{secondToString(item[row.slot])}}
        </div>
        <div v-if="row.type === Date && item[row.slot]!== undefined && item[row.slot]!== null" :set="date = new Date(item[row.slot])"
             class="d-flex flex-column align-start">
          <div class="d-flex align-center justify-center">
            <!--          <v-icon small :color="$store.getters['app/baseColor']">mdi-calendar</v-icon>-->
            {{ date.toLocaleString().split(",")[0] }}
          </div>

          <div class="d-flex align-center justify-center text-no-wrap">
            <!--          <v-icon small :color="$store.getters['app/baseColor']">mdi-clock</v-icon>-->
            {{ date.toLocaleString().split(",")[1] }}
          </div>
        </div>
        <slot :name="'item.'+row.slot" v-bind:item="item"></slot>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="text-no-wrap">
          <slot name="actions" v-bind:item="item"></slot>
        </div>
      </template>

    </v-data-table>
  </div>

</template>

<script>
import Form from "@/components/Form";
export default {
  name: "Table",
  components: {Form},
  props :{
    headers : {
      default : ()=>{
        return []
      }
    },
    items : {
      type: Array,
      default : ()=>{
        return []
      }
    },
    loading : {
      default: false
    },
    filterClick: {
      type: Function,
      default: null
    },
    update: {
      type: Function
    },
    total: {
      type: Number,
      default: -1
    }
  },
  data : ()=>{
    return {
      processedHeader : [],
      processedItems : [],
      filterData: {},
      oldFilterData: {},
      options: {},
    }
  },
  watch: {
    options: {
      handler() {
        this.$emit("update",this.options)
      },
      deep: true,
    },
  },
  mounted() {
    this.processHeader()
  },
  methods :{
    processHeader(){
      this.headers.forEach((header) => {
        if (!header.isHidden && !header.isCreateOnly) this.processedHeader.push(header)
      })
      this.processedHeader.push({text: 'Actions', value: 'actions', sortable: false})
    },
    processItems(){
      this.processedItems = this.items
    },
    filterSave: function (value) {
      this.filterClick(this.filterData)
      this.oldFilterData = {...this.filterData}
      this.$refs['editDialog'].forEach((dialog) => {
        dialog.cancel()
      })
    },
    filterOpen: function (value) {
    },
    filterClose: function (value) {
      this.filterData = {...this.oldFilterData}
    },
    clearFilter: function (value) {
      delete this.filterData[value];
      this.filterSave();
      this.$refs['editDialog'].forEach((dialog) => {
        dialog.cancel()
      })
    },
    secondToString(value){
      if(value < 60){
        return `${value}s`
      }else {
        if(value < 60*60){
          return `${(value/60).toFixed(0)}m`
        }else {
          if(value < 60*60*60){
            return `${(value/(60*60)).toFixed(0)}h`
          }else {
            return `${(value/(60*60*24)).toFixed(0)}d`
          }
        }
      }
    },
    getOptions(){
      return this.options
    }
  }
}
</script>

<style>
.v-small-dialog__content {
  padding: 0 !important;
}

.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
  box-shadow: inset 0px 0px
}
</style>
