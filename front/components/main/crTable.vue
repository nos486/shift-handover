<template>
  <div>
    <APITable :menu="menu">


      <template slot="item.operatorName" slot-scope="{item}">
        <v-chip small :color="$store.getters['app/baseColor']" dark>
          {{ item.operatorName }}
        </v-chip>
      </template>

      <template slot="item.domainName" slot-scope="{item}">
        <v-chip small color="green" dark>
          {{ item.domainName }}
        </v-chip>
      </template>

      <template slot="item.status" slot-scope="{item}">
        <v-icon :color="item.status === 'complete' ? 'green' : 'red'" :title="item.status">
          {{item.status === 'open'? 'mdi-sync-circle' : ''}}
          {{item.status === 'cancel'? 'mdi-close-circle' : ''}}
          {{item.status === 'complete'? 'mdi-check-circle' : ''}}
        </v-icon>
      </template>

    </APITable>
  </div>
</template>

<script>
import menu from "@/menu";

export default {
  name: "CRTable",
  data: () => {
    return {
      menu: menu.getItem("cr"),
    }
  },
}
</script>

<style scoped>

</style>
