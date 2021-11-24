import React, { Fragment } from 'react'
import { Observer, useLocalStore, } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
// import LoadingView from '../HolderView/LoadingView'
import apis from '../../../api';
import { Table, Popconfirm, Switch, notification, Select, Tag, Popover, Divider, } from 'antd';
import { FormOutlined, DeleteOutlined, WarningOutlined, CloudServerOutlined, SyncOutlined, UploadOutlined } from '@ant-design/icons'
import { Icon, VisualBox, EditTag } from '../../../component'
import { AlignAround } from '../../../component/style'
import store from '../../../store'

const { Column } = Table;

export default function ResourceList({ items, children, categories, search, local, ...props }) {
	const state = useLocalStore(() => ({
		updating: false,
		syncItems: {},
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
			<Column title="封面" width={70} dataIndex="poster" key="id" align="center" render={(text, record) => (
				<Observer>{() => (
					<div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
						<img src={record.poster.startsWith('http') || record.thumbnail.startsWith('http') ? record.poster || record.thumbnail : store.app.imageLine + (record.poster || record.thumbnail || '/images/poster/nocover.jpg')}
							style={{ width: 60, height: 60, borderRadius: '50%', marginRight: 10, }}
							alt=""
						/>
						<Icon type={'download'} style={{ position: 'absolute', display: record.poster.startsWith('/') ? 'none' : 'block', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} onClick={async (e) => {
							if (record.poster === '') {
								const poster = prompt('请输入封面地址');
								if (poster) {
									await apis.updateResource({ id: record.id, poster })
									await apis.downloadResourceCover({ id: record.id, })
									search()
									notification.info({ message: '下载成功' })
								}
							} else if (record.poster.startsWith('http')) {
								try {
									await apis.downloadResourceCover({ id: record.id, })
									search()
									notification.info({ message: '下载成功' })
								} catch (e) {
									notification.info({ message: '下载失败' })
								}
							}
						}} />
					</div>
				)}
				</Observer>
			)} />
			<Column title="标题" width={200} dataIndex="title" key="title" render={(text, record) => {
				let url = ''
				if (record.source_type === 'video') {
					url = (window.origin + '/novel/groups/GroupTree/VideoInfo?GroupTree.name=video&VideoInfo.id=' + record.id)
				} else if (record.source_type === 'novel') {
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
			<Column title="分类" width={120} dataIndex="types" key="types" render={(text, record) => (
				<Observer>{() => (
					<Fragment>
						{record.types.map(type => <Tag key={type} style={{ marginBottom: 5 }} closable={true} onClose={async () => {
							try {
								const types = record.types.filter(item => item !== type)
								await apis.updateResource({ id: record.id, types })
								record.types = types
								notification.info({ message: '修改成功' })
							} catch (e) {
								notification.info({ message: '修改失败' })
							}
						}}>{type}</Tag>)}
						<EditTag save={async (type) => {
							type = type.trim();
							const types = record.types.map(item => item)
							if (types.includes(type)) {
								return notification.info('类型已存在')
							}
							try {
								await apis.updateResource({ id: record.id, types: [...types, type] })
								record.types = [...types, type]
								notification.info({ message: '修改成功' })
							} catch (e) {
								notification.info({ message: '修改失败' })
							}
						}} />
					</Fragment>
				)}
				</Observer>
			)} />
			<Column title="标签" dataIndex="types" key="types" width={150} render={(text, record) => (
				<Observer>{() => (
					<Fragment>
						{record.tags.map((tag, i) => <Tag key={i} style={{ marginBottom: 5 }} closable={!state.updating} onClose={async () => {
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
						<EditTag save={async (tag) => {
							tag = tag.trim();
							const tags = record.tags.map(item => item)
							if (tags.includes(tag)) {
								return notification.info('类型已存在')
							}
							try {
								await apis.updateResource({ id: record.id, tags: [...tags, tag] })
								record.tags = [...tags, tag]
								notification.info({ message: '修改成功' })
							} catch (e) {
								notification.info({ message: '修改失败' })
							}
						}} />
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
			<Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
					<FormOutlined title="快速编辑" onClick={() => { props.fastEdit(record) }} />
					<Popover trigger="hover" title="操作" placement="topRight" content={<AlignAround>
						<Popconfirm title="确定同步到线上?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {
							if (state.syncItems[record.id]) {
								alert('正在同步中...')
							} else {
								state.syncItems[record.id] = true
								apis.syncOne(record).catch(() => {
									alert('同步失败')
								}).finally(() => {
									state.syncItems[record.id] = false
								})
							}
						}}>
							<UploadOutlined spin={state.syncItems[record.id] ? true : false} />
						</Popconfirm>
						<VisualBox visible={['article', 'news'].includes(record.source_type)}>
							<Link title="编辑" style={{ display: 'inherit' }} to={'/admin/home/resource-manage/edit?id=' + record.id} ><FormOutlined /></Link>
						</VisualBox>
						<VisualBox visible={record.source_type === 'video' || record.source_type === 'image'}>
							<Link title="编辑" style={{ display: 'inherit' }} to={'/admin/home/resource-manage/edit-multi?id=' + record.id} ><FormOutlined /></Link>
						</VisualBox>
						<VisualBox visible={record.source_type === 'novel'}>
							<Divider type="vertical" />
							<CloudServerOutlined title="保存小说" onClick={() => props.store(record)} />
						</VisualBox>
						<VisualBox visible={record.source_type === 'article' || record.source_type === 'news' || record.source_type === 'image'}>
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