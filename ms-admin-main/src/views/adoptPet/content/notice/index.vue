<template>
    <div>
        <div class="page-title">
            平台公告
        </div>
        <div class="notice">
            <div class="notice-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="标题" prop="title">
                        <el-input size="mini" placeholder="请输入标题" v-model="queryForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="queryForm.status" placeholder="请选择" size="mini">
                            <el-option v-for="item in dict.type.anounce_status" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类别" prop="type">
                        <el-select v-model="queryForm.type" placeholder="请选择" size="mini">
                            <el-option v-for="item in dict.type.pet_annouce_type" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getNoticeList()">重置</el-button>
                    </el-form-item>
                </el-form>
                <div style="display: flex;">
                    <el-button size="mini" icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
                </div>
                <el-table :data="noticeList" style="width: 100%;" border>
                    <el-table-column prop="announceId" label="公告ID" align="center" width="100"></el-table-column>
                    <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip
                        width="300"></el-table-column>
                    <el-table-column prop="type" label="类别" align="center" width="100">
                        <template #default="{ row }">
                            <el-tag v-if="row.type == 0">通知</el-tag>
                            <el-tag v-if="row.type == 1" type="success">活动</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                    <el-table-column prop="expirationTime" label="过期时间" align="center">
                        <template #default="{ row }">
                            {{ row.expirationTime ? row.expirationTime : '/' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center" width="100">
                        <template #default="{ row }">
                            <el-tag v-if="row.status == 0" type="success">已发布</el-tag>
                            <el-tag v-if="row.status == 2" type="primary">草稿</el-tag>
                            <el-tag v-if="row.status == 1" type="warning">已过期</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template #default="{ row }">
                            <el-button type="text" @click="handleEdit(row)" size="mini">编辑</el-button>
                            <el-button type="text" @click="handleDel(row)" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="margin-top: 20px;" v-if="pagination">
                    <el-pagination background layout="total,prev,pager, next, sizes" :total="pagination.total"
                        :page-size="pagination.pageSize" :current-page.sync="pagination.pageNum"
                        @size-change="handleSizeChange" @current-change="getNoticeList">
                    </el-pagination>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import { query } from '@/utils/common';
import { delNotice, listNotice } from '../../../../api/petAdopt/notice';
export default {
    name: 'Notice',
    dicts: ["anounce_status", "pet_annouce_type"],
    data() {
        return {
            mode: "add",
            //租户列表
            noticeList: [],
            queryForm: {
                title: undefined,
                type: undefined,
                status: undefined,
            },
            // 分页
            pagination: {
                pageSize: 10,
                pageNum: 1,
                total: 0,
            },

        }
    },
    created() {
        this.getNoticeList()
    },
    methods: {
        //获取租户列表
        getNoticeList() {
            const query = this.queryForm || {}
            const { total, ...rest } = this.pagination
            listNotice({ ...rest, ...query }).then(res => {
                console.log(res);
                this.noticeList = res.rows
                this.pagination.total = res.total

            })
        },
        //查询
        handleQuery() {
            const hasInput = query(this.queryForm)
            if (!hasInput) return this.$message.warning("请输入数据!")
            this.pagination.pageNum = 1
            this.getNoticeList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getNoticeList()
        },
        //跳转至编辑/添加房间页面
        handleAdd() {
            this.mode = "add"
            this.$router.push("/content/editNotice");
        },
        //编辑
        handleEdit(row) {
            this.mode = "edit"
            this.$router.push({
                name: "EditNotice",
                params: {
                    mode: "edit",
                    id: row.announceId
                }
            })
        },
        //删除
        handleDel(row) {


            MessageBox.confirm(`是否删除[${row.title}]?`, "系统提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: 'warning',
            }).then((res) => {
                delNotice(row.announceId).then(res => {
                    this.$message.success("删除成功!")
                    if (this.pagination.total <= this.pagination.pageSize + 1) this.pagination.pageNum = 1
                    this.getNoticeList()
                })
            }).catch((err) => {
            });
        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.notice {
    padding: 20px;
    box-sizing: border-box;

    .notice-container {
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

    .el-textarea__inner {
        min-height: 200px !important;
    }

}
</style>