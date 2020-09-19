import { types, getSnapshot } from 'mobx-state-tree'

export default types.model('Channel', {
  id: types.string,
  title: types.string,
  desc: types.string,
  enable: types.boolean,
  editable: types.boolean,
  order_index: types.number,
  isChannel: types.boolean,
  isRecommand: types.string,
  group_id: types.string,
})
