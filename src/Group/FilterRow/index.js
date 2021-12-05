import React from 'react'
import { Observer } from 'mobx-react-lite'
import FilterTag from '../FilterTag'
import { Divider } from 'antd';
import { Icon, VisualBox, SortListView } from '../../component'
import { contextMenu } from 'react-contexify';
import { useStore } from '../../contexts';
import { EditWrap, ScrollWrap } from '../style'

export default function FilterRow({ self, ...props }) {
  const store = useStore()
  return <Observer>{() => (
    <EditWrap className={store.app.currentEditGroupId === self.id ? 'focus' : ''} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', overflowX: 'auto', flex: 1 }}>
      <ScrollWrap>
        <SortListView
          isLoading={false}
          direction="horizontal"
          sort={(oldIndex, newIndex) => { self.sortByIndex(oldIndex, newIndex); }}
          items={self.children}
          droppableId={self.id}
          mode={props.mode}
          listStyle={{ flexWrap: 'nowrap', display: 'flex', boxSizing: 'border-box' }}
          itemStyle={{ display: 'inline-block', lineHeight: 1, }}
          renderItem={({ item, index }) => <FilterTag key={item.id} self={item} remove={()=>self.removeChild(item.id)} selectMe={(id) => self.selectMe(id)} {...props} />}
        />
      </ScrollWrap>
      <VisualBox visible={props.mode === 'edit'}>
        <Icon type="more" style={{ padding: '4px 8px' }} onClick={e => {
          if (props.mode === 'preview') return;
          e.preventDefault();
          contextMenu.show({
            id: 'group_menu',
            event: e,
            props: {
              id: self.id,
              view: self.view
            }
          });
        }} />
      </VisualBox>
    </EditWrap>
  )}</Observer>
}