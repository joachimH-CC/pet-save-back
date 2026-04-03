import request from '@/utils/request'

/**
 * 模糊分页查询评论列表
 * @param {*} query 
 * @returns 
 */
export function listComment(query) {
    return request({
        url: '/admin/comment/list',
        method: 'get',
        params: query
    })
}

/**
 * 修改评论状态
 * @param {*} query 
 * @returns 
 */
export function editComment(data) {
    return request({
        url: '/admin/comment/edit',
        method: 'put',
        data: data
    })
}
/**
 * 编辑时查看详情
 * @param {*} query 
 * @returns 
 */
export function detailComment(commentId) {
    return request({
        url: `/admin/comment/info/${commentId}`,
        method: 'get',
    })
}



