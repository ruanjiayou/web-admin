import React, { useState } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ReactSortable } from "react-sortablejs"
import FilterRow from '../FilterRow'
import SortListView from '../../component/SortListView'

export default function Filter({ self, ...props }) {
  return <Observer>{() => <div>
   {props.mode === 'preview' ? self.children.map(child => (<FilterRow key={child.id} self={child} children={child.children} {...props} />)) : (<SortListView
    isLoading={false}
    sort={(oldIndex, newIndex) => { self.sortByIndex(oldIndex, newIndex); }}
    droppableId={self.id}
     items={self.children}
    mode={props.mode}
    renderItem={({ item }) => <FilterRow self={item} children={[]} {...props} />}
 />)}
</div>}</Observer>
 
}