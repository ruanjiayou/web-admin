import io from 'socket.io-client';
import { notification, Modal } from 'antd'
import { events } from './events'

export const ws = io(`${window.location.protocol}//${window.location.host}`, {
  path: '/ws',
  reconnectionAttempts: 3
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
  if (data.action === 'download') {
    const links = data.data;
    let timer = setInterval(() => {
      if (links.length) {
        let a = document.createElement('a');
        let url = links.pop();
        console.log(url);
        a.href = url; a.download = new URL(url).pathname.split('/').pop();
        a.target = '_self'; a.click();
      } else {
        clearTimeout(timer);
      }
    }, 2100)
    return;
  }
  if (data.type === 'notify') {
    // module robot name uin action chat
    notification.info({ message: data.data.message, description: `from ${data.name}` })
  } else if (data.type === 'system') {
    events.emit(data.module === 'qqBot' ? 'qqSystem' : 'other', { uin: data.name, action: data.action })
  } else if (data.type === 'modal') {
    Modal.info({ title: data.action, content: 'from: ' + data.name + ' ' + data.message })
  }
})

ws.on('open', () => {
  console.log('open');
})
