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

export function createGroupByType(parent, view) {
  if(view==='') {
    if(parent.view === 'filter') {
      view = 'filter-row'
    }
    if(parent.view === 'filter-row') {
      view = 'filter-tag'
    }
    if(parent.view === 'tab') {
      view = 'filter-pane'
    }
    if(parent.view === 'menu-grid') {
      view = 'menu'
    }
    if(parent.view === 'tree-node') {
      view = 'tree-node'
    }
  }
  const data = {
    $new: true,
    tree_id: parent.tree_id,
    id: shortid.generate(),
    parent_id: parent.id,
    title: 'new',
    name: '',
    desc: '',
    view,
    refs: [],
    attrs: {

    },
    params: {},
    more: {},
    nth: parent.children.length,
    open: true,
  };
  if(view === 'picker') {
    data.attrs.hide_title = false;
  }
  return data;
}