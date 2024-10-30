import { Observer, useLocalStore } from 'mobx-react-lite';
import React, { useCallback, useEffect, Fragment } from 'react';
import apis from '../../api'
import { FullWidthFix } from '../../component/style';
import { Tooltip, message } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

export default function StreamInfo({ filepath, onClose }) {
  const local = useLocalStore(() => ({
    streams: [],
    loading: false,
  }));
  const getInfo = useCallback(async (fullpath) => {
    try {
      local.loading = true;
      const data = await apis.loadingInfo(fullpath);
      if (data.code === 0) {
        local.streams = data.data;
      } else {
        message.error('获取详情失败');
      }
    } finally {
      local.loading = false;
    }
  });
  useEffect(() => {
    if (filepath) {
      getInfo(filepath);
    }
  }, [filepath]);
  return <Observer>{() => filepath ? (
    <FullWidthFix style={{ position: 'relative', display: 'flex', width: 300, width: 270, paddingBottom: 30, boxSizing: 'border-box', flexDirection: 'column', height: '100%' }}>
      <DeleteOutlined size={'48px'} onClick={() => {
        local.streams = []; local.loading = false;
        if (onClose) {
          onClose();
        }
      }} style={{ position: 'absolute', top: 20, right: 20 }} color='red' />
      {local.streams.map(stream => <div key={stream.id} style={{ border: '1px dashed #ccc', padding: 10, borderRadius: 10, margin: 30, marginBottom: 0 }}>
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
    </FullWidthFix>
  ) : null}</Observer>
}