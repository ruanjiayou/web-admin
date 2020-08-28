import apis from '../api'
import models from '../models'
import { createItemsLoader } from './BaseLoader'

export default createItemsLoader(models.resource, function (option) {
  console.log(option, 'fuck')
  return apis.getResources(option.query)
})