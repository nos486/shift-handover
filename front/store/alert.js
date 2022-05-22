class Alert {
  constructor({message,type}) {
    this._message = message
    this._type = type
  }

  get message(){
    return this._message
  }

  get type(){
    return this._type
  }
}

export const state = () => ({
  alertList : [],
})

export const getters = {
  alertList: state => {
    return state.alertList
  },
}

export const mutations = {
  success (state,message){
    this.commit("alert/showAlert",{message:message,type:"success"})
  },

  error (state,message){
    this.commit("alert/showAlert",{message:message,type:"error"})
  },

  warning (state,message){
    this.commit("alert/showAlert",{message:message,type:"warning"})
  },


  showAlert(state,{message,type,timeout=3000}){
    let alert = new Alert({
      message: message,
      type: type,
    })

    setTimeout(()=>{
      this.commit("alert/hideAlert",alert)
    },timeout)

    state.alertList.push(alert)
  },

  /**
   *
   * @param state
   * @param {Alert} alert
   */
  hideAlert(state,alert){
    state.alertList.splice(state.alertList.indexOf(alert),1)
  }
}

