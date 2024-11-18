import React, { Fragment, useCallback } from 'react'
import { Observer, useLocalStore, } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
// import LoadingView from '../HolderView/LoadingView'
import apis from '../../../api';
import { Table, Popconfirm, notification, Select, Tag, Divider, Button } from 'antd';
import { FormOutlined, DeleteOutlined, WarningOutlined, CloudServerOutlined, SyncOutlined, FieldTimeOutlined, CloudSyncOutlined, LinkOutlined, SwitcherOutlined, DownloadOutlined, LoadingOutlined, } from '@ant-design/icons'
import { Icon, VisualBox, EditTag } from '../../../component'
import { CenterXY, FullWidth, FullWidthAuto, FullWidthFix } from '../../../component/style'
import store from '../../../store'
import Clipboard from 'react-clipboard.js';
import styled from 'styled-components';
import moment from 'moment';

const { Column } = Table;
const StatusMap = {
  1: 'plus',
  2: 'sync-horizon',
  3: 'close',
  4: 'check',
}
const Label = styled.span`
  color: red;
`
export default function ResourceList({ items, children, categories, search, local, ...props }) {
  const state = useLocalStore(() => ({
    updating: false,
    syncItems: {},
    resource_id: '',
    loading: false,
    resource: null,
  }));
  const getDetail = useCallback(async () => {
    const resp = await apis.getResource({ _id: state.resource_id });
    if (resp.code === 0) {
      state.resource = resp.data;
      state.loading = false;
    }
  }, [state.resource_id]);
  return <Observer>{() => (
    <FullWidth style={{ alignItems: 'flex-start', height: '100%' }}>
      <FullWidthAuto style={{ overflowX: 'auto' }}>
        <Table dataSource={items} rowKey="_id" scroll={{ y: 'calc(100vh - 233px)' }} loading={local.isLoading} pagination={{
          pageSize: 20,
          current: local.search_page,
          total: local.count,
        }} onChange={(page) => {
          local.search_page = page.current
          search()
        }}>
          <Column title="封面" width={70} dataIndex="poster" key="_id" align="center" render={(text, record) => (
            <Observer>{() => (
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <img src={record.poster.startsWith('http') || record.thumbnail.startsWith('http') ? record.thumbnail || record.poster : store.app.imageLine + (record.thumbnail || record.poster || '/images/poster/nocover.jpg')}
                  style={{ width: 60, height: 60, borderRadius: '50%', marginRight: 10, }}
                  alt=""
                />
                <Icon type={'download'} style={{ position: 'absolute', display: record.poster.startsWith('/') || record.thumbnail.startsWith('/') ? 'none' : 'block', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} onClick={async (e) => {
                  if (record.poster === '' && record.thumbnail === '') {
                    const poster = prompt('请输入封面地址');
                    if (poster) {
                      await apis.updateResource({ _id: record._id, poster })
                      await apis.downloadResourceCover({ _id: record._id, })
                      search()
                      notification.info({ message: '下载成功' })
                    }
                  } else if (record.poster.startsWith('http') || record.thumbnail.startsWith('http')) {
                    try {
                      await apis.downloadResourceCover({ _id: record._id, })
                      search()
                      notification.info({ message: '下载成功' })
                    } catch (e) {
                      notification.info({ message: '下载失败' })
                    }
                  }
                }} />
                <Icon type={StatusMap[record.status] || 'plus'} style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: 20 }} />
              </div>
            )}
            </Observer>
          )} />
          <Column title="" width={20} dataIndex="origin" key="origin" render={(url, record) => {
            return <CenterXY>
              {url && <a href={url} target='_blank'><LinkOutlined /></a>}
              &nbsp;&nbsp;
              <Clipboard data-clipboard-text={record._id} component={'a'}>
                <SwitcherOutlined />
              </Clipboard>
            </CenterXY>
          }} />
          <Column title="标题" width={200} dataIndex="title" key="title" render={(text, record) => {
            let isDev = window.origin.includes('localhost') ? true : false;
            let url = isDev ? 'https://192.168.0.124' : window.origin;
            if (['video', 'movie', 'short', 'animation'].includes(record.source_type)) {
              url += ('/novel/groups/GroupTree/VideoInfo?GroupTree.name=video&VideoInfo.id=' + record._id)
            } else if (record.source_type === 'novel') {
              url += ('/novel/home/BookInfo?home.tab=&BookInfo.id=' + record._id)
            } else if (['article', 'private'].includes(record.source_type)) {
              url += ('/novel/home/Article?home.tab=QD7vNfJCU&Article.id=' + record._id)
            } else if (['image'].includes(record.source_type)) {
              url += ('/novel/groups/GroupTree/Image?GroupTree.name=image&Image.id=' + record._id)
            } else if (record.source_type === 'post') {
              url += ('/novel/home/Post?home.tab=QD7vNfJCU&Post.id=' + record._id)
            }
            return <Fragment>
              <a style={{ color: '#1890ff', cursor: 'pointer' }} className='line2' title={url} href={url} onClick={(e) => {
                e.preventDefault()
                if (url) {
                  window.open(url)
                } else {
                  notification.info({ message: '类型不可预览' })
                }
              }}>{record.source_type === 'post' ? record.title || record.desc || record.content : text}</a>
              <span><FieldTimeOutlined /> {moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Fragment>
          }} />
          <Column title="类型" width={100} dataIndex="source_type" key="source_type" render={(text, record) => (
            <Observer>{() => (
              <Select value={record.source_type} onChange={async (v) => {
                try {
                  state.updating = true
                  await apis.updateResource({ _id: record._id, source_type: v })
                  record.source_type = v
                  notification.info({ message: '修改成功' })
                } catch (e) {
                  notification.info({ message: '修改失败' })
                } finally {
                  state.updating = false
                }
              }}>
                {store.resource_types.map(resource_type => (
                  <Select.Option value={resource_type.name} key={resource_type.name}>{resource_type.title}</Select.Option>
                ))}
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
                    await apis.updateResource({ _id: record._id, types })
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
                    await apis.updateResource({ _id: record._id, types: [...types, type] })
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
          {/* <Column title="标签" dataIndex="types" key="types" width={150} render={(text, record) => (
				<Observer>{() => (
					<Fragment>
						<div style={{ maxHeight: 150, overflow: 'auto' }}>
							{record.tags.map((tag, i) => <Tag key={i} style={{ marginBottom: 5 }} closable={!state.updating} onClose={async () => {
								try {
									state.updating = true
									const tags = record.tags.filter(item => item !== tag)
									await apis.updateResource({ _id: record._id, tags })
									record.tags = tags
									notification.info({ message: '修改成功' })
								} catch (e) {
									notification.info({ message: '修改失败' })
								} finally {
									state.updating = false
								}
							}}>{tag}</Tag>)}
						</div>
						<EditTag save={async (tag) => {
							tag = tag.trim();
							const tags = record.tags.map(item => item)
							if (tags.includes(tag)) {
								return notification.info('类型已存在')
							}
							try {
								await apis.updateResource({ _id: record._id, tags: [...tags, tag] })
								record.tags = [...tags, tag]
								notification.info({ message: '修改成功' })
							} catch (e) {
								notification.info({ message: '修改失败' })
							}
						}} />
					</Fragment>
				)}
				</Observer>
			)} /> */}
          {/* <Column title="系列" width={100} dataIndex="series" key="series" render={(text, record) => (
				<Observer>{() => (<span style={{ backgroundColor: '#eee', border: '1px solid #eee', borderRadius: 4, padding: '3px 5px' }} onClick={async () => {
					const res = prompt('请输入系列名')
					try {
						if (res) {
							state.updating = true
							await apis.updateResource({ _id: record._id, series: res })
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
			)} /> */}
          {/* <Column title="连载" width={100} dataIndex="status" key="status" render={(text, record) => (
				<Observer>{() => (
					<Switch checked={record.status === store.constant.MEDIA_STATUS.loading} onClick={async (e) => {
						try {
							state.updating = true
							await apis.updateResource({ _id: record._id, status: record.status === store.constant.RESOURCE_STATUS.loading ? store.constant.RESOURCE_STATUS.finished : store.constant.RESOURCE_STATUS.loading })
							record.status = record.status === store.constant.RESOURCE_STATUS.loading ? store.constant.RESOURCE_STATUS.finished : store.constant.RESOURCE_STATUS.loading
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
			 */}
          <Column title="操作" width={100} dataIndex="action" key="action" align="center" render={(text, record) => (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
              <FormOutlined title="快速编辑" onClick={() => { props.fastEdit(record) }} />
              <Divider type="vertical" />
              <Popconfirm title="确定同步到es?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={async () => {
                if (state.syncItems[record._id]) {
                  alert('正在同步中...')
                } else {
                  state.syncItems[record._id] = true
                  apis.sync2es([record._id]).catch(() => {
                    alert('同步失败')
                  }).finally(() => {
                    state.syncItems[record._id] = false
                  })
                }
              }}>
                <SyncOutlined title='同步es' spin={state.syncItems[record._id] ? true : false} />
              </Popconfirm>
              <Divider type="vertical" />
              <VisualBox visible={['article', 'post'].includes(record.source_type)}>
                <Link title="编辑" style={{ display: 'inherit' }} to={'/admin/home/resource-manage/edit-multi?_id=' + record._id} target="_blank"><FormOutlined /></Link>
              </VisualBox>
              <Divider type="vertical" />
              <VisualBox visible={['video', 'image', 'music', 'movie', 'animation'].includes(record.source_type)}>
                <Link title="编辑" style={{ display: 'inherit' }} target="_blank" to={'/admin/home/resource-manage/edit-multi?_id=' + record._id} ><FormOutlined /></Link>
              </VisualBox>
              <Divider type="vertical" />
              <VisualBox visible={record.source_type === 'movie' && record.status === store.constant.MEDIA_STATUS.loading}>
                <DownloadOutlined onClick={() => {
                  const url = new URL(record.origin);
                  url.searchParams.set('crawl', '1')
                  window.open(url.href, '_blank');
                }} />
              </VisualBox>
              <VisualBox visible={record.source_type === 'novel'}>
                <Divider type="vertical" />
                <CloudServerOutlined title="保存小说" onClick={() => props.store(record)} />
              </VisualBox>
              <VisualBox visible={record.source_type === 'article'}>
                <CloudSyncOutlined title="抓取image" onClick={() => {
                  apis.grabImages({ _id: record._id }).then(res => {
                    notification.info({ message: `success:${res.data.success} fail:${res.data.fail}` })
                  })
                }} />
              </VisualBox>
              <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => {
                props.destroy(record)
              }}>
                <DeleteOutlined title="删除" />
              </Popconfirm>
              <Divider type="vertical" />
              <Button type="text" onClick={() => {
                state.loading = true;
                state.resource = null;
                state.resource_id = record._id;
                getDetail();
              }}>详情</Button>
            </div>
          )} />
        </Table>
      </FullWidthAuto>
      <FullWidthFix style={{ display: state.resource_id ? 'flex' : 'none', width: 300, height: '100%', overflow: 'auto' }}>
        {state.loading || !state.resource ? <CenterXY style={{ width: '100%' }}><LoadingOutlined /></CenterXY> : <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box', padding: '20px 0 0 10px', }}>
          <Icon type="close" style={{ position: 'absolute', right: 5, top: 5 }} onClick={() => { state.loading = false; state.resource = null; state.resource_id = '' }} />
          <div><Label>标题</Label></div>
          <h2 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{state.resource.title}</h2>
          <div><Label>内容</Label></div>
          <p style={{ maxHeight: '250px', overflowY: 'auto' }}>{state.resource.content}</p>
          <div><Label>创建时间:</Label> {new Date(state.resource.createdAt).toISOString()}</div>
          <div><Label>发布时间:</Label> {state.resource.publishedAt ? new Date(state.resource.publishedAt).toISOString() : state.resource.publishedAt}</div>
          <div><Label>时长:</Label> {state.resource.words}</div>
          <div><Label>图片({state.resource.images.length})</Label></div>
          {state.resource.images.map(m => <img src={m.path} style={{ width: '100%' }} />)}
          <div><Label>视频({state.resource.videos.length})</Label></div>
          {state.resource.videos.map(v => <video style={{ width: '100%' }} controls src={v.path} preload='metadata'></video>)}
        </div>}
      </FullWidthFix>
    </FullWidth>
  )}</Observer>
}