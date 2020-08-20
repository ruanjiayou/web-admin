import React, { useState } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ReactSortable } from "react-sortablejs"
import FilterRow from '../FilterRow'
import { Icon, VisualBox, SortListView } from '../../component'

export default function Filter({ self, ...props }) {
  return <Observer>{() => <div>
    <SortListView
      isLoading={false}
      sort={(oldIndex, newIndex) => { self.sortByIndex(oldIndex, newIndex); }}
      droppableId={self.id}
      items={self.children}
      itemStyle={{ display: 'flex', alignItems: 'center' }}
      mode={props.mode}
      handler={<VisualBox visible={props.mode === 'edit'}>
        <div style={{ display: 'flex' }}>
          <Icon type="drag" />
          <Icon type="edit" onClick={() => props.editGroup(self)} />
        </div>
      </VisualBox>}
      renderItem={({ item }) => <FilterRow self={item} {...props} />}
    />
  </div>}</Observer>
}