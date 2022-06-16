<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app class="grey lighten-4">
      <MainNavigationList></MainNavigationList>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app elevation="0" class="grey lighten-2">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <!--      <v-btn icon @click.stop="miniVariant = !miniVariant">-->
      <!--        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>-->
      <!--      </v-btn>-->
      <v-toolbar-title v-text="titleGenerate()"/>
      <v-spacer/>
      <DomainChanger class="mr-3"></DomainChanger>
      <Profile></Profile>
    </v-app-bar>
    <Alert></Alert>
    <v-main>
      <v-container class="pa-0" style="height: 100%" fluid>
        <Nuxt/>
      </v-container>
    </v-main>
    <v-footer :absolute="false" app class="grey lighten-2">
      <div class="d-flex justify-center grey--text" style="width: 100%">
        <small>Shift Handover V0.1.0 by <a href="https://github.com/nos486">GeekBoy</a></small>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import Alert from "@/components/Alert";
import MainNavigationList from "@/components/MainNavigationList";

export default {
  name: 'DefaultLayout',
  components: {MainNavigationList, Alert},
  data() {
    return {
      clipped: true,
      drawer: true,
      miniVariant: false,
    }
  },
  methods : {
    titleGenerate(){
      let title = ""
      for ( let i of this.$nuxt.$route.name.split("-").lastItem.split(/(?=[A-Z])/)){
        if(title === ""){
          if (i.length <= 3){
            title += i.toUpperCase()
          }else {
            title += i.charAt(0).toUpperCase() + i.slice(1);
          }

        } else {
          title += " " + i.charAt(0).toUpperCase() + i.slice(1);
        }
      }
      return title
    }
  }
}
</script>
