import React, { useCallback, useEffect } from 'react'
import { Modal, Form, Input, notification, Radio, Select, Card, Row, Col, Divider, Button, Table } from 'antd'
import { Observer, useLocalStore } from 'mobx-react-lite';
import resourcesLoader from '../../../loader/resourceListLoader'
import { AlignAside } from '../../../component/style'
import { getSnapshot } from 'mobx-state-tree'

const { Column } = Table;

export default function ResourcePick({ cancel, save }) {
  const local = useLocalStore(() => ({
    page: 1,
    size: 10,
    id: '',
    title: '',
    type: '',
    tag: '',
    maps: [],
    loader: resourcesLoader.create(),
  }))
  useEffect(() => {
    local.loader.refresh()
  })
  return <Observer>{() => (
    <Modal
      style={{ overflow: 'auto', padding: 0 }}
      width={800}
      bodyStyle={{ height: 720, overflow: 'auto', padding: '0 10px' }}
      title={'选择资源'}
      visible={true}
      footer={null}
      onCancel={cancel}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', }}>id<Divider type="vertical" /><Input value={local.id} autoFocus onChange={e => local.id = e.target.value} /></div>
        <Divider type="vertical" />
        <div style={{ display: 'flex', alignItems: 'center', }}>title<Divider type="vertical" /><Input value={local.title} autoFocus onChange={e => local.title = e.target.value} /></div>
        <Divider type="vertical" />
        <div style={{ display: 'flex', alignItems: 'center', }}>tag<Divider type="vertical" /><Input value={local.tag} onChange={e => local.tag = e.target.value} /></div>
        <Divider type="vertical" />
        <div style={{ display: 'flex', alignItems: 'center', }}>
          type<Divider type="vertical" /><Select value={local.type} onChange={value => local.type = value}>
            <Select.Option value="">所有</Select.Option>
            {local.maps.map(m => <Select.Option key={m.key} value={m.key}>{m.value}</Select.Option>)}
          </Select>
        </div>
        <Divider type="vertical" />
        <Button type="primary" loading={local.loader.isLoading} onClick={async () => {
          const query = {}
          if (local.id) {
            query.id = local.id;
          }
          if (local.title) {
            query.title = local.title;
          }
          if (local.type) {
            query.type = local.type
          }
          if (local.tag) {
            query.tag = local.tag
          }
          local.loader.refresh({ query })
        }}>查询</Button>
      </div>
      <Table className="box" dataSource={local.loader.items.map(item => getSnapshot(item))} rowKey="id" scroll={{ y: 600 }} loading={local.loader.isLoading} pagination={{
        pageSize: local.size,
        current: local.page,
        total: local.count,
      }} onChange={(page) => {
        local.page = page.current
        local.loader.loadMore()
      }}>
        <Column title="id" width={100} dataIndex="id" key="id" />
        <Column title="title" width={100} dataIndex="title" key="title" />
        <Column dataIndex="action" key="action" align="center" render={(text, record) => (
          <span onClick={() => { save(JSON.parse(JSON.stringify(record))); cancel(); }}>+</span>
        )} />
      </Table>
    </Modal>
  )}</Observer>
}