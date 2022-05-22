export default function ({route,store,redirect}) {
  if (route.name !== "login") {
    if(store.getters["services/user/refreshToken"] === ""){
      store.commit("alert/warning", "You need login first.")
      return redirect('/login');
    }else {
      if(store.getters["services/user/user"].username === undefined){
        store.dispatch("services/user/profile").then((user)=>{
          store.commit("services/user/setUser",user)
          console.log("username set")
        })
      }
    }
  }
}
