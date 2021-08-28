import React, { useCallback } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, Button, Divider, DatePicker, Input, Select, } from 'antd';
import { DeleteOutlined, WarningOutlined, FormOutlined } from '@ant-design/icons'
import apis from '../../../api'
import { FullHeight, FullHeightFix, FullHeightAuto, FullWidthFix } from '../../../component/style'
import Edit from './editTrade'
import { useEffectOnce } from 'react-use';
import moment from 'moment'

const { Column } = Table;
const { getTrades, createTrade, updateTrade, destroyTrade } = apis
const mapping = {
  '1': '证券买入',
  '2': '证券卖出',
  '3': '红利入账',
  '4': '股息个税征收',
  '5': '利息归本',
  '6': '银行转证券',
  '7': '证券转银行',
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
    // query
    s_name: '',
    s_code: '',
    s_st: 0,
    s_se: 0,
    s_type: '',
    // 总操作盈亏
    get total() {
      if (this.trades.length) {
        let sum = 0;
        this.trades.forEach(trade => {
          sum += trade.total
        })
        return sum
      } else {
        return 0
      }
    }
  }))
  const search = useCallback(() => {
    local.isLoading = true
    const query = {
      page: local.search_page,
      name: local.s_name,
      code: local.s_code,
      st: local.s_st,
      se: local.s_se,
      type: local.s_type,
    }
    getTrades(query).then(res => {
      local.isLoading = false
      local.count = res.count
      local.trades = res.data
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  useEffectOnce(() => {
    init()
    search()
  })
  const init = useCallback(async () => {
    local.isLoading = true;
    try {
      const res = await apis.analyise()
      local.analyise = res.data
    } catch (e) {

    } finally {
      local.isLoading = false
    }
  })
  return <Observer>{() => (
    <FullHeight>
      <FullWidthFix style={{ alignItems: 'center', height: 40, padding: '0 15px' }}>
        <span style={{ color: local.analyise.owner >= 0 ? 'red' : 'green' }}>持有市值:{local.analyise.owner}</span><Divider type="vertical" />
        <span style={{ color: local.analyise.owner + local.analyise.total >= 0 ? 'red' : 'green' }}>总盈亏:{(local.analyise.owner + local.analyise.total).toFixed(2)}</span><Divider type="vertical" />
        <span style={{ color: 'green' }}>费用:-{local.analyise.fee}</span><Divider type="vertical" />
        <span style={{ color: 'red' }}>分红:+{local.analyise.bonus}</span><Divider type="vertical" />
        <span>买入次数:{local.analyise.buys}</span><Divider type="vertical" />
        <span>卖出次数:{local.analyise.sells}</span><Divider type="vertical" />
      </FullWidthFix>
      <FullHeightFix style={{ padding: 15, justifyContent: 'space-between' }}>
        <div>
          <Input addonBefore='名称' style={{ width: 150 }} value={local.s_name} onChange={e => {
            local.s_name = e.target.value
          }} />
          <Divider type="vertical" />
          <Input addonBefore='代码' style={{ width: 150 }} value={local.s_code} onChange={e => {
            local.s_code = e.target.value
          }} />
          <Divider type="vertical" />
          <Select style={{ width: 100 }} value={local.s_type} onChange={value => {
            local.s_type = value
          }}>
            <Select.Option value="">全部</Select.Option>
            <Select.Option value="1">证券买入</Select.Option>
            <Select.Option value="2">证券卖出</Select.Option>
            <Select.Option value="3">红利入账</Select.Option>
            <Select.Option value="4">股息个税征收</Select.Option>
            <Select.Option value="5">利息归本</Select.Option>
            <Select.Option value="6">银行转证券</Select.Option>
            <Select.Option value="7">证券转银行</Select.Option>
          </Select>
          <Divider type="vertical" />
          <DatePicker size='middle' style={{ width: 120 }} placeholder='开始时间' format='YYYY-MM-DD' onChange={(mom, ds) => {
            local.s_st = mom.toNow()
          }} />-
          <DatePicker size='middle' style={{ width: 120 }} placeholder='结束时间' format='YYYY-MM-DD' onChange={(mom, ds) => {
            local.s_se = mom.toNow()
          }} />
        </div>
        <div>
          <Button type="primary" onClick={e => { search(); init() }}>查询</Button>
          <Divider type="vertical" />
          <Button type="primary" onClick={e => {
            local.temp = {
              type: 1, amount: 0, price: 0, trade: 0, total: 0, currency: '人民币', fee: 0, se: 'SH', settlement: moment(new Date()).format('YYYYMMDD'), code: '', fees: [
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
        </div>
      </FullHeightFix>
      <FullHeightAuto style={{ overflowY: 'hidden' }}>
        <Table className="box" dataSource={local.trades} rowKey="id" scroll={{ y: 'calc(100vh - 250px)' }} loading={local.isLoading} pagination={null} onChange={(page) => {
          local.search_page = page.current
          search()
        }}>
          <Column title="名称" width={100} dataIndex="name" key="name" />
          <Column title="交收日期" width={100} dataIndex="settlement" key="settlement" />
          <Column title="交易类别" width={120} dataIndex="type" key="type" render={text => <span>
            {
              mapping[text]
            }
          </span>
          } />
          <Column title="成交数量" width={80} dataIndex="amount" key="amount" />
          <Column title="成交价格" width={80} dataIndex="price" key="price" />
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