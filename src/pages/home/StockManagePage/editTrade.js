import React, { useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Button, Modal, Form, Input, Card, Select, Divider, notification, Table, message } from 'antd';
import * as math from 'mathjs'

const lb = { span: 6, offset: 3 }, rb = { span: 12 }
export default function ({ data, save, cancel }) {
  const iref = useRef(null)
  const local = useLocalStore(() => ({
    data: data,
    isLoading: false,
  }))
  return <Observer>{() => <Modal
    visible={true}
    style={{ overflow: 'auto', padding: 0 }}
    width={600}
    title={local.inster ? '添加记录' : '修改记录'}
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
      <Form.Item style={{ marginBottom: 5 }} label="交收日期" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="交收日期" autoFocus ref={ref => iref.current = ref} value={local.data.settlement} onChange={e => local.data.settlement = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="证券名称" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="证券名称" value={local.data.name} onChange={e => local.data.name = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="交易类别" labelCol={lb} wrapperCol={rb}>
        <Select value={local.data.type} onChange={value => local.data.type = value}>
          <Select.Option value="">请选择</Select.Option>
          <Select.Option value={1}>证券买入</Select.Option>
          <Select.Option value={2}>证券卖出</Select.Option>
          <Select.Option value={3}>红利入账</Select.Option>
          <Select.Option value={4}>股息个税征收</Select.Option>
          <Select.Option value={5}>利息归本</Select.Option>
          <Select.Option value={6}>银行转证券</Select.Option>
          <Select.Option value={7}>证券转银行</Select.Option>
          <Select.Option value={8}>指定交易</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="成交数量" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="成交数量" disabled={data.type === 5} type='number' value={local.data.amount} onChange={e => local.data.amount = parseFloat(e.target.value)} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="成交价格" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="成交价格" disabled={data.type === 5} type='number' value={local.data.price} onChange={e => {
          local.data.price = parseFloat(e.target.value) || 0
          local.data.trade = math.multiply(math.bignumber(local.data.amount), math.bignumber(local.data.price)).toNumber()
        }} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="成交金额" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="成交金额" value={local.data.trade} type='number' onChange={e => {
          local.data.trade = e.target.value
          if (local.data.type === 3) {
            local.data.total = e.target.value
          }
        }} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="费用合计" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="0" disabled={data.type === 5} value={local.data.fee} onChange={e => {
          local.data.fee = e.target.value
          const k = [1, 4, 7].includes(local.data.type) ? -1 : 1
          local.data.total = math.subtract(math.multiply(math.bignumber(local.data.trade), k), math.bignumber(local.data.fee)).toNumber()
        }} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="发生金额" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="发生金额" value={local.data.total} type='number' onChange={e => local.data.total = e.target.value} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="费用明细" labelCol={lb} wrapperCol={rb}>
        {local.data.fees.map((fee, i) => (
          <Input key={i} addonBefore={fee.key} placeholder="费用" type='number' value={fee.value} onChange={e => fee.value = e.target.value} />
        ))}
      </Form.Item>
      <Form.Item style={{ marginBottom: 5 }} label="币种" labelCol={lb} wrapperCol={rb}>
        <Input placeholder="人名币" value={local.data.currency} onChange={e => local.data.currency = e.target.value} />
      </Form.Item>
    </Form>
  </Modal>}</Observer>
}