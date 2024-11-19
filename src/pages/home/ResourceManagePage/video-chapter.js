import { Observer, useLocalStore } from 'mobx-react-lite'
import React, { Fragment, useCallback, useRef } from 'react'
import _ from 'lodash';
import qs from 'qs'
import { useEffectOnce } from 'react-use';
import apis from '../../../api';
import { CenterXY, FullHeight, FullHeightAuto, FullHeightFix, FullWidth } from '../../../component/style';
import { Button, Divider, Input, InputNumber, Modal, Select, Space } from 'antd';
import { CloseOutlined, PictureOutlined, ScissorOutlined, CheckOutlined, AimOutlined, CameraOutlined, ColumnWidthOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';

export default function VideoChapter() {
  const query = qs.parse(window.location.search.substr(1));
  const local = useLocalStore(() => ({
    id: query._id,
    status: 'loading',
    fetching: false,
    video: null,
    chapters: [],
    show_cut: false,
    temp_chapter: null,
    time: 0,
    disabled: true,
  }));
  const videoRef = useRef(null);
  useEffectOnce(() => {
    apis.getVideo(local.id).then(body => {
      console.log(body)
      if (body.code === 0) {
        local.video = _.omit(body.data, ['chapters']);
        local.chapters = body.data.chapters || [];
      } else {
        local.status = 'error';
      }
    }).catch(e => {
      local.status = 'error';
    }).finally(() => {
      if (local.status !== 'error') {
        local.status = 'finished';
      }
    })
  })
  const seek = useCallback((time) => {
    if (videoRef.current) {
      videoRef.current.seek(time);
    }
  });
  return <Observer>{() => {
    if (local.status !== 'finished') {
      return <CenterXY>
        {local.status === 'error' ? <Fragment>获取失败，<Button onClick={() => window.location.reload()}>重试</Button></Fragment> : '加载中...'}
      </CenterXY>
    }
    return <FullHeight>
      <div style={{ display: 'flex', borderBottom: '1px dashed #ccc', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <video
          preload='metadata'
          ref={node => videoRef.current = node}
          src={"http://192.168.0.124" + local.video.path}
          onTimeUpdate={t => {
            local.time = t.currentTarget.currentTime;
          }}
          onCanPlay={() => {
            local.disabled = false;
          }}
          onSeeking={() => {
            local.disabled = true;
          }}
          onSeeked={() => {
            local.disabled = false;
          }}
          style={{ width: 480, height: 270 }}
          controls></video>
        <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', width: 480 }}>
          <Space style={{ margin: '15px 0' }} size={15}>
            <ScissorOutlined style={{ fontSize: 24 }} disabled={local.disabled} onClick={() => {

            }} />

            <div style={{ width: 100 }}></div>
            <VerticalAlignMiddleOutlined style={{ fontSize: 32, transform: 'rotate(90deg)' }} disabled={local.disabled} onClick={() => {
              local.chapters.push({
                type: 3,
                title: '',
                uid: '',
                mid: local.id,
                mtype: 'video',
                status: 4,
                more: { starttime: local.time },
                nth: local.chapters.length,
              })
            }} />
            <ColumnWidthOutlined style={{ fontSize: 28 }} disabled={local.disabled} onClick={() => {
              local.chapters.push({
                type: 4,
                title: '',
                uid: '',
                mid: local.id,
                mtype: 'video',
                status: 4,
                more: { starttime: local.time, endtime: local.time },
                nth: local.chapters.length,
              })
            }} />
            <PictureOutlined style={{ fontSize: 24 }} disabled={local.disabled} onClick={async () => {
              try {
                local.disabled = true;
                const data = {
                  type: 5,
                  title: '',
                  uid: '',
                  mid: local.id,
                  mtype: 'video',
                  status: 4,
                  more: { starttime: local.time },
                  nth: local.chapters.length,
                };
                const result = await apis.putVideoChapter(data);
                if (result.code === 0) {
                  local.chapters.push(result.data)
                }
              } catch (e) {

              } finally {
                local.disabled = false;
              }
            }} />

          </Space>
        </div>
      </div>
      <FullHeightAuto style={{ padding: '10px 15%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        {local.chapters.map((chapter, i) => (
          <FullWidth key={i} style={{ width: '100%', marginBottom: 10 }}>
            <Input
              addonBefore={<Select value={chapter.type} onChange={v => {
                chapter.type = v;
              }}>
                <Select.Option value={3}>点</Select.Option>
                <Select.Option value={4}>段</Select.Option>
                <Select.Option value={5}>图</Select.Option>
              </Select>}
              placeholder='标题'
              defaultValue={chapter.title}
              onCompositionEnd={e => {
                chapter.title = e.currentTarget.value;
              }}
            />
            {chapter.type === 5 && <Fragment>
              <Input defaultValue={chapter.path} onCompositionEnd={e => {
                chapter.path = e.currentTarget.value;
              }} addonAfter={<CameraOutlined onClick={() => {

              }} />} />
            </Fragment>}
            <Divider type='vertical' />
            <Space>
              <Input value={chapter.more.starttime} style={{ minWidth: 120, width: 120 }} onChange={e => {
                chapter.more.starttime = e.currentTarget.value;
              }} onBlur={() => {
                chapter.more.starttime = parseFloat(chapter.more.starttime);
              }} addonAfter={<AimOutlined onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = chapter.more.starttime;
                }
              }} />} />
              <CheckOutlined disabled={local.disabled} onClick={async () => {
                const result = await apis.putVideoChapter(chapter);
                if (result.code === 0) {
                  if (!chapter._id) {
                    chapter._id = result.data._id;
                  }
                }
              }} />
              <CloseOutlined disabled={local.disabled} onClick={async () => {
                if (chapter._id) {
                  await apis.delVideoChapter(chapter.mid, chapter._id);
                }
                local.chapters.splice(i, 1);
              }} />
            </Space>
          </FullWidth>
        )
        )}
      </FullHeightAuto>
    </FullHeight>
  }}</Observer>
}