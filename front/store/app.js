export const state = () => ({
  loginPath: "/main",
  baseColor: "blue",
  title : "Handover"
})

export const getters = {
  loginPath: state => {
    return state.loginPath
  },
  baseColor: state => {
    return state.baseColor
  },
  title: state => {
    return state.title
  },
}

export const mutations = {
  setBaseColor: ((state, value) => {
    state.baseColor = value
  }),

  title: ((state, value) => {
    state.title = true
  }),
}

export const actions = {}
