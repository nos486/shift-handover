<template>
  <div class="d-flex justify-center" style="height: 100%">
    <Form title="Authenticate" icon="mdi-login" class="align-self-center" width="360px" :loading="loading" elevation="0" outlined>
      <div>
        {{$store.getters["services/user/refreshToken"]}}
        <v-text-field v-model="username" label="Username"
                      :color="$store.getters['app/baseColor']" append-icon="mdi-account"
                      autocomplete="phone">
        </v-text-field>
        <v-text-field v-model="password" label="Password" type="password"
                      :color="$store.getters['app/baseColor']" @keydown.enter="login" append-icon="mdi-key"
                      autocomplete="phone">
        </v-text-field>

        <v-btn class="mt-2" elevation="0" :color="$store.getters['app/baseColor']" dark block @click="login">Login</v-btn>
      </div>
    </Form>
  </div>
</template>

<script>
import Form from "@/components/Form";
export default {
  name: 'Login',
  components: {Form},
  data: () => {
    return {
      loading : false,
      username : "",
      password : ""
    }
  },
  mounted() {
    if(this.$store.getters["services/user/refreshToken"] !== ""){
      this.loading = true
      this.$store.dispatch("services/user/refreshToken",{
        "token": this.$store.getters["services/user/refreshToken"]
      }).then((res)=>{
        this.$store.commit("services/user/setJwtToken",res.jwtToken)
        this.$store.commit("services/user/setRefreshToken",res.refreshToken)
        this.loading = false
        this.isLogin = true
        this.$router.push("/main")
      }).catch((res)=>{
        this.$store.commit("services/user/setRefreshToken","")
        this.$store.commit("services/user/setJwtToken","")
        this.loading = false
        this.isLogin = false
      })
    }
  },
  methods : {
    login(){
      this.$store.dispatch("services/user/login",{
        "username" : this.username,
        "password" : this.password
      }).then((res)=>{
        this.$store.commit("services/user/setJwtToken",res.jwtToken)
        this.$store.commit("services/user/setRefreshToken",res.refreshToken)
        this.$store.commit("services/user/setUser",res)
        this.$router.push("/main")
      })

    }
  }
}
</script>
