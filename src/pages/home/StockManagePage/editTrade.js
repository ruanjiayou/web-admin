import React, { useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Modal, Form, Input, Select, message, Col, Row, DatePicker } from 'antd';
import * as math from 'mathjs'
import moment from 'moment'
import RemoteSelect from './remoteSelect'
import _ from 'lodash'

function toNum(n) {
  return Math.round((parseFloat(n) || 0) * 1000) / 1000
}
const lb = { span: 4, offset: 2 }, rb = { span: 15 }
export default function ({ data, save, cancel }) {
  const iref = useRef(null)
  const local = useLocalStore(() => ({
    data: data,
    auto: () => {
      local.data.fee = _.sum(local.data.fees.map(fee => fee.value));
      local.data.trade = math.multiply(math.bignumber(local.data.amount), math.bignumber(local.data.price)).toNumber()
    },
    isLoading: false,
  }))
  return <Observer>{() => <Modal
    visible={true}
    style={{ overflow: 'auto', padding: 0 }}
    width={650}
    closable={false}
    title={local.inster ? '添加记录' : '修改记录'}
    cancelText="取消"
    okText="保存"
    onCancel={e => { cancel() }}
    onOk={async () => {
      local.isLoading = true
      if (!math.equal(math.bignumber(local.data.fee), math.sum(local.data.fees.map(fee => math.bignumber(fee.value))))) {
        return message.error(`费用有出入: ${local.data.fee} ?? ${math.sum(local.data.fees.map(fee => fee.value))}`)
      }
      local.data.fees.forEach(fee => {
        fee.value = parseFloat(fee.value)
      })
      await save(local.data);
      if (!local.inster) {
        cancel()
      }
      local.data = {
        settlement: local.data.settlement, name: local.data.name,
        se: 'SH', code: '',
        type: 1, amount: 0, price: 0, trade: 0, total: 0, currency: '人民币', fee: 0,
        fees: [
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
      }
      if (iref.current) {
        iref.current.focus()
      }
      local.isLoading = false
    }}
  >
    <Form>
      <Form.Item style={{ marginBottom: 5 }} label="交割日期" labelCol={lb} wrapperCol={rb}>
        <Row gutter={16}>
          <Col span={8}>
            <DatePicker style={{ width: '100%' }} value={moment(local.data.settlement || new Date(), 'YYYYMMDD')} format="YYYYMMDD" onChange={(d, s) => {
              local.data.settlement = s;
            }} />
          </Col>
          <Col span={16}>
            <Select value={local.data.type} style={{ width: '100%' }} onChange={value => local.data.type = value}>
              <Select.Option value={1}>证券买入</Select.Option>
              <Select.Option value={2}>证券卖出</Select.Option>
              <Select.Option value={3}>红利入账</Select.Option>
              <Select.Option value={4}>股息个税征收</Select.Option>
              <Select.Option value={5}>利息归本</Select.Option>
              <Select.Option value={6}>银行转证券</Select.Option>
              <Select.Option value={7}>证券转银行</Select.Option>
              <Select.Option value={8}>指定交易</Select.Option>
            </Select>
          </Col>
        </Row>
      </Form.Item>
      <Row gutter={8} style={{ marginBottom: 5 }}>
        <Col offset={6} span={7}>
          <Input placeholder="证券代码" addonBefore={<Select value={local.data.se} onChange={v => local.data.se = v}>
            <Select.Option key="SH" value="SH">上海</Select.Option>
            <Select.Option key="SZ" value="SZ">深圳</Select.Option>
            <Select.Option key="HK" value="HK">香港</Select.Option>
            <Select.Option key="NASDAQ" value="NASDAQ">纳斯达克</Select.Option>
            <Select.Option key="NYSE" value="NYSE">纽交所</Select.Option>
          </Select>} value={local.data.code} onChange={e => local.data.code = e.target.value} />
        </Col>
        <Col offset={1} span={7}>
          <Input placeholder="证券名称" addonBefore="名称" value={local.data.name} onChange={e => local.data.name = e.target.value} />
        </Col>
      </Row>
      <Row gutter={8} style={{ marginBottom: 5 }} >
        <Col offset={6} span={7}>
          <RemoteSelect placeholder={"查询"} onChoose={d => {
            if (d) {
              local.data.se = d.se
              local.data.code = d.code
              local.data.name = d.name
            }
          }} />
        </Col>
      </Row>
      <Row gutter={8} style={{ marginBottom: 5 }}>
        <Col offset={6} span={7}>
          <Input addonBefore="数量" placeholder="成交数量" disabled={data.type === 5} type='number' value={local.data.amount} onChange={e => {
            local.data.amount = toNum(e.target.value);
            local.auto();
          }} />
        </Col>
        <Col offset={1} span={7}>
          <Input addonBefore="价格" placeholder="成交价格" disabled={data.type === 5} type='number' value={local.data.price} onChange={e => {
            local.data.price = toNum(e.target.value)
            local.auto();
          }} />
        </Col>
      </Row>
      <Row gutter={8} style={{ marginBottom: 5 }} >
        <Col offset={6} span={15}>
          <Input addonBefore="费用合计" placeholder="0" disabled value={local.data.fee} />
        </Col>
      </Row>
      <Row gutter={8} style={{ marginBottom: 5 }}>
        <Col offset={6} span={7}>
          <Input placeholder="成交金额" addonBefore="成交金额" value={local.data.trade} type='number' onChange={e => local.data.trade = toNum(e.target.value)} />
        </Col>
        <Col offset={1} span={7}>
          <Input placeholder="发生金额" addonBefore="发生金额" value={local.data.total} type='number' onChange={e => local.data.total = toNum(e.target.value)} />
        </Col>
      </Row>
      <Form.Item style={{ marginBottom: 5 }} label="费用明细" labelCol={lb} wrapperCol={rb}>
        {local.data.fees.map((fee, i) => (
          <Input key={i} addonBefore={fee.key} placeholder="费用" type='number' style={{ marginBottom: 2 }} value={fee.value} onChange={
            e => {
              fee.value = toNum(e.target.value);
              local.auto();
            }
          } />
        ))}
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="币种" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="人名币" value={local.data.currency} onChange={e => local.data.currency = e.target.value} />
      </Form.Item>
    </Form>
  </Modal>}</Observer>
}