import {Header} from "./Header";
import headers from "@/menu";

export class Menu {


  /**
   *
   * @param {Menu} parent
   * @param {String} value
   * @param {String} key
   * @param {String} title
   * @param {String} icon
   * @param {String} to
   * @param {Boolean} isReadOnly
   * @param {Menu[]} items
   * @param {Header[]} headers
   */
  constructor({parent = null, value, key = undefined, title, icon = "", to = undefined, isReadOnly = false, items = [], headers = []}) {
    this._parent = parent
    this._value = value
    this._key = key
    this._title = title
    this._icon = icon
    this._to = to
    this._isReadOnly = isReadOnly
    this._items = []
    this._itemsJson = {}
    this._headers = []
    this._headersJson = {}

    for (let item of items) {
      this.addItem(item)
    }

    for (let header of headers) {
      this.addHeader(header)
    }
  }

  get parent() {
    return this._parent;
  }

  set parent(value) {
    this._parent = value;
  }

  get value() {
    return this._value;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get icon() {
    return this._icon;
  }

  set icon(value) {
    this._icon = value;
  }

  get to() {
    return this._to;
  }

  set to(value) {
    this._to = value;
  }

  get isReadOnly() {
    return this._isReadOnly;
  }

  set isReadOnly(value) {
    this._isReadOnly = value;
  }

  get key() {
    return this._key;
  }

  set key(value) {
    this._key = value;
  }

  /**
   *
   * @return {Menu[]}
   */
  get items() {
    return this._items;
  }

  /**
   *
   * @return {Header[]}
   */
  get headers() {
    return this._headers;
  }

  /**
   *
   * @param {Menu} item
   */
  addItem(item) {
    this._itemsJson[item._value] = item
    this._items.push(item)
  }

  /**
   *
   * @param {Header} header
   */
  addHeader(header) {
    this._headersJson[header.value] = header
    this._headers.push(header)
  }

  /**
   *
   * @param itemName
   * @return {Menu}
   */
  getItem(itemName) {
    return this._itemsJson[itemName]
  }


  /**
   *
   * @param headerName
   * @return {Header}
   */
  getHeader(headerName) {
    return this._headersJson[headerName]
  }

  toJson() {
    let json = {
      value: this._value,
      title: this._title,
      icon: this._icon,
      to: this._to,
      isReadOnly: this._isReadOnly,
      items: [],
      headers: []
    }

    for (let item of this._items) {
      json.items.push(item.toJson())
    }

    for (let header of this._headers) {
      json.headers.push(header.toJson())
    }

    return json
  }

  clone() {
    return new Menu(this.toJson())
  }
}
