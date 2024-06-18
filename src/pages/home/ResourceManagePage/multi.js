import React, { useCallback, Fragment, useRef } from 'react';
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api'
import { Button, notification, Input, Form, Tag, Upload, Select, Divider, Switch, message, Modal, Radio, Row, Col, Popover } from 'antd';
import { SortListView, VisualBox } from '../../../component'
import Icon from '../../../component/Icon'
import qs from 'qs'
import * as _ from 'lodash'
import store from '../../../store'
import { toJS } from 'mobx';
import { PlusCircleOutlined, CloseOutlined, UploadOutlined, LinkOutlined } from '@ant-design/icons'
import api from '../../../api';
import { formatNumber } from '../../../utils/helper'
import { FullWidth, FullHeightAuto, AlignVertical, FullWidthFix, FullHeight } from '../../../component/style';
import TextArea from 'antd/lib/input/TextArea';
import { events } from '../../../utils/events';
import Axios from 'axios';
import Ueditor from '../../../component/Ueditor'

function deepEqual(a, b) {
  const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    let equal = true;
    if (_.isPlainObject(a[k])) {
      if (_.isEmpty(a[k]) && !_.isEmpty(b[k])) {
        return false
      }
      equal = deepEqual(a[k], b[k]);
    } else {
      equal = _.isEqual(a[k], b[k]);
    }
    if (!equal) {
      return false;
    }
  }
  return true;
}

export default function ResourceEdit() {
  const ueditor = useRef(null)
  const picture = useRef(null)
  const inp = useRef(null)
  const inputType = useRef(null)
  const inputUrl = useRef(null)
  const inputImage = useRef(null)
  const inputAudio = useRef(null)
  const lb = { span: 3 }, rb = { span: 18 }
  const query = qs.parse(window.location.search.substr(1))
  const local = useLocalStore(() => ({
    id: query.id,
    data: { tags: [], types: [], children: [], videos: [], images: [], audios: [], content: '', source_type: '' },
    origin: {},
    // 临时
    tempThumbnailImg: '',
    tempPosterImg: '',
    tempTag: '',
    tempStatus: 'init',
    tagAddVisible: false,
    tempUrlType: 'normal',
    tempImageType: 'gallery',
    tempTypes: '',
    typeAddVisible: false,
    tempUrl: '',
    tempImage: '',
    tempAudio: '',
    urlAddVisible: false,
    imageAddVisible: false,
    loading: false,
    fullEditVideo: false,
    fullEditImage: false,
    showFormat: false,
    video_formats: [],
    audio_formats: [],
    subtitles_langs: [],
    subtitle_url: '',
    formatUrl: '',
    cancelFormat() {
      local.showFormat = false;
      local.video_formats = [];
      local.audio_formats = [];
    },
    setStatus(status) {
      local.data.status = status;
    },
    setSubStatus(type, id, status) {
      if (local.data[type]) {
        local.data[type].forEach(doc => {
          if (doc.id === id) {
            doc.status = status;
          }
        })
      }
    }
  }))
  const onEdit = useCallback(async (sync = true) => {
    const changed = !deepEqual(toJS(local.origin), toJS(local.data));
    if (!changed) {
      notification.info({ message: '数据未改动' })
      return;
    }
    local.loading = true
    const resp = local.data.id ? await apis.updateResource(local.data, sync) : await api.createResource(local.data);
    if (resp && resp.data.code === 0) {
      notification.info('编辑成功')
    }
    local.loading = false;
  }, [])
  useEffectOnce(() => {
    function changeResource(data) {
      const resource_id = data.resource_id;
      if (data.resource_type === 'resource' && resource_id === local.id) {
        local.data.status = data.status;
      } else if (data.resource_type === 'video') {
        local.setSubStatus('videos', resource_id, data.status)
      } else if (data.resource_type === 'image') {
        local.setSubStatus('images', resource_id, data.status);
      }
    }
    events.on('resource_change', changeResource);
    if (local.id) {
      local.loading = true
      apis.getResource({ id: local.id }).then(res => {
        if (res && res.status === 'success' && res.code === 0) {
          const data = res.data
          local.data = data
          local.origin = data
          local.subtitles_langs = data.original && data.original.subtitles ? Object.keys(data.original.subtitles) : [];
          if (!local.data.images) {
            local.data.images = [];
          }
        } else {
          notification.error({ message: '请求失败' })
        }
        local.loading = false
      })
    }
    return () => {
      events && events.off && events.off(changeResource);
    }
  })

  return <Observer>{() => (<Fragment>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 20 }}>
        <Row style={{ alignItems: 'center', margin: 8 }}>
          <Col span={3} style={{ textAlign: 'right' }}>
            标题：
          </Col>
          <Col className="gutter-row" span={9}>
            <Input value={local.data.title} autoFocus onChange={e => local.data.title = e.target.value} />
          </Col>
          <Divider type='vertical' />
          <div>别名：</div>
          <Col className="gutter-row" span={6}>
            <Input style={{ width: '50%' }} value={local.data.alias} onChange={e => local.data.alias = e.target.value} />
          </Col>
        </Row>
        <Form.Item label="描述" labelCol={lb} wrapperCol={rb}>
          <TextArea style={{ width: '50%' }} value={local.data.desc} onChange={e => local.data.desc = e.target.value} />
        </Form.Item>
        <Row style={{ alignItems: 'center', margin: 8 }}>
          <Col span={3} style={{ textAlign: 'right' }}>
            系列：
          </Col>
          <Col className="gutter-row" span={9}>
            <Input value={local.data.series} onChange={e => local.data.series = e.target.value} />
          </Col>
          <Divider type='vertical' />
          <div>发布时间：</div>
          <Col className="gutter-row" span={6}>
            <Input style={{ width: '50%' }} value={local.data.publishedAt} onChange={e => local.data.publishedAt = e.target.value} />
          </Col>
        </Row>
        <Form.Item label="来源" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.origin} onChange={e => local.data.origin = e.target.value} addonAfter={local.data.origin && <a href={local.data.origin} target='_blank'><LinkOutlined /></a>} />
        </Form.Item>
        <Row style={{ alignItems: 'center', margin: 8 }}>
          <Col span={3} style={{ textAlign: 'right' }}>
            规则id：
          </Col>
          <Col className="gutter-row" span={9}>
            <Input value={local.data.spider_id} onChange={e => local.data.spider_id = e.target.value} />
          </Col>
          <Divider type='vertical' />
          <div>来源id：</div>
          <Col className="gutter-row" span={6}>
            <Input value={local.data.source_id} onChange={e => local.data.source_id = e.target.value} />
          </Col>
        </Row>
        <Form.Item label="统一编号" labelCol={lb} wrapperCol={rb}>
          <Input style={{ width: '50%' }} value={local.data.cspn} onChange={e => local.data.cspn = e.target.value} />
        </Form.Item>
        <Row style={{ alignItems: 'center', margin: 8 }}>
          <Col span={3} style={{ textAlign: 'right' }}>
            状态：
          </Col>
          <Col className="gutter-row" span={6}>
            <Radio.Group
              style={{ backgroundColor: '#eee', padding: '4px 0 4px 10px', borderRadius: 5 }}
              value={local.data.status}
              onChange={e => {
                local.data.status = e.target.value
                onEdit()
              }}>
              <Radio value={"init"}>待下载</Radio>
              <Radio value={"loading"}>下载中</Radio>
              <Radio value={"fail"}>已失败</Radio>
              <Radio value={"finished"}>已完成</Radio>
            </Radio.Group>
          </Col>

          <Col className="gutter-row" span={3}>公开：
            <Switch checked={local.data.open} onClick={e => {
              local.data.open = !local.data.open;
              onEdit()
            }} /> {local.data.open}
          </Col>

          <Row style={{ alignItems: 'center' }}>
            <div>资源类型：</div>
            <FullWidthFix >
              <Select style={{ width: 120 }} value={local.data.source_type} onChange={value => {
                local.data.source_type = value
              }}>
                {store.resource_types.map(type => (
                  <Select.Option key={type.name} value={type.name}>{type.title}</Select.Option>
                ))}
              </Select>
            </FullWidthFix>
          </Row>
          <Col span={1}></Col>
          <Row style={{ alignItems: 'center' }}>
            <div>地区：</div>
            <FullWidthFix>
              <Select style={{ width: 150 }} value={local.data.country} onChange={value => {
                local.data.country = value
              }}>
                {store.regions.map(region => (
                  <Select.Option key={region.name} value={region.name}>{region.title}</Select.Option>
                ))}
              </Select>
            </FullWidthFix>
          </Row>
        </Row>
        <Form.Item label="分类" labelCol={lb} wrapperCol={rb}>
          {local.data.types.map((type, index) => <Tag key={index} closable onClose={() => { local.data.types.filter(t => t !== type) }}>{type}</Tag>)}
          {local.typeAddVisible && (
            <Input
              ref={inputType}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={local.tempTypes}
              autoFocus
              onChange={e => local.tempTypes = e.target.value}
              onBlur={() => {
                let type = local.tempTypes.trim()
                const types = local.data.types
                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                  local.data.types.push(type)
                }
                local.typeAddVisible = false
                local.tempTypes = ''
              }}
              onPressEnter={() => {
                let type = local.tempTypes.trim()
                const types = local.data.types
                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                  local.data.types.push(type)
                }
                local.typeAddVisible = false
                local.tempTypes = ''
              }}
            />
          )}
          {!local.typeAddVisible && (
            <Tag onClick={() => local.typeAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" />
            </Tag>
          )}
        </Form.Item>
        <Form.Item label="标签" labelCol={lb} wrapperCol={rb}>
          {local.data.tags.map((tag, index) => <Tag key={index} closable onClose={() => { local.data.tags.filter(t => t !== tag) }}>{tag}</Tag>)}
          {local.tagAddVisible && (
            <Input
              ref={inp}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={local.tempTag}
              autoFocus
              onChange={e => local.tempTag = e.target.value}
              onBlur={() => {
                let tagArr = local.tempTag.trim().replace(/,/g, ' ').split(' ');
                const tags = local.data.tags.toJSON()
                for (let i = 0; i < tagArr.length; i++) {
                  const tag = tagArr[i];
                  if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                    local.data.tags.push(tag)
                  }
                }
                local.tagAddVisible = false
                local.tempTag = ''
              }}
              onPressEnter={() => {
                let tagArr = local.tempTag.trim().replace(/,/g, ' ').split(' ');
                const tags = local.data.tags.toJSON()
                for (let i = 0; i < tagArr.length; i++) {
                  const tag = tagArr[i];
                  if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                    local.data.tags.push(tag)
                  }
                }
                local.tagAddVisible = false
                local.tempTag = ''
              }}
            />
          )}
          {!local.tagAddVisible && (
            <Tag onClick={() => local.tagAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" />
            </Tag>
          )}
        </Form.Item>
        <Form.Item label="封面" labelCol={lb} wrapperCol={rb}>
          <FullWidth>
            <span>thumbnail</span>
            <Divider type="vertical" />
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false} ref={picture} name="thumbnail" onChange={e => {
                local.data.thumbnail = e.file
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  local.tempThumbnailImg = reader.result
                });
                reader.readAsDataURL(e.file);
              }} beforeUpload={(f) => {
                return false
              }}>
              <img width="100%" src={local.tempThumbnailImg || (store.app.imageLine + (local.data.thumbnail || '/images/poster/nocover.jpg'))} alt="" />
              <Button style={{ marginTop: 10 }}>
                <Icon type="arrow-up-line" /> 编辑
              </Button>
            </Upload>
            <span>poster</span>
            <Divider type="vertical" />
            <Upload
              style={{ position: 'relative', minWidth: 300, minHeight: 60 }}
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false} ref={picture} name="poster" onChange={e => {
                local.data.poster = e.file
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  local.tempPosterImg = reader.result
                });
                reader.readAsDataURL(e.file);
              }} beforeUpload={(f) => {
                return false
              }}>
              <img width="100%" src={local.tempPosterImg || (store.app.imageLine + (local.data.poster || '/images/poster/nocover.jpg'))} alt="" />
              <Button style={{ marginTop: 10 }}>
                <Icon type="arrow-up-line" /> 编辑
              </Button>
            </Upload>
          </FullWidth>
        </Form.Item>
        <VisualBox visible={local.data.source_name === 'youtube' || local.data.source_name === 'youtube_shorts' || ['youtube_short', 'youtube_video'].includes(local.data.spider_id)}>
          <Form.Item label="youtube下载设置">
            <Button onClick={e => {
              local.video_formats = local.data.original.formats.filter(item => item.video_ext !== 'none' && item.filesize).sort((a, b) => b.filesize - a.filesize).map(item => ({
                ext: item.ext,
                url: item.url,
                quality: item.format_note,
                height: item.height,
                width: item.width,
                resolution: item.resolution,
                filesize: formatNumber(item.filesize),
                size: item.filesize || 0,
                id: item.format_id
              }));
              local.audio_formats = local.data.original.formats.filter(item => item.audio_ext !== 'none' && item.filesize).sort((a, b) => b.filesize - a.filesize).map(item => ({
                ext: item.ext,
                url: item.url,
                quality: item.format_note,
                height: item.height,
                width: item.width,
                resolution: item.resolution,
                filesize: formatNumber(item.filesize),
                size: item.filesize || 0,
                id: item.format_id
              }));
              // local.formats = local.data.original.formats.filter(item => item.filesize && item.resolution !== 'audio only').sort((a, b) => b.filesize - a.filesize).map(item => ({
              //   ext: item.ext,
              //   url: item.url,
              //   quality: item.format_note,
              //   height: item.height,
              //   width: item.width,
              //   resolution: item.resolution,
              //   filesize: formatNumber(item.filesize),
              // }));
              local.showFormat = true;
            }}>选择youtube</Button>
          </Form.Item>
        </VisualBox>
        <Form.Item label={<span>视频列表<br /><Switch checked={local.fullEditVideo} onClick={e => {
          local.fullEditVideo = !local.fullEditVideo;
        }} /></span>} labelCol={lb} wrapperCol={rb}>
          <SortListView
            isLoading={local.loading}
            direction="vertical"
            mode="edit"
            handler={<Icon type="drag" style={{ marginRight: 10 }} />}
            sort={async (oldIndex, newIndex) => {
              const data = local.data.videos.map(item => ({ id: item.id, url: item.url }))
              const id = data.splice(oldIndex, 1)
              data.splice(newIndex, 0, ...id)
              data.forEach((d, i) => {
                d.nth = i + 1
              })
              local.loading = false
              try {
                await api.sortResourceVideo({ id: local.id, data })
                const items = local.data.videos.map(item => item)
                const item = items.splice(oldIndex, 1);
                items.splice(newIndex, 0, ...item)
                local.data.videos = items
              } finally {
                local.loading = false
              }
            }}
            items={local.data.videos}
            droppableId={local.id}
            listStyle={{ boxSizing: 'border-box' }}
            itemStyle={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}
            renderItem={({ item, index }) => (
              <FullWidth className="container" style={{ width: '100%' }}>
                <FullHeightAuto>
                  <Input className="title" addonBefore={'标题'} defaultValue={item.title} />
                  <VisualBox visible={true}>
                    {(item.subtitles || []).map(subtitle => (
                      <Input
                        defaultValue={subtitle.url}
                        addonBefore={subtitle.lang}
                        addonAfter={<Icon type='delete' />}
                        onChange={e => {
                          subtitle.url = e.target.value
                        }}
                      />
                    ))}
                  </VisualBox>
                  <Observer>{() => (
                    <Input className="url"
                      style={{ margin: '10px 0' }}
                      value={item.url}
                      onChange={(e) => {
                        item.url = e.target.value;
                      }}
                      addonBefore={
                        <Observer>{() => (
                          <Fragment>
                            <Select style={{ width: 90 }} value={item.status} onChange={async (status) => {
                              item.loading = true
                              try {
                                const result = await api.updateResourceVideo(local.id, { id: item.id, status })
                                if (result.code === 0) {
                                  item.status = status
                                } else {
                                  message.error(result.message)
                                }
                              } finally {
                                item.loading = false
                              }
                            }}>
                              <Select.Option value="init">初始化</Select.Option>
                              <Select.Option value="loading">下载中</Select.Option>
                              <Select.Option value="finished">已下载</Select.Option>
                              <Select.Option value="fail">失败</Select.Option>
                            </Select>
                            <Divider type="vertical" />
                            <Select style={{ width: 80 }} value={item.type} onChange={async (type) => {
                              item.loading = true
                              try {
                                await api.updateResourceVideo(local.id, { id: item.id, type })
                                item.type = type
                              } finally {
                                item.loading = false
                              }
                            }}>
                              <Select.Option value="normal">正片</Select.Option>
                              <Select.Option value="content">正文</Select.Option>
                              <Select.Option value="trailer">预告</Select.Option>
                              <Select.Option value="tidbits">花絮</Select.Option>
                            </Select>
                          </Fragment>
                        )}</Observer>
                      }
                      addonAfter={!local.fullEditVideo ? <Observer>{() => (
                        <CloseOutlined disabled={item.loading || item.status === 'loading'} onClick={async () => {
                          item.loading = true
                          try {
                            await api.removeResourceVideo({ id: item.id, mid: local.id })
                            local.data.videos = local.data.videos.filter(t => t.url !== item.url)
                          } finally {
                            item.loading = false
                          }
                        }} />
                      )}</Observer> : null}
                    />
                  )}</Observer>
                  <Input className="path" addonBefore={'文件:' + item.nth} defaultValue={item.path} />
                </FullHeightAuto>
                <FullHeight>
                  <AlignVertical style={{ padding: '0 10px' }}>
                    {local.fullEditVideo && (
                      <Fragment>
                        <Observer>{() => (
                          <CloseOutlined disabled={item.loading || item.status === 'loading'} onClick={async () => {
                            item.loading = true
                            try {
                              await api.removeResourceVideo({ id: item.id, mid: local.id })
                              local.data.videos = local.data.videos.filter(t => t.url !== item.url)
                            } finally {
                              item.loading = false
                            }
                          }} />
                        )}</Observer>
                      </Fragment>

                    )}
                    <Icon type="check" onClick={async (e) => {
                      const container = e.target.closest('.container');
                      const otitle = container.querySelector('.title input');
                      const opath = container.querySelector('.path input');
                      const ourl = container.querySelectorAll('.url input')[2];
                      item.loading = true
                      try {
                        await api.updateResourceVideo(local.id, { id: item.id, url: ourl.value, path: opath.value, title: otitle.value });
                        item.path = opath.value;
                        message.success('修改成功')
                      } finally {
                        item.loading = false
                      }
                    }} />
                    <Observer>{() => (
                      <Icon type={item.loading && item.status === 'loading' ? 'loading' : 'download'} disabled={item.loading} onClick={async (e) => {
                        item.loading = true
                        try {
                          const type = item.url.includes('.m3u8') ? 'm3u8' : 'mp4';
                          const data = {
                            _id: item.id,
                            url: item.url,
                            filepath: item.path,
                            type,
                            params: { total: item.more.size, finished: 0 }
                          }
                          const resp = await Axios.post(`https://192.168.0.124/gw/download/tasks`, data)
                          if (resp.status === 200 && resp.data.code === 0) {
                            await api.updateResourceVideo(local.id, { id: item.id, status: 'loading' })
                            item.status = 'loading'
                          } else {
                            message.error('失败：' + resp.body.message)
                          }
                          // }
                        } catch (e) {
                          console.log(e)
                        } finally {
                          item.loading = false
                        }
                      }}
                      />
                    )}</Observer>
                    <Observer>{() => (
                      <Upload
                        showUploadList={false}
                        name="file"
                        disabled={item.loading && item.status === 'upload'}
                        onChange={async (e) => {
                          item.loading = true
                          const segs = item.path.split('/');
                          const name = segs.pop()
                          const dirs = segs.join('/')
                          try {
                            const res = await apis.createFile({
                              isDir: 0,
                              param: dirs,
                              name: name,
                              upfile: e.file
                            })
                            if (res.code === 0) {
                              message.info('上传成功')
                              await api.updateResourceVideo(local.id, { id: item.id, status: 'finished' })
                              item.status = 'finished'
                            } else {
                              message.info(res.message || '上传失败')
                            }
                          } catch (e) {
                            message.error(e.message)
                          } finally {
                            item.loading = false
                          }
                        }}
                        beforeUpload={() => false}>
                        <UploadOutlined />
                      </Upload>
                    )}</Observer>
                  </AlignVertical>
                </FullHeight>
              </FullWidth>
            )}
          />
          {local.urlAddVisible && (
            <Input
              ref={inputUrl}
              type="text"
              size="small"
              style={{ margin: '10px 5px' }}
              value={local.tempUrl}
              autoFocus
              disabled={local.isDealUrl}
              onChange={e => local.tempUrl = e.target.value}
              addonBefore={<Fragment>
                <Select style={{ width: 90 }} disabled={local.isDealUrl} value={local.tempStatus} onChange={async (status) => {
                  local.tempStatus = status;
                }}>
                  <Select.Option value="init">初始化</Select.Option>
                  <Select.Option value="loading">下载中</Select.Option>
                  <Select.Option value="finished">已下载</Select.Option>
                  <Select.Option value="fail">失败</Select.Option>
                </Select>
                <Divider type="vertical" />
                <Select style={{ width: 80 }} disabled={local.isDealUrl} value={local.tempUrlType} onChange={async (type) => {
                  local.tempUrlType = type;
                }}>
                  <Select.Option value="normal">正片</Select.Option>
                  <Select.Option value="content">正文</Select.Option>
                  <Select.Option value="trailer">预告</Select.Option>
                  <Select.Option value="tidbits">花絮</Select.Option>
                </Select>
              </Fragment>}
              addonAfter={<Icon type="check" onClick={async () => {
                if (local.isDealUrl) {
                  return;
                }
                let url = local.tempUrl.trim()
                if ('' === url) {
                  local.urlAddVisible = false
                  return;
                }
                if (-1 !== local.data.videos.findIndex(t => t.url === url)) {
                  return notification.info('exists')
                }
                local.isDealUrl = true
                try {
                  const res = await api.addResourceVideo({ id: local.id, title: local.data.title, url, type: local.tempUrlType, status: local.tempStatus })
                  if (res && res.code === 0) {
                    local.data.videos.push({ url: res.data.url, path: res.data.path, id: res.data.id, status: local.tempStatus, type: local.tempUrlType, nth: local.data.videos.length })
                    local.urlAddVisible = false
                  } else {
                    notification.info('fail')
                  }
                } finally {
                  local.tempUrl = '';
                  local.isDealUrl = false;
                  local.tempStatus = 'init';
                  local.tempUrlType = 'normal';
                }
              }} />}
            />
          )}
          {!local.urlAddVisible && (
            <Tag onClick={() => local.urlAddVisible = true} style={{ margin: '10px 5px', background: '#fff', borderStyle: 'dashed' }}>
              <PlusCircleOutlined />
            </Tag>
          )}
        </Form.Item>
        <Form.Item label={<span>图片列表<br /><Switch checked={local.fullEditVideo} onClick={e => {
          local.fullEditImage = !local.fullEditImage;
        }} /></span>} labelCol={lb} wrapperCol={rb}>
          <SortListView
            isLoading={local.loading}
            direction="vertical"
            mode="edit"
            handler={<Icon type="drag" style={{ marginRight: 10 }} />}
            sort={async (oldIndex, newIndex) => {
              const data = local.data.images.map(item => ({ id: item.id, url: item.url }))
              const id = data.splice(oldIndex, 1)
              data.splice(newIndex, 0, ...id)
              data.forEach((d, i) => {
                d.nth = i + 1
              })
              local.loading = false
              try {
                await api.sortResourceImage({ id: local.id, data })
                const items = local.data.images.map(item => item)
                const item = items.splice(oldIndex, 1);
                items.splice(newIndex, 0, ...item)
                local.data.images = items
              } finally {
                local.loading = false
              }
            }}
            items={local.data.images}
            droppableId={local.id}
            listStyle={{ boxSizing: 'border-box' }}
            itemStyle={{ display: 'flex', alignItems: 'center', lineHeight: 1, marginBottom: 5, backgroundColor: 'transparent' }}
            renderItem={({ item, index }) => (
              <Observer>{() => (
                <FullHeight style={{ flex: 1 }}>
                  <Input
                    key={index}
                    value={item.nth + ' ' + item.path}
                    disabled
                    className="custom"
                    style={item.status === 'finished' ? { backgroundColor: '#00b578', color: 'white' } : { backgroundColor: '#ff8f1f' }}
                    addonBefore={<Observer>{() => (
                      <Fragment>
                        <Select style={{ width: 90 }} value={item.status} onChange={async (status) => {
                          item.loading = true
                          try {
                            await api.updateResourceImage(local.id, { id: item.id, status, source_name: local.data.source_name })
                            item.status = status
                          } finally {
                            item.loading = false
                          }
                        }}>
                          <Select.Option value="init">初始化</Select.Option>
                          <Select.Option value="loading">下载中</Select.Option>
                          <Select.Option value="finished">已下载</Select.Option>
                          <Select.Option value="fail">失败</Select.Option>
                        </Select>
                        <Divider type="vertical" />
                        <Select style={{ width: 80 }} value={item.type} onChange={async (type) => {
                          item.loading = true
                          try {
                            await api.updateResourceImage(local.id, { id: item.id, type })
                            item.type = type
                          } finally {
                            item.loading = false
                          }
                        }}>
                          <Select.Option value="poster">封面</Select.Option>
                          <Select.Option value="content">正文图片</Select.Option>
                          <Select.Option value="thumbnail">缩略图</Select.Option>
                          <Select.Option value="gallery">图集</Select.Option>
                        </Select>
                      </Fragment>
                    )}</Observer>}
                    suffix={<CloseOutlined disabled={item.loading || item.status === 'loading'} onClick={async () => {
                      item.loading = true
                      try {
                        await api.removeResourceImage({ id: item.id, mid: local.id })
                        local.data.images = local.data.images.filter(t => t.url !== item.url)
                      } finally {
                        item.loading = false
                      }
                    }} />}
                    addonAfter={<Observer>{() => (<FullWidth>
                      <Icon type="upload" disabled={item.loading} />
                      <div style={{ width: 12 }}></div>
                      <Popover trigger={'click'} content={<img style={{ width: 120, height: 120 }} src={store.app.imageLine + item.path} />}>
                        <Icon type={'page-search'} />
                      </Popover>
                    </FullWidth>)}</Observer>}
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => {
                      item.url = e.target.value;
                    }}
                    addonAfter={<Observer>{() => (
                      <FullWidth>
                        <Icon type="check" onClick={async () => {
                          item.loading = true
                          try {
                            await api.updateResourceImage(local.id, { id: item.id, url: item.url })
                          } finally {
                            item.loading = false
                          }
                        }} />
                        <div style={{ width: 12 }}></div>
                        <Icon type={item.loading || item.status === 'loading' ? 'loading' : 'download'} disabled={item.loading} onClick={async () => {
                          if (item.status === 'finished') {
                            return notification.error({ message: '已下载' })
                          }
                          item.status = 'loading'
                          item.loading = true
                          try {
                            await api.downloadResourceImage(local.id, item.id, { source_name: local.data.source_name })
                            item.status = 'finished'
                          } finally {
                            item.loading = false
                          }
                        }} />

                      </FullWidth>
                    )}</Observer>}
                  />
                </FullHeight>
              )}</Observer>
            )}
          />
          {local.imageAddVisible && (
            <Input
              ref={inputImage}
              type="text"
              size="small"
              style={{ margin: '10px 5px' }}
              value={local.tempImage}
              autoFocus
              disabled={local.isDealUrl}
              onChange={e => local.tempImage = e.target.value}
              addonBefore={<Fragment>
                <Select style={{ width: 90 }} disabled={local.isDealUrl} value={local.tempStatus} onChange={async (status) => {
                  local.tempStatus = status;
                }}>
                  <Select.Option value="init">初始化</Select.Option>
                  <Select.Option value="loading">下载中</Select.Option>
                  <Select.Option value="finished">已下载</Select.Option>
                  <Select.Option value="fail">失败</Select.Option>
                </Select>
                <Divider type="vertical" />
                <Select style={{ width: 80 }} disabled={local.isDealUrl} value={local.tempImageType} onChange={async (type) => {
                  local.tempImageType = type;
                }}>
                  <Select.Option value="poster">封面</Select.Option>
                  <Select.Option value="content">正文图片</Select.Option>
                  <Select.Option value="thumbnail">缩略图</Select.Option>
                  <Select.Option value="gallery">图集</Select.Option>
                </Select>
              </Fragment>}
              addonAfter={<Icon type="check" onClick={async () => {
                if (local.isDealUrl) {
                  return;
                }
                let image = local.tempImage.trim()
                if ('' === image) {
                  local.imageAddVisible = false
                  return;
                }
                local.isDealUrl = true
                try {
                  if (image.includes(',')) {
                    const images = image.split(',');
                    for (let i = 0; i < images.length; i++) {
                      let url = images[i];
                      if (-1 !== local.data.images.findIndex(t => t.url === url)) {
                        return notification.info('exists')
                      }
                      if (url) {
                        const res = await api.addResourceImage({ id: local.id, title: '', url, type: local.tempImageType, status: local.tempStatus })
                        if (res && res.code === 0) {
                          local.data.images.push({ url: res.data.url, id: res.data.id, status: res.data.status, type: res.data.type, nth: local.data.images.length + 1 })
                        } else {
                          notification.info('fail')
                        }
                      }
                    }
                    local.imageAddVisible = false
                  } else {
                    if (-1 !== local.data.images.findIndex(t => t.url === image)) {
                      return notification.info('exists')
                    }
                    const res = await api.addResourceImage({ id: local.id, title: local.data.title, url: image, type: local.tempImageType, status: local.tempStatus })
                    if (res && res.code === 0) {
                      local.data.images.push({ url: res.data.url, id: res.data.id, status: local.tempStatus, type: local.tempImageType, nth: local.data.images.length + 1 })
                      local.imageAddVisible = false
                    } else {
                      notification.info('fail')
                    }
                  }

                } finally {
                  local.tempImage = '';
                  local.isDealUrl = false;
                  local.tempStatus = 'init';
                  local.tempImageType = 'poster';
                }
              }} />}
            />
          )}
          {!local.imageAddVisible && (
            <Fragment>
              <Tag style={{ margin: '10px 5px', background: '#fff', borderStyle: 'dashed' }}>
                <PlusCircleOutlined onClick={() => local.imageAddVisible = true} />
              </Tag>
              可输入多个图片(,分隔)
            </Fragment>
          )}
        </Form.Item>
        <VisualBox visible={local.data.source_type === 'music'}>
          <Form.Item label={<span>音频列表</span>} labelCol={lb} wrapperCol={rb}>
            <SortListView
              isLoading={local.loading}
              direction="vertical"
              mode="edit"
              handler={<Icon type="drag" style={{ marginRight: 10 }} />}
              sort={async (oldIndex, newIndex) => {
                const data = local.data.audios.map(item => ({ id: item.id, url: item.url }))
                const id = data.splice(oldIndex, 1)
                data.splice(newIndex, 0, ...id)
                data.forEach((d, i) => {
                  d.nth = i + 1
                })
                local.loading = false
                try {
                  await api.sortResourceAudio({ id: local.id, data })
                  const items = local.data.audios.map(item => item)
                  const item = items.splice(oldIndex, 1);
                  items.splice(newIndex, 0, ...item)
                  local.data.audios = items
                } finally {
                  local.loading = false
                }
              }}
              items={local.data.audios}
              droppableId={local.id}
              listStyle={{ boxSizing: 'border-box' }}
              itemStyle={{ display: 'flex', alignItems: 'center', lineHeight: 1, marginBottom: 5, backgroundColor: 'transparent' }}
              renderItem={({ item, index }) => (
                <Observer>{() => (
                  <FullHeight style={{ flex: 1 }}>
                    <Input
                      key={index}
                      value={item.path}
                      disabled
                      className="custom"
                      style={item.status === 'finished' ? { backgroundColor: '#00b578', color: 'white' } : { backgroundColor: '#ff8f1f' }}
                      addonBefore={<Observer>{() => (
                        <Fragment>
                          <Select style={{ width: 90 }} value={item.status} onChange={async (status) => {
                            item.loading = true
                            try {
                              await api.updateResourceAudio(local.id, { id: item.id, status, source_name: local.data.source_name })
                              item.status = status
                            } finally {
                              item.loading = false
                            }
                          }}>
                            <Select.Option value="init">初始化</Select.Option>
                            <Select.Option value="loading">下载中</Select.Option>
                            <Select.Option value="finished">已下载</Select.Option>
                            <Select.Option value="fail">失败</Select.Option>
                          </Select>
                        </Fragment>
                      )}</Observer>}
                      addonAfter={
                        <Fragment>
                          <Icon type="check" onClick={async () => {
                            item.loading = true
                            try {
                              await api.updateResourceAudio(local.id, { id: item.id, status: item.status, url: item.url })
                            } finally {
                              item.loading = false
                            }
                          }} />
                          <Divider type='vertical' /><CloseOutlined disabled={item.loading || item.status === 'loading'} onClick={async () => {
                            item.loading = true
                            try {
                              await api.removeResourceAudio({ id: item.id, mid: local.id })
                              local.data.audios = local.data.audios.filter(t => t.url !== item.url)
                            } finally {
                              item.loading = false
                            }
                          }} />
                        </Fragment>
                      }
                    />
                    <Input
                      value={item.url}
                      onChange={(e) => {
                        item.url = e.target.value;
                      }}
                      addonBefore='url'
                      addonAfter={<Observer>{() => (
                        <FullWidth>
                          <label htmlFor={`audio_${index}`}>
                            <input id={`audio_${index}`} type='file' style={{ display: 'none' }} onChange={async (e) => {
                              item.music = e.target.files[0];
                              item.status = 'loading'
                              item.loading = true
                              try {
                                await api.updateResourceAudio(local.id, { id: item.id, music: item.music, status: 'finished' })
                                item.status = 'finished'
                              } finally {
                                item.music = null;
                                item.loading = false;
                              }
                            }} />
                            <Icon type={item.loading || item.status === 'loading' ? 'loading' : 'upload'} disabled={item.loading} />
                          </label>
                          <Divider type='vertical' />
                          <Icon type={item.loading || item.status === 'loading' ? 'loading' : 'download'} disabled={item.loading} onClick={async () => {
                            return notification.error({ message: '功能未开放' })
                            if (item.status === 'finished') {
                              return notification.error({ message: '已下载' })
                            }
                            item.status = 'loading'
                            item.loading = true
                            try {
                              await api.downloadResourceAudio(local.id, item.id, { source_name: local.data.source_name })
                              item.status = 'finished'
                            } finally {
                              item.loading = false
                            }
                          }} />
                        </FullWidth>
                      )}</Observer>}
                    />
                  </FullHeight>
                )}</Observer>
              )}
            />
            <Input
              ref={inputAudio}
              type="text"
              size="small"
              style={{ margin: '10px 5px' }}
              value={local.tempAudio}
              autoFocus
              disabled={local.isDealUrl}
              onChange={e => local.tempAudio = e.target.value}
              addonBefore={<Fragment>
                <Select style={{ width: 90 }} disabled={local.isDealUrl} value={local.tempStatus} onChange={async (status) => {
                  local.tempStatus = status;
                }}>
                  <Select.Option value="init">初始化</Select.Option>
                  <Select.Option value="loading">下载中</Select.Option>
                  <Select.Option value="finished">已下载</Select.Option>
                  <Select.Option value="fail">失败</Select.Option>
                </Select>
              </Fragment>}
              addonAfter={
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <div>
                    <input type='file' id="music" style={{ display: 'none' }} onChange={e => {
                      local.data.music = e.target.files[0]
                    }} />
                    <label htmlFor="music">
                      <Icon type="arrow-up-line" /> {local.data.music ? '已选择' : '待选择'}
                    </label>
                  </div>
                  <Divider type='vertical' />
                  <Icon type="check" onClick={async () => {
                    if (local.isDealUrl) {
                      return;
                    }
                    let audio = local.tempAudio.trim()
                    if ('' === audio) {
                      return;
                    }
                    local.isDealUrl = true
                    try {
                      const res = await api.addResourceAudio(local.id, { title: local.data.title, url: local.tempAudio, type: 'audio', status: local.tempStatus, music: local.data.music })
                      if (res && res.code === 0) {
                        local.data.audios.push(_.omit(res.data, ['createdAt', 'more']))
                      } else {
                        notification.info('fail')
                      }
                    } finally {
                      local.music = null;
                      local.tempAudio = '';
                      local.isDealUrl = false;
                      local.tempStatus = 'init';
                    }
                  }} />
                </div>
              }
            />
          </Form.Item>
        </VisualBox>
        <VisualBox visible={local.data.source_type === 'article'}>
          <Form.Item label="内容" labelCol={lb} wrapperCol={rb}>
            <div style={{ lineHeight: 'initial', height: '100%' }}>
              <Ueditor ref={ref => ueditor.current = ref} initData={local.data.content} />
            </div>
          </Form.Item>
        </VisualBox>
      </div>
      <Form.Item label="" style={{ textAlign: 'center', backgroundColor: '#b5cbde', height: 50, lineHeight: '50px', margin: 0, }}>
        <Button loading={local.loading} disabled={local.loading} type="primary" onClick={() => onEdit()}>保存并同步</Button>
      </Form.Item>
    </div>
    <Observer>{() => <Modal visible={local.showFormat}
      style={{ overflow: 'auto', padding: 0, zIndex: 1201 }}
      width={700}
      bodyStyle={{ height: 500, overflow: 'auto' }}
      onCancel={local.cancelFormat}
      onOk={async () => {
        const videoItem = local.video_formats.find(item => item.id === local.video_format_id)
        const audioItem = local.audio_formats.find(item => item.id === local.audio_format_id)
        if (videoItem && audioItem) {
          if (local.isDealUrl) {
            return;
          }
          let url = 'https://googlevideo.com/' + videoItem.id + '+' + audioItem.id + '.' + videoItem.ext
          local.isDealUrl = true
          try {
            const res = await api.addResourceVideo({ id: local.id, title: '', url, type: 'normal', status: 'init', more: _.pick(videoItem, ['size', 'width', 'height']), ext: videoItem.ext, more: videoItem, subtitles: local.subtitle_url })
            if (res && res.code === 0) {
              local.data.videos.push({ url: res.data.url, path: res.data.path, id: res.data.id, status: 'init', type: 'normal', nth: local.data.videos.length, subtitles: res.data.subtitlesf })
              local.urlAddVisible = false
            } else {
              notification.info('fail')
            }
          } finally {
            local.tempUrl = '';
            local.isDealUrl = false;
            local.tempStatus = 'init';
            local.tempUrlType = 'normal';
          }
        } else {
          console.log('select emptyp!')
        }
        local.cancelFormat();
      }}
      cancelText="取消"
      okText="确定"
    >
      <span>video</span>
      <Radio.Group style={{ width: '100%' }} name="video" defaultValue="" onChange={e => {
        local.video_format_id = e.target.value
      }}>
        {local.video_formats.map(item => (<FullWidth key={item.id}>
          <FullWidthFix><Radio name="video" value={item.id} /></FullWidthFix>
          <FullWidthFix style={{ width: '15%' }}>{item.ext}</FullWidthFix>
          <FullWidthFix style={{ width: '20%' }}>{item.quality}</FullWidthFix>
          <FullWidthFix style={{ width: '20%' }}>{item.resolution}</FullWidthFix>
          <FullWidthFix style={{ width: '20%' }}>{item.filesize}</FullWidthFix>
        </FullWidth>))}
      </Radio.Group>
      <span>audio</span>
      <Radio.Group style={{ width: '100%' }} name="audio" defaultValue="" onChange={e => {
        local.audio_format_id = e.target.value
      }}>
        {local.audio_formats.map(item => (<FullWidth key={item.id}>
          <FullWidthFix><Radio name="audio" value={item.id} /></FullWidthFix>
          <FullWidthFix style={{ width: '15%' }}>{item.ext}</FullWidthFix>
          <FullWidthFix style={{ width: '20%' }}>{item.quality}</FullWidthFix>
          <FullWidthFix style={{ width: '20%' }}>{item.resolution}</FullWidthFix>
          <FullWidthFix style={{ width: '20%' }}>{item.filesize}</FullWidthFix>
        </FullWidth>))}
      </Radio.Group>
      <span>subtitle</span>
      <Radio.Group style={{ width: '100%' }} name="subtitles" defaultValue="" onChange={e => {
        local.subtitle_url = e.target.value
      }}>
        {local.subtitles_langs.map(lang => {
          return local.data.original.subtitles[lang].map(item => (<FullWidth key={item.id}>
            <FullWidthFix><Radio name="subtitles" value={item.url} /></FullWidthFix>
            <FullWidthFix style={{ width: '15%' }}>{item.name}</FullWidthFix>
            <FullWidthFix style={{ width: '20%' }}>{item.ext}</FullWidthFix>
            <FullWidthFix style={{ width: '60%', overflow: 'hidden' }}>{item.url}</FullWidthFix>
          </FullWidth>))
        })}
      </Radio.Group>
    </Modal>}</Observer>
  </Fragment>)
  }</Observer >
}