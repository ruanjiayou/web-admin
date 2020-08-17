import { types, getSnapshot } from 'mobx-state-tree'
import resource from './resource'
const _ = require('lodash')

function deepEqual(a, b) {
  for (let k in a) {
    let equal = true;
    if (_.isPlainObject(a[k])) {
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
  $diff: types.frozen({}),
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
  attrs: types.optional(types.model({
    hide_title: types.maybeNull(types.boolean),
    allowChange: types.maybeNull(types.boolean),
    selected: types.maybeNull(types.boolean),
    timeout: types.maybeNull(types.number),
    columns: types.maybeNull(types.number),
    showCount: types.maybeNull(types.number),
  }), {}),
  // query/
  params: types.frozen(null, {}),
  more: types.optional(types.model({
    channel_id: types.maybeNull(types.string),
    keyword: types.maybeNull(types.string),
    type: types.maybeNull(types.string),
  }), {}),
  nth: types.optional(types.number, 0),
  open: types.optional(types.boolean, true),
  children: types.optional(types.array(types.late(() => GroupModel)), []),
}).views(self => ({
  // 编辑比较
  toJSON() {
    const data = getSnapshot(self);
    return _.omit(data, ['data', 'children', '$new', '$delete', '$origin', '$diff'])
  },
  diff() {
    return !deepEqual(self.$origin, self.toJSON()) || self.$delete === true;
  }
})).actions(self => ({
  // hook
  afterCreate() {
    self.$origin = self.toJSON()
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
}))

export default GroupModel