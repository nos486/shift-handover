<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <div class="d-flex align-center">
          <div class="text-uppercase mr-1 grey--text text--darken-3">{{$store.getters["services/user/user"].username}}</div>
          <v-btn :color="$store.getters['app/baseColor']" dark v-bind="attrs" v-on="on" icon >
            <v-icon :color="$store.getters['app/baseColor']">mdi-account-circle</v-icon>
          </v-btn>
        </div>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" :disabled="item.isDisable" @click="item.click !== undefined ? item.click() : ()=>{}">
          <v-list-item-action>
            <v-icon :color="$store.getters['app/baseColor']">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data : ()=>{
    return {
      items : []
    }
  },
  mounted() {
    this.items = [
      {
        icon: 'mdi-account-cog',
        title: 'User Settings',
        isDisable : true
      },
      {
        icon: 'mdi-logout',
        title: 'Logout',
        isDisable : false,
        click : this.logout
      },
    ]
  },
  methods : {
    logout() {
      this.$store.commit("services/user/setJwtToken","")
      this.$store.commit("services/user/setRefreshToken","")
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>

</style>
