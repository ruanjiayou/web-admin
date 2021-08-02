import shttp from '../utils/shttp'

export function getFiles({ param = '/' }) {
    return shttp({
        url: `/v1/admin/file${param}`,
        method: 'GET',
    })
}
// dirpath isdir name
export function createFile(data) {
    const { param, ...fileds } = data
    const form = new FormData()
    for (let k in fileds) {
        if (fileds[k] instanceof Array) {
            fileds[k].forEach(v => {
                form.append(k, v)
            })
        } else {
            form.append(k, fileds[k])
        }
    }
    return shttp({
        url: `/v1/admin/file${param}`,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8'
        },
        data: form,
    })
}

export function destroyFile({ param = '/', isDir = '0' }) {
    return shttp({
        url: `/v1/admin/file${param}?isDir=${isDir}`,
        method: 'DELETE',
    })
}

export function renameFile({ dirpath, oldname, newname }) {
    return shttp({
        url: `/v1/admin/file${dirpath}`,
        method: 'PUT',
        data: {
            oldname,
            newname,
        },
    })
}