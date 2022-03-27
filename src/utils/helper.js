const shortid = require('shortid');

export function GroupsDiff(group) {
  let diffed = group.diff()
  if (diffed) {
    return true
  } else {
    for (let i = 0; i < group.children.length; i++) {
      diffed = GroupsDiff(group.children[i]);
      if (diffed) {
        return true;
      }
    }
  }
  return false
}

export function GroupsGetById(tree, id) {
  if (tree.id === id) {
    return tree;
  } else {
    for (let i = 0; i < tree.children.length; i++) {
      let n = GroupsGetById(tree.children[i], id);
      if (n) {
        return n;
      }
    }
    return null;
  }
}

export function createEmptyGroup(parent = {}, view = '') {
  const uuid = shortid.generate()
  const data = {
    $new: true,
    tree_id: parent.tree_id || uuid,
    id: uuid,
    parent_id: parent.id || '',
    title: 'new',
    name: '',
    desc: '',
    view: '',
    refs: [],
    attrs: {
      random: false,
      selected: false,
      timeout: 0,
      columns: 1,
    },
    params: {},
    more: {
      channel_id: '',
      keyword: '',
      type: '',
    },
    nth: parent.children ? parent.children.length : 0,
    open: true,
  };
  if (parent.view === 'filter') {
    view = 'filter-row'
  }
  if (parent.view === 'filter-row') {
    view = 'filter-tag'
  }
  if (parent.view === 'tab') {
    view = 'filter-pane'
  }
  if (parent.view === 'menu-grid') {
    view = 'menu'
  }
  if (parent.view === 'tree-node') {
    view = 'tree-node'
  }
  data.view = view
  return data;
}


export function formatNumber(n) {
  const G = 1024 * 1024 * 1024, M = 1024 * 1024;
  if (n >= G) {
    return (n / G).toFixed(2) + 'G'
  } else if (n >= M) {
    return (n / M).toFixed(2) + 'M'
  } else {
    return (n / 1024).toFixed(2) + 'K'
  }
}