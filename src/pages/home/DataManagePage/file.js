import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider, Input, Upload, message, Checkbox, Select, Tooltip, } from 'antd';
import { DeleteOutlined, WarningOutlined, ArrowLeftOutlined, ScanOutlined, UploadOutlined, CheckOutlined, ExclamationCircleOutlined, FormOutlined, LoadingOutlined, CloseCircleOutlined, HomeOutlined, SwitcherOutlined } from '@ant-design/icons'
import apis from '../../../api'
import store from '../../../store'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, padding, FullWidth, FullWidthAuto, FullWidthFix } from '../../../component/style'
import { Icon, VisualBox } from '../../../component'
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';
import { HoverTitle } from './file.style'
import { useRouter } from '../../../contexts';
import TextArea from 'antd/lib/input/TextArea';
import Clipboard from 'react-clipboard.js';
import { useEffectOnce } from 'react-use';
import { events } from '../../../utils/events';

const { getFiles, createFile, destroyFile, renameFile } = apis
const { Column } = Table;

export default function TaskList() {
  const router = useRouter();
  const local = useLocalStore(() => ({
    isLoading: false,
    showModal: false,
    dirpath: '/download/',
    get dirLevel() {
      return this.dirpath.split('/').filter(n => !!n).length;
    },
    loading_stream: false,
    stream_path: '',
    streams: [],
    tempname: '',
    isDir: 0,
    uploading: false,
    files: [],
    searched_files: [],
    q: '',
    chosen_files: [],
    isExcuting: false,
    show_cmd: false,
    createType: 'file',
    template_data: {
      id: '',
      filename: '',
      placeholder: '',
      limit: 0,
    },
    cmd_templates: [
      { name: 'move_to_video_dir', title: '移动到视频目录', placeholder: '输入资源id', limit: 1 },
      { name: 'merge_audio_video', title: '合并音视频', placeholder: '输入合并后的文件名(如 default.mp4)', limit: 2 },
      { name: 'transcode_mp4', title: '转码为mp4', placeholder: '输入转码后的文件名(如 default.mp4)', limit: 1 },
    ],
  }))
  const nameRef = useRef(null)
  const outputRef = useRef(null)
  const searchRef = useRef(null)
  const search = useCallback((dir) => {
    local.isLoading = true
    local.chosen_files = [];
    getFiles({ param: dir }).then(res => {
      local.dirpath = dir;
      local.isLoading = false
      local.files = res.data.sort((a, b) => {
        return b.dir ? 1 : -1
      });
      router.replacePage(router.pathname, { home: dir })
    }).catch(() => {
      local.isLoading = false
    })
  }, [])
  const filter_by_q = useCallback((str) => {
    const q = str.trim();
    if (q) {
      local.searched_files = local.files.filter(file => {
        return file.name.includes(q);
      })
      local.q = q;
    }
  }, [])
  const jump = useCallback((i) => {
    const paths = local.dirpath.split('/');
    let result_path = '';
    for (let k = 0; k <= i; k++) {
      result_path = result_path + paths[k] + '/';
    }
    search(result_path);
  })
  const getFileInfo = useCallback(async () => {
    if (!local.loading_stream && local.stream_path) {
      local.loading_stream = true;
      const resp = await apis.loadingInfo(local.stream_path);
      if (resp.code === 0) {
        local.streams = resp.data;
      }
      local.loading_stream = false;
    }
  }, [local.loading_stream, local.stream_path])
  useEffectOnce(() => {
    search(local.dirpath);
    const transcodedEvent = function (event) {
      if (event.type === 'transcoded') {
        search(local.dirpath);
      }
    }
    events.on('event', transcodedEvent);
    return () => {
      if (events) {
        events.off('event', transcodedEvent);
      }
    }
  })
  return <Observer>{() => (
    <FullHeight>
      <FullHeightFix style={padding}>
        <Right>
          <Input.Search
            ref={ref => searchRef.current = ref}
            placeholder='搜索'
            style={{ width: 250 }}
            enterButton
            suffix={<Icon type="close" onClick={() => {
              local.q = '';
              searchRef.current.value = '';
            }} />}
            onSearch={filter_by_q} />
          <Divider type="vertical" />
          <Upload
            showUploadList={false}
            name="file"
            disabled={local.uploading}
            onChange={async (e) => {
              local.uploading = true
              try {
                const res = await createFile(local.dirpath, {
                  name: e.file.name,
                  upfile: e.file
                })
                if (res.code === 0) {
                  message.info('上传成功')
                } else {
                  message.info(res.message || '上传失败')
                }
              } catch (e) {
                message.error(e.message)
              } finally {
                local.uploading = false
              }
            }}
            beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>上传</Button>
          </Upload>
          <Divider type="vertical" />
          <Button disabled={local.chosen_files.length === 0} loading={local.isExcuting} onClick={() => {
            local.template_data.filename = '';
            local.show_cmd = true;
          }}>执行命令</Button>
          <Divider type="vertical" />
          <Button onClick={() => {
            local.showModal = true
            setTimeout(() => {
              nameRef.current && nameRef.current.input.focus()
            }, 300)
          }}>创建</Button>
          <Divider type="vertical" />
          <Button disabled={local.isLoading} onClick={() => search(local.dirpath)}>刷新</Button>
        </Right>
      </FullHeightFix>
      <Modal
        open={local.showModal}
        okText="创建"
        cancelText="取消"
        closable={false}
        style={{ top: window.screen.height / 2 + 'px', transform: 'translate(0, -50%)' }}
        onCancel={() => local.showModal = false}
        onOk={async () => {
          const oinput = nameRef.current.input
          if (oinput.value.trim()) {
            let dirname = oinput.value.trim()
            try {
              local.isLoading = true
              const otxt = document.getElementById('txt');
              let txt = '';
              if (otxt) {
                txt = otxt.value;
              }
              const res = await createFile(local.dirpath + dirname, { content: txt })
              if (res && res.code === 0) {
                oinput.value = ''
                nameRef.current.state.value = ''
                local.showModal = false
                search(local.dirpath)
                notification.success({ message: '创建成功' });
              } else {
                notification.error({ message: '创建失败' });
              }
            } catch (e) {
              notification.error({ message: '请求失败' });
            } finally {
              local.isLoading = false
            }
          } else {
            message.info('名称不合法', 2)
          }
        }}
      >
        <Input addonBefore={<Select value={local.createType === 'file' ? 0 : 1} onChange={v => {
          local.createType = v === 1 ? 'dir' : 'file';
        }}>
          <Select.Option value={0}>文件</Select.Option>
          <Select.Option value={1}>文件夹</Select.Option>
        </Select>} disabled={local.isLoading} ref={ref => nameRef.current = ref} autoFocus />
        {local.createType === 'file' && <TextArea id="txt" style={{ marginTop: 10 }} disabled={local.isLoading}></TextArea>}
      </Modal>
      <Modal
        open={local.show_cmd}
        footer={<div style={{ textAlign: 'right' }}>
          <Button type="ghost" onClick={() => { local.show_cmd = false }}>取消</Button>
          <Button type="primary" disabled={local.isExcuting} onClick={async () => {
            local.template_data.filename = local.template_data.filename.trim()
            if (!local.template_data.id || !local.template_data.filename) {
              return notification.warn({ message: '缺少必要参数' })
            }
            if (local.template_data.limit !== 0 && local.chosen_files.length !== local.template_data.limit) {
              return notification.warn({ message: '文件个数不符合要求' })
            }
            local.isExcuting = true;
            try {
              const id = local.template_data.id;
              const data = {
                filename: local.template_data.filename,
                files: local.chosen_files,
              }
              await apis.excuteTemplate(id, data)
              if (outputRef.current) {
                outputRef.current.value = '';
              }
              search(local.dirpath);
              local.show_cmd = false;
            } finally {
              local.isExcuting = false;
            }
          }}>执行</Button>
        </div>}
        closable={false}
      >
        <Input
          addonBefore={<Select
            style={{ width: 150 }}
            value={local.template_data.id}
            disabled={local.isExcuting}
            onSelect={v => {
              local.template_data.id = v;
              const item = local.cmd_templates.find(item => item.name === v);
              if (item) {
                local.template_data.placeholder = item.placeholder;
                local.template_data.limit = item.limit;
              }
            }}>
            <Select.Option value="">请选择</Select.Option>
            {local.cmd_templates.map(tpl => (
              <Select.Option value={tpl.name} key={tpl.name}>{tpl.title}</Select.Option>
            ))}
          </Select>}
          value={local.template_data.filename}
          disabled={local.isExcuting}
          placeholder={local.template_data.placeholder}
          ref={ref => outputRef.current = ref}
          onChange={e => {
            local.template_data.filename = e.target.value;
          }}
          autoFocus />
      </Modal>
      <FullHeightAuto>
        <FullWidth style={{ alignItems: 'flex-start' }}>
          <FullWidthAuto style={{ overflowX: 'auto' }}>
            <Table dataSource={local.q ? local.searched_files : local.files} rowKey="name" scroll={{ y: 'calc(100vh - 180px)' }} pagination={false} loading={local.isLoading}>
              <Column key="name" dataIndex={"name"} width={35} render={(text, record) => {
                return record.dir ? null : <Checkbox onChange={(e) => {
                  const filepath = local.dirpath + text;
                  if (e.target.checked) {
                    local.chosen_files.push(filepath);
                  } else {
                    const index = local.chosen_files.findIndex((file) => file === filepath);
                    if (index !== -1) {
                      local.chosen_files.splice(index, 1);
                    }
                  }
                }} />
              }} />
              <Column title={
                <span>
                  <HomeOutlined onClick={() => jump(0)} />&nbsp;/&nbsp;
                  {
                    local.dirpath
                      .split('/')
                      .filter(n => !!n)
                      .map((name, i) => <span key={i} style={i !== local.dirLevel ? { cursor: 'pointer' } : {}} onClick={() => {
                        if (i !== local.dirLevel)
                          jump(i + 1)
                      }}>
                        {name}
                        <span style={{ margin: 3 }}>/</span>
                      </span>)
                  }
                </span>
              } dataIndex="name" key="name" render={(text, record) => {
                return <Observer>{() => {
                  if (record.dir) {
                    return <Link to={''} onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      const new_dir = local.dirpath + text + '/';
                      local.q = '';
                      if (searchRef.current) {
                        searchRef.current.value = ''
                      }
                      search(new_dir)
                    }}>{text}</Link>
                  } else if (record.editing) {
                    return <Input
                      defaultValue={text}
                      disabled={record.isLoading}
                      autoFocus
                      addonAfter={record.isLoading ? <LoadingOutlined /> : <div>
                        <CheckOutlined onClick={async (e) => {
                          const o = e.currentTarget.parentNode.parentNode.previousSibling
                          record.isLoading = true
                          try {
                            await renameFile({ dirpath: local.dirpath, oldname: text, newname: o.value })
                            search(local.dirpath)
                            record.editing = false
                          } catch (e) {
                            message.info(e.message)
                          } finally {
                            record.isLoading = false
                          }
                        }} />
                        <Divider type="vertical" />
                        <CloseCircleOutlined onClick={() => record.editing = false} />
                      </div>} />
                  } else {
                    return <HoverTitle>{text} <FormOutlined onClick={() => record.editing = true} /></HoverTitle>
                  }
                }}</Observer>
              }} />
              <Column title="操作" width={200} dataIndex="action" key="action" align="center" render={(text, record) => {
                const filepath = store.app.baseUrl + '/v1/public/share-file' + local.dirpath + record.name
                return <Fragment>
                  <VisualBox visible={record.dir === true}>
                    <Popconfirm title={`确定删除 ${record.name} 所有子文件?`} okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => {
                      destroyFile({ param: local.dirpath + record.name, isDir: 1 }).then(() => search(local.dirpath))
                    }}>
                      <DeleteOutlined />
                    </Popconfirm>
                  </VisualBox>
                  <VisualBox visible={record.dir === false}>
                    <Clipboard data-clipboard-text={window.location.origin + local.dirpath + record.name} component={'a'}>
                      <SwitcherOutlined />
                    </Clipboard>
                    <Divider type='vertical' />
                    <Popconfirm icon={null} title={'fuck qrcode'} okText='打开' cancelText='取消' onConfirm={() => {
                      window.open(filepath, '_blank');
                    }}>
                      <ScanOutlined />
                    </Popconfirm>
                    {/* <Divider type="vertical" />
                                <DownloadOutlined title={filepath} onClick={() => {
                                    
                                }} /> */}
                    <Divider type="vertical" />
                    <Popconfirm title="确定?" okText="确定" cancelText="取消" icon={<WarningOutlined />} onConfirm={() => {
                      destroyFile({ param: local.dirpath + record.name }).then(() => search(local.dirpath))
                    }}>
                      <DeleteOutlined />
                    </Popconfirm>
                    <Divider type="vertical" />
                    <ExclamationCircleOutlined onClick={() => {
                      local.stream_path = local.dirpath + record.name;
                      getFileInfo();
                    }} />
                  </VisualBox>
                </Fragment>
              }} />
            </Table>
          </FullWidthAuto>
          {local.stream_path && <FullWidthFix style={{ position: 'relative', display: 'flex', width: 300, width: 270, boxSizing: 'border-box', paddingLeft: 30, flexDirection: 'column', height: '100%' }}>
            <DeleteOutlined onClick={() => { local.streams = []; local.stream_path = ''; local.loading_stream = false; }} style={{ position: 'absolute', top: 0, right: 20 }} color='red' />
            {local.streams.map(stream => <div key={stream.id} style={{ border: '1px dashed #ccc', padding: 10, borderRadius: 10, marginRight: 30, marginBottom: 10 }}>
              <div>流类型: {stream.codec_type}</div>
              <div>编码器类型: {stream.codec_name}</div>
              <div>编解码器实现: {stream.codec_tag_string}</div>
              {stream.profile && <div>硬件支持级别: {stream.profile} <Tooltip title={<Fragment>
                Baseline：基础配置，通常没有高级编码特性（如 B 帧），适合低延迟应用（例如视频通话）。<br />
                Main：用于标准画质视频流，支持更高的压缩率和较好的兼容性，常用于电视和流媒体。<br />
                High：提供更高压缩率和质量，通常用于高分辨率视频文件，如蓝光光盘。<br />
                High10、High422、High444：分别支持 10-bit 色深、4:2:2 色度采样和 4:4:4 色度采样，适合专业视频编辑和存储高质量视频。
              </Fragment>}><ExclamationCircleOutlined /></Tooltip></div>}
              {stream.level && <div>编码复杂度: {stream.level} <Tooltip title={<Fragment>
                1 到 3.1：适合低分辨率、低帧率的视频流，比如移动设备或网络低码率视频。<br />
                4.0 到 4.2：用于高清 1080p 视频。<br />
                5.0 及以上：适合 4K 视频等高分辨率内容。
              </Fragment>}><ExclamationCircleOutlined /></Tooltip></div>}
              {stream.display_aspect_ratio && <div>显示比例: {stream.display_aspect_ratio}</div>}
              {stream.width && <div>宽度: {stream.width}</div>}
              {stream.height && <div>高度: {stream.height}</div>}
              {stream.coded_width && <div>帧宽度: {stream.coded_width}</div>}
              {stream.coded_height && <div>帧高度: {stream.coded_height}</div>}
              {stream.duration && <div>时长: {stream.duration}</div>}
              {stream.bit_rate && <div>码率: {stream.bit_rate}</div>}
              {stream.nb_frames && <div>总帧数: {stream.nb_frames}</div>}
              {stream.r_frame_rate && <div>原始帧率: {stream.r_frame_rate}</div>}
              {stream.avg_frame_rate && <div>平均帧率: {stream.avg_frame_rate}</div>}
              {stream.sample_rate && <div>采样率: {stream.sample_rate}</div>}
              {stream.channels && <div>声道数: {stream.channels}</div>}
              {stream.channel_layout && <div>声道布局: {stream.channel_layout} <Tooltip title={<Fragment>
                stereo：表示音频流为立体声，通常包含两个声道（左声道和右声道）。<br />
                mono：表示单声道音频，仅包含一个声道。<br />
                5.1：表示环绕声布局，包含六个声道（左前、右前、中间、低音、左后、右后）。<br />
                7.1：表示更复杂的环绕声布局，包含八个声道。
              </Fragment>}><ExclamationCircleOutlined /></Tooltip></div>}
            </div>)}
          </FullWidthFix>}
        </FullWidth>

      </FullHeightAuto>
    </FullHeight>
  )
  }</Observer >
}