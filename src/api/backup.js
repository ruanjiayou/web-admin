import shttp from '../utils/shttp'

export function getBackups() {
  return shttp({
    url: '/v1/admin/backups',
    method: 'GET',
  })
}

export function createBackup() {
  return shttp({
    url: `/v1/admin/backup`,
    method: 'POST',
  })
}

export function destroyBackup(params) {
  return shttp({
    url: `/v1/admin/backup/${params.dir}`,
    method: 'DELETE',
  })
}

// 同步本地备份到线上
export function syncBackup2prod(params) {
  return shttp({
    url: `/v1/admin/backup-upload/${params.dir}`,
    method: 'POST'
  })
}

// 下载备份zip 返回url title
export function downloadBackup2zip(params) {
  return shttp({
    url: `/v1/admin/backup-download/${params.dir}`,
    method: 'GET'
  })
}

// 按文件夹回复数据库
export function recoveryByBackup(params) {
  return shttp({
    url: `/v1/admin/backup-recovery/${params.dir}`,
    method: 'POST'
  })
}

export function zip2backup(params) {
  return shttp({
    url: `/v1/admin/backup-unzip/${params.dir}`,
    method: 'POST'
  })
}