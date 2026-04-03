import request from '@/utils/request'

/**
 * 分页模糊查询知识管理列表
 * @param {*} query 
 * @returns 
 */
export function listLesson(query) {
    return request({
        url: '/admin/msKnowledge/class/list',
        method: 'get',
        params: query
    })
}
/** 删除知识课堂
 * @param {*} petId 
 * @returns 
 */
export function delLesson(knowledgeId) {
    return request({
        url: `/admin/msKnowledge/class/${knowledgeId}`,
        method: 'delete'
    })
}

/** 
 * 添加标签
 * @returns 
 */
export function addLesson(data) {
    return request({
        url: "/admin/msKnowledge/class",
        method: 'post',
        data: data
    })
}
/**
 * 编辑知识课堂
 * @param {*} query 
 * @returns 
 */
export function editLesson(data) {
    return request({
        url: '/admin/msKnowledge/class',
        method: 'put',
        data: data
    })
}
/**
 * 编辑知识课堂
 * @param {*} query 
 * @returns 
 */
export function detailLesson(knowledgeId) {
    return request({
        url: `/admin/msKnowledge/class/${knowledgeId}`,
        method: 'get',
    })
}




