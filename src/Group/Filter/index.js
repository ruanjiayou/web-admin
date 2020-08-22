import React, { useState } from 'react'
import { contextMenu } from 'react-contexify';
import { ReactSortable } from "react-sortablejs"
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Divider } from 'antd';
import FilterRow from '../FilterRow'
import { Icon, VisualBox, SortListView } from '../../component'
import { AlignAside } from '../../component/style'
import { EditWrap } from '../style'

export default function Filter({ self, ...props }) {
  return <Observer>{() => <div>
    <VisualBox visible={props.mode === 'edit'}>
      <AlignAside style={{ border: '1px dashed grey', padding: '2px 5px' }}>
        <span onClick={(e) => {
          e.preventDefault();
          contextMenu.show({
            id: 'group_menu',
            event: e,
            props: {
              id: self.id,
              view: self.attrs.view
            }
          });
        }}>编辑过滤组<Icon type="edit" /></span>
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