import { types, getSnapshot } from 'mobx-state-tree'
import apis from '../api'

export default types.model('Channel', {
  id: types.string,
  title: types.string,
  desc: types.string,
  enable: types.boolean,
  editable: types.boolean,
  order_index: types.number,
  group_id: types.string,
})
