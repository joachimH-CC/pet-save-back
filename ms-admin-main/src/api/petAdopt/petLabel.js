import request from '@/utils/request'

/**
 * 模糊分页查询宠物标签列表
 * @param {*} query 
 * @returns 
 */
export function listPetLabel(query) {
    return request({
        url: '/admin/msPetLabel/list',
        method: 'get',
        params: query
    })
}
/** 删除标签
 * @param {*} petId 
 * @returns 
 */
export function delPetLabel(labelId) {
    return request({
        url: `/admin/msPetLabel/delete/${labelId}`,
        method: 'delete'
    })
}

/** 
 * 添加标签
 * @returns 
 */
export function addPetLabel(data) {
    return request({
        url: "/admin/msPetLabel/add",
        method: 'post',
        data: data
    })
}
/**
 * 编辑标签
 * @param {*} query 
 * @returns 
 */
export function editPetLabel(data) {
    return request({
        url: '/admin/msPetLabel/edit',
        method: 'put',
        data: data
    })
}



