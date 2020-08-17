import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterTag from '../FilterTag'
import { Icon, VisualBox, SortListView } from '../../component'
import { ScrollWrap } from './style'

export default function FilterRow({ self, children, ...props }) {
  return <Observer>{() => (
    <div key={self.id} style={{ display: 'flex', flexDirection: 'row', overflow: 'scroll' }}>
      <ScrollWrap>{children}</ScrollWrap>
      {/* <VisualBox visible={props.mode === 'edit'}>
        <div style={{ width: 20, height: 20 }} onClick={() => props.editGroup(self)}>
          <Icon type="edit" />
        </div>
      </VisualBox>
      <ScrollWrap>
        {props.mode === 'edit' ? (
          <SortListView
            isLoading={false}
            sort={() => { }}
            items={self.children}
            droppableId={self.id}
            mode={props.mode}
            listStyle={{ whiteSpace: 'nowrap', overflowX: 'hidden' }}
            itemStyle={{ display: 'inline-block' }}
            renderItem={({ item }) => <FilterTag key={item.id} self={item} selectMe={(id) => self.selectMe(id)} {...props} />}
          />
        ) : (
            self.children.map(item => <FilterTag key={item.id} self={item} selectMe={(id) => self.selectMe(id)} {...props} />)
          )}
      </ScrollWrap>
      <VisualBox visible={props.mode === 'edit'}>
        <div style={{ display: props.mode === 'edit' ? 'block' : 'none' }}>
          <Icon type="circle-plus" onClick={() => props.addGroup({ parent_id: self.id, tree_id: self.tree_id, view: 'filter-tag' })} />
          <Icon type="plus" onClick={() => props.destroyGroup({ id: self.id })} />
        </div>
      </VisualBox> */}
    </div>
  )}</Observer>
}