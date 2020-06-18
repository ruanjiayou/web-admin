import apis from '../api'
import models from '../models'
import { createItemsLoader } from './BaseLoader'

export default createItemsLoader(models.group, function () {
  return apis.getGroupTrees()
})