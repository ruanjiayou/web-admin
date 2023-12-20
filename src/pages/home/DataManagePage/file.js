import React, { useEffect, useCallback, Fragment, useRef } from 'react';
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Table, Popconfirm, notification, Button, Divider, Input, Upload, message, Checkbox, Select, } from 'antd';
import { DeleteOutlined, WarningOutlined, ArrowLeftOutlined, ScanOutlined, UploadOutlined, CheckOutlined, FormOutlined, LoadingOutlined, CloseCircleOutlined, HomeOutlined, SwitcherOutlined } from '@ant-design/icons'
import apis from '../../../api'
import store from '../../../store'
import { FullHeight, FullHeightFix, FullHeightAuto, Right, padding } from '../../../component/style'
import { Icon, VisualBox } from '../../../component'
import Modal from 'antd/lib/modal/Modal';
import { Link } from 'react-router-dom';
import { QRCode } from 'react-qrcode'
import { HoverTitle } from './file.style'
import { useRouter } from '../../../contexts';
import TextArea from 'antd/lib/input/TextArea';
import Clipboard from 'react-clipboard.js';

const { getFiles, createFile, destroyFile, renameFile } = apis
const { Column } = Table;

export default function TaskList() {
  const local = useLocalStore(() => ({
    isLoading: false,
    showModal: false,
    dirpath: '/',
    get dirLevel() {
      return this.dirpath.split('/').filter(n => !!n).length;
    },
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
  const router = useRouter();
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
  useEffect(() => {
    const query = router.getQuery();
    search(query.home || '/')
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
                const res = await createFile({
                  isdir: 0,
                  param: local.dirpath,
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
            if (outputRef.current) {
              outputRef.current.value = ''
              outputRef.current.state.value = '';
            }
            local.show_cmd = true;
          }}>执行命令</Button>
          <Divider type="vertical" />
          <Button onClick={() => {
            ;
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
        visible={local.showModal}
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
              const res = await createFile({ isDir: local.createType === 'dir' ? 1 : 0, param: local.dirpath, name: dirname, content: txt })
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
        visible={local.show_cmd}
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
          defaultValue={''}
          disabled={local.isExcuting}
          placeholder={local.template_data.placeholder}
          ref={ref => outputRef.current = ref}
          onChange={e => {
            local.template_data.filename = e.target.value;
          }}
          autoFocus />
      </Modal>
      <FullHeightAuto>
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
                <Divider type='vertical'/>
                <Popconfirm icon={null} title={<QRCode style={{ marginLeft: -22 }} value={filepath} />} okText='打开' cancelText='取消' onConfirm={() => {
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
              </VisualBox>
            </Fragment>
          }} />
        </Table>
      </FullHeightAuto>
    </FullHeight>
  )
  }</Observer >
}