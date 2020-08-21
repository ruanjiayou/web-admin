import React, { useEffect, useCallback, Fragment } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, Switch, notification, Button, Divider } from 'antd';
import { DeleteOutlined, WarningOutlined, SyncOutlined, LoadingOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, Right } from '../../../component/style'
import Edit from './editTrade'

const { Column } = Table;
const { getTrades, createTrade, updateTrade, destroyTrade } = apis
const mapping = {
  '1': '证券买入',
  '2': '券卖出',
  '3': '红利入账',
  '4': '股息个税征收',
}
export default function TaskList() {
  const local = useLocalStore(() => ({
    isLoading: false,
    search_page: 1,
    count: 0,
    trades: [],
    showEdit: false,
    temp: null,
    analyise: {},
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      page: local.search_page,
    }
    getTrades(query).then(res => {
      local.isLoading = false
      local.count = res.count
      local.trades = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffect(() => {
    init()
    search()
  })
  const init = useCallback(async () => {
    local.isLoading = true;
    try {
      const res = await apis.analyise()
      console.log(res);
      local.analyise = res.data
    } catch (e) {

    } finally {
      local.isLoading = false
    }
  })
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={{ padding: '20px 0' }}>
        <div style={{ flex: 1 }}>
          <span style={{ color: 'green' }}>费用合计:-{local.analyise.fee}</span><Divider type="vertical" />
          <span style={{ color: 'red' }}>分红合计:+{local.analyise.bonus}</span><Divider type="vertical" />
          <span>买入次数:{local.analyise.buys}</span><Divider type="vertical" />
          <span>卖出次数:{local.analyise.sells}</span><Divider type="vertical" />
          <span>总收支:{local.analyise.total}</span>
        </div>
        <Right>
          <Button type="primary" onClick={e => {
            local.temp = {
              type: '1', amount: 0, price: 0, trade: 0, total: 0, currency: '人民币', fee: 0, fees: [
                { key: '佣金', value: 0 },
                { key: '规费', value: 0 },
                { key: '印花税', value: 0 },
                { key: '过户费', value: 0 },
                { key: '清算费', value: 0 },
                { key: '交易规费', value: 0 },
                { key: '经手费', value: 0 },
                { key: '证管费', value: 0 },
                { key: '前台费用', value: 0 },
                { key: '其他费', value: 0 },
              ]
            }; local.showEdit = true
          }}>添加记录</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={e => { search(); init() }}>刷新</Button>
        </Right>
      </FullHeightFix>
      <FullHeightAuto style={{ overflow: 'hidden' }}>
        <Table className="box" dataSource={local.trades} rowKey="id" scroll={{ y: 600 }} loading={local.isLoading} pagination={{
          pageSize: 20,
          current: local.search_page,
          total: local.count,
        }} onChange={(page) => {
          local.search_page = page.current
          search()
        }}>
          <Column title="id" width={100} dataIndex="id" key="id" render={text => <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: '100%' }}>{text}</span>} />
          <Column title="名称" width={100} dataIndex="name" key="name" />
          <Column title="交收日期" width={100} dataIndex="settlement" key="settlement" />
          <Column title="交易类别" width={120} dataIndex="type" key="type" render={text => <span>
            {
              mapping[text]
            }
          </span>
          } />
          <Column title="成交数量" width={100} dataIndex="amount" key="amount" />
          <Column title="成交价格" width={100} dataIndex="price" key="price" />
          <Column title="成交金额" width={100} dataIndex="trade" key="trade" />
          <Column title="费用合计" width={100} dataIndex="fee" key="fee" />
          <Column title="发生金额" width={100} dataIndex="total" key="total" />
          <Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <FormOutlined onClick={() => { local.temp = record; local.showEdit = true }} />
              <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {
                await destroyTrade(record)
                search()
              }}>
                <DeleteOutlined />
              </Popconfirm>
            </div>
          )} />
        </Table>
      </FullHeightAuto>
      {local.showEdit && <Edit save={async (data) => {
        if (data.id) {
          await updateTrade(data)
        } else {
          await createTrade(data)
        }
        search()
      }} cancel={() => local.showEdit = false} data={local.temp} />}
    </FullHeight>
  )}</Observer>
}