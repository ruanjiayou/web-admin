import React, { Fragment, useCallback } from 'react'
import { Observer, useLocalStore, } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import apis from '../../../api';
import { Table, Popconfirm, notification, Select, Tag, Divider, Button, Input } from 'antd';
import { FormOutlined, DeleteOutlined, WarningOutlined, CloudServerOutlined, SyncOutlined, FieldTimeOutlined, CloudSyncOutlined, LinkOutlined, SwitcherOutlined, DownloadOutlined, LoadingOutlined, } from '@ant-design/icons'
import { Icon, VisualBox, EditTag } from '../../../component'
import { CenterXY, FullHeight, FullWidth, FullWidthAuto, FullWidthFix } from '../../../component/style'
import store from '../../../store'
import Clipboard from 'react-clipboard.js';
import styled from 'styled-components';
import moment from 'moment';
import { useEffectOnce } from 'react-use';

const { Column } = Table;
const Label = styled.span`
  color: red;
`
const StatusMap = {
  1: 'plus',
  2: 'sync-horizon',
  3: 'close',
  4: 'check',
};

export default function MediaList({ ...props }) {
  const local = useLocalStore(() => ({
    isLoading: false,
    items: [],
    count: 0,
    page: 1,
    search_key: 'mid',
    search_value: '',
    search_page: 1,
    search_status: '',
    type: window.location.pathname.split('/').pop()
  }));
  const onSearch = useCallback(() => {
    apis.getMedias(local.type, { page: local.search_page, status: local.search_status, [local.search_key]: local.search_value }).then(result => {
      if (result.code === 0) {
        local.items = result.data;
      }
    })
  })
  useEffectOnce(() => {
    onSearch();
  })
  return <Observer>{() => (
    <FullHeight>
      <FullWidthFix style={{ padding: '10px 0' }}>
        <Input
          style={{ width: 250 }}
          value={local.search_name}
          addonBefore={<Select value={local.search_key} onChange={value => {
            local.search_key = value;
          }}>
            <Select.Option value="_id">_id</Select.Option>
            <Select.Option value="mid">mid</Select.Option>
          </Select>} onChange={e => {
            local.search_value = e.target.value
          }} onKeyDown={e => {
            if (e.keyCode === 13) {
              onSearch()
            }
          }} />
        <Divider type="vertical" />
        <Select style={{ width: 100 }} value={local.search_status} onChange={value => {
          local.search_status = value
          local.search_page = 1
          onSearch()
        }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value={store.constant.MEDIA_STATUS.init}>初始化</Select.Option>
          <Select.Option value={store.constant.MEDIA_STATUS.loading}>下载</Select.Option>
          <Select.Option value={store.constant.MEDIA_STATUS.finished}>成功</Select.Option>
          <Select.Option value={store.constant.MEDIA_STATUS.fail}>失败</Select.Option>
          <Select.Option value={store.constant.MEDIA_STATUS.transcoding}>转码</Select.Option>
        </Select>
        <Divider type="vertical" />
        <Button type="primary" onClick={() => {
          onSearch()
        }}>查询</Button>
      </FullWidthFix>
      <FullWidthAuto>
        <Table dataSource={local.items} rowKey="_id" loading={local.isLoading} pagination={{
          pageSize: 20,
          current: local.search_page,
          total: local.count,
        }} onChange={(page) => {
          local.search_page = page.current
          onSearch()
        }}>
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
            } else if (record.source_type === 'comic') {
              url += ('/novel/home/ComicInfo?home.tab=QD7vNfJCU&ComicInfo.id=' + record._id)
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
          <Column title="链接" dataIndex={'url'} key='url' render={text => (
            <span style={{ wordBreak: 'break-all' }}>{text}</span>
          )} />
          <Column title="路径" dataIndex={'path'} key='path' render={text => (
            <span style={{ wordBreak: 'break-all' }}>{text}</span>
          )} />
          <Column title="类型" width={60} dataIndex="type" key="type" render={(type, record) => (
            <Select value={type}>
              {local.type === 'chapter' ? (<Fragment>
                <Select.Option value={store.constant.CHAPTER_TYPE.chatper}>章节</Select.Option>
                <Select.Option value={store.constant.CHAPTER_TYPE.volume}>卷</Select.Option>
              </Fragment>) : null}
              {local.type === 'image' ? (<Fragment>
                <Select.Option value={store.constant.IMAGE_TYPE.content}>正文</Select.Option>
                <Select.Option value={store.constant.IMAGE_TYPE.gallery}>集合</Select.Option>
                <Select.Option value={store.constant.IMAGE_TYPE.poster}>海报</Select.Option>
                <Select.Option value={store.constant.IMAGE_TYPE.thumbnail}>缩略图</Select.Option>
              </Fragment>) : null}
              {local.type === 'video' ? (<Fragment>
                <Select.Option value={store.constant.VIDEO_TYPE.content}>正文</Select.Option>
                <Select.Option value={store.constant.VIDEO_TYPE.normal}>正片</Select.Option>
                <Select.Option value={store.constant.VIDEO_TYPE.tidbits}>预告</Select.Option>
                <Select.Option value={store.constant.VIDEO_TYPE.trailer}>花絮</Select.Option>
              </Fragment>) : null}
            </Select>
          )} />
          <Column title="状态" width={40} dataIndex="status" key="status" render={(text, record) => (
            <Observer>{() => (
              <Select value={record.status} onChange={async (v) => {
                try {
                  local.isLoading = true
                  await apis.updateMedia(local.type, record._id, { status: v });
                  record.status = v
                  notification.info({ message: '修改成功' })
                } catch (e) {
                  notification.info({ message: '修改失败' })
                } finally {
                  local.isLoading = false
                }
              }}>
                <Select.Option value={store.constant.MEDIA_STATUS.init}>初始化</Select.Option>
                <Select.Option value={store.constant.MEDIA_STATUS.loading}>下载中</Select.Option>
                <Select.Option value={store.constant.MEDIA_STATUS.fail}>已失败</Select.Option>
                <Select.Option value={store.constant.MEDIA_STATUS.finished}>已成功</Select.Option>
              </Select>
            )}
            </Observer>
          )} />
        </Table>
      </FullWidthAuto>
    </FullHeight>
  )}</Observer>
}