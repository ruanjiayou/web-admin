import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterTag from '../FilterTag'
import { Icon, VisualBox, SortListView } from '../../component'
import { ScrollWrap } from './style'

export default function FilterRow({ self, ...props }) {
  return <Observer>{() => (
    <div key={self.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', overflowX: 'auto', padding: 5 }}>
      <ScrollWrap>
        <SortListView
          isLoading={false}
          direction="horizontal"
          sort={(oldIndex, newIndex) => { self.sortByIndex(oldIndex, newIndex); }}
          items={self.children}
          droppableId={self.id}
          mode={props.mode}
          listStyle={{ whiteSpace: 'nowrap', overflowX: 'hidden', boxSizing: 'border-box' }}
          itemStyle={{ display: 'inline-block', lineHeight: 1, margin: '0 5px' }}
          renderItem={({ item }) => <FilterTag key={item.id} self={item} selectMe={(id) => self.selectMe(id)} {...props} />}
        />
      </ScrollWrap>
      {/* <VisualBox visible={props.mode === 'edit'}>
        <div style={{ display: props.mode === 'edit' ? 'block' : 'none' }}>
          <Icon type="circle-plus" onClick={() => props.addGroup({ parent_id: self.id, tree_id: self.tree_id, view: 'filter-tag' })} />
          <Icon type="delete" onClick={() => props.destroyGroup({ id: self.id })} />
        </div>
      </VisualBox> */}
    </div>
  )}</Observer>
}