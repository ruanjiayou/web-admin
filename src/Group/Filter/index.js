import React, { useState } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { ReactSortable } from "react-sortablejs"
import { Divider } from 'antd';
import FilterRow from '../FilterRow'
import { Icon, VisualBox, SortListView } from '../../component'
import { AlignAside } from '../../component/style'

export default function Filter({ self, ...props }) {
  return <Observer>{() => <div>
    <VisualBox visible={props.mode === 'edit'}>
      <AlignAside style={{ border: '1px dashed grey', padding: '2px 5px' }}>
        <span>编辑过滤组<Icon type="edit" /></span>
        <span>添加过滤类型<Icon type="circle-plus" /></span>
      </AlignAside>
    </VisualBox>
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