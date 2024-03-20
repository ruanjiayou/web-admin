import React, { useRef, useCallback, Fragment } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import axios from 'axios'
import { useEffectOnce } from 'react-use';
import { Table, Popconfirm, notification, Select, Tag, Divider, message, Tooltip, Button, Form, Input, Radio, Modal, } from 'antd';
import { LinkOutlined, PoweroffOutlined, PlayCircleOutlined, PlusCircleOutlined, SyncOutlined, FormOutlined, DeleteOutlined, CheckOutlined, BarcodeOutlined, FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { events } from '../../../utils/events';
import shortid from 'shortid';
import { formatNumber } from '../../../utils/helper';

const download_api_url = 'https://192.168.0.124/gw/download';
const { Column } = Table;
const Item = Form.Item;

export default function Page() {
  const local = useLocalStore(() => ({
    tasks: [],
    page: 1,
    headers_list: JSON.parse(localStorage.getItem('headers_history') || '[]'),
    loading: false,
    edit_id: '',
    status: '1,2,3',
    total: 0,
    data: {},
    ts: Date.now(),
    showDialog: false,
    changeProgress: (d) => {
      local.tasks.forEach(task => {
        if (task._id === d.id) {
          task.params.total = d.total;
          task.params.finished = d.finished;
          if (d.total === d.finished) {
            task.status = 3;
          }
        }
      })
    }
  }));
  const addRef = useRef(null);
  const onSearch = useCallback(async () => {
    try {
      local.loading = true;
      const resp = await axios.get(`${download_api_url}/tasks?page=${local.page}&status=${local.status}`);
      if (resp.status === 200) {
        const result = resp.data;
        if (result.code === 0) {
          local.tasks = result.data.list;
          local.total = result.data.total;
        } else {
          message.error('获取任务列表出错')
        }
      } else {
        message.error('请求任务列表出错')
      }
    } finally {
      local.loading = false;
    }
  });
  useEffectOnce(() => {
    onSearch();
    const progress = function (d) {
      local.changeProgress(d)
      local.ts = Date.now();
    }
    events.on('progress_change', progress);
    events.on('resource_change', function (d) {
      onSearch();
    });
    events.on('transcode', function (d) {
      onSearch();
    })
    return () => {
      events.off('progress_change', progress);
    }
  })

  return <Observer>{() => (
    <Fragment>
      <div style={{ padding: 10, textAlign: 'right' }}>
        <Select defaultValue={local.status} onChange={(status) => {
          local.status = status;
          onSearch();
        }}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="1,2,3">未完成</Select.Option>
          <Select.Option value="1">已解析</Select.Option>
          <Select.Option value="2">下载中</Select.Option>
          <Select.Option value="3">已下载</Select.Option>
          <Select.Option value="4">失败</Select.Option>
          <Select.Option value="5">已完成</Select.Option>
        </Select>
        <Divider type='vertical' />
        <Button type='primary' onClick={() => {
          local.edit_id = ''
          local.data = { type: 'm3u8', status: 1, name: '', url: '', proxy: true, transcode: 1, filepath: '', params: {} };
          local.showDialog = true;
        }}>添加</Button>
        <Divider type='vertical' />
        <Button type='primary' onClick={() => { onSearch() }}>刷新</Button>
      </div>
      <Table dataSource={local.tasks} rowKey="_id" scroll={{ y: 'calc(100vh - 273px)' }} key={local.ts} loading={local.loading} pagination={{
        pageSize: 20,
        current: local.page,
        total: local.count,
      }} onChange={(page) => {
        local.page = page.current
        onSearch()
      }}>
        <Column title="" width={70} dataIndex={'url'} render={(url, task) => (
          <Fragment>
            <a href={url} target='_blank' style={{ whiteSpace: 'nowrap' }}>
              <LinkOutlined />
            </a>
            &nbsp;&nbsp;
            {task.type === 'image' ? <FileImageOutlined /> : <VideoCameraOutlined />}
          </Fragment>
        )} />
        <Column title="名称" width={150} dataIndex={'name'} render={(name, task) => (
          <Tooltip title={task._id}>
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          </Tooltip>
        )} />
        <Column title="进度" dataIndex={'_id'} render={(id, task) => (
          <div>
            <div style={{ height: 22, backgroundColor: 'grey', color: 'white' }}>
              {task.params.finished * 2 > task.params.total ? <div style={{ backgroundColor: '#54c77d', color: 'white', textAlign: 'right', width: `${Math.round(100 * task.params.finished / task.params.total)}%` }}>{task.type === 'm3u8' ? task.params.finished + '/' + task.params.total : formatNumber(task.params.finished) + '/' + formatNumber(task.params.total)}&nbsp;</div> : (
                <Fragment>
                  <div style={{ float: 'left', backgroundColor: '#54c77d', height: 22, color: 'white', width: `${Math.round(100 * task.params.finished / task.params.total)}%` }}></div>
                  &nbsp;&nbsp;{task.type === 'm3u8' ? task.params.finished + '/' + task.params.total : formatNumber(task.params.finished) + '/' + formatNumber(task.params.total)}
                </Fragment>)}
            </div>
          </div>
        )} />
        <Column title="下载状态" width={100} dataIndex={'status'} render={(status, task) => {
          if (status === 1) {
            return <div>已解析&nbsp;<PlayCircleOutlined onClick={async () => {
              try {
                local.loading = true;
                await axios.post(`${download_api_url}/excute/start`, { id: task._id });
                task.status = 2;
              } catch (e) {
                message.error('启动下载失败')
              } finally {
                local.loading = false;
              }
            }} /></div>
          } else if (status === 2) {
            return <div>下载中&nbsp;<PoweroffOutlined onClick={async () => {
              try {
                local.loading = true;
                await axios.post(`${download_api_url}/excute/stop`, { id: task._id });
                task.status = 1;
              } catch (e) {
                message.error('停止下载失败')
              } finally {
                local.loading = false;
              }
            }} /></div>
          } else if (status === 3) {
            return <div>{task.transcode === 3 ? <Button type='primary' onClick={async () => {
              try {
                local.loading = true;
                await axios.post(`${download_api_url}/excute/move`, { id: task._id });
                task.status = 5;
              } catch (e) {
                message.error('转移失败')
              } finally {
                local.loading = false;
              }
            }}>转移文件</Button> : '下载成功'}</div>
          } else if (status === 4) {
            return '出错'
          } else if (status === 5) {
            return '已完成'
          } else {
            return '未知状态'
          }
        }} />
        <Column title="转码状态" width={120} dataIndex={'transcode'} key="transcode" render={(transcode, task) => (
          <Fragment>
            {task.transcode === 1 && (task.status === 3 ? <Button disabled={local.loading} type='link' onClick={async () => {
              try {
                local.loading = true;
                axios.post(`${download_api_url}/excute/transcode`, { id: task._id });
                task.transcode = 2;
                local.loading = false;
              } finally {
              }
            }}>转码</Button> : '待转码')}
            {task.transcode === 2 && '转码中'}
            {task.transcode === 3 && '转码成功'}
            {task.transcode === 4 && '转码失败'}
            {task.transcode === 0 && '无需转码'}

          </Fragment>
        )} />
        <Column dataIndex={'_id'} render={(id, task) => (
          <div>
            <Popconfirm
              title="确认"
              onConfirm={async () => {
                try {
                  local.loading = true;
                  await axios.delete(`${download_api_url}/tasks/${id}`);
                  await onSearch();
                } catch (e) {
                  message.error('删除失败')
                } finally {
                  local.loading = false;
                }
              }}
            >
              <DeleteOutlined />
            </Popconfirm>
            <Divider type='vertical' />
            <FormOutlined onClick={() => {
              local.edit_id = task._id
              local.data = task;
              local.showDialog = true;
            }} />
            <Divider type='vertical' />
            <CheckOutlined onClick={async () => {
              try {
                local.loading = true
                const res = await axios.post(`${download_api_url}/excute/check`, { id: task._id });
                if (res.status === 200) {
                  res.data.code === 0 ? message.success('检查完毕') : message.error(res.data.message || '失败');
                }
              } finally {
                local.loading = false
              }
            }} />
          </div>
        )} />
      </Table>
      <Modal
        width={750}
        title={!local.edit_id ? '添加' : "修改"}
        visible={local.showDialog}
        okText={!local.edit_id ? '添加' : "修改"}
        cancelText="取消"
        onOk={async () => {
          local.loading = true
          try {
            local.loading = true;
            const resp = local.edit_id ? await axios.put('https://192.168.0.124/gw/download/tasks/' + local.edit_id, local.data) : await axios.post('https://192.168.0.124/gw/download/tasks', local.data);
            if (resp.status === 200 && resp.data.code === 0) {
              local.showDialog = false;
              message.success('成功')
              onSearch();
            } else {
              message.error('失败')
            }
          } catch (e) {
            message.error('请求失败')
          }
          local.loading = false;
        }}
        onCancel={() => {
          local.showDialog = false;
        }}>
        <Form>
          {!local.edit_id && <Item label="标题" labelCol={{ span: 4 }}>
            <Input value={local.data.name} onChange={e => local.data.name = e.target.value} defaultValue={''} />
          </Item>}
          {!local.edit_id && <Item label="_id" labelCol={{ span: 4 }}>
            <Input value={local.data._id} disabled={local.data._id || local.data.status !== 1} onChange={e => local.data._id = e.target.value} defaultValue={''} addonAfter={<BarcodeOutlined onClick={() => {
              if (!local.data._id) {
                local.data._id = shortid();
              }
            }} />} />
          </Item>}
          <Item label="保存路径:" labelCol={{ span: 4 }}>
            <Input value={local.data.filepath} onChange={e => local.data.filepath = e.target.value} defaultValue={local.data.filepath} />
          </Item>
          <Item label="url:" labelCol={{ span: 4 }}>
            <Input value={local.data.url} autoFocus onChange={e => local.data.url = e.target.value} defaultValue={local.data.url} />
          </Item>
          <Item label="header:" labelCol={{ span: 4 }}>
            <Select onChange={(v) => {
              local.data.header = JSON.parse(v);
            }}>
              {local.headers_list.map((headers, i) => (<Select.Option key={i} value={JSON.stringify(headers)}>{headers.Origin}</Select.Option>))}
            </Select>
            <Divider />
            <Input ref={ref => addRef.current = ref} addonAfter={<PlusCircleOutlined onClick={(e) => {
              try {
                if (addRef.current) {
                  const d = JSON.parse(addRef.current.input.value.trim());
                  local.headers_list.push(d);
                  localStorage.setItem('headers_history', JSON.stringify(local.headers_list))
                }
              } finally {
                addRef.current.input.value = '';
                addRef.current.state.value = '';
              }
            }} />} />
          </Item>
          <Item label="代理" labelCol={{ span: 4 }}>
            <Radio.Group name="proxy" value={local.data.proxy} onChange={e => local.data.proxy = e.target.value}>
              <Radio value={false}>无</Radio>
              <Radio value={true}>有</Radio>
            </Radio.Group>
          </Item>
          <Item label="from" labelCol={{ span: 4 }}>
            <Radio.Group name="from" value={local.data.type} onChange={e => {
              local.data.type = e.target.value;
              if (local.data.type === 'image') {
                local.data.transcode = 0;
              }
            }}>
              <Radio value={'m3u8'}>m3u8</Radio>
              <Radio value={'mp4'}>mp4</Radio>
              <Radio value={'image'}>image</Radio>
            </Radio.Group>
          </Item>
          <Item label="状态" labelCol={{ span: 4 }}>
            <Radio.Group name="status" value={local.data.status} onChange={e => {
              local.data.status = e.target.value;
            }}>
              <Radio value={1}>已创建</Radio>
              <Radio value={2}>下载中</Radio>
              <Radio value={3}>已下载</Radio>
              <Radio value={4}>失败</Radio>
              <Radio value={5}>已完成</Radio>
            </Radio.Group>
          </Item>
          <Item label="转码" labelCol={{ span: 4 }}>
            <Radio.Group name="transcode" value={local.data.transcode} onChange={e => {
              local.data.transcode = e.target.value;
            }}>
              <Radio value={0}>无需转码</Radio>
              <Radio value={1}>待转码</Radio>
              <Radio value={2}>转码中</Radio>
              <Radio value={3}>成功</Radio>
              <Radio value={4}>失败</Radio>
            </Radio.Group>
          </Item>
        </Form>
      </Modal>
    </Fragment>
  )
  }</Observer >
}