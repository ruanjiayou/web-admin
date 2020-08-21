import React, { useState } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ReactSortable } from "react-sortablejs"
import { Divider } from 'antd';
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
        <Icon type="drag" style={{ padding: '4px 8px' }} />
      </VisualBox>}
      renderItem={({ item }) => <FilterRow self={item} {...props} />}
    />
  </div>}</Observer>
}