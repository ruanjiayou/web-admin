import React from 'react'
import { Observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
// import LoadingView from '../HolderView/LoadingView'
import { Table, Popconfirm, Switch, notification, Select, } from 'antd';
import { FormOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons'

const { Column } = Table;

export default function ResourceList({ isLoading, items, children, search, store, ...props }) {
	return <Observer>{() => {
		if (isLoading) {
			// TODO: com
			// return <LoadingView />
			return <div></div>
		} else if (!items || items.length === 0) {
			return <div>暂无数据</div>
		} else {
			// return <div>{items.map(item => <ResourceItem data={item} key={item.id} {...props} />)}</div>
			return <Table dataSource={items} rowKey="id" scroll={{ y: 600 }} loading={store.loading} pagination={{
				pageSize: 20,
				current: store.search_page,
				total: store.count,
			}} onChange={(page) => {
				store.search_page = page.current
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
							record.toggleStatus().then(() => {
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
							record.toggleOpen().then(() => {
								record.setKV('open', !record.open)
								notification.info({ message: '修改成功' })
							}).catch(e => {
								notification.info({ message: '修改失败' })
							})
						}} />)}
					</Observer>
				)} />
				<Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
						{record.source_type === 'article' || record.source_type === 'news' ? <Link to={'/project/resource/edit?id=' + record.id} ><FormOutlined /></Link> : <FormOutlined onClick={() => { props.openEdit(record.toJSON()) }} />}
						<Popconfirm title="确定?" icon={<WarningOutlined />} onConfirm={() => { props.destroy(record) }}>
							<DeleteOutlined />
						</Popconfirm>
					</div>
				)} />
			</Table>
		}
	}}</Observer>
}