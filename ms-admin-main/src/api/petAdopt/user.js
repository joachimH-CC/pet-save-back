import request from '@/utils/request'

/**
 * 查询用户列表
 * @param {*} query 
 * @returns 
 */
export function listPetUser(query) {
    return request({
        url: '/admin/msUser/list',
        method: 'get',
        params: query
    })
}

/**
 * 查看用户详情
 * @param {*} userId 
 * @returns 
 */
export function petUserDetail(userId) {
    return request({
        url: `/admin/msUser/info/${userId}`,
        method: 'get'
    })
}

/**
 * 修改用户状态
 * @param {*} userId 
 * @returns 
 */
export function changeUserStatus(userId) {
    return request({
        url: `/admin/msUser/status/${userId}`,
        method: 'put',
    })
}
/**
 * 管理员登录
 * @param {*} query 
 * @returns 
 */
export function petLogin(data) {
    return request({
        url: '/common/admin/login',
        method: 'post',
        headers: {
            isToken: false,
        },
        data: data
    })
}
//强退用户
export function forceLogout(tokenId) {
    return request({
        url: `/monitor/online/${tokenId}`,
        method: 'delete',
    })
}

//在线用户列表
export function logoutList(query) {
    return request({
        url: "/monitor/online/list",
        method: 'get',
        params: query
    })
}