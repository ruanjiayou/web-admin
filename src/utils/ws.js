import io from 'socket.io-client';
import store from '../store'
import Message from '../models/message'
import { notification, Modal } from 'antd'
import { events } from './events'

export const ws = io('/', {
  path: '/ws'
});

ws.on('connect', (socket) => {
  console.log('connected');
  ws.emit('message', '2049')
});

ws.on('disconnect', () => {
  console.log('disconnected');
});
ws.on('message', (data) => {
  const key = `${data.module}-${data.name}`;
  console.log(data, 'ws')
  if (data.type === 'notify') {
    // module robot name uin action chat
    notification.info({ message: data.data.message, description: `from ${data.name}` })
  } else if (data.type === 'system') {
    events.emit(data.module === 'qqBot' ? 'qqSystem' : 'other', { uin: data.name, action: data.action })
  } else if (data.type === 'modal') {
    Modal.info({ title: data.action, content: 'from: ' + data.name + ' ' + data.message })
  }
  if (store.messages[key]) {
    store.messages[key].push(data)
  } else {
    store.messages[key] = Message.create({ key, stack: [] })
  }
})

ws.on('open', () => {
  console.log('open');
})
