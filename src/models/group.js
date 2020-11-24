import { types, getSnapshot } from 'mobx-state-tree'
import resource from './resource'
const _ = require('lodash')

function deepEqual(a, b) {
  for (let k in a) {
    let equal = true;
    if (_.isPlainObject(a[k])) {
      if (_.isEmpty(a[k]) && !_.isEmpty(b[k])) {
        return false
      }
      equal = deepEqual(a[k], b[k]);
    } else {
      equal = _.isEqual(a[k], b[k]);
    }
    if (!equal) {
      return false;
    }
  }
  return true;
}

const GroupModel = types.model('Group', {
  // 编辑用属性
  $origin: types.frozen({}),
  $new: types.optional(types.boolean, false),
  $delete: types.optional(types.boolean, false),
  // data/children 临时属性
  tree_id: types.string,
  id: types.string,
  parent_id: types.optional(types.string, ''),
  title: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  desc: types.optional(types.string, ''),
  view: types.optional(types.string, ''),
  refs: types.array(types.string),
  data: types.array(resource),
  attrs: types.frozen(types.model({
    random: types.union(types.boolean, types.null, types.undefined),
    selected: types.union(types.boolean, types.null, types.undefined),
    timeout: types.union(types.number, types.null, types.undefined),
    columns: types.union(types.number, types.null, types.undefined),
  }), {}),
  // query/
  params: types.frozen(null, {}),
  more: types.optional(types.model({
    channel_id: types.union(types.string, types.null,),
    keyword: types.union(types.string, types.null, types.undefined),
    type: types.union(types.string, types.null, types.undefined),
  }), { channel_id: '' }),
  nth: types.optional(types.number, 0),
  open: types.optional(types.boolean, true),
  children: types.optional(types.array(types.late(() => GroupModel)), []),
}).views(self => ({
  // 编辑比较
  toJSON() {
    const data = getSnapshot(self);
    return _.omit(data, ['data', 'children', '$new', '$delete', '$origin'])
  },
  diff() {
    return !deepEqual(self.$origin, self.toJSON()) || self.$delete === true || self.$new === true;
  },
  omitable(key) {
    const mapper = {
      'picker': ['params', 'attrs.selected', 'attrs.random'],
      'filter': ['more', 'attrs', 'refs', 'title'],
      'filter-tag': ['attrs', 'refs', 'more'],
    }
    const b = mapper[self.view] && mapper[self.view].includes(key)
    return b
  },
})).actions(self => ({
  // hook
  afterCreate() {
    self.$origin = self.toJSON()
    self.children.forEach((child, i) => child.nth = i)
  },
  selectMe(id = '') {
    const found = self.children.find(child => child.id === id)
    if (found === undefined || id === '') {
      id = self.id
    }
    self.attrs.selected = id === self.id ? true : false
    self.children.forEach(child => {
      child.attrs.selected = child.id === id ? true : false
    })
  },
  setKey(key, value) {
    document.dispatchEvent(new CustomEvent('group', { detail: { tree_id: self.tree_id } }))
    _.set(self, key, value);
  },
  // ref操作
  addRef(ref) {
    self.refs.push(ref)
  },
  removeRef(i) {
    self.refs.splice(i, 1)
  },
  sortByIndex(oldIndex, newIndex) {
    const [child] = self.children.splice(oldIndex, 1)
    const data = getSnapshot(child);
    self.children.splice(newIndex, 0, data)
    self.children.forEach((child, i) => child.nth = i)
  },
  sortChildren(data) {
    const mapping = {};
    data.forEach((it, i) => {
      mapping[data.id] = i
    })
    const children = self.children.map(child => { child.nth = mapping[child.id]; return child })
    self.children = children
  },
  appendData(data) {
    self.data.push(data);
    self.refs.push(data.id)
  },
  sortRefsByIndex(oldIndex, newIndex) {
    const [child] = self.data.splice(oldIndex, 1)
    const data = getSnapshot(child);
    self.data.splice(newIndex, 0, data)

    const ref = self.refs[oldIndex]
    self.refs[oldIndex] = self.refs[newIndex]
    self.refs[newIndex] = ref
  },
  addChild(child) {
    self.children.push(child)
  },
  removeChild(id) {
    const i = self.children.findIndex(item => item.id === id)
    self.children.splice(i, 1);
    self.children.forEach((child, i) => child.nth = i)
  },
  huifu() {
    self.$delete = false;
    if (self.diff()) {
      for (let k in self.$origin) {
        self[k] = self.$origin[k]
      }
    }
    for (let i = self.children.length - 1; i > 0; i--) {
      const child = self.children[i];
      if (child.$new) {
        self.children.splice(i, 1)
      } else {
        child.huifu()
      }
    }
    self.children.forEach((child, i) => child.nth = i)
  },
}))

export default GroupModel