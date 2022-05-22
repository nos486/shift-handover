export default (context, inject) => {
  const e2p = s => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])
  inject('e2p', e2p)
  context.$e2p = e2p

  const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
  inject('p2e', p2e)
  context.$p2e = p2e

  // direction check
  const dirc = (s) => {
    let res = /^[a-zA-Z1-9].*$/.test(s);
    return res
  }
  inject('dirc', dirc)
  context.$dirc = dirc


  // direction check
  const colorCode = (color) => {
    let colors = {
      red: "#F44336",
      pink: "#E91E63",
      purple: "#9C27B0",
      "deep-purple": "#673AB7",
      indigo: "#3F51B5",
      blue: "#2196F3",
      "light-blue": "#03A9F4",
      cyan: "#00BCD4",
      teal: "#009688",
      green: "#4CAF50",
      "light-green": "#8BC34A",
      lime: "#CDDC39",
      yellow: "#FFEB3B",
      amber: "#FFC107",
      orange: "#FF9800",
      "deep-orange": "#FF5722",
      brown: "#795548",
      "blue-grey": "#607D8B",
      grey: "#9E9E9E",
      black: "#000000",
      white: "#FFFFFF"
    }
    return colors[color]
  }
  inject('colorCode', colorCode)
  context.$colorCode = colorCode
}
