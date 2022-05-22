export const state = () => ({
  domain: [],
  service: [],
  user:[]
})

export const getters = {
  domain: state => {
    return state.domain
  },
  service: state => {
    return state.service
  },
  user: state => {
    return state.domain
  },
}

export const mutations = {
  domain: ((state, value) => {
    state.domain = value
  }),
  service: ((state, value) => {
    state.service = value
  }),
  user: ((state, value) => {
    state.domain = value
  }),

}


export const actions = {
  update(context, {name,headerData={}}) {

    let header = ""
    for (let [key,value] of Object.entries(headerData)){
      if(header === "") header += "?"
      if(header.length > 2) header += "&"
      header+= `${key}=${value}`
    }


    return new Promise((resolve, reject) => {
      this.$axios.get(`/${name}${header}`, {}).then((response) => {
        let result = response.data.result
        context.commit(name, result)
        resolve(result);
      }).catch(err => {
        reject(err);
      })
    })
  },
}
