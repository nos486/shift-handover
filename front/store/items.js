export const state = () => ({
  domain: [],
  service: [],
  user:[],
  "event/eventList" : [],
  "event/statusList" : [],
  "event/severityList" : [],
  "user/genderList" : [],
  "user/roleList" : [],
  "cr/statusList" : []
})

export const getters = {
  domain: state => {
    return state.domain
  },
  service: state => {
    return state.service
  },
  user: state => {
    return state.user
  },
  "event/eventList": state => {
    return state["event/eventList"]
  },
  "event/statusList": state => {
    return state["event/statusList"]
  },
  "event/severityList": state => {
    return state["event/severityList"]
  },
  "user/genderList": state => {
    return state["user/genderList"]
  },
  "user/roleList": state => {
    return state["user/roleList"]
  },
  "cr/statusList": state => {
    return state["user/statusList"]
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
    state.user = value
  }),
  "event/eventList": ((state, value) => {
    state["event/eventList"] = value
  }),
  "event/severityList": ((state, value) => {
    state["event/severityList"] = value
  }),
  "event/statusList": ((state, value) => {
    state["event/statusList"] = value
  }),
  "user/genderList": ((state, value) => {
    state["user/genderList"] = value
  }),
  "user/roleList": ((state, value) => {
    state["user/roleList"] = value
  }),
  "cr/statusList": ((state, value) => {
    state["user/statusList"] = value
  }),

}


export const actions = {
  update(context, {name,headerData={itemsPerPage:100}}) {

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
