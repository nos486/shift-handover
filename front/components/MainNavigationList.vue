<template>

  <v-list nav expand dense>
    <template v-for="item in headers.items">
      <v-list-item
        :key="item.value"
        v-if="item.items.length === 0 && !item.isHidden"
        :color="$store.getters['app/baseColor']"
        :to="item.to" link>
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        :key="item.value"
        :ref="'listGroup-'+item.value"
        :group="item.to"
        v-if="item.items.length !== 0 && !item.isHidden"
        :prepend-icon="item.icon"
        :color="$store.getters['app/baseColor']"
        no-action>

        <template slot="activator">
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </template>

        <template v-for="child in item.items">
          <v-list-item
            :key="child.value"
            v-if="child.items.length === 0 || Object.entries(child.items).every(x => x[1].to === undefined)"
            :ref="'child-'+child.value"
            :to="item.to+child.to"
            dense>

            <v-list-item-title>{{ child.title }}</v-list-item-title>
            <v-list-item-icon>
              <v-icon v-text="child.icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>

          <v-list-group
            v-if="child.items.length !== 0 && Object.entries(child.items).every(x => x[1].to !== undefined)"
            :ref="'childGroup-'+child.value"
            :group="child.to"
            :color="$store.getters['app/baseColor']"
            sub-group no-action>

            <template slot="activator">
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </template>

            <template v-for="(subChild, k) in child.items" >
              <v-list-item
                v-if="subChild.to !== undefined"
                :key="`subheader-${k}`"
                :ref="'child-'+subChild.value"
                :to="item.to + child.to + subChild.to"
                dense>

                <v-list-item-icon class="mr-n6">
                  <v-icon>mdi-circle-small</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ subChild.title }}</v-list-item-title>
              </v-list-item>

            </template>

          </v-list-group>
        </template>
      </v-list-group>
    </template>

  </v-list>
</template>

<script>
import headers from "../menu";

export default {
  name: "MainNavigationList",
  data() {
    return {
      headers: headers,
      option: {
        duration: 300,
        offset: 0,
        easing: 'easeInOutCubic',
      }
    }
  },
  computed: {
    // isMiniDrawer: function () {
    //   return this.$store.getters["pages/main/isMiniDrawer"]
    // }
  },
  watch: {
    // isMiniDrawer: function () {
    //   // for (let list of this.$refs.listGroup) {
    //   //   list.isActive = false
    //   // }
    // }
  },
  mounted() {
    let path = this.$route.path.split("/")
    path.shift()
    if (path.length > 1){
      let headerTemp = headers
      for (let index in path) {
        let t = headerTemp.getItem(path[index])
        if (t !== undefined) headerTemp = t
      }
      if (headerTemp !== undefined){
        // this.$nextTick(()=>{
        //   this.$refs[`child-${headerTemp.value}`][0].$el.scrollIntoView({ behavior: 'instant', block: 'center' }) //instant smooth
        // })
      }
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
