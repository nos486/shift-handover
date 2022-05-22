export const state = () => ({
  user: {},
  jwtToken: "",
  refreshToken: "",
});

export const getters = {
  user: state => {
    return state.user
  },
  jwtToken: state => {
    return state.jwtToken
  },
  refreshToken: state => {
    return state.refreshToken
  }
};

export const mutations = {
  setUser: (state, user) => {
    state.user = user
  },
  setJwtToken: (state, jwtToken) => {
    state.jwtToken = jwtToken
    localStorage.setItem("jwtToken", jwtToken);
  },
  setRefreshToken: (state, refreshToken) => {
    state.refreshToken = refreshToken
    localStorage.setItem("refreshToken", refreshToken);
  },
};

export const actions = {

  /**
   *
   * @param context
   * @param {{key:String,activationCode:String,roleKey:String}} data
   * @return {Promise<unknown>}
   */
  login(context, data) {
    return new Promise((resolve, reject) => {
      this.$axios.post("/user/token", data).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },

  refreshToken(context, data) {
    return new Promise((resolve, reject) => {
      this.$axios.post("/user/token/refresh", data,{alert:false}).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },

  /**
   *
   * @param context
   * @return {Promise<unknown>}
   */
  logout(context) {
    return new Promise((resolve, reject) => {
      this.$axios.post("/user/logout", {}).then((response) => {
        resolve(response.data);
        location.reload();
      }).catch(err => {
        reject(err);
      })
    })
  },

  /**
   *
   * @param context
   * @return {Promise<unknown>}
   */
  profile(context) {
    return new Promise((resolve, reject) => {
      this.$axios.get("/user/profile", {alert: false}).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },
};
