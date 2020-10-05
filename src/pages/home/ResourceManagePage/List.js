import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
// import LoadingView from '../HolderView/LoadingView'
import apis from '../../../api';
import { Table, Popconfirm, Switch, notification, Select, } from 'antd';
import { FormOutlined, DeleteOutlined, WarningOutlined, CloudServerOutlined } from '@ant-design/icons'

const { Column } = Table;

export default function ResourceList({ items, children, search, local, ...props }) {
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
					<Select value={""}>
						<Select.Option value="">全部</Select.Option>
					</Select>
				)}
				</Observer>
			)} />
			<Column title="连载" width={100} dataIndex="status" key="status" render={(text, record) => (
				<Observer>{() => (
					<Switch checked={record.status === 'loading'} onClick={e => {
						apis.updateResource({ id: record.id, status: record.status === 'loading' ? 'finished' : 'loading' }).then(() => {
							record.setKV('status', record.status === 'loading' ? 'finished' : 'loading')
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
							// record.setKV('open', !record.open)
							record.open = !record.open
							notification.info({ message: '修改成功' })
						}).catch(e => {
							notification.info({ message: '修改失败' })
						})
					}} />)}
				</Observer>
			)} />
			<Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
					{record.source_type === 'article' || record.source_type === 'news' ? <Link to={'/admin/home/resource-manage/edit?id=' + record.id} ><FormOutlined /></Link> : <FormOutlined onClick={() => { props.openEdit(record) }} />}
					<CloudServerOutlined title="保存" onClick={() => props.store(record)} />
					<Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => {
						props.destroy(record)
					}}>
						<DeleteOutlined />
					</Popconfirm>
				</div>
			)} />
		</Table>
	)}</Observer>
}