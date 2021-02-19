import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { useEffectOnce } from 'react-use'
import { Observer, useLocalStore } from 'mobx-react-lite'
import apis from '../../../api'
import { Button, notification, Input, Form, Radio, Tag, Upload, Select, Divider } from 'antd';
import Icon from '../../../component/Icon'
import qs from 'qs'
import * as _ from 'lodash'
import store from '../../../store'
import { toJS } from 'mobx';
import { useRouter } from '../../../contexts'


function deepEqual(a, b) {
    for (let k in a) {
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
    const router = useRouter()
    const picture = useRef(null)
    const inp = useRef(null)
    const inputType = useRef(null)
    const lb = { span: 3 }, rb = { span: 18 }
    const query = qs.parse(window.location.search.substr(1))
    const local = useLocalStore(() => ({
        id: query.id,
        data: { tags: [], types: [], children: [] },
        origin: {},
        // 临时
        tempImg: '',
        tempTag: '',
        tagAddVisible: false,
        tempType: '',
        typeAddVisible: false,
        loading: false,
        // 
        fetching: false,
    }))
    const onEdit = useCallback(async () => {
        const changed = !deepEqual(toJS(local.origin), toJS(local.data))
        alert(changed)
    })
    useEffectOnce(() => {
        if (local.id) {
            local.loading = true
            apis.getResource({ id: local.id }).then(res => {
                if (res && res.status === 'success' && res.code === 0) {
                    const data = res.data
                    local.data = data
                    local.origin = data
                } else {
                    notification.error({ message: '请求失败' })
                }
                local.loading = false
            })
        }
    })

    return <Observer>{() => (<Fragment>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <Form.Item label="标题" labelCol={lb} wrapperCol={rb}>
                    <Input style={{ width: '50%' }} value={local.data.title} autoFocus onChange={e => local.data.title = e.target.value} />
                </Form.Item>
                <Form.Item label="来源" labelCol={lb} wrapperCol={rb}>
                    <Input style={{ width: '50%' }} value={local.data.origin} onChange={e => local.data.origin = e.target.value} />
                </Form.Item>
                <Form.Item label="时间" labelCol={lb} wrapperCol={rb}>
                    <Input style={{ width: '50%' }} value={local.data.createdAt} onChange={e => local.data.createdAt = e.target.value} />
                </Form.Item>
                <Form.Item label="系列" labelCol={lb} wrapperCol={rb}>
                    <Input style={{ width: '50%' }} value={local.data.series} onChange={e => local.data.series = e.target.value} />
                </Form.Item>
                <Form.Item label="资源类型" labelCol={lb} wrapperCol={rb}>
                    <Select value={local.data.source_type} disabled onChange={value => {
                        local.data.source_type = value
                    }}>
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="image">图片</Select.Option>
                        <Select.Option value="animation">动漫</Select.Option>
                        <Select.Option value="music">音频</Select.Option>
                        <Select.Option value="video">视频</Select.Option>
                        <Select.Option value="novel">小说</Select.Option>
                        <Select.Option value="article">文章</Select.Option>
                        <Select.Option value="news">资讯</Select.Option>
                        <Select.Option value="private">私人</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="types" labelCol={lb} wrapperCol={rb}>
                    {local.data.types.map((type, index) => <Tag key={index} closable onClose={() => { local.data.types.filter(t => t !== type) }}>{type}</Tag>)}
                    {local.data.typeAddVisible && (
                        <Input
                            ref={inputType}
                            type="text"
                            size="small"
                            style={{ width: 78 }}
                            value={local.tempType}
                            autoFocus
                            onChange={e => local.tempType = e.target.value}
                            onBlur={() => {
                                let type = local.tempType.trim()
                                const types = local.data.types
                                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                                    local.data.types.push(type)
                                }
                                local.typeAddVisible = false
                                local.tempType = ''
                            }}
                            onPressEnter={() => {
                                let type = local.tempType.trim()
                                const types = local.data.types
                                if (type !== '' && -1 === types.findIndex(t => t === type)) {
                                    local.data.types.push(type)
                                }
                                local.typeAddVisible = false
                                local.tempType = ''
                            }}
                        />
                    )}
                    {!local.typeAddVisible && (
                        <Tag onClick={() => local.typeAddVisible = true} style={{ background: '#fff', borderStyle: 'dashed' }}>
                            <Icon type="plus" />
                        </Tag>
                    )}
                </Form.Item>
                <Form.Item label="tags" labelCol={lb} wrapperCol={rb}>
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
                                let tag = local.tempTag.trim()
                                const tags = local.tags
                                if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                                    local.tags.push(tag)
                                }
                                local.tagAddVisible = false
                                local.tempTag = ''
                            }}
                            onPressEnter={() => {
                                let tag = local.tempTag.trim()
                                const tags = local.tags
                                if (tag !== '' && -1 === tags.findIndex(t => t === tag)) {
                                    local.tags.push(tag)
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
                    <Upload
                        style={{ position: 'relative' }}
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false} ref={picture} name="poster" onChange={e => {
                            local.data.poster = e.file
                            const reader = new FileReader();
                            reader.addEventListener('load', () => {
                                local.tempImg = reader.result
                            });
                            reader.readAsDataURL(e.file);
                        }} beforeUpload={(f) => {
                            return false
                        }}>
                        <img width="100%" src={local.tempImg || (store.app.imageLine + (local.data.poster || '/images/poster/nocover.jpg'))} alt="" />
                        {local.data.poster === '' && (
                            <Button style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                                <Icon type="arrow-up-line" /> 编辑
                            </Button>
                        )}
                    </Upload>
                </Form.Item>
            </div>
            <Form.Item label="" style={{ textAlign: 'center', backgroundColor: '#b5cbde', height: 50, lineHeight: '50px', margin: 0, }}>
                <Button loading={local.loading} disabled={local.loading} type="primary" onClick={onEdit}>保存</Button>
            </Form.Item>
        </div>
    </Fragment>)}</Observer>
}