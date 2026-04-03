import request from '@/utils/request'

/**
 * 模糊分页查询领养列表
 * @param {*} query 
 * @returns 
 */
export function listPetApply(query) {
    return request({
        url: '/admin/apply/list',
        method: 'get',
        params: query
    })
}
/** 管理端查询领养详情
 * @param {*} petId 
 * @returns 
 */
export function petApplyDetail(applyId) {
    return request({
        url: `/admin/apply/info/${applyId}`,
        method: 'get'
    })
}
/** 查看领养审核流程
 * @param {*} applyId 
 * @returns 
 */
export function petApplyReview(applyId) {
    return request({
        url: `/msApply/pet/review/${applyId}`,
        method: 'get'
    })
}

