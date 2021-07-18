import React from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { VisualBox, Icon, SortListView } from '../../component'
import ItemView from '../BookItem/Normal'
import { AlignAside, FullWidth } from '../../component/style'
import { contextMenu } from 'react-contexify';
import { ScrollWrap } from '../style'
import apis from '../../api/index'

export default function Random({ self, ...props }) {
    const local = useLocalStore(() => ({
        loading: false,
    }))
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
            <AlignAside style={{ borderLeft: '5px solid #ff9999', padding: '5px 8px' }}>
                <span>{self.title}</span>
                <VisualBox visible={self.more.channel_id !== ''}>
                    <span style={{ fontSize: 13, color: '#888' }}>更多 <Icon type="arrow-right" /></span>
                </VisualBox>
            </AlignAside>
            <FullWidth>
                <ScrollWrap style={{ minHeight: 110, display: 'flex', flexDirection: 'row', alignItems: 'center', overflowX: 'auto', padding: 5, flex: 1 }}>
                    <SortListView
                        isLoading={false}
                        direction="horizontal"
                        sort={(oldIndex, newIndex) => { self.sortRefsByIndex(oldIndex, newIndex); }}
                        items={self.data}
                        droppableId={self.id}
                        mode={props.mode}
                        listStyle={{ flexWrap: 'nowrap', display: 'flex', boxSizing: 'border-box' }}
                        itemStyle={{ display: 'inline-block', lineHeight: 1, margin: '0 5px' }}
                        renderItem={({ item }) => <ItemView key={item.id} style={{ width: 250 }} item={item} />}
                    />
                </ScrollWrap>
                <VisualBox visible={props.mode === 'edit'}>
                    <div style={{ width: 30, textAlign: 'center' }}>
                        <Icon type="circle-plus" onClick={() => { props.addRef(self) }} />
                    </div>
                </VisualBox>
            </FullWidth>
            <VisualBox visible={self.attrs.random === true}>
                <div style={{ textAlign: 'center' }} onClick={async () => {
                    try {
                        local.loading = true;
                        const resp = await apis.getGroupResources(self.id)
                        self.setData(resp.data)
                    } finally {
                        local.loading = false
                    }
                }}><Icon type="sync-horizon" /> 换一换</div>
            </VisualBox>
        </div>
    )}</Observer>
}