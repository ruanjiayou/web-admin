import React from 'react'
import { Observer } from 'mobx-react-lite'
import { VisualBox, Icon, SortListView, } from '../../component'
import ItemView from '../BookItem/Normal'
import { AlignAside, FullWidth } from '../../component/style'
import { contextMenu } from 'react-contexify';
import { useStore } from '../../contexts';
import Menu from '../Menu'
import { ScrollWrap } from './style'
import { EditWrap } from '../style'

export default function Picker({ self, ...props }) {
  const store = useStore()
  return <Observer>{() => (
    <div>
      <VisualBox visible={props.mode === 'edit'}>
        <AlignAside style={{ border: '1px dashed grey', padding: '2px 5px' }}>
          <Icon type="edit" onClick={e => {
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
          <Icon type="delete" />
        </AlignAside>
      </VisualBox>
      <EditWrap style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', overflowX: 'auto', padding: 5, flex: 1 }}>
        <ScrollWrap>
          <SortListView
            isLoading={false}
            direction="horizontal"
            sort={(oldIndex, newIndex) => { self.sortByIndex(oldIndex, newIndex); }}
            items={self.children}
            droppableId={self.id}
            mode={props.mode}
            listStyle={{ flexWrap: 'nowrap', display: 'flex', boxSizing: 'border-box' }}
            itemStyle={{ display: 'inline-block', lineHeight: 1, margin: '0 5px' }}
            renderItem={({ item }) => <Menu key={item.id} self={item} {...props} />}
          />
        </ScrollWrap>
      </EditWrap>
    </div>

  )}</Observer>
}