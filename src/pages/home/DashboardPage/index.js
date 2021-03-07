import React, { Fragment, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useStore } from '../../../contexts'
import shttp from '../../../utils/shttp'
import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Padding } from '../../../component/style'
import ReactECharts from 'echarts-for-react';
import { useEffectOnce } from 'react-use'
import api from '../../../api'
import { re } from 'mathjs'

function testUpload(data) {
  const form = new FormData()
  for (let k in data) {
    form.append(k, data[k])
  }
  return shttp({
    url: `/v1/public/test/upload`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: form,
  })
}
export default function SignInPage() {
  const store = useStore()
  const file = useRef(null)
  const local = useLocalStore(() => ({
    loading: false
  }))
  const echartRef = useRef(null)
  useEffectOnce(() => {
    api.getTradeBalance().then((res) => {
      if (res.code === 0) {
        if (echartRef.current) {
          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            toolbox: {
              feature: {
                dataView: { show: true, readOnly: false },
                saveAsImage: { show: true }
              }
            },
            legend: {
              data: ['赢利情况']
            },
            xAxis: {
              type: 'category',
              name: '股票名称',
              axisPointer: {
                type: 'shadow'
              },
              data: res.data.map(item => item._id)
            },
            yAxis: {
              type: 'value',
              name: '赢利情况',
              axisLabel: {
                formatter: '{value}￥'
              }
            },
            series: [{
              data: res.data.map(item => {
                const total = parseFloat(item.total)
                return {
                  value: total,
                  itemStyle: { color: total >= 0 ? 'red' : 'green' }
                }
              }),
              type: 'bar'
            }]
          }
          const intance = echartRef.current.getEchartsInstance()
          intance.setOption(option, { notMerge: true })
        }
      }
    })
  })
  return <Observer>{() => (
    <Padding>
      <ReactECharts
        ref={e => echartRef.current = e}
        option={{
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [],
            type: 'bar'
          }]
        }}
        style={{ height: '600px', width: '100%' }}
        className='echarts-for-echarts'
        theme='my_theme' />
      <Upload ref={file} name="test" action={'/v1/public/test/upload'} headers={{}} onChange={info => {
        if (info.file.status === 'uploading') {
          local.loading = true
        }
        if (info.file.status === 'done' || info.file.status === 'error') {
          local.loading = false
        }
      }}>
        <Button loading={local.loading}>
          <UploadOutlined /> 上传
        </Button>
      </Upload>
      <div>
        Hello, World!
        {Object.keys(store.messages).map((key, i) => {
        const message = store.messages[key].stack
        if (message) {
          return <div key={i}>
            <Button onClick={() => {
              store.messages[key].clear()
            }}>clear</Button>
            <div>
              {message.length ? JSON.stringify(message[message.length - 1]) : key}
            </div>
          </div>
        }
        return <div key={i}>{key}</div>
      })}
      </div>
    </Padding>
  )}</Observer>
}