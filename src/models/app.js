import { types } from "mobx-state-tree";

const app = types.model('app', {
  storagePrefix: types.optional(types.string, 'novel_admin_'),
  menuKey: types.optional(types.string, ''),
  groupMode: types.optional(types.string, 'edit'),
  imageLine: types.optional(types.string, ''),
  baseUrl: types.optional(types.string, ''),
  currentEditGroupId: types.optional(types.string, ''),
  currentDragType: types.optional(types.string, ''),
}).actions(self => ({
  set(key, value) {
    self[key] = value
  },
  setEditGroupId(id) {
    self.currentEditGroupId = id
  },
  toggleGroupMode() {
    self.groupMode = self.groupMode === 'edit' ? 'preview' : 'edit'
  },
  setCurrentDragType(type) {
    self.currentDragType = type
  },
  canTypeDrop(dst) {
    let can = false;
    switch (dst) {
      case "":
        if (["picker", "tab", "filter", "tree-node", "menu-grid", "tabbar", "layout"].includes(self.currentDragType)) {
          can = true;
        }
        break;
      case "picker": break;
      case "filter-tag": break;
      case "tab-pane": can = true; break;
      case "filter": can = self.currentDragType === 'filter-row'; break;
      case "filter-row": can = self.currentDragType === 'filter-tag'; break;
      case "tree-node": can = self.currentDragType === 'tree-node'; break;
      case "tab": can = self.currentDragType === 'tab-pane'; break;
      default: break;
    }
    console.log(`drag:${self.currentDragType} dst:${dst}`)
    return can;
  },
  canAddChild(view) {
    return ['', 'filter', 'filter-row', 'tab', 'tab-pane', 'menu-grid', 'tree-node',].includes(view);
  },
}))

export default app;