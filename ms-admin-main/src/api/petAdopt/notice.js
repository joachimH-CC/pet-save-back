import request from '@/utils/request'

/**
 * 模糊分页查询公告列表
 * @param {*} query 
 * @returns 
 */
export function listNotice(query) {
    return request({
        url: '/msAnnounce/list',
        method: 'get',
        params: query
    })
}
/** 删除标签
 * @param {*} petId 
 * @returns 
 */
export function delNotice(announceId) {
    return request({
        url: `/msAnnounce/delete/${announceId}`,
        method: 'delete'
    })
}

/** 
 * 添加标签
 * @returns 
 */
export function addNotice(data) {
    return request({
        url: "/msAnnounce/add",
        method: 'post',
        data: data
    })
}
/**
 * 编辑标签
 * @param {*} query 
 * @returns 
 */
export function editNotice(data) {
    return request({
        url: '/msAnnounce/edit',
        method: 'put',
        data: data
    })
}
/**
 * 编辑时查看详情
 * @param {*} query 
 * @returns 
 */
export function detailNotice(announceId) {
    return request({
        url: `/msAnnounce/info/${announceId}`,
        method: 'get',
    })
}



