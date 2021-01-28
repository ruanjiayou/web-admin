import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore, } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { Table, Popconfirm, notification, Button, Divider, Input, Tabs, Form } from 'antd';
import { DeleteOutlined, WarningOutlined, FormOutlined, CloudServerOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, Padding } from '../../../component/style'
import { VisualBox } from '../../../component'
import Modal from 'antd/lib/modal/Modal';
import { useEffectOnce } from 'react-use';

const { TabPane } = Tabs;
const { Column } = Table;
export default function ConfigPage() {
  const lb = { span: 3 }, rb = { span: 18 }
  const local = useLocalStore(() => ({
    configs: [],
    loading: false,
    initing: false,
    showEdit: false,
    temp: {},
  }))
  const init = useCallback(async () => {
    local.initing = true
    const res = await apis.getConfigs()
    if (res && res.code === 0) {
      local.configs = res.data;
    }
    local.initing = false
  }, [])
  const onUpdate = useCallback(async (data) => {
    local.loading = true;
    await apis.updateConfig(data)
    local.loading = false
  })
  const onDestroy = useCallback(async (id) => {
    local.loading = true;
    await apis.destroyConfig(id)
    local.loading = false
  })
  useEffectOnce(() => {
    init()
  }, [])
  return <Observer>{() => (
    <Padding>
      <Button type="primary" loading={local.loading} onClick={() => {
        init()
      }}>刷新</Button>
      <Divider type="vertical" />
      <Button type="primary" loading={local.loading} onClick={() => {
        local.temp = {};
        local.showEdit = true
      }}>添加</Button>
      <Tabs defaultActiveKey="1" >
        {local.configs.map(([name, items], i) => <TabPane tab={name} key={i}>
          <Table dataSource={items} rowKey="id" scroll={{ y: 'calc(100vh - 300px)' }} loading={local.initing} pagination={{
            pageSize: 20,
          }}>
            <Column title="名称" width={100} dataIndex="name" key="name" />
            <Column title="值" dataIndex="value" key="value" render={(txt, order) => {
              return typeof order.value === 'object' ? JSON.stringify(order.value) : order.value
            }} />
            <Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <FormOutlined onClick={() => { local.temp = record; local.showEdit = true }} />
                <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {
                  await onDestroy(record)
                  init()
                }}>
                  <DeleteOutlined />
                </Popconfirm>
              </div>
            )} />
          </Table>
        </TabPane>)}
      </Tabs>
      {local.showEdit && <Modal visible={true} title={local.temp.id ? '修改' : '添加'}
        onOk={async () => {
          try {
            let value = local.temp.value
            try {
              value = JSON.parse(local.temp.value)
            } catch (e) {

            }
            if (local.temp.id) {
              await onUpdate({ ...local.temp, value })
            } else {
              await apis.createConfig({ ...local.temp, value })
            }
            await init();
          } catch (e) {
            console.log(e.message)
          } finally {
            local.loading = false
          }
          local.showEdit = false
        }}
        onCancel={() => {
          local.showEdit = false
        }}>
        <Form>
          <Form.Item label="名称" labelCol={lb} wrapperCol={rb}>
            <Input value={local.temp.name} autoFocus onChange={e => local.temp.name = e.target.value} />
          </Form.Item>
          <Form.Item label="类型" labelCol={lb} wrapperCol={rb}>
            <Input value={local.temp.type} onChange={e => local.temp.type = e.target.value} />
          </Form.Item>
          <Form.Item label="标注" labelCol={lb} wrapperCol={rb}>
            <Input value={local.temp.mark} onChange={e => local.temp.mark = e.target.value} />
          </Form.Item>
          <Form.Item label="条件" labelCol={lb} wrapperCol={rb}>
            <Input.TextArea style={{ minHeight: 150 }} value={typeof local.temp.value === 'object' ? JSON.stringify(local.temp.value) : local.temp.value} onChange={e => local.temp.value = e.target.value}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>}
    </Padding>
  )}</Observer>
}