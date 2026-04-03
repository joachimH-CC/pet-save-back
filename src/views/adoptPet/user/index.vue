<template>
    <div>
        <div class="page-title">
            用户管理
        </div>
        <div class="user">
            <div class="user-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="用户名称" prop="nickName">
                        <el-input size="mini" placeholder="请输入用户名称" v-model="queryForm.nickName"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phonenumber">
                        <el-input size="mini" placeholder="请输入用户手机号" v-model="queryForm.phonenumber"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getUserList()">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="userList" style="width: 100%;" border>
                    <!-- <el-table-column type="index" align="center" fixed="left"></el-table-column> -->
                    <el-table-column prop="userId" label="用户ID" align="center" width="100"></el-table-column>
                    <el-table-column prop="nickName" label="用户名称" align="center"></el-table-column>
                    <el-table-column prop="roleName" label="角色" align="center">
                        <template #default="{ row }">
                            <el-tag v-if="row.roleName == '普通角色'">{{ row.roleName }}</el-tag>
                            <el-tag v-if="row.roleName == '管理员'" type="warning">{{ row.roleName }}</el-tag>
                            <el-tag v-if="row.roleName == '救助者'" type="success">{{ row.roleName }}</el-tag>
                            <el-tag v-if="row.roleName == null" type="info">未知</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="phonenumber" label="手机号" align="center"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" label="注册时间" align="center"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column prop="status" label="账号状态" align="center" width="100">
                        <template #default="{ row }">
                            <el-switch v-model="row.status" active-value="0" inactive-value="1" active-color="#1890ff"
                                @change="handleStatusChange(row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template #default="{ row }">
                            <el-button type="text" @click="showDetail(row)" size="mini">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="margin-top: 20px;" v-if="pagination">
                    <el-pagination background layout="total,prev,pager, next, sizes" :total="pagination.total"
                        :page-size="pagination.pageSize" :current-page.sync="pagination.pageNum"
                        @size-change="handleSizeChange" @current-change="getUserList">
                    </el-pagination>
                </el-row>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog width="400px" :visible.sync="dialog.visible" title="用户详情">
            <el-descriptions :column="1" border>
                <el-descriptions-item label="用户ID">{{ dialog.form.userId }}</el-descriptions-item>
                <el-descriptions-item label="用户名">{{ dialog.form.nickName }}</el-descriptions-item>
                <el-descriptions-item label="角色">
                    <el-tag size="small">{{ dialog.form.roleName || '未知' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="性别">
                    <el-tag size="mini" v-if="dialog.form.sex == 0">男</el-tag>
                    <el-tag size="mini" v-if="dialog.form.sex == 1" type="danger">女</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="年龄">{{ dialog.form.age }}</el-descriptions-item>
                <el-descriptions-item label="身份证号码">{{ dialog.form.idNumber }}</el-descriptions-item>
                <el-descriptions-item label="手机号码">{{ dialog.form.phonenumber }}</el-descriptions-item>
                <el-descriptions-item label="注册时间">{{ dialog.form.createTime }}</el-descriptions-item>
                <el-descriptions-item label="最后登录">{{ dialog.form.loginDate }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                    <el-tag size="mini" v-if="dialog.form.status == 0">正常</el-tag>
                    <el-tag size="mini" v-if="dialog.form.status == 1" type="info">停用</el-tag>
                </el-descriptions-item>
            </el-descriptions>
            <el-row type="flex" justify="end" style="margin-top: 20px;">
                <el-button type="primary" @click="dialog.visible = false">关闭</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import { listPetUser, petUserDetail, changeUserStatus } from '@/api/petAdopt/user';
import { query } from '@/utils/common';
import { forceLogout, logoutList } from '../../../api/petAdopt/user';
export default {
    name: 'User',
    data() {
        return {
            //租户列表
            userList: [],
            queryForm: {
                nickName: undefined,
                phoneNumber: undefined
            },
            // 分页
            pagination: {
                pageSize: 10,
                pageNum: 1,
                total: 0,
            },
            //弹窗
            dialog: {
                visible: false,
                form: {
                    userId: undefined,
                    // userName: 'zs',
                    nickName: undefined,//用户昵称
                    roleName: undefined,
                    createTime: undefined,
                    idNumber: undefined,
                    loginDate: undefined,
                    phonenumber: undefined,
                    status: undefined,
                    sex: undefined,
                    age: undefined,
                },

            },
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        //获取用户列表
        getUserList() {
            const query = this.queryForm || {}
            const { total, ...rest } = this.pagination
            listPetUser({ ...rest, ...query }).then(res => {
                console.log(res);
                console.log(this.pagination);

                this.userList = res.rows
                this.pagination.total = res.total

            })
        },
        //查询
        handleQuery() {
            const hasInput = query(this.queryForm)
            if (!hasInput) return this.$message.warning("请输入数据!")
            this.pagination.pageNum = 1
            this.getUserList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getUserList()
        },
        //打开弹窗
        showDetail(row) {
            //this.dialog.form={...row}
            this.getUserDetail(row.userId)

        },
        getUserDetail(userId) {
            petUserDetail(userId).then(res => {
                console.log(res);
                this.dialog.form = { ...res.data }
                this.dialog.visible = true
            })
        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
        // 切换状态
        handleStatusChange(row) {
            const statusText = row.status == 0 ? '启用' : '禁用';
            const confirmMessage = `确定要${statusText}该用户账号吗？`;

            MessageBox.confirm(confirmMessage, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用接口切换状态
                changeUserStatus(row.userId).then(res => {
                    console.log(res);

                    if (res.code === 200) {
                        this.$message({ message: '账号状态切换成功', type: 'success' });
                        // 仅在禁用用户时执行登出（避免启用时注销会话）
                        // 这里 row.status 是更新后的值，由后端或切换逻辑设置
                        if (row.status == 1) {
                            // logoutList 可能返回数组或返回对象包含 data 数组。
                            logoutList({ userName: row.phonenumber }).then(r => {
                                const arr = r.rows || (r && r.data) || []
                                if (Array.isArray(arr) && arr.length) {
                                    // 为每个 tokenId 单独调用 forceLogout
                                    const logoutPromises = arr.map(item => {
                                        const tokenId = item && (item.tokenId || item.tokenid || item.token)
                                        return tokenId ? forceLogout(tokenId) : Promise.resolve()
                                    })
                                    return Promise.all(logoutPromises).catch(err => {
                                        console.error('forceLogout error:', err)
                                    })
                                }
                            }).catch(err => {
                                console.error('logoutList error:', err)
                            }).finally(() => {
                                this.getUserList()
                            })
                        } else {
                            // 启用用户：不需要调用登出接口，只刷新列表
                            this.getUserList()
                        }
                    } else {
                        row.status = row.status == 0 ? 1 : 0;
                        this.$message({ message: res.msg || '操作失败', type: 'error' });
                    }
                }).catch(error => {
                    // 请求失败，恢复原状态
                    row.status = row.status === 0 ? 1 : 0;
                });
            }).catch(() => {
                // 用户取消操作，恢复原状态
                this.getUserList()
                this.$message({ message: '已取消操作', type: 'info' });


            });
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.user {
    padding: 20px;
    box-sizing: border-box;

    .user-container {
        padding: 20px;
        background-color: white;

        .el-table {
            margin-top: 20px;
        }
    }

    .el-dialog__body {
        padding: 10px 70px 40px 30px !important;
    }

    .el-dialog__header {
        border-bottom: 1px solid #d1d2d2;
    }
}
</style>