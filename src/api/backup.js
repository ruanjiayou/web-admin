import shttp from '../utils/shttp'

export function getCollections() {
  return shttp({
    url: '/v1/admin/backups-db/collections',
    method: 'GET',
  })
}

export function getBackups() {
  return shttp({
    url: '/v1/admin/backups-db',
    method: 'GET',
  })
}

export function createBackup(data) {
  return shttp({
    url: `/v1/admin/backups-db`,
    method: 'POST',
    data,
  })
}

export function destroyBackup(params) {
  return shttp({
    url: `/v1/admin/backups-db/${params.dir}`,
    method: 'DELETE',
  })
}

// 按文件夹回复数据库
export function recoveryByBackup(params) {
  return shttp({
    url: `/v1/admin/backups-db/${params.dir}`,
    method: 'POST'
  })
}

export function getTableBackups() {
  return shttp({
    url: '/v1/admin/backups-table',
    method: 'GET',
  })
}

export function createTableBackup(data) {
  return shttp({
    url: `/v1/admin/backups-table`,
    method: 'POST',
    data,
  })
}

export function destroyTableBackup(params) {
  return shttp({
    url: `/v1/admin/backups-table/${params.dir}`,
    method: 'DELETE',
  })
}
