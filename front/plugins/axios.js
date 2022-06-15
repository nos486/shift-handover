import appConfig from "../config";

export default function ({$axios, store, route, app}) {
  // $axios.defaults.withCredentials = true;
  $axios.interceptors.request.use((config) => {
    // config.baseURL = appConfig.apiUrl
    config.baseURL = appConfig.apiUrl
    if (store.getters["services/user/jwtToken"] !== "") {
      config.headers["Authorization"] = `Bearer ${store.getters["services/user/jwtToken"]}`
    }
    return config
  })

  $axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if ((error.request.config === undefined || error.request.config.alert) && error.response && error.response.data) {
      if (error.response.status === 401) {
        app.router.push("/login")
      } else {
        if (error.config.alert !== false || error.config.alert === undefined) {
          store.commit("alert/error", error.response.data.message)
        }
        return Promise.reject(error.response.data);
      }
    }
    return Promise.reject(error);
  })
}
