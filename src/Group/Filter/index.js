import React from 'react'
import FilterRow from '../FilterRow'
import SortListView from '../../component/SortListView'

export default function Filter({ self, children, ...props }) {
  return <div style={{ padding: '0 20px' }}>
    {props.mode === 'preview' ? self.children.map(child => (<FilterRow key={child.id} self={child} children={child.children} {...props} />)) : (<SortListView
      isLoading={false}
      sort={() => { }}
      droppableId={self.id}
      items={self.children}
      mode={props.mode}
      renderItem={({ item }) => <FilterRow self={item} children={[]} {...props} />}
    />)}
  </div>
}