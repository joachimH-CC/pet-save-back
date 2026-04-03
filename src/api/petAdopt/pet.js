import request from '@/utils/request'

/**
 * 查询宠物列表
 * @param {*} query 
 * @returns 
 */
export function listPet(query) {
    return request({
        url: '/admin/msPet/list',
        method: 'get',
        params: query
    })
}
/** 查看宠物详情
 * @param {*} petId 
 * @returns 
 */
export function petDetail(petId) {
    return request({
        url: `/admin/msPet/info/${petId}`,
        method: 'get'
    })
}

/** 查询宠物类型列表
 * @returns 
 */
export function petType() {
    return request({
        url: "/msPetType/pet/label",
        method: 'get'
    })
}
/**
 * 查询宠物性格-品种标签列表
 * @param {*} query 
 * @returns 
 */
export function petVariety(query) {
    return request({
        url: '/msLabel/pet/label',
        method: 'get',
        params: query
    })
}



