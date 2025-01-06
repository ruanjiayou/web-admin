import React from 'react'
import { contextMenu } from 'react-contexify';
import { Observer, } from 'mobx-react-lite'
import FilterRow from '../FilterRow'
import { Icon, VisualBox, SortListView } from '../../component'
import { AlignAside } from '../../component/style'
import ItemView from '../BookItem/Normal'

export default function Filter({ self, ...props }) {
  return <Observer>{() => <div>
    <VisualBox visible={props.mode === 'edit'}>
      <AlignAside style={{ border: '1px dashed grey', padding: '2px 0' }}>
        <span>编辑过滤组</span>
        <span onClick={(e) => {
          e.preventDefault();
          contextMenu.show({
            id: 'group_menu',
            event: e,
            props: {
              id: self.id,
              view: self.view
            }
          });
        }}><Icon type="more" /></span>
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
    <div style={{ maxHeight: 640, overflowY: 'auto', overflowX: 'hidden', }}>
      {self.data.map(item => <ItemView key={item.id} item={item} />)}
    </div>
  </div>}</Observer>
}