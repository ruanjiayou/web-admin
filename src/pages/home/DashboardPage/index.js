import React, { useRef, useCallback } from 'react'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Padding, AlignAside } from '../../../component/style'
import { VisualBox, Icon } from '../../../component'
import ReactECharts from 'echarts-for-react';
import { useEffectOnce } from 'react-use'
import api from '../../../api'
import { notification } from 'antd';

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
  const store = useLocalStore(() => ({
    showKline: false,
    klineY: 0
  }))
  const echartRef = useRef(null)
  const stockRef = useRef(null)
  const klineRef = useRef(null)
  const loadKline = useCallback(async (stock, event) => {
    store.showKline = true
    if (klineRef.current) {
      store.klineY = event.offsetY
      const intance = klineRef.current.getEchartsInstance()
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
            const item = { total: 1000, amount: 1222, price: 11 };
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
          data: ["森马"]
        },
        yAxis: {
          type: 'value',
          name: '持有情况',
          axisLabel: {
            formatter: '{value}￥'
          }
        },
        series: [{
          data: [{ total: 1000 }].map(item => {
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
      intance.setOption(option, true);
    }
  })
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
              // barMaxWidth: 20,
              // barCategoryGap: 0,
              // barGap: 0,
              // barWidth: 1,
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
              barWidth: 30,
              type: 'bar'
            }]
          }
          const intance = stockRef.current.getEchartsInstance()
          intance.on('click', function (params) {
            const stockName = params.name;
            const stock = data.find(item => item._id === stockName)
            if (stock) {
              loadKline(stock, params.event)
            } else {
              notification.warn({ message: stockName + '' })
            }
          })
          intance.setOption(option, { notMerge: true })
        }
      }
    });
  })
  return <Observer>{() => (
    <Padding style={{ position: 'relative' }}>
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
      <div style={{ position: 'relative' }}>
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
        <VisualBox visible={store.showKline}>
          <div style={{ width: '100%', backgroundColor: 'wheat', position: 'absolute', left: 0, top: 0 }}>
            <AlignAside>
              <span>k线图</span>
              <Icon type="delete" onClick={() => {
                store.klineY = 0;
                store.showKline = false
              }} />
            </AlignAside>
            <ReactECharts
              ref={e => klineRef.current = e}
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
          </div>
        </VisualBox>
      </div>
    </Padding>
  )}</Observer>
}