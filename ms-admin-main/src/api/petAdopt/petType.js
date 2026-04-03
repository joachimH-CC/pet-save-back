import request from '@/utils/request'

/**
 * 模糊分页查询宠物类型列表
 * @param {*} query 
 * @returns 
 */
export function listPetType(query) {
    return request({
        url: '/admin/pet/type/list',
        method: 'get',
        params: query
    })
}
/** 删除分类
 * @param {*} petId 
 * @returns 
 */
export function delPetType(petTypeId) {
    return request({
        url: `/admin/pet/type/delete/${petTypeId}`,
        method: 'delete'
    })
}

/** 
 * 添加标签
 * @returns 
 */
export function addPetType(data) {
    return request({
        url: "/admin/pet/type/add",
        method: 'post',
        data: data
    })
}
/**
 * 编辑标签
 * @param {*} query 
 * @returns 
 */
export function editPetType(data) {
    return request({
        url: '/admin/pet/type/edit',
        method: 'put',
        data: data
    })
}



