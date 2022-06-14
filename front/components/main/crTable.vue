<template>
  <div>
    <APITable ref="api" :menu="menu" :get-data-extra-headers="(allDomains) ? query : $store.getters['services/user/domain'] !== '' ? {'domain':$store.getters['services/user/domain']} :{'selfDomain':true}" :read-only="readOnly">
      <template slot="item.operatorName" slot-scope="{item}">
        <v-chip small :color="$store.getters['app/baseColor']" dark>
          {{ item.operatorName }}
        </v-chip>
      </template>

      <template slot="item.reporter" slot-scope="{item}">
        <v-chip v-if="item.reporter != null" small color="green" dark>
          {{ item.reporter.username }}
        </v-chip>
      </template>

      <template slot="item.domain" slot-scope="{item}">
        <v-chip small color="blue" dark>
          {{ item.domain.name }}
        </v-chip>
      </template>

      <template slot="item.outage" slot-scope="{item}">
        {{$secondToString((new Date(item.outageEndTime) - new Date(item.outageStartTime))/1000)}}
      </template>

      <template slot="item.status" slot-scope="{item}">
        <v-icon :color="item.status === 'complete' ? 'green' : 'red'" :title="item.status">
          {{ item.status === 'ongoing' ? 'mdi-sync-circle' : '' }}
          {{ item.status === 'open' ? 'mdi-sync-circle' : '' }}
          {{ item.status === 'cancel' ? 'mdi-close-circle' : '' }}
          {{ item.status === 'complete' ? 'mdi-check-circle' : '' }}
        </v-icon>
      </template>

    </APITable>
  </div>
</template>

<script>
import menu from "@/menu";

export default {
  name: "CRTable",
  props: {
    allDomains: {
      type : Boolean,
      default: false
    },
    query : {
      default: ()=>{
        return {}
      }
    },
    readOnly :{
      default : false
    }
  },
  data: () => {
    return {
      menu: menu.getItem("cr"),
    }
  },
  computed : {
    domain : function (){
      return this.$store.getters['services/user/domain']
    }
  },
  watch : {
    domain : function (){
      this.$nextTick(()=>{
        this.$refs.api.getData({})
      })
    }
  }
}
</script>

<style scoped>

</style>
