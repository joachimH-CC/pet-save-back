import request from '@/utils/request'

/**
 * 分页模糊查询测试管理列表
 * @param {*} query 
 * @returns 
 */
export function listTest(query) {
    return request({
        url: '/admin/msKnowledge/test/list',
        method: 'get',
        params: query
    })
}

/** 
 * 新增测试
 * @returns 
 */
export function addTest(data) {
    return request({
        url: "/admin/msKnowledge/test",
        method: 'post',
        data: data
    })
}
/**
 * 修改测试
 * @param {*} query 
 * @returns 
 */
export function editTest(data) {
    return request({
        url: '/admin/msKnowledge/test',
        method: 'put',
        data: data
    })
}
/**
 * 查询测试管理详情
 * @param {*} query 
 * @returns 
 */
export function detailTest(knowledgeId) {
    return request({
        url: `/admin/msKnowledge/test/${knowledgeId}`,
        method: 'get',
    })
}
/** 删除知识课堂
 * @param {*} petId 
 * @returns 
 */
export function delTest(knowledgeId) {
    return request({
        url: `/admin/msKnowledge/test/${knowledgeId}`,
        method: 'post'
    })
}

