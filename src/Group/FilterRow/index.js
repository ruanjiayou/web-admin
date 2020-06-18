import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterTag from '../FilterTag'
import { Icon, VisualBox, SortListView } from '../../component'

export default function FilterRow({ self, children, ...props }) {
  return <Observer>{() => (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <VisualBox visible={props.mode === 'edit'}>
        <div style={{ width: 20, height: 20 }} onClick={() => props.editGroup(self)}>
          <Icon type="edit" />
        </div>
      </VisualBox>
      <div style={{ flex: 1, flexDirection: 'column', overflowX: 'hidden' }}>
        <SortListView
          isLoading={false}
          sort={() => { }}
          items={self.children}
          droppableId={self.id}
          mode={props.mode}
          listStyle={{ whiteSpace: 'nowrap', overflowX: 'hidden' }}
          itemStyle={{ display: 'inline-block' }}
          renderItem={({ item }) => <FilterTag self={item} selectMe={(id) => self.selectMe(id)} {...props} />}
        />
      </div>
      <VisualBox visible={props.mode === 'edit'}>
        <div style={{ display: props.mode === 'edit' ? 'block' : 'none' }}>
          <Icon type="circle-plus" onClick={() => props.addGroup({ parent_id: self.id, tree_id: self.tree_id, view: 'filter-tag' })} />
          <Icon type="plus" onClick={() => props.destroyGroup({ id: self.id })} />
        </div>
      </VisualBox>
    </div>
  )}</Observer>
}