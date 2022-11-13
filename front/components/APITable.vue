<template>
  <Loading class="pa-5" :loading="loading">
    <div v-if="menu !== null" class="d-flex flex-column">

      <div class="d-flex justify-space-between">
        <ModalForm v-if="!readOnly" ref="addModal" class="mb-5" title="New" icon="mdi-plus" v-model="defaultData" :items="menu.headers"
                   @save="addNewItemToServer" @show="setDefaultData" :loading="loading">
        </ModalForm>
        <slot name="header"></slot>
      </div>
      <ModalForm ref="editModal" title="Update" icon="mdi-pencil" :items="menu.headers" @save="edit"
                 :loading="loading" v-model="editData" is-editable-form no-btn>
      </ModalForm>

      <AlertModal ref="alertModal" icon="mdi-delete" @ok="remove" :loading="loading">

      </AlertModal>

      <Table ref="table" :headers="menu.headers" :items="data" :loading="loading" :total="total"
             :filter-click="filterClick" @update="update">
        <template slot="actions" slot-scope="{item}">
          <v-btn v-if="menu.editable" icon @click="showEditModal(item)" color="green">
            <v-icon small>mdi-pencil</v-icon>
          </v-btn>
          <v-btn v-if="menu.removable" icon color="red" @click="showAlertModal(item)">
            <v-icon small class="align-self-center">mdi-delete</v-icon>
          </v-btn>
        </template>

        <template v-for="row in menu.headers" :slot="'item.'+row.slot" slot-scope="{ item }">
          <slot :name="'item.'+row.slot" v-bind:item="item"></slot>
        </template>

      </Table>
    </div>
  </Loading>
</template>

<script>

import Vue from "vue";

export default {
  name: "APITable",
  props: {
    menu: {
      default: () => {
        return []
      },
    },
    createData : {
      default: ()=>{
        return {}
      }
    },
    updateData :{
      default: ()=>{
        return {}
      }
    },
    getDataExtraHeaders : {
      default: ()=>{
        return {}
      }
    },
    readOnly : {
      default : false
    },
    autoUpdate : {
      type : Number,
      default : 0
    }
  },
  data: () => {
    return {
      loading: false,
      data: [],
      defaultData: {},
      editData: {},
      total: 0,
    }
  },
  watch: {
    defaultData : {
      handler: function () {
        this.$emit("createDataChange", this.defaultData)
      },
      deep: true
    },
    editData : {
      handler: function () {
        this.$emit("updateDataChange", this.editData)
      },
      deep: true
    }
  },
  mounted() {
    if(this.autoUpdate > 0){
      this.interval = setInterval(this.update,this.autoUpdate*1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    getData(headers = {}) {
      this.loading = true
      this.$store.dispatch("services/global/get", {
        pathName: this.menu.value,
        header: {
          ...headers,
          ...this.getDataExtraHeaders
        }
      }).then((res) => {
        this.data = res.result
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    update(options = null) {
      this.loading = true

      let data = {...(options === null) ? this.$refs.table.getOptions() : options}

      if (data.sortBy.length === 0) {
        delete data["sortBy"]
      }

      if (data.sortDesc.length === 0) {
        delete data["sortDesc"]
      }
      this.getData(data)
    },
    setDefaultData: function () {
      if (Object.entries(this.defaultData).length === 0) {
        this.defaultData = {}
        for (let header of this.menu.headers) {
          if (!header.isHidden && !header.isReadOnly) this.defaultData[header.value] = ""
          if (header.type === "select") this.defaultData[header.value] = null
          if (header.defaultAmount !== undefined) this.defaultData[header.value] = header.defaultAmount
        }
        this.defaultData = JSON.parse(JSON.stringify(this.defaultData))
      }
    },
    beforeAddToServer(data) {
      for (const [key, value] of Object.entries(data)) {
        // if (value === "" || value === null) delete data[key]
      }
    },
    addNewItemToServer() {
      this.loading = true
      this.beforeAddToServer(this.defaultData)
      this.$store.dispatch("services/global/post", {
        pathName: this.menu.value,
        ...this.defaultData
      }).then((res) => {
        console.log(res)
        this.loading = false
        this.$refs.addModal.close()
        this.$store.commit("alert/success", "Added")
        this.defaultData = JSON.parse(JSON.stringify({})) // clear
        this.update()
      }).catch(() => {
        this.loading = false
      })
    },
    showEditModal: async function (item) {
      let editData = {}
      for (let header of this.menu.headers) {
        console.log(header)
        if (header.defaultAmount !== undefined) editData[header.value] = header.defaultAmount
        if ((!header.isReadOnly)) editData[header.value] = item[header.value]
        // if( header.IOKey !== undefined) editData[header.value] = item[header.value][header.IOKey]
        // if( header.IOKey !== undefined) console.log("here",item[header.value][header.IOKey])
        if (header.value === "id") editData._id = item["id"]
        // if (header.isMultiple) {
        //   let list = []
        //   for(let selectedItem of item[header.value]){
        //     console.log(selectedItem)
        //     list.push(selectedItem.id)
        //   }
        //   editData[header.value] = list
        // }
      }
      this.editData = JSON.parse(JSON.stringify(editData))
      this.$refs.editModal.open()
    },
    showAlertModal: function (item) {
      this.$refs.alertModal.open(item)
    },
    filterClick(data) {
      console.log("filterClick", data)
    },
    edit() {
      this.loading = true
      // this.beforeAddToServer(this.editData)
      this.$store.dispatch("services/global/put", {
        pathName: this.menu.value,
        ...this.editData
      }).then((res) => {
        this.loading = false
        this.$store.commit("alert/success", "Record update.")
        this.$refs.editModal.close()
        this.update()
      }).catch(() => {
        this.loading = false
      })
    },
    remove(data) {
      console.log(data)
      this.loading = true
      this.$store.dispatch("services/global/delete", {
        pathName: this.menu.value,
        _ids: [data.id]
      }).then((res) => {
        this.loading = false
        this.$refs.alertModal.close()
        this.$store.commit("alert/success", "Removed")
        this.update()
      }).catch(() => {
        this.loading = false
      })
    },

  }
}
</script>

<style scoped>

</style>
