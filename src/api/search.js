import shttp from '../utils/shttp'

export function search(params) {
    return shttp({
        url: '/v1/search',
        method: 'GET',
        params,
    })
}
