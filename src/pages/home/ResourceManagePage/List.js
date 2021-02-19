import React, { Fragment } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { toJS } from 'mobx'
// import LoadingView from '../HolderView/LoadingView'
import apis from '../../../api';
import { Table, Popconfirm, Switch, notification, Select, Tag, Input, Popover } from 'antd';
import { FormOutlined, DeleteOutlined, WarningOutlined, CloudServerOutlined, SyncOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Icon, VisualBox } from '../../../component'
import { AlignAround } from '../../../component/style'

const { Column } = Table;


export default function ResourceList({ items, children, categories, search, local, ...props }) {
	const state = useLocalStore(() => ({
		updating: false
	}))
	return <Observer>{() => (
		<Table dataSource={items} rowKey="id" scroll={{ y: 'calc(100vh - 240px)' }} loading={local.isLoading} pagination={{
			pageSize: 20,
			current: local.search_page,
			total: local.count,
		}} onChange={(page) => {
			local.search_page = page.current
			search()
		}}>
			<Column title="标题" dataIndex="title" key="title" render={(text, record) => {
				let url = ''
				if (record.source_type === 'novel') {
					url = (window.origin + '/novel/home/BookInfo?home.tab=&BookInfo.id=' + record.id)
				} else if (['news', 'article', 'private'].includes(record.source_type)) {
					url = (window.origin + '/novel/home/Article?home.tab=QD7vNfJCU&Article.id=' + record.id)
				} else if (['image'].includes(record.source_type)) {
					url = (window.origin + '/novel/groups/GroupTree/Image?GroupTree.name=image&Image.id=' + record.id)
				}
				return <a style={{ color: '#1890ff', cursor: 'pointer' }} title={url} href={url} onClick={(e) => {
					e.preventDefault()
					if (url) {
						window.open(url)
					} else {
						notification.info({ message: '类型不可预览' })
					}
				}}>{text}</a>
			}} />
			<Column title="类型" width={100} dataIndex="source_type" key="source_type" render={(text, record) => (
				<Observer>{() => (
					<Select value={record.source_type} onChange={async (v) => {
						try {
							state.updating = true
							await apis.updateResource({ id: record.id, source_type: v })
							record.source_type = v
							notification.info({ message: '修改成功' })
						} catch (e) {
							notification.info({ message: '修改失败' })
						} finally {
							state.updating = false
						}
					}}>
						<Select.Option value="">全部</Select.Option>
						<Select.Option value="file">文件</Select.Option>
						<Select.Option value="image">图片</Select.Option>
						<Select.Option value="animation">动漫</Select.Option>
						<Select.Option value="music">音频</Select.Option>
						<Select.Option value="video">视频</Select.Option>
						<Select.Option value="novel">小说</Select.Option>
						<Select.Option value="article">文章</Select.Option>
						<Select.Option value="news">资讯</Select.Option>
						<Select.Option value="private">私人</Select.Option>
					</Select>
				)}
				</Observer>
			)} />
			<Column title="分类" dataIndex="types" key="types" render={(text, record) => (
				<Observer>{() => (
					<Fragment>
						{record.types.map(type => <Tag key={type} closable={!state.updating} onClose={async () => {
							try {
								state.updating = true
								const types = record.types.filter(item => item !== type)
								await apis.updateResource({ id: record.id, types })
								record.types = types
								notification.info({ message: '修改成功' })
							} catch (e) {
								notification.info({ message: '修改失败' })
							} finally {
								state.updating = false
							}
						}}>{type}</Tag>)}
						<div style={{ marginTop: 10 }}>
							<Input.Group>
								<Input
									type="text"
									size="small"
									style={{ width: 50 }}
									disabled={state.updating}
								/>
								<Tag onClick={async (e) => {
									if (state.updating) {
										return
									}
									if (e.currentTarget) {
										const inp = e.currentTarget.previousElementSibling
										const type = inp.value.trim()
										const types = record.types.map(item => item)
										if (types.includes(type)) {
											return notification.info('类型已存在')
										}
										try {
											state.updating = true
											await apis.updateResource({ id: record.id, types: [...types, type] })
											record.types = [...types, type]
											notification.info({ message: '修改成功' })
										} catch (e) {
											notification.info({ message: '修改失败' })
										} finally {
											state.updating = false
											inp.value = ''
										}

									}
								}} style={{ background: '#fff', borderStyle: 'dashed' }}>
									<PlusCircleOutlined />
								</Tag>
							</Input.Group>
						</div>
					</Fragment>
				)}
				</Observer>
			)} />
			<Column title="标签" dataIndex="types" key="types" render={(text, record) => (
				<Observer>{() => (
					<Fragment>
						{record.tags.map(tag => <Tag key={tag} closable={!state.updating} onClose={async () => {
							try {
								state.updating = true
								const tags = record.tags.filter(item => item !== tag)
								await apis.updateResource({ id: record.id, tags })
								record.tags = tags
								notification.info({ message: '修改成功' })
							} catch (e) {
								notification.info({ message: '修改失败' })
							} finally {
								state.updating = false
							}
						}}>{tag}</Tag>)}
						<div style={{ marginTop: 10 }}>
							<Input.Group>
								<Input
									type="text"
									size="small"
									style={{ width: 50 }}
									disabled={state.updating}
								/>
								<Tag onClick={async (e) => {
									if (state.updating) {
										return
									}
									if (e.currentTarget) {
										const inp = e.currentTarget.previousElementSibling
										const tag = inp.value.trim()
										const tags = record.tags.map(item => item)
										if (tags.includes(tag)) {
											return notification.info('类型已存在')
										}
										try {
											state.updating = true
											await apis.updateResource({ id: record.id, tags: [...tags, tag] })
											record.tags = [...tags, tag]
											notification.info({ message: '修改成功' })
										} catch (e) {
											notification.info({ message: '修改失败' })
										} finally {
											state.updating = false
											inp.value = ''
										}

									}
								}} style={{ background: '#fff', borderStyle: 'dashed' }}>
									<PlusCircleOutlined />
								</Tag>
							</Input.Group>
						</div>
					</Fragment>
				)}
				</Observer>
			)} />
			<Column title="系列" width={100} dataIndex="series" key="series" render={(text, record) => (
				<Observer>{() => (<span style={{ backgroundColor: '#eee', border: '1px solid #eee', borderRadius: 4, padding: '3px 5px' }} onClick={async () => {
					const res = prompt('请输入系列名')
					try {
						if (res) {
							state.updating = true
							await apis.updateResource({ id: record.id, series: res })
							record.series = res
							notification.info({ message: '修改成功' })
						}
					} catch (e) {
						notification.info({ message: '修改失败' })
					} finally {
						state.updating = false
					}

				}}>{record.series || '无'}</span>
				)}
				</Observer>
			)} />
			<Column title="连载" width={100} dataIndex="status" key="status" render={(text, record) => (
				<Observer>{() => (
					<Switch checked={record.status === 'loading'} onClick={async (e) => {
						try {
							state.updating = true
							await apis.updateResource({ id: record.id, status: record.status === 'loading' ? 'finished' : 'loading' })
							record.status = record.status === 'loading' ? 'finished' : 'loading'
							notification.info({ message: '修改成功' })
						} catch (e) {
							notification.info({ message: '修改失败' })
						} finally {
							state.updating = false
						}
					}} />
				)}
				</Observer>
			)} />
			<Column title="公开" width={100} dataIndex="open" key="open" render={(text, record) => (
				<Observer>{() => (
					<Switch checked={record.open} onClick={async (e) => {
						try {
							state.updating = true
							await apis.updateResource({ id: record.id, open: !record.open })
							record.open = !record.open
							notification.info({ message: '修改成功' })
						} catch (e) {
							notification.info({ message: '修改失败' })
						} finally {
							state.updating = false
						}
					}} />)}
				</Observer>
			)} />
			{/* <Column title="快速编辑" render={(text, record)=>(
				<FormOutlined onClick={() => { props.fastEdit(toJS(record)) }} />
			)}/> */}
			<Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
					<Popover trigger="hover" title="操作" placement="topRight" content={<AlignAround>
						<VisualBox visible={record.source_type === 'article' || record.source_type === 'news'}>
							<Link title="编辑" style={{ display: 'inherit' }} to={'/admin/home/resource-manage/edit?id=' + record.id} ><FormOutlined /></Link>
						</VisualBox>
						<VisualBox visible={record.source_type === 'video' || record.source_type === 'image'}>
							<Link title="编辑" style={{ display: 'inherit' }} to={'/admin/home/resource-manage/edit-multi?id=' + record.id} ><FormOutlined /></Link>
						</VisualBox>
						<VisualBox visible={record.source_type === 'novel'}>
							<CloudServerOutlined title="保存小说" onClick={() => props.store(record)} />
						</VisualBox>
						<VisualBox visible={record.source_type === 'article' || record.source_type === 'news'}>
							<SyncOutlined title="抓取image" onClick={() => {
								apis.grabImages({ id: record.id }).then(res => {
									notification.info({ message: `success:${res.data.success} fail:${res.data.fail}` })
								})
							}} />
						</VisualBox>
						<Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => {
							props.destroy(record)
						}}>
							<DeleteOutlined title="删除" />
						</Popconfirm>
					</AlignAround>}>
						<Icon type="more" style={{ padding: '4px 8px' }} />
					</Popover>

				</div>
			)} />
		</Table>
	)}</Observer>
}