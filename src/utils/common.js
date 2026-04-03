/**
 * 查询功能封装
 * @param {*} form 输入的数据
 * @returns some:至少有一项符合,返回true,否则false
 */
export function query(form) {
    return Object.values(form).some(value => {
        if (typeof value === 'string') return value.trim() !== ""
        return value !== undefined && value !== null

    })

}