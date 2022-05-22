export default function ({store}) {
  if (process.browser) {
    if (localStorage.getItem("baseColor") !== null) {
      store.commit("app/setBaseColor", localStorage.getItem("baseColor"))
    } else {
      store.commit("app/setBaseColor", "cyan")
    }

    if (localStorage.getItem("jwtToken") !== null) {
      store.commit("services/user/setJwtToken", localStorage.getItem("jwtToken"))
    }

    if (localStorage.getItem("refreshToken") !== null) {
      store.commit("services/user/setRefreshToken", localStorage.getItem("refreshToken"))
    }
  }
}
