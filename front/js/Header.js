export class Header {
  get isUpdateOnly() {
    return this._isUpdateOnly;
  }

  set isUpdateOnly(value) {
    this._isUpdateOnly = value;
  }

  get searchOn() {
    return this._searchOn;
  }

  set searchOn(value) {
    this._searchOn = value;
  }

  get divider() {
    return this._divider;
  }

  set divider(value) {
    this._divider = value;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
  }

  get itemHeader() {
    return this._itemHeader;
  }

  set itemHeader(value) {
    this._itemHeader = value;
  }

  get defaultSearch() {
    return this._defaultSearch;
  }

  set defaultSearch(value) {
    this._defaultSearch = value;
  }

  get isMultiple() {
    return this._isMultiple;
  }

  set isMultiple(value) {
    this._isMultiple = value;
  }

  get rules() {
    return this._rules;
  }

  set rules(value) {
    this._rules = value;
  }

  get isDefaultFilter() {
    return this._isDefaultFilter;
  }

  set isDefaultFilter(value) {
    this._isDefaultFilter = value;
  }

  constructor({
                value,
                text,
                icon,
                isHidden = false,
                isReadOnly = false,
                isCreateOnly = false,
                isUpdateOnly = false,
                type = undefined,
                items = undefined,
                itemHeader = undefined,
                itemKey = undefined,
                IOKey = "id",
                IOName = "name",
                slot = undefined,
                defaultAmount = undefined,
                isFilterable = false,
                isMultiple = false,
                updatePath = undefined,
                searchHeader = undefined,
                searchOn = undefined,
                defaultSearch = {},
                isDefaultFilter = false,
                rules = {},
                width = undefined,
                divider = false,
              }) {
    this._value = value
    this._text = text
    this._icon = icon
    this._isHidden = isHidden
    this._isReadOnly = isReadOnly
    this._isCreateOnly = isCreateOnly
    this._isUpdateOnly = isUpdateOnly
    this._type = type
    this._items = items
    this._itemHeader = itemHeader;
    this._itemKey = itemKey
    this._IOKey = IOKey
    this._IOName = IOName
    this._slot = slot
    this._defaultAmount = defaultAmount
    this._isFilterable = isFilterable
    this._isMultiple = isMultiple
    this._updatePath = updatePath
    this._searchHeader = searchHeader
    this._defaultSearch = defaultSearch
    this._searchOn = searchOn
    this._isDefaultFilter = isDefaultFilter
    this._rules = rules;
    this._width = width;
    this._divider = divider;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
  }

  get icon() {
    return this._icon;
  }

  set icon(value) {
    this._icon = value;
  }

  get isHidden() {
    return this._isHidden;
  }

  set isHidden(value) {
    this._isHidden = value;
  }

  get isReadOnly() {
    return this._isReadOnly;
  }

  set isReadOnly(value) {
    this._isReadOnly = value;
  }

  get isCreateOnly() {
    return this._isCreateOnly;
  }

  set isCreateOnly(value) {
    this._isCreateOnly = value;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }

  get items() {
    return this._items;
  }

  set items(value) {
    this._items = value;
  }

  get itemKey() {
    return this._itemKey;
  }

  set itemKey(value) {
    this._itemKey = value;
  }

  get IOKey() {
    return this._IOKey;
  }

  set IOKey(value) {
    this._IOKey = value;
  }

  get IOName() {
    return this._IOName;
  }

  set IOName(value) {
    this._IOName = value;
  }

  get slot() {
    return this._slot;
  }

  set slot(value) {
    this._slot = value;
  }

  get defaultAmount() {
    return this._defaultAmount;
  }

  set defaultAmount(value) {
    this._defaultAmount = value;
  }

  get isFilterable() {
    return this._isFilterable;
  }

  set isFilterable(value) {
    this._isFilterable = value;
  }

  get updatePath() {
    return this._updatePath;
  }

  set updatePath(value) {
    this._updatePath = value;
  }

  get searchHeader() {
    return this._searchHeader;
  }

  set searchHeader(value) {
    this._searchHeader = value;
  }

  toJson() {
    return {
      value: this._value,
      text: this._text,
      icon: this._icon,
      isHidden: this._isHidden,
      isReadOnly: this._isReadOnly,
      isCreateOnly: this._isCreateOnly,
      isFilterable: this._isFilterable,
      isMultiple: this._isMultiple,
      type: this._type,
      items: this._items,
      rules: this._rules,
      slot: this._slot,
      updatePath: this._updatePath,
      searchHeader: this._searchHeader,
      defaultSearch : this._defaultSearch,
      isDefaultFilter: this._isDefaultFilter,
      defaultAmount: this._defaultAmount,
      searchOn: this._searchOn,
      width: this._width,
      divider: this._divider
    }
  }

}
