import { Observer, useLocalStore } from 'mobx-react-lite'
import React, { Fragment, useCallback, useRef } from 'react'
import _ from 'lodash';
import qs from 'qs'
import { useEffectOnce } from 'react-use';
import apis from '../../../api';
import { CenterXY, FullHeight, FullHeightAuto, FullHeightFix, FullWidth } from '../../../component/style';
import { Button, Divider, Input, InputNumber, Modal, Select, Space } from 'antd';
import { CloseOutlined, PictureOutlined, ScissorOutlined, CheckOutlined, AimOutlined, CameraOutlined, ColumnWidthOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';

function to_p2(d) {
  return Math.floor(100 * d) / 100;
}

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
    autoSaveChapter: async (chapter) => {
      try {
        local.disabled = true;
        const result = await apis.putVideoChapter(chapter);
        if (result.code === 0) {
          if (!chapter._id) {
            chapter._id = result.data._id;
          }
          return result.data;
        }
      } catch (e) {

      } finally {
        local.disabled = false;
      }
    }
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
          onKeyDownCapture={e => {
            e.preventDefault();
            e.stopPropagation();
            if (!videoRef.current) {
              return
            }
            switch (e.key) {
              case 'ArrowRight':
                videoRef.current.currentTime = local.time + 10;
                break;
              case 'ArrowLeft':
                videoRef.current.currentTime = local.time - 5;
                break;
              case 'ArrowUp':
                videoRef.current.volume += 0.05
                break;
              case 'ArrowDown':
                videoRef.current.volume -= 0.05
                break;
              default: break;
            }
          }}
          style={{ width: 480, height: 270 }}
          controls></video>
        <div style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column', width: 480 }}>
          <Space style={{ margin: '15px 0' }} size={15}>
            <ScissorOutlined style={{ fontSize: 24 }} disabled={local.disabled} onClick={() => {

            }} />
            <div style={{ width: 100 }}></div>
            <VerticalAlignMiddleOutlined style={{ fontSize: 32, transform: 'rotate(90deg)' }} disabled={local.disabled} onClick={async () => {
              const data = await local.autoSaveChapter({
                type: 3,
                title: '',
                uid: '',
                mid: local.id,
                mtype: 'video',
                status: 4,
                more: { starttime: to_p2(local.time) },
                nth: local.chapters.length,
              });
              if (data) {
                local.chapters.push(data);
              }
            }} />
            <ColumnWidthOutlined style={{ fontSize: 28 }} disabled={local.disabled} onClick={async () => {
              const data = await local.autoSaveChapter({
                type: 4,
                title: '',
                uid: '',
                mid: local.id,
                mtype: 'video',
                status: 4,
                more: { starttime: to_p2(local.time), endtime: to_p2(local.time) },
                nth: local.chapters.length,
              });
              if (data) {
                local.chapters.push(data);
              }
            }} />
            <PictureOutlined style={{ fontSize: 24 }} disabled={local.disabled} onClick={async () => {
              const data = await local.autoSaveChapter({
                type: 5,
                title: '',
                uid: '',
                mid: local.id,
                mtype: 'video',
                status: 4,
                more: { starttime: to_p2(local.time) },
                nth: local.chapters.length,
              });
              if (data) {
                local.chapters.push(data);
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
                if (v === 5) {
                  chapter.more.endtime = chapter.more.starttime;
                } else {
                  delete chapter.more.endtime;
                }
                local.autoSaveChapter(chapter);
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
              onBlur={() => {
                local.autoSaveChapter(chapter);
              }}
            />
            {chapter.type === 5 && <Fragment>
              <Input value={chapter.path} readOnly addonBefore={<Observer>{() => (
                <Select style={{ width: 70 }} defaultValue={chapter.path} onSelect={v => {
                  chapter.path = v;
                  local.autoSaveChapter(chapter);
                }}>
                  <Select.Option value="/images/sex-position/kiss.svg">吻</Select.Option>
                  <Select.Option value="/images/sex-position/roll.svg">揉</Select.Option>
                  <Select.Option value="/images/sex-position/licking.svg">舔</Select.Option>
                  <Select.Option value="/images/sex-position/handjob.svg">手</Select.Option>
                  <Select.Option value="/images/sex-position/blowjob.svg">口</Select.Option>
                  <Select.Option value="/images/sex-position/cowgirl.svg">骑乘</Select.Option>
                  <Select.Option value="/images/sex-position/spooning.svg">侧身</Select.Option>
                  <Select.Option value="/images/sex-position/doggy.svg">后入</Select.Option>
                  <Select.Option value="/images/sex-position/missionary.svg">经典</Select.Option>
                </Select>
              )}</Observer>}
                onPaste={e => {
                  chapter.path = e.target.value;
                }}
                onBlur={() => {
                  local.autoSaveChapter(chapter);
                }}
                addonAfter={<CameraOutlined onClick={() => {

                }} />} />
            </Fragment>}
            <Divider type='vertical' />
            <Space>
              <Input value={chapter.more.starttime} style={{ minWidth: 120, width: 120 }} onChange={e => {
                chapter.more.starttime = e.currentTarget.value;
                local.autoSaveChapter(chapter);
              }} onBlur={() => {
                chapter.more.starttime = parseFloat(chapter.more.starttime);
                local.autoSaveChapter(chapter);
              }} addonAfter={<AimOutlined onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = chapter.more.starttime;
                }
              }} />} />
              <Input value={chapter.more.endtime} style={{ minWidth: 120, width: 120 }} onChange={e => {
                chapter.more.endtime = e.currentTarget.value;
                local.autoSaveChapter(chapter);
              }} onBlur={() => {
                chapter.more.endtime = parseFloat(chapter.more.endtime);
                local.autoSaveChapter(chapter);
              }} addonAfter={<AimOutlined onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = chapter.more.endtime;
                }
              }} />} />
              {/* <CheckOutlined disabled={local.disabled} onClick={async () => {
                local.autoSaveChapter(chapter)
              }} /> */}
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