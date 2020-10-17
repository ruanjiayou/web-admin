import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
// import LoadingView from '../HolderView/LoadingView'
import apis from '../../../api';
import { Table, Popconfirm, Switch, notification, Select, } from 'antd';
import { FormOutlined, DeleteOutlined, WarningOutlined, CloudServerOutlined, SyncOutlined } from '@ant-design/icons'

const { Column } = Table;

export default function ResourceList({ items, children, categories, search, local, ...props }) {
	return <Observer>{() => (
		<Table dataSource={items} rowKey="id" scroll={{ y: 600 }} loading={local.isLoading} pagination={{
			pageSize: 20,
			current: local.search_page,
			total: local.count,
		}} onChange={(page) => {
			local.search_page = page.current
			search()
		}}>
			<Column title="标题" dataIndex="title" key="title" />
			<Column title="分类" width={100} dataIndex="type" key="type" render={(text, record) => (
				<Observer>{() => (
					<Select value={record.type} onChange={v => {
						apis.updateResource({ id: record.id, type: v }).then(() => {
							record.type = v
							notification.info({ message: '修改成功' })
						}).catch(e => {
							console.log(e.message)
							notification.info({ message: '修改失败' })
						})
					}}>
						{(categories[record.source_type] || []).map(it => <Select.Option key={it.id} value={it.name === '全部' ? '' : it.name}>{it.name}</Select.Option>)}
					</Select>
				)}
				</Observer>
			)} />
			<Column title="连载" width={100} dataIndex="status" key="status" render={(text, record) => (
				<Observer>{() => (
					<Switch checked={record.status === 'loading'} onClick={e => {
						apis.updateResource({ id: record.id, status: record.status === 'loading' ? 'finished' : 'loading' }).then(() => {
							record.status = record.status === 'loading' ? 'finished' : 'loading'
							notification.info({ message: '修改成功' })
						}).catch(e => {
							notification.info({ message: '修改失败' })
						})
					}} />
				)}
				</Observer>
			)} />
			<Column title="公开" width={100} dataIndex="open" key="open" render={(text, record) => (
				<Observer>{() => (
					<Switch checked={record.open} onClick={e => {
						apis.updateResource({ id: record.id, open: !record.open }).then(() => {
							record.open = !record.open
							notification.info({ message: '修改成功' })
						}).catch(e => {
							notification.info({ message: '修改失败' })
						})
					}} />)}
				</Observer>
			)} />
			<Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
					{record.source_type === 'article' || record.source_type === 'news' ? <Link style={{ display: 'inherit' }} to={'/admin/home/resource-manage/edit?id=' + record.id} ><FormOutlined /></Link> : <FormOutlined onClick={() => { props.openEdit(record) }} />}
					<CloudServerOutlined title="保存" onClick={() => props.store(record)} />
					<Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => {
						props.destroy(record)
					}}>
						<DeleteOutlined />
					</Popconfirm>
					<SyncOutlined title="抓取image" onClick={() => {
						apis.grabImages({ id: record.id }).then(res => {
							notification.info({ message: `success:${res.data.success} fail:${res.data.fail}` })
						})
					}} />
				</div>
			)} />
		</Table>
	)}</Observer>
}