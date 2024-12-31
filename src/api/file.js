import shttp from '../utils/shttp'

export function getFiles({ param = '/' }) {
    return shttp({
        url: `/v1/admin/file${param}`,
        method: 'GET',
    })
}
// dirpath isdir name
export function createFile(filepath, fields) {
    const form = new FormData()
    for (let k in fields) {
        if (fields[k] instanceof Array) {
            fields[k].forEach(v => {
                form.append(k, v)
            })
        } else {
            form.append(k, fields[k])
        }
    }
    return shttp({
        url: `/v1/admin/file${filepath}`,
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