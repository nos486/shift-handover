export const state = () => ({});

export const getters = {};

export const mutations = {};

export const actions = {

  /**
   *
   * @param context
   * @param {{pathName:String,id:String}} payload
   * @return {Promise<unknown>}
   */
  get(context, payload) {
    let processedPayload  = processPayload(payload)

    return new Promise((resolve, reject) => {
      this.$axios.get(`/${processedPayload.pathName}${processedPayload.header}`, {...processedPayload.config}).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },


  // update(context, payload) {
  //   let pathName = payload.pathName
  //   delete payload.pathName
  //
  //   return new Promise((resolve, reject) => {
  //     this.$axios.post(`/${pathName}/update`, payload).then((response) => {
  //       resolve(response.data);
  //     }).catch(err => {
  //       reject(err);
  //     })
  //   })
  // },

  delete(context, payload) {
    let pathName = payload.pathName
    delete payload.pathName

    return new Promise((resolve, reject) => {
      this.$axios.delete(`/${pathName}`, {data:payload}).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },

  put(context, payload) {
    let pathName = payload.pathName
    delete payload.pathName

    return new Promise((resolve, reject) => {
      this.$axios.put(`/${pathName}`, payload).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },

  // remove(context, payload) {
  //   let pathName = payload.pathName
  //   delete payload.pathName
  //
  //   return new Promise((resolve, reject) => {
  //     this.$axios.delete(`/${pathName}/delete`, {data:payload}).then((response) => {
  //       resolve(response.data);
  //     }).catch(err => {
  //       reject(err);
  //     })
  //   })
  // },

  removeById(context, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.delete(`/${payload.pathName}/delete?id=${payload.id}`, {}).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },

  remove(context, payload) {
    let processedPayload  = processPayload(payload)

    return new Promise((resolve, reject) => {
      this.$axios.delete(`/${processedPayload.pathName}/delete${processedPayload.header}`, {...processedPayload.config}).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },

  clear(context, payload) {
    let processedPayload  = processPayload(payload)

    return new Promise((resolve, reject) => {
      this.$axios.delete(`/${processedPayload.pathName}/clear${processedPayload.header}`, {...processedPayload.config}).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },

  /**
   *
   * @param context
   * @param {Object} payload
   * @return {Promise<unknown>}
   */
  search(context, payload={max:20,offset:0}) {
    let pathName = payload.pathName
    delete payload.pathName

    let header = ""
    for (let [key,value] of Object.entries(payload)){
      if(header === "") header += "?"
      if(header.length > 2) header += "&"
      header+= `${key}=${value}`
    }

    return new Promise((resolve, reject) => {
      this.$axios.get(`/${pathName}/search${header}`, {}).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },


  post(context, payload) {
    let pathName = payload.pathName
    delete payload.pathName

    let data = payload
    if (payload.array) data = payload.array

    return new Promise((resolve, reject) => {
      this.$axios.post(`/${pathName}`, data).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },

  upload(context, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.post(`/filePart/insert`, payload).then((response) => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      })
    })
  },
};

function processPayload(payload){

  let config = payload.config
  let pathName = payload.pathName

  delete payload.pathName
  delete payload.config

  let out = {
    config: {...config,data:payload.data},
    pathName : pathName,
    header : ""
  }

  if (payload.header !== undefined){
    let header = ""
    for (let [key,value] of Object.entries(payload.header)){
      if(header === "") header += "?"
      if(header.length > 2) header += "&"
      header+= `${key}=${value}`
    }
    out["header"] = header
  }

  console.log(out)
  return  out
}
