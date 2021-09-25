import React, { Fragment, useRef } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { useStore } from '../../../contexts'
import shttp from '../../../utils/shttp'
import { Padding } from '../../../component/style'
import ReactECharts from 'echarts-for-react';
import { useEffectOnce } from 'react-use'
import api from '../../../api'

// function testUpload(data) {
//   const form = new FormData()
//   for (let k in data) {
//     form.append(k, data[k])
//   }
//   return shttp({
//     url: `/v1/public/test/upload`,
//     method: 'POST',
//     headers: {
//       'Content-Type': 'multipart/form-data;charset=UTF-8'
//     },
//     data: form,
//   })
// }
export default function SignInPage() {
  // const store = useStore()
  // const file = useRef(null)
  // const local = useLocalStore(() => ({
  //   loading: false
  // }))
  const echartRef = useRef(null)
  const stockRef = useRef(null)
  useEffectOnce(() => {
    api.getTradeBalance().then((res) => {
      if (res.code === 0) {
        if (echartRef.current) {
          res.data = res.data.sort((a, b) => {
            return a.total - b.total
          })
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
            dataZoom: [
              {
                type: 'inside',
                xAxisIndex: [0],
                start: 1,
                end: 50
              }
            ],
            series: [{
              data: res.data.map(item => {
                const total = parseFloat(item.total)
                return {
                  value: total,
                  itemStyle: { color: total >= 0 ? '#d93025' : '#34a853' }
                }
              }),
              type: 'bar'
            }]
          }
          const intance = echartRef.current.getEchartsInstance()
          intance.setOption(option, { notMerge: true })
        }
      }
    });
    api.analyise().then((res) => {
      if (res.code === 0) {
        const data = [];
        for (let k in res.data.remain) {
          data.push(res.data.remain[k]);
        }
        const map = res.data.remain;
        data.sort((a, b) => a.total - b.total)
        if (stockRef.current) {
          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              },
              formatter: function (params) {
                const name = params[0].axisValue
                const item = map[name];
                return `价值: ${item.total}元<br>手数: ${item.amount / 100}<br>价格: ${item.price}元`
              }
            },
            legend: {
              data: ['持有情况'],
            },
            xAxis: {
              type: 'category',
              name: '股票名称',
              axisPointer: {
                type: 'shadow'
              },
              data: data.map(item => item._id)
            },
            yAxis: {
              type: 'value',
              name: '持有情况',
              axisLabel: {
                formatter: '{value}￥'
              }
            },
            series: [{
              data: data.map(item => {
                const total = parseFloat(item.total)
                return {
                  value: total,
                  itemStyle: {
                    color: total >= 0 ? '#d93025' : '#34a853'
                  }
                }
              }),
              type: 'bar'
            }]
          }
          const intance = stockRef.current.getEchartsInstance()
          intance.setOption(option, { notMerge: true })
        }
      }
    });
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
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 1,
              end: 50
            }
          ],
          series: [{
            data: [],
            type: 'bar'
          }]
        }}
        style={{ height: '400px', width: '100%' }}
        className='echarts-for-echarts'
        theme='my_theme' />
      <ReactECharts
        ref={e => stockRef.current = e}
        option={{
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              start: 1,
              end: 50
            }
          ],
          series: [{
            data: [],
            type: 'bar'
          }]
        }}
        style={{ height: '400px', width: '100%' }}
        className='echarts-for-echarts'
        theme='my_theme' />
    </Padding>
  )}</Observer>
}