import request from '@/utils/request'

/**
 * 宠物每月领养数量(已领养)
 * @param {*} query 
 * @returns 
 */
export function monthAdoptNum(query) {
    return request({
        url: '/admin/data/pet/apply/every/month/num',
        method: 'get',
        params: query
    })
}

/**
 * 宠物类型占比
 * @param {*} query 
 * @returns 
 */
export function petTypeRadio() {
    return request({
        url: '/admin/data/pet/type/ratio',
        method: 'get',
    })
}
/**
 * 顶部栏数据
 * @param {*} query 
 * @returns 
 */
export function topData() {
    return request({
        url: '/admin/data/top',
        method: 'get',
    })
}
/**
 * 每月用户申请数(取消的不算)
 * @param {*} query 
 * @returns 
 */
export function monthApplyNum(query) {
    return request({
        url: '/admin/data/user/apply/every/month/num',
        method: 'get',
        params: query
    })
}
/**
 * 每月用户登录次数(登录成功)
 * @param {*} query 
 * @returns 
 */
export function monthLoginNum(query) {
    return request({
        url: '/admin/data/user/login/every/month/num',
        method: 'get',
        params: query
    })
}