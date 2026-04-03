import request from '@/utils/request'

/**
 * 分页模糊查询用户疑问列表
 * @param {*} query 
 * @returns 
 */
export function listUserQuestion(query) {
    return request({
        url: '/admin/msFeedbackRecord/page',
        method: 'get',
        params: query
    })
}
/** 查询用户疑问详情
 * @param {*} petId 
 * @returns 
 */
export function detailQuestion(feedbackId) {
    return request({
        url: `/admin/msFeedbackRecord/${feedbackId}`,
        method: 'get'
    })
}

/** 
 * 回复用户疑问
 * @returns 
 */
export function responseQuestion(data) {
    return request({
        url: "/admin/msFeedbackRecord",
        method: 'post',
        data: data
    })
}
/**
 *删除已回复的记录
 * @param {*} query 
 * @returns 
 */
export function delResponse(feedbackRecordId) {
    return request({
        url: `/admin/msFeedbackRecord/${feedbackRecordId}`,
        method: 'delete',
    })
}



